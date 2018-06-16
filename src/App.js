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
    return false;
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: checkIsLogged(),
      currentAlbum: null,
      view: 'Albums',
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.getView = this.getView.bind(this);
    this.setCurrentAlbum = this.setCurrentAlbum.bind(this);
    this.setView = this.setView.bind(this);
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  getView() {
    switch (this.state.view) {
      case 'Albums':
        return <AlbumLibrary onAlbumSelected={this.setCurrentAlbum} />;
      case 'Songs':
        return <SongLibrary onSongSelected={() => {}} />;
      default:
        return null;
    }
  }

  setCurrentAlbum(currentAlbum) {
    this.setState({ currentAlbum });
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
              { this.getView() }
              {
                this.state.currentAlbum !== null ? (
                  <Player album={this.state.currentAlbum} />
                ) : null
              }
            </div>
          ) : (
            <LoginContainer onLoginSuccess={this.onLoginSuccess} />
          )
        }
      </div>
    );
  }
}

export default App;
