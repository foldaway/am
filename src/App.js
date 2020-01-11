import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import AlbumLibrary from './components/AlbumLibrary';
import SongLibrary from './components/SongLibrary';
import PlaylistLibrary from './components/PlaylistLibrary';
import Player from './components/Player';
import SideMenu from './components/SideMenu';
import SearchCatalog from './components/SearchCatalog';

import styles from './App.scss';
import ArtistPage from './components/ArtistPage';
import ArtistLibrary from './components/ArtistLibrary';
import ForYouPage from './components/ForYouPage';
import RecentlyAddedLibrary from './components/RecentlyAddedLibrary';
import Modal from './components/Modal';

const now = new Date();
const useDarkTheme = now.getHours() >= 19 || now.getHours() <= 7;

const theme = useDarkTheme
  ? {
    text: {
      primary: 'hsl(208, 12%, 88%)',
      secondary: 'hsl(207, 12%, 43%)',
      tertiary: 'rgb(248, 248, 250)',
    },
    background: {
      primary: 'rgb(51, 51, 51)',
    },
    branding: 'rgb(255, 45, 85)',

    black: 'rgb(17, 17, 17)',
    lightblack: 'rgb(51, 51, 51)',
    darkgray: 'rgb(59, 59, 59)',
    gray: 'rgb(102, 102, 102)',
    lightgray: 'rgb(187, 187, 187)',
    faintgray: 'rgb(248, 248, 250)',
    dullwhite: 'rgb(230, 230, 230)',
    highlightgray: 'rgba(0, 0, 0, 0.0470588)',
  }
  : {
    text: {
      primary: 'hsl(209, 15%, 28%)',
      secondary: 'hsl(208, 12%, 63%)',
      tertiary: 'rgb(187, 187, 187)',
    },
    background: {
      primary: 'rgb(248, 248, 250)',
    },
    branding: 'rgb(255, 45, 85)',
  };

class App extends Component {
  constructor(props) {
    super(props);

    const { Events, PlaybackStates } = window.MusicKit;
    const { player } = window.MusicKitInstance;

    this.state = {
      isLoggedIn: window.MusicKitInstance.isAuthorized,
      viewArgs: null,
      queue: { items: [] },
      playbackState: player.playbackState,
      error: null,
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.updateState = this.updateState.bind(this);

    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.queue.addEventListener(Events.queueItemsDidChange, this.updateState);
    player.queue.addEventListener(
      Events.queuePositionDidChange,
      this.updateState,
    );

    this.playQueue = async (queueObj, queueIndex) => {
      try {
        if (this.state.playbackState === PlaybackStates.playing) {
          await player.stop();
        }
        await window.MusicKitInstance.setQueue(queueObj);
        await player.changeToMediaAtIndex(queueIndex);
        await player.play();
      } catch (e) {
        this.setState({ error: e.message });
      }
    };

    this.playAlbum = async (album, queueIndex) => this.playQueue({ album: album.id }, queueIndex);
    this.playPlaylist = async (playlist, queueIndex) => this.playQueue({ playlist: playlist.id }, queueIndex);
    this.playSong = async (items, queueIndex) => this.playQueue({ items: items.slice(queueIndex) }, 0);
  }

  componentWillUnmount() {
    document.querySelector('#apple-music-player').remove();
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  updateState() {
    const { player } = window.MusicKitInstance;
    this.setState({
      queue: player.queue,
      playbackState: player.playbackState,
      nowPlayingItemIndex: player.nowPlayingItemIndex,
    });
  }

  render() {
    const { error } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <div className={styles.container}>
          <Header />
          <Router>
            <div className={styles['main-content']}>
              {this.state.isLoggedIn ? <SideMenu /> : null}
              {this.state.isLoggedIn ? (
                <div className={styles.player}>
                  <Player
                    queue={this.state.queue}
                    nowPlayingItemIndex={this.state.nowPlayingItemIndex}
                    playbackState={this.state.playbackState}
                  />
                </div>
              ) : null}
              <div className={styles.view}>
                <Route
                  exact
                  path="/library/recently-added"
                  render={(props) => (
                    <RecentlyAddedLibrary
                      onAlbumSelected={this.playAlbum}
                      onPlaylistSelected={console.log}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/library/artists"
                  render={(props) => (
                    <ArtistLibrary
                      onAlbumSelected={this.playAlbum}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/library/albums"
                  render={(props) => (
                    <AlbumLibrary onAlbumSelected={this.playAlbum} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/library/songs"
                  render={(props) => (
                    <SongLibrary onSongSelected={this.playSong} {...props} />
                  )}
                />
                <Route
                  path="/library/playlist/:playlistID"
                  render={(props) => (
                    <PlaylistLibrary
                      isLibrary
                      onSongSelected={this.playPlaylist}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/playlist/:playlistID"
                  render={(props) => (
                    <PlaylistLibrary
                      isLibrary={false}
                      onSongSelected={this.playPlaylist}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/artist/:artistID"
                  render={(props) => (
                    <ArtistPage
                      onSongSelected={this.playSong}
                      onAlbumSelected={this.playAlbum}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/search"
                  render={(props) => (
                    <SearchCatalog
                      onSongSelected={this.playSong}
                      onAlbumSelected={this.playAlbum}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/for-you"
                  render={() => <ForYouPage onAlbumSelected={this.playAlbum} />}
                />
                <Route
                  path="/artist/id"
                  render={(props) => (
                    <ArtistPage
                      artist={this.state.viewArgs}
                      onAlbumSelected={this.playAlbum}
                      onSongSelected={this.playSong}
                      {...props}
                    />
                  )}
                />
              </div>
              <Route
                exact
                path="/login"
                render={(props) => (
                  <LoginContainer
                    onLoginSuccess={this.onLoginSuccess}
                    {...props}
                  />
                )}
              />

              {this.state.isLoggedIn ? null : <Redirect to="/login" />}
              {error !== null ? (
                <Modal onClose={() => this.setState({ error: null })}>
                  <span>{error}</span>
                </Modal>
              ) : null}
            </div>
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
