import React, { useEffect, useState, useRef } from 'react';
import { DataSet, Network } from 'vis';
import { getReccomendedSongs, getTrackAudioFeaturesById, getTrackById} from './Spotify';
import ReactAudioPlayer from 'react-audio-player';

function Graph({graphData,setGraphData,counter,setCounter,data,setData,BFSFind,setBFSFind,expand,setExpand,song,rootSong,connectedSongs,clicked,clickedSong,setClickedSong}) {
 
  const [nodes, setNodes] = useState(new DataSet([
    { id: 1, label: 'Example Node', image: 'https://via.placeholder.com/150', color: '#FFA500' },
  ]));
  const [edges, setEdges] = useState(new DataSet([]));
  const [count,setCount] = useState(0);
  const [audioUrl,setAudioUrl] = useState('');
  const container = useRef(null);
  const networkContainer = useRef(null);


/* Deals with BFS Find Search */
 useEffect(() => {
  if(BFSFind == true){
      setCounter(counter + 1);
      setData(clickedSong.nodeID);

      if(counter == 1){
        const fetchData = async () => {
          await findBFS(data,clickedSong.nodeID);
          // do something with the data
        };
        fetchData();
        setCounter(0);
        setData(null);
        setBFSFind(false);
      }
  }
  
 },[clickedSong])

 /*Anytime user clicks expand, the graph expands  */
  useEffect(() => {
    if(expand == true){
      const fetchData = async () => {
        await handleExpand(clickedSong.nodeID);
        // do something with the data
      };
      fetchData();

      setExpand(false);
    }
  },[expand]);


  /*Some type of BFS search */
  useEffect(() => {
    const fetchData = async () => {
      await bfs();
      // do something with the data
    };
    fetchData();
  }, [clicked]);


  /*Inital Connected Songs */
  useEffect(() => {
    
    if(connectedSongs.length > 0) {
      const newNodes = new DataSet([
        { id: rootSong.id, label: rootSong.name, image: rootSong.image, key: rootSong.id}
      ]);

    
      connectedSongs.forEach((item) => {
        newNodes.add({id: item.id, label: item.name, image: item.image, key: rootSong.id});
      })
      
      
      const newEdges = new DataSet(
        connectedSongs.map((node) => ({
          from: node.id,
          to: rootSong.id,
          key: (node.id + rootSong.id).split("").sort().join(""),
          id: (node.id + rootSong.id).split("").sort().join(""),
          width: 5
        }))
      );

  

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [connectedSongs]);

  useEffect(() => {

   

    const options = {
      physics: true,
      nodes: {
        shape: "circularImage",
        image: (node) => node.image,
        size: 50,
        borderWidth: 3,
        color: {
          background: "#ffffff",
          border: "#2B7CE9",
        },
        font: {
          color: "#ffffff"
        }
      },
      edges: {
        arrows: { to: false, from: false }
      },
      
    }
    const data = { nodes, edges };
    
    networkContainer.current = new Network(container.current, data, options);

    
    networkContainer.current.on("click", (event) => {
      if (event.nodes.length) {
        //handleNodeClick(event.nodes[0]);
        handleData(event.nodes[0]);
      }
    });
    
    
  
    if(count > 0) {
      stopAudio();
      playAudio(clickedSong.mpLink);
    }
  }, [nodes, edges]);


  const findBFS = async (rootId,targetId) => {
    console.log("Running Find BFS Algo");
    console.log(rootId);
    console.log(targetId);
    console.log("end");

    if(networkContainer.current !== null) {
     console.log("yolo");
      let visNodes = new Set();
      let queue = [];
      const hashMap = {};

      queue.push(nodes.get(rootId));
      let qLen = queue.length;
      

      while(qLen != 0){
        console.log("bruhhhhhhh");
         const topVal = queue.shift();
         topVal.color = {border: 'red'};
         nodes.update(topVal);
         visNodes.add(topVal.id);
         const neighborsId = networkContainer.current.getConnectedNodes(topVal.id);
       
        neighborsId.map((neighborId) => {
          if(visNodes.has(neighborId) == false)
          {
            hashMap[neighborId] = topVal.id;
            queue.push(nodes.get(neighborId));
            if(neighborId == targetId)
              queue = [];
          }
        })
        
      
         qLen = queue.length;

         await delay(250);
      }
      
      let currentNodeId = targetId; 
      
      
      while(true){
        const tempNode = nodes.get(currentNodeId);
        tempNode.color = {border:"green"};
        nodes.update(tempNode);

        if(tempNode == rootId)
          break;

        currentNodeId = hashMap[currentNodeId];

        await delay(250);
      }
      
    }
  }

  const handleExpand = async (nodeId) => {
    const recommendedSongs = await getReccomendedSongs(nodeId);
    setGraphData([...graphData,...recommendedSongs])
    const newNodes  = new DataSet();
    const newEdges = new DataSet();

    recommendedSongs.forEach((node) => {
        if(nodes.get(node.id) === null){
          newNodes.add({
            id: node.id,
            label: node.name,
            image: node.image,
            key: node.id
          });
        }

       if(edges.get((node.id + nodeId).split("").sort().join("")) === null) {
        newEdges.add({
          from: node.id,
          to: nodeId,
          key: (node.id + nodeId).split("").sort().join(""),
          id: (node.id + nodeId).split("").sort().join(""),
          width: 5
        });
      }
    });

    nodes.forEach((item) => {
      newNodes.add({id: item.id, label: item.name, image: item.image,key: item.id});
    })

    edges.forEach((item) => {
      newEdges.add(item);
    })

    setNodes(newNodes);
    setEdges(newEdges);

    networkContainer.current.fit();
  }
  const handleData = async (nodeId) => {
    //.log('Clicked: ' + nodeId);
    const clickedNodeInfo = await getTrackById(nodeId);
    const clickedNodeAudioInfo = await getTrackAudioFeaturesById(nodeId);
    setCount(count + 1);
    //console.log('Expected: ' + clickedNodeInfo.mp3Link);
   // console.log('Actual' + currentSong);

    setClickedSong({
      artistName: clickedNodeInfo.artist,
      albumName: clickedNodeInfo.albumName,
      songName: clickedNodeInfo.name,
      songLen: clickedNodeInfo.duration,
      acousticness: clickedNodeAudioInfo.acousticness,
      danceability: clickedNodeAudioInfo.danceability,
      energy: clickedNodeAudioInfo.energy,
      mpLink:clickedNodeInfo.mp3Link,
      nodeID: nodeId
    });
    
  }

  const handleNodeClick = async (nodeId) => {

    try {
    
      //const data = await fetchSongData(nodeId, signal);
      // handle data
      console.log('Clicked: ' + nodeId);
      const clickedNodeInfo = await getTrackById(nodeId);
      const clickedNodeAudioInfo = await getTrackAudioFeaturesById(nodeId);
      const clickedNode = nodes.get(nodeId);

      const audio = new Audio(clickedNodeInfo.mp3Link);
      audio.play();

      setClickedSong({
        artistName: clickedNodeInfo.artist,
        albumName: clickedNodeInfo.albumName,
        songName: clickedNodeInfo.name,
        songLen: clickedNodeInfo.duration,
        acousticness: clickedNodeAudioInfo.acousticness,
        danceability: clickedNodeAudioInfo.danceability,
        energy: clickedNodeAudioInfo.energy
      });
      
      //console.log("Nodes Audio Features: ")
      //console.log(clickedSong);
      const recommendedSongs = await getReccomendedSongs(nodeId);
    
      const newNodes = new DataSet(
        recommendedSongs.map((node) => ({
          id: node.id,
          label: node.name,
          image: node.image,
          key: node.id
        }))
      );

      const newEdges = new DataSet(
          recommendedSongs.map((node) => ({
          from: node.id,
          to: nodeId,
          key: node.id + nodeId
        }))
      );
        
      nodes.forEach((item) => {
        newNodes.add({id: item.id, label: item.name, image: item.image,key: item.id});
      })

      edges.forEach((item) => {
        newEdges.add(item);
      })

      setNodes(newNodes);
      setEdges(newEdges);

      networkContainer.current.fit();
      ///
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.log('Error fetching song data', err);
      }
    } finally {
     
    }

    // Update the AbortController instance for the next onClick event
   

  
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function bfs(){
    
      if(clicked > 0 && networkContainer.current !== null) {
      console.log("Inside of actual BFS");
      let visNodes = new Set();
      let queue = [];

      queue.push(nodes.get(rootSong.id));
      console.log("Queue");
      console.log(queue);
      let qLen = queue.length;
      console.log("Oringinal Len: " + qLen);

      while(qLen !== 0){
         console.log("Q-Len: " + qLen);
         const topVal = queue.shift();
         console.log(topVal);
         topVal.color = {border: 'red'};
         nodes.update(topVal);
         visNodes.add(topVal.id);
         const neighborsId = networkContainer.current.getConnectedNodes(topVal.id);
        console.log("Neighbors: ");
        console.log(neighborsId);
         
        neighborsId.map((neighborId) => {
          if(visNodes.has(neighborId) == false)
          {
            queue.push(nodes.get(neighborId));
          }
        })
        
        console.log("Q-");
        console.log(queue);
         console.log("Q Len after: ");
         console.log(queue.length);
         qLen = queue.length;
         console.log("Q-Len Af: " + qLen);

         await delay(250);
      }
      
    }
  }


  function playAudio(url) {
    setAudioUrl(url);
  }

  function stopAudio() {
    setAudioUrl('');
  }
  return (
    <>
      <div ref={container} className="networkContainer" style={{ width: '1200px', height: '800px', border: '1px solid black', backgroundColor: '#212121',borderRadius: '10px'}} />
      <div style={{ display: 'none' }}>
        <ReactAudioPlayer
          src={audioUrl}
          autoPlay
          controls={false}
        />
       </div>
    </>
  );
}

export default Graph;