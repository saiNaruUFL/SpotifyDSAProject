import React, {useState} from 'react';

  function Form({onGenerate}) {
      const [songName,setSongName] = useState('');
      const [selectedMethod,setSelectedMethod] = useState('');
      const [kNumber, setKNumber] = useState('');

      async function handleSubmit(event) {
        event.preventDefault();

        if(songName && selectedMethod == "BFS") {
          onGenerate(songName,selectedMethod,-1);
        }
        else if(songName && selectedMethod == "heap" && kNumber > 0 ){
          onGenerate(songName,selectedMethod,kNumber);
        }
        else {
          alert("Please enter a song name and select a method");
        }
      }

      function handleInputChange(event) {
        setSongName(event.target.value);
      }
      
      function handleSelectChange(event) {
        setSelectedMethod(event.target.value);
      }
      function handleKNumberChange(event) {
        setKNumber(event.target.value);
      }
      return (
          
        <form onSubmit={handleSubmit}>
          <label htmlFor="songName" style={{color:'white'}}>Song Name:</label>
          <input type="text" id="songName" value={songName} onChange={handleInputChange} />
          <label htmlFor="method" style={{ color: 'white' }}>
            Method:
          </label>
        <select id="method" value={selectedMethod} onChange={handleSelectChange}>
          <option value="">--Select a method--</option>
          <option value="BFS">BFS Graph </option>
         <option value="heap">K-Closest Heap</option>
        </select>
        {selectedMethod === 'heap' &&
        <div>
          <label htmlFor="kNumber" style={{ color: 'white' }}>K-Number:</label>
          <input type="number" id="kNumber" value={kNumber} onChange={handleKNumberChange} />
        </div>
        }
          <button type="submit">Generate</button>
        </form>
      );
    
  }

  export default Form;