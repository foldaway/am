import 'normalize.css';
import 'babel-polyfill';
import 'typeface-ibm-plex-sans';
import 'typeface-ibm-plex-mono';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import styled, { ThemeProvider } from 'styled-components';
import { IconContext } from 'react-icons';
import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import Albums from './pages/Albums';
import Songs from './pages/Songs';
import PlaylistLibrary from './components/PlaylistLibrary';
import Player from './components/Player';
import SearchCatalog from './pages/Search';

import ArtistPage from './components/ArtistPage';
import Artists from './pages/Artists';
import ForYou from './pages/ForYou';
import RecentlyAdded from './pages/RecentlyAdded';
import Modal from './components/Modal';
import Playlists from './pages/Playlists';

const now = new Date();
const useDarkTheme = now.getHours() >= 19 || now.getHours() <= 7;

const commonTheme = {
  branding: 'rgb(255, 45, 85)',
};

const dayTheme = {
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

const nightTheme = {
  text: {
    primary: 'hsl(208, 12%, 88%)',
    secondary: 'hsl(207, 12%, 43%)',
    tertiary: 'rgb(248, 248, 250)',
  },
  background: {
    primary: 'rgb(51, 51, 51)',
    secondary: 'rgb(96, 96, 96)',
    tertiary: 'rgb(248, 248, 250)',
  },
};

const theme = Object.assign(commonTheme, useDarkTheme ? nightTheme : dayTheme);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const View = styled.div`
  height: 100%;
  padding: 20px;
  overflow-y: scroll;
`;

function App() {
  const { Events } = window.MusicKit;
  const { player, isAuthorized } = window.MusicKitInstance;

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthorized);
  const [queue, setQueue] = useState({ items: [] });
  const [error, setError] = useState(null);
  const [nowPlayingItemIndex, setNowPlayingItemIndex] = useState(-1);

  useEffect(() => {
    const queueCb = (items) => setQueue({ items });
    const queuePosCb = ({ position }) => setNowPlayingItemIndex(position);
    player.addEventListener(Events.queueItemsDidChange, queueCb);
    player.addEventListener(Events.queuePositionDidChange, queuePosCb);

    return () => {
      player.removeEventListener(Events.queueItemsDidChange, queueCb);
      player.removeEventListener(Events.queuePositionDidChange, queuePosCb);
    };
  }, []);

  async function playQueue(queueObj, queueIndex) {
    try {
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
      <IconContext.Provider value={{ color: theme.text.primary }}>
        <Wrapper>
          <Router>
            <Header />
            <View>
              <Route
                exact
                path="/library/recently-added"
                render={(props) => (
                  <RecentlyAdded
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
                  <Artists onAlbumSelected={playAlbum} {...props} />
                )}
              />
              <Route
                exact
                path="/library/albums"
                render={(props) => (
                  <Albums onAlbumSelected={playAlbum} {...props} />
                )}
              />
              <Route
                exact
                path="/library/songs"
                render={(props) => <Songs onSongSelected={playSong} {...props} />}
              />
              <Route exact path="/library/playlists" component={Playlists} />
              <Route
                path="/library/playlists/:playlistID"
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
                render={() => <ForYou onAlbumSelected={playAlbum} />}
              />
              <Route
                path="/artist/id"
                render={(props) => (
                  <ArtistPage
                    onAlbumSelected={playAlbum}
                    onSongSelected={playSong}
                    {...props}
                  />
                )}
              />
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
            </View>
            {isLoggedIn && (
              <Player queue={queue} nowPlayingItemIndex={nowPlayingItemIndex} />
            )}
            {!isLoggedIn && <Redirect to="/login" />}
            {error !== null && (
              <Modal onClose={() => setError(null)}>
                <span>{error}</span>
              </Modal>
            )}
          </Router>
        </Wrapper>
      </IconContext.Provider>
    </ThemeProvider>
  );
}

export default App;
