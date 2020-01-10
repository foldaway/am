import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import Loader from '../Loader';
import Playlist from '../Playlist';
import AlbumGrid from '../album-grid';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function RecentlyAddedLibrary({ onAlbumSelected, onPlaylistSelected }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    async function load() {
      let prevLength = 0;
      let offset = 0;
      do {
        const temp = await window.MusicKitInstance.api.library.request(
          'me/library/recently-added',
          {
            limit: 10,
            offset,
          },
        );

        prevLength = temp.length;
        offset += temp.length;

        setMedia((prevState) => [...prevState, ...temp]);

        await sleep(50);
      } while (prevLength > 0);
    }
    load();
  }, []);

  function generateMediaView(m) {
    switch (m.type) {
      case 'library-albums':
        return <Album key={m.id} album={m} onSelected={onAlbumSelected} />;
      // Hide playlists for now.
      // case 'library-playlists':
      //   return (
      //     <Playlist
      //       key={m.id}
      //       playlist={m}
      //       onSelected={() => onPlaylistSelected('playlist', m)}
      //     />
      //   );
      default:
        return null;
    }
  }

  if (media.length === 0) {
    return <Loader />;
  }
  return <AlbumGrid>{media.map(generateMediaView)}</AlbumGrid>;
}

RecentlyAddedLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
  onPlaylistSelected: PropTypes.func.isRequired,
};

export default RecentlyAddedLibrary;
