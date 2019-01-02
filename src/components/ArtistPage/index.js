import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Album from '../Album';
import Loader from '../Loader';
import Song from '../Song';
import Modal from '../Modal';

import { imgURLGen, srcSetGen } from '../../util/img';
import fetchArtistImage from '../../util/fetch-artist-img';
import MusicVideo from '../MusicVideo';

class ArtistPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
      albums: [],
      songs: [],
      musicVideos: [],
      playlists: [],
      currentMusicVideo: null,
      bannerURL: null,
    };

    this.fetchBanner = this.fetchBanner.bind(this);
    this.fetchArtistData = this.fetchArtistData.bind(this);
  }

  componentDidMount() {
    this.fetchArtistData();
  }

  getLatestRelease() {
    return this.state.albums[0];
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
    const songs = await window.MusicKitInstance.api.collection('catalog', `artists/${artistID}/songs`);
    const musicVideos = await window.MusicKitInstance.api.collection('catalog', `artists/${artistID}/music-videos`);
    // Sort albums by latest first
    albums.sort((a, b) => new Date(b.attributes.releaseDate) - new Date(a.attributes.releaseDate));
    this.setState({
      albums,
      songs,
      musicVideos,
    });
    this.fetchBanner();
  }

  render() {
    const { onAlbumSelected, onSongSelected } = this.props;
    const {
      artist,
      albums,
      bannerURL,
      songs,
      musicVideos,
      currentMusicVideo,
    } = this.state;
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
        <div className={styles['latest-release-container']}>
          <span className={styles.title}>Latest Release</span>
          {
            albums && albums.length > 0 ? (
              <div className={styles['latest-release']}>
                <Album album={albums[0]} onSelected={onAlbumSelected} />
              </div>
            ) : null
          }
        </div>
        <div className={styles['top-songs-container']}>
          <span className={styles.title}>Top Songs</span>
          <div className={styles.songs}>
            {
              songs.map((song, index) => (
                <Song key={song.id} song={song} onSelected={() => onSongSelected(songs, index)} />
              ))
            }
          </div>
        </div>
        <div className={styles['albums-container']}>
          <span className={styles.title}>Albums</span>
          <div className={styles.albums}>
            {
              albums.slice(1).map((album) => (
                <Album key={album.id} album={album} onSelected={onAlbumSelected} />
              ))
            }
          </div>
        </div>
        <div className={styles['music-videos-container']}>
          <span className={styles.title}>Music Videos</span>
          <div className={styles['music-videos']}>
            {
              musicVideos.map((musicVideo) => (
                <MusicVideo
                  musicVideo={musicVideo}
                  onSelected={() => this.setState({ currentMusicVideo: musicVideo })}
                />
              ))
            }
          </div>
        </div>
        {
          currentMusicVideo ? (
            <Modal onClose={() => this.setState({ currentMusicVideo: null })}>
              <div className={styles['current-music-video']}>
                <span className={styles.title}>Music Video Preview</span>
                <video controls autoPlay>
                  <source src={currentMusicVideo.attributes.previews[0].hlsUrl} />
                  <source src={currentMusicVideo.attributes.previews[0].url} />
                  Your browser cannot play this video
                </video>
                <a
                  className={styles.metadata}
                  href={currentMusicVideo.attributes.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MusicVideo musicVideo={currentMusicVideo} />
                </a>
              </div>
              
            </Modal>
          ) : null
        }
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
