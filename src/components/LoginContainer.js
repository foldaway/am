import React from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';

import styled from 'styled-components';
import LargeTitle from './ui/LargeTitle';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;

const WelcomeMessage = styled.span`
  color: ${(props) => props.theme.text.primary};
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.text.primary};
  padding: 4px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
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
      <WelcomeMessage>
        <LargeTitle>
          Welcome to AM, the robust web client for Apple Music.
        </LargeTitle>
        {' '}
        Click
        <LoginButton type="button" onClick={onLoginButtonClicked}>
          here
        </LoginButton>
        to sign in.
      </WelcomeMessage>
    </Wrapper>
  );
}

LoginContainer.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginContainer;
