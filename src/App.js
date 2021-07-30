import AuthenticatedApp from './AuthenticatedApp';
import {HashRouter, Route, Switch} from "react-router-dom";
import JackboxGameList from './JackboxGameList';
import React, {Component} from 'react';
import {version} from '../package.json';

import './App.css';

const loginScreen = function() {
    const scopes = 'chat:read chat:edit moderation:read';
    const loginUrl = 'https://id.twitch.tv/oauth2/authorize'
        + `?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}`
        + `&response_type=code&scope=${scopes}`
        + `&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;

    return (
        <div id="login-screen">
            <a href={loginUrl}>
                Log In With <strong>Twitch</strong>
            </a>
            <br/>
            <small>
                {`v${version}`}
            </small>
        </div>
    );
}

class App extends Component {
    render() {

        return (
            <HashRouter basename='/'>
                <div className="App">
                    <header className="App-header">
                        <Switch>
                            <Route exact path="/login">
                                {loginScreen()}
                            </Route>
                            <Route exact path="/gamelist" component={JackboxGameList}/>
                            <Route path="/" component={AuthenticatedApp}/>
                        </Switch>
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
