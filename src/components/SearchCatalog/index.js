import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { debounce, get } from 'lodash';
import styled, { css } from 'styled-components';
import Album from '../Album';
import Song from '../Song';
import Artist from '../Artist';
import Loader from '../Loader';
import Playlist from '../Playlist';
import albumPropType from '../../prop_types/album';
import trackPropType from '../../prop_types/track';
import playlistPropType from '../../prop_types/playlist';
import artistPropType from '../../prop_types/artist';
import LargeTitle from '../large-title';
import AlbumGrid from '../album-grid';

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

const SuggestionsList = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 2px;
  padding: 2px 0 2px 0;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Suggestion = styled.span`
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.9em;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  ${(props) => (props.isHighlighted
    ? css`
          background: ${props.theme.background.primary};
        `
    : null)}
`;

const SearchContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-areas:
    "input search"
    "input nothing";
  grid-template-columns: 5fr auto;
  grid-template-rows: auto 1fr;
`;

const SearchInput = styled.input`
  grid-area: input;

  input[type="text"] {
    width: 100%;
    box-sizing: border-box;
  }
`;

const SearchSubmit = styled.input`
  grid-area: search;
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
          <Link
            key={playlist.id}
            href={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
            to={`/playlist/${Buffer.from(playlist.id).toString('base64')}`}
          >
            <Playlist playlist={playlist} />
          </Link>
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
          <Link
            key={artist.id}
            href={`/artist/${Buffer.from(artist.id).toString('base64')}`}
            to={`/artist/${Buffer.from(artist.id).toString('base64')}`}
          >
            <Artist artist={artist} artwork />
          </Link>
        ))}
      </ArtistsList>
    </Section>
  );
}

ArtistsView.propTypes = {
  artists: PropTypes.arrayOf(artistPropType).isRequired,
};

function SearchCatalog({ location, onAlbumSelected, onSongSelected }) {
  const query = new URLSearchParams(location.search);

  const [term, setTerm] = useState(query.get('term') || '');
  const [input, setInput] = useState(term);
  const [isSearching, setIsSearching] = useState(term !== null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
    <Wrapper>
      <Redirect to={`/search?term=${term}`} />
      <SearchContainer>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={() => {}}
          onSuggestionsClearRequested={() => setSuggestions([])}
          onSuggestionSelected={(_, { suggestion }) => setTerm(suggestion)}
          getSuggestionValue={(sug) => sug}
          inputProps={{
            value: input,
            onChange: (_, { newValue }) => setInput(newValue),
          }}
          renderSuggestion={(suggestion, { isHighlighted }) => (
            <Suggestion isHighlighted={isHighlighted}>{suggestion}</Suggestion>
          )}
          renderInputComponent={(props) => (
            <SearchInput
              {...props}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setTerm(input);
                  setSuggestions([]);
                } else {
                  // Propagate the event to react-autosuggest
                  props.onKeyDown(e);
                }
              }}
            />
          )}
          renderSuggestionsContainer={({ containerProps, children }) => (
            <SuggestionsList {...containerProps}>{children}</SuggestionsList>
          )}
          theme={{}}
        />
        <SearchSubmit type="submit" value="Search" />
      </SearchContainer>
      {isSearching && <Loader />}
      {!isSearching && (
        <ResultsWrapper>
          <ArtistsView artists={artists} />
          <SongsView songs={songs} onSongSelected={onSongSelected} />
          <AlbumsView albums={albums} onAlbumSelected={onAlbumSelected} />
          <PlaylistsView playlists={playlists} />
        </ResultsWrapper>
      )}
    </Wrapper>
  );
}

SearchCatalog.propTypes = {
  location: PropTypes.object.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default SearchCatalog;
