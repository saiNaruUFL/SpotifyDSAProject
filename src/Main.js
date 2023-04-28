import React from 'react'
import Graph from './Graph'
import {useEffect,useState} from 'react';
import {getAccessToken,getSongIdByName,getReccomendedSongs,getTrackById,createPlaylist,getSpotifyGraphData} from './Spotify'
import { NodePage } from './NodePage';
import {InputPage} from './InputPage';
import jsonData from "./data/bruh_mini_3.json"
import Heap from "./Heap"

const Main = ({results,setResults,createAlbum,setCreateAlbum}) => {
  const [k,setK] = useState(0);
  const [connectedSongs,setConnectedSongs] = useState([]);
  const [rootSong,setRootSong] = useState('');
  const [song,setSong] = useState('');
  const [clicked,setClicked] = useState(0);
  const [clickedSong,setClickedSong] = useState(); 
  const [expand,setExpand] = useState(false);
  const [BFSFind,setBFSFind] = useState(false);
  const [data,setData] = useState();
  const [counter,setCounter] = useState(0);
  const [heapData,setHeapData] = useState();
  const [method,setMethod] = useState('');
  const [graphData,setGraphData] = useState([]);

  /*
    After authorizationd, code will be stored in local storage
    for future api calls
  */
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    if (code) {
      getAccessToken(code).then((accessToken) => {
        localStorage.setItem('accessToken', accessToken);
      });
    }
  }, []);

  /*
    Loadsd JSON dat for heap into Heap Data State
  */
  useEffect(() => {
    setHeapData(jsonData);
  }, []);

  /*
    Handles when user wants to find reccomended songs
  */
  const onGenerate = async (songName,selectedMethod,tempK) => {
    setK(tempK);  
    setSong(songName);
    setMethod(selectedMethod);
    getSongIdByName(songName)
    .then(async (songId) => {
      /*
        Getting the root song (request song) information 
        and appending to graph data
      */
      const root = await getTrackById(songId);
      setGraphData(root);
      setRootSong(root);
      return songId;
    })
    .then(async (songId) => {
      /*
        After loading in root song information, get data
        to connected songs from root song
      */
      const connectedSongs = await getReccomendedSongs(songId);
      setGraphData([...graphData, ...connectedSongs]);
      setConnectedSongs(connectedSongs);
      
      return songId;
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  }


  const handleClickBFSFind = () => {
    setBFSFind(true);  
  }
  const handleExpand = () => {
     setExpand(true);
  }

  /*
   Handles logic when user wants to create a new album,
  based on type of visualization (heap or graph), the album
  is created
  */
  const handleCreateAlbum = async () => {
    if(method === 'heap'){
        await createPlaylist(results);
        setCreateAlbum(createAlbum + 1);
    }
    else {
      const newGraphData = await getSpotifyGraphData(graphData);
      await createPlaylist(newGraphData);
      setCreateAlbum(createAlbum + 1);
      setResults(newGraphData);
    }
  }
  return (
    <>
      <div style={{display: 'flex'}}>
        <InputPage onGenerate={onGenerate} handleClickBFSFind={handleClickBFSFind} handleCreateAlbum={handleCreateAlbum}/>
        {method === 'heap' ? (
            <Heap results={results} setResults={setResults} k={k} rootSong={rootSong} heapData={heapData} clicked={clicked} clickedSong={clickedSong} setClickedSong={setClickedSong}/>
        ) : (
          <Graph graphData={graphData} setGraphData={setGraphData} counter={counter} setCounter={setCounter} data={data} setData={setData} BFSFind={BFSFind} setBFSFind={setBFSFind} expand={expand} setExpand={setExpand} song={song} rootSong={rootSong} connectedSongs={connectedSongs} clicked={clicked} clickedSong={clickedSong} setClickedSong={setClickedSong}/>
        )}
        <NodePage handleExpand={handleExpand} clickedSong={clickedSong}/>
      </div>
  
    </>
  )
}

export default Main;