import React, { useState, useEffect } from 'react';
import { sumBy } from 'lodash';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import Song from '../../components/Song';
import Loader from '../../components/Loader';

import LargeTitle from '../../components/ui/LargeTitle';
import { playPlaylist } from '../../util/play';
import Button from '../../components/ui/Button';
import SquareImage from '../../components/ui/SquareImage';

/* eslint-disable no-await-in-loop */

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    "art songs"
    "title songs"
    "description songs"
    "metadata songs"
    "controls songs";
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto auto auto auto 1fr;
  column-gap: 10px;
  row-gap: 10px;
  overflow: hidden;
  height: 100%;
`;

const Title = styled(LargeTitle)`
  grid-area: title;
`;

const Metadata = styled.span`
  grid-area: metadata;
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.9em;
`;

const Description = styled.span`
  grid-area: description;
  font-size: 0.9em;
  font-weight: 400;
  line-height: 130%;

  color: ${(props) => props.theme.text.secondary};
`;

const StyledSong = styled(Song)`
  flex-basis: 28%;
  margin-right: 48px;
  margin-bottom: 16px;
`;

const Songs = styled.div`
  grid-area: songs;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
  overflow-y: scroll;
`;

const Controls = styled.div`
  grid-area: controls;
  display: flex;
  align-items: flex-start;

  ${Button} {
    margin-right: 10px;
  }
`;

function PlaylistLibrary({ match, isLibrary }) {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const { playlistID } = match.params;

  useEffect(() => {
    async function loadPlaylistMetadata() {
      setPlaylist(null);
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
  const description = 'description' in attributes ? attributes.description.standard : '';
  const totalDuration = sumBy(songs, (song) => song.attributes.durationInMillis);
  const { hours, minutes } = window.MusicKit.formattedMilliseconds(
    totalDuration,
  );
  return (
    <Wrapper>
      <SquareImage
        artwork={attributes.artwork}
        alt="Playlist artwork"
        shadow={false}
        roundedCorners={false}
      />
      <Title>{attributes.name}</Title>
      <Metadata>
        {songs.length}
        &nbsp;song
        {songs.length > 1 && 's'}
        <br />
        {hours}
        &nbsp;hour
        {hours > 1 && 's'}
        &nbsp;
        {minutes}
        &nbsp;minutes
      </Metadata>
      <Description>{description}</Description>
      <Controls>
        <Button onClick={() => playPlaylist(playlist, 0)}>Play</Button>
        <Button
          onClick={() => {
            playPlaylist(playlist, 0, true);
          }}
        >
          Shuffle
        </Button>
      </Controls>
      <Songs>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <StyledSong
              key={song.id}
              song={song}
              onClick={() => playPlaylist(playlist, index)}
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
};

export default PlaylistLibrary;
