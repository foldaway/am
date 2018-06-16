import React, { Component } from 'react';

import Song from '../Song';
import PlayerControls from '../PlayerControls';

import trackPropType from '../../prop_types/track';

import styles from './styles.scss';

class Player extends Component {
  constructor(props) {
    super(props);

    this.hack = this.hack.bind(this);
    this.hack();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.song.id !== prevProps.song.id) {
      await window.MusicKitInstance.stop();
      await window.MusicKitInstance.setQueue({ items: [this.props.song] });
      await window.MusicKitInstance.play();
    }
  }

  // Get MusicKit JS to play the file once when this component initialises
  // Otherwise the first media played never works
  async hack() {
    await window.MusicKitInstance.player.prepareToPlay();
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
