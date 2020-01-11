import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { imgURLGen, srcSetGen } from '../../util/img';

import Song from '../Song';
import Loader from '../Loader';

import styles from './styles.scss';

/* eslint-disable no-await-in-loop */

function PlaylistLibrary({ match, isLibrary, onSongSelected }) {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    async function loadPlaylistMetadata() {
      setPlaylist(null);
      const playlistID = Buffer.from(
        match.params.playlistID,
        'base64',
      ).toString('ascii');
      const requestAPI = isLibrary
        ? window.MusicKitInstance.api.library
        : window.MusicKitInstance.api;
      setPlaylist(await requestAPI.playlist(playlistID));
    }
    loadPlaylistMetadata();
  }, []);

  useEffect(() => {
    async function loadTracks() {
      let prevLength = 0;
      let offset = 0;

      setSongs([]);
      const playlistID = Buffer.from(
        match.params.playlistID,
        'base64',
      ).toString('ascii');

      if (isLibrary) {
        do {
          let temp;
          try {
            temp = await window.MusicKitInstance.api.library.request(
              `me/library/playlists/${playlistID}/tracks`,
              {
                offset,
                include: ['curator'],
              },
            );
          } catch (e) {
            // MusicKit JS throws exception from server 404 when offset > playlist total songs
            temp = [];
          }
          prevLength = temp.length;
          offset += temp.length;

          setSongs((prevState) => [...prevState, ...temp]);
        } while (prevLength > 0);
      } else {
        const { relationships } = await window.MusicKitInstance.api.playlist(
          playlistID,
        );
        setSongs(relationships.tracks.data);
      }
    }

    loadTracks();
  }, []);

  if (playlist === null) {
    return <Loader />;
  }
  const { attributes } = playlist;
  const artworkURL = attributes.artwork ? attributes.artwork.url : '';
  const description = 'description' in attributes ? attributes.description.standard : '';
  return (
    <div className={styles.container}>
      <img
        className={styles.art}
        src={imgURLGen(artworkURL, { w: 75 })}
        srcSet={srcSetGen(artworkURL)}
        alt="Playlist artwork"
      />
      <span className={styles.title}>{attributes.name}</span>
      <span className={styles.metadata}>
        {songs.length}
        {' '}
songs
      </span>
      <p className={styles.description}>{description}</p>
      <div className={styles.songs}>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <Song
              key={song.id}
              song={song}
              onSelected={() => onSongSelected(playlist, index)}
            />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

PlaylistLibrary.propTypes = {
  isLibrary: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default PlaylistLibrary;
