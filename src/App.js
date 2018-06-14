import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';
import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import Library from './components/Library';
import TrackList from './components/TrackList';

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
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  render() {
    return (
      <div className={styles.container}>
        <Header />
        {
          this.state.isLoggedIn ? (
            <div className={styles['main-content']}>
              <Library />
              <TrackList />
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
