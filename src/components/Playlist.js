import React from 'react';

import styled from 'styled-components';
import { imgURLGen, srcSetGen } from '../util/img';

import playlistPropType from '../prop_types/playlist';
import SquareImage from './ui/SquareImage';

const StyledSquareImage = styled(SquareImage)``;

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    "art"
    "title"
    "curator";
  grid-template-rows: auto auto 1fr;
  font-size: 0.9em;
  grid-row-gap: 3px;

  &:hover {
    cursor: pointer;

    ${StyledSquareImage} {
      transform: scale(1.04);
    }
  }
`;

const Title = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.text.primary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  margin-top: 4px;
`;

const Curator = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.9em;
  text-align: center;
`;

const Playlist = ({ playlist, playlist: { attributes } }) => (
  <Wrapper>
    <StyledSquareImage artwork={attributes.artwork} alt="Playlist artwork" />
    <Title>{playlist.attributes.name}</Title>
    <Curator>{playlist.attributes.curatorName}</Curator>
  </Wrapper>
);

Playlist.propTypes = {
  playlist: playlistPropType.isRequired,
};

export default Playlist;
