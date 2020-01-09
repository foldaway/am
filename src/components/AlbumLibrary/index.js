import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import Loader from '../Loader';
import AlbumGrid from '../album-grid';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function AlbumLibrary({ onAlbumSelected }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let temp = [];
      do {
        temp = await window.MusicKitInstance.api.library.albums(null, {
          limit: 100,
          offset: albums.length,
        });

        setAlbums(albums.concat(temp));
        await sleep(10);
      } while (temp.length > 0);
    }
    fetchData();
  }, []);

  if (albums.length === 0) {
    return <Loader />;
  }
  return (
    <AlbumGrid>
      {albums.map((album) => (
        <Album key={album.id} album={album} onSelected={onAlbumSelected} />
      ))}
    </AlbumGrid>
  );
}

AlbumLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default AlbumLibrary;
