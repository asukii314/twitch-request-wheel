// import logo from './logo.svg';
import './App.css';
import AuthenticatedApp from './AuthenticatedApp';
import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";

class App extends Component {
  render() {

    return (
      <HashRouter basename='/'>
        <div className="App">
          <header className="App-header">
            <Route exact path="/">
              <AuthenticatedApp />
            </Route>
          </header>
        </div>
      </HashRouter>
    );
  }
}

export default App;
