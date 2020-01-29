import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import styled from 'styled-components';
import Album from '../components/Album';
import Song from '../components/Song';
import Artist from '../components/Artist';
import Loader from '../components/Loader';
import Playlist from '../components/Playlist';
import albumPropType from '../prop_types/album';
import trackPropType from '../prop_types/track';
import playlistPropType from '../prop_types/playlist';
import artistPropType from '../prop_types/artist';
import LargeTitle from '../components/ui/LargeTitle';
import AlbumGrid from '../components/ui/AlbumGrid';
import { playSong, playAlbum } from '../util/play';

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: auto 1fr;
  grid-row-gap: 8px;
  height: 100%;
`;

const Section = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 8px;
`;

const ResultsWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 8px;
  overflow-y: scroll;
`;

const ArtistsList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 8px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

function SongsView({ songs, onSongSelected }) {
  if (songs.length === 0) {
    return null;
  }
  return (
    <Section>
      <LargeTitle> Songs</LargeTitle>
      {songs.map((song, index) => (
        <Song
          key={song.id}
          song={song}
          onSelected={() => onSongSelected(songs, index)}
        />
      ))}
    </Section>
  );
}

SongsView.propTypes = {
  songs: PropTypes.arrayOf(trackPropType).isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

function AlbumsView({ albums, onAlbumSelected }) {
  if (albums.length === 0) {
    return null;
  }
  return (
    <Section>
      <LargeTitle>Albums</LargeTitle>
      <AlbumGrid>
        {albums.map((album) => (
          <Album key={album.id} album={album} onSelected={onAlbumSelected} />
        ))}
      </AlbumGrid>
    </Section>
  );
}

AlbumsView.propTypes = {
  albums: PropTypes.arrayOf(albumPropType).isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
};

function PlaylistsView({ playlists }) {
  if (playlists.length === 0) {
    return null;
  }
  return (
    <Section>
      <LargeTitle>Playlists</LargeTitle>
      <AlbumGrid>
        {playlists.map((playlist) => (
          <StyledLink
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            to={`/playlist/${playlist.id}`}
          >
            <Playlist playlist={playlist} />
          </StyledLink>
        ))}
      </AlbumGrid>
    </Section>
  );
}

PlaylistsView.propTypes = {
  playlists: PropTypes.arrayOf(playlistPropType).isRequired,
};

function ArtistsView({ artists }) {
  if (artists.length === 0) {
    return null;
  }
  return (
    <Section>
      <LargeTitle>Artists</LargeTitle>
      <ArtistsList>
        {artists.map((artist) => (
          <StyledLink
            key={artist.id}
            href={`/artist/${artist.id}`}
            to={`/artist/${artist.id}`}
          >
            <Artist artist={artist} artwork />
          </StyledLink>
        ))}
      </ArtistsList>
    </Section>
  );
}

ArtistsView.propTypes = {
  artists: PropTypes.arrayOf(artistPropType).isRequired,
};

function SearchCatalog({ location }) {
  const { term } = location.state;

  const [isSearching, setIsSearching] = useState(term !== null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function search() {
      setIsSearching(true);

      const {
        songs: s,
        albums: ab,
        artists: at,
        playlists: p,
      } = await window.MusicKitInstance.api.search(term);

      setIsSearching(false);
      setSongs(get(s, 'data', []));
      setAlbums(get(ab, 'data', []));
      setArtists(get(at, 'data', []));
      setPlaylists(get(p, 'data', []));
    }
    search();
  }, [term]);

  return (
    <Wrapper>
      {isSearching && <Loader />}
      {!isSearching && (
        <ResultsWrapper>
          <ArtistsView artists={artists} />
          <SongsView songs={songs} onSongSelected={playSong} />
          <AlbumsView albums={albums} onAlbumSelected={playAlbum} />
          <PlaylistsView playlists={playlists} />
        </ResultsWrapper>
      )}
    </Wrapper>
  );
}

SearchCatalog.propTypes = {
  location: PropTypes.object.isRequired,
};

export default SearchCatalog;
