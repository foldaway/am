import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    return (
      <button onClick={this.onLoginButtonClicked}>Log in</button>
    );
  }
}

LoginContainer.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginContainer;
