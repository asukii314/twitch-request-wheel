import { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import { ActivityStatus } from './ChatActivity';
import './messageStyles.css';
import lock from './lock.svg';

export default class GameRequest extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeDiff: 0,
      activityStatus: null
    };
  }

  updateStatus = () => {
    // return Date.now();
    this.props.getActivity(this.props.metadata.username).then((activityStatus) => {
      this.setState(() => {
        return {
          ...this.state,
          timeDiff: `${Math.floor((Date.now()-this.props.metadata.time)/60000)} minutes ago`,
          activityStatus
        };
      });
    })
  }
  delete = (e) => {
    this.props.onDelete(this.props.msg)
  }

  toggleLock = () => {
    this.props.toggleLock(this.props.msg)
  }

  getTooltipContents = () => {
    let statusClass = "";
    switch(this.state.activityStatus) {
      case ActivityStatus.ACTIVE:
        statusClass = "active";
        break;
      case ActivityStatus.IDLE:
        statusClass = "idle";
        break;
      case ActivityStatus.DISCONNECTED:
        statusClass = "disconnected";
        break;
      default:
        break;
    }

    return (`
      <div class="tooltip">
        <p class="tooltipText">Requested ${this.state.timeDiff} by ${this.props.metadata.username}</p>
        <div class="status ${statusClass}" />
      </div>`);
  }

  render() {
    const lockOpacity = this.props.metadata.locked ? '1' : '0.2';
    return (
      <div>
      <ReactTooltip effect="solid" place="right"/>
      <div
        id="baseDiv"
        data-tip={this.getTooltipContents()}
        data-html={true}
        style={{
          backgroundColor:'steelblue',
          textAlign: 'left',
          borderRadius: '8px',
          textTransform: 'capitalize'
        }}
        onMouseEnter={this.updateStatus}
      >
      <div style={{margin: '0px 15px 7px', padding: '4px', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {this.props.msg}
        <div style={{display:'flex'}}>
          <img src={lock} alt="lock" style={{width: '16px', opacity: lockOpacity, paddingRight: '8px'}} className="lock" onClick={this.toggleLock} />
          <button type='button' className="deleteButton" onClick={this.delete}>X</button>
        </div>
      </div>
      </div>
      </div>
    );
  }
}
