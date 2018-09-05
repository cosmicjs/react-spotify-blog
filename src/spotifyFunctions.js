import Spotify from 'spotify-web-api-js';
import startCase from 'lodash.startcase';
import uniq from 'lodash.uniq';
import flatten from 'lodash.flatten';
import chunk from 'lodash.chunk';

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
	//track_number is what track number a song is on the album
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
				trackNumber: track.track_number,
				albumId: album.id,
				albumName: album.name,
				albumUri: album.uri,
				artistId: artist.id,
				artistName: artist.name,
				artistUri: artist.uri,
			}
		})
		console.log("simpleTracks ",simpleTracks);
		return simpleTracks
	}
	catch(err) {
		console.error('Error: getSimplePlaylistTracks in spotifyFunctions', err);
		console.error(err.stack);
	}
}

export async function getSimpleAlbumTracks(albumId, albumName, albumUri){
	//track_number is what track number a song is on the album
	try {
		const tracks = await spotifyApi.getAlbumTracks(albumId);
		const simpleTracks = tracks.items.map((track) => {
			const artist = track.artists[0];
			return {
				trackId: track.id,
				trackName: track.name,
				trackUri: track.uri,
				trackNumber: track.track_number,
				albumId: albumId,
				albumName: albumName,
				albumUri: albumUri,
				artistId: artist.id,
				artistName: artist.name,
				artistUri: artist.uri,
			}
		})
		return simpleTracks
	}
	catch(err) {
		console.error('Error: getSimplePlaylistTracks in spotifyFunctions', err);
		console.error(err.stack);
	}
}

async function createPlaylist(simplifiedTrackArray, playlistName, addRelatedDiscography) {
	//have to get userId, create a playlist in spotify with the name, and then add the tracks to it
	//options is whether to addDiscography and by artist or by album
	//return object with playlist id and playlist urifor the new playlist
	const getUserResponse = await spotifyApi.getMe();
	const name = `${playlistName} - Album Shuffled - ${addRelatedDiscography === "true" ? 'with related discography' : ''}`;
	const description = 'Made with the oldschoolshuffle app to enable shuffling by album, the way music was meant to be listened to';
	//es6 destructuring and renaming
	const {id: userId} = getUserResponse;
	const playlistOptions = {name: name, description: description}
	const newPlaylistResponse = await spotifyApi.createPlaylist(userId, playlistOptions);
	const trackUris = simplifiedTrackArray.map((trackObject) => {
		return trackObject.trackUri
	})
	//spotify will only  let you add 100 tracks per addTracksToPlaylist request, so need to split the trackUris up
	//if more than 100 tracks
	const maxTracksToAddInEachRequest = 100;

	if (trackUris.length <maxTracksToAddInEachRequest) {
		const addTracksToPlaylistResponse = await spotifyApi.addTracksToPlaylist(newPlaylistResponse.id, trackUris);
		//finally play the new playlist!
		await spotifyApi.play({context_uri: newPlaylistResponse.uri});
		return {id: newPlaylistResponse.id, uri: newPlaylistResponse.uri, url: newPlaylistResponse.external_urls.spotify}
	}
	else {
		const chunkedTrackUris = chunk(trackUris, maxTracksToAddInEachRequest);
		const promisesOfChunkedUris = chunkedTrackUris.map(async (chunkOfTrackUris) => {
			const addTracksToPlaylistResponse = await spotifyApi.addTracksToPlaylist(newPlaylistResponse.id, chunkOfTrackUris);
		})
		const done = await Promise.all(promisesOfChunkedUris);
		//finally play the new playlist!
		await spotifyApi.play({context_uri: newPlaylistResponse.uri});
		return {id: newPlaylistResponse.id, uri: newPlaylistResponse.uri, url: newPlaylistResponse.external_urls.spotify}
		
	}
}

function identifyAlbumsInPlaylist(simplifiedPlaylist, returnSimpleArray=true) {
	//returns an array of albumIds that appear in the playlist, without duplicates
	let albumIds = simplifiedPlaylist.map((track) => {
		if (returnSimpleArray) {
			return track.albumId
		} else {
			return ({albumId: track.albumId, albumName: track.albumName, albumUri: track.albumUri})
		}
	})
	albumIds = uniq(albumIds);
	albumIds = shuffleArray(albumIds);
	return albumIds;
}

async function identifyAlbumsByArtistId(artistId, returnSimpleArray=true) {
	//returns an array of albumIds that appear in the playlist, without duplicates
	const arrayOfAlbumObjects = await spotifyApi.getArtistAlbums(artistId)
	console.log("arrayOfAlbumObjects.items from identifyAlbumsByArtistId",arrayOfAlbumObjects.items);
	let albumIds = arrayOfAlbumObjects.items.map((albumObj) => {
		if (returnSimpleArray) {
			return albumObj.id
		} else {
			return ({albumId: albumObj.id, albumName: albumObj.name, albumUri: albumObj.uri})
		}
	})
	albumIds = uniq(albumIds);
	albumIds = shuffleArray(albumIds);
	console.log("albumIds from identifyAlbumsByArtistId",albumIds);
	return albumIds;
}

function convertPlaylistToObjectByProperty(simplifiedPlaylist, propertyName){
	//use to group large array of tracks into smaller arrays of tracks from same album or artist
	//also sorts related tracks within a property by trackName
	let playlistObject = {};
	simplifiedPlaylist.map((track) => {
		if (!playlistObject[track[propertyName]]) {
			playlistObject[track[propertyName]] = [];
		}
		playlistObject[track[propertyName]].push(track)
	})
	for (let relatedTrackArray in playlistObject) {
		playlistObject[relatedTrackArray].sort(dynamicSort('trackNumber'));
	}
	return playlistObject
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function shuffleArray(input) {
    for (let i = input.length-1; i >=0; i--) {
        const randomIndex = Math.floor(Math.random()*(i+1)); 
        const itemAtIndex = input[randomIndex]; 
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}

export async function byAlbumNoDiscography(state){
	console.log('byAlbumNoDiscography called');
	//receives this.state from playlistChooser and extract what you need
	const {chosenPlaylistId: playlistId, chosenPlaylistName:playlistName, addRelatedDiscography} = state;
	try {
		let tracks = await getSimplePlaylistTracks(playlistId);
		const albumIds = identifyAlbumsInPlaylist(tracks);
		const playlistObject = convertPlaylistToObjectByProperty(tracks, 'albumId');
		let tracksByAlbum = albumIds.map((albumId) => {
			return playlistObject[albumId]
		});
		const sortedByAlbumAndTrack = flatten(tracksByAlbum);
		const newPlaylist = await createPlaylist(sortedByAlbumAndTrack, playlistName, addRelatedDiscography);
	}
	catch(err) {
		console.error('Error: in byAlbumNoDiscography in spotifyFunctions', err);
		console.error(err.stack);
	}
}

export async function byAlbumWithDiscography(state){
	console.log('by album with discography called');
	//receives this.state from playlistChooser and extract what you need
	const {chosenPlaylistId: playlistId, chosenPlaylistName:playlistName, addRelatedDiscography} = state;
	try {
		let tracks = await getSimplePlaylistTracks(playlistId);
		const albumIds = identifyAlbumsInPlaylist(tracks, false);
		const shuffledAlbums = shuffleArray(albumIds); 
		//forget the playlist now that we know the albums - start fresh
		const promiseArrayOfTracksFromAlbum = shuffledAlbums.map(async (albumObject) => {
			const response = await getSimpleAlbumTracks(albumObject.albumId, albumObject.albumName, albumObject.albumUri)
			return response
		})
		const tracksByAlbum = await Promise.all(promiseArrayOfTracksFromAlbum);
		const sortedByAlbumAndTrack = flatten(tracksByAlbum);
		const newPlaylist = await createPlaylist(sortedByAlbumAndTrack, playlistName, addRelatedDiscography);
	}
	catch(err) {
		console.error('Error: in byAlbumWithDiscography in spotifyFunctions', err);
		console.error(err.stack);
	}
}

export async function playArtistDiscography(artistId, artistName){
	console.log('byAlbumNoDiscography called');
	//receives this.state from playlistChooser and extract what you need
	try {
		const albumIds = await identifyAlbumsByArtistId(artistId, false);
		const shuffledAlbums = shuffleArray(albumIds); 
		const promiseArrayOfTracksFromAlbum = shuffledAlbums.map(async (albumObject) => {
			const response = await getSimpleAlbumTracks(albumObject.albumId, albumObject.albumName, albumObject.albumUri)
			return response
		})
		const tracksByAlbum = await Promise.all(promiseArrayOfTracksFromAlbum);
		console.log("tracksByAlbum from playArtistDiscography",tracksByAlbum);
		const sortedByAlbumAndTrack = flatten(tracksByAlbum);
		const newPlaylist = await createPlaylist(sortedByAlbumAndTrack, `${artistName} Discography`, "false");
	}
	catch(err) {
		console.error('Error: in playArtistDiscography in spotifyFunctions', err);
		console.error(err);
		console.error(err.stack);
	}
}