import React from 'react'
import Graph from './Graph'
import Form from './Form'
import {useEffect,useState} from 'react';
import {getAccessToken,getSongIdByName,getReccomendedSongs,getTrackById,createPlaylist,getSpotifyGraphData} from './Spotify'
import { NodePage } from './NodePage';
import {InputPage} from './InputPage';
import jsonData from "./data/bruh_mini_3.json"
import Heap from "./Heap"

//import { rmSync } from 'fs';

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

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    if (code) {
      getAccessToken(code).then((accessToken) => {
        localStorage.setItem('accessToken', accessToken);
      });
    }
  }, []);

  useEffect(() => {
    // Load the CSV data into an array of objects when the component mounts
    console.log("hello");
    setHeapData(jsonData);
    //console.log(jsonData);
   // console.log(jsonData);
  }, []);

  const onGenerate = async (songName,selectedMethod,tempK) => {
    console.log("Generation Clicked");
    setK(tempK);  
    setSong(songName);
    setMethod(selectedMethod);
    getSongIdByName(songName)
    .then(async (songId) => {
      const root = await getTrackById(songId);
      console.log("Inside of getting root song");
      setGraphData(root);
      setRootSong(root);
      return songId;
    })
    .then(async (songId) => {
      const connectedSongs = await getReccomendedSongs(songId);
     // console.log(graphData);
      setGraphData([...graphData, ...connectedSongs]);
      //console.log(connectedSongs);
      setConnectedSongs(connectedSongs);
      
      return songId;
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  }

  const dfs = () => {
    //console.log("hello");
    setClicked(clicked + 1);
  }

  const handleClickBFSFind = () => {
    console.log("Setting BFSFind to True");
    setBFSFind(true);  
  }
  const handleExpand = () => {
     setExpand(true);
  }
  const handleCreateAlbum = async () => {
    if(method == 'heap'){
        await createPlaylist(results);
        setCreateAlbum(createAlbum + 1);
        console.log("heap check");
    }
    else {
      console.log("Graph Album");
      console.log("Old Data");
      console.log(graphData);
      const newGraphData = await getSpotifyGraphData(graphData);
      await createPlaylist(newGraphData);
      console.log("New Data");
      console.log(newGraphData);
      setCreateAlbum(createAlbum + 1);
      setResults(newGraphData);
    }
  }
  return (
    <>
     
      <div style={{display: 'flex'}}>
        <InputPage onGenerate={onGenerate} handleClickBFSFind={handleClickBFSFind} handleCreateAlbum={handleCreateAlbum}/>

        {method == 'heap' ? (
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