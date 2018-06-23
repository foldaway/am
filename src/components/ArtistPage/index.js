import React, { Component } from 'react';
import ogs from 'open-graph-scraper';

import artistPropType from '../../prop_types/artist';
import styles from './styles.scss';
import Album from '../Album';
import Loader from '../Loader';

class ArtistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      bannerURL: null,
    };

    this.fetchBanner = this.fetchBanner.bind(this);
    this.fetchArtistData = this.fetchArtistData.bind(this);
  }

  componentDidMount() {
    this.fetchBanner();
    this.fetchArtistData();
  }

  async fetchBanner() {
    const { url } = this.props.artist.attributes;
    const { success, data } = await ogs({ url });

    if (!success) {
      return;
    }

    this.setState({
      bannerURL: data.ogImage.url,
    });
  }

  async fetchArtistData() {
    const { id } = this.props.artist;
    const albums = await window.MusicKitInstance.api.collection('catalog', `artists/${id}/albums`);
    this.setState({
      albums,
    });
  }

  render() {
    const { artist } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.banner}>
          {
            this.state.bannerURL !== null ? (
              <img src={this.state.bannerURL} alt="" />
            ) : <Loader />
          }
          <span className={styles.title}>
            {artist.attributes.name}
          </span>
        </div>
        <div className={styles.albums}>
          {
            this.state.albums.map((album) => (
              <Album album={album} />
            ))
          }
        </div>
      </div>
    );
  }
}

ArtistPage.propTypes = {
  artist: artistPropType.isRequired,
};

export default ArtistPage;
