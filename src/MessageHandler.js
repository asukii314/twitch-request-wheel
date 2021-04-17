import { Component } from 'react';
import YAML from 'yaml'
import rawJackboxGameList from './JackboxGames.yaml';
const fetch = require('node-fetch');
const tmi = require('tmi.js');

const GAME_REQUEST_COMMAND = "!request";

export default class MessageHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      validGames: []
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

    fetch(rawJackboxGameList)
      .then(r => r.text())
      .then(text => {
        this.setState((state) => {
          return {
            ...state,
            client,
            validGames: YAML.parse(text)
          };
        });
      })
    }

  filterGameCommands = (message, username) => {
    if(!message.startsWith(GAME_REQUEST_COMMAND)) return;

    const requestedGame = message.replace(GAME_REQUEST_COMMAND, "").trim().toLowerCase();

    for(let partyPackName in this.state.validGames) {
      const partyPack = this.state.validGames[partyPackName]
      for(const [formalGameName, possibleMatches] of Object.entries(partyPack)){
        if(possibleMatches.includes(requestedGame)) {
          return `${formalGameName} (${partyPackName})`;
        }
      }
    }
    this.sendMessage(`/me @${username}, ${requestedGame} could not be found in the list of valid Jackbox games. Click here for a list of valid games: ${process.env.REACT_APP_REDIRECT_URI_NOENCODE}/gamelist`);
    return null;
  }

  onMessage = (target, tags, msg, self) => {
    if(self) return;
    const game = this.filterGameCommands(msg, tags.username);
    if (!game) return;

    if(this.props.messages[game]) {
      this.sendMessage(`/me @${tags.username}, ${game} has already been requested!`);
      return;
    }

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

    this.props.addGame(game, tags.username);
  }

  sendMessage = (msg) => {
    this.state.client.say(this.props.channel, msg)
  }

  render() {
    return null;
  }
}
