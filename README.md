Old School Shuffle is a simple example application showcasing how to use Cosmic JS as a simple but powerful
content management system and how to incorporate 3rd-party APIs like the Spotify API. Authors can write a
blog-post-like homage to a musical artist and enable a user to listen to their entire discography on Spotify,
or a user can shuffle their own spotify playlists by album.

NOTE that depending on Spotify permissions Old School Shuffle may only make playlists and not auto-play
Playlists may take a minute or two to show up in your My Playlist in Spotify

## Old School Shuffle
![Old School Shuffle Main Screen](https://cosmic-s3.imgix.net/24e943d0-bb8d-11e8-b636-875449e759a9-ice_screenshot_20180918-165220.png?w=1200)
![Old School Shuffle Gif](https://s3-us-west-2.amazonaws.com/cosmicjs/fa148390-b6be-11e8-874b-ab18fd9de82b-doneShow.gif)

## Live Demo
http://oldschoolshuffle.cosmicapp1.co/

## Setup/ Installation Instructions

```
#clone repo
git clone https://github.com/gate5th/oldschoolshuffle.git

# install dependencies
npm install

#configure .env variables
rename .env.sample to .env and paste your API keys for Cosmic and from spotify developer dashboard

#start development environment
npm start

#to build production files and stare
npm run productionstart

```
