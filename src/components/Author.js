import React, { Component } from 'react';
import './Author.css';
import Avatar from '@material-ui/core/Avatar'

class Author extends Component {
  render() {
    return (
      <div className="Author">
      	<Avatar alt="John Doe" src={process.env.PUBLIC_URL + "/logo_bellamybuffaloonly.png"} />
        <p>Author Here</p>
      </div>
    );
  }
}

export default Author;
