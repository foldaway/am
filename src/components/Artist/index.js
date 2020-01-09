import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { imgURLGen, srcSetGen } from '../../util/img';
import fetchArtistImage from '../../util/fetch-artist-img';
import artistPropType from '../../prop_types/artist';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const Art = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 5px;
`;

const Title = styled.span``;

function Artist({ artist, artwork }) {
  const [imageURL, setImageURL] = useState(null);

  const { url } = artist.attributes;

  useEffect(() => {
    async function fetchData() {
      setImageURL(await fetchArtistImage(url));
    }

    fetchData();
  }, [url]);

  const isArtworkReady = artwork && imageURL;

  const src = isArtworkReady ? imgURLGen(imageURL, { w: 75 }) : null;
  const srcSet = isArtworkReady ? srcSetGen(imageURL) : null;

  return (
    <Wrapper>
      <Art src={src} srcSet={srcSet} alt="artist" />
      <Title>{artist.attributes.name}</Title>
    </Wrapper>
  );
}

Artist.defaultProps = {
  artwork: false,
};

Artist.propTypes = {
  artist: artistPropType.isRequired,
  artwork: PropTypes.bool,
};

export default Artist;
