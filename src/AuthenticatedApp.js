
import React, { Component } from 'react';
import MainScreen from './MainScreen';
import JackboxGameList from './JackboxGameList';
import { Redirect, withRouter } from "react-router-dom";
import queryString from 'query-string'
const fetch = require('node-fetch');

class AuthenticatedApp extends Component {
  constructor(){
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
      if (!this.state.access_token) {
          return this.getAuth();
      }
      fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
          Authorization: `Bearer ${this.state.access_token}`
        }
      })
      .then(r => r.json())
      .then(userInfo => {
        //console.log(userInfo); //login [aka lowercase username?], display_name, profile_image_url, description

        localStorage.setItem('__username', userInfo.data[0].login);
        return fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userInfo.data[0].id}`, {
          headers: {
            'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
            Authorization: `Bearer ${this.state.access_token}`
          }
        })
        .then(r => r.json())
        .then(modInfo => {
          const modList = modInfo.data.map((modObj) => modObj.user_name.toLowerCase())
          this.setState((state) => {
            return {
              ...state,
              username: userInfo.data[0].login,
              modList
            };
          })
        })
      })
      .catch(e => this.getAuth)
  }

  logOut() {
      localStorage.removeItem('__username');
      localStorage.removeItem('__access_token');
      fetch('https://id.twitch.tv/oauth2/revoke?' + new URLSearchParams({
        client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
        token: this.state.access_token,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI_NOENCODE
      }), {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json'
        }
      })
      .then(() => {
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
    await fetch('https://id.twitch.tv/oauth2/token?' + new URLSearchParams({
      grant_type: 'authorization_code',
      code: queryParams.code,
      client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
      client_secret: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_NOENCODE
    }), {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.twitchtv.v5+json'
      }
    }).then(r => r.json())
    .then((oauth) => {
      //console.log(oauth); // access_token, refresh_token, expires_in, scope ['...']
      if(!oauth.access_token) {
        this.setState((state) => {
          return {
            ...state,
            failed_login: true
          };
        });
        return;
      }

      localStorage.setItem('__access_token', oauth.access_token);
      this.setState((state) => {
        return {
          ...state,
          access_token: oauth.access_token
        };
      });

      fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
          Authorization: `Bearer ${oauth.access_token}`
        }
      })
      .then(r => r.json())
      .then(userInfo => {
        //console.log(userInfo); //login [aka lowercase username?], display_name, profile_image_url, description
        localStorage.setItem('__username', userInfo.data[0].login);
        return fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${userInfo.data[0].id}`, {
          headers: {
            'Client-ID': process.env.REACT_APP_TWITCH_CLIENT_ID,
            Authorization: `Bearer ${this.state.access_token}`
          }
        })
        .then(r => r.json())
        .then(modInfo => {
          const modList = modInfo.data.map((modObj) => modObj.user_name.toLowerCase())
          this.setState((state) => {
            return {
              ...state,
              username: userInfo.data[0].login,
              modList
            };
          })
        })
      })
    })
  }

  render() {
    return (
      <div>
        {this.props.location.pathname === "/gamelist" && <JackboxGameList /> }
        {this.state.failed_login && this.props.location.pathname !== "/gamelist"
          ? <Redirect to="/login" />
          : this.state.username && <MainScreen
                                      channel={this.state.username}
                                      modList={this.state.modList}
                                      access_token={this.state.access_token}
                                      onLogout={this.logOut}
                                    />}
      </div>
    )
  }
}


export default withRouter(AuthenticatedApp);
