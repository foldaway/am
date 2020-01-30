import React, { useState } from 'react';
import styled from 'styled-components';
import LargeTitle from './ui/LargeTitle';
import chartPropType from '../prop_types/chart';
import AlbumGrid from './ui/AlbumGrid';
import Album from './Album';
import { playSongs } from '../util/play';
import Song from './Song';
import Playlist from './Playlist';
import Loader from './Loader';
import MusicVideo from './MusicVideo';

const Wrapper = styled.div``;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${LargeTitle} {
    margin-top: 32px;
    margin-bottom: 16px;
    flex: 1 0 auto;
  }
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 0.9em;
  font-weight: 500;
  color: ${(props) => props.theme.branding};

  flex: 0 0 auto;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

function Chart(props) {
  const { chart } = props;

  const [chartData, setChartData] = useState(chart.data);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchMore() {
    const mediaType = chart.data[0].type;
    setIsLoading(true);
    const data = await window.MusicKitInstance.api.charts([mediaType], {
      chart: chart.chart,
      offset: chartData.length,
      limit: 10,
    });

    setIsLoading(false);

    setChartData((prevState) => [...prevState, ...data[mediaType][0].data]);
  }

  function mediaView(data, index) {
    switch (data.type) {
      case 'albums':
        return <Album album={data} />;
      case 'songs':
        return <Song song={data} onClick={() => playSongs(chartData, index)} />;
      case 'playlists':
        return <Playlist playlist={data} />;
      case 'music-videos':
        return <MusicVideo musicVideo={data} />;
      default:
        return null;
    }
  }

  return (
    <Wrapper>
      <Header>
        <LargeTitle>{chart.name}</LargeTitle>
        <MoreButton onClick={fetchMore}>Fetch More</MoreButton>
      </Header>
      <AlbumGrid>{chartData.map(mediaView)}</AlbumGrid>
      {isLoading && <Loader />}
    </Wrapper>
  );
}

Chart.propTypes = {
  chart: chartPropType.isRequired,
};

export default Chart;
