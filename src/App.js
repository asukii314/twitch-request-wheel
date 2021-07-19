// import logo from './logo.svg';
import './App.css';
import AuthenticatedApp from './AuthenticatedApp';
import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import JackboxGameList from './JackboxGameList';

const loginScreen = function() {
  const scopes = "chat:read chat:edit moderation:read"
  const loginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&response_type=code&scope=${scopes}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`
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
            <Route exact path="/login">
              {loginScreen()}
            </Route>
            <Route path="/" component={AuthenticatedApp} />
            <Route path="/gamelist" component={JackboxGameList} />
          </header>
        </div>
      </HashRouter>
    );
  }
}

export default App;

export {
    loginScreen as LoginScreen
};
