
import {React,useEffect,useState} from 'react';
import Login from './Login'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './Main'
import NavBar from './NavBar'
import Albums from './Albums'


function App() {
  const [results,setResults] = useState([]);
  const [createAlbum,setCreateAlbum] = useState(0);
  const [albums,setAlbums] = useState([]);

  useEffect(() => {
    console.log("yo-begin");
    console.log(results);
    setAlbums(prevAlbums => [...prevAlbums, results]);
    console.log("yo-end")
  },[createAlbum])

 useEffect(() => {
    console.log("Album Updated");
    console.log(albums);
 },[albums])
 
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main setCreateAlbum={setCreateAlbum} createAlbum={createAlbum} results={results} setResults={setResults}/>} />
        <Route path="/albums" element={<Albums albumData={albums}/>} />
      </Routes>
    </Router>
  )
    
}

export default App;
