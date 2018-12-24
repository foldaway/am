import React from 'react';

import artistPropType from '../../prop_types/artist';
import styles from './styles.scss';

const Artist = (props) => (
  <div className={styles.container}>
    <span>{props.artist.attributes.name}</span>
  </div>
);

Artist.propTypes = {
  artist: artistPropType.isRequired,
};

export default Artist;
