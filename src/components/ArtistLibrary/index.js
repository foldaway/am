import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Loader from '../Loader';
import Artist from '../Artist';
import Album from '../Album';
import AlbumGrid from '../album-grid';
import LargeTitle from '../large-title';

/* eslint-disable no-await-in-loop */

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: "artist-list indiv";
  grid-template-columns: 1fr 3fr;
  height: 100%;
  overflow: hidden;
`;

const ArtistList = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 2px;
  grid-area: artist-list;
  overflow-y: scroll;
`;

const IndivWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "title"
    "album-count"
    "albums";
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-area: indiv;
  margin-left: 10px;
  overflow: hidden;
`;

const AlbumCount = styled.span`
  color: ${(props) => props.theme.text.secondary};
`;

function ArtistLibrary({ onAlbumSelected }) {
  const [artists, setArtists] = useState([]);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [indivAlbums, setIndivAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      let prevLength = 0;
      let offset = 0;

      do {
        const temp = await window.MusicKitInstance.api.library.artists(null, {
          limit: 100,
          offset,
        });

        prevLength = temp.length;
        offset += temp.length;

        setArtists((prevState) => [...prevState, ...temp]);
      } while (prevLength > 0);
    }

    load();
  }, []);

  useEffect(() => {
    if (currentArtist === null) {
      return;
    }
    setIsLoading(true);
    async function loadIndiv() {
      const { id } = currentArtist;
      const {
        relationships,
      } = await window.MusicKitInstance.api.library.artist(id, {
        include: ['albums'],
      });
      setIsLoading(false);

      setIndivAlbums(relationships.albums.data);
    }

    loadIndiv();
  }, [currentArtist]);

  function getIndivView() {
    if (currentArtist === null) {
      return null;
    }
    if (isLoading) {
      return <Loader />;
    }
    return (
      <IndivWrapper>
        <LargeTitle>{currentArtist.attributes.name}</LargeTitle>
        <AlbumCount>
          {indivAlbums.length}
          {' '}
albums
        </AlbumCount>
        <AlbumGrid>
          {indivAlbums.length > 0 ? (
            indivAlbums.map((album) => (
              <Album
                key={album.id}
                album={album}
                onSelected={onAlbumSelected}
              />
            ))
          ) : (
            <Loader />
          )}
        </AlbumGrid>
      </IndivWrapper>
    );
  }

  return (
    <Wrapper>
      <ArtistList>
        {artists.length > 0 ? (
          artists.map((artist) => (
            <Artist onClick={() => setCurrentArtist(artist)} artist={artist} />
          ))
        ) : (
          <Loader />
        )}
      </ArtistList>
      {getIndivView()}
    </Wrapper>
  );
}

ArtistLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default ArtistLibrary;
