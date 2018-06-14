import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Album = (props) => (
  <div className={styles.container}>
    <img className={styles.art} src={props.album.attributes.artwork.url.replace('{w}', '120').replace('{h}', '120')} alt="" />
    <span className={styles.title}>{props.album.attributes.name}</span>
    <span className={styles.artist}>{props.album.attributes.artistName}</span>
  </div>
);

Album.propTypes = {
  album: PropTypes.shape({
    attributes: PropTypes.shape({
      artistName: PropTypes.string,
      artwork: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        url: PropTypes.string,
      }),
      name: PropTypes.string,
      trackCount: PropTypes.number,
    }),
  }).isRequired,
};

export default Album;
