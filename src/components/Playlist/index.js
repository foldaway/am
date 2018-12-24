import React from 'react';

import { imgURLGen, srcSetGen } from '../../util/img';

import playlistPropType from '../../prop_types/playlist';
import styles from './styles.scss';

const Playlist = ({ playlist, playlist: { attributes } }) => (
  <div className={styles.container}>
    <img
      className={styles.art}
      src={attributes.artwork ? imgURLGen(attributes.artwork.url, { w: 75 }) : null}
      srcSet={attributes.artwork ? srcSetGen(attributes.artwork.url) : null}
      alt="Playlist artwork"
    />
    <span className={styles.title}>{playlist.attributes.name}</span>
    <span className={styles.curator}>{playlist.attributes.curatorName}</span>
  </div>
);

Playlist.propTypes = {
  playlist: playlistPropType.isRequired,
};

export default Playlist;
