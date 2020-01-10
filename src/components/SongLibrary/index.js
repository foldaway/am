import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Song from '../Song';
import Loader from '../Loader';
import LargeTitle from '../large-title';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: auto 1fr;
  grid-row-gap: 8px;
  height: 100%;
`;

const GroupTitle = styled.span`
  font-size: 0.8em;
  font-weight: 700;
  color: ${(props) => props.theme.text.tertiary};
`;

function SongLibrary({ onSongSelected }) {
  const [songs, setSongs] = useState([]);

  function getSongElements() {
    const elements = [];
    let temp = '';

    songs.forEach((song, index) => {
      const firstArtistNameLetter = song.attributes.artistName[0];
      if (temp !== firstArtistNameLetter) {
        elements.push(<GroupTitle>{firstArtistNameLetter}</GroupTitle>);
      }
      temp = firstArtistNameLetter;

      elements.push(
        <Song
          key={song.id}
          song={song}
          onSelected={() => onSongSelected(songs, index)}
        />,
      );
    });

    return elements;
  }
  useEffect(() => {
    async function load() {
      const sortFunc = (a, b) => {
        const aa = a.attributes;
        const ba = b.attributes;

        const aan = aa.albumName || '';
        const ban = ba.albumName || '';

        return (
          aa.artistName.localeCompare(ba.artistName)
          || aan.localeCompare(ban)
          || aa.trackNumber - ba.trackNumber
          || aa.name.localeCompare(ba.name)
        );
      };

      const results = [];
      let temp = [];
      do {
        temp = await window.MusicKitInstance.api.library.songs(null, {
          limit: 100,
          offset: results.length,
        });

        results.push(...temp);

        await sleep(2);
      } while (temp.length > 0);

      songs.sort(sortFunc);
      setSongs(results);
    }
    load();
  }, []);
  return (
    <Wrapper>
      <LargeTitle>Songs</LargeTitle>
      {songs.length > 0 ? getSongElements() : <Loader />}
    </Wrapper>
  );
}

SongLibrary.propTypes = {
  onSongSelected: PropTypes.func.isRequired,
};

export default SongLibrary;
