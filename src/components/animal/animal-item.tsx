import React, { useEffect } from "react";
import Modal from 'react-modal';
import "./animal.css";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
// Modal.setAppElement('#root')

interface IProps {
  pic: string;
  name: String;
  removeAnimal: () => void;
}

export const AnimalItem: React.FC<IProps> = ({ pic, name, removeAnimal }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const afterOpenModal = () => {
    //subtitle.style.color = '#f00';
  }
 
  const closeModal = () => {
    setIsOpen(false);
  }

  const viewAnimal = () => {
    setIsOpen(true);
  }
  
  useEffect(() => { setIsOpen(modalIsOpen); }, [modalIsOpen])

  return (
    <>
      <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal}
        style={customStyles} contentLabel="Detail Dog">
        <h2>Details Dog</h2>
        <span onClick={closeModal} className="close-button topright">&times;</span>
        <div>
          <label>Name</label>
          <label>{name}</label>
          <img className="item" src={pic} alt=""/>
        </div>
      </Modal>
      <div className="animal-div">
        <a href="#!" onClick={viewAnimal}><img className="animal-pic" src={pic} alt="{name}" /></a>
        <div className="animal-name">{name}</div>
        <button className="animal-remove" title="Delete dog." onClick={removeAnimal}>X</button>
      </div>
    </>
  );
};
