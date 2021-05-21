import { Component } from 'react';
import WheelComponent from 'react-wheel-of-prizes'
import GameRequest from './GameRequest'
import MessageHandler from './MessageHandler';
import Sidebar from './Sidebar'
import ChatActivity, { ActivityStatus } from './ChatActivity';
const randomColor = require('randomcolor');


export default class MainScreen extends Component {
  constructor(props){
    super(props);
    this.chatActivity = new ChatActivity(this.props.channel)
    this.state = {
      messages: {},
      colors: randomColor({count: 99, luminosity: 'light', hue: 'blue'}),
      counter: 0,
      history: [],
      nextGameIdx: 0
    };
  }

  moveNextGameFwd = () => {
    if(this.state.nextGameIdx === this.state.history.length) return;
    this.setState((state) => {
      return {
        ...this.state,
        nextGameIdx: state.nextGameIdx+1
      }
    })
  }

  moveNextGameBack = () => {
    if(this.state.nextGameIdx <= 0) return;
    this.setState((state) => {
      return {
        ...this.state,
        nextGameIdx: state.nextGameIdx-1
      }
    })
  }

  addGameRequest  = (game, user) => {
    this.setState((state) => {
      return {
        ...state,
        messages: {
          ...this.state.messages,
          [game]: {
            username: user,
            time: Date.now(),
            locked: false,
            chosen: false
          }
        },
        counter: this.state.counter + 1
      };
    })
  }

  toggleLock = (game) => {
    const stateCopy = {...this.state.messages[game]};
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

  addGameToQueue = (gameName, override=false) => {
    // update history + game card highlight color
    this.setState((state) => {
      return {
        ...state,
        history: [
          ...this.state.history,
          {
            gameName,
            override
          }
        ],
        messages: {
          ...state.messages,
          [gameName]: {
            ...state.messages[gameName],
            chosen: true
          }
        }
      }
    })
  }

  onWheelSpun = (game) => {
    if(Object.keys(this.state.messages).length === 0) return;

    // send confirmation message in chat
    const requester = this.state.messages[game].username;
    this.chatActivity.getStatusPromise(requester).then((status) => {
      let msg = "";
      switch(status) {
        case ActivityStatus.DISCONNECTED:
          msg = `${game} just won the spin, but it doesn't seem like @${requester} is still around. Hope someone else wants to play!`
          break;

        case ActivityStatus.ACTIVE:
          msg = `@${requester}, good news - ${game} just won the spin!`;
          break;

        case ActivityStatus.IDLE:
        default:
          msg += `@${requester}, good news - ${game} just won the spin! (I hope you're still around!)`;
        }
        this.messageHandler.sendMessage(msg);
    })

    this.addGameToQueue(game);

    // remove card unless it's locked
    if(!this.state.messages[game].locked) {
      setTimeout(() => {
        this.removeGame(game, true);
      }, 2500);
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

  onMessage = (message, user, metadata) => {
    this.chatActivity.updateLastMessageTime(user);
  }

  render() {
    const gameArray = Object.keys(this.state.messages);
    let logOutBtn;
    if (typeof this.props.onLogout === 'function') {
        logOutBtn = (<button style={{position: 'absolute', top: 0, right: 0, backgroundColor: 'darkcyan', borderRadius: '5px', marginTop: 0, paddingBottom: '5px', paddingTop: '5px', color: '#fff'}} onClick={this.props.onLogout}>Logout &#10151;</button>);
    }

    return (
      <div style={{display: 'flex'}}>
        <MessageHandler
          addGameRequest={this.addGameRequest}
          messages={this.state.messages}
          channel={this.props.channel}
          access_token={this.props.access_token}
          onMessage={this.onMessage}
          onDelete={this.removeGame}
          upcomingGames={this.state.history.slice(this.state.nextGameIdx)}
          ref={(mh) => this.messageHandler = mh}
        />
        <div width="50vw">
          <h2 style={{marginBottom:"0"}}>Game Requests</h2>
          <h4 style={{fontSize:"20px", color: "yellow", marginTop: "6px", marginBottom:"12px", fontWeight: 400}}>Type e.g. "!request Blather Round" in {this.props.channel}'s chat to add</h4>
          <div style={{display:"flex", alignItems: "flex-start", height:"100%"}}>
          <Sidebar
            history={this.state.history}
            nextGameIdx={this.state.nextGameIdx}
            moveNextGameFwd={this.moveNextGameFwd}
            moveNextGameBack={this.moveNextGameBack}
          />
          <div style={{flexGrow: "2", marginLeft: "15px"}}>
              {gameArray.map((msg, i) =>
                <GameRequest
                  key={i}
                  msg={msg}
                  metadata={this.state.messages[msg]}
                  onDelete={this.removeGame}
                  toggleLock={this.toggleLock.bind(msg)}
                  getActivity={this.chatActivity.getStatusPromise}
              />)}
            </div>
          </div>
        </div>
        <div width="50vw" style={{textTransform: 'capitalize'}}>
          <div style={{fontSize: "16px", overflow: "hidden", width: "600px"}}>
            <WheelComponent
              key={this.state.counter}
              segments={gameArray}
              segColors={this.state.colors}
              onFinished={this.onWheelSpun}
              isOnlyOnce={false}
              size={250}
              upDuration={100}
              downDuration={1000}
              primaryColor={"white"}
              contrastColor={"black"}
            />
          {/*  <Modal/>*/}
          </div>
        </div>
        {logOutBtn}
      </div>
    )
  }
}
