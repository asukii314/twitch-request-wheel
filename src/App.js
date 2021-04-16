// import logo from './logo.svg';
import './App.css';
import AuthenticatedApp from './AuthenticatedApp';
import React, { Component } from 'react';

class App extends Component {
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <AuthenticatedApp />
        </header>
      </div>
    );
  }
}

export default App;
