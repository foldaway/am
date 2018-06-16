import React, { Component } from 'react';

import styles from './styles.scss';

const padTimeUnit = (time) => (time < 10 ? `0${time.toFixed(0)}` : time.toFixed(0));

const getFormattedTime = (ms) => {
  let seconds = ms / 1000;
  const hours = parseInt(seconds / 3600, 10);
  seconds %= 3600;
  const minutes = parseInt(seconds / 60, 10);
  seconds %= 60;
  return hours === 0 ? `${padTimeUnit(minutes)}:${padTimeUnit(seconds)}` : `${padTimeUnit(hours)}:${padTimeUnit(minutes)}`;
};

class PlayerControls extends Component {
  constructor(props) {
    super(props);

    const { player } = window.MusicKitInstance;
    const { PlaybackStates, Events } = window.MusicKit;

    this.state = {
      bitrate: 0,
      isPlaying: false,
      nowPlayingItem: null,
      playbackMillis: 0,
      playbackState: PlaybackStates.none,
    };

    this.togglePlay = this.togglePlay.bind(this);
    this.updateState = this.updateState.bind(this);

    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.addEventListener(Events.playbackProgressDidChange, this.updateState);
  }

  togglePlay() {
    if (this.state.isPlaying) {
      window.MusicKitInstance.pause();
    } else {
      window.MusicKitInstance.play();
    }
  }

  updateState() {
    const { player } = window.MusicKitInstance;
    this.setState({
      bitrate: player.bitrate,
      playbackMillis: player.currentPlaybackTime * 1000,
      playbackState: player.playbackState,
      nowPlayingItem: player.nowPlayingItem,
      isPlaying: player.isPlaying,
    });
  }

  render() {
    const { PlaybackStates } = window.MusicKit;
    const { player } = window.MusicKitInstance;
    const progressValue = this.state.playbackState === PlaybackStates.playing ?
      this.state.playbackMillis : null;
    const progressMax = this.state.nowPlayingItem !== null ?
      this.state.nowPlayingItem.attributes.durationInMillis : 0;
    return (
      <div className={styles.container}>
        <progress value={progressValue} max={progressMax} />
        <span className={styles['current-time']}>{getFormattedTime(this.state.playbackMillis)}</span>
        <span className={styles.duration}>{getFormattedTime(progressMax)}</span>
        <span className={styles.bitrate}>{this.state.bitrate}kbps</span>
        <button className={styles['play-pause']} onClick={this.togglePlay}>
          { this.state.isPlaying ? 'Pause' : 'Play' }
        </button>
        <button className={styles.next} onClick={() => player.skipToNextItem()}>Next</button>
      </div>
    );
  }
}

export default PlayerControls;
