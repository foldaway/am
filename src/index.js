import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

const { MUSICKIT_TOKEN } = process.env;

window.MusicKitInstance = window.MusicKit.configure({
  bitrate: window.MusicKit.PlaybackBitrate.HIGH,
  developerToken:
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI3M1pZOUY4MlUifQ.eyJpYXQiOjE1OTA2MzA0MzcsImV4cCI6MTU5MzIyMjQzNywiaXNzIjoiRVo0OTUzMjIzNiJ9.6d23Cyzr5rGKgOqQMZ7WZYej2LwCg7Ng0QltBPb518-mUgfUvh3O3CP3x_pIG3ULTB5X3nQJU3T_pcyjleSzQg',
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
