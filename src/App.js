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
import SearchCatalog from './components/SearchCatalog';

import styles from './App.scss';
import ArtistPage from './components/ArtistPage';
import ArtistLibrary from './components/ArtistLibrary';
import ForYouPage from './components/ForYouPage';

class App extends Component {
  constructor(props) {
    super(props);

    const { Events, PlaybackStates } = window.MusicKit;
    const { player } = window.MusicKitInstance;

    this.state = {
      isLoggedIn: window.MusicKitInstance.isAuthorized,
      viewArgs: null,
      view: 'albums',
      queue: { items: [] },
      playbackState: player.playbackState,
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.getView = this.getView.bind(this);
    this.setView = this.setView.bind(this);
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

  getView() {
    switch (this.state.view) {
      case 'artists':
        return <ArtistLibrary onAlbumSelected={this.playAlbum} />;
      case 'albums':
        return <AlbumLibrary onAlbumSelected={this.playAlbum} />;
      case 'songs':
        return <SongLibrary onSongSelected={this.playSong} />;
      case 'search':
        return (
          <SearchCatalog
            onSongSelected={this.playSong}
            onAlbumSelected={this.playAlbum}
            onArtistSelected={this.setView}
            onPlaylistSelected={this.setView}
          />
        );
      case 'foryou':
        return (<ForYouPage
          onAlbumSelected={this.playAlbum}
          onPlaylistSelected={this.setView}
        />);
      case 'playlist':
        return (
          <PlaylistLibrary
            playlist={this.state.viewArgs}
            onSongSelected={this.playPlaylist}
          />
        );
      case 'artist':
        return (
          <ArtistPage
            artist={this.state.viewArgs}
            onAlbumSelected={this.playAlbum}
            onSongSelected={this.playSong}
          />
        );
      default:
        return null;
    }
  }

  setView(view, viewArgs) {
    this.setState({ view, viewArgs });
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
                  playbackState={this.state.playbackState}
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
