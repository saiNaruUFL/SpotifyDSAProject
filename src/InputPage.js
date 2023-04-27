import React from 'react'
import Form from './Form'
export const InputPage = ({onGenerate,handleClickBFSFind,handleCreateAlbum}) => {

  return (
    <div style={{height: '800px',flex: '1',backgroundColor:'#10663a',borderRadius: '10px'}}>
      <h1 style={{marginLeft: '50px', color: 'white'}}>Input Song</h1>
      <Form onGenerate={onGenerate}/>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Traversals</div>
      <button onClick={handleClickBFSFind}>BFS Find</button>
      <button>DFS Find</button>
      <button>Extract Max</button>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Album Creation</div>
      <button onClick={handleCreateAlbum}>Create Album</button>
    </div>
  )
}
