import AuthenticatedApp from './AuthenticatedApp';
import {HashRouter, Route, Switch} from "react-router-dom";
import JackboxGameList from './JackboxGameList';
import OptionsList from './OptionsList';
import LoginScreen from './LoginScreen';
import React, {Component} from 'react';

import './App.css';

class App extends Component {
    render() {

        return (
            <HashRouter basename='/'>
                <div className="App">
                    <header className="App-header">
                        <Switch>
                            <Route exact path="/login" component={LoginScreen} />
                            <Route exact path="/gamelist" component={JackboxGameList}/>
                            <Route exact path="/options" component={OptionsList}/>
                            <Route path="/" component={AuthenticatedApp}/>
                        </Switch>
                    </header>
                </div>
            </HashRouter>
        );
    }
}

export default App;

export {LoginScreen};
