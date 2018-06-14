import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

window.MusicKitInstance = window.MusicKit.configure({
  developerToken: 'abcdef',
});
