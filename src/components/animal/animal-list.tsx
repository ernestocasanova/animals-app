import 'react-confirm-alert/src/react-confirm-alert.css';
import { Animal, Animals } from '../../types/animal';
import { confirmAlert } from 'react-confirm-alert';
import React, { useEffect } from 'react';
import Loader from '../common/loader';
import AnimalForm from './animal-form';
import { AnimalItem } from './animal-item';

const AnimalList: React.FC<{}> = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => setIsOpen(true);
  const [service, setState] = React.useState<Animals>({ state: false, results: [], initial: [] });

  useEffect(() => {
    fetch('https://74g2l2893m.execute-api.us-east-2.amazonaws.com/animals-stage/animals')
    .then(response => response.json())
    .then(response => setState({ state: true, results: response, initial: response })
    ).catch(error => setState({ state: true, error: true, results: [], initial: [] }));
  }, []);

  const onSubmit = (id: string) => {
    confirmAlert({
      title: 'Warning!',
      message: 'Are you sure to delete this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteElement(id)
        },
        {
          label: 'No',
          onClick: () => null
        }
      ]
    });
  };

  const deleteElement = async (id: string) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    await fetch('https://dcwrn61gd6.execute-api.us-east-2.amazonaws.com/animals-stage-delete/animals/' , {
      method: 'DELETE',
      body: JSON.stringify({ id: id }), 
      headers
    }).then(response => response.json()).then(response => {
      removeElementFromList(id);
    })
    .catch(error => {
      console.log("Error-"+error);
    });
  }

  const removeElementFromList = (id: string) => {
    setState({ state: false, results: service.initial, initial: service.initial })
    const newList = service.initial.filter((item) => item.Id !== id);
    setState({ state: true, results: newList, initial: newList })
  }

  const handleOnChange  = (event: { target: { value: string; }; }) => {
    setState({ state: true, results: handleSearchValue(event.target.value), initial: service.initial });
  }

  function handleSearchValue(toSearch: string): Animal[] {
    const updatedList = service.initial;
    return updatedList && updatedList.length > 0 ? updatedList.filter(value => value.Name.toLocaleLowerCase().includes(toSearch.toLocaleLowerCase())) : [];
  }

  return (
    <>
      <AnimalForm isOpenTriggered={modalIsOpen} />
      <div className="card">
        <div className="search-div">
          <input className="search-input" type="text" name="name" placeholder="Search..." onChange={handleOnChange}/>
          <button className="animal-search" title="Add new dog." onClick={openModal}>+</button>
        </div>
        {!service.state && !service.error && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
        {service.state && service.results && service.results.length > 0 &&
          service.results.map(item => (
            <AnimalItem
              key={item.Id}
              pic={item.Url}
              name={item.Name}
              removeAnimal={() => {
                onSubmit(item.Id);
              }}
            ></AnimalItem>
          ))}
        {service.state && service.error && (
          <div>Error, with the request.</div>
        )}
      </div>
    </>
  );
};

export default AnimalList