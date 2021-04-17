import { Component } from 'react';

export default class Sidebar extends Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0
    }
  }

  goForward = () => {
    if(this.state.index === this.props.history.length-1) return;
    this.setState((state) => {
      return {
        ...this.state,
        index: this.state.index+1
      }
    })
  }

  goBackward = () => {
    if(this.state.index <= 0) return;
    this.setState((state) => {
      return {
        ...this.state,
        index: this.state.index-1
      }
    })
  }

  printGame = (idx) => {
    if(idx === this.state.index) {
      return (<b style={{color:'aquamarine'}}>{this.props.history[idx]}</b>)
    } else {
      return this.props.history[idx]
    }
  }

  render() {
    return (
      <div style={{marginLeft: "12px", width: "33%", textTransform: 'capitalize'}}>
        <div style={{backgroundColor: "darkslategrey", borderRadius: "5px", marginTop: 0, padding: '1px', marginBottom: '10px'}}>
          <p style={{fontSize: "14px", fontWeight: "700", height: '70px', padding: '8px'}}> Up Next:
            {this.props.history.length > this.state.index && <p>{this.props.history[this.state.index]}</p> }
          </p>
        </div>

        <div style={{display: "flex", justifyContent: "space-between"}}>
          <button onClick={this.goBackward} style={{backgroundColor: "darkcyan", borderRadius: "5px", marginTop: 0, width: "50%", marginBottom: '20px', marginRight: '5px'}}> 🢠 </button>
          <button onClick={this.goForward} style={{backgroundColor: "darkcyan", borderRadius: "5px", marginTop: 0, width: "50%", marginBottom: '20px', marginLeft: '5px'}}> 🢡 </button>
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
