import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.scss';

window.MusicKitInstance = window.MusicKit.configure({
  developerToken: 'abcdef',
});

ReactDOM.render(<App />, document.getElementById('root'));
