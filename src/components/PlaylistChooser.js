import React, { Component } from 'react';
import './PlaylistChooser.css';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as SpotifyFunctions from '../spotifyFunctions.js'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

  const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
    },
    playlistViewer: {
      height: "200px",
      overflow: "auto",
      flex: "2 1 auto",
      backgroundColor: 'inherit',
    },
    optionsSelection: {
      flex: "1 1 auto",
      backgroundColor: 'inherit',
      padding: 0,
    },
  });


class PlaylistChooser extends Component {

  constructor(props){
    super(props)
    console.log("props from PlaylistChooser constructor",props);
    this.classes = props;
      //byAlbum or byArtist
      this.state = {
      byAlbumOrByArtist: 'byAlbum',
      addRelatedDiscography: "false",
      playlists: []
    }
  }

  changeByAlbumOrByArtist(e){
    e.preventDefault()
    console.log("e.target.value from changeByAlbumOrByArtist",e.target.value);
    this.setState({byAlbumOrByArtist: e.target.value})
  }

  changeAddRelatedDiscography(e){
    e.preventDefault()
    console.log("e.target.value from changeAddRelatedDiscography",e.target.value);
    this.setState({addRelatedDiscography: e.target.value})
  }

  async componentDidMount() {
    await SpotifyFunctions.setAccessToken(this.props.accessToken);
    const playlists = await SpotifyFunctions.getUserPlaylists();
    this.setState({playlists: playlists});
    // console.log("playlists from PlaylistChooser",playlists);    
  }

  generateListItem(playlistObj) {
    return (
      <ListItem key={playlistObj.id}>
            <ListItemText primary={playlistObj.playlistName}/>
      </ListItem>
    )
  }

render() {
    return (
      <div className={`PlaylistChooser ${this.classes}`}>
        <List className={this.classes.playlistViewer}>
          {this.state.playlists.map((playlistObj) => this.generateListItem(playlistObj))}
        </List>
        <div className={this.classes.optionsSelection}>
        <FormControl component="fieldset" className={this.classes.optionsSelection}>
          <FormLabel component="legend">Shuffle Options</FormLabel>
          <RadioGroup
            aria-label="By Artist or By Album"
            name="byAlbumOrByArtist"
            value={this.state.byAlbumOrByArtist}
            onChange={(e) => this.changeByAlbumOrByArtist(e)}
          >
            <FormControlLabel value="byAlbum" control={<Radio />} label="By Album" />
            <FormControlLabel value="byArtist" control={<Radio />} label="By Artist" />
          </RadioGroup>
          <RadioGroup
            aria-label="Add Related Discography"
            name="addRelatedDiscography"
            value={this.state.addRelatedDiscography}
            onChange={(e) => this.changeAddRelatedDiscography(e)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Include" />
            <FormControlLabel value="false" control={<Radio />} label="Just my Playlist" />
          </RadioGroup>


        </FormControl>

        </div>
      </div>


    );
  }

  // render() {
  //   return (
  //     <div className={`PlaylistChooser ${this.classes}`}>
  //       <List className={this.classes.playlistViewer}>
  //         <ListItem>
  //           <ListItemText primary="First playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Second playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Third playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Fourth playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Fifth playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Sixth playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Seventh playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Eighth playlist" />
  //         </ListItem>
  //         <ListItem>
  //           <ListItemText primary="Ninth playlist" />
  //         </ListItem>
  //       </List>
  //       <div className={this.classes.optionsSelection}>
  //       <FormControl component="fieldset" className={this.classes.optionsSelection}>
  //         <FormLabel component="legend">Shuffle Options</FormLabel>
  //         <RadioGroup
  //           aria-label="By Artist or By Album"
  //           name="byAlbumOrByArtist"
  //           value={this.state.byAlbumOrByArtist}
  //           onChange={(e) => this.changeByAlbumOrByArtist(e)}
  //         >
  //           <FormControlLabel value="byAlbum" control={<Radio />} label="By Album" />
  //           <FormControlLabel value="byArtist" control={<Radio />} label="By Artist" />
  //         </RadioGroup>
  //         <RadioGroup
  //           aria-label="Add Related Discography"
  //           name="addRelatedDiscography"
  //           value={this.state.addRelatedDiscography}
  //           onChange={(e) => this.changeAddRelatedDiscography(e)}
  //         >
  //           <FormControlLabel value="true" control={<Radio />} label="Include" />
  //           <FormControlLabel value="false" control={<Radio />} label="Just my Playlist" />
  //         </RadioGroup>


  //       </FormControl>

  //       </div>
  //     </div>


  //   );
  // }
}

export default withStyles(styles)(PlaylistChooser);
// export default PlaylistChooser;

