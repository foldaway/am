import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Album from '../Album';
import Loader from '../Loader';
import Song from '../Song';
import Modal from '../Modal';
import Playlist from '../Playlist';

import { imgURLGen, srcSetGen } from '../../util/img';
import fetchArtistImage from '../../util/fetch-artist-img';
import MusicVideo from '../MusicVideo';
import LargeTitle from '../large-title';
import AlbumGrid from '../album-grid';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto auto auto auto auto;
  grid-template-areas:
    "banner banner"
    "latest-release top-songs"
    "albums albums"
    "music-videos music-videos"
    "playlists playlists";
  grid-row-gap: 10px;

  ${LargeTitle} {
    font-size: 1em;
  }
`;

const Banner = styled.div`
  grid-area: banner;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "banner";
  height: 20%;

  ${LargeTitle} {
    grid-area: banner;
    align-self: end;
    margin: 0 0 10px 10px;
  }
`;

const ImageContainer = styled.div`
  grid-area: banner;
  width: 100%;
  background-color: ${(props) => props.theme.background.primary};
  padding: 20px 0;
`;

const ArtistProfileImage = styled.img`
  display: block;
  margin: auto;
  height: 200px;
  width: 200px;
  border-radius: 50%;
`;

const LatestReleaseContainer = styled.div`
  grid-area: latest-release;
`;

const TopSongsContainer = styled.div`
  grid-area: top-songs;
  overflow: hidden;
`;

const Songs = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: auto auto auto;
  grid-template-columns: repeat(500, 400px);
  overflow-x: auto;
  overflow-y: hidden;
  grid-row-gap: 8px;
  grid-column-gap: 5px;
`;

const MusicVideosContainer = styled.div`
  grid-area: music-videos;
  overflow-x: scroll;
  overflow-y: hidden;
`;

const MusicVideoGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 8px;
  grid-template-columns: repeat(200, minmax(300px, 400px));
`;

const AlbumsContainer = styled.div`
  grid-area: albums;
`;

const PlaylistContainer = styled.div`
  grid-area: playlists;
`;

const CurrentMusicVideo = styled.div`
  display: grid;
  grid-template-areas:
    "title title"
    "metadata video";
  grid-template-columns: 1fr 4fr;
  grid-column-gap: 10px;

  ${LargeTitle} {
    grid-area: title;
  }

  video {
    grid-area: video;
    justify-self: stretch;
    background-color: black;
  }
`;

const MetadataLink = styled.a`
  grid-area: metadata;
`;

function ArtistPage({ match, onAlbumSelected, onSongSelected }) {
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [musicVideos, setMusicVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [currentMusicVideo, setCurrentMusicVideo] = useState(null);
  const [bannerURL, setBannerURL] = useState(null);

  useEffect(() => {
    if (match.params.artistID === null) {
      return;
    }
    const artistID = Buffer.from(match.params.artistID, 'base64').toString(
      'ascii',
    );

    async function fetchArtistData() {
      const artistResult = await window.MusicKitInstance.api.artist(artistID);
      setArtist(artistResult);
      setAlbums(
        await window.MusicKitInstance.api.collection(
          'catalog',
          `artists/${artistID}/albums`,
        ),
      );
      setSongs(
        await window.MusicKitInstance.api.collection(
          'catalog',
          `artists/${artistID}/songs`,
        ),
      );
      setMusicVideos(
        await window.MusicKitInstance.api.collection(
          'catalog',
          `artists/${artistID}/music-videos`,
        ),
      );
      try {
        const playlistResults = await window.MusicKitInstance.api.collection(
          'catalog',
          `artists/${artistID}/playlists`,
        );
        setPlaylists(playlistResults);
      } catch (e) {
        console.log(e);
        // No playlists
      }
      // Sort albums by latest first
      albums.sort(
        (a, b) => new Date(b.attributes.releaseDate)
          - new Date(a.attributes.releaseDate),
      );

      setBannerURL(await fetchArtistImage(artistResult.attributes.url));
    }

    fetchArtistData();
  }, [match.params.artistID]);

  if (artist === null) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Banner>
        {bannerURL !== null ? (
          <ImageContainer>
            <ArtistProfileImage
              src={imgURLGen(bannerURL, { w: 75 })}
              srcSet={srcSetGen(bannerURL)}
              alt="artist artwork"
            />
          </ImageContainer>
        ) : (
          <Loader />
        )}
        <LargeTitle>{artist.attributes.name}</LargeTitle>
      </Banner>
      <LatestReleaseContainer>
        <LargeTitle>Latest Release</LargeTitle>
        {albums && albums.length > 0 ? (
          <AlbumGrid>
            <Album album={albums[0]} onSelected={onAlbumSelected} />
          </AlbumGrid>
        ) : null}
      </LatestReleaseContainer>
      <TopSongsContainer>
        <LargeTitle>Top Songs</LargeTitle>
        <Songs>
          {songs.map((song, index) => (
            <Song
              key={song.id}
              song={song}
              onSelected={() => onSongSelected(songs, index)}
            />
          ))}
        </Songs>
      </TopSongsContainer>
      <AlbumsContainer>
        <LargeTitle>Albums</LargeTitle>
        <AlbumGrid>
          {albums.slice(1).map((album) => (
            <Album key={album.id} album={album} onSelected={onAlbumSelected} />
          ))}
        </AlbumGrid>
      </AlbumsContainer>
      <MusicVideosContainer>
        <LargeTitle>Music Videos</LargeTitle>
        <MusicVideoGrid>
          {musicVideos.map((musicVideo) => (
            <MusicVideo
              musicVideo={musicVideo}
              onSelected={() => setCurrentMusicVideo(musicVideo)}
            />
          ))}
        </MusicVideoGrid>
      </MusicVideosContainer>
      <PlaylistContainer>
        <LargeTitle>Playlists</LargeTitle>
        <AlbumGrid>
          {playlists.map((playlist) => (
            <Link
              href={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
              to={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
            >
              <Playlist playlist={playlist} />
            </Link>
          ))}
        </AlbumGrid>
      </PlaylistContainer>
      {currentMusicVideo ? (
        <Modal onClose={() => setCurrentMusicVideo(null)}>
          <CurrentMusicVideo>
            <LargeTitle>Music Video Preview</LargeTitle>
            <video controls autoPlay>
              <source src={currentMusicVideo.attributes.previews[0].hlsUrl} />
              <source src={currentMusicVideo.attributes.previews[0].url} />
              Your browser cannot play this video
            </video>
            <MetadataLink
              href={currentMusicVideo.attributes.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MusicVideo musicVideo={currentMusicVideo} />
            </MetadataLink>
          </CurrentMusicVideo>
        </Modal>
      ) : null}
    </Wrapper>
  );
}

ArtistPage.propTypes = {
  match: PropTypes.object.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default ArtistPage;
