import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './routes';
import './index.css';

(window as any).onSpotifyWebPlaybackSDKReady = () => {
  console.log('Spotify Web Playback SDK is ready');
};

ReactDOM.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
  document.getElementById('root')
);
