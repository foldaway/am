import React, { Component } from 'react';

import Album from '../Album';
import styles from './styles.scss';

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
      temp = await window.MusicKitInstance.api.library.albums(null, { limit: 100, offset: albums.length });
      albums.push(...temp);

      await this.sleep(30);
      break;
    } while (temp.length > 0);

    this.setState({ albums });
    console.log(albums);
  }

  async sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  render() {
    return (
      <div className={styles.container}>
        {
          this.state.albums.map((album) => <Album key={album.id} album={album} />)
        }
      </div>
    );
  }
}

export default Library;
