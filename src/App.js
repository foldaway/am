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
      queue: [],
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.getView = this.getView.bind(this);
    this.enqueueMedia = this.enqueueMedia.bind(this);
    this.setView = this.setView.bind(this);
    this.updateState = this.updateState.bind(this);

    const { Events } = window.MusicKit;
    const { player } = window.MusicKitInstance;

    player.queue.addEventListener(Events.queueItemsDidChange, this.updateState);
    player.queue.addEventListener(Events.queuePositionDidChange, this.updateState);
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  getView() {
    switch (this.state.view) {
      case 'albums':
        return <AlbumLibrary onAlbumSelected={this.enqueueMedia} />;
      case 'songs':
        return <SongLibrary onSongSelected={this.enqueueMedia} />;
      case 'playlist':
        return (<PlaylistLibrary
          playlist={this.state.selectedPlaylist}
          onSongSelected={this.enqueueMedia}
        />);
      default:
        return null;
    }
  }

  setView(view, selectedPlaylist) {
    this.setState({ view, selectedPlaylist });
  }

  updateState() {
    this.setState({ queue: window.MusicKitInstance.player.queue.items });
  }

  async enqueueMedia(media) {
    const { player } = window.MusicKitInstance;
    await player.queue.append({ items: [media] });
    if (!player.isPlaying) {
      await window.MusicKitInstance.play();
    }
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
              <Player queue={this.state.queue} />
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
