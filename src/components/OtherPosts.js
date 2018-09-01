import React, { Component } from 'react';
import './OtherPosts.css';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class OtherPosts extends Component {
  render() {
    return (
      <div className="OtherPosts">
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Previous Posts</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            A second Post Title Here
          </Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <Typography>
            A third Post Title Here
          </Typography>
        </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default OtherPosts;
