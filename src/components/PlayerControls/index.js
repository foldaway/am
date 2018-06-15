import React, { Component } from 'react';

import styles from './styles.scss';

class PlayerControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bitrate: 0,
      isPlaying: false,
      nowPlayingItem: null,
      currentPlaybackTime: 0,
    };

    this.togglePlay = this.togglePlay.bind(this);
    this.updateState = this.updateState.bind(this);

    const { player } = window.MusicKitInstance;
    const { Events } = window.MusicKit;

    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.addEventListener(Events.playbackProgressDidChange, this.updateState);
  }

  updateState() {
    const { player } = window.MusicKitInstance;
    this.setState({
      bitrate: player.bitrate,
      currentPlaybackTime: player.currentPlaybackTime,
      nowPlayingItem: player.nowPlayingItem,
      isPlaying: player.isPlaying,
    });
  }

  togglePlay() {
    if (this.state.isPlaying) {
      window.MusicKitInstance.pause();
    } else {
      window.MusicKitInstance.play();
    }
  }

  render() {
    const { player } = window.MusicKitInstance;
    const progressMax = this.state.nowPlayingItem !== null ?
      this.state.nowPlayingItem.attributes.durationInMillis : 0;
    return (
      <div className={styles.container}>
        {
          this.state.nowPlayingItem !== null ? (
            <div>
              <span>{this.state.nowPlayingItem.attributes.name}</span>
              <span>{this.state.nowPlayingItem.attributes.artistName}</span>
              <span>{this.state.nowPlayingItem.attributes.albumName}</span>
            </div>
          ) : null
        }
        <button className={styles['play-pause']} onClick={this.togglePlay}>
          { this.state.isPlaying ? 'Pause' : 'Play' }
        </button>
        <button className={styles.next} onClick={() => player.skipToNextItem()}>Next</button>
        <progress value={this.state.currentPlaybackTime * 1000} max={progressMax} />
        <span className={styles['current-time']}>{this.state.currentPlaybackTime}s</span>
        <span className={styles.duration}>{progressMax / 1000}s</span>
        <span className={styles.bitrate}>{this.state.bitrate}</span>
      </div>
    );
  }
}

export default PlayerControls;
