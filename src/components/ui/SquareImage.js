import React from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import { IoIosMusicalNotes } from 'react-icons/io';

const ArtWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  ${(props) => (props.roundedCorners ? 'border-radius: 6px;' : '')}
  ${(props) => (props.shadow
    ? 'box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);'
    : '')}
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
      <Image
        loading="lazy"
        src={formatArtworkURL(artwork, 300, 300)}
        alt={alt}
      />
    </ArtWrapper>
  );
}

SquareImage.defaultProps = {
  artwork: { url: '' },
  alt: '',
  shadow: true,
  roundedCorners: true,
};

SquareImage.propTypes = {
  artwork: PropTypes.shape(),
  alt: PropTypes.string,
  shadow: PropTypes.bool,
  roundedCorners: PropTypes.bool,
};

export default SquareImage;
