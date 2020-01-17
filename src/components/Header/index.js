import React from 'react';

import styled from 'styled-components';
import LargeTitle from '../large-title';

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
`;

const BrandTitle = styled(LargeTitle)`
  color: ${(props) => props.theme.branding};
  text-align: center;
`;

const Version = styled.span`
  color: ${(props) => props.theme.text.tertiary};
  font-size: 0.7rem;
  text-align: center;
`;

const Header = () => (
  <Wrapper>
    <BrandTitle>AM</BrandTitle>
    <Version>{process.env.COMMIT_REF || 'dev'}</Version>
  </Wrapper>
);

export default Header;
