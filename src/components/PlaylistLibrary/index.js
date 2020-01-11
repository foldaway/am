import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { imgURLGen, srcSetGen } from '../../util/img';

import Song from '../Song';
import Loader from '../Loader';

import LargeTitle from '../large-title';

/* eslint-disable no-await-in-loop */

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    "art title"
    "art metadata"
    "description description"
    "songs songs";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto 1fr;
  grid-column-gap: 10px;
  overflow: hidden;
  height: 100%;
`;

const Art = styled.div`
  grid-area: art;
  width: 100px;
  height: 100px;
`;

const Title = styled(LargeTitle)`
  grid-area: title;
`;

const Metadata = styled.span`
  grid-area: metadata;
  color: ${(props) => props.theme.text.tertiary};
  font-size: 0.9em;
`;

const Description = styled.span`
  grid-area: description;
  font-size: 0.8em;
  font-weight: 300;

  color: ${(props) => props.theme.text.tertiary};
`;

const Songs = styled.div`
  grid-area: songs;
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 8px;
  overflow-y: scroll;
  align-items: self-start;
`;

function PlaylistLibrary({ match, isLibrary, onSongSelected }) {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    async function loadPlaylistMetadata() {
      setPlaylist(null);
      const playlistID = Buffer.from(
        match.params.playlistID,
        'base64',
      ).toString('ascii');
      const requestAPI = isLibrary
        ? window.MusicKitInstance.api.library
        : window.MusicKitInstance.api;
      setPlaylist(await requestAPI.playlist(playlistID));
    }
    loadPlaylistMetadata();
  }, [match]);

  useEffect(() => {
    async function loadTracks() {
      let prevLength = 0;
      let offset = 0;

      setSongs([]);
      const playlistID = Buffer.from(
        match.params.playlistID,
        'base64',
      ).toString('ascii');

      if (isLibrary) {
        do {
          let temp;
          try {
            temp = await window.MusicKitInstance.api.library.request(
              `me/library/playlists/${playlistID}/tracks`,
              {
                offset,
                include: ['curator'],
              },
            );
          } catch (e) {
            // MusicKit JS throws exception from server 404 when offset > playlist total songs
            temp = [];
          }
          prevLength = temp.length;
          offset += temp.length;

          setSongs((prevState) => [...prevState, ...temp]);
        } while (prevLength > 0);
      } else {
        const { relationships } = await window.MusicKitInstance.api.playlist(
          playlistID,
        );
        setSongs(relationships.tracks.data);
      }
    }

    loadTracks();
  }, [match]);

  if (playlist === null) {
    return <Loader />;
  }
  const { attributes } = playlist;
  const artworkURL = attributes.artwork ? attributes.artwork.url : '';
  const description = 'description' in attributes ? attributes.description.standard : '';
  return (
    <Wrapper>
      <Art
        src={imgURLGen(artworkURL, { w: 75 })}
        srcSet={srcSetGen(artworkURL)}
        alt="Playlist artwork"
      />
      <Title>{attributes.name}</Title>
      <Metadata>
        {songs.length}
        {' '}
songs
      </Metadata>
      <Description>{description}</Description>
      <Songs>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <Song
              key={song.id}
              song={song}
              onSelected={() => onSongSelected(playlist, index)}
            />
          ))
        ) : (
          <Loader />
        )}
      </Songs>
    </Wrapper>
  );
}

PlaylistLibrary.propTypes = {
  isLibrary: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default PlaylistLibrary;
