import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from 'react-icons/io';
import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import SmallTitle from '../ui/SmallTitle';

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
  border-radius: 3px;

  width: 400px;
  height: ${(props) => (props.isOpen ? '50vh' : '180px')};
  transition: height 200ms;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${(props) => props.theme.background.primary};
  padding: 10px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`;

const CloseButton = styled.button`
  color: ${(props) => props.theme.text.secondary};
  background: none;
  border: none;
  transition: 200ms transform;

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
`;

const Queue = styled.div`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  overflow-y: scroll;
  flex: 1 1 auto;
  margin: 10px 0;

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

const CurrentSong = styled(Song)`
  margin: 10px 0;
`;

const EmptyState = styled.span`
  color: ${(props) => props.theme.text.secondary};
  margin: 10px 0;
`;

function Player(props) {
  const { queue, nowPlayingItemIndex } = props;
  const [isOpen, setIsOpen] = useState(false);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [isOpen]);

  const {
    MusicKitInstance: { player },
  } = window;

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <Wrapper isOpen={isOpen}>
      <Header onClick={toggleOpen}>
        <SmallTitle>{isOpen ? 'Queue' : 'Player'}</SmallTitle>
        <CloseButton onClick={toggleOpen}>
          {isOpen ? <IoIosArrowDropdownCircle /> : <IoIosArrowDropupCircle />}
        </CloseButton>
      </Header>
      <Queue visible={isOpen}>
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
      {!isOpen && nowPlayingItemIndex !== -1 && (
        <CurrentSong
          song={queue.items[nowPlayingItemIndex]}
          onSelected={toggleOpen}
        />
      )}
      {nowPlayingItemIndex === -1 && <EmptyState>Nothing playing</EmptyState>}
      <PlayerControls
        onSeek={(time) => player.seekToTime(time)}
        onPrevious={() => player.changeToMediaAtIndex(queue.position - 1)}
        onNext={() => player.skipToNextItem()}
        onPlaybackChange={(isPaused) => (isPaused ? player.play() : player.pause())}
        onVolumeChange={(vol) => {
          player.volume = vol;
        }}
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
};

export default Player;
