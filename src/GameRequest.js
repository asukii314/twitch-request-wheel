import {ActivityStatus} from './ChatActivity';
import {Component} from 'react';
import './GameRequest.css';
import ReactTooltip from 'react-tooltip'
import lock from './lock.svg';

export default class GameRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeDiff: 0,
            activityStatus: null
        };

        this.deleteRequest = this.deleteRequest.bind(this);
        this.getFormattedTimeDiff = this.getFormattedTimeDiff.bind(this);
        this.getTooltipContents = this.getTooltipContents.bind(this);
        this.toggleLock = this.toggleLock.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    deleteRequest = (e) => {
        this.props.onDelete(this.props.gameName)
    }

    getFormattedTimeDiff = (timestamp) => {
        let unit = "minute";
        let timeDiff = Math.floor((Date.now() - timestamp) / 60000);
        if (timeDiff === 0) {
            return "just now";
        }
        if (timeDiff >= 60) {
            unit = "hour";
            timeDiff = Math.floor(timeDiff / 60);

            if (timeDiff >= 24) {
                unit = "day";
                timeDiff = Math.floor(timeDiff / 24);
            }
        }
        return `${timeDiff} ${unit}${timeDiff === 1 ? "" : "s"} ago`;
    }

    getTooltipContents = () => {
        let statusClass = "";
        switch (this.state.activityStatus) {
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
                // no data back yet; don't show an activity status indicator at all
                break;
        }

        return (`
            <div class="tooltip">
                <p class="tooltipText">
                    Requested ${this.state.timeDiff} by ${this.props.metadata.username}
                </p>
                <div class="status ${statusClass}" />
            </div>`
        );
    }

    toggleLock = () => {
        this.props.toggleLock(this.props.gameName)
    }

    updateStatus = () => {
        // return Date.now();
        this.props.getActivity(this.props.metadata.username).then((activityStatus) => {
            this.setState(() => {
                return {
                    ...this.state,
                    timeDiff: this.getFormattedTimeDiff(this.props.metadata.time),
                    activityStatus
                };
            });
        })
    }

    render() {
        const lockClassName = this.props.metadata.locked ? 'lock locked' : 'lock unlocked';
        const cardStatus = this.props.metadata.chosen ? 'chosen' : 'pending';

        return (
            <div className="game-request-wrapper">
            	<ReactTooltip effect="solid" place="right" />
            	<div id="baseDiv"
            		className={`game-request ${cardStatus}`}
            		data-tip={this.getTooltipContents()}
            		data-html={true}
            		onMouseEnter={this.updateStatus}
            	>
            		<div className="game-request-body">
            		    {this.props.gameName}
            			<div className="options">
            				<img src={lock} alt="lock" className={lockClassName} onClick={this.toggleLock} />
            				<button type='button' className="deleteButton" onClick={this.deleteRequest}>X</button>
            			</div>
            		</div>
            	</div>
            </div>
        );
    }
}
