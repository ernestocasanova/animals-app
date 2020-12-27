import React, { useEffect } from "react";
import { useFormState } from "../../hooks/validate-form";
import Modal from 'react-modal';
import shortid from 'shortid';
import Loader from "../common/loader";
 
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
 
//Modal.setAppElement('#root')

interface IProps {
  isOpenTriggered: boolean;
}

const AnimalForm: React.FC<IProps> = ({ isOpenTriggered }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [data, setData] = useFormState({
    url: undefined,
    name: "",
  });

  const afterOpenModal = () => {
    //subtitle.style.color = '#ff0';
  }
 
  const closeModal = () => {
    setIsOpen(false);
    window.location.reload();
  }
  
  useEffect(() => { setIsOpen(isOpenTriggered); }, [isOpenTriggered])

  const createRequest = (reader: FileReader) => {
    const payload = {
      "id": shortid.generate(),
      "name": data.name,
      "filename": data.url.name,
      "file": reader.result
    };
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    fetch('https://o0fh30qq4a.execute-api.us-east-2.amazonaws.com/animals-stage-create/animals', {
      method: 'POST',
      body: JSON.stringify(payload), 
      headers
    }).then(response => response.json())
      .then(response => {
      setStatus(false);
      closeModal();
    })
    .catch(error => {
      setStatus(false);
      console.log("Error-"+error);
    });
  }

  const getBase64 = (file: File) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      createRequest(reader);
    };
    reader.onerror = (error) => {
      setErr("Error converting file");
      return;
    };
 }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.url === undefined) {
      setErr("Invalid file: " + err);
      return;
    }
    if (data.name.length === 0) {
      setErr("Invalid name: " + err);
      return;
    }
    setStatus(true);
    getBase64(data.url);
  }

  return (
    <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal}
      style={customStyles} contentLabel="Create Dog">
      <h2>Create New</h2>
      <span onClick={closeModal} className="close-button topright">&times;</span>
      {status && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" onChange={setData}/>
          <label>Image</label>
          <input type="file" name="url" onChange={setData}/>
        </div>
        <div className="button-container">
          <button type="submit">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default AnimalForm;
