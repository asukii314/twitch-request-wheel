import React, {Component} from 'react';
import MainScreen from './MainScreen';
import {Redirect, withRouter} from "react-router-dom";
import queryString from 'query-string'
const fetch = require('node-fetch');

class AuthenticatedApp extends Component {
    constructor() {
        super();
        this.state = {
            username: localStorage.getItem('__username'),
            access_token: localStorage.getItem('__access_token'),
            failed_login: false
        }
        this.getAuth = this.getAuth.bind(this);
        this.logOut = this.logOut.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;
        if (!this.state.access_token) {
            return this.getAuth();
        }
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
            return fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userInfo.data[0].id}`, {
                headers: {
                    'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${this.state.access_token}`
                }
            })
            .then(r => r.json())
            .then(modInfo => {
                const modList = (!modInfo.data)
                    ? null
                    : modInfo.data.map((modObj) => modObj.user_name.toLowerCase());

                if (this._isMounted) {
                    this.setState((state) => {
                        return {
                            ...state,
                            username: userInfo.data[0].login,
                            modList
                        };
                    });
                }
            });
        })
        .catch(e => this.getAuth);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    logOut() {
        localStorage.removeItem('__username');
        localStorage.removeItem('__access_token');

        const requestParams = new URLSearchParams({
            client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
            token: this.state.access_token,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI_NOENCODE
        });

        fetch(`https://id.twitch.tv/oauth2/revoke?${requestParams}`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.twitchtv.v5+json'
            }
        }).then(() => {
            window.location.reload();
        });
    }

    async getAuth(e) {
        if (e) {
            console.error(e);
        }
        localStorage.removeItem('__username');
        localStorage.removeItem('__access_token');

        const queryParams = queryString.parse(this.props.location.search);
        const requestParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: queryParams.code,
            client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
            client_secret: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI_NOENCODE
        });
        await fetch(`https://id.twitch.tv/oauth2/token?${requestParams}`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.twitchtv.v5+json'
            }
        })
        .then(r => r.json())
        .then((oauth) => {
            //console.log(oauth);  access_token, refresh_token, expires_in, scope ['...']
            if (!oauth.access_token) {
                if (this._isMounted) {
                    this.setState((state) => {
                        return {
                            ...state,
                            failed_login: true
                        };
                    });
                }
                return;
            }

            localStorage.setItem('__access_token', oauth.access_token);
            if (this._isMounted) {
                this.setState((state) => {
                    return {
                        ...state,
                        access_token: oauth.access_token
                    };
                });
            }

            return fetch('https://api.twitch.tv/helix/users', {
                headers: {
                    'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${oauth.access_token}`
                }
            })
            .then(r => r.json())
            .then(userInfo => {
                //console.log(userInfo); login [aka lowercase username?], display_name, profile_image_url, description
                localStorage.setItem('__username', userInfo.data[0].login);
                return fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userInfo.data[0].id}`, {
                    headers: {
                        'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
                        Authorization: `Bearer ${this.state.access_token}`
                    }
                })
                .then(r => r.json())
                .then(modInfo => {
                    const modList = (!modInfo.data)
                        ? null
                        : modInfo.data.map((modObj) => modObj.user_name.toLowerCase());
                    if (this._isMounted) {
                        this.setState((state) => {
                            return {
                                ...state,
                                username: userInfo.data[0].login,
                                modList
                            };
                        });
                    }
                    return;
                });
            });
        });
    }

    render() {
        if (this.state.failed_login) {
            return (<Redirect to="/login"/>);
        }
        let mainContent;
        if (this.state.username) {
            mainContent = (
                <MainScreen
                    channel={this.state.username}
                    modList={this.state.modList}
                    access_token={this.state.access_token}
                    onLogout={this.logOut}
                />
            );
        }

        return (
            <div id="authenticated-app">
                {mainContent}
            </div>
        );
    }
}

export {AuthenticatedApp};

export default withRouter(AuthenticatedApp);
