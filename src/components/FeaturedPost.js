import React, { Component } from 'react';
import './FeaturedPost.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Author from './Author';

class FeaturedPost extends Component {
  constructor(props) {
    super(props);
    console.log("props from FeaturedPost",props);
  }

  returnHtmlStringAsDomElement(htmlString) {
    //Cosmic JS default content field is an html field
    console.log("htmlString ",htmlString);
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
      </Paper>
      </div>
    );
  }
}

export default FeaturedPost;
