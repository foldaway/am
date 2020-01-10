import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import recPropType from '../../prop_types/recommendation';

import styles from './styles.scss';
import Album from '../Album';
import Playlist from '../Playlist';
import Loader from '../Loader';

const Recommendation = (props) => {
  const {
    rec: { attributes, id, relationships },
    onAlbumSelected,
  } = props;
  const { title, reason } = attributes;
  const { data } = relationships.recommendations || relationships.contents;
  let views = null;
  let extraClass = '';

  switch (data[0].type) {
    case 'playlists':
      views = data.map((p) => (
        <Link
          key={p.id}
          href={`/playlist/${Buffer.from(p.id).toString('base64')}`}
          to={`/playlist/${Buffer.from(p.id).toString('base64')}`}
        >
          <Playlist playlist={p} />
        </Link>
      ));
      break;
    case 'personal-recommendation':
      views = data.map((rec) => (
        <Recommendation
          key={rec.id}
          rec={rec}
          onAlbumSelected={onAlbumSelected}
        />
      ));
      extraClass = styles['two-grid'];
      break;
    case 'albums':
      views = data.map((album) => (
        <Album key={album.id} album={album} onSelected={onAlbumSelected} />
      ));
      break;
    default:
      views = null;
      break;
  }

  return (
    <div className={[styles.recommendation, extraClass].join(' ')} key={id}>
      {title ? <div className={styles.line} /> : null}
      {title ? (
        <span className={styles.title}>{title.stringForDisplay}</span>
      ) : null}
      {reason ? (
        <span className={styles.reason}>{reason.stringForDisplay}</span>
      ) : null}
      <div className={styles.content}>{views}</div>
    </div>
  );
};

Recommendation.propTypes = {
  rec: recPropType.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
};

function ForYouPage({ onAlbumSelected }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function fetch() {
      setRecommendations(
        await window.MusicKitInstance.api.collection('me', 'recommendations'),
      );
    }
    fetch();
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.title}>For You</span>
      {recommendations.length > 0 ? (
        recommendations.map((rec) => (
          <Recommendation
            rec={rec}
            key={rec.id}
            onAlbumSelected={onAlbumSelected}
          />
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
}

ForYouPage.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default ForYouPage;
