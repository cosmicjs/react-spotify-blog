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

export async function getSpotifyAccessToken(){
	//prompts spotify login (if necessary) and returns Spotify access token
	//using implicit grant option from spotify so don't have to deal with server-side. 
	//access token only last 1 hour (3600 seconds)

	console.log('trying to get spotify token');
    console.log("process.env.REACT_APP_SPOTIFY_CLIENT_ID ",process.env.REACT_APP_SPOTIFY_CLIENT_ID);
    console.log("process.env.REACT_APP_SPOTIFY_REDIRECT_URI ",process.env.REACT_APP_SPOTIFY_REDIRECT_URI);
	var CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    var REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    console.log("CLIENT_ID ",CLIENT_ID);
    console.log("REDIRECT_URI ",REDIRECT_URI);
    const scopes = [
    "user-modify-playback-state", 
    "user-library-read", 
    "user-library-modify", 
    "playlist-read-private", 
    "playlist-modify-public", 
    "playlist-modify-private"];    
    console.log("encodeURIComponent(scopes.join(' ')) ",encodeURIComponent(scopes.join(' ')));
    
    function getLoginURL(scopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&scope=' + encodeURIComponent(scopes.join(' ')) +
      '&response_type=token';
 	}

 	console.log("getLoginURL(scopes) ",getLoginURL(scopes));
 	try {
 		const accessToken = await fetch(getLoginURL(scopes))
 		console.log("accessToken ",accessToken);
 		console.log("JSON.stringify(accessToken, null, 2) stringified response ",JSON.stringify(accessToken, null, 2));
 		return accessToken
 	}
 	catch(err){
 		console.error('Error: fetching Spotify Access Token', err);
 		console.error(err.stack);
 		return false
 	}

}

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