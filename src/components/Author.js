import React, { Component } from 'react';
import './Author.css';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar'
// import avatarImage from '../../public/logo_bellamybuffaloonly.png'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Author extends Component {
  render() {
    return (
      <div className="Author">
      	<Avatar alt="John Doe" src={process.env.PUBLIC_URL + "/logo_bellamybuffaloonly.png"} />
        <p>Author Here</p>
      </div>
    );
  }
}

export default Author;
