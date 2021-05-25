import { Component } from 'react';
import './playerSelect.css';

// yes, I know it's not actually a modal, I changed my mind and I can't be arsed to change the class name
export default class PlayerSelectModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      interested: ['test', 'longerusernametest'],
      playing: [],
      joined: []
    }
  }

  handleNewPlayerRequest = (username, column='interested') => {
    if(this.state?.interested?.includes(username)
    || this.state?.playing?.includes(username)
    || this.state?.joined?.includes(username)) {
      return false;
    }
    return this.updateColumnForUser(username, 'interested');
  }

  updateColumnForUser = (username, newColumn) => {
    if(!this.state || !this.state[newColumn] || this.state[newColumn]?.includes(username)) return false;

    this.removeUser(username);
    this.setState((state) => {
      return {
        ...state,
        [newColumn]: [
          ...state[newColumn],
          username
        ]
      }
    });
    return true;
  }

  removeUser = (username) => {
    return this.setState((state) => {
      return {
        ...state,
        interested: state.interested.filter((rName) => rName !== username),
        playing: state.playing.filter((rName) => rName !== username),
        joined:  state.joined.filter((rName) => rName !== username)
      }
    });
  }


  basicPlayerCard = (username, id, curColumn) => {
    return (
      <div key={id} className='playerCard'> {username}
        <div className='changeColButtonsContainer'>
        {curColumn !== 'interested' && <button className='changeCol' onClick={this.updateColumnForUser.bind(this, username, 'interested')}>Interested</button>}
        {curColumn !== 'playing' && <button className='changeCol' onClick={this.updateColumnForUser.bind(this, username, 'playing')}>Playing</button>}
        {curColumn !== 'joined' && <button className='changeCol' onClick={this.updateColumnForUser.bind(this, username, 'joined')}>Joined</button>}
        <button className='changeCol' onClick={this.removeUser.bind(this, username)}>Remove</button>
        </div>
      </div>
    );
  }

  playerCount = () => {
    return this.state.playing.length + this.state.joined.length;
  }

  render() {
    return (
      <div style={{backgroundColor: 'red'}}>
        <div className="header">
          <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold'}}>{this.playerCount()} of ___ seats filled</p>
          <button className="startGame">Start Game</button>
        </div>

        <div style={{margin: '0px 15px 7px', height: "500px", padding: '4px', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{backgroundColor: 'blue', width: '50%', height: '100%', margin: '5px'}}>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Interested</p>
            {this.state.interested.map((username, i) => this.basicPlayerCard(username, i, 'interested') )}
          </div>

          <div style={{backgroundColor: 'green', width: '50%', height: '100%', margin: '5px'}}>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Playing</p>
            {this.state.playing.map((username, i) => this.basicPlayerCard(username, i, 'playing') )}
          </div>

          <div style={{backgroundColor: 'green', width: '50%', height: '100%', margin: '5px'}}>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Joined</p>
            {this.state.joined.map((username, i) => this.basicPlayerCard(username, i, 'joined') )}
          </div>
        </div>
      </div>
    );
  }
}
