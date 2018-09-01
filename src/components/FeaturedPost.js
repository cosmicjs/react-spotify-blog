import React, { Component } from 'react';
import './FeaturedPost.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class FeaturedPost extends Component {
  render() {
    return (
      <div className="FeaturedPost">
      <Paper>
      	<Typography variant="headline" component="h3">
      		Post Title
      	</Typography>
      	<div className="content">
      	<Typography component="p">
      		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non diam blandit, lacinia sem eu, lobortis metus. Pellentesque consequat euismod imperdiet. Vestibulum nec sem quis turpis posuere varius. Suspendisse pulvinar magna ut blandit ornare. Maecenas pharetra leo non neque lacinia, in efficitur augue ultricies. Aliquam id velit sed nisi vehicula pharetra. Nullam ac ipsum nunc. Nunc vitae orci vitae nisl imperdiet posuere vel quis sapien. Duis orci quam, cursus ut metus non, venenatis rhoncus urna. Aenean non bibendum ligula, sit amet volutpat lorem. Curabitur et gravida orci. Phasellus tincidunt diam in mauris convallis, sit amet finibus ipsum tincidunt. Vestibulum ac magna semper, consectetur felis vel, rutrum turpis. Donec dictum aliquam luctus.
      	</Typography>
      	</div>
      </Paper>
      </div>
    );
  }
}

export default FeaturedPost;
