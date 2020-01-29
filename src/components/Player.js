import React, { useRef, useEffect, useState } from 'react';

import styled, { css } from 'styled-components';
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from 'react-icons/io';
import Song from './Song';
import PlayerControls from './PlayerControls';

import SmallTitle from './ui/SmallTitle';

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
`;

const QueueSong = styled(Song)`
  border-radius: 3px;
  ${(props) => props.active
    && css`
      background: ${props.theme.background.secondary};
    `}
`;

const CurrentSong = styled(Song)`
  margin: 10px 0;
`;

const EmptyState = styled.span`
  color: ${(props) => props.theme.text.secondary};
  margin: 10px 0;
`;

function Player() {
  const { Events } = window.MusicKit;
  const { player } = window.MusicKitInstance;
  const [isOpen, setIsOpen] = useState(false);
  const activeRef = useRef(null);

  const [queue, setQueue] = useState({ items: [] });
  const [nowPlayingItemIndex, setNowPlayingItemIndex] = useState(-1);

  useEffect(() => {
    const queueCb = (items) => setQueue({ items });
    const queuePosCb = ({ position }) => setNowPlayingItemIndex(position);
    player.addEventListener(Events.queueItemsDidChange, queueCb);
    player.addEventListener(Events.queuePositionDidChange, queuePosCb);

    return () => {
      player.removeEventListener(Events.queueItemsDidChange, queueCb);
      player.removeEventListener(Events.queuePositionDidChange, queuePosCb);
    };
  }, []);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [isOpen]);

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
          <QueueSong
            key={item.id}
            active={nowPlayingItemIndex === index}
            ref={nowPlayingItemIndex === index ? activeRef : null}
            song={item}
            onSelected={() => player.changeToMediaAtIndex(index)}
          />
        ))}
      </Queue>
      {!isOpen && nowPlayingItemIndex !== -1 && (
        <CurrentSong
          song={queue.items[nowPlayingItemIndex]}
          onSelected={toggleOpen}
        />
      )}
      {nowPlayingItemIndex === -1 && <EmptyState>Nothing playing</EmptyState>}
      <PlayerControls />
    </Wrapper>
  );
}

export default Player;
