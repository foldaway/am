import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';
import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import Library from './components/Library';

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
      <div>
        <Header />
        {
          this.state.isLoggedIn ? (
            <Library />
          ) : (
            <LoginContainer onLoginSuccess={this.onLoginSuccess} />
          )
        }
      </div>
    );
  }
}

export default App;
