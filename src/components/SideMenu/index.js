import React, { useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';

import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

function SideMenu() {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    async function loadPlaylists() {
      const results = [];
      let temp = [];
      do {
        temp = await window.MusicKitInstance.api.library.playlists(null, {
          limit: 100,
          offset: temp.length,
        });

        results.push(...temp);
      } while (temp.length > 0);
      setPlaylists(results);
    }
    loadPlaylists();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles.title}>Library</span>
        <NavLink activeClassName={styles.current} to="/library/recently-added">
          Recently Added
        </NavLink>
        <NavLink activeClassName={styles.current} to="/library/artists">
          Artists
        </NavLink>
        <NavLink activeClassName={styles.current} to="/library/albums">
          Albums
        </NavLink>
        <NavLink activeClassName={styles.current} to="/library/songs">
          Songs
        </NavLink>
      </div>
      <div className={styles.section}>
        <span className={styles.title}>Catalog</span>
        <NavLink activeClassName={styles.current} to="/search">
          Search
        </NavLink>
        <NavLink activeClassName={styles.current} to="/for-you">
          For You
        </NavLink>
      </div>
      <div className={[styles.section, styles.playlists].join(' ')}>
        <span className={styles.title}>Playlists</span>
        {playlists.map((playlist) => (
          <NavLink
            key={playlist.id}
            activeClassName={styles.current}
            to={`/library/playlist/${Buffer.from(playlist.id).toString(
              'base64',
            )}`}
          >
            {playlist.attributes.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default SideMenu;
