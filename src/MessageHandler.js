import { Component } from 'react';
import GameRequest from './GameRequest'
import Sidebar from './Sidebar'
const tmi = require('tmi.js');

const GAME_REQUEST_COMMAND = "!request";
const filterGameCommands = function(message) {
  if(!message.startsWith(GAME_REQUEST_COMMAND)) return;
  return message.replace(GAME_REQUEST_COMMAND, "").trim().toLowerCase();
}

export default class MessageHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null
    };
  }

  componentDidMount(props) {
    const client = new tmi.client({
      identity: {
        username: this.props.channel,
        password: this.props.access_token
      },
      channels: [
        this.props.channel
      ]
    });

    client.on('message', this.onMessage);
    client.connect();

    this.setState((state) => {
      return {
        ...state,
        client
      }
    });
  }

  onMessage = (target, tags, msg, self) => {
    const game = filterGameCommands(msg);
    if (!game) return;

    if(this.props.messages[game]) {
      this.sendMessage(`/me @${tags.username}, ${game} has already been requested!`);
      return;
    }

    this.props.addGame(game, tags.username);

    let prevGame = null;
    for(const [game, metadata] of Object.entries(this.props.messages)) {
      if(metadata.username === tags.username){
        prevGame = game;
        break;
      }
    }

    if(prevGame) {
      if(this.props.channel === tags.username) {
        this.sendMessage(`/me @${tags.username}, ${game} has been added to the request queue. Your previous game request(s) weren't deleted, since you have special broadcaster privilege :P`);
      } else {
        this.removeGame(prevGame);
        this.sendMessage(`/me @${tags.username}, your previous request of ${prevGame} has been replaced with ${game}.`);
      }
    } else {
      this.sendMessage(`/me @${tags.username}, ${game} has been added to the request queue.`);
    }
  }

  sendMessage = (msg) => {
    this.state.client.say(this.props.channel, msg)
  }

  render() {
    return null;
  }
}
