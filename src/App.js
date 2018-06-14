import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';
import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import Library from './components/Library';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
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
