import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Album from '../Album';
import Loader from '../Loader';

import { imgURLGen, srcSetGen } from '../../util/img';
import fetchArtistImage from '../../util/fetch-artist-img';

class ArtistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
      albums: [],
      bannerURL: null,
    };

    this.fetchBanner = this.fetchBanner.bind(this);
    this.fetchArtistData = this.fetchArtistData.bind(this);
  }

  componentDidMount() {
    this.fetchArtistData();
  }

  async fetchBanner() {
    const { url } = this.state.artist.attributes;
    const bannerURL = await fetchArtistImage(url);

    this.setState({
      bannerURL,
    });
  }

  async fetchArtistData() {
    const artistID = Buffer.from(this.props.match.params.artistID, 'base64').toString('ascii');
    const artist = await window.MusicKitInstance.api.artist(artistID);
    this.setState({ artist });
    const albums = await window.MusicKitInstance.api.collection('catalog', `artists/${artistID}/albums`);
    this.setState({
      albums,
    });
    this.fetchBanner();
  }

  render() {
    const { onAlbumSelected, onSongSelected } = this.props;
    const { artist, bannerURL } = this.state;
    if (artist === null) {
      return <Loader />;
    }
    return (
      <div className={styles.container}>
        <div className={styles.banner}>
          {
            this.state.bannerURL !== null ? (
              <div className={styles['image-container']}>
                <img className={styles.art} src={imgURLGen(bannerURL, { w: 75 })} srcSet={srcSetGen(bannerURL)} alt="artist artwork" />
              </div>
            ) : <Loader />
          }
          <span className={styles.title}>
            {artist.attributes.name}
          </span>
        </div>
        <div className={styles.albums}>
          {
            this.state.albums.map((album) => (
              <Album key={album.id} album={album} onSelected={onAlbumSelected} />
            ))
          }
        </div>
      </div>
    );
  }
}

ArtistPage.propTypes = {
  match: PropTypes.object.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default ArtistPage;
