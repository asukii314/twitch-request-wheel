import { Component } from 'react';

import './Sidebar.css';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }

        this.getHistoryList = this.getHistoryList.bind(this);
        this.getNextGameName = this.getNextGameName.bind(this);
        this.getNextGamePartyPack = this.getNextGamePartyPack.bind(this);
        this.hasNextGame = this.hasNextGame.bind(this);
        this.moveNextGameBack = this.moveNextGameBack.bind(this);
        this.moveNextGameFwd = this.moveNextGameFwd.bind(this);
        this.printGame = this.printGame.bind(this);
    }

    getHistoryList = (history) => {
        if (history.length === 0) {
            return (
                <li key='placeholder'>No games yet</li>
            );
        }
        return history.map((playedGame, i) => (
            <li key={i}>
                {this.printGame(i)}
            </li>
        ));
    }

    getNextGameName = () => {
        return this.hasNextGame()
            ? this.props.history[this.props.nextGameIdx].name
            : 'not yet decided';
    }

    getNextGamePartyPack = () => {
        return this.hasNextGame()
            ? this.props.history[this.props.nextGameIdx].partyPack
            : null;
    }

    hasNextGame = () => {
        return this.props.history.length > this.props.nextGameIdx;
    }

    moveNextGameFwd = () => {
        return this.props.changeNextGameIdx(1);
    }

    moveNextGameBack = () => {
        return this.props.changeNextGameIdx(-1);
    }

    printGame = (idx) => {
        if (idx === this.props.nextGameIdx) {
            return (
                <b>{this.props.history[idx].name}</b>
            );
        }
        return this.props.history[idx].name;
    }

    render() {
        let nextGame = this.hasNextGame();

        let buttonPlayerSelect;
        switch (this.props.requestMode) {
            case 'game':
                buttonPlayerSelect = (
                    <button className="open-seat-requests" disabled={!nextGame} onClick={this.props.togglePlayerSelect}>
                        OPEN SEAT REQUESTS
                    </button>
                )
                break;
            case 'seat':
                buttonPlayerSelect = (
                    <button className="return-to-wheel" onClick={this.props.togglePlayerSelect}>
                        RETURN TO WHEEL
                    </button>
                )
                break;
            default:
                break;
        }

        return (
            <div id="sidebar" className={this.props.requestMode}>
                <div className="sidebar-panel">
                    <div className="p sidebar-panel-up-next"> Up Next:

                        <p className="next-game-name">
                            {this.getNextGameName()}
                        </p>

                        <p className="next-game-party-pack">
                            <i>{this.getNextGamePartyPack()}</i>
                        </p>

                        {buttonPlayerSelect}
                    </div>
                </div>

                <div className="nav-wrapper">
                    <button className="move-next-game-back" onClick={this.moveNextGameBack}> &#8678; </button>
                    <button className="move-next-game-fwd" onClick={this.moveNextGameFwd}> &#8680; </button>
                </div>

                <div className="sidebar-panel">
                    <p className="sidebar-panel-history"> History </p>
                    <p className="sidebar-panel-history-list">
                        {this.getHistoryList(this.props.history)}
                    </p>
                </div>
            </div>
        );
    }
}
