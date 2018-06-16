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
      currentSong: null,
      selectedPlaylist: null,
      view: 'albums',
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.getView = this.getView.bind(this);
    this.setCurrentSong = this.setCurrentSong.bind(this);
    this.setView = this.setView.bind(this);
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  getView() {
    switch (this.state.view) {
      case 'albums':
        return <AlbumLibrary onAlbumSelected={this.setCurrentSong} />;
      case 'songs':
        return <SongLibrary onSongSelected={this.setCurrentSong} />;
      case 'playlist':
        return <PlaylistLibrary playlist={this.state.selectedPlaylist} onSongSelected={this.setCurrentSong} />;
      default:
        return null;
    }
  }

  setCurrentSong(currentSong) {
    this.setState({ currentSong });
  }

  setView(view, selectedPlaylist) {
    this.setState({ view, selectedPlaylist });
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
              {
                this.state.currentSong !== null ? (
                  <div className={styles.player}>
                    <Player song={this.state.currentSong} />
                  </div>
                ) : null
              }
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
