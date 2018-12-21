import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import Loader from '../Loader';
import styles from './styles.scss';
import Playlist from '../Playlist';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

class RecentlyAddedLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      media: [],
    };

    this.load = this.load.bind(this);
    this.generateMediaView = this.generateMediaView.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async load() {
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.request('me/library/recently-added', {
        limit: 10,
        offset: this.state.media.length,
      });

      if (!this.mounted) {
        break;
      }

      this.setState({
        media: [...this.state.media, ...temp],
      });

      await sleep(50);
    } while (temp.length > 0);
  }

  generateMediaView(media) {
    switch (media.type) {
      case 'library-albums':
        return <Album key={media.id} album={media} onSelected={this.props.onAlbumSelected} />;
      // case 'library-playlists':
      // return <Playlist key={media.id} playlist={media} onSelected={() => this.props.onPlaylistSelected('playlist', media)} />;
      // Hide playlists for now.
      default: return null;
    }
  }

  render() {
    if (this.state.media.length === 0) {
      return <Loader />;
    }
    return (
      <div className={styles.container}>
        {
          this.state.media.map(this.generateMediaView)
        }
      </div>
    );
  }
}

RecentlyAddedLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
  onPlaylistSelected: PropTypes.func.isRequired,
};

export default RecentlyAddedLibrary;
