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

  constructor(props){
    super(props);
    this.state = {
       dataReceived: false,      
       posts: [], 
       authors: [],
    }
  }

  async componentDidMount(){
    try {
      const {posts, authors} = await Helpers.getCosmicJsData();
      console.log("posts ",posts);
      console.log("authors ",authors);
      this.setState({dataReceived: true, posts: posts, authors: authors})
    }
    catch(err) {
      console.error('Error: Problem retrieving Cosmic JS data', err);
      console.error(err.stack);
      this.setState({dataReceived: false});
    }
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
        {this.state.dataReceived ? <FeaturedPost post={this.state.posts[0]}/> : ''}
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
