import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';

import { FormattedTime } from 'react-player-controls';

import trackPropType from '../prop_types/track';
import SquareImage from './ui/SquareImage';
import { playSong } from '../util/play';

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    "art title title explicit duration"
    "art artist album album duration";
  grid-template-columns: auto auto auto 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 8px;
  row-gap: 2px;
  align-items: center;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background-color: $highlightgray;
  }

  ${(props) => (props.active
    ? css`
          background-color: rgba(0, 0, 0, 0.06);
        `
    : '')}
`;

const Art = styled(SquareImage)`
  grid-area: art;
  width: 50px;
  height: 50px;
  border-radius: 3px;

  font-size: 0.7em;
`;

const Title = styled.span`
  grid-area: title;
  align-self: end;
  font-size: 0.9em;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  color: ${(props) => props.theme.text.primary};
`;

const Artist = styled.span`
  grid-area: artist;
  align-self: start;
  font-size: 0.8em;
  font-weight: 400;
  color: ${(props) => props.theme.text.secondary};
`;

const Album = styled.span`
  grid-area: album;
  align-self: start;
  font-size: 0.8em;
  font-weight: 400;
  color: ${(props) => props.theme.text.tertiary};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledFormattedTime = styled(FormattedTime)`
  grid-area: duration;
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.9em;
  font-family: "IBM Plex Mono", monospace;
`;

function Song(props) {
  const { onClick, song, active } = props;
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (active && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);

  function fallbackOnClick() {
    playSong(song);
  }

  return (
    <Wrapper
      ref={wrapperRef}
      {...props}
      onClick={onClick || fallbackOnClick}
      role="presentation"
    >
      <Art artwork={song.attributes.artwork} alt="Song artwork" />
      <Title>{song.attributes.name}</Title>
      <Artist>{song.attributes.artistName}</Artist>
      <Album>{song.attributes.albumName}</Album>
      <StyledFormattedTime
        numSeconds={song.attributes.durationInMillis / 1000}
      />
    </Wrapper>
  );
}

Song.defaultProps = {
  active: false,
  onClick: null,
};

Song.propTypes = {
  song: trackPropType.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Song;
