
import {React,useEffect,useState} from 'react';
import Login from './Login'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Main from './Main'
import NavBar from './NavBar'
import Albums from './Albums'


function App() {
  /*
    Attributes here are responsible for showing playlists in album component
  */
  const [results,setResults] = useState([]);
  const [createAlbum,setCreateAlbum] = useState(0);
  const [albums,setAlbums] = useState([]);

  /*
    Anytime user presses create album,
    the data in results is appended to Album List,
    used to showcase playlists in album component
  */
  useEffect(() => {
    setAlbums(prevAlbums => [...prevAlbums, results]);
  },[createAlbum])

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
