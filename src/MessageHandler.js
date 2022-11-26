import {Component} from 'react';
import rawJackboxGameList from './JackboxGames.yaml';
import YAML from 'yaml'
const fetch = require('node-fetch');
const tmi = require('tmi.js');

const GAME_REQUEST_COMMAND = "!request";

const easterEggRequests = [
    {
        RequestName: 'Affection',
        Response: 'there there, it\'s going to be okay. VirtualHug',
        Variants: [
            'a friend',
            'a hug',
            'a kiss',
            'friend',
            'hug',
            'kiss',
            'affection',
            'a shoulder to cry on',
            'shoulder to cry on'
        ]
    }, {
        RequestName: 'Goose',
        Response: 'please don\'t taunt the wheel. Honk.',
        Variants: [
            'goose',
            'honk',
            'meow',
            'mrow',
            'woof',
            'bark',
            'nugs',
            'chicken nugs'
        ]
    }, {
        RequestName: 'Lewmon',
        Response: 'please don\'t taunt the wheel. sirfar3Lewmon sirfar3Lewmon sirfar3Lewmon',
        Variants: [
            'lewmon',
            'sirfar3lewmon'
        ]
    }, {
        RequestName: 'DoTheDew',
        Response: 'dewinbDTD dewinbDance dewinbGIR dewinbDance dewinbGIR dewinbDance dewinbDTD',
        Variants: [
            'dothedew',
            'dewinblack'
        ]
    }
];

export default class MessageHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null,
            validGames: []
        };
        this.getTwitchClient = this.getTwitchClient.bind(this);
        this.isModOrBroadcaster = this.isModOrBroadcaster.bind(this);
        this.checkForMiscCommands = this.checkForMiscCommands.bind(this);
        this.findGame = this.findGame.bind(this);
        this.checkForGameCommand = this.checkForGameCommand.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount = (props) => {
        const client = this.getTwitchClient(this.props);
        this.client = client;

        client.on('message', this.onMessage);
        client.connect();

        return this.getGameList(rawJackboxGameList, client);
    }

    componentWillUnmount = (props) => {
        try {
            if (this.client) {
                this.client.disconnect();
            }
        } catch(e) {
            console.log('Error', e);
        }
    }

    getGameList = async (yamlGameList, client) => {
        return await fetch(yamlGameList)
            .then(r => r.text())
            .then(text => {
                return this.setState({
                    client,
                    validGames: YAML.parse(text)
                });
            }).catch(e => {
                console.warn(e);
            });
    }

    getTwitchClient = (props) => {
        return new tmi.client({
            identity: {
                username: props.channel,
                password: props.access_token
            },
            channels: [
                props.channel
            ]
        });
    }

    isModOrBroadcaster = (username) => {
        return (this.props.channel === username || this.props.modList.includes(username.toLowerCase()));
    }

    // returns true iff a known command was found & responded to
    checkForMiscCommands = (message, username) => {
        //========= general =========
        if (message.startsWith("!gamelist") || message.startsWith("!gameslist")) {
            this.sendMessage(`/me @${username}, click here for a list of valid Jackbox games: ${process.env.REACT_APP_REDIRECT_URI_NOENCODE}/gamelist`);
            return true;
        }

        if (message === "!wheelcommands") {
            this.sendMessage(`/me @${username}, click here to read about all supported commands: https://github.com/asukii314/twitch-request-wheel/blob/master/src/Commands.yaml`);
            return true;
        }

        if (message.startsWith("!whichpack")) {
            const requestedGame = message.replace("!whichpack", "").trim();
            if (requestedGame === "") {
                this.sendMessage(`/me @${username}, please specify the game you would like to look up the party pack for: e.g. !whichpack TMP 2`);
                return true;
            }

            const gameObj = this.findGame(requestedGame, username);
            if (gameObj) {
                this.sendMessage(`/me @${username}, ${gameObj.name} is a ${gameObj.partyPack} game.`);
            }
            return true;
        }

        //========= enable / disable requests =========
        if ( message.startsWith("!enablerequests")) {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            this.props?.toggleAllowGameRequests(true);
            this.sendMessage(`/me @${username}, requests have now been enabled! Type "!request" followed by the game you want to play.`);
            return true;
        }
        if ( message.startsWith("!disablerequests")) {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            this.props?.toggleAllowGameRequests(false);
            this.sendMessage(`/me @${username}, requests have now been disabled.`);
            return true;
        }

        //========= advance next game =========
        if (message === "!advancenextgame" || message === "!nextgamefwd" || message === "!nextgameforward") {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            if (this.props.changeNextGameIdx(1)) {
                if (this.props.upcomingGames.length > 0) {
                    // console.log(this.props.upcomingGames)
                    this.sendMessage(`/me @${username}, the next game has been changed to ${this.props.upcomingGames[0].name}.`);
                } else {
                    this.sendMessage(`/me @${username}, the next game has been marked as "TBD".`);
                }
            } else {
                this.sendMessage(`/me @${username}, there are no more games in the queue to advance to!`);
            }
            return true;
        }

        //========= advance prev game =========
        if (message === "!nextgameback" || message === "!nextgamebackward") {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            if (this.props.changeNextGameIdx(-1)) {
                this.sendMessage(`/me @${username}, the next game has been changed to ${this.props.upcomingGames[0].name}.`);
            } else {
                this.sendMessage(`/me @${username}, there are no previous games in the queue to go back to!`);
            }
            return true;
        }

        //========= set next game =========
        if (message.startsWith("!setnextgame") || message.startsWith("!redeemgame")) {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use the ${message.startsWith("!s") ? "!setNextGame" : "!redeemgame"} command.`);
                return true;
            }

            const requestedGame = message.replace("!setnextgame", "").replace("!redeemgame", "").trim();
            if (requestedGame === "") {
                this.sendMessage(`/me @${username}, please specify the game you would like to insert in the queue: for example, ${message.startsWith("!s") ? "!setNextGame" : "!redeemgame"} TMP 2`);
                return true;
            }

            const gameObj = this.findGame(requestedGame, username);
            if (gameObj) {
                const numGamesAhead = this.props.setNextGame(gameObj);
                if (numGamesAhead === 0) {
                    this.sendMessage(`/me @${username}, ${gameObj.name} has been inserted as the next game in the queue.`);
                } else {
                    this.sendMessage(`/me @${username}, ${gameObj.name} has been inserted in the queue following ${numGamesAhead} other manual game request${numGamesAhead > 1 ? 's' : ''}.`);
                }

            }
            return true;
        }

        //========= player queue management =========
        if (message === "!caniplay" || message === "!new") {
            this.props?.caniplayHandler(username, {
                sendConfirmationMsg: message !== "!new"
            });
            return true;
        }

        if (message.startsWith("!priorityseat") || message.startsWith("!redeemseat")) {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            const redeemingUser = message.replace("!priorityseat", "").replace("!redeemseat", "").replace("@", "").trim();
            if (redeemingUser === "") {
                this.sendMessage(`/me @${username}, please specify the user who has redeemed a priority seat in the next game: for example, ${message.startsWith("!p") ? "!priorityseat" : "!redeemseat"} @asukii314`);
                return true;
            }
            this.props?.caniplayHandler(redeemingUser, {
                sendConfirmationMsg: true,
                isPrioritySeat: true
            });
            return true;
        }

        if ( message.startsWith("!removeuser")) {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            const exitingUser = message.replace("!removeuser", "").replace("@", "").trim();
            if (exitingUser === "") {
                this.sendMessage(`/me @${username}, please specify the user who will be removed in the next game: for example, !removeuser @dewinblack`);
                return true;
            }
            this.props?.playerExitHandler(exitingUser);
            return true;
        }

        if (message === "!leave" || message === "!murd") {
            this.props?.playerExitHandler(username);
            return true;
        }

        if (message === "!clear") {
            if (this.isModOrBroadcaster(username)) {
                this.props?.clearQueueHandler();
            }
            return true;
        }

        if (message === "!open") {
            if (this.isModOrBroadcaster(username)) {
                this.props?.openQueueHandler();
            }
            return true;
        }

        if (message === "!clearopen") {
            if (this.isModOrBroadcaster(username)) {
                this.props?.clearQueueHandler();
                this.props?.openQueueHandler();
            }
            return true;
        }

        if (message === "!close") {
            if (this.isModOrBroadcaster(username)) {
                this.props?.closeQueueHandler();
            }
            return true;
        }

        if (message === "!startgame") {
            if (!this.isModOrBroadcaster(username)) {
                this.sendMessage(`/me @${username}, only channel moderators can use this command.`);
                return true;
            }
            if (this.props.startGame()) {
                this.sendMessage(`/me @${username}, the game has been started.`);
            } else {
                this.sendMessage(`/me @${username}, the game was already started.`);
            }
            return true;
        }

        if (message.startsWith("!redeem")) {
            this.sendMessage(`/me @${username}, this command is no longer supported: please specify either !redeemgame or !redeemseat.`);
            return true;
        }
        return;
    }

    findGame = (requestedGame, username) => {
        // easter egg responses
        for (let requestEntry of easterEggRequests) {
            if (requestEntry?.Variants?.includes(requestedGame)) {
                this.sendMessage(`/me @${username} ${requestEntry.Response}`);
                return null;
            }
        }
        // check against games
        for (let partyPackName in this.state.validGames) {
            const partyPackObj = this.state.validGames[partyPackName]
            for (const [formalGameName, metadata] of Object.entries(partyPackObj)) {
                if (metadata?.Variants?.includes(requestedGame)) {
                    return {
                        name: formalGameName,
                        longName: `${formalGameName} (${partyPackName})`,
                        partyPack: partyPackName,
                        ...metadata
                    };
                }
            }
        }
        this.sendMessage(`/me @${username}, ${requestedGame} could not be found in the list of valid Jackbox games. Click here for a list of valid games: ${process.env.REACT_APP_REDIRECT_URI_NOENCODE}/gamelist`);
        return;
    }

    checkForGameCommand = (message, username) => {
        if (!message.startsWith(GAME_REQUEST_COMMAND)) return;

        const requestedGame = message.replace(GAME_REQUEST_COMMAND, "").trim();

        if (requestedGame === "") {
            this.sendMessage(`/me @${username}, please specify the game you would like to request: for example, !request TMP 2`);
            return null;
        }

        return this.findGame(requestedGame, username);
    }

    onMessage = (target, tags, msg, self) => {
        if (self) return;
        this.props.onMessage(msg, tags.username, tags)

        if (msg.trim() === "!nextgame") {
            if (this.props.upcomingGames && this.props.upcomingGames.length > 0) {
                let upcoming = this.props.upcomingGames[0].name;
                if (this.props.upcomingGames.length > 1) {
                    upcoming += `, followed by ${this.props.upcomingGames[1].name}`
                    for (let i = 2; i < this.props.upcomingGames.length; i++) {
                        upcoming += `, and ${this.props.upcomingGames[i].name}`
                    }
                }
                this.sendMessage(`/me @${tags.username}, the next game up is ${upcoming}!`)
            } else {
                this.sendMessage(`/me @${tags.username}, the next game hasn't been decided yet - feel free to !request one :)`)
            }

            return;
        }

        if (msg.trim() === "!lastgame") {
            if (this.props.previousGames && this.props.previousGames.length > 0) {
                let previous = this.props.previousGames[0].name;
                if (this.props.previousGames.length > 1) {
                    previous += `, followed by ${this.props.previousGames[1].name}`
                    for (let i = 2; i < this.props.previousGames.length; i++) {
                        previous += `, and ${this.props.previousGames[i].name}`
                    }
                }
                this.sendMessage(`/me @${tags.username}, the last game played was ${previous}!`)
            } else {
                this.sendMessage(`/me @${tags.username}, no games have been played yet - feel free to !request one :)`)
            }

            return;
        }

        const cleanedMsg = msg.trim().toLowerCase();
        if (this.checkForMiscCommands(cleanedMsg, tags.username)) return;
        const gameObj = this.checkForGameCommand(cleanedMsg, tags.username);
        if (!gameObj) return;

        if (this.props.messages[gameObj.longName]) {
            this.sendMessage(`/me @${tags.username}, ${gameObj.name} has already been requested!`);
            return;
        }

        if (this.props.allowGameRequests !== true) {
            this.sendMessage(`/me @${tags.username}, game requests are currently paused at the moment, please try again later.`);
            return;
        }


        let prevRequestedGameName = null;
        for (const metadata of Object.values(this.props.messages)) {
            if (metadata.username === tags.username) {
                prevRequestedGameName = metadata.longName;
                break;
            }
        }

        if (prevRequestedGameName) {
            if (this.props.channel === tags.username) {
                this.sendMessage(`/me @${tags.username}, ${gameObj.name} has been added to the request queue. Your previous game request(s) weren't deleted, since you have special broadcaster privilege :P`);
            } else {
                this.props.onDelete(prevRequestedGameName);
                this.sendMessage(`/me @${tags.username}, your previous request of ${prevRequestedGameName} has been replaced with ${gameObj.name}.`);
            }
        } else {
            this.sendMessage(`/me @${tags.username}, ${gameObj.name} has been added to the request queue.`);
        }

        this.props.addGameRequest(gameObj, tags.username);
        return;
    }

    sendMessage = (msg) => {
        this.state.client.say(this.props.channel, msg)
    }

    render() {
        return null;
    }
}
