import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

const { MUSICKIT_TOKEN } = process.env;

window.MusicKitInstance = window.MusicKit.configure({
  bitrate: window.MusicKit.PlaybackBitrate.HIGH,
  developerToken: MUSICKIT_TOKEN,
});

if (module.hot) {
  module.hot.accept();
}

const rootElem = document.getElementById('root');
const now = new Date();
if (now.getHours() >= 19 || now.getHours() <= 7) {
  rootElem.classList.add('dark-theme');
}

ReactDOM.render(<App />, rootElem);
