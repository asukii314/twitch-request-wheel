import {Component} from 'react';
import {Button, Modal} from 'react-bootstrap';
import ChatActivity, { ActivityStatus } from '../ChatActivity';
import ConfettiExplosion from '@reonomy/react-confetti-explosion';
import GameRequest from '../components/GameRequest'
import MessageHandler from '../MessageHandler';
import OptionsMenu from './OptionsMenu';
import PlayerSelect from '../components/PlayerSelect';
import Sidebar from './Sidebar'
import WheelComponent from '../WheelComponent'; //'react-wheel-of-prizes'
import * as fakeStates from '../example-states';

import './MainScreen.css';
// import 'bootstrap/dist/css/bootstrap.css';
const randomColor = require('randomcolor');


export default class MainScreen extends Component {
    constructor(props){
        super(props);
        this.chatActivity = new ChatActivity(this.props.channel)
        this.state = {
            gameSelected: null,
            messages: {},
            colors: randomColor({count: 99, luminosity: 'light', hue: 'blue'}),
            counter: 0,
            history: [],
            nextGameIdx: 0,
            showOptionsMenu: false,
            showOptionsModal: false,
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

    componentDidMount() {
        if (window.location.hash.indexOf('fakestate=true') !== -1) {
            if (window.location.hash.indexOf('playerselect=true') !== -1) {
                this.setState(
                    Object.assign({}, fakeStates.MainScreen, {
                        showPlayerSelect: true
                    })
                );
            } else {
                this.setState(fakeStates.MainScreen);
            }
        }
    }

    changeNextGameIdx = (delta = 1) => {
        if (this.state.nextGameIdx + delta > this.state.history.length) return false;
        if (this.state.nextGameIdx + delta < 0) return false;
        this.setState((state) => {
            return {
                nextGameIdx: state.nextGameIdx + delta
            }
        });
        return true;
    }

    changeGameOrder = (history, nextGameIdx) => {
        if (nextGameIdx > history.length) return false;
        this.setState({
            history,
            nextGameIdx
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
                        override: true,
                        time: Date.now()
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
                gameSelected: gameObj,
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
        });
    }

    clearModal = () => {
        this.setState({
            gameSelected: null
        });
    }

    getGamesList = () => {
        return {
            allowedGames: this.messageHandler?.state.allowedGames,
            validGames: this.messageHandler?.state.validGames
        }
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
                this.clearModal();
            }, 4000);
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

    toggleOptionsMenu = () => {
        this.setState((state) => {
            return {
                showOptionsMenu: !state.showOptionsMenu
            }
        })
    }

    toggleOptionsModal = (value=null) => {
        this.setState((state) => {
            return {
                showOptionsModal: (value===null) ? !state.showOptionsModal : value
            }
        })
    }

    togglePlayerSelect = () => {
        this.setState((state) => {
            return {
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
        if (this.state.showPlayerSelect) {
            this.togglePlayerSelect();
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

    renderGameChosenModal(gameObj) {
        let confettiProps = {
            force: 0.6,
            duration: 3500,
            particleCount: 100,
            floorHeight: Math.max(window.outerWidth, window.outerHeight),
            floorWidth: Math.max(window.outerWidth, window.outerHeight)
        };
        let requestedBy;
        if (gameObj.username) {
            requestedBy = (<h4>requested by @{gameObj.username}</h4>);
        }
        return (
            <>
                <div className="overlay fade-in-out">
                    <div className="confetti-wrapper">
                        <ConfettiExplosion {...confettiProps} />
                    </div>
                </div>
                <div className="confetti-modal modal-game-chosen fade-in-out" onClick={()=>this.removeGame(gameObj.longName)}>
                    <h1>{gameObj.name}</h1>
                    {requestedBy}
                </div>
            </>
        );
    }

    renderOptionsModal() {
        let {allowedGames, validGames} = this.messageHandler.state;
        let gamePackList = [].concat(...Object.entries(validGames).map((packData, idx) => {
            return Object.keys(packData[1]).map(gameData => {
                let gameId = `${packData[0]} ${gameData}`.replace(/\W/ig, '_');
                return {
                    id: gameId,
                    game: gameData,
                    pack: packData[0]
                }
            })
        }))
        // let gamesList = gamePackList.map(g => g.game);
        console.log('gamePackList:', gamePackList, allowedGames);

        return (
            <Modal
                show={this.state.showOptionsModal}
                onHide={()=>this.toggleOptionsModal(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Options
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="options-list">
                        <ul>
                            {gamePackList.map(({id, game, pack}, idx) => {
                                // let gameId = `${g.pack} ${g.game}`.replace(/\W/ig, '_');
                                return (
                                    <li key={id}>
                                        <input type="checkbox" id={id} name={id} value={id} /> <label htmlFor={id}>{pack}: {game}</label>
                                    </li>
                                )}
                            )}
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button data-bs-dismiss="modal">Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const gameRequestArray = Object.keys(this.state.messages);


        let gameSelectedModal;
        if (this.state.showOptionsModal) {
            gameSelectedModal = this.renderOptionsModal();
        } else if (this.state.gameSelected) {
            gameSelectedModal = this.renderGameChosenModal(this.state.gameSelected);
        }

        let mainClassName = this.state.showPlayerSelect ? 'player-select' : 'game-select';

        let subheading = this.state.showPlayerSelect ? (
            <span className="subheading-player fade-in-delay">
                Type <b>!new</b> in {this.props.channel}'s chat if you want to join the next game
            </span>
        ) : (
            <span className="subheading-game fade-in-delay">
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
                    <div className="wheel-wrapper fade-in">
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
                            multilineDelimiter={' ('}
                        />
                    </div>
                </div>
            );
        }

        let gamesList = this.getGamesList();

        return (
            <div id="main-screen" className={mainClassName}>
                <nav className="main-screen-nav navbar-dark">
                    <button className="btn btn-toggle-options float-end navbar-toggler" type="button" onClick={this.toggleOptionsMenu}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </nav>
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
                <div className="left-column fade-in">

                    <h1>{this.state.showPlayerSelect ? 'Seat Requests' : 'Game Requests'}</h1>
                    <h4>{subheading}</h4>

                    <div className="left-column-body">
                        <Sidebar
                            changeGameOrder={this.changeGameOrder}
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
                {gameSelectedModal}
                <OptionsMenu
                    gamesList={gamesList}
                    onHide={this.toggleOptionsMenu}
                    onLogout={this.props.onLogout}
                    showOptionsMenu={this.state.showOptionsMenu} />
            </div>
        )
    }
}
