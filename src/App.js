import 'normalize.css';
import 'babel-polyfill';

import React, { useState, useEffect } from 'react';
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
      secondary: 'rgba(0, 0, 0, 0.0470588)',
      tertiary: 'rgb(248, 248, 250)',
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
      secondary: 'rgb(187, 187, 187)',
      tertiary: 'rgb(51, 51, 51)',
    },
    branding: 'rgb(255, 45, 85)',
  };

function App() {
  const { Events, PlaybackStates } = window.MusicKit;
  const { player, isAuthorized } = window.MusicKitInstance;

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthorized);
  const [viewArgs, setViewArgs] = useState(null);
  const [queue, setQueue] = useState({ items: [] });
  const [playbackState, setPlaybackState] = useState(player.playbackState);
  const [error, setError] = useState(null);
  const [nowPlayingItemIndex, setNowPlayingItemIndex] = useState(-1);

  useEffect(() => {
    const playbackStateCb = ({ state }) => setPlaybackState(state);
    const queueCb = (items) => setQueue({ items });
    const queuePosCb = ({ position }) => setNowPlayingItemIndex(position);
    player.addEventListener(Events.playbackStateDidChange, playbackStateCb);
    player.addEventListener(Events.queueItemsDidChange, queueCb);
    player.addEventListener(Events.queuePositionDidChange, queuePosCb);

    return () => {
      player.removeEventListener(
        Events.playbackStateDidChange,
        playbackStateCb,
      );
      player.removeEventListener(Events.queueItemsDidChange, queueCb);
      player.removeEventListener(Events.queuePositionDidChange, queuePosCb);
    };
  }, []);

  async function playQueue(queueObj, queueIndex) {
    try {
      if (playbackState === PlaybackStates.playing) {
        await player.stop();
      }
      await window.MusicKitInstance.setQueue(queueObj);
      await player.changeToMediaAtIndex(queueIndex);
      await player.play();
    } catch (e) {
      setError(e.message);
    }
  }

  const playAlbum = async (album, queueIndex) => playQueue({ album: album.id }, queueIndex);
  const playPlaylist = async (playlist, queueIndex) => playQueue({ playlist: playlist.id }, queueIndex);
  const playSong = async (items, queueIndex) => playQueue({ items: items.slice(queueIndex) }, 0);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Header />
        <Router>
          <div className={styles['main-content']}>
            {isLoggedIn ? <SideMenu /> : null}
            {isLoggedIn ? (
              <div className={styles.player}>
                <Player
                  queue={queue}
                  nowPlayingItemIndex={nowPlayingItemIndex}
                  playbackState={playbackState}
                />
              </div>
            ) : null}
            <div className={styles.view}>
              <Route
                exact
                path="/library/recently-added"
                render={(props) => (
                  <RecentlyAddedLibrary
                    onAlbumSelected={playAlbum}
                    onPlaylistSelected={console.log}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/library/artists"
                render={(props) => (
                  <ArtistLibrary onAlbumSelected={playAlbum} {...props} />
                )}
              />
              <Route
                exact
                path="/library/albums"
                render={(props) => (
                  <AlbumLibrary onAlbumSelected={playAlbum} {...props} />
                )}
              />
              <Route
                exact
                path="/library/songs"
                render={(props) => (
                  <SongLibrary onSongSelected={playSong} {...props} />
                )}
              />
              <Route
                path="/library/playlist/:playlistID"
                render={(props) => (
                  <PlaylistLibrary
                    isLibrary
                    onSongSelected={playPlaylist}
                    {...props}
                  />
                )}
              />
              <Route
                path="/playlist/:playlistID"
                render={(props) => (
                  <PlaylistLibrary
                    isLibrary={false}
                    onSongSelected={playPlaylist}
                    {...props}
                  />
                )}
              />
              <Route
                path="/artist/:artistID"
                render={(props) => (
                  <ArtistPage
                    onSongSelected={playSong}
                    onAlbumSelected={playAlbum}
                    {...props}
                  />
                )}
              />
              <Route
                path="/search"
                render={(props) => (
                  <SearchCatalog
                    onSongSelected={playSong}
                    onAlbumSelected={playAlbum}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/for-you"
                render={() => <ForYouPage onAlbumSelected={playAlbum} />}
              />
              <Route
                path="/artist/id"
                render={(props) => (
                  <ArtistPage
                    artist={viewArgs}
                    onAlbumSelected={playAlbum}
                    onSongSelected={playSong}
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
                  onLoginSuccess={() => setIsLoggedIn(true)}
                  {...props}
                />
              )}
            />

            {isLoggedIn ? null : <Redirect to="/login" />}
            {error !== null ? (
              <Modal onClose={() => setError(null)}>
                <span>{error}</span>
              </Modal>
            ) : null}
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
