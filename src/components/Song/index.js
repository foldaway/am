import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import { imgURLGen, srcSetGen } from '../../util/img';

import trackPropType from '../../prop_types/track';

const Song = ({ onSelected, song }) => (
  <div className={styles.container} onClick={() => onSelected(song)} role="presentation">
    <img
      className={styles.art}
      src={('artwork' in song.attributes) ? imgURLGen(song.attributes.artwork.url, { w: 75 }) : null}
      srcSet={('artwork' in song.attributes) ? srcSetGen(song.attributes.artwork.url) : null}
      alt="Song artwork"
    />
    <span className={styles.title}>{song.attributes.name}</span>
    <span className={styles.artist}>{song.attributes.artistName}</span>
    <span className={styles.album}>{song.attributes.albumName}</span>
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
