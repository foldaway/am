import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AlbumSong from '../AlbumSong';
import Loader from '../Loader';

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
    const { isLibrary } = this.props.album.attributes.playParams;
    const api = isLibrary ? window.MusicKitInstance.api.library : window.MusicKitInstance.api;
    const { relationships } = await api.album(this.props.album.id);
    this.setState({
      songs: relationships.tracks.data,
    });
    window.scrollBy(0, 20);
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
        <div
          className={styles.art}
          style={{
          backgroundImage: `url(${album.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300')})`,
        }}
        />
        <span className={styles.title}>{album.attributes.name}</span>
        <span className={styles.artist}>{album.attributes.artistName}</span>
        <div className={styles.songs}>
          {
            this.state.isSongListVisible && this.state.songs.length > 0 ?
            this.state.songs.map((song, index) => (
              <AlbumSong key={song.id} song={song} onSelected={() => onSelected(album, index)} />
            )) : null
          }
          {
            this.state.isSongListVisible && this.state.songs.length === 0 ?
              <div><Loader /></div> : null
          }
        </div>
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
