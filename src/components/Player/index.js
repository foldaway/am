import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import LargeTitle from '../large-title';

const Wrapper = styled.div`
  grid-area: player;
  display: grid;

  grid-template-areas:
    "queue"
    "controls";
  grid-template-columns: 1fr;
  grid-template-rows: 3fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;
  overflow: hidden;
  background-color: ${(props) => props.theme.background.primary};
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
`;

const Queue = styled.div`
  grid-area: queue;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  & > .title,
  & > div {
    margin: 2.5px 0;
  }
  :first-child {
    margin-top: 0;
  }
  :last-child {
    margin-bottom: 0;
  }

  .active {
    background: ${(props) => props.theme.background.secondary};
  }
`;

const StyledPlayerControls = styled(PlayerControls)`
  grid-area: controls;
`;

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
    <Wrapper>
      <Queue>
        <LargeTitle>Queue</LargeTitle>
        {queue.items.map((item, index) => (
          <div
            key={item.id}
            className={nowPlayingItemIndex === index && 'active'}
            ref={nowPlayingItemIndex === index ? activeRef : null}
          >
            <Song
              song={item}
              onSelected={() => player.changeToMediaAtIndex(index)}
            />
          </div>
        ))}
      </Queue>
      <StyledPlayerControls
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
    </Wrapper>
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
