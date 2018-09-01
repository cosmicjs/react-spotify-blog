import React, { Component } from 'react';
import './App.css';
import AppBar from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FeaturedPost from './FeaturedPost';
import OtherPosts from './OtherPosts';
import SpotifyContainer from './SpotifyContainer';
import Footer from './Footer';
import * as Helpers from '../helpers';


class App extends Component {

  // constructor(props){
  //   super(props);
  //   this.state = {

  //   }
    
  // }

  async componentDidMount(){
    const data = await Helpers.getCosmicJsData();
    console.log("data ",data);
  }

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
          <FeaturedPost />
        </div>
        <div className="spotifyPlayer">
          <SpotifyContainer></SpotifyContainer>
        </div>
        <div className="otherPosts">
          <OtherPosts/>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
