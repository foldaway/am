import React, { Component } from 'react';
import { PlaybackControls, TimeMarker, ProgressBar, VolumeSlider, ControlDirection } from 'react-player-controls';
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
      playbackTime: 0,
      playbackDuration: 0,
      currentBufferedProgress: 0,
      volume: 1,
    };

    this.togglePlay = this.togglePlay.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);

    player.addEventListener(Events.playbackStateWillChange, this.updateState);
    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.addEventListener(Events.playbackProgressDidChange, this.updateState);
    player.addEventListener(Events.playbackVolumeDidChange, this.updateState);
    player.addEventListener(Events.mediaCanPlay, this.updateState);
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleKeypress);
  }

  handleKeypress(e) {
    if (document.activeElement.nodeName === 'INPUT') {
      return;
    }
    switch (e.key) {
      case ' ':
        e.preventDefault();
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
      playbackTime: player.currentPlaybackTime,
      playbackDuration: player.currentPlaybackDuration,
      currentBufferedProgress: player.currentBufferedProgress,
      nowPlayingItem: player.nowPlayingItem,
      isPlaying: player.isPlaying,
      volume: player.volume,
    });
  }

  render() {
    const {
      bitrate,
      nowPlayingItem,
      currentBufferedProgress,
      playbackTime,
      playbackDuration,
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
            bufferedTime={(currentBufferedProgress / 100) * playbackDuration}
            currentTime={playbackTime}
            totalTime={progressMax / 1000}
            isSeekable={nowPlayingItem !== null}
            onSeek={onSeek}
          />
        </div>
        <div className={styles['time-marker']}>
          <TimeMarker
            currentTime={playbackTime}
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
        <div className={styles.volume}>
          <VolumeSlider
            className={controlsStyles.VolumeSlider}
            childClasses={{
              value: controlsStyles['VolumeSlider-value'],
              intent: controlsStyles['VolumeSlider-intent'],
              handle: controlsStyles['VolumeSlider-handle'],
              seek: controlsStyles['VolumeSlider-seek'],
            }}
            extraClasses={[
              controlsStyles.isEnabled,
              controlsStyles.isHorizontal,
            ].join(' ')}
            direction={ControlDirection.HORIZONTAL}
            volume={this.state.volume}
            isEnabled={!isBuffering && nowPlayingItem !== null}
            onVolumeChange={this.props.onVolumeChange}
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
  onVolumeChange: PropTypes.func.isRequired,
  playbackState: PropTypes.number.isRequired,
};

export default PlayerControls;
