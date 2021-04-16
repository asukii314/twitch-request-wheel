
import React, { Component } from 'react';
import MessageHandler from './MessageHandler';
import { Redirect, withRouter } from "react-router-dom";
import queryString from 'query-string'
const fetch = require('node-fetch');

class AuthenticatedApp extends Component {
  constructor(){
    super();
    this.state = {
      username: "",
      access_token: "",
      attempted_login: false
    }
  }
  async componentDidMount() {
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
            attempted_login: true
          };
        });
        return;
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
        {!this.state.username && this.state.attempted_login
          ? <Redirect to="/" />
          : <MessageHandler channel={this.state.username} access_token={this.state.access_token} />}
      </p>
    )
  }
}


export default withRouter(AuthenticatedApp);
