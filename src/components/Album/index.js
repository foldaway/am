import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import albumPropType from '../../prop_types/album';

const Album = (props) => (
  <div className={styles.container} onClick={() => props.onSelected(props.album)} role="presentation">
    <img className={styles.art} src={props.album.attributes.artwork.url.replace('{w}', '300').replace('{h}', '300')} alt="" />
    <span className={styles.title}>{props.album.attributes.name}</span>
    <span className={styles.artist}>{props.album.attributes.artistName}</span>
  </div>
);

Album.defaultProps = {
  onSelected: () => {},
};

Album.propTypes = {
  album: albumPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Album;
