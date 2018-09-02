import Spotify from 'spotify-web-api-js';

export function redirectUrlToSpotifyForLogin(){
	var CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    var REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scopes = [
    "user-modify-playback-state", 
    "user-library-read", 
    "user-library-modify", 
    "playlist-read-private", 
    "playlist-modify-public", 
    "playlist-modify-private"];
    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&scope=' + encodeURIComponent(scopes.join(' ')) +
      '&response_type=token';
}

const spotifyApi = new Spotify();
// spotifyApi.setPromiseImplementation(Promise);

export function checkUrlForSpotifyAccessToken(){
	const params = getHashParams();
	const accessToken = params.access_token
	if (!accessToken) {
		return false
	}
	else {
		return accessToken
	}
}

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export function setAccessToken(accessToken) {
	spotifyApi.setAccessToken(accessToken);
}

export async function getUserPlaylists(accessToken) {
	//returns an array of objects with playlist name (like "Favorite Smashing Pumpkins jamz")
	//and the id of the playlist. Use this to feed the playlists selection list 

	try {
		const playlistsResponse = await spotifyApi.getUserPlaylists();
		//items are the actual playlist objects
		const {items} = playlistsResponse;
		const playlists = items.map((playlistObject) => {
			const {id, name} = playlistObject;
			return {id: id, playlistName: name}
		})
		return playlists
	}
	catch(err) {
		//return default array with note that can't download playlists
		console.error('Error: Attempting to get user playlists', err);
		console.error(err.stack);
		return [{id: null, playlistName: "Can't Download your Playlists!"}]
	}
}
