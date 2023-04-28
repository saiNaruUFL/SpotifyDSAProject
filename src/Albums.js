import React from "react";
import PlayList from "./PlayList"

/*
  Displays the PlayList Components
*/
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
