import React from 'react';
import { BarLoader } from 'react-spinners';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  height: 100%;
`;

const StyledBarLoader = styled(BarLoader).attrs((props) => ({
  color: props.theme.branding,
}))``;

const Loader = () => (
  <Wrapper>
    <StyledBarLoader />
  </Wrapper>
);

export default Loader;
