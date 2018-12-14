import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

window.MusicKitInstance = window.MusicKit.configure({
  developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc3RkFOTDlGNzUifQ.eyJpc3MiOiJFWjQ5NTMyMjM2IiwiZXhwIjoxNjA3ODI5MTcwLCJpYXQiOjE1NDQ3NTcxNzB9.rXB9tl1mXfqoGmlbXLDUxDRIODUihAtKntelY4OWOmwtULr5AkX4P1nfEgXsweAgA8Qmz2UhJG0VFcQEG7OHww',
});

const rootElem = document.getElementById('root');
if (new Date().getHours() >= 19) {
  rootElem.classList.add('dark-theme');
}

ReactDOM.render(<App />, rootElem);
