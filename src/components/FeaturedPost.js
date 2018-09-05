import React, { Component } from 'react';
import './FeaturedPost.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Author from './Author';
import * as SpotifyFunctions from '../spotifyFunctions.js'

class FeaturedPost extends Component {

  returnHtmlStringAsDomElement(htmlString) {
    //Cosmic JS default content field is an html field
    return (
      <div>
        {htmlString}
      </div>
    )
  }

  createMarkup(htmlString){
    return {__html: htmlString}
  }

  render() {
    return (
      <div className="FeaturedPost">
      <Paper>
      	<Typography variant="headline" component="h3">
      		{this.props.post.title}
      	</Typography>
        <Author authorName={this.props.post.metadata.author.title} avatarImageSrc={this.props.post.metadata.author.metadata.avatarimage.url}/>
      	<div className="content" dangerouslySetInnerHTML={this.createMarkup(this.props.post.content)}>
      	</div>
        <button className="playArtist" onClick={(e) => {SpotifyFunctions.playArtistDiscography(this.props.post.metadata.spotifyartistid, this.props.post.title)}}>Play Discography</button>
      </Paper>
      </div>
    );
  }
}

export default FeaturedPost;
