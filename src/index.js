import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

window.MusicKitInstance = window.MusicKit.configure({
  developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpQWUs2TlhZMlUifQ.eyJpYXQiOjE1Mjk1ODk4ODksImV4cCI6MTUzNzM2NTg4OSwiaXNzIjoiRVo0OTUzMjIzNiJ9.fVfwIGU2drkSjTTjxgjSPgsCZtPp2XUqeW2y_u4DIJ2s1Fuxvycev1yd0cVTY4aaPxhjjRp6cB9hwAlbT-6IQg',
});

const rootElem = document.getElementById('root');
if (new Date().getHours() >= 19) {
  rootElem.classList.add('dark-theme');
}

ReactDOM.render(<App />, rootElem);
