import React, { useState, useEffect } from 'react';

import Album from '../components/Album';
import Loader from '../components/Loader';
import AlbumGrid from '../components/album-grid';
import { playAlbum } from '../util/play';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function AlbumLibrary() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let prevLength = 0;
      let offset = 0;

      do {
        const temp = await window.MusicKitInstance.api.library.albums(null, {
          limit: 100,
          offset,
        });

        prevLength = temp.length;
        offset += temp.length;

        setAlbums((prevState) => [...prevState, ...temp]);
        await sleep(10);
      } while (prevLength > 0);
    }
    fetchData();
  }, []);

  if (albums.length === 0) {
    return <Loader />;
  }
  return (
    <AlbumGrid>
      {albums.map((album) => (
        <Album key={album.id} album={album} onSelected={playAlbum} />
      ))}
    </AlbumGrid>
  );
}

export default AlbumLibrary;
