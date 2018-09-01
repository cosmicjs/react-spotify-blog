import React, { Component } from 'react';
import './Footer.css';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <Typography variant="body2" gutterBottom>Proudly made with Cosmic JS</Typography>
      </div>
    );
  }
}

export default Footer;
