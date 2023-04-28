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
  /*
    The very first click simply increments the counter
    and stores the clicked node, the second clicks calls 
    the bfs search function
  */
  if(BFSFind === true){
      setCounter(counter + 1);
      setData(clickedSong.nodeID);

      if(counter === 1){
        const fetchData = async () => {
          await findBFS(data,clickedSong.nodeID);
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
      };
      fetchData();

      setExpand(false);
    }
  },[expand]);


  /*Some type of BFS search */
  useEffect(() => {
    const fetchData = async () => {
      await bfs();
    };
    fetchData();
  }, [clicked]);


  /*Adds the inital Connected Songs to the graph to visualize,
    visualizes the starting graph
  */
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


  /*
    Anytime the edges or nodes update, the graph is hast
    to be revisualized
  */
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

    //handles "onClick" on nodes
    networkContainer.current.on("click", (event) => {
      if (event.nodes.length) {
        handleData(event.nodes[0]);
      }
    });
    
    
  
    if(count > 0) {
      stopAudio();
      playAudio(clickedSong.mpLink);
    }
  }, [nodes, edges]);


  /* Simulates BFS Search to find shortest path
  between start and target node */
  const findBFS = async (rootId,targetId) => {
 
    if(networkContainer.current !== null) {
      let visNodes = new Set();
      let queue = [];
      const hashMap = {};

      queue.push(nodes.get(rootId));
      let qLen = queue.length;
      

      while(qLen != 0){
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
      
      /*
      Backtracks to find the shortes path, based on the parent
      list
      */
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

  /*
   Handles logic to expand graph, first calls a function
   to get reccomended songs, and then adds those sogns to overall graph
  */
  const handleExpand = async (nodeId) => {
    //get reccomdned songs based on clicked node
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

  /*
    Once a node is clicked, "clickedNode" data is 
    updated
  */
  const handleData = async (nodeId) => {
    
    const clickedNodeInfo = await getTrackById(nodeId);
    const clickedNodeAudioInfo = await getTrackAudioFeaturesById(nodeId);
    setCount(count + 1);
   
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

  /*
    Delay function for shortest path visualization
  */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /*
    Regular BFS graph, not implmented yet in actual app
  */
  async function bfs(){
    
    if(clicked > 0 && networkContainer.current !== null) {
      let visNodes = new Set();
      let queue = [];

      queue.push(nodes.get(rootSong.id));
      let qLen = queue.length;
      
      while(qLen !== 0){
         const topVal = queue.shift();
         topVal.color = {border: 'red'};
         nodes.update(topVal);
         visNodes.add(topVal.id);
         const neighborsId = networkContainer.current.getConnectedNodes(topVal.id);
         
        neighborsId.map((neighborId) => {
          if(visNodes.has(neighborId) == false)
          {
            queue.push(nodes.get(neighborId));
          }
        })
      
         qLen = queue.length;
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