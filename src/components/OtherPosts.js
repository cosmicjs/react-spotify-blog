import React, { Component } from 'react';
import './OtherPosts.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import * as CosmicFunctions from '../cosmicFunctions.js';

class OtherPosts extends Component {

  handleClick(postObject){
    //received the postObject, but need to pass the proper
    //index (from the original cosmicJS data) back down to the Expansion panel via the this.props.changeFeaturedPost(index)
    const index = CosmicFunctions.matchPostObjectToPostIndex(postObject, this.props.allPosts)
    this.props.changeFeaturedPost(index);
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

