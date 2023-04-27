import React, { useState } from "react";
import Modal from "react-modal"

function PlaylistIcon({ songs }) {
  const [showModal, setShowModal] = useState(false);

  function handlePlaylistClick() {
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
  }

  function handleExportClick() {
    // logic to export playlist to user's Spotify account
  }

  const style = {
    backgroundColor: "red",
    width: "100px",
    height: "100px",
    marginRight: "10px",
    backgroundImage: `url(${songs[0].image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "5px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
  };

  return (
    <>
      <div style={style} onClick={handlePlaylistClick}></div>
      {showModal && (
        <Modal handleClose={handleModalClose}>
          <h2>Playlist</h2>
          <ul>
            {songs.map((song) => (
              <li key={song.id}>{song.name}</li>
            ))}
          </ul>
          <button onClick={handleExportClick}>Export to Spotify</button>
        </Modal>
      )}
    </>
  );
}

export default PlaylistIcon;
