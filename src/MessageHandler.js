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

  // returns true iff a known command was found & responded to
  checkForMiscCommands = (message, username) => {
    //========= game list =========
    if(message === "!gamelist" || message === "!gameslist") {
      this.sendMessage(`/me @${username}, click here for a list of valid Jackbox games: ${process.env.REACT_APP_REDIRECT_URI_NOENCODE}/gamelist`);
      return true;
    }

    //========= advance next game =========
    if(message === "!advancenextgame") {
      if(this.props.channel !== username && !this.props.modList.includes(username.toLowerCase())){
        this.sendMessage(`/me @${username}, only channel moderators can use the !advanceNextGame command.`);
        return true;
      }
      if(this.props.advanceNextGame()) {
        this.sendMessage(`/me @${username}, the next game has been advanced to ${this.props.upcomingGames[0].gameName}.`);
      } else {
        this.sendMessage(`/me @${username}, there are no more games in the queue to advance to!`);
      }
      return true;
    }

    //========= set next game =========
    if(message.startsWith("!setnextgame") || message.startsWith("!redeem")) {
      if(this.props.channel !== username && !this.props.modList.includes(username.toLowerCase())){
        this.sendMessage(`/me @${username}, only channel moderators can use the ${message.startsWith("!s") ? "!setNextGame" : "!redeem"} command.`);
        return true;
      }

      const requestedGame = message.replace("!setnextgame", "").replace("!redeem", "").trim();
      if(requestedGame === "") {
        this.sendMessage(`/me @${username}, please specify the game you would like to insert in the queue: for example, ${message.startsWith("!s") ? "!setNextGame" : "!redeem"} TMP 2`);
        return true;
      }

      const gameName = this.matchGameName(requestedGame);
      if(gameName) {
        const numGamesAhead = this.props.setNextGame(gameName);
        if(numGamesAhead === 0) {
          this.sendMessage(`/me @${username}, ${gameName} has been inserted as the next game in the queue.`);
        } else {
          this.sendMessage(`/me @${username}, ${gameName} has been inserted in the queue following ${numGamesAhead} other manual game request${numGamesAhead > 1 ? 's' : ''}.`);
        }

      }
      return true;
    }
  }

  matchGameName = (requestedGame, username) => {
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

  checkForGameCommand = (message, username) => {
    if(!message.startsWith(GAME_REQUEST_COMMAND)) return;

    const requestedGame = message.replace(GAME_REQUEST_COMMAND, "").trim();

    if(requestedGame === "") {
      this.sendMessage(`/me @${username}, please specify the game you would like to request: for example, !request TMP 2`);
      return null;
    }

    return this.matchGameName(requestedGame, username);
  }

  onMessage = (target, tags, msg, self) => {
    if(self) return;
    this.props.onMessage(msg, tags.username, tags)

    if(msg.trim() === "!nextgame") {
      if(this.props.upcomingGames && this.props.upcomingGames.length > 0) {
        let upcoming = this.props.upcomingGames[0].gameName;
        if(this.props.upcomingGames.length > 1) {
          upcoming += `, followed by ${this.props.upcomingGames[1].gameName}`
          for(let i = 2; i < this.props.upcomingGames.length; i++) {
            upcoming += ` and ${this.props.upcomingGames[i].gameName}`
          }
        }
        this.sendMessage(`/me @${tags.username}, the next game up is ${upcoming}!`)
      } else {
        this.sendMessage(`/me @${tags.username}, the next game hasn't been decided yet - feel free to !request one :)`)
      }

      return;
    }

    const cleanedMsg = msg.trim().toLowerCase();
    if(this.checkForMiscCommands(cleanedMsg, tags.username)) return;
    const game = this.checkForGameCommand(cleanedMsg, tags.username);
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
        this.props.onDelete(prevGame);
        this.sendMessage(`/me @${tags.username}, your previous request of ${prevGame} has been replaced with ${game}.`);
      }
    } else {
      this.sendMessage(`/me @${tags.username}, ${game} has been added to the request queue.`);
    }

    this.props.addGameRequest(game, tags.username);
  }

  sendMessage = (msg) => {
    this.state.client.say(this.props.channel, msg)
  }

  render() {
    return null;
  }
}
