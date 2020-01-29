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
import PlaylistLibrary from './pages/media/Playlist';
import Player from './components/Player';
import SearchCatalog from './pages/Search';

import ArtistPage from './pages/media/Artist';
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
                component={RecentlyAdded}
              />
              <Route exact path="/library/artists" component={Artists} />
              <Route exact path="/library/albums" component={Albums} />
              <Route exact path="/library/songs" component={Songs} />
              <Route exact path="/library/playlists" component={Playlists} />
              <Route
                path="/library/playlists/:playlistID"
                render={(props) => <PlaylistLibrary isLibrary {...props} />}
              />
              <Route
                path="/playlist/:playlistID"
                render={(props) => (
                  <PlaylistLibrary isLibrary={false} {...props} />
                )}
              />
              <Route path="/artist/:artistID" component={ArtistPage} />
              <Route path="/search" component={SearchCatalog} />
              <Route exact path="/for-you" component={ForYou} />
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
