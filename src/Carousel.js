import React, { useState } from "react";
import "./Carousel.css";


export const Carousel = ({data}) => {

  const [activeImage, setActiveImage] = useState(0);

  const handleClick = (increment) => {
    const newIndex = (activeImage + increment) % data.length;
    setActiveImage(newIndex);
  };

  return (
    <div className="carousel-container">
      <div className="inner-container-1">
        <button className="carousel-button" onClick={() => handleClick(-1)}>
          &#10094;
        </button>
        <img className="carousel-image" src={data[activeImage].image} alt="carousel" />
        <button className="carousel-button" onClick={() => handleClick(1)}>
          &#10095;
        </button>
      </div>
      <div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Artist Name: {data[activeImage].artist}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Album Name: {data[activeImage].albumName}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Song Name: {data[activeImage].name}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Song Length: {data[activeImage].duration}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Acousticness: {data[activeImage].acousticness}</div>
      <div style={{color: 'whitesmoke',fontSize: '28px'}}>Danceability: {data[activeImage].danceability}</div>
     <div style={{color: 'whitesmoke',fontSize: '28px'}}>Energy: {data[activeImage].energy}</div>
     <div style={{color: 'whitesmoke',fontSize: '10px'}}>MP3 Link: {data[activeImage].mp3Link}</div>
      </div>
    </div>
  );
}

export default Carousel;