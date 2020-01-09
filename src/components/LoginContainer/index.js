import React from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;

const WelcomeMessage = styled.span`
  color: ${(props) => props.theme.text.primary};
`;

function LoginContainer({ onLoginSuccess }) {
  async function onLoginButtonClicked() {
    try {
      const musicUserToken = await window.MusicKitInstance.authorize();
      window.localStorage.setItem('musicUserToken', musicUserToken);
      onLoginSuccess();
    } catch (e) {
      console.error(e);
    }
  }
  if (window.MusicKitInstance.isAuthorized) {
    return <Redirect to="/library/recently-added" />;
  }
  return (
    <Wrapper>
      <WelcomeMessage>Welcome to AM.</WelcomeMessage>
      <button type="button" onClick={onLoginButtonClicked}>
        Log in
      </button>
    </Wrapper>
  );
}

LoginContainer.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginContainer;
