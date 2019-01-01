import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { imgURLGen, srcSetGen } from '../../util/img';
import fetchArtistImage from '../../util/fetch-artist-img';
import artistPropType from '../../prop_types/artist';
import styles from './styles.scss';

class Artist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: null,
    };
    this.fetchImage = this.fetchImage.bind(this);
  }

  componentDidMount() {
    if (this.props.artwork) {
      this.fetchImage();
    }
  }

  async fetchImage() {
    const { url } = this.props.artist.attributes;
    const imageURL = await fetchArtistImage(url);

    this.setState({
      imageURL,
    });
  }

  render() {
    const { artist, artwork } = this.props;
    const { imageURL } = this.state;
    return (
      <div className={styles.container}>
        { artwork && imageURL ? (
          <img className={styles.art} src={imgURLGen(imageURL, { w: 75 })} srcSet={srcSetGen(imageURL)} alt="artist artwork" />
        ) : null }
        <span className={styles.name}>{artist.attributes.name}</span>
      </div>
    );
  }
}

Artist.defaultProps = {
  artwork: false,
};

Artist.propTypes = {
  artist: artistPropType.isRequired,
  artwork: PropTypes.bool,
};

export default Artist;
