import React, { Component } from 'react';
import AnimalList from '../components/animal/animal-list';

class Content extends Component {
  render() {
    return (
        <div className="container">
          <AnimalList />
        </div>
    );
  }
}

export default Content;