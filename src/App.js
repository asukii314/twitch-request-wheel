// import logo from './logo.svg';
import './App.css';
import AuthenticatedApp from './AuthenticatedApp';
import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";

const loginScreen = function() {
  const loginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&response_type=code&scope=chat:read chat:edit&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`
  return (
    <a href={loginUrl} style={{backgroundColor: 'rebeccapurple', borderRadius: '5px', padding: '10px', color: 'white'}}>Log In With Twitch</a>
  );
}

class App extends Component {
  render() {

    return (
      <HashRouter basename='/'>
        <div className="App">
          <header className="App-header">
            <Route exact path="/">
              {loginScreen()}
            </Route>
            <Route path="/dashboard" component={AuthenticatedApp} />
          </header>
        </div>
      </HashRouter>
    );
  }
}

export default App;
