import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

class Library extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
    };

    this.load = this.load.bind(this);
    this.load();
  }

  async load() {
    const albums = [];
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.albums(null, {
        limit: 100,
        offset: albums.length,
      });
      albums.push(...temp);

      await sleep(30);
      break;
    } while (temp.length > 0);

    this.setState({ albums });
    console.log(albums);
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

Library.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default Library;
