import styled from 'styled-components';

const LargeTitle = styled.h1`
  font-size: 1.6em;
  font-weight: 700;
  color: ${(props) => props.theme.text.primary};
  margin: 0;
`;

export default LargeTitle;
