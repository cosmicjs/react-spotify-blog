import React, { Component } from 'react';
import './OtherPosts.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

class OtherPosts extends Component {

  handleClick(targetPostObject){
    const allPosts = this.props.allPosts
    const targetIndex = allPosts.findIndex((postObject) => {
      return targetPostObject._id === postObject._id
    })
    this.props.changeFeaturedPost(targetIndex);
  }

  render() {
    return (
      <div className="OtherPosts">
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Previous Posts</Typography>
        </ExpansionPanelSummary>
        {this.props.otherPosts.map((postObject, index) => {
          return (
            <ExpansionPanelDetails key={`otherPost-${index}`} onClick={(e) => {this.handleClick(postObject)}}>
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

