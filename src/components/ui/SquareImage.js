import React from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import LazyImage from 'react-lazy-progressive-image';

const ArtWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  transition: 200ms transform;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: ${(props) => props.theme.background.secondary};
  transition: 200ms filter;

  ${(props) => props.loading
    && css`
      filter: blur(5px);
    `}
`;

const Spacer = styled.svg`
  width: 100%;
  height: auto;
`;

function SquareImage(props) {
  const { artwork, alt } = props;
  const { formatArtworkURL } = window.MusicKit;
  return (
    <ArtWrapper {...props}>
      <Spacer viewBox="0 0 1 1" />
      <LazyImage
        placeholder={formatArtworkURL(artwork, 30)}
        src={formatArtworkURL(artwork, 300)}
      >
        {(src, loading) => <Image src={src} loading={loading} alt={alt} />}
      </LazyImage>
    </ArtWrapper>
  );
}

SquareImage.defaultProps = {
  artwork: { url: '' },
  alt: '',
};

SquareImage.propTypes = {
  artwork: PropTypes.shape(),
  alt: PropTypes.string,
};

export default SquareImage;
