import { Component } from 'react';
import WheelComponent from 'react-wheel-of-prizes'
import GameRequest from './GameRequest'
import Sidebar from './Sidebar'
const randomColor = require('randomcolor');

const column = function(width) {
  return (<div style={{float:'left', width:width}} />);
}

export default class MainScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: {},
      colors: randomColor({count: 99, luminosity: 'light', hue: 'blue'}),
      counter: 0,
      history: []
    };
  }

  addGame  = (game, user) => {
    this.setState((state) => {
      return {
        ...state,
        messages: {
          ...this.state.messages,
          [game]: {
            username: user,
            time: Date.now(),
            locked: false
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

  onGameChosen = (game) => {
    if(Object.keys(this.state.messages).length === 0) return;
    if(!this.state.messages[game].locked) {
      setTimeout(() => {
        this.removeGame(game, true);
      }, 2500);
    }
    this.setState((state) => {
      return {
        ...state,
        history: [
          ...this.state.history,
          game
        ]
      };
    })
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

  render() {
    const gameArray = Object.keys(this.state.messages);
    return (
      <div style={{display: 'flex'}}>
        <MessageHandler
          addGame={this.addGame}
          messages={this.state.messages}
          channel={this.props.channel}
          access_token={this.props.access_token}
        />
        <column width="50vw">
          <h2 style={{marginBottom:"0"}}>Game Requests</h2>
          <h4 style={{fontSize:"20px", color: "yellow", marginTop: "6px", marginBottom:"12px", fontWeight: 400}}>Type e.g. "!request Blather Round" in {this.props.channel}'s chat to add</h4>
          <div style={{display:"flex", alignItems: "flex-start", height:"100%"}}>
          <Sidebar history={this.state.history}/>
          <div style={{flexGrow: "2", marginLeft: "15px"}}>
              {gameArray.map((msg, i) => <GameRequest key={i} msg={msg} metadata={this.state.messages[msg]} onDelete={this.removeGame} toggleLock={this.toggleLock.bind(msg)}/>)}
            </div>
          </div>
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
          {/*  <Modal/>*/}
          </div>
        </column>
      </div>
    )
  }
}
