import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import trackPropType from '../../prop_types/track';

const Song = (props) => (
  <div className={styles.container} onClick={() => props.onSelected(props.song)} role="presentation">
    <img className={styles.art} src={props.song.attributes.artwork.url.replace('{w}', '80').replace('{h}', '80')} alt="" />
    <span className={styles.title}>{props.song.attributes.name}</span>
    <span className={styles.artist}>{props.song.attributes.artistName}</span>
  </div>
);

Song.defaultProps = {
  onSelected: () => {},
};

Song.propTypes = {
  song: trackPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Song;
