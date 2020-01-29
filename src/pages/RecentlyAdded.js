import React, { useState, useEffect, useMemo } from 'react';
import {
  groupBy,
  omitBy,
  sortBy,
  toPairs,
  isEmpty,
  every,
  isNil,
} from 'lodash';
import moment from 'moment';

import styled from 'styled-components';
import Album from '../components/Album';
import Loader from '../components/Loader';
import AlbumGrid from '../components/ui/AlbumGrid';
import LargeTitle from '../components/ui/LargeTitle';

import { playAlbum } from '../util/play';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${LargeTitle} {
    margin-top: 32px;
    margin-bottom: 16px;
  }
`;

function RecentlyAddedLibrary() {
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

        setMedia((prevState) => sortBy(
          [...prevState, ...temp],
          (item) => item.attributes.dateAdded,
        ).reverse());

        await sleep(50);
      } while (prevLength > 0);
    }
    load();
  }, []);

  const now = moment();
  const mediaGroupedByMonth = useMemo(
    () => omitBy(
      groupBy(media, (m) => now.diff(m.attributes.dateAdded, 'months')),
      (_, monthCount) => parseInt(monthCount, 10) > 12,
    ),
    [media],
  );
  const mediaGroupedByYear = useMemo(
    () => omitBy(
      groupBy(media, (m) => now.diff(m.attributes.dateAdded, 'years')),
      (_, yearCount) => parseInt(yearCount, 10) <= 1,
    ),
    [media],
  );

  function mediaView(m) {
    switch (m.type) {
      case 'library-albums':
        return <Album key={m.id} album={m} onSelected={playAlbum} />;
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

  function collectionView(key, value, timeUnit) {
    const mediaViews = value.map(mediaView);
    if (isEmpty(value) || every(mediaViews, isNil)) {
      return null;
    }
    const isPlural = parseInt(key, 10) > 0;
    return (
      <React.Fragment>
        <LargeTitle>
          Last&nbsp;
          {isPlural ? key : ''}
          {isPlural ? ' ' : ''}
          {timeUnit}
          {isPlural ? 's' : ''}
        </LargeTitle>
        <AlbumGrid>{mediaViews}</AlbumGrid>
      </React.Fragment>
    );
  }

  if (media.length === 0) {
    return <Loader />;
  }
  return (
    <Wrapper>
      {toPairs(mediaGroupedByMonth).map(([key, value]) => collectionView(key, value, 'month'))}
      {toPairs(mediaGroupedByYear).map(([key, value]) => collectionView(key, value, 'year'))}
    </Wrapper>
  );
}

export default RecentlyAddedLibrary;
