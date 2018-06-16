import React, { Component } from 'react';
import { PlaybackControls, TimeMarker, ProgressBar } from 'react-player-controls';

import styles from './styles.scss';
import controlsStyles from './controls.scss';

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
      currentBufferedProgress: 0,
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
      currentBufferedProgress: player.currentBufferedProgress,
      nowPlayingItem: player.nowPlayingItem,
      isPlaying: player.isPlaying,
    });
  }

  render() {
    const { player } = window.MusicKitInstance;
    const progressMax = this.state.nowPlayingItem !== null ?
      this.state.nowPlayingItem.attributes.durationInMillis : 0;
    return (
      <div className={styles.container}>
        <ProgressBar
          className={controlsStyles.ProgressBar}
          childClasses={{
            buffered: controlsStyles['ProgressBar-buffered'],
            elapsed: controlsStyles['ProgressBar-elapsed'],
            intent: controlsStyles['ProgressBar-intent'],
            handle: controlsStyles['ProgressBar-handle'],
            seek: controlsStyles['ProgressBar-seek'],
          }}
          extraClasses={this.state.nowPlayingItem !== null ? [
            controlsStyles.isSeekable,
          ] : []}
          bufferedTime={this.state.currentBufferedProgress * (this.state.playbackMillis / 1000)}
          currentTime={this.state.playbackMillis / 1000}
          totalTime={progressMax / 1000}
          isSeekable={this.state.nowPlayingItem !== null}
          onSeek={(time) => player.seekToTime(time)}
        />
        <TimeMarker
          currentTime={this.state.playbackMillis / 1000}
          totalTime={progressMax / 1000}
          markerSeparator="/"
        />
        <PlaybackControls
          className={controlsStyles.TimeMarker}
          childClasses={controlsStyles}
          extraClasses={this.state.nowPlayingItem !== null ? [
            controlsStyles.isPlayable,
          ] : []}
          isPlaying={this.state.isPlaying}
          isPlayable={this.state.nowPlayingItem !== null}
        />
        <span className={styles.bitrate}>{this.state.bitrate}kbps</span>
        {/* <button className={styles['play-pause']} onClick={this.togglePlay}>
          { this.state.isPlaying ? 'Pause' : 'Play' }
        </button>
        <button className={styles.next} onClick={() => player.skipToNextItem()}>Next</button> */}
      </div>
    );
  }
}

export default PlayerControls;
