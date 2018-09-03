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
      // eslint-disable-next-line
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export function setAccessToken(accessToken) {
	spotifyApi.setAccessToken(accessToken);
}

export async function getUserPlaylists() {
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

export async function getSimplePlaylistTracks(playlistId){
	try {
		const tracks = await spotifyApi.getPlaylistTracks(playlistId);
		const simpleTracks = tracks.items.map((trackObject) => {
			const track = trackObject.track;
			const album = trackObject.track.album;
			const artist = trackObject.track.artists[0]
			return {
				trackId: track.id,
				trackName: track.name,
				trackUri: track.uri,
				albumId: album.id,
				albumName: album.name,
				albumUri: album.uri,
				artistId: artist.id,
				artistName: artist.name,
				artistUri: artist.uri,
			}
		})
		console.log("simpleTracks below");
		console.log(simpleTracks);
		return simpleTracks
	}
	catch(err) {
		console.error('Error: getSimplePlaylistTracks in spotifyFunctions', err);
		console.error(err.stack);
	}
}

export async function byAlbumNoDiscography(playlistId){
	console.log("playlistId from byAlbumNoDiscography",playlistId);
	try {
		const tracks = await getSimplePlaylistTracks(playlistId);
		console.log("tracks before sorting by album",tracks);
		const sortedByAlbum = [...tracks].sort(albumSorterHelper)
		console.log("sortedByAlbum ",sortedByAlbum);
		
	}
	catch(err) {
		console.error('Error: in byAlbumNoDiscography in spotifyFunctions', err);
		console.error(err.stack);
	}
}

function albumSorterHelper(a, b){
	const first = a.albumName.toLowerCase();
	const second = b.albumName.toLowerCase();
	const comparison = first >= second ? 1 : -1;
	return comparison
}

function artistSorterHelper(a, b){
	const first = a.artistName.toLowerCase();
	const second = b.artistName.toLowerCase();
	const comparison = first >= second ? 1 : -1;
	return comparison
}


//sortByAlbum
//reOrderByAlbumTrackOrder
//sortByArtist
//identifyArtistsInPlaylist
//identifyAlbumsInPlaylist
//playPlaylist - need to build off of .play method with playlist URI
//getPlaylistTracks - built in, but modifying with wrapper function to simplyify
//createPlaylist - built in
//getTracksForAlbum - built in


