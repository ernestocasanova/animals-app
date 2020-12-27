import { Component } from 'react';
import Header from './containers/header';
import Content from './containers/content';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Content/>
      </div>
    );
  }
}

export default App;