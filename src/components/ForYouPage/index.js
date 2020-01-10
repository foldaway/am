import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import styled from 'styled-components';
import recPropType from '../../prop_types/recommendation';

import Album from '../Album';
import Playlist from '../Playlist';
import Loader from '../Loader';
import LargeTitle from '../large-title';
import AlbumGrid from '../album-grid';

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 10px;
  align-items: center;
`;

const RecommendationWrapper = styled.div`
  display: grid;
  grid-row-gap: 5px;
  grid-template-rows: auto auto 1fr;
`;

const Line = styled.div`
  align-self: stretch;
  height: 1px;
  background-color: lightgray;
`;

const Reason = styled.span`
  color: $lightgray;
  font-size: 0.9em;
  font-weight: 300;
`;

const Recommendation = (props) => {
  const {
    rec: { attributes, id, relationships },
    onAlbumSelected,
  } = props;
  const { title, reason } = attributes;
  const { data } = relationships.recommendations || relationships.contents;
  let views = null;

  switch (data[0].type) {
    case 'playlists':
      views = data.map((p) => (
        <Link
          key={p.id}
          href={`/playlist/${Buffer.from(p.id).toString('base64')}`}
          to={`/playlist/${Buffer.from(p.id).toString('base64')}`}
        >
          <Playlist playlist={p} />
        </Link>
      ));
      break;
    case 'personal-recommendation':
      views = data.map((rec) => (
        <Recommendation
          key={rec.id}
          rec={rec}
          onAlbumSelected={onAlbumSelected}
        />
      ));
      break;
    case 'albums':
      views = data.map((album) => (
        <Album key={album.id} album={album} onSelected={onAlbumSelected} />
      ));
      break;
    default:
      views = null;
      break;
  }

  return (
    <RecommendationWrapper key={id}>
      {title && <Line />}
      {title && <LargeTitle>{title.stringForDisplay}</LargeTitle>}
      {reason && <Reason>{reason.stringForDisplay}</Reason>}
      <AlbumGrid>{views}</AlbumGrid>
    </RecommendationWrapper>
  );
};

Recommendation.propTypes = {
  rec: recPropType.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
};

function ForYouPage({ onAlbumSelected }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function fetch() {
      setRecommendations(
        await window.MusicKitInstance.api.collection('me', 'recommendations'),
      );
    }
    fetch();
  }, []);

  function renderRecs() {
    if (recommendations.length === 0) {
      return <Loader />;
    }
    return (
      <Fragment>
        {recommendations.map((rec) => (
          <Recommendation
            rec={rec}
            key={rec.id}
            onAlbumSelected={onAlbumSelected}
          />
        ))}
      </Fragment>
    );
  }

  return (
    <Wrapper>
      <LargeTitle>For You</LargeTitle>
      {renderRecs()}
    </Wrapper>
  );
}

ForYouPage.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default ForYouPage;
