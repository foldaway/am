import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const SideMenu = (props) => (
  <div className={styles.container}>
    <div className={styles.section}>
      <span className={styles.title}>Library</span>
      <span onClick={props.onSelected}>Albums</span>
      <span onClick={props.onSelected}>Songs</span>
    </div>
    <div className={styles.section}>
      <span className={styles.title}>Playlists</span>
      <span onClick={props.onSelected}>Some Playlist</span>
    </div>
  </div>
);

SideMenu.propTypes = {
  onSelected: PropTypes.func.isRequired,
};

export default SideMenu;
