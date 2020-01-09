import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { imgURLGen, srcSetGen } from '../../util/img';

import trackPropType from '../../prop_types/track';

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    "art title title explicit"
    "art artist album album";
  grid-template-columns: auto auto auto 1fr;
  grid-column-gap: 8px;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: $highlightgray;
  }
`;

const Art = styled.img`
  grid-area: art;
  width: 40px;
  height: 40px;
  border-radius: 3px;
`;

const Title = styled.span`
  grid-area: title;
  font-size: 0.9em;
  color: ${(props) => props.theme.text.primary};
`;

const Artist = styled.span`
  grid-area: artist;
  font-size: 0.75em;
  font-weight: 300;
  color: ${(props) => props.theme.text.secondary};
`;

const Album = styled.span`
  grid-area: album;
  font-size: 0.75em;
  font-weight: 300;
  color: ${(props) => props.theme.text.tertiary};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Song = ({ onSelected, song }) => (
  <Wrapper onClick={() => onSelected(song)} role="presentation">
    <Art
      src={
        'artwork' in song.attributes
          ? imgURLGen(song.attributes.artwork.url, { w: 75 })
          : null
      }
      srcSet={
        'artwork' in song.attributes
          ? srcSetGen(song.attributes.artwork.url)
          : null
      }
      alt="Song artwork"
    />
    <Title>{song.attributes.name}</Title>
    <Artist>{song.attributes.artistName}</Artist>
    <Album>{song.attributes.albumName}</Album>
  </Wrapper>
);

Song.defaultProps = {
  onSelected: () => {},
};

Song.propTypes = {
  song: trackPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Song;
