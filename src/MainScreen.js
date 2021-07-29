import { Component } from 'react';
import WheelComponent from 'react-wheel-of-prizes'
import GameRequest from './GameRequest'
import MessageHandler from './MessageHandler';
import Sidebar from './Sidebar'
import PlayerSelect from './PlayerSelect';
import ChatActivity, { ActivityStatus } from './ChatActivity';

import './MainScreen.css';
const randomColor = require('randomcolor');


export default class MainScreen extends Component {
    constructor(props){
        super(props);
        this.chatActivity = new ChatActivity(this.props.channel)
        this.state = {
            messages: {},
            colors: randomColor({count: 99, luminosity: 'light', hue: 'blue'}),
            counter: 0,
            history: [],
            nextGameIdx: 0,
            showPlayerSelect: false
        };

        this.playerSelector = null;
        this.messageHandler = null;

        this.changeNextGameIdx = this.changeNextGameIdx.bind(this);
        this.moveNextGameFwd = this.moveNextGameFwd.bind(this);
        this.moveNextGameBack = this.moveNextGameBack.bind(this);
        this.addGameRequest = this.addGameRequest.bind(this);
        this.toggleLock = this.toggleLock.bind(this);
        this.setNextGame = this.setNextGame.bind(this);
        this.addGameToQueue = this.addGameToQueue.bind(this);
        this.onWheelSpun = this.onWheelSpun.bind(this);
        this.removeGame = this.removeGame.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.togglePlayerSelect = this.togglePlayerSelect.bind(this);
        this.routePlayRequest = this.routePlayRequest.bind(this);
        this.routeLeaveRequest = this.routeLeaveRequest.bind(this);
        this.routeOpenQueueRequest = this.routeOpenQueueRequest.bind(this);
        this.routeCloseQueueRequest = this.routeCloseQueueRequest.bind(this);
        this.routeClearQueueRequest = this.routeClearQueueRequest.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setMessageHandlerRef = this.setMessageHandlerRef.bind(this);
        this.setPlayerSelectRef = this.setPlayerSelectRef.bind(this);
    }

    changeNextGameIdx = (delta = 1) => {
        if (this.state.nextGameIdx + delta > this.state.history.length) return false;
        if (this.state.nextGameIdx + delta < 0) return false;
        this.setState((state) => {
            return {
                ...this.state,
                nextGameIdx: state.nextGameIdx + delta
            }
        });
        return true;
    }

    moveNextGameFwd = () => {
        return this.changeNextGameIdx();
    }

    moveNextGameBack = () => {
        return this.changeNextGameIdx(-1);
    }

    addGameRequest = (gameObj, user) => {
        this.setState((state) => {
            return {
                ...state,
                messages: {
                    ...this.state.messages,
                    [gameObj.longName]: {
                        ...gameObj,
                        username: user,
                        time: Date.now(),
                        locked: false,
                        chosen: false
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

    // @return: the number of games ahead of this one, after successfully inserting in queue
    // (i.e. if it's the very next game, return 0; if there's one ahead, return 1; etc)
    setNextGame = (gameObj) => {
        let idx = this.state.nextGameIdx;

        // insert next game at next up position by default, but
        //      *after* any other manually inserted games
        while (idx < this.state.history.length && this.state.history[idx]?.override) {
            idx++;
        }

        this.setState((state) => {
            return {
                ...state,
                history: [
                    ...state.history.slice(0, Math.max(0, idx)),
                    {
                        ...gameObj,
                        override: true
                    },
                    ...state.history.slice(idx)
                ]
            }
        });

        return idx - this.state.nextGameIdx;
    }

    addGameToQueue = (gameObj) => {
        // update history + game card highlight color
        this.setState((state) => {
            return {
                ...state,
                history: [
                    ...this.state.history,
                    {
                        ...gameObj,
                        override: false
                    }
                ],
                messages: {
                    ...state.messages,
                    [gameObj.longName]: {
                        ...state.messages[gameObj.longName],
                        chosen: true
                    }
                }
            }
        })
    }

    onWheelSpun = (gameLongName) => {
        const gameRequestObj = this.state.messages?.[gameLongName];
        if (!gameRequestObj) return;

        // send confirmation message in chat
        const requester = gameRequestObj.username;

        this.addGameToQueue(gameRequestObj);

        // remove card unless it's locked
        if (!this.state.messages[gameLongName].locked) {
            setTimeout(() => {
                this.removeGame(gameLongName);
            }, 2500);
        }

        return this.chatActivity.getStatusPromise(requester).then((status) => {
            let msg = "";
            switch(status) {
                case ActivityStatus.DISCONNECTED:
                    msg = `/me ${gameRequestObj.name} just won the spin, but it doesn't seem like @${requester} is still around. Hope someone else wants to play!`
                    break;

                case ActivityStatus.ACTIVE:
                    msg = `/me @${requester}, good news - ${gameRequestObj.name} just won the spin!`;
                    break;

                case ActivityStatus.IDLE:
                default:
                    msg = `/me @${requester}, good news - ${gameRequestObj.name} just won the spin! (I hope you're still around!)`;
            }
            return this.messageHandler.sendMessage(msg);
        })

    }

    removeGame = (gameLongName) => {
        const newMessageObj = {...this.state.messages};
        delete newMessageObj[gameLongName];
        this.setState((state) => {
            return {
                ...state,
                messages: newMessageObj,
                counter: this.state.counter + 1
            };
        })
    }

    onMessage = (message, user, metadata) => {
        this.chatActivity.updateLastMessageTime(user);
    }

    togglePlayerSelect = () => {
        this.setState((state) => {
            return {
                ...state,
                showPlayerSelect: !state.showPlayerSelect
            }
        })
    }

    routePlayRequest = (user, {sendConfirmationMsg = true, isPrioritySeat = false}) => {
        const msg = this.state.showPlayerSelect
            ? this.playerSelector?.handleNewPlayerRequest(user, {isPrioritySeat})
            : 'sign-ups are currently closed; try again after this game wraps up!'

        if (sendConfirmationMsg) {
            this.messageHandler?.sendMessage(`/me @${user}, ${msg}`);
        }
    }

    routeLeaveRequest = (user) => {
        this.playerSelector?.removeUser(user);
    }

    routeOpenQueueRequest = () => {
        this.setState((state) => {
            return {
                ...state,
                showPlayerSelect: true
            }
        })
        this.playerSelector?.openQueue();
    }

    routeCloseQueueRequest = () => {
        this.playerSelector?.closeQueue();
    }

    routeClearQueueRequest = () => {
        this.playerSelector?.clearQueue();
    }

    startGame = () => {
        // I know this is a big ol' React sin, but I can't for the life of me
        //   figure out why this.togglePlayerSelect() isn't working... sooo...
        if (this.state.showPlayerSelect) {
            this.state.showPlayerSelect = false;
            this.moveNextGameFwd();
            return true;
        }
        return false;
    }

    setMessageHandlerRef = (ps) => {
        this.messageHandler = ps;
    };

    setPlayerSelectRef = (mh) => {
        this.playerSelector = mh;
    };

    render() {
        const gameRequestArray = Object.keys(this.state.messages);

        let logOutBtn;
        if (typeof this.props.onLogout === 'function') {
            logOutBtn = (
                <button className="logout" onClick={this.props.onLogout}>Logout &#10151;</button>
            );
        }

        let mainClassName = this.state.showPlayerSelect ? 'player-select' : 'game-select';

        let subheading = this.state.showPlayerSelect ? (
            <span className="subheading-player">
                Type <b>!new</b> in {this.props.channel}'s chat if you want to join the next game
            </span>
        ) : (
            <span className="subheading-game">
                Type e.g. <b>"!request Blather Round"</b> in {this.props.channel}'s chat to add
            </span>
        );

        let innerContent;
        let rightColumn;

        if (this.state.showPlayerSelect) {
            innerContent = (
                <PlayerSelect
                    game={this.state.history?.[this.state.nextGameIdx]}
                    startGame={this.startGame}
                    ref={this.setPlayerSelectRef}
                />
            );
        } else {
            innerContent = gameRequestArray.map((gameName, i) =>
                <GameRequest
                    key={i}
                    gameName={gameName}
                    metadata={this.state.messages[gameName]}
                    onDelete={this.removeGame}
                    toggleLock={this.toggleLock.bind(gameName)}
                    getActivity={this.chatActivity.getStatusPromise}
                />
            );
            rightColumn = (
                <div className="right-column" width="50px">
                    <div className="wheel-wrapper">
                         <WheelComponent
                            key={this.state.counter}
                            segments={gameRequestArray}
                            segColors={this.state.colors}
                            onFinished={this.onWheelSpun}
                            isOnlyOnce={false}
                            size={250}
                            upDuration={100}
                            downDuration={1000}
                            primaryColor={"white"}
                            contrastColor={"black"}
                            fontFamily={"Arial"}
                        />
                    </div>
                </div>
            );
        }


        return (
            <div id="main-screen" className={mainClassName}>
                <MessageHandler
                    addGameRequest={this.addGameRequest}
                    setNextGame={this.setNextGame}
                    changeNextGameIdx={this.changeNextGameIdx}
                    startGame={this.startGame}
                    messages={this.state.messages}
                    channel={this.props.channel}
                    modList={this.props.modList}
                    access_token={this.props.access_token}
                    onMessage={this.onMessage}
                    onDelete={this.removeGame}
                    upcomingGames={this.state.history.slice(this.state.nextGameIdx)}
                    caniplayHandler={this.routePlayRequest}
                    playerExitHandler={this.routeLeaveRequest}
                    openQueueHandler={this.routeOpenQueueRequest}
                    closeQueueHandler={this.routeCloseQueueRequest}
                    clearQueueHandler={this.routeClearQueueRequest}
                    ref={this.setMessageHandlerRef}
                />
                <div className="left-column">
                    <h2>{this.state.showPlayerSelect ? 'Seat Requests' : 'Game Requests'}</h2>
                    <h4>{subheading}</h4>
                    <div className="left-column-body">
                        <Sidebar
                            history={this.state.history}
                            nextGameIdx={this.state.nextGameIdx}
                            changeNextGameIdx={this.changeNextGameIdx}
                            moveNextGameFwd={this.moveNextGameFwd}
                            moveNextGameBack={this.moveNextGameBack}
                            togglePlayerSelect={this.togglePlayerSelect}
                            requestMode={this.state.showPlayerSelect ? 'seat' : 'game'}
                        />
                        <div className="left-column-inner-body">
                            {innerContent}
                        </div>
                    </div>
                </div>
                {rightColumn}
                {logOutBtn}
            </div>
        )
    }
}
