import React, { Component } from 'react';
import './Author.css';
import Avatar from '@material-ui/core/Avatar'

class Author extends Component {
	// <Avatar alt={this.props.authorName} src={process.env.PUBLIC_URL + "/logo_bellamybuffaloonly.png"} />
  render() {
    return (
      <div className="Author">
      	<Avatar alt={this.props.authorName} src={this.props.avatarImageSrc} />
        <p>{this.props.authorName}</p>
      </div>
    );
  }
}

export default Author;
