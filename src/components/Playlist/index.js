import React from 'react';

import styled from 'styled-components';
import { imgURLGen, srcSetGen } from '../../util/img';

import playlistPropType from '../../prop_types/playlist';

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

    .title,
    .curator {
      text-decoration: underline;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  margin-bottom: 4px;
  border-radius: 6px;
  align-self: center;

  object-fit: cover;
  border: 1px solid $faintgray;

  &::before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const Title = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.text.primary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Curator = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.9em;
`;

const Playlist = ({ playlist, playlist: { attributes } }) => (
  <Wrapper>
    <Image
      src={
        attributes.artwork ? imgURLGen(attributes.artwork.url, { w: 75 }) : null
      }
      srcSet={attributes.artwork ? srcSetGen(attributes.artwork.url) : null}
      alt="Playlist artwork"
    />
    <Title className={styles.title}>{playlist.attributes.name}</Title>
    <Curator className={styles.curator}>
      {playlist.attributes.curatorName}
    </Curator>
  </Wrapper>
);

Playlist.propTypes = {
  playlist: playlistPropType.isRequired,
};

export default Playlist;
