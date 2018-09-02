import React, { Component } from 'react';
import './OtherPosts.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class OtherPosts extends Component {

  render() {
      console.log("this.props.posts from OtherPosts",this.props.posts);
    return (
      <div className="OtherPosts">
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Previous Posts</Typography>
        </ExpansionPanelSummary>
        {this.props.posts.map((postObject, index) => {
          return (
            <ExpansionPanelDetails key={`otherPost-${index}`}>
              <Typography>
                {postObject.title}
              </Typography>
            </ExpansionPanelDetails>
          )
        })}
        </ExpansionPanel>
      </div>
    );
  }

}

export default OtherPosts;

