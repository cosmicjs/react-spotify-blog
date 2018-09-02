import React, { Component } from 'react';
import './ConnectSpotify.css';
import Typography from '@material-ui/core/Typography';
import * as SpotifyFunctions from '../spotifyFunctions.js'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class ConnectSpotify extends Component {

//onClick={(e) => {SpotifyFunctions.getSpotifyAccessToken()}}

  render() {
    return (
      <div className="ConnectSpotify">
        <p>This is the spotify auth connection screen</p>
        <a href={SpotifyFunctions.redirectUrlToSpotifyForLogin()}>
        	<button>Connect to Spotify</button>
        </a>
      </div>
    );
  }
}

export default ConnectSpotify;
