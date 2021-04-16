
import React, { Component } from 'react';
import MessageHandler from './MessageHandler';
const fetch = require('node-fetch');

export default class AuthenticatedApp extends Component {
  render() {
    if(window.location.pathname === "/login") {
      return (<LoginHelper />);
    } else {
      const loginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=chat:read chat:edit`
      return (
        <a href={loginUrl} style={{backgroundColor: 'rebeccapurple', borderRadius: '5px', padding: '10px', color: 'white'}}>Log In With Twitch</a>
      )
    }
  }
}

class LoginHelper extends Component {
  constructor(){
    super();
    this.state = {
      username: "",
      access_token: ""
    }
  }
  async componentDidMount() {
    await fetch('https://id.twitch.tv/oauth2/token?' + new URLSearchParams({
      grant_type: 'authorization_code',
      code: new URLSearchParams(window.location.search).get('code'),
      client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
      client_secret: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI
    }), {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.twitchtv.v5+json'
      }
    }).then(r => r.json())
    .then((oauth) => {
      //console.log(oauth); // access_token, refresh_token, expires_in, scope ['...']
      if(!oauth.access_token) {
        window.location.href = window.location.origin;
      }

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
        this.setState((state) => {
          return {
            ...state,
            username: userInfo.data[0].login,
          };
        })
      })
    })
  }

  render() {
    return (
      <p>
        {this.state.username && <MessageHandler channel={this.state.username} access_token={this.state.access_token} />}
      </p>
    )
  }
}
