import React from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import styles from './styles.scss';

const Player = ({ queue, nowPlayingItem }) => (
  <div className={styles.container}>
    <div className={styles.queue}>
      <span className={styles.title}>Queue</span>
      {
        queue.items.map((item) => (
          <Song key={item.id} song={item} />
        ))
      }
    </div>
    <div className={styles.song}>
      {
        nowPlayingItem !== null ? (
          <Song song={nowPlayingItem} />
        ) : null
      }
    </div>
    <div className={styles.controls}>
      <PlayerControls
        hasPrevious={queue.position > 0}
        hasNext={queue.position < queue.length - 1}
        onSeek={(time) => window.MusicKitInstance.player.seekToTime(time)}
        onPrevious={() => window.MusicKitInstance.player.changeToMediaAtIndex(queue.position - 1)}
        onNext={() => window.MusicKitInstance.player.skipToNextItem()}
        onPlaybackChange={(isPaused) => (isPaused ?
          window.MusicKitInstance.player.play() :
          window.MusicKitInstance.player.pause()
        )}
      />
    </div>
  </div>
);

Player.defaultProps = {
  nowPlayingItem: null,
};

Player.propTypes = {
  queue: PropTypes.shape({
    items: PropTypes.arrayOf(trackPropType),
    position: PropTypes.number,
  }).isRequired,
  nowPlayingItem: trackPropType,
};

export default Player;
