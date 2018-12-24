import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { imgURLGen, srcSetGen } from '../../util/img';

import Song from '../Song';
import Loader from '../Loader';

import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

class PlaylistLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: [],
      playlist: null,
    };

    this.loadPlaylistMetadata = this.loadPlaylistMetadata.bind(this);
    this.loadTracks = this.loadTracks.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.loadPlaylistMetadata();
    this.loadTracks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.playlistID !== prevProps.match.params.playlistID) {
      this.loadPlaylistMetadata();
      this.loadTracks();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async loadPlaylistMetadata() {
    this.setState({ playlist: null });
    const { isLibrary } = this.props;
    const playlistID = Buffer.from(this.props.match.params.playlistID, 'base64').toString('ascii');
    const requestAPI = isLibrary ? window.MusicKitInstance.api.library : window.MusicKitInstance.api;
    const playlist = await requestAPI.playlist(playlistID);

    this.setState({ playlist });
  }

  async loadTracks() {
    let temp = [];
    let count = 0;

    this.setState({ songs: [] });

    const { isLibrary } = this.props;
    const playlistID = Buffer.from(this.props.match.params.playlistID, 'base64').toString('ascii');

    if (isLibrary) {
      do {
        try {
          temp = await window.MusicKitInstance.api.library.request(`me/library/playlists/${playlistID}/tracks`, {
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
    } else {
      const { relationships } = await window.MusicKitInstance.api.playlist(playlistID);
      this.setState({
        songs: relationships.tracks.data,
      });
    }
  }

  render() {
    const { playlist } = this.state;
    if (playlist === null) {
      return <Loader />;
    }
    const { attributes } = playlist;
    const artworkURL = attributes.artwork ? attributes.artwork.url : '';
    const description = ('description' in attributes) ? attributes.description.standard : '';
    return (
      <div className={styles.container}>
        <img className={styles.art} src={imgURLGen(artworkURL, { w: 75 })} srcSet={srcSetGen(artworkURL)} alt="Playlist artwork" />
        <span className={styles.title}>{attributes.name}</span>
        <span className={styles.metadata}>{this.state.songs.length} songs</span>
        <p className={styles.description}>{description}</p>
        <div className={styles.songs}>
          {
            this.state.songs.length > 0 ? this.state.songs.map((song, index) => (
              <Song key={song.id} song={song} onSelected={() => this.props.onSongSelected(playlist, index)} />
            )) : <Loader />
          }
        </div>
      </div>
    );
  }
}

PlaylistLibrary.propTypes = {
  isLibrary: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default PlaylistLibrary;
