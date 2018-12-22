import React, { Component } from 'react';

import { NavLink, Link } from 'react-router-dom';

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
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <span className={styles.title}>Library</span>
          <NavLink activeClassName={styles.current} to="/library/recently-added">Recently Added</NavLink>
          <NavLink activeClassName={styles.current} to="/library/artists">Artists</NavLink>
          <NavLink activeClassName={styles.current} to="/library/albums">Albums</NavLink>
          <NavLink activeClassName={styles.current} to="/library/songs">Songs</NavLink>
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Catalog</span>
          <NavLink activeClassName={styles.current} to="/search">Search</NavLink>
          <NavLink activeClassName={styles.current} to="/for-you">For You</NavLink>
        </div>
        <div className={[styles.section, styles.playlists].join(' ')}>
          <span className={styles.title}>Playlists</span>
          {
            this.state.playlists.map((playlist) => (
              <Link key={playlist.id} href="#" to={`/playlist/${playlist.id}`} >
                {playlist.attributes.name}
              </Link>
            ))
          }
        </div>
      </div>
    );
  }
}

export default SideMenu;
