import React, { useState, useEffect } from 'react';
import {
  PlaybackControls,
  TimeMarker,
  ProgressBar,
  VolumeSlider,
  ControlDirection,
} from 'react-player-controls';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import controlsStyles from './controls.scss';

function PlayerControls({
  onSeek,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  onVolumeChange,
}) {
  const { player } = window.MusicKitInstance;
  const { Events, PlaybackStates } = window.MusicKit;

  const [bitrate, setBitrate] = useState(player.bitrate);
  const [nowPlayingItem, setNowPlayingItem] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackState, setPlaybackState] = useState(player.playbackState);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [currentBufferedProgress, setCurrentBufferedProgress] = useState(0);
  const [volume, setVolume] = useState(player.volume);

  const progressMax = nowPlayingItem !== null ? nowPlayingItem.attributes.durationInMillis : 0;

  const isBuffering = playbackState === PlaybackStates.waiting
    || playbackState === PlaybackStates.loading;

  function onPlaybackChange() {
    switch (playbackState) {
      case PlaybackStates.playing:
        window.MusicKitInstance.pause();
        break;
      case PlaybackStates.paused:
        window.MusicKitInstance.play();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const playbackStateCb = ({ state }) => setPlaybackState(state);
    const progressCb = ({ currentPlaybackDuration, currentPlaybackTime }) => {
      setPlaybackTime(currentPlaybackTime);
      setPlaybackDuration(currentPlaybackDuration);
      setCurrentBufferedProgress(player.currentBufferedProgress);
    };
    const volumeCb = ({ volume: v }) => setVolume(v);
    const mediaItemDidChangeCb = ({ item }) => setNowPlayingItem(item);
    const bitrateCb = ({ bitrate: b }) => setBitrate(b);
    player.addEventListener(Events.playbackStateDidChange, playbackStateCb);
    player.addEventListener(Events.playbackTimeDidChange, progressCb);
    player.addEventListener(Events.playbackVolumeDidChange, volumeCb);
    player.addEventListener(Events.mediaItemDidChange, mediaItemDidChangeCb);
    player.addEventListener(Events.playbackBitrateDidChange, bitrateCb);

    return () => {
      player.removeEventListener(Events.playbackStateDidChange, playbackStateCb);
      player.removeEventListener(Events.playbackProgressDidChange, progressCb);
      player.removeEventListener(Events.playbackVolumeDidChange, volumeCb);
      player.removeEventListener(
        Events.mediaItemDidChange,
        mediaItemDidChangeCb,
      );
      player.removeEventListener(Events.playbackBitrateDidChange, bitrateCb);
    };
  }, []);

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
            playbackState === PlaybackStates.loading
              ? controlsStyles.isLoading
              : '',
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
            playbackState === PlaybackStates.playing
              ? controlsStyles.isPlaying
              : '',
          ].join(' ')}
          isPlaying={playbackState === PlaybackStates.playing}
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
          volume={volume}
          isEnabled={!isBuffering && nowPlayingItem !== null}
          onVolumeChange={onVolumeChange}
        />
      </div>
      <span className={styles.bitrate}>
        {bitrate}
        kbps
      </span>
    </div>
  );
}

PlayerControls.propTypes = {
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onSeek: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
};

export default PlayerControls;
