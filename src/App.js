import AuthenticatedApp from './AuthenticatedApp';
import {HashRouter, Route, Switch} from "react-router-dom";
import JackboxGameList from './JackboxGameList';
import LoginScreen from './LoginScreen';
import React, {Component} from 'react';

import './App.css';

class App extends Component {
    render() {

        let classNames = ['App'];
        if (window.location.hash.indexOf('legacy=true') !== -1) {
            classNames.push('legacy');
        }

        return (
            <HashRouter basename='/'>
                <div className={classNames.join(' ')}>
                    <Switch>
                        <Route exact path="/login" component={LoginScreen} />
                        <Route exact path="/gamelist" component={JackboxGameList}/>
                        <Route path="/" component={AuthenticatedApp}/>
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

export default App;

export {LoginScreen};
