import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios'
const spotifyApi = new SpotifyWebApi();


//API call that gets audio features given spotify ID
//Input -> Spotify ID
//Ouput -> json data of audio features (i.e danceability, energy, etc)
export async function getTrackAudioFeaturesById(trackId){
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
 
  return data;
}

//Given Spotify ID, return json data for that song
//JSON Repsonse will give:
// id, name of song, artist name, album name, image of album, duration, mp3Link
export async function getTrackById(trackId) {
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const response2 = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  const data2 = await response2.json();
  //console.log("Data 1: ");
  //console.log(data);
  //console.log("Data 2: ");
  //console.log(data2);
  const track = {
    id: data.id,
    name: data.name,
    uri: data.uri,
    artist: data.artists[0].name,
    image: data.album.images[0].url,
    albumName: data.album.name,
    duration: data.duration_ms,
    mp3Link: data.preview_url,
    acousticness: data2.acousticness,
    danceability: data2.danceability,
    energy: data2.energy,
    instrumentalness: data2.instrumentalness,
    loudness: data2.loudness,
    speechiness: data2.speechiness,
    tempo: data2.tempo,
    valence: data2.valence,
    liveness: data2.liveness
  };
  //console.log(track);
  
  return track;
}


//Given song finds recommeded songs
export async function getReccomendedSongs(songId) {
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${songId}&limit=${5}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recommended songs: ${response.status} ${response.statusText}`);
  }


  const data = await response.json();
  const recommendedSongs = data.tracks.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    image: track.album.images[0].url
  }));
  
  return recommendedSongs;
}

export async function getSongIdByName(songName){
  ////console.log("Access-Token: " + localStorage.getItem('accessToken'));

  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
  };

  const response = await axios.get(`https://api.spotify.com/v1/search?q=${songName}&type=track`, { headers });
 // //console.log(response);
  const track = response.data.tracks.items[0];
//  //console.log("Track: ")
  //console.log(track);
  return track.id;
}

export function authorize() {
  const clientId = 'fd13ae26a51f4eb1b6348b31d4a41eca';
  const redirectUri = 'http://localhost:3000/main'; // or your production URL
  const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private','playlist-modify-public','playlist-modify-private'];

  const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}`;

  window.location.href = authorizeUrl;
}


export async function getAccessToken(code) {
  
    //Probably have to replace these values with your own spotify developer codes
    //Make an spotify developer account and replace these values 
    //https://developer.spotify.com/dashboard/login
    const clientId = 'fd13ae26a51f4eb1b6348b31d4a41eca';
    const clientSecret = 'd7a9efebd50d445f8d13e80d613d463a';
    const redirectUri = 'http://localhost:3000/main'; // or your production URL

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    });

    const data = await response.json();
    if (data.access_token) {
      //console.log("Generating Access Token");
      return data.access_token;
    } else {
      //console.log("no broddy")
      throw new Error('Failed to obtain access token');
    }
  
 // //console.log(localStorage.getItem('accessToken'));
}


export function authorizeAndSetAccessToken() {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  } else {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      getAccessToken(code)
        .then((accessToken) => {
          localStorage.setItem('accessToken', accessToken);
          spotifyApi.setAccessToken(accessToken);
        })
        .catch((error) => {
          //console.error(error);
        });
    }
  }
}

// Function to get Spotify data for a list of song IDs
export async function getSpotifyData(maxHeap){
  // Initialize array to store song data
  const songData = [];

  const accessToken = localStorage.getItem('accessToken');
  spotifyApi.setAccessToken(accessToken);

//  console.log("Inside of Get Spotify Data")
 // console.log("Max Heap Data: ");
  //console.log(maxHeap);
  // Loop through each ID and fetch data
  while(maxHeap.length != 0) {
    // Get data for song with current ID
    const topTrack = maxHeap.peek(); maxHeap.dequeue()
    
    const song = await getTrackById(topTrack.id);

    // Push song data to array
    songData.push(song);
  }

  //console.log("Song Data Finsihed");
  //console.log(songData);
  // Return array of song data
  return songData;
}


// Function to get Spotify data for a list of song IDs specficically for graphs
export async function getSpotifyGraphData(graphData){
  // Initialize array to store song data
  const songData = [];

  const accessToken = localStorage.getItem('accessToken');
  spotifyApi.setAccessToken(accessToken);

  for(let i = 0;i < graphData.length;i++){
    const song = await getTrackById(graphData[i].id);
    songData.push(song);
  }

  return songData;
}

export async function createPlaylist(songs) {
  // Replace with your own Spotify API credentials
  const accessToken = localStorage.getItem('accessToken');
  //const refreshToken = localStorage.getItem('refreshToken');
  //console.log("Songs");
 // console.log(songs);
  // Set the access token on the Spotify API instance
  spotifyApi.setAccessToken(accessToken);

  const songUris = songs.map((song) => song.uri);
  // Get the user's profile information
  spotifyApi.getMe().then((response) => {
    const userId = response.id;
    //console.log("My Data");
    //console.log(response);
    
    // Create a new playlist with the user's name and the current date
    const currentDate = new Date().toISOString().slice(0, 10);
    const playlistName = `${response.display_name}'s Playlist - ${currentDate}`;
    spotifyApi.createPlaylist(userId, { name: playlistName })
    .then((response) => {
     // console.log("Album Created");
      const playlistId = response.id;
     // console.log("Album ID: " + response.id);
      // Add each song to the new playlist
      spotifyApi.addTracksToPlaylist(playlistId, songUris);
     // console.log(songUris);
    })
    .then((response) => {
     // console.log("finsihed");
    });
  });
}
