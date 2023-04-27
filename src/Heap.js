import ReactAudioPlayer from 'react-audio-player';
import React, { useEffect, useState, useRef } from 'react';
import { DataSet, Network } from 'vis';
import PriorityQueue from "js-priority-queue"
import { getTrackById,getSpotifyData,getTrackAudioFeaturesById} from './Spotify';

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

  let squaredDifference = (song1, song2) => {
    let diff = 0;
    diff += Math.pow(song1.acousticness - song2.acousticness, 2);
    diff += Math.pow(song1.danceability - song2.danceability, 2);
    diff += Math.pow(song1.energy - song2.energy, 2);
    diff += Math.pow(song1.instrumentalness - song2.instrumentalness, 2);
    diff += Math.pow(song1.loudness - song2.loudness, 2);
    diff += Math.pow(parseInt(song1.popularity) - parseInt(song2.popularity), 2);
    //diff += Math.pow(song1.speechiness - song2.speechiness, 2);
   // diff += Math.pow(song1.tempo - song2.tempo, 2);
   // diff += Math.pow(song1.valence - song2.valence, 2);
    return diff;
  };

  
  useEffect(() => {
    if(rootSong && heapData) {
     // console.log("root song");
     // console.log(rootSong);
      const bruh = [];
      const maxHeap = new PriorityQueue({ comparator: (a, b) => b.differVal - a.differVal});
      let i = 0;
     // console.log("Looping through data");
      heapData.forEach((song1) => {
        //console.log(song);
       // console.log(song1);
        let diff = Math.abs(parseFloat(song1.acousticness) - parseFloat(rootSong.acousticness)) * 10;
        diff += Math.abs(parseFloat(song1.danceability) - parseFloat(rootSong.danceability)) * 10;
        diff += Math.abs(parseFloat(song1.energy) - parseFloat(rootSong.energy)) * 10;
        diff += Math.abs(parseFloat(song1.instrumentalness) - parseFloat(rootSong.instrumentalness)) * 10;
        diff += Math.abs(parseFloat(song1.loudness) - parseFloat(rootSong.loudness)) * 10;
        diff += Math.abs(parseFloat(song1.speechiness) - parseFloat(rootSong.speechiness)) * 10;
        diff += Math.abs(parseFloat(song1.tempo) - parseFloat(rootSong.tempo)) * 10;
        diff += Math.abs(parseFloat(song1.valence) - parseFloat(rootSong.valence)) * 10;


     //   console.log("Song 1 Acousticness: " + song1.acousticness);
      //  console.log("Root Acoutsticness: " + rootSong.acousticness);
        //console.log("diff: " + diff);
        
        if(maxHeap.length < k) {
          const newSong = {
            ...song1,
            differVal: diff
          };
          maxHeap.queue(newSong);
     //     console.log("We are less than 2");
      //    console.log(i);
        }
        else {
          const topSong = maxHeap.peek();
        //  console.log("current max song: " + topSong.differVal);
          if(diff < topSong.differVal)
          {
          //  console.log("Swap Occuring");
            const newSong = {
              ...song1,
              differVal: diff
            };
            bruh.push(newSong);
            maxHeap.dequeue();
            maxHeap.queue(newSong);
         //   console.log(i);
          }
        }
        i += 1;
       // console.log("\n");
      });

      //console.log(maxHeap);
      setMaxHeapFinal(maxHeap);
      //console.log("Heap Finished")
  
    }
  },[heapData,rootSong])

  useEffect(() => {
   //console.log("Max Heap Final Update");
   //console.log(maxHeapFinal);

   
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
    //console.log(songs);
    setResults(songs);
    setTempResults(songs);
    //console.log("broddy")
  })
  
  },[maxHeapFinal]);
  
 useEffect(() => {
  if(tempResults.length >= 2) {
  if(results.length >= 2) {
    const newNodes = new DataSet([
      {id: 0, label: results[0].trackName, shape: "circularImage",image:results[0].image}
    ]);
    const newEdges = new DataSet([]);


    // Add the rest of the nodes to the heapData
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
    
    console.log(newNodes);
    const data = {
      nodes: newNodes,
      edges: newEdges,
    };

    const options = {
      layout: {
        hierarchical: {
          direction: "DU",
          sortMethod: "directed",
          levelSeparation: 100,
        },
      },
    };
    
    networkContainer.current = new Network(container.current, data,options);
    //networkContainer.current.fit();

    networkContainer.current.on("click", (event) => {
      if (event.nodes.length) {
        //handleNodeClick(event.nodes[0]);
        handleData(event.nodes[0]);
      }
    });
    

 }
}
  },[tempResults])


  const handleData = (nodeId) => {
    console.log('Clicked: ' + nodeId);
   // const clickedNodeInfo = await getTrackById(nodeId);
   // const clickedNodeAudioInfo = await getTrackAudioFeaturesById(nodeId);
    setCount(count + 1);
    console.log(results[nodeId]);
    console.log(results[nodeId].artist);
  
    //console.log('Expected: ' + clickedNodeInfo.mp3Link);
   // console.log('Actual' + currentSong);

   
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