import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
    };

    this.loadPlaylists = this.loadPlaylists.bind(this);
    this.loadPlaylists();
  }

  async loadPlaylists() {
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.playlists(null, {
        limit: 100,
        offset: this.state.playlists.length,
      });

      this.setState({
        playlists: [...this.state.playlists, ...temp],
      });
    } while (temp.length > 0);
  }

  render() {
    const { currentView } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <span className={styles.title}>Library</span>
          <span role="presentation" className={currentView === 'recently-added' ? styles.current : ''} onClick={() => this.props.onSelected('recently-added')}>Recently Added</span>
          <span role="presentation" className={currentView === 'artists' ? styles.current : ''} onClick={() => this.props.onSelected('artists')}>Artists</span>
          <span role="presentation" className={currentView === 'albums' ? styles.current : ''} onClick={() => this.props.onSelected('albums')}>Albums</span>
          <span role="presentation" className={currentView === 'songs' ? styles.current : ''} onClick={() => this.props.onSelected('songs')}>Songs</span>
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Catalog</span>
          <span role="presentation" className={currentView === 'search' ? styles.current : ''} onClick={() => this.props.onSelected('search')}>Search</span>
          <span role="presentation" className={currentView === 'foryou' ? styles.current : ''} onClick={() => this.props.onSelected('foryou')}>For You</span>
        </div>
        <div className={[styles.section, styles.playlists].join(' ')}>
          <span className={styles.title}>Playlists</span>
          {
            this.state.playlists.map((playlist) => (
              <span
                role="presentation"
                key={playlist.id}
                onClick={() => this.props.onSelected('playlist', playlist)}
              >
                {playlist.attributes.name}
              </span>
            ))
          }
        </div>
      </div>
    );
  }
}

SideMenu.propTypes = {
  onSelected: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
};

export default SideMenu;
