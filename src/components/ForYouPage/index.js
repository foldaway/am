import React, { Component } from 'react';
import PropTypes from 'prop-types';

import recPropType from '../../prop_types/recommendation';

import styles from './styles.scss';
import Album from '../Album';
import Playlist from '../Playlist';
import Loader from '../Loader';

const Recommendation = (props) => {
  const {
    rec: { attributes, id, relationships },
    onAlbumSelected,
    onPlaylistSelected,
  } = props;
  const { title, reason } = attributes;
  const { data } = (relationships.recommendations || relationships.contents);
  let views = null;
  let extraClass = '';

  switch (data[0].type) {
    case 'playlists':
      views = data.map((p) => <Playlist key={p.id} playlist={p} onSelected={() => onPlaylistSelected('playlist', p)} />);
      break;
    case 'personal-recommendation':
      views = data.map((rec) => (<Recommendation
        key={rec.id}
        rec={rec}
        onAlbumSelected={onAlbumSelected}
        onPlaylistSelected={onPlaylistSelected}
      />));
      extraClass = styles['two-grid'];
      break;
    case 'albums':
      views = data.map((album) => (<Album
        key={album.id}
        album={album}
        onSelected={onAlbumSelected}
      />));
      break;
    default:
      views = null;
      break;
  }

  return (
    <div className={[styles.recommendation, extraClass].join(' ')} key={id}>
      {
        title ? <div className={styles.line} /> : null
      }
      {
        title ? <span className={styles.title}>{title.stringForDisplay}</span> : null
      }
      {
        reason ? <span className={styles.reason}>{reason.stringForDisplay}</span> : null
      }
      <div className={styles.content}>
        { views }
      </div>
    </div>
  );
};

Recommendation.propTypes = {
  rec: recPropType.isRequired,
  onAlbumSelected: PropTypes.func.isRequired,
  onPlaylistSelected: PropTypes.func.isRequired,
};

class ForYouPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recommendations: [],
    };

    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const recommendations = await window.MusicKitInstance.api.collection('me', 'recommendations');
    this.setState({
      recommendations,
    });
  }

  render() {
    const { onAlbumSelected, onPlaylistSelected } = this.props;
    const { recommendations } = this.state;
    return (
      <div className={styles.container}>
        <span className={styles.title}>For You</span>
        {
          recommendations.length > 0 ? recommendations.map((rec) => (
            <Recommendation
              rec={rec}
              key={rec.id}
              onAlbumSelected={onAlbumSelected}
              onPlaylistSelected={onPlaylistSelected}
            />
          )) : <Loader />
        }
      </div>
    );
  }
}

ForYouPage.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
  onPlaylistSelected: PropTypes.func.isRequired,
};

export default ForYouPage;