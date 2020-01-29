import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { imgURLGen, srcSetGen } from '../util/img';
import fetchArtistImage from '../util/fetch-artist-img';
import artistPropType from '../prop_types/artist';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const Art = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${(props) => props.theme.background.secondary};
  font-size: 0.7em;
  text-align: center;
`;

const Title = styled.span`
  color: ${(props) => props.theme.text.primary};
  font-weight: 500;
  font-size: 0.9em;
`;

function Artist({ artist, artwork, onClick }) {
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
    <Wrapper onClick={onClick}>
      <Art src={src} srcSet={srcSet} alt="artist image" />
      <Title>{artist.attributes.name}</Title>
    </Wrapper>
  );
}

Artist.defaultProps = {
  artwork: false,
  onClick: () => {},
};

Artist.propTypes = {
  artist: artistPropType.isRequired,
  artwork: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Artist;
