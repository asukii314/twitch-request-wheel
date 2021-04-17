import { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import './messageStyles.css';
import lock from './lock.svg';

export default class GameRequest extends Component {
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
          <img src={lock} alt="lock" style={{width: '16px', opacity: lockOpacity, paddingRight: '8px'}} className="lock" onClick={this.toggleLock} />
          <button type='button' className="deleteButton" onClick={this.delete}>X</button>
        </div>
      </p>
      </div>
      </div>
    );
  }
}
