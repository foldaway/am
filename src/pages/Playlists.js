import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import Playlist from '../components/Playlist';
import AlbumGrid from '../components/ui/AlbumGrid';
import Loader from '../components/Loader';

/* eslint-disable no-await-in-loop */

const Wrapper = styled.div``;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let prevLength = 0;
      let offset = 0;

      do {
        const temp = await window.MusicKitInstance.api.library.playlists(null, {
          limit: 100,
          offset,
        });

        prevLength = temp.length;
        offset += temp.length;

        setPlaylists((prevState) => [...prevState, ...temp]);
        await sleep(10);
      } while (prevLength > 0);
    }
    fetchData();
  }, []);

  return (
    <Wrapper>
      <AlbumGrid>
        {isEmpty(playlists) && <Loader />}
        {playlists.map((playlist) => (
          <StyledLink
            key={playlist.id}
            to={`/library/playlists/${playlist.id}`}
          >
            <Playlist playlist={playlist} />
          </StyledLink>
        ))}
      </AlbumGrid>
    </Wrapper>
  );
}

export default Playlists;
