import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlbumSong from '../AlbumSong';

import styles from './styles.scss';

import albumPropType from '../../prop_types/album';

class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSongListVisible: false,
      songs: [],
    };

    this.loadTracks = this.loadTracks.bind(this);
    this.toggleSongList = this.toggleSongList.bind(this);
  }

  async loadTracks() {
    const { relationships } = await window.MusicKitInstance.api.library.album(this.props.album.id);
    this.setState({
      songs: relationships.tracks.data,
    });
  }

  toggleSongList() {
    if (this.state.songs.length === 0) {
      this.loadTracks();
    }
    this.setState({
      isSongListVisible: !this.state.isSongListVisible,
    });
  }

  render() {
    const { onSelected, album } = this.props;
    return (
      <div className={styles.container} onClick={this.toggleSongList} role="presentation">
        <img className={styles.art} src={album.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300')} alt="" />
        <span className={styles.title}>{album.attributes.name}</span>
        <span className={styles.artist}>{album.attributes.artistName}</span>
        {
          this.state.isSongListVisible ? (
            <div className={styles.songs}>
              {
                this.state.songs.map((song) => (
                  <AlbumSong key={song.id} song={song} onSelected={onSelected} />
                ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

Album.defaultProps = {
  onSelected: () => {},
};

Album.propTypes = {
  album: albumPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Album;
