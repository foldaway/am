import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import trackPropType from '../../prop_types/track';

const AlbumSong = (props) => (
  <div
    className={styles.container}
    onClick={(e) => {
      e.stopPropagation();
      props.onSelected(props.song);
    }}
    role="presentation"
  >
    <span className={styles['track-number']}>{props.song.attributes.trackNumber}</span>
    <span className={styles.title}>{props.song.attributes.name}</span>
  </div>
);

AlbumSong.defaultProps = {
  onSelected: () => {},
};

AlbumSong.propTypes = {
  song: trackPropType.isRequired,
  onSelected: PropTypes.func,
};

export default AlbumSong;
