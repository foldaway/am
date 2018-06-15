import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import trackPropType from '../../prop_types/track';

const Track = (props) => (
  <div className={styles.container} onClick={() => props.onSelected(props.track)} role="presentation">
  <span className={styles.trackNumber}>{props.track.attributes.trackNumber}</span>
    <span className={styles.title}>{props.track.attributes.name}</span>
  </div>
);

Track.defaultProps = {
  onSelected: () => {},
};

Track.propTypes = {
  track: trackPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Track;
