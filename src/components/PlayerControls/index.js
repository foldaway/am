import React, { Component } from 'react';
import { PlaybackControls, TimeMarker, ProgressBar } from 'react-player-controls';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import controlsStyles from './controls.scss';

class PlayerControls extends Component {
  constructor(props) {
    super(props);

    const { player } = window.MusicKitInstance;
    const { Events } = window.MusicKit;

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
    const progressMax = this.state.nowPlayingItem !== null ?
      this.state.nowPlayingItem.attributes.durationInMillis : 0;
    const { onSeek, onPlaybackChange, onPrevious, onNext } = this.props;
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
          extraClasses={this.state.nowPlayingItem !== null ? controlsStyles.isSeekable : null}
          bufferedTime={this.state.currentBufferedProgress * (this.state.playbackMillis / 1000)}
          currentTime={this.state.playbackMillis / 1000}
          totalTime={progressMax / 1000}
          isSeekable={this.state.nowPlayingItem !== null}
          onSeek={onSeek}
        />
        <TimeMarker
          currentTime={this.state.playbackMillis / 1000}
          totalTime={progressMax / 1000}
          markerSeparator="/"
        />
        <PlaybackControls
          className={controlsStyles.TimeMarker}
          childClasses={controlsStyles}
          extraClasses={this.state.nowPlayingItem !== null ? controlsStyles.isPlayable : null}
          isPlaying={this.state.isPlaying}
          isPlayable={this.state.nowPlayingItem !== null}
          hasPrevious={this.props.hasPrevious}
          hasNext={this.props.hasNext}
          onPrevious={onPrevious}
          onNext={onNext}
          onPlaybackChange={onPlaybackChange}
        />
        <span className={styles.bitrate}>{this.state.bitrate}kbps</span>
      </div>
    );
  }
}

PlayerControls.propTypes = {
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onSeek: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPlaybackChange: PropTypes.func.isRequired,
};

export default PlayerControls;
