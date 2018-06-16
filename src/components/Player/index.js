import React from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import styles from './styles.scss';

const Player = (props) => (
  <div className={styles.container}>
    <div className={styles.queue}>
      {
        props.queue.map((item) => (
          <Song key={item.id} song={item} />
        ))
      }
    </div>
    <div className={styles.song}>
      {
        props.nowPlayingItem !== null ? (
          <Song song={props.nowPlayingItem} />
        ) : null
      }
    </div>
    <div className={styles.controls}>
      <PlayerControls />
    </div>
  </div>
);

Player.defaultProps = {
  nowPlayingItem: null,
};

Player.propTypes = {
  queue: PropTypes.arrayOf(trackPropType).isRequired,
  nowPlayingItem: trackPropType,
};

export default Player;
