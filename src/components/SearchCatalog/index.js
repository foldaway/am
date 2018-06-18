import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import Song from '../Song';
import Loader from '../Loader';
import styles from './styles.scss';

class SearchCatalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      isSearching: false,
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
    };

    this.getResultsView = this.getResultsView.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getResultsView() {
    if (this.state.isSearching) {
      return (
        <Loader />
      );
    }
    return (
      <div className={styles.results}>
        <div className={styles.section}>
          <span className={styles.title}>Artists</span>
          {
            this.state.artists.map((artist) => <span>{artist.attributes.name}</span>)
          }
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Songs</span>
          {
            this.state.songs.map((song, index) => (
              <Song
                song={song}
                onSelected={() => this.props.onSongSelected(this.state.songs, index)}
              />
            ))
          }
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Albums</span>
          <div className={styles.albums}>
            {
              this.state.albums.map((album) => (
                <Album album={album} onSelected={this.props.onAlbumSelected} />
              ))
            }
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Playlists</span>
          {
            this.state.playlists.map((playlist) => <span>{playlist.attributes.name}</span>)
          }
        </div>
      </div>
    );
  }

  async search() {
    this.setState({ isSearching: true });
    const { songs, albums, artists, playlists } = await window.MusicKitInstance.api.search(this.state.term);
    this.setState({
      isSearching: false,
      songs: songs.data,
      albums: albums.data,
      artists: artists.data,
      playlists: playlists.data,
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <form
          className={styles.search}
          onSubmit={(e) => {
          e.preventDefault();
          this.search();
        }}
        >
          <input type="text" onChange={(e) => this.setState({ term: e.target.value })} />
          <input type="submit" value="Search" />
        </form>
        { this.getResultsView() }
      </div>
    );
  }
}

SearchCatalog.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default SearchCatalog;
