import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';
import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

class SongLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
    };

    this.load = this.load.bind(this);
    this.load();
  }

  async load() {
    const songs = [];
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.songs(null, {
        limit: 100,
        offset: songs.length,
      });
      songs.push(...temp);

      await sleep(10);
    } while (temp.length > 0);

    songs.sort((a, b) => {
      const aa = a.attributes;
      const ba = b.attributes;

      const aan = aa.albumName || '';
      const ban = ba.albumName || '';

      return aa.artistName.localeCompare(ba.artistName) ||
        aan.localeCompare(ban) ||
        aa.name.localeCompare(ba.name);
    });

    this.setState({ songs });
  }

  render() {
    return (
      <div className={styles.container}>
        {
          this.state.songs.map((song) => (
            <Song song={song} onSelected={this.props.onSongSelected} />
          ))
        }
      </div>
    );
  }
}

SongLibrary.propTypes = {
  onSongSelected: PropTypes.func.isRequired,
};

export default SongLibrary;
