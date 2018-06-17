import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import Song from '../Song';
import styles from './styles.scss';

class SearchCatalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      songs: [],
      albums: [],
      artists: [],
    };

    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async search() {
    const { songs, albums, artists } = await window.MusicKitInstance.api.search(this.state.term);
    this.setState({
      songs: songs.data,
      albums: albums.data,
      artists: artists.data,
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <input type="text" onChange={(e) => this.setState({ term: e.target.value })} />
        <button onClick={this.search}>Search</button>
        <div className={styles.section}>
          <span className={styles.title}>Songs</span>
          {
            this.state.songs.map((song, index) => (
              <Song song={song} onSelected={() => this.props.onSongSelected(this.state.songs, index)} />
            ))
          }
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Albums</span>
          {
            this.state.albums.map((album) => (
              <Album album={album} onSelected={this.props.onAlbumSelected} />
            ))
          }
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Artists</span>
          {
            this.state.artists.map((artist) => <span>{artist.attributes.name}</span>)
          }
        </div>
      </div>
    );
  }
}

SearchCatalog.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default SearchCatalog;
