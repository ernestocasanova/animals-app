import { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="container">
          <h1>Dogs Search</h1>
          <p className="slogan">
            Find your favorit dog.
          </p>
        </div>
      </header>
    );
  }
}

export default Header;