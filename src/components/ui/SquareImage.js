import React from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import LazyImage from 'react-lazy-progressive-image';
import { IoIosMusicalNotes } from 'react-icons/io';

const ArtWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  transition: 200ms transform;
  background: ${(props) => props.theme.background.secondary};
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 200ms filter;

  ${(props) => props.loading
    && props.src
    && css`
      filter: blur(5px);
    `}

  ${(props) => !props.src
    && css`
      display: none;
    `}
`;

const Spacer = styled.svg`
  width: 100%;
  height: auto;
`;

const FallbackImage = styled(IoIosMusicalNotes)`
  position: absolute;
  width: 55%;
  height: 55%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function SquareImage(props) {
  const { artwork, alt } = props;
  const { formatArtworkURL } = window.MusicKit;
  return (
    <ArtWrapper {...props}>
      <Spacer viewBox="0 0 1 1" />
      <FallbackImage />
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
