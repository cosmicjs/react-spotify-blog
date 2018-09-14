import Spotify from "spotify-web-api-js";
import uniq from "lodash.uniq";
import flatten from "lodash.flatten";
import chunk from "lodash.chunk";

const spotifyApi = new Spotify();

export function redirectUrlToSpotifyForLogin() {
	const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
	const REDIRECT_URI =
		process.env.NODE_ENV === "production"
			? process.env.REACT_APP_SPOTIFY_PRODUCTION_REDIRECT_URI
			: process.env.REACT_APP_SPOTIFY_DEVELOPMENT_REDIRECT_URI;
	const scopes = [
		"user-modify-playback-state",
		"user-library-read",
		"user-library-modify",
		"playlist-read-private",
		"playlist-modify-public",
		"playlist-modify-private"
	];
	return (
		"https://accounts.spotify.com/authorize?client_id=" +
		CLIENT_ID +
		"&redirect_uri=" +
		encodeURIComponent(REDIRECT_URI) +
		"&scope=" +
		encodeURIComponent(scopes.join(" ")) +
		"&response_type=token"
	);
}

export function checkUrlForSpotifyAccessToken() {
	const params = getHashParams();
	const accessToken = params.access_token;
	if (!accessToken) {
		return false;
	} else {
		return accessToken;
	}
}

function getHashParams() {
	//helper function to parse the query string that spotify sends back when you log in
	var hashParams = {};
	var e,
		r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
	// eslint-disable-next-line
	while ((e = r.exec(q))) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

export function setAccessToken(accessToken) {
	//since using spotifyApi as helper library you can set the access code once
	//you get it and then not have to include it in every request
	spotifyApi.setAccessToken(accessToken);
}

export async function getUserPlaylists() {
	//returns an array of objects with playlist name (like "Favorite Smashing Pumpkins jamz")
	//and the id of the playlist. Use this to feed the playlists selection list
	try {
		const playlistsResponse = await spotifyApi.getUserPlaylists();
		//playlistsResponse.items are the actual playlist objects
		const playlists = playlistsResponse.items.map((playlistObject) => {
			const { id, name } = playlistObject;
			return { id: id, playlistName: name };
		});
		return playlists;
	} catch (err) {
		//return default array with note that can't download playlists
		console.error("Error: Attempting to get user playlists", err);
		console.error(err.stack);
		return [{ id: null, playlistName: "Can't Download your Playlists!" }];
	}
}

async function getSimplePlaylistTracks(playlistId) {
	//track_number is what track number a song is on the album
	try {
		const tracks = await spotifyApi.getPlaylistTracks(playlistId);
		//getPlaylistTracks has a bunch of meta data about the playlist we don't need
		//once again items is the property we really want. It's an array of tracks
		const simpleTracks = tracks.items.map((trackObject) => {
			const track = trackObject.track;
			const album = trackObject.track.album;
			const artist = trackObject.track.artists[0];
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
				artistUri: artist.uri
			};
		});
		return simpleTracks;
	} catch (err) {
		console.error(
			"Error: getSimplePlaylistTracks in spotifyFunctions",
			err
		);
		console.error(err.stack);
	}
}

async function getSimpleAlbumTracks(albumId, albumName, albumUri) {
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
				artistUri: artist.uri
			};
		});
		return simpleTracks;
	} catch (err) {
		console.error(
			"Error: getSimplePlaylistTracks in spotifyFunctions",
			err
		);
		console.error(err.stack);
	}
}

function identifyAlbumsInPlaylist(
	simplifiedPlaylist,
	returnSimpleArray = true
) {
	//returns an array of albumIds that appear in the playlist, without duplicates
	let albumIds = simplifiedPlaylist.map((track) => {
		if (returnSimpleArray) {
			return track.albumId;
		} else {
			return {
				albumId: track.albumId,
				albumName: track.albumName,
				albumUri: track.albumUri
			};
		}
	});
	albumIds = uniq(albumIds);
	albumIds = shuffleArray(albumIds);
	return albumIds;
}

function shuffleArray(input) {
	for (let i = input.length - 1; i >= 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		const itemAtIndex = input[randomIndex];
		input[randomIndex] = input[i];
		input[i] = itemAtIndex;
	}
	return input;
}

async function identifyAlbumsByArtistId(artistId, returnSimpleArray = true) {
	//returns an array of albumIds that appear in the playlist, without duplicates
	const arrayOfAlbumObjects = await spotifyApi.getArtistAlbums(artistId);
	let albumIds = arrayOfAlbumObjects.items.map((albumObj) => {
		if (returnSimpleArray) {
			return albumObj.id;
		} else {
			return {
				albumId: albumObj.id,
				albumName: albumObj.name,
				albumUri: albumObj.uri
			};
		}
	});
	albumIds = uniq(albumIds);
	albumIds = shuffleArray(albumIds);
	return albumIds;
}

function convertPlaylistToObjectByProperty(simplifiedPlaylist, propertyName) {
	//use to group large array of tracks into smaller arrays of tracks from same album
	//this lets us easily sort tracks for a single album, then do a for..in loop
	//over each albumId as an object key and combine the arrays back together
	let playlistObject = {};
	//eslint-disable-next-line
	simplifiedPlaylist.map((track) => {
		if (!playlistObject[track[propertyName]]) {
			playlistObject[track[propertyName]] = [];
		}
		playlistObject[track[propertyName]].push(track);
	});
	//now sort the array in each property by trackNumber, so tracks play in the same order as the album
	for (let relatedTrackArray in playlistObject) {
		playlistObject[relatedTrackArray].sort(dynamicSort("trackNumber"));
	}
	return playlistObject;
}

function dynamicSort(property) {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function(a, b) {
		var result =
			a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}

export async function byAlbumNoDiscography(state) {
	//receives this.state from playlistChooser and extract what you need
	const {
		chosenPlaylistId: playlistId,
		chosenPlaylistName: playlistName
	} = state;
	try {
		let tracks = await getSimplePlaylistTracks(playlistId);
		const albumIds = identifyAlbumsInPlaylist(tracks);
		const playlistObject = convertPlaylistToObjectByProperty(
			tracks,
			"albumId"
		);
		let tracksByAlbum = albumIds.map((albumId) => {
			return playlistObject[albumId];
		});
		const sortedByAlbumAndTrack = flatten(tracksByAlbum);
		await createPlaylist(sortedByAlbumAndTrack, playlistName, false);
	} catch (err) {
		console.error(
			"Error: in byAlbumNoDiscography in spotifyFunctions",
			err
		);
		console.error(err.stack);
	}
}

export async function byAlbumWithDiscography(state) {
	//receives this.state from playlistChooser and extract what you need
	const {
		chosenPlaylistId: playlistId,
		chosenPlaylistName: playlistName
	} = state;
	try {
		let tracks = await getSimplePlaylistTracks(playlistId);
		const albumIds = identifyAlbumsInPlaylist(tracks, false);
		const shuffledAlbums = shuffleArray(albumIds);
		//forget the playlist now that we know the albums - start fresh
		const promiseArrayOfTracksFromAlbum = shuffledAlbums.map(
			async (albumObject) => {
				const response = await getSimpleAlbumTracks(
					albumObject.albumId,
					albumObject.albumName,
					albumObject.albumUri
				);
				return response;
			}
		);
		const tracksByAlbum = await Promise.all(promiseArrayOfTracksFromAlbum);
		const sortedByAlbumAndTrack = flatten(tracksByAlbum);
		await createPlaylist(sortedByAlbumAndTrack, playlistName, true);
	} catch (err) {
		console.error(
			"Error: in byAlbumWithDiscography in spotifyFunctions",
			err
		);
		console.error(err.stack);
	}
}

export async function playArtistDiscography(artistId, artistName) {
	//receives this.state from playlistChooser and extract what you need
	try {
		const albumIds = await identifyAlbumsByArtistId(artistId, false);
		const shuffledAlbums = shuffleArray(albumIds);
		const promiseArrayOfTracksFromAlbum = shuffledAlbums.map(
			async (albumObject) => {
				const response = await getSimpleAlbumTracks(
					albumObject.albumId,
					albumObject.albumName,
					albumObject.albumUri
				);
				return response;
			}
		);
		const tracksByAlbum = await Promise.all(promiseArrayOfTracksFromAlbum);
		const sortedByAlbumAndTrack = flatten(tracksByAlbum);
		await createPlaylist(
			sortedByAlbumAndTrack,
			`${artistName} Discography`,
			"false"
		);
	} catch (err) {
		console.error(
			"Error: in playArtistDiscography in spotifyFunctions",
			err
		);
		console.error(err);
		console.error(err.stack);
	}
}

async function createPlaylist(
	simplifiedTrackArray,
	playlistName,
	addRelatedDiscography
) {
	//have to get userId, create a playlist in spotify with the name, and then add the tracks to it
	//options is whether to addDiscography
	//Note that Spotify is very picky about what counts as an 'active device' so likely don't have permission to press
	//play. Also only works if the user has premium. Also spotify will only let you add 100 tracks
	//per addTracksToPlaylist request, so need to split the trackUris up if more than 100 tracks

	const maxTracksToAddInEachRequest = 100;
	const userInfoResponse = await spotifyApi.getMe();
	const name = `${playlistName} - Album Shuffled - ${
		addRelatedDiscography === "true" ? "with related discography" : ""
	}`;
	const description =
		"Made with the oldschoolshuffle app to enable shuffling by album, the way music was meant to be listened to";
	//es6 destructuring and renaming
	const { id: userId } = userInfoResponse;
	const playlistOptions = { name: name, description: description };
	console.log("playlistOptions ", playlistOptions);
	console.log("userId ", userId);
	const newPlaylistResponse = await spotifyApi.createPlaylist(
		userId,
		playlistOptions
	);
	console.log("newPlaylistResponse from createPlaylist", newPlaylistResponse);
	const trackUris = simplifiedTrackArray.map((trackObject) => {
		return trackObject.trackUri;
	});

	console.log("trackUris to send to make playlist", trackUris);

	try {
		if (trackUris.length < maxTracksToAddInEachRequest) {
			return await spotifyApi.addTracksToPlaylist(
				newPlaylistResponse.id,
				trackUris
			);
		} else {
			const chunkedTrackUris = chunk(
				trackUris,
				maxTracksToAddInEachRequest
			);
			const promisesOfChunkedUris = chunkedTrackUris.map(
				async (chunkOfTrackUris) => {
					//eslint-disable-next-line
					const addTracksToPlaylistResponse = await spotifyApi.addTracksToPlaylist(
						newPlaylistResponse.id,
						chunkOfTrackUris
					);
				}
			);
			await Promise.all(promisesOfChunkedUris);
			return await spotifyApi.play({
				context_uri: newPlaylistResponse.uri
			});
		}
	} catch (err) {
		console.log(
			"Oops - no spotify player is active so just made a playlist"
		);
	}
}
