import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';

import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import AlbumLibrary from './components/AlbumLibrary';
import SongLibrary from './components/SongLibrary';
import Player from './components/Player';
import SideMenu from './components/SideMenu';

import styles from './App.scss';

const checkIsLogged = () => {
  try {
    window.MusicKit.getInstance();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: checkIsLogged(),
      currentSong: null,
      view: 'Albums',
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
      case 'Albums':
        return <AlbumLibrary onAlbumSelected={this.setCurrentSong} />;
      case 'Songs':
        return <SongLibrary onSongSelected={this.setCurrentSong} />;
      default:
        return null;
    }
  }

  setCurrentSong(currentSong) {
    this.setState({ currentSong });
  }

  setView(view) {
    this.setState({ view });
  }

  render() {
    return (
      <div className={styles.container}>
        <Header />
        {
          this.state.isLoggedIn ? (
            <div className={styles['main-content']}>
              <SideMenu onSelected={(e) => this.setView(e.target.textContent)} />
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
