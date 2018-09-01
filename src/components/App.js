import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Old School Shuffle</h1>
        </header>
        <div className="featuredPost">
          <p>Featured post here</p>
        </div>
        <div className="spotifyPlayer">
          <p>spotifyPlayer here</p>
        </div>
        <div className="otherPosts">
          <p>other posts here</p>
        </div>
        <div className="footer">
          <p>cosmic footer here</p>
        </div>
      </div>
    );
  }
}

export default App;
