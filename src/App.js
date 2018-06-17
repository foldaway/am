import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';

import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import AlbumLibrary from './components/AlbumLibrary';
import SongLibrary from './components/SongLibrary';
import PlaylistLibrary from './components/PlaylistLibrary';
import Player from './components/Player';
import SideMenu from './components/SideMenu';

import styles from './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: window.MusicKitInstance.isAuthorized,
      selectedPlaylist: null,
      view: 'albums',
      queue: { items: [] },
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.getView = this.getView.bind(this);
    this.setView = this.setView.bind(this);
    this.updateState = this.updateState.bind(this);

    const { Events } = window.MusicKit;
    const { player } = window.MusicKitInstance;

    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.queue.addEventListener(Events.queueItemsDidChange, this.updateState);
    player.queue.addEventListener(Events.queuePositionDidChange, this.updateState);

    this.enqueueMedia = async (media) => {
      await player.queue.append({ items: [media] });
      if (!player.isPlaying) {
        if (player.queue.length > 0) {
          // Existing items
          await player.changeToMediaAtIndex(player.queue.length - 1);
        }
        await window.MusicKitInstance.play();
      }
    };

    this.playQueue = async (queueObj, queueIndex) => {
      await window.MusicKitInstance.setQueue(queueObj);
      await player.changeToMediaAtIndex(queueIndex);
      await window.MusicKitInstance.play();
    };

    this.playAlbum = async (album, queueIndex) => this.playQueue({ album: album.id }, queueIndex);
    this.playPlaylist = async (playlist, queueIndex) => this.playQueue(
      { playlist: playlist.id },
      queueIndex,
    );
  }

  componentWillUnmount() {
    document.querySelector('#apple-music-player').remove();
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  getView() {
    switch (this.state.view) {
      case 'albums':
        return <AlbumLibrary onAlbumSelected={this.playAlbum} />;
      case 'songs':
        return <SongLibrary onSongSelected={this.enqueueMedia} />;
      case 'playlist':
        return (<PlaylistLibrary
          playlist={this.state.selectedPlaylist}
          onSongSelected={this.playPlaylist}
        />);
      default:
        return null;
    }
  }

  setView(view, selectedPlaylist) {
    this.setState({ view, selectedPlaylist });
  }

  updateState() {
    const { player } = window.MusicKitInstance;
    this.setState({
      queue: player.queue,
      nowPlayingItemIndex: player.nowPlayingItemIndex,
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <Header />
        {
          this.state.isLoggedIn ? (
            <div className={styles['main-content']}>
              <SideMenu onSelected={this.setView} />
              <div className={styles.view}>
                { this.getView() }
              </div>
              <div className={styles.player}>
                <Player
                  queue={this.state.queue}
                  nowPlayingItemIndex={this.state.nowPlayingItemIndex}
                />
              </div>
            </div>
          ) : (
            <div>
              <LoginContainer onLoginSuccess={this.onLoginSuccess} />
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
