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
    this.handleKeypress = this.handleKeypress.bind(this);

    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.addEventListener(Events.playbackProgressDidChange, this.updateState);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleKeypress);
  }

  handleKeypress(e) {
    e.preventDefault();
    switch (e.key) {
      case ' ':
        this.togglePlay();
        break;
      default:
        break;
    }
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
    const {
      bitrate,
      nowPlayingItem,
      currentBufferedProgress,
      playbackMillis,
      isPlaying,
    } = this.state;

    const progressMax = nowPlayingItem !== null ?
      nowPlayingItem.attributes.durationInMillis : 0;

    const { PlaybackStates } = window.MusicKit;
    const {
      onSeek,
      onPlaybackChange,
      onPrevious,
      onNext,
      playbackState,
      hasPrevious,
      hasNext,
    } = this.props;

    const isBuffering = playbackState === PlaybackStates.waiting ||
    playbackState === PlaybackStates.loading;

    return (
      <div className={styles.container}>
        <div className={styles['progress-bar']}>
          <ProgressBar
            className={controlsStyles.ProgressBar}
            childClasses={{
              buffered: controlsStyles['ProgressBar-buffered'],
              elapsed: controlsStyles['ProgressBar-elapsed'],
              intent: controlsStyles['ProgressBar-intent'],
              handle: controlsStyles['ProgressBar-handle'],
              seek: controlsStyles['ProgressBar-seek'],
            }}
            extraClasses={[
              nowPlayingItem !== null ? controlsStyles.isSeekable : '',
              playbackState === PlaybackStates.loading ? controlsStyles.isLoading : '',
            ].join(' ')}
            bufferedTime={currentBufferedProgress * (playbackMillis / 1000)}
            currentTime={playbackMillis / 1000}
            totalTime={progressMax / 1000}
            isSeekable={nowPlayingItem !== null}
            onSeek={onSeek}
          />
        </div>
        <div className={styles['time-marker']}>
          <TimeMarker
            currentTime={playbackMillis / 1000}
            totalTime={progressMax / 1000}
            markerSeparator="/"
          />
        </div>
        <div className={styles['playback-controls']}>
          <PlaybackControls
            className={controlsStyles.TimeMarker}
            childClasses={controlsStyles}
            extraClasses={[
              nowPlayingItem !== null ? controlsStyles.isPlayable : '',
              isPlaying ? controlsStyles.isPlaying : '',
            ].join(' ')}
            isPlaying={isPlaying}
            isPlayable={!isBuffering && nowPlayingItem !== null}
            hasPrevious={!isBuffering && hasPrevious}
            hasNext={!isBuffering && hasNext}
            onPrevious={onPrevious}
            onNext={onNext}
            onPlaybackChange={onPlaybackChange}
          />
        </div>
        <span className={styles.bitrate}>{bitrate}kbps</span>
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
  playbackState: PropTypes.number.isRequired,
};

export default PlayerControls;
