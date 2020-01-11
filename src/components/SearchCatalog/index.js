import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { debounce, get } from 'lodash';
import Album from '../Album';
import Song from '../Song';
import Artist from '../Artist';
import Loader from '../Loader';
import styles from './styles.scss';
import Playlist from '../Playlist';
import albumPropType from '../../prop_types/album';
import trackPropType from '../../prop_types/track';
import playlistPropType from '../../prop_types/playlist';
import artistPropType from '../../prop_types/artist';

function SongsView({ songs, onSongSelected }) {
  if (songs.length === 0) {
    return null;
  }
  return (
    <div className={styles.section}>
      <span className={styles.title}>Songs</span>
      {songs.map((song, index) => (
        <Song
          key={song.id}
          song={song}
          onSelected={() => onSongSelected(songs, index)}
        />
      ))}
    </div>
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
    <div className={styles.section}>
      <span className={styles.title}>Albums</span>
      <div className={styles.albums}>
        {albums.map((album) => (
          <Album key={album.id} album={album} onSelected={onAlbumSelected} />
        ))}
      </div>
    </div>
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
    <div className={styles.section}>
      <span className={styles.title}>Playlists</span>
      <div className={styles.playlists}>
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
            to={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
          >
            <Playlist playlist={playlist} />
          </Link>
        ))}
      </div>
    </div>
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
    <div className={styles.section}>
      <span className={styles.title}>Artists</span>
      <div className={styles.artists}>
        {artists.map((artist) => (
          <Link
            href={`/artist/${Buffer.from(artist.id).toString('base64')}`}
            to={`/artist/${Buffer.from(artist.id).toString('base64')}`}
          >
            <Artist key={artist.id} artist={artist} artwork />
          </Link>
        ))}
      </div>
    </div>
  );
}

ArtistsView.propTypes = {
  artists: PropTypes.arrayOf(artistPropType).isRequired,
};

function SearchCatalog({ location, onAlbumSelected, onSongSelected }) {
  const query = new URLSearchParams(location.search);

  const [input, setInput] = useState('');
  const [term, setTerm] = useState(query.get('term') || '');
  const [isSearching, setIsSearching] = useState(term !== null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [redirectTerm, setRedirectTerm] = useState(null);

  function onSuggestionSelected(event, { suggestion }) {
    setRedirectTerm(suggestion);
    setTerm(suggestion);
  }

  useEffect(
    debounce(() => {
      async function fetchSuggestions() {
        const hints = await window.MusicKitInstance.api.searchHints(input);
        setSuggestions(hints.terms);
      }
      fetchSuggestions();
    }, 300),
    [input],
  );

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
    <div className={styles.container}>
      {redirectTerm ? <Redirect to={`/search?term=${redirectTerm}`} /> : null}
      <form
        className={styles.search}
        onSubmit={(e) => {
          e.preventDefault();
          setRedirectTerm(term);
        }}
      >
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={() => {}}
          onSuggestionsClearRequested={() => setSuggestions([])}
          onSuggestionSelected={onSuggestionSelected}
          renderSuggestion={(text) => (
            <div className={styles.suggestion}>
              <span>{text}</span>
            </div>
          )}
          getSuggestionValue={(sug) => sug}
          inputProps={{
            value: input,
            onChange: (_, { newValue }) => setInput(newValue),
          }}
          theme={{
            container: styles.input,
            suggestionsList: styles['suggestions-list'],
          }}
        />
        <input type="submit" value="Search" />
      </form>
      {isSearching && <Loader />}
      {!isSearching && (
        <div className={styles.results}>
          <ArtistsView artists={artists} />
          <SongsView songs={songs} onSongSelected={onSongSelected} />
          <AlbumsView albums={albums} onAlbumSelected={onAlbumSelected} />
          <PlaylistsView playlists={playlists} />
        </div>
      )}
    </div>
  );
}

SearchCatalog.propTypes = {
  location: PropTypes.object.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default SearchCatalog;
