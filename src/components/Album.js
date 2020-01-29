import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import AlbumSong from '../AlbumSong';
import Loader from '../Loader';

import { imgURLGen, srcSetGen } from '../../util/img';
import albumPropType from '../../prop_types/album';
import SquareImage from '../SquareImage';

const StyledSquareImage = styled(SquareImage)``;

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-areas:
    "art"
    "title"
    "artist"
    "songs";
  grid-template-rows: auto auto auto 1fr;
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

const Artist = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.text.secondary};
  font-size: 0.9em;
  text-align: center;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;

  * {
    margin: 2.5px 0;
  }
  :first-child {
    margin-top: 0;
  }
  :last-child {
    margin-bottom: 0;
  }
`;

function Album({ album, onSelected }) {
  const [songs, setSongs] = useState([]);
  const [songListVisible, setSongListVisible] = useState(false);

  async function loadTracks() {
    const { isLibrary } = album.attributes.playParams;
    const api = isLibrary
      ? window.MusicKitInstance.api.library
      : window.MusicKitInstance.api;
    const { relationships } = await api.album(album.id);
    setSongs(relationships.tracks.data);
    window.scrollBy(0, 20);
  }

  function toggleSongList() {
    if (songs.length === 0) {
      loadTracks();
    }
    setSongListVisible(!songListVisible);
  }

  const { url } = album.attributes.artwork || { url: '' };

  return (
    <Wrapper onClick={toggleSongList} role="presentation">
      <StyledSquareImage
        src={url && imgURLGen(url, { w: 75 })}
        srcSet={url && srcSetGen(url)}
        alt="album artwork"
      />
      <Title>{album.attributes.name}</Title>
      <Artist>{album.attributes.artistName}</Artist>
      <SongList>
        {songListVisible && songs.length > 0
          ? songs.map((song, index) => (
            <AlbumSong
              key={song.id}
              song={song}
              onSelected={() => onSelected(album, index)}
            />
          ))
          : null}
        {songListVisible && songs.length === 0 ? (
          <div>
            <Loader />
          </div>
        ) : null}
      </SongList>
    </Wrapper>
  );
}

Album.defaultProps = {
  onSelected: () => {},
};

Album.propTypes = {
  album: albumPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Album;
