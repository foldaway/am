import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';
import Loader from '../Loader';
import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function SongLibrary({ onSongSelected }) {
  const [songs, setSongs] = useState([]);

  function getSongElements() {
    const elements = [];
    let temp = '';

    songs.forEach((song, index) => {
      const firstArtistNameLetter = song.attributes.artistName[0];
      if (temp !== firstArtistNameLetter) {
        elements.push(
          <span key={firstArtistNameLetter} className={styles['group-title']}>
            {firstArtistNameLetter}
          </span>,
        );
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
    <div className={styles.container}>
      <span className={styles.title}>Songs</span>
      {songs.length > 0 ? getSongElements() : <Loader />}
    </div>
  );
}

SongLibrary.propTypes = {
  onSongSelected: PropTypes.func.isRequired,
};

export default SongLibrary;
