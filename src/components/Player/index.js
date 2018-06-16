import React, { Component } from 'react';

import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import styles from './styles.scss';

class Player extends Component {
  async componentDidUpdate() {
    await window.MusicKitInstance.setQueue({ items: [this.props.song] });
    await window.MusicKitInstance.play();
  }

  render() {
    return (
      <div className={styles.container}>
        <Song song={this.props.song} />
        <PlayerControls />
      </div>
    );
  }
}

Player.propTypes = {
  song: trackPropType.isRequired,
};

export default Player;
