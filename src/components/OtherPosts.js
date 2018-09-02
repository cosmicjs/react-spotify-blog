import React, { Component } from 'react';
import './OtherPosts.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as Helpers from '../helpers';

class OtherPosts extends Component {

  handleClick(postObject){
    //received the postObject, but need to pass the proper
    //index (from the original cosmicJS data) back via the this.props.changeFeaturedPost(index)
    const index = Helpers.matchPostObjectToPostIndex(postObject, this.props.allPosts)
    this.props.changeFeaturedPost(index);
  }

  render() {
      console.log("this.props.otherPosts from OtherPosts",this.props.otherPosts);
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

