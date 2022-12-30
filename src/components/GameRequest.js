import {ActivityStatus} from '../ChatActivity';
import React, {Component} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import lock from '../images/lock.svg';

import './GameRequest.css';

class GameRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeDiff: 0,
            activityStatus: null
        };

        this.deleteRequest = this.deleteRequest.bind(this);
        this.getFormattedTimeDiff = this.getFormattedTimeDiff.bind(this);
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
    };

    getTooltipContent = (props) => (
        <Tooltip id="game-request-tooltip" {...props}>
            <span className="tooltipText">
                Requested {this.state.timeDiff} by {this.props.metadata.username}
                <span className={`status ${this.getTooltipActivityStatusClassName()}`} />
            </span>
        </Tooltip>
    );

    getTooltipActivityStatusClassName = () => {
        switch (this.state.activityStatus) {
            case ActivityStatus.ACTIVE:
                return "active";
            case ActivityStatus.IDLE:
                return "idle";
            case ActivityStatus.DISCONNECTED:
                return "disconnected";
            default:
                // no data back yet; don't show an activity status indicator at all
                return '';
        }
    }

    toggleLock = () => {
        return this.props.toggleLock(this.props.gameName);
    }

    updateStatus = async () => {
        // return Date.now();
        let activityStatus;
        try {
            activityStatus = await this.props.getActivity(this.props.metadata.username);
            return this.setState({
                timeDiff: this.getFormattedTimeDiff(this.props.metadata.time),
                activityStatus
            });
        } catch(err) {
            throw err;
        }
    }

    render() {
        const lockClassName = this.props.metadata.locked ? 'lock locked' : 'lock unlocked';
        const cardStatus = this.props.metadata.chosen ? 'chosen' : 'pending';

        return (
            <OverlayTrigger
                placement="left"
                overlay={this.getTooltipContent}
                onEnter={this.updateStatus}>
                <div className="game-request-wrapper fade-in">
                	<div id="baseDiv" className={`game-request ${cardStatus}`}>
                		<div className="game-request-body">
                		    <div className="text-truncate">
                                <b>
                                    {this.props.metadata.name}
                                </b>
                                {' '}
                                <small>
                                    {
                                        !!this.props.metadata.partyPack &&
                                        `(${this.props.metadata.partyPack.replace('Party Pack', 'Pack')})`
                                    }
                                </small>
                            </div>
                			<div className="options">
                				<img src={lock} alt="lock" className={lockClassName} onClick={this.toggleLock} />
                				<button type='button' className="deleteButton" onClick={this.deleteRequest}>X</button>
                			</div>
                		</div>
                	</div>
                </div>
            </OverlayTrigger>
        );
    }
}
export default GameRequest;
