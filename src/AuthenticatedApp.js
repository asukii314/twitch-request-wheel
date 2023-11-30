import React, {Component} from 'react';
import MainScreen from './landing/MainScreen';
import LoadSpinner from './components/LoadSpinner';
import {Redirect, withRouter} from "react-router-dom";
import queryString from 'query-string'
const fetch = require('node-fetch');

class AuthenticatedApp extends Component {
    constructor() {
        super();
        this.state = {
            username: localStorage.getItem('__username'),
            user_id: localStorage.getItem('__user_id'),
            access_token: localStorage.getItem('__access_token'),
            expires_in: localStorage.getItem('__expires_in') || 0,
            expiry_time: localStorage.getItem('__expiry_time') || 0,
            refresh_token: localStorage.getItem('__refresh_token'),
            failed_login: false
        }
        this.getAuth = this.getAuth.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.logOut = this.logOut.bind(this);
        this.onAuthenticated = this.onAuthenticated.bind(this);
        this.promisedSetState = this.promisedSetState.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.validateToken = this.validateToken.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (!this.state.access_token) {
            return this.getAuth();
        }
        return this.getUsers(this.state.access_token).catch(e => {
            console.error(e);
            return this.getAuth(e);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getAuth(e) {
        if (e) {
            console.error(e);
        }
        localStorage.removeItem('__username');
        localStorage.removeItem('__user_id');
        localStorage.removeItem('__access_token');
        localStorage.removeItem('__expires_in');
        localStorage.removeItem('__expiry_time');
        localStorage.removeItem('__refresh_token');

        const queryParams = queryString.parse(this.props.location.search);
        const requestParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: queryParams.code,
            client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
            client_secret: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI_NOENCODE
        });
        return await fetch(`https://id.twitch.tv/oauth2/token?${requestParams}`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.twitchtv.v5+json'
            }
        })
        .then(r => r.json())
        .then((oauth) => {
            //console.log(oauth);  access_token, refresh_token, expires_in, scope ['...']
            if (this._isMounted) {
                if (!oauth.access_token) {
                    return this.setState({
                        failed_login: true
                    });
                }
                return this.onAuthenticated(oauth);
            }
            return;
        })
        .catch(e => {
            console.error(e);
            if (this._isMounted) {
                return this.setState({
                    failed_login: true
                });
            }
            return;
        });
    }

    getUsers(access_token) {
        return fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
                Authorization: `Bearer ${this.state.access_token}`
            }
        })
        .then(r => r.json())
        .then(userInfo => {
            //console.log(userInfo); login [aka lowercase username?], display_name, profile_image_url, description
            localStorage.setItem('__username', userInfo.data[0].login);
            localStorage.setItem('__user_id', userInfo.data[0].id);
            return fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userInfo.data[0].id}`, {
                headers: {
                    'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${access_token}`
                }
            })
            .then(r => r.json())
            .then(async modInfo => {
                const modList = (!modInfo.data)
                    ? null
                    : modInfo.data.map((modObj) => (!modObj.user_name) ? null : modObj.user_name.toLowerCase()).filter(user => user);
                if (this._isMounted) {
                    return this.promisedSetState({
                        username: userInfo.data[0].login,
                        user_id: userInfo.data[0].id,
                        modList
                    });
                }
                return;
            });
        });
    }

    logOut() {
        localStorage.removeItem('__username');
        localStorage.removeItem('__user_id');
        localStorage.removeItem('__access_token');
        localStorage.removeItem('__expires_in');
        localStorage.removeItem('__expiry_time');
        localStorage.removeItem('__refresh_token');

        const requestParams = new URLSearchParams({
            client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
            token: this.state.access_token,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI_NOENCODE
        });

        return fetch(`https://id.twitch.tv/oauth2/revoke?${requestParams}`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.twitchtv.v5+json'
            }
        }).then(() => {
            return window.location.reload();
        });
    }

    /**
     * Handles the API response after authenticating
     *
     * @param {object} oauth The api response object (access_token, refresh_token, expires_in, scope)
     * @returns Promise (via getUsers)
     */
    onAuthenticated(oauth) {
        let expiry_time = Date.now() + oauth.expires_in;
        localStorage.setItem('__access_token', oauth.access_token);
        localStorage.setItem('__expires_in', oauth.expires_in);
        localStorage.setItem('__expiry_time', expiry_time);
        localStorage.setItem('__refresh_token', oauth.refresh_token);

        this.setState({
            access_token: oauth.access_token,
            expires_in: oauth.expires_in,
            expiry_time,
            refresh_token: oauth.refresh_token
        });

        return this.getUsers(oauth.access_token);
    }

    promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

    async refreshToken() {
        console.log('refreshToken');
        let token = this.state.refresh_token;
        const requestParams = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
            client_secret: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
            refresh_token: token
        });
        return await fetch(`https://id.twitch.tv/oauth2/token?${requestParams}`, {
            method: 'POST',
            headers: {
                Authorization: `OAuth ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(r => r.json())
        .then(this.onAuthenticated)
        .catch(e => {
            console.error(e);
            return this.logOut();
        });
    }

    async validateToken(token) {
        if (!token) token = this.state.access_token;
        return await fetch(`https://id.twitch.tv/oauth2/validate`, {
            method: 'GET',
            headers: {
                Authorization: `OAuth ${token}`
            }
        })
        .then(r => r.json())
        .then(validateResp => {
            if (validateResp.status === 401) {
                console.log('calling this.refreshToken();...');
                return this.refreshToken();
            }
            return Promise.resolve();
        })
        .catch(e => {
            console.error(e);
            if (e.status === 401) {
                console.log('calling this.refreshToken();...');
                return this.refreshToken();
            }
            return;
        });
    }

    render() {
        if (this.state.failed_login) {
            return (<Redirect to="/login"/>);
        }
        let mainContent = (
            <h2>
                <LoadSpinner />
                <br />
                Loading...
            </h2>
        );
        let classNames = ['authenticated-app'];
        if (this.state.username && this.state.modList) {
            mainContent = (
                <MainScreen
                    channel={this.state.username}
                    id={this.state.user_id}
                    modList={this.state.modList}
                    access_token={this.state.access_token}
                    onLogout={this.logOut}
                    validateToken={this.validateToken}
                />
            );
        }

        return (
            <div id={classNames.join(' ')}>
                {mainContent}
            </div>
        );
    }
}

export {AuthenticatedApp};

export default withRouter(AuthenticatedApp);
