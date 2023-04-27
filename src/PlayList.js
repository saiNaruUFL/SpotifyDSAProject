import {React,useEffect,useState} from 'react'
import Modal from "react-modal";
import Carousel from "./Carousel";

function PlayList({data}){
  const [modalIsOpen,setModalIsOpen] = useState(false);


  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    console.log("hello?");
    console.log(data);
  },[data])

  const style = {
    height: "200px",
    width: "200px",
    backgroundColor: "red",
    marginRight: "50px",
    borderRadius: "15px",
    position: "relative"
  };

  const imgStyle = {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "15px"  
  }

  const customStyles = {
    content : {
      width: '40%',
      height: '80%',
      margin: 'auto',
      overflow: 'hidden',
      borderRadius: "20px",
      backgroundColor: "gray"
    }
  };

  return (
    <>
      <div style ={style} onClick={handleOpenModal}>
        <img style = {imgStyle} src={data[0].image} alt="image of album cover"/>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} style={customStyles}>
          <Carousel data={data} />
          <button onClick={handleCloseModal}>Close</button>
      </Modal>
    </>
  )
}
export default PlayList;