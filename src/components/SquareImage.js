import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

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
`;

const Spacer = styled.svg`
  width: 100%;
  height: auto;
`;

function SquareImage(props) {
  const { src, srcSet, alt } = props;
  return (
    <ArtWrapper {...props}>
      <Spacer viewBox="0 0 1 1" />
      <Image src={src} srcSet={srcSet} alt={alt} />
    </ArtWrapper>
  );
}

SquareImage.defaultProps = {
  src: null,
  srcSet: null,
  alt: '',
};

SquareImage.propTypes = {
  src: PropTypes.string,
  srcSet: PropTypes.string,
  alt: PropTypes.string,
};

export default SquareImage;
