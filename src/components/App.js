import React, { Component } from 'react';
import './App.css';
import AppBar from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FeaturedPost from './FeaturedPost';
import OtherPosts from './OtherPosts';
import SpotifyContainer from './SpotifyContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <AppBar>
            <Typography variant="title">
              Old School Shuffle
            </Typography>
          </AppBar>
        </header>
        <div className="featuredPost">
          <FeaturedPost></FeaturedPost>
        </div>
        <div className="spotifyPlayer">
          <SpotifyContainer></SpotifyContainer>
        </div>
        <div className="otherPosts">
          <OtherPosts></OtherPosts>
        </div>
        <div className="footer">
          <p>cosmic footer here</p>
        </div>
      </div>
    );
  }
}

export default App;
