import AuthenticatedApp from './AuthenticatedApp';
import {HashRouter, Route, Switch} from "react-router-dom";
import CommandsList from './CommandsList';
import JackboxGameList from './JackboxGameList';
import LoginScreen from './LoginScreen';
import OptionsList from './OptionsList';
import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            theme: localStorage.getItem('__theme'),
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.onHashChange);
        this.onHashChange();
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.onHashChange);
    }

    onHashChange = () => {
        // check for theme changes
        let themeMatch = window.location.hash.match(/theme=(.+?)\b/);
        if (themeMatch !== null && themeMatch[1] !== this.state.theme) {
            this.setState({
                theme: themeMatch[1]
            });
        }
    }

    render() {

        let classNames = ['App'];
        if (window.location.hash.indexOf('legacy=true') !== -1) {
            classNames.push('legacy');
        }

        if (this.state.theme) {
            classNames.push(`theme theme-${this.state.theme}`);
        }

        return (
            <HashRouter basename='/'>
                <div className={classNames.join(' ')}>
                    <Switch>
                        <Route exact path="/login" component={LoginScreen} />
                        <Route exact path="/commands" component={CommandsList}/>
                        <Route exact path="/gamelist" component={JackboxGameList}/>
                        <Route exact path="/options" component={OptionsList}/>
                        <Route path="/" component={AuthenticatedApp}/>
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

export default App;

export {LoginScreen};
