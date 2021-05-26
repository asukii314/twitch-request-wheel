import { Component } from 'react';
import WheelComponent from 'react-wheel-of-prizes'
import GameRequest from './GameRequest'
import MessageHandler from './MessageHandler';
import Sidebar from './Sidebar'
import PlayerSelectModal from './PlayerSelectModal';
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
      nextGameIdx: 0,
      showPlayerSelectModal: false
    };
  }

  changeNextGameIdx = (delta = 1) => {
    if(this.state.nextGameIdx + delta > this.state.history.length) return false;
    if(this.state.nextGameIdx + delta < 0) return false;
    this.setState((state) => {
      return {
        ...this.state,
        nextGameIdx: state.nextGameIdx + delta
      }
    });
    return true;
  }

  moveNextGameFwd = () => {
    return this.changeNextGameIdx();
  }

  moveNextGameBack = () => {
    return this.changeNextGameIdx(-1);
  }

  addGameRequest = (gameObj, user) => {
    this.setState((state) => {
      return {
        ...state,
        messages: {
          ...this.state.messages,
          [gameObj.longName]: {
            ...gameObj,
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

  // @return: the number of games ahead of this one, after successfully inserting in queue
  // (i.e. if it's the very next game, return 0; if there's one ahead, return 1; etc)
  setNextGame = (gameObj) => {
    let idx = this.state.nextGameIdx;

    // insert next game at next up position by default, but
    //    *after* any other manually inserted games
    while(idx < this.state.history.length && this.state.history[idx]?.override) {
      idx++;
    }

    this.setState((state) => {
      return {
        ...state,
        history: [
          ...state.history.slice(0, Math.max(0, idx)),
          {
            ...gameObj,
            override: true
          },
          ...state.history.slice(idx)
        ]
      }
    })

    return idx - this.state.nextGameIdx;
  }

  addGameToQueue = (gameObj) => {
    // update history + game card highlight color
    this.setState((state) => {
      return {
        ...state,
        history: [
          ...this.state.history,
          {
            ...gameObj,
            override: false
          }
        ],
        messages: {
          ...state.messages,
          [gameObj.longName]: {
            ...state.messages[gameObj.longName],
            chosen: true
          }
        }
      }
    })
  }

  onWheelSpun = (gameLongName) => {
    const gameRequestObj = this.state.messages?.[gameLongName];
    if(!gameRequestObj) return;

    // send confirmation message in chat
    const requester = gameRequestObj.username;
    this.chatActivity.getStatusPromise(requester).then((status) => {
      let msg = "";
      switch(status) {
        case ActivityStatus.DISCONNECTED:
          msg = `/me ${gameRequestObj.name} just won the spin, but it doesn't seem like @${requester} is still around. Hope someone else wants to play!`
          break;

        case ActivityStatus.ACTIVE:
          msg = `/me @${requester}, good news - ${gameRequestObj.name} just won the spin!`;
          break;

        case ActivityStatus.IDLE:
        default:
          msg += `/me @${requester}, good news - ${gameRequestObj.name} just won the spin! (I hope you're still around!)`;
        }
        this.messageHandler.sendMessage(msg);
    })

    this.addGameToQueue(gameRequestObj);

    // remove card unless it's locked
    if(!this.state.messages[gameLongName].locked) {
      setTimeout(() => {
        this.removeGame(gameLongName, true);
      }, 2500);
    }
  }

  removeGame = (gameLongName) => {
    const newMessageObj = {...this.state.messages};
    delete newMessageObj[gameLongName];
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

  togglePlayerSelect = () => {
    this.setState((state) => {
      return {
        ...state,
        showPlayerSelectModal: !state.showPlayerSelectModal
      }
    })
  }

  routePlayRequest = (user, sendConfirmationMsg=true) => {
    const msg = this.state.showPlayerSelectModal
                  ? this.playerSelector?.handleNewPlayerRequest(user)
                  : 'sign-ups are currently closed; try again after this game wraps up!'

    if(sendConfirmationMsg) {
      this.messageHandler?.sendMessage(`/me @${user}, ${msg}`);
    }
  }

  routeLeaveRequest = (user) => {
    this.playerSelector?.removeUser(user);
  }

  routeOpenQueueRequest = () => {
    this.setState((state) => {
      return {
        ...state,
        showPlayerSelectModal: true
      }
    })
    this.playerSelector?.openQueue();
  }

  routeCloseQueueRequest = () => {
    this.playerSelector?.closeQueue();
  }

  routeClearQueueRequest = () => {
    this.playerSelector?.clearQueue();
  }

  startGame = () => {
    // I know this is a big ol' React sin, but I can't for the life of me
    //   figure out why this.togglePlayerSelect() isn't working... sooo...
    this.state.showPlayerSelectModal = false;
    this.moveNextGameFwd();
  }

  render() {
    const gameRequestArray = Object.keys(this.state.messages);
    let logOutBtn;
    if (typeof this.props.onLogout === 'function') {
        logOutBtn = (<button style={{position: 'absolute', top: 0, right: 0, backgroundColor: 'darkcyan', borderRadius: '5px', marginTop: 0, paddingBottom: '5px', paddingTop: '5px', color: '#fff'}} onClick={this.props.onLogout}>Logout &#10151;</button>);
    }

    return (
      <div style={{display: 'flex'}}>
        <MessageHandler
          addGameRequest={this.addGameRequest}
          setNextGame={this.setNextGame}
          changeNextGameIdx={this.changeNextGameIdx}
          messages={this.state.messages}
          channel={this.props.channel}
          modList={this.props.modList}
          access_token={this.props.access_token}
          onMessage={this.onMessage}
          onDelete={this.removeGame}
          upcomingGames={this.state.history.slice(this.state.nextGameIdx)}
          caniplayHandler={this.routePlayRequest}
          playerExitHandler={this.routeLeaveRequest}
          openQueueHandler={this.routeOpenQueueRequest}
          closeQueueHandler={this.routeCloseQueueRequest}
          clearQueueHandler={this.routeClearQueueRequest}
          ref={(mh) => this.messageHandler = mh}
        />
        <div style={{width: this.state.showPlayerSelectModal ? "90vw" : "45vw"}}>

          <h2 style={{marginBottom:"0"}}>{this.state.showPlayerSelectModal ? 'Seat Requests' : 'Game Requests'}</h2>
          {!this.state.showPlayerSelectModal && <h4 style={{fontSize:"20px", color: "yellow", marginTop: "6px", marginBottom:"12px", fontWeight: 400}}>Type e.g. <b>"!request Blather Round"</b> in {this.props.channel}'s chat to add</h4>}
          {this.state.showPlayerSelectModal && <h4 style={{fontSize:"20px", color: "yellow", marginTop: "6px", marginBottom:"12px", fontWeight: 400}}>Type <b>!new</b> in {this.props.channel}'s chat if you want to join the next game</h4>}
          <div style={{display:"flex", alignItems: "flex-start", height:"100%"}}>
          <Sidebar
            history={this.state.history}
            nextGameIdx={this.state.nextGameIdx}
            changeNextGameIdx={this.changeNextGameIdx}
            moveNextGameFwd={this.moveNextGameFwd}
            moveNextGameBack={this.moveNextGameBack}
            selectPlayers={this.togglePlayerSelect}
            requestMode={this.state.showPlayerSelectModal ? 'seat' : 'game'}
          />
          <div style={{flexGrow: "2", marginLeft: "15px"}}>
            {this.state.showPlayerSelectModal &&
              <PlayerSelectModal
                game={this.state.history?.[this.state.nextGameIdx]}
                startGame={this.startGame}
                ref={(ps) => this.playerSelector = ps}
              />}
            {!this.state.showPlayerSelectModal && gameRequestArray.map((gameName, i) =>
                <GameRequest
                  key={i}
                  gameName={gameName}
                  metadata={this.state.messages[gameName]}
                  onDelete={this.removeGame}
                  toggleLock={this.toggleLock.bind(gameName)}
                  getActivity={this.chatActivity.getStatusPromise}
              />)}
            </div>
          </div>
        </div>
        {!this.state.showPlayerSelectModal && <div width="50vw" style={{textTransform: 'capitalize'}}>
          <div style={{fontSize: "16px", overflow: "hidden", width: "600px"}}>
             <WheelComponent
              key={this.state.counter}
              segments={gameRequestArray}
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
        </div>}
        {logOutBtn}
      </div>
    )
  }
}
