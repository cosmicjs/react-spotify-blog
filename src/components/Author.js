import React, { Component } from 'react';
import './Author.css';
import Avatar from '@material-ui/core/Avatar'

class Author extends Component {
  render() {
    return (
      <div className="Author">
      	<Avatar alt={this.props.authorName} src={this.props.avatarImageSrc} />
        <p>by {this.props.authorName}</p>
      </div>
    );
  }
}

export default Author;
