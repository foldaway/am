import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

window.MusicKitInstance = window.MusicKit.configure({
  bitrate: window.MusicKit.PlaybackBitrate.HIGH,
  developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc3RkFOTDlGNzUifQ.eyJpYXQiOjE1Nzg0OTYwNjAsImV4cCI6MTU4NjI3MjA2MCwiaXNzIjoiRVo0OTUzMjIzNiJ9.NWqW4XX3isOrXYW8QdExyn1ksigc4NzfT3T6fIXsv6VAJiMKtYotDxzzc2neDvU9x7wAjfzyU0iLh6fAAkar2A',
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
