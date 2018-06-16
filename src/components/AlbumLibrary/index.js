import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

class AlbumLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
    };

    this.load = this.load.bind(this);
    this.load();
  }

  async load() {
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.albums(null, {
        limit: 100,
        offset: this.state.albums.length,
      });

      this.setState({
        albums: [...this.state.albums, ...temp],
      });

      await sleep(10);
    } while (temp.length > 0);
  }

  render() {
    return (
      <div className={styles.container}>
        {
          this.state.albums.map((album) => (
            <Album key={album.id} album={album} onSelected={this.props.onAlbumSelected} />
          ))
        }
      </div>
    );
  }
}

AlbumLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default AlbumLibrary;
