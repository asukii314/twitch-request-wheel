import React, {Component} from 'react';
import {version} from '../package.json';

import './LoginScreen.css';

const scopes = 'chat:read chat:edit moderation:read whispers:edit';
const loginUrl = 'https://id.twitch.tv/oauth2/authorize'
    + `?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}`
    + `&response_type=code&scope=${scopes}`
    + `&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;

class LoginScreen extends Component {

    render() {
        return (
            <div id="login-screen" className="fade-in">
                <a href={loginUrl} className="btn btn-sm fs-2">
                    Log In With <strong>Twitch</strong>
                </a>
                <br/>
                <small>
                    {`v${version}`}
                </small>
            </div>
        );
    }
}

export default LoginScreen;
