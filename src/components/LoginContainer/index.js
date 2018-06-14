import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoginContainer extends Component {
  constructor(props) {
    super(props);

    this.onLoginButtonClicked = this.onLoginButtonClicked.bind(this);
  }

  async onLoginButtonClicked() {
    const musicUserToken = await window.MusicKitInstance.authorize();
    this.props.onLoginSuccess();
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
