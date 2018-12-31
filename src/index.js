import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

window.MusicKitInstance = window.MusicKit.configure({
  bitrate: window.MusicKit.PlaybackBitrate.HIGH,
  developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc3RkFOTDlGNzUifQ.eyJpYXQiOjE1NDQ3NjAwNDAsImV4cCI6MTU1MjUzNjA0MCwiaXNzIjoiRVo0OTUzMjIzNiJ9.66rrfAZHJcehndvp_yHVbYg3UAy_pTyfmMFCyPhXBbC4SurfH7-5fEnAKvmVjtvcwicnEb1BDgNe8GO74niQtQ',
});

const rootElem = document.getElementById('root');
const now = new Date();
if (now.getHours() >= 19 || now.getHours() <= 7) {
  rootElem.classList.add('dark-theme');
}

ReactDOM.render(<App />, rootElem);
