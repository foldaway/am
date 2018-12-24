import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import styles from './styles.scss';

class LoginContainer extends Component {
  constructor(props) {
    super(props);

    this.onLoginButtonClicked = this.onLoginButtonClicked.bind(this);
  }

  async onLoginButtonClicked() {
    try {
      const musicUserToken = await window.MusicKitInstance.authorize();
      window.localStorage.setItem('musicUserToken', musicUserToken);
      this.props.onLoginSuccess();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    if (window.MusicKitInstance.isAuthorized) {
      return <Redirect to="/library/recently-added" />;
    }
    return (
      <div className={styles.container}>
        <span>Welcome to AM.</span>
        <button onClick={this.onLoginButtonClicked}>Log in</button>
      </div>
    );
  }
}

LoginContainer.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginContainer;
