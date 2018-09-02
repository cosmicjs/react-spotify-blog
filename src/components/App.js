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
       featuredPostIndex: 0,
       otherPosts: [],
    }
  }

  async componentDidMount(){
    try {
      const {posts, authors} = await Helpers.getCosmicJsData();
      this.setState({dataReceived: true, posts: posts, authors: authors, otherPosts: posts.slice(1)})
    }
    catch(err) {
      console.error('Error: Problem retrieving Cosmic JS data', err);
      console.error(err.stack);
      this.setState({dataReceived: false});
    }
  }

  changeFeaturedPost(index) {
    this.setState({featuredPostIndex: index})
    //make copy of posts so don't mutate
    let copyOfPosts = this.state.posts.slice();
    copyOfPosts.splice(index, 1);
    // otherPosts.splice(index,1);
    this.setState({otherPosts: copyOfPosts});
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
        {this.state.dataReceived ? <FeaturedPost post={this.state.posts[this.state.featuredPostIndex]}/> : ''}
        </div>
        <div className="spotifyPlayer">
          <SpotifyContainer></SpotifyContainer>
        </div>
        <div className="otherPosts">
          <OtherPosts allPosts={this.state.posts} otherPosts={this.state.otherPosts} changeFeaturedPost={(index) => this.changeFeaturedPost(index)}/>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
