import React from 'react';
import PropTypes from 'prop-types';

import artistPropType from '../../prop_types/artist';
import styles from './styles.scss';

const Artist = (props) => (
  <div className={styles.container} onClick={props.onSelected} role="presentation">
    <span>{props.artist.attributes.name}</span>
  </div>
);

Artist.defaultProps = {
  onSelected: () => {},
};

Artist.propTypes = {
  artist: artistPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Artist;
