import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AlbumSong from '../AlbumSong';
import Loader from '../Loader';

import styles from './styles.scss';

import { imgURLGen, srcSetGen } from '../../util/img';
import albumPropType from '../../prop_types/album';

function Album({ album, onSelected }) {
  const [songs, setSongs] = useState([]);
  const [songListVisible, setSongListVisible] = useState(false);

  async function loadTracks() {
    const { isLibrary } = album.attributes.playParams;
    const api = isLibrary
      ? window.MusicKitInstance.api.library
      : window.MusicKitInstance.api;
    const { relationships } = await api.album(album.id);
    setSongs(relationships.tracks.data);
    window.scrollBy(0, 20);
  }

  function toggleSongList() {
    if (songs.length === 0) {
      loadTracks();
    }
    setSongListVisible(!songListVisible);
  }

  const { url } = album.attributes.artwork || { url: '' };

  return (
    <div
      className={styles.container}
      onClick={toggleSongList}
      role="presentation"
    >
      <div className={styles['art-container']}>
        <svg className={styles.spacer} viewBox="0 0 1 1" />
        <img
          className={styles.art}
          src={imgURLGen(url, { w: 75 })}
          srcSet={srcSetGen(url)}
          alt="album artwork"
        />
      </div>
      <span className={styles.title}>{album.attributes.name}</span>
      <span className={styles.artist}>{album.attributes.artistName}</span>
      <div className={styles.songs}>
        {songListVisible && songs.length > 0
          ? songs.map((song, index) => (
            <AlbumSong
              key={song.id}
              song={song}
              onSelected={() => onSelected(album, index)}
            />
          ))
          : null}
        {songListVisible && songs.length === 0 ? (
          <div>
            <Loader />
          </div>
        ) : null}
      </div>
    </div>
  );
}

Album.defaultProps = {
  onSelected: () => {},
};

Album.propTypes = {
  album: albumPropType.isRequired,
  onSelected: PropTypes.func,
};

export default Album;
