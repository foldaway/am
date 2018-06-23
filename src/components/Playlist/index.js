import React from 'react';
import PropTypes from 'prop-types';

import playlistPropType from '../../prop_types/playlist';
import styles from './styles.scss';

const Playlist = ({ playlist, onSelected }) => (
  <div className={styles.container} onClick={onSelected} role="presentation">
    <div
      className={styles.art}
      style={{
      backgroundImage: `url(${playlist.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300')})`,
    }}
    />
    <span className={styles.title}>{playlist.attributes.name}</span>
    <span className={styles.curator}>{playlist.attributes.curatorName}</span>
  </div>
);

Playlist.propTypes = {
  playlist: playlistPropType.isRequired,
  onSelected: PropTypes.func.isRequired,
};

export default Playlist;
