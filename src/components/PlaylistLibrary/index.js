import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';

import playlistPropType from '../../prop_types/playlist';
import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

class PlaylistLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
    };

    this.loadTracks = this.loadTracks.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.loadTracks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.playlist.id !== prevProps.playlist.id) {
      this.loadTracks();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async loadTracks() {
    let temp = [];
    let count = 0;

    this.setState({ songs: [] });

    do {
      try {
        temp = await window.MusicKitInstance.api.library.request(`me/library/playlists/${this.props.playlist.id}/tracks`, {
          offset: count,
          include: ['curator'],
        });
      } catch (e) {
        // MusicKit JS throws exception from server 404 when offset > playlist total songs
        temp = [];
      }
      count += temp.length;

      if (!this.mounted) {
        break;
      }

      this.setState({
        songs: [...this.state.songs, ...temp],
      });
    } while (temp.length > 0);
  }

  render() {
    const { attributes } = this.props.playlist;
    const description = ('description' in attributes) ? attributes.description.standard : '';
    return (
      <div className={styles.container}>
        <img className={styles.art} src={attributes.artwork.url.replace('{w}', 200).replace('{h}', 200)} alt="" />
        <span className={styles.title}>{attributes.name}</span>
        <span className={styles.metadata}>{this.state.songs.length} songs</span>
        <p className={styles.description}>{description}</p>
        <div className={styles.songs}>
          {
            this.state.songs.map((song) => (
              <Song key={song.id} song={song} onSelected={() => this.props.onSongSelected(song)} />
            ))
          }
        </div>
      </div>
    );
  }
}

PlaylistLibrary.propTypes = {
  playlist: playlistPropType.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default PlaylistLibrary;
