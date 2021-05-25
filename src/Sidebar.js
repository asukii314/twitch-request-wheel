import { Component } from 'react';

export default class Sidebar extends Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0
    }
  }

  printGame = (idx) => {
    if(idx === this.props.nextGameIdx) {
      return (<b style={{color:'aquamarine'}}>{this.props.history[idx].name}</b>)
    } else {
      return this.props.history[idx].name
    }
  }

  hasNextGame = () => {
    return this.props.history.length > this.props.nextGameIdx;
  }

  getNextGameName = () => {
    return this.hasNextGame()
      ? this.props.history[this.props.nextGameIdx].name
      : "not yet decided"
  }

  getNextGamePartyPack = () => {
    return this.hasNextGame()
      ? this.props.history[this.props.nextGameIdx].partyPack
      : null
  }


  render() {
    return (
      <div style={{marginLeft: "12px", width: "33%", textTransform: 'capitalize'}}>
        <div style={{backgroundColor: "darkslategrey", borderRadius: "5px", marginTop: 0, padding: '1px', marginBottom: '10px'}}>
          <p style={{fontSize: "14px", fontWeight: "700", height: '125px', padding: '8px'}}> Up Next:
            <p style={{marginBottom: '5px'}}>{this.getNextGameName()}</p>
            <p style={{fontSize: "11px", fontWeight: "400", marginTop: '0px', color: "lightgray"}}><i>{this.getNextGamePartyPack()}</i></p>
            <button disabled={!this.hasNextGame()} onClick={this.props.selectPlayers} style={{fontSize: "12px", padding: "5px", backgroundColor: "aquamarine", color: "black", borderRadius: "5px", width: "90%"}}>
              {this.hasNextGame()
                  ? <b>SELECT PLAYERS</b>
                  : <i style={{color: "gray"}}>SELECT PLAYERS</i>}
            </button>
          </p>
        </div>

        <div style={{display: "flex", justifyContent: "space-between"}}>
          <button onClick={this.props.moveNextGameBack} style={{backgroundColor: "darkcyan", borderRadius: "5px", marginTop: 0, width: "50%", marginBottom: '20px', marginRight: '5px'}}> &#8678; </button>
          <button onClick={this.props.moveNextGameFwd} style={{backgroundColor: "darkcyan", borderRadius: "5px", marginTop: 0, width: "50%", marginBottom: '20px', marginLeft: '5px'}}> &#8680; </button>
        </div>

        <div style={{backgroundColor: "darkslategrey", borderRadius: "5px", marginTop: 0, padding: '5px'}}>
          <p style={{fontSize: "14px", fontWeight: "700"}}> History </p>
          <p style={{fontSize: "12px"}}>
            {this.props.history.map((playedGame, i) => <li key={i}>{this.printGame(i)}</li> )}
            {this.props.history.length === 0 && <li key='0'>No games yet</li> }
          </p>
        </div>
      </div>
    )
  }
}
