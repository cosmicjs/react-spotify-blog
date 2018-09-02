import React, { Component } from 'react';
import './SpotifyContainer.css';
import ConnectSpotify from './ConnectSpotify';
import * as SpotifyFunctions from '../spotifyFunctions.js'
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class SpotifyContainer extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			loggedInToSpotify: false,
			accessToken: null
		}
	}
	//will check URL for accessToken hash. If it's not there, it will show the connect-spotify-button as a link
	//which will then redirect back to your site with the hash. If there is a hash, then we will jump right into the player

	componentDidMount(){
		const accessToken = SpotifyFunctions.checkUrlForSpotifyAccessToken();
		if (!accessToken) {
			this.setState({loggedInToSpotify: false, accessToken: null})
		}
		else {
			this.setState({loggedInToSpotify: true, accessToken: accessToken})
		}
	}

  render() {
    return (
      <div className="SpotifyContainer">
        <p>Will dynamically change between connect spotify permissions, playlist selection to play with options, and now-playing screen</p>
        {!this.state.loggedInToSpotify ? <ConnectSpotify /> : `already connected with token ${this.state.accessToken}` }
      </div>
    );
  }
}

export default SpotifyContainer;
