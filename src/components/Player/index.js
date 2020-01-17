import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import styles from './styles.scss';

function Player(props) {
  const { queue, nowPlayingItemIndex, playbackState } = props;
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [activeRef]);

  const {
    MusicKitInstance: { player },
  } = window;

  return (
    <div className={styles.container}>
      <div className={styles.queue}>
        <span className={styles.title}>Queue</span>
        {queue.items.map((item, index) => (
          <div
            key={item.id}
            className={nowPlayingItemIndex === index ? styles.active : null}
            ref={nowPlayingItemIndex === index ? activeRef : null}
          >
            <Song
              song={item}
              onSelected={() => player.changeToMediaAtIndex(index)}
            />
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <PlayerControls
          hasPrevious={queue.position > 0}
          hasNext={queue.position < queue.length - 1}
          onSeek={(time) => player.seekToTime(time)}
          onPrevious={() => player.changeToMediaAtIndex(queue.position - 1)}
          onNext={() => player.skipToNextItem()}
          onPlaybackChange={(isPaused) => (isPaused ? player.play() : player.pause())}
          onVolumeChange={(vol) => {
            player.volume = vol;
          }}
          playbackState={playbackState}
        />
      </div>
    </div>
  );
}
Player.defaultProps = {
  nowPlayingItemIndex: 0,
};

Player.propTypes = {
  queue: PropTypes.shape({
    items: PropTypes.arrayOf(trackPropType),
    position: PropTypes.number,
    length: PropTypes.number,
  }).isRequired,
  nowPlayingItemIndex: PropTypes.number,
  playbackState: PropTypes.number.isRequired,
};

export default Player;
