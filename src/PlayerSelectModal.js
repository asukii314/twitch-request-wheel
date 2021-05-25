import { Component } from 'react';

export default class PlayerSelectModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      requestingPlayers: [],
      confirmedPlayers: []
    }
  }

  handleNewPlayerRequest = (name) => {
    if(!this.state.requestingPlayers.includes(name) &&
       !this.state.confirmedPlayers.includes(name)) {
          this.setState((state) => {
            return {
              ...state,
              requestingPlayers: [
                ...state.requestingPlayers,
                name
              ]
            }
          })
          return true;
        }
    return false;
  }

  changeColumn = (name) => {
    console.log(name)
    if(this.state.requestingPlayers.includes(name)) {
      return this.setState((state) => {
        return {
          ...state,
          requestingPlayers: state.requestingPlayers.filter((rName) => rName != name),
          confirmedPlayers: [...state.confirmedPlayers, name]
        }
      })
    } else if(this.state.confirmedPlayers.includes(name)) {
      return this.setState((state) => {
        return {
          ...state,
          requestingPlayers: [...state.requestingPlayers, name],
          confirmedPlayers: state.confirmedPlayers.filter((cName) => cName != name)
        }
      })
    }
  }

  basicPlayerCard = (name, id) => {
    return (<div key={id} onClick={this.changeColumn.bind(this,name)}>{name}</div>);
  }

  render() {
    return (
      <div style={{backgroundColor: 'red'}}>
        <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '20px'}}>Type <b>!caniplay</b> if you want to join this game of <b>{this.props.gameName}</b></p>
        <div style={{margin: '0px 15px 7px', height: "500px", padding: '4px', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{backgroundColor: 'blue', width: '50%', height: '100%', margin: '5px'}}>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Requesting players</p>
            {this.state.requestingPlayers.map((player, i) => this.basicPlayerCard(player) )}
          </div>
          <div style={{backgroundColor: 'green', width: '50%', height: '100%', margin: '5px'}}>
            <p style={{marginTop: '0', paddingTop: '10px', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>Confirmed players</p>
            {this.state.confirmedPlayers.map((player, i) => this.basicPlayerCard(player) )}
          </div>
        </div>
      </div>
    );
  }
}
