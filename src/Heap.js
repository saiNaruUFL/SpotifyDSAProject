import ReactAudioPlayer from 'react-audio-player';
import React, { useEffect, useState, useRef } from 'react';
import { DataSet, Network } from 'vis';
import PriorityQueue from "js-priority-queue"
import {getSpotifyData} from './Spotify';

export const Heap = ({results,setResults,k,heapData,rootSong,clickedSong,setClickedSong}) => {
  const [nodes, setNodes] = useState(new DataSet([
    { id: 1, label: 'Example Node', image: 'https://via.placeholder.com/150', color: '#FFA500' },
  ]));
  const [edges, setEdges] = useState(new DataSet([]));
  const [count,setCount] = useState(0);
  const [audioUrl,setAudioUrl] = useState('');
  const container = useRef(null);
  const networkContainer = useRef(null);
  const [maxHeapFinal,setMaxHeapFinal] = useState(new PriorityQueue({ comparator: (a, b) => b.differVal - a.differVal}));
  const [tempResults,setTempResults] = useState([]);
  
  /*
    Anytime the heap data changes or root song changes,
    that means heap has to be reconstructed
  */
  useEffect(() => {
    if(rootSong && heapData) {
      const bruh = [];
      const maxHeap = new PriorityQueue({ comparator: (a, b) => b.differVal - a.differVal});
      let i = 0;
      
      /*
        Looping through each song and finds k closest songs using max heap
      */
      heapData.forEach((song1) => {
        /* Computing the difference score between a given song and the root song
        using spotify attributes */
        let diff = Math.abs(parseFloat(song1.acousticness) - parseFloat(rootSong.acousticness)) * 10;
        diff += Math.abs(parseFloat(song1.danceability) - parseFloat(rootSong.danceability)) * 10;
        diff += Math.abs(parseFloat(song1.energy) - parseFloat(rootSong.energy)) * 10;
        diff += Math.abs(parseFloat(song1.instrumentalness) - parseFloat(rootSong.instrumentalness)) * 10;
        diff += Math.abs(parseFloat(song1.loudness) - parseFloat(rootSong.loudness)) * 10;
        diff += Math.abs(parseFloat(song1.speechiness) - parseFloat(rootSong.speechiness)) * 10;
        diff += Math.abs(parseFloat(song1.tempo) - parseFloat(rootSong.tempo)) * 10;
        diff += Math.abs(parseFloat(song1.valence) - parseFloat(rootSong.valence)) * 10;
        
        if(maxHeap.length < k) {
          const newSong = {
            ...song1,
            differVal: diff
          };
          maxHeap.queue(newSong);
        }
        else {
          const topSong = maxHeap.peek();
          if(diff < topSong.differVal)
          {
            const newSong = {
              ...song1,
              differVal: diff
            };
            bruh.push(newSong);
            maxHeap.dequeue();
            maxHeap.queue(newSong);
          }
        }
        i += 1;
      });
      setMaxHeapFinal(maxHeap);
    }
  },[heapData,rootSong])


  /*
   After max heap creation, the values in the heap are
   stored in results for later use
  */
  useEffect(() => {
  
  /*
    returns a list of spotify data objects given a heap
  */
   const fetchData = async () => {
    try {
      const data = await getSpotifyData(maxHeapFinal);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  fetchData()
  .then((songs) => {
    setResults(songs);
    setTempResults(songs);
  })
  
  },[maxHeapFinal]);
  

/*
  Deals with actual heap visualization after results is 
  updated
*/
 useEffect(() => {
  if(tempResults.length >= 2) {
  if(results.length >= 2) {
    const newNodes = new DataSet([
      {id: 0, label: results[0].trackName, shape: "circularImage",image:results[0].image}
    ]);
    const newEdges = new DataSet([]);


    //Building heap pointing each node to its parent
    for (let i = 1; i < results.length; i++) {
        newNodes.add({id:i,label: results[i].trackName,shape:"circularImage",image:results[i].image});

        newEdges.add({
          from: i,
          to: parseInt((i - 1) / 2),
          id: i,
          width: 5
        });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    
    const data = {
      nodes: newNodes,
      edges: newEdges,
    };

    //Defining the parameters for heap visualization
    const options = {
      layout: {
        hierarchical: {
          direction: "DU",
          sortMethod: "directed",
          levelSeparation: 100,
        },
      },
    };
    
    //Refitting the data based on the new nodes and edges
    networkContainer.current = new Network(container.current, data,options);
    
    //Handles "onClick" on nodes
    networkContainer.current.on("click", (event) => {
      if (event.nodes.length) {
        handleData(event.nodes[0]);
      }
    });
    

 }
}
  },[tempResults])


  /*
   Handles "onClick" on a given node by setting "clickedNode"
   to updated data, and also plays audio for that given node
  */
  const handleData = (nodeId) => {
    setCount(count + 1);
    setClickedSong({
      artistName: results[nodeId].artist,
      albumName: results[nodeId].albumName,
      songName: results[nodeId].name,
      songLen: results[nodeId].duration,
      acousticness: results[nodeId].acousticness,
      danceability: results[nodeId].danceability,
      energy: results[nodeId].energy,
      mpLink: results[nodeId].mp3Link,
      nodeID: results[nodeId].id
    });
    
    stopAudio();
    playAudio(results[nodeId].mp3Link);
    
  }
  
  function playAudio(url) {
    setAudioUrl(url);
  }

  function stopAudio() {
    setAudioUrl('');
  }

  return (
    <>
    <div ref={container} className="networkContainer"style={{ width: '1200px', height: '800px', border: '1px solid black', backgroundColor: '#212121',borderRadius: '10px'}} />
    <div style={{ display: 'none' }}>
        <ReactAudioPlayer
          src={audioUrl}
          autoPlay
          controls={false}
        />
       </div>
  </>
  )
}

export default Heap;