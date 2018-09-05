import React, { Component } from 'react';
import './ConnectSpotify.css';
import * as SpotifyFunctions from '../spotifyFunctions.js'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class ConnectSpotify extends Component {

  render() {
    return (
      <div className="ConnectSpotify">
        <a href={SpotifyFunctions.redirectUrlToSpotifyForLogin()}>
        	<button>Connect to Spotify</button>
        </a>
      </div>
    );
  }
}

export default ConnectSpotify;
