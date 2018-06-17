import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';
import Loader from '../Loader';
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
    this.getSongElements = this.getSongElements.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getSongElements() {
    const elements = [];
    let temp = '';

    this.state.songs.forEach((song, index) => {
      const firstArtistNameLetter = song.attributes.artistName[0];
      if (temp !== firstArtistNameLetter) {
        elements.push(<span key={firstArtistNameLetter} className={styles['group-title']}>{firstArtistNameLetter}</span>);
      }
      temp = firstArtistNameLetter;

      elements.push((
        <Song
          key={song.id}
          song={song}
          onSelected={() => this.props.onSongSelected(this.state.songs, index)}
        />
      ));
    });

    return elements;
  }

  async load() {
    const sortFunc = (a, b) => {
      const aa = a.attributes;
      const ba = b.attributes;

      const aan = aa.albumName || '';
      const ban = ba.albumName || '';

      return aa.artistName.localeCompare(ba.artistName) ||
        aan.localeCompare(ban) ||
        aa.name.localeCompare(ba.name);
    };

    const songs = [];
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.songs(null, {
        limit: 100,
        offset: songs.length,
      });

      if (!this.mounted) {
        break;
      }

      songs.push(...temp);

      await sleep(2);
    } while (temp.length > 0);

    songs.sort(sortFunc);

    this.setState({
      songs,
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <span className={styles.title}>Songs</span>
        {
          this.state.songs.length > 0 ? this.getSongElements() : <Loader />
        }
      </div>
    );
  }
}

SongLibrary.propTypes = {
  onSongSelected: PropTypes.func.isRequired,
};

export default SongLibrary;
