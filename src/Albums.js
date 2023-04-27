import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import PlayListIcon from "./PlayListIcon"
import PlayList from "./PlayList"

function Albums({albumData}) {
  return (
    <div style={{display: 'flex'}}>
      {albumData && albumData.slice(2).map((album, index) => (
        <PlayList key={index} data={album} />
      ))}
    </div>
  );
}

export default Albums;
