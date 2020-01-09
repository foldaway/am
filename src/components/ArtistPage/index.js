import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Album from '../Album';
import Loader from '../Loader';
import Song from '../Song';
import Modal from '../Modal';
import Playlist from '../Playlist';

import { imgURLGen, srcSetGen } from '../../util/img';
import fetchArtistImage from '../../util/fetch-artist-img';
import MusicVideo from '../MusicVideo';

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
    <div className={styles.container}>
      <div className={styles.banner}>
        {bannerURL !== null ? (
          <div className={styles['image-container']}>
            <img
              className={styles.art}
              src={imgURLGen(bannerURL, { w: 75 })}
              srcSet={srcSetGen(bannerURL)}
              alt="artist artwork"
            />
          </div>
        ) : (
          <Loader />
        )}
        <span className={styles.title}>{artist.attributes.name}</span>
      </div>
      <div className={styles['latest-release-container']}>
        <span className={styles.title}>Latest Release</span>
        {albums && albums.length > 0 ? (
          <div className={styles['latest-release']}>
            <Album album={albums[0]} onSelected={onAlbumSelected} />
          </div>
        ) : null}
      </div>
      <div className={styles['top-songs-container']}>
        <span className={styles.title}>Top Songs</span>
        <div className={styles.songs}>
          {songs.map((song, index) => (
            <Song
              key={song.id}
              song={song}
              onSelected={() => onSongSelected(songs, index)}
            />
          ))}
        </div>
      </div>
      <div className={styles['albums-container']}>
        <span className={styles.title}>Albums</span>
        <div className={styles.albums}>
          {albums.slice(1).map((album) => (
            <Album key={album.id} album={album} onSelected={onAlbumSelected} />
          ))}
        </div>
      </div>
      <div className={styles['music-videos-container']}>
        <span className={styles.title}>Music Videos</span>
        <div className={styles['music-videos']}>
          {musicVideos.map((musicVideo) => (
            <MusicVideo
              musicVideo={musicVideo}
              onSelected={() => setCurrentMusicVideo(musicVideo)}
            />
          ))}
        </div>
      </div>
      <div className={styles['playlists-container']}>
        <span className={styles.title}>Playlists</span>
        <div className={styles.playlists}>
          {playlists.map((playlist) => (
            <Link
              href={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
              to={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
            >
              <Playlist playlist={playlist} />
            </Link>
          ))}
        </div>
      </div>
      {currentMusicVideo ? (
        <Modal onClose={() => setCurrentMusicVideo(null)}>
          <div className={styles['current-music-video']}>
            <span className={styles.title}>Music Video Preview</span>
            <video controls autoPlay>
              <source src={currentMusicVideo.attributes.previews[0].hlsUrl} />
              <source src={currentMusicVideo.attributes.previews[0].url} />
              Your browser cannot play this video
            </video>
            <a
              className={styles.metadata}
              href={currentMusicVideo.attributes.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MusicVideo musicVideo={currentMusicVideo} />
            </a>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

ArtistPage.propTypes = {
  match: PropTypes.object.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default ArtistPage;
