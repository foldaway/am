import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import { imgURLGen, srcSetGen } from '../../util/img';

import musicVideoPropType from '../../prop_types/musicVideo';

const MusicVideo = ({ onSelected, musicVideo }) => (
  <div className={styles.container} onClick={() => onSelected(musicVideo)} role="presentation">
    <img
      className={styles.art}
      src={('artwork' in musicVideo.attributes) ? imgURLGen(musicVideo.attributes.artwork.url, { w: 75 }) : null}
      srcSet={('artwork' in musicVideo.attributes) ? srcSetGen(musicVideo.attributes.artwork.url) : null}
      alt="Song artwork"
    />
    <span className={styles.title}>{musicVideo.attributes.name}</span>
    <span className={styles.year}>{new Date(musicVideo.attributes.releaseDate).getFullYear()}</span>
  </div>
);

MusicVideo.defaultProps = {
  onSelected: () => {},
};

MusicVideo.propTypes = {
  musicVideo: musicVideoPropType.isRequired,
  onSelected: PropTypes.func,
};

export default MusicVideo;
