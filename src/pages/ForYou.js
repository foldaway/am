import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import styled from 'styled-components';
import recPropType from '../prop_types/recommendation';

import Album from '../components/Album';
import Playlist from '../components/Playlist';
import Loader from '../components/Loader';
import LargeTitle from '../components/large-title';
import AlbumGrid from '../components/album-grid';
import { playAlbum } from '../util/play';

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

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Recommendation = (props) => {
  const {
    rec: { attributes, id, relationships },
  } = props;
  const { title, reason } = attributes;
  const { data } = relationships.recommendations || relationships.contents;
  const views = data.map((item) => {
    switch (item.type) {
      case 'playlists':
        return (
          <StyledLink
            key={item.id}
            href={`/playlist/${item.id}`}
            to={`/playlist/${item.id}`}
          >
            <Playlist playlist={item} />
          </StyledLink>
        );
      case 'personal-recommendation':
        return (
          <Recommendation
            key={item.id}
            rec={item}
            onAlbumSelected={playAlbum}
          />
        );
      case 'albums':
        return <Album key={item.id} album={item} onSelected={playAlbum} />;
      default:
        return null;
    }
  });

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
