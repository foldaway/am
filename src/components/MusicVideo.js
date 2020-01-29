import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { imgURLGen, srcSetGen } from '../../util/img';

import musicVideoPropType from '../../prop_types/musicVideo';

const Art = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  grid-area: art;
  border-radius: 3px;
  transition: filter 200ms;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto auto;
  grid-template-areas:
    "art"
    "title"
    "year";
  grid-row-gap: 4px;

  &:hover {
    cursor: pointer;

    ${Art} {
      filter: brightness(120%);
    }
  }
`;

const Title = styled.span`
  grid-area: title;
  font-size: 0.8em;
  color: ${(props) => props.theme.text.primary};
`;

const Year = styled.span`
  grid-area: year;
  font-size: 0.75em;
  font-weight: 300;
  color: $gray;
  color: ${(props) => props.theme.text.secondary};
`;

const MusicVideo = ({ onSelected, musicVideo }) => (
  <Wrapper onClick={() => onSelected(musicVideo)} role="presentation">
    <Art
      src={
        'artwork' in musicVideo.attributes
          ? imgURLGen(musicVideo.attributes.artwork.url, { w: 75 })
          : null
      }
      srcSet={
        'artwork' in musicVideo.attributes
          ? srcSetGen(musicVideo.attributes.artwork.url)
          : null
      }
      alt="Song artwork"
    />
    <Title>{musicVideo.attributes.name}</Title>
    <Year>{new Date(musicVideo.attributes.releaseDate).getFullYear()}</Year>
  </Wrapper>
);

MusicVideo.defaultProps = {
  onSelected: () => {},
};

MusicVideo.propTypes = {
  musicVideo: musicVideoPropType.isRequired,
  onSelected: PropTypes.func,
};

export default MusicVideo;
