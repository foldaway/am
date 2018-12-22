import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

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
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.updateState = this.updateState.bind(this);

    player.addEventListener(Events.playbackStateDidChange, this.updateState);
    player.queue.addEventListener(Events.queueItemsDidChange, this.updateState);
    player.queue.addEventListener(Events.queuePositionDidChange, this.updateState);

    this.playQueue = async (queueObj, queueIndex) => {
      if (this.state.playbackState === PlaybackStates.playing) {
        await player.stop();
      }
      await window.MusicKitInstance.setQueue(queueObj);
      await player.changeToMediaAtIndex(queueIndex);
      await player.play();
    };

    this.playAlbum = async (album, queueIndex) => this.playQueue({ album: album.id }, queueIndex);
    this.playPlaylist = async (playlist, queueIndex) => this.playQueue(
      { playlist: playlist.id },
      queueIndex,
    );
    this.playSong = async (items, queueIndex) => this.playQueue(
      { items: items.slice(queueIndex) },
      0,
    );
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
    return (
      <div className={styles.container}>
        <Header />
        <Router>
          <div className={styles['main-content']}>
            <SideMenu />
            <div className={styles.player}>
              <Player
                queue={this.state.queue}
                nowPlayingItemIndex={this.state.nowPlayingItemIndex}
                playbackState={this.state.playbackState}
              />
            </div>
            <div className={styles.view}>
              <Route
                exact
                path="/library/recently-added"
                render={() => (
                  <RecentlyAddedLibrary
                    onAlbumSelected={this.playAlbum}
                    onPlaylistSelected={this.setView}
                  />
                )}
              />
              <Route exact path="/library/artists" render={() => <ArtistLibrary onAlbumSelected={this.playAlbum} />} />
              <Route exact path="/library/albums" render={() => <AlbumLibrary onAlbumSelected={this.playAlbum} />} />
              <Route exact path="/library/songs" render={() => <SongLibrary onSongSelected={this.playSong} />} />
              <Route exact path="/library/playlists" render={() => <PlaylistLibrary playlist={this.state.viewArgs} onSongSelected={this.playPlaylist} />} />
              <Route
                exact
                path="/search"
                render={() => (
                  <SearchCatalog
                    onSongSelected={this.playSong}
                    onAlbumSelected={this.playAlbum}
                    onArtistSelected={this.setView}
                    onPlaylistSelected={console.log}
                  />
                )}
              />
              <Route exact path="/for-you" render={() => <ForYouPage onAlbumSelected={this.playAlbum} onPlaylistSelected={console.log} />} />
              <Route
                path="/artist/id"
                render={() => (<ArtistPage
                  artist={this.state.viewArgs}
                  onAlbumSelected={this.playAlbum}
                  onSongSelected={this.playSong}
                />)}
              />
            </div>
            <Route exact path="/" render={() => <LoginContainer onLoginSuccess={this.onLoginSuccess} />} />

            { this.state.isLoggedIn ? <Redirect to="/library/recently-added" /> : <Redirect to="/" /> }
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
