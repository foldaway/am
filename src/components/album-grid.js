import styled from 'styled-components';

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 190px));
  grid-column-gap: 30px;
  grid-row-gap: 30px;
`;

export default AlbumGrid;
