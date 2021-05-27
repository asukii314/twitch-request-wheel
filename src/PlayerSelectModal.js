import React, { Component } from 'react';
import './playerSelect.css';
import dice from './dice.svg';
import star from './star.svg';

// yes, I know it's not actually a modal, I changed my mind and I can't be arsed to change the class name
export default class PlayerSelectModal extends Component {
  constructor(props){
    super(props);
    this.firstColumn = React.createRef();
    this.state = {
      interested: [],
      playing: [],
      joined: [],
      streamerSeat: true,
      isQueueOpen: true
    }
  }

  componentDidMount() {
    this.updateColumnSizes();
    window.addEventListener("resize", this.updateColumnSizes);
  }

  updateColumnSizes = () => {
    this.setState((state) => {
      return {
        ...state,
        columnWidth: this.firstColumn.current.offsetWidth
      };
    })
  }

  handleNewPlayerRequest = (username, {isGuaranteedSeat=false}) => {
    if(isGuaranteedSeat) {
      // even if the queue is closed, still add them to the interested column for consideration
      const column = (this.state.isQueueOpen ? 'playing' : 'interested');

      return this.updateColumnForUser({username, isGuaranteedSeat}, column)
        ? 'you have been successfully added to the lobby.'
        : 'there was an error adding you to the lobby.';
    }

    if(this.state?.interested?.map((uObj) => uObj.username)?.includes(username)
    || this.state?.playing?.map((uObj) => uObj.username)?.includes(username)
    || this.state?.joined?.map((uObj) => uObj.username)?.includes(username)) {
      return 'you are already in the lobby.';
    }

    if(!this.state.isQueueOpen) {
      return 'the queue is currently closed; users have already been selected for this game.';
    }
    return this.updateColumnForUser({username}, 'interested')
      ? 'you have successfully joined the lobby.'
      : 'there was an error adding you to the lobby.';
  }

  updateColumnForUser = (userObj, newColumn) => {
    if(!this.state || !this.state[newColumn]) return false;

    this.removeUser(userObj.username);
    this.setState((state) => {
      return {
        ...state,
        [newColumn]: [
          ...state[newColumn],
          userObj
        ]
      }
    });
    return true;
  }

  removeUser = (username) => {
    return this.setState((state) => {
      return {
        ...state,
        interested: state.interested.filter((iObj) => iObj.username !== username),
        playing: state.playing.filter((pObj) => pObj.username !== username),
        joined:  state.joined.filter((jObj) => jObj.username !== username)
      }
    });
  }

  clearQueue = () => {
    return this.setState((state) => {
      return {
        ...state,
        interested: [],
        playing: [],
        joined: []
      }
    })
  }

  openQueue = () => {
    return this.setState((state) => {
      return {
        ...state,
        isQueueOpen: true
      }
    })
  }

  closeQueue = () => {
    return this.setState((state) => {
      return {
        ...state,
        isQueueOpen: false
      }
    })
  }

  playerCount = () => {
    return this.state.playing.length + this.state.joined.length +
            (this.state.streamerSeat ? 1 : 0);
  }

  toggleStreamerSeat = () => {
    this.setState((state) => {
      return {
        ...state,
        streamerSeat: !state.streamerSeat
      }
    });
  }

  canStartGame = () => {
    return this.props.game?.['Max players'] >= this.playerCount() &&
           this.props.game?.['Min players'] <= this.playerCount();
  }

  startGame = () => {
    // clear for now; eventually, save elsewhere to report on user play history for that session
    this.setState ((state) => {
      return {
        ...state,
        interested: [],
        playing: [],
        joined: []
      };
    })
    this.props.startGame();
  }

  randomizePlayers = () => {
    const numPlayersToAdd = Math.min(this.props.game['Max players'] - this.playerCount(), this.state.interested.length);

    let randIdx, randUsername;
    let randIdxArray = [];
    let interested = this.state.interested;
    let playing = this.state.playing;

    while(randIdxArray.length < numPlayersToAdd) {
      randIdx = Math.floor(Math.random() * this.state.interested.length);
      if(!randIdxArray.includes(randIdx)) {
        randIdxArray.push(randIdx);
        randUsername = this.state.interested[randIdx].username;
        interested = interested.map((uObj) => uObj.username)?.filter((rName) => rName !== randUsername);
        playing = [...playing, randUsername];
      }
    }
    this.setState((state) => {
      return {
        ...state,
        interested,
        playing
      }
    })
  }

  renderPlayerCard = (userObj, id, curColumn) => {
    return (
      <div key={id} className='playerCard'>
        <div style={{display: 'flex'}}>
          {userObj.isGuaranteedSeat === true && <img src={star} alt="Priority seat redemption" style={{width: '16px', marginLeft: '3px'}}/>}
          <p className='playerName' style={{maxWidth: this.state.columnWidth - 25}}>{userObj.username}</p>
        </div>
        <div className='changeColButtonsContainer'>
        {curColumn !== 'interested' && <button className='changeCol' onClick={this.updateColumnForUser.bind(this, userObj, 'interested')}>Interested</button>}
        {curColumn !== 'playing' && <button className='changeCol' onClick={this.updateColumnForUser.bind(this, userObj, 'playing')}>Playing</button>}
        {/*curColumn !== 'joined' && <button className='changeCol' onClick={this.updateColumnForUser.bind(this, userObj, 'joined')}>Joined</button>*/}
        <button className='changeCol' style={{backgroundColor: 'indianred'}} onClick={this.removeUser.bind(this, userObj.username)}>X</button>
        </div>
      </div>
    );
  }

  renderStreamerSeatToggle = () => {
    return (
      <div class='my-toggle-group'>
      <p class='toggle-label'> Reserve seat for streamer? </p>
        <div class='my-toggle'>
            <input type="checkbox" onChange={this.toggleStreamerSeat}/>
            <div class='my-toggle-text no' aria-hidden="true">No</div>
            <div class='my-toggle-text yes' aria-hidden="true">Yes</div>
            <div class='my-toggle-orb'></div>
        </div>
      </div>
    )
  }

  renderPlayerCount = () => {
    let className = 'playerCount';
    if(this.props.game?.['Max players'] < this.playerCount()) {
      className += ' overlimit';
    }
    return (<p className={className}>{this.playerCount()} of {this.props.game?.['Max players']} seats claimed</p>)
  }

  render() {
    let startGameClass = 'startGame';
    if(this.playerCount() < this.props.game?.['Min players']){
      startGameClass += ' disabled';
    }
    return (
      <div className='playerSelectContainer'>
        <div className="header">
          {this.renderStreamerSeatToggle()}
          {this.renderPlayerCount()}
          <button className={startGameClass} onClick={this.startGame} disabled={!this.canStartGame()}>Start Game</button>
        </div>
        <div className='playerCardContainer'>
          <div ref={this.firstColumn} className='playerCardColumn interested'>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Interested</p>
            {this.state.interested.map((userObj, i) => this.renderPlayerCard(userObj, i, 'interested') )}
          </div>

          <div className='playerCardColumn playing'>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Playing
            <button className="dice" style={{width: '25px', height: '25px', backgroundColor: 'greenyellow', borderRadius: '5px', marginLeft: '10px', padding: '0px'}} onClick={this.randomizePlayers}>
              <img src={dice} style={{width:'100%', height: '100%'}}/>
            </button>
            </p>
            {this.state.playing.map((userObj, i) => this.renderPlayerCard(userObj, i, 'playing') )}
          </div>

          <div className='playerCardColumn joined'>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Joined</p>
            {this.state.joined.map((userObj, i) => this.renderPlayerCard(userObj, i, 'joined') )}
          </div>
        </div>
      </div>
    );
  }
}
