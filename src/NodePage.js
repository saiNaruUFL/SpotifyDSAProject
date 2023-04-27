import React from 'react'

export const NodePage = ({clickedSong,handleExpand,handlePlayMusic}) => {
  //console.log("Inside of Node page");
  //console.log(clickedSong);
  return (
    <div style={{height: '800px',flex: '1',backgroundColor:'#10663a',borderRadius: '10px'}}>
      <h1 style={{marginLeft: '100px', color: 'white'}}>Song Info</h1>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Artist Name: {clickedSong == undefined ? 'Empty' : clickedSong.artistName}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Album Name: {clickedSong == undefined ? 'Empty' : clickedSong.albumName}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Song Name: {clickedSong == undefined ? 'Empty' : clickedSong.songName}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Song Length: {clickedSong == undefined ? 'Empty' : clickedSong.songLen}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Spotify Link: {clickedSong == undefined ? 'Empty' : clickedSong.songLen}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Acousticness: {clickedSong == undefined ? 'Empty' : clickedSong.acousticness}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Danceability: {clickedSong == undefined ? 'Empty' : clickedSong.danceability}</div>
     <div style={{color: 'whitesmoke',fontSize: '28px'}}>Energy: {clickedSong == undefined ? 'Empty' : clickedSong.energy}</div>
     <div style={{color: 'whitesmoke',fontSize: '10px'}}>MP3 Link: {clickedSong == undefined ? 'Empty' : clickedSong.mpLink}</div>
     <button onClick={handleExpand}style={{color: 'blue',fontSize: '28px'}}>Expand</button>
     <button onClick={handlePlayMusic}style={{color: 'blue',fontSize: '28px'}}>Play Music</button>
      <div></div>
    </div>    
  )
}
