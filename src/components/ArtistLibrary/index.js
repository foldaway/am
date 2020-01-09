import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Loader from '../Loader';
import Artist from '../Artist';
import Album from '../Album';

/* eslint-disable no-await-in-loop */

function ArtistLibrary({ onAlbumSelected }) {
  const [artists, setArtists] = useState([]);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [indivAlbums, setIndivAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      let temp = [];
      let results = [];
      do {
        results = await window.MusicKitInstance.api.library.artists(null, {
          limit: 100,
          offset: temp.length,
        });
        temp = temp.concat(results);
      } while (results.length > 0);

      setArtists(temp);
    }

    load();
  }, []);

  useEffect(() => {
    if (currentArtist === null) {
      return;
    }
    setIsLoading(true);
    async function loadIndiv() {
      const { id } = currentArtist;
      const {
        relationships,
      } = await window.MusicKitInstance.api.library.artist(id, {
        include: ['albums'],
      });
      setIsLoading(false);

      setIndivAlbums(relationships.albums.data);
    }

    loadIndiv();
  }, [currentArtist]);

  function getIndivView() {
    if (isLoading) {
      return <Loader />;
    }
    return (
      <div className={styles.indiv}>
        <span className={styles.title}>
          {currentArtist !== null ? currentArtist.attributes.name : ''}
        </span>
        <span className={styles['album-count']}>
          {indivAlbums.length > 0 ? `${indivAlbums.length} albums` : null}
        </span>
        <div className={styles.albums}>
          {indivAlbums.length > 0
            ? indivAlbums.map((album) => (
              <Album
                key={album.id}
                album={album}
                onSelected={onAlbumSelected}
              />
            ))
            : null}
          {currentArtist !== null && indivAlbums.length === 0 ? (
            <Loader />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles['artist-list']}>
        {artists.length > 0 ? (
          artists.map((artist) => (
            <div
              className={styles['artist-container']}
              onClick={() => setCurrentArtist(artist)}
              role="presentation"
            >
              <Artist artist={artist} />
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
      {getIndivView()}
    </div>
  );
}

ArtistLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default ArtistLibrary;
