import { Component } from 'react';
import WheelComponent from 'react-wheel-of-prizes'
import ReactTooltip from 'react-tooltip'
import './messageStyles.css';
import lock from './lock.svg';
const randomColor = require('randomcolor');
const tmi = require('tmi.js');

const GAME_REQUEST_COMMAND = "!request";
const column = function(width) {
  return (<div style={{float:'left', width:width}} />);
}

const filterGameCommands = function(message) {
  if(!message.startsWith(GAME_REQUEST_COMMAND)) return;
  return message.replace(GAME_REQUEST_COMMAND, "").trim().toLowerCase();
}


class GameRequest extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeDiff: 0
    };
  }

  updateTimeDiff = () => {
    // return Date.now();
    this.setState(() => {
      return {
        ...this.state,
        timeDiff: `${Math.floor((Date.now()-this.props.metadata.time)/60000)} minutes ago`
      };
    });
  }
  delete = (e) => {
    this.props.onDelete(this.props.msg)
  }

  toggleLock = () => {
    this.props.toggleLock(this.props.msg)
  }

  render() {
    const lockOpacity = this.props.metadata.locked ? '1' : '0.2';
    return (
      <div>
      <ReactTooltip effect="solid" place="right"/>
      <div id="baseDiv" data-tip={`Requested ${this.state.timeDiff} by ${this.props.metadata.username}`} style={{backgroundColor:'steelblue', textAlign: 'left', borderRadius: '8px', textTransform: 'capitalize'}} onMouseEnter={this.updateTimeDiff}>
      <p style={{margin: '15px', padding: '4px', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {this.props.msg}
        <div style={{display:'flex'}}>
          <img src={lock} style={{width: '16px', opacity: lockOpacity, paddingRight: '8px'}} className="lock" onClick={this.toggleLock} />
          <button type='button' className="deleteButton" onClick={this.delete}>X</button>
        </div>
      </p>
      </div>
      </div>
    );
  }
}

export default class MessageHandler extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: {},
      colors: randomColor({count: 99, luminosity: 'light', hue: 'blue'}),
      counter: 0
    };
  }

  toggleLock = (game) => {
    const stateCopy = {...this.state.messages[game]};
    console.log(stateCopy)
    stateCopy.locked = !stateCopy.locked
    this.setState(() => {
      return {
        ...this.state,
        messages: {
          ...this.state.messages,
          [game]: stateCopy
        }
      }
    });
  }

  onGameChosen = (game) => {
    if(!this.state.messages[game].locked) {
      this.removeGame(game);
    }
  }

  removeGame = (game) => {
    const newMessageObj = {...this.state.messages};
    delete newMessageObj[game];
    this.setState((state) => {
      return {
        ...state,
        messages: newMessageObj,
        counter: this.state.counter + 1
      };
    })
  }

  onMessage = (target, tags, msg, self) => {
    const game = filterGameCommands(msg);
    if (!game) return;
    if(this.state.messages[game]) {
      this.sendMessage(`/me @${tags.username}, ${game} has already been requested!`);
      return;
    }

    this.setState((state) => {
      return {
        ...state,
        messages: {
          ...this.state.messages,
          [game]: {
            username: tags.username,
            time: Date.now(),
            locked: false
          }
        },
        counter: this.state.counter + 1
      };
    })
    this.sendMessage(`/me @${tags.username}, ${game} has been added to the request queue.`);
  }

  sendMessage = (msg) => {
    this.state.client.say(this.props.channel, msg)
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

    console.log(JSON.stringify(client));

    this.setState((state) => {
      return {
        ...state,
        client
      }
    });
  }

  render() {
    const gameArray = Object.keys(this.state.messages);
    console.log(this.state.messages);
    return (
      <div style={{display: 'flex'}}>
        <column width="50vw">
          <h2 style={{marginBottom:"0"}}>Game Requests</h2>
          <h4 style={{fontSize:"20px", color: "yellow", marginTop: "6px", marginBottom:"12px", fontWeight: 400}}>Type e.g. "!request Blather Round" in {this.props.channel}'s chat to add</h4>
          {gameArray.map((msg, i) => <GameRequest key={i} msg={msg} metadata={this.state.messages[msg]} onDelete={this.removeGame} toggleLock={this.toggleLock.bind(msg)}/>)}
        </column>
        <column width="50vw" style={{textTransform: 'capitalize'}}>
          <div style={{fontSize: "16px", overflow: "hidden", width: "600px"}}>
            <WheelComponent
              key={this.state.counter}
              segments={gameArray}
              segColors={this.state.colors}
              onFinished={this.onGameChosen}
              isOnlyOnce={false}
              size={250}
              upDuration={100}
              downDuration={1000}
              primaryColor={"white"}
              contrastColor={"black"}
            />
          </div>
        </column>

      </div>
    )
  }
}
