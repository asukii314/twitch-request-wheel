import {Component} from 'react';
import {Collapse, Offcanvas} from 'react-bootstrap';
import OptionsGameList from './OptionsGameList';
import PropTypes from 'prop-types';
import {version} from '../../package.json';

import './OptionsMenu.css';

export default class OptionsMenu extends Component {
    static get propTypes() {
        return {
            gamesList: PropTypes.object,
            onHide: PropTypes.func,
            onLogout: PropTypes.func,
            showOptionsMenu: PropTypes.bool
        };
    }
    static get defaultProps() {
        return {
            gamesList: {
                allowedGames: null,
                validGames: null
            },
            onHide: () => void 0,
            onLogout: () => void 0,
            showOptionsMenu: false
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            showGameList: false
        }
        this.toggleGameList = this.toggleGameList.bind(this);
    }

    toggleGameList = () => {
        this.setState((state) => {
            return {
                showGameList: !state.showGameList
            }
        })
    }

    // renderGameOptions() {
    //     let {allowedGames, validGames} = this.props.gamesList;
    //     let gamePackList = [].concat(...Object.entries(validGames).map((packData, idx) => {
    //         return Object.keys(packData[1]).map(gameData => {
    //             let gameId = `${packData[0]} ${gameData}`.replace(/\W/ig, '_');
    //             return {
    //                 id: gameId,
    //                 game: gameData,
    //                 pack: packData[0]
    //             }
    //         })
    //     }))
    //
    //
    //
    //     // let gamesList = gamePackList.map(g => g.game);
    //     console.log('gamePackList:', gamePackList, allowedGames);
    //
    //     return (
    //         <Modal
    //             show={this.state.showOptionsModal}
    //             onHide={()=>this.toggleOptionsModal(false)}
    //             size="lg"
    //             aria-labelledby="contained-modal-title-vcenter"
    //             centered>
    //             <Modal.Header closeButton>
    //                 <Modal.Title id="contained-modal-title-vcenter">
    //                     Options
    //                 </Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <div className="options-list">
    //                     <ul>
    //                         {gamePackList.map(({id, game, pack}, idx) => {
    //                             // let gameId = `${g.pack} ${g.game}`.replace(/\W/ig, '_');
    //                             return (
    //                                 <li key={id}>
    //                                     <input type="checkbox" id={id} name={id} value={id} /> <label htmlFor={id}>{pack}: {game}</label>
    //                                 </li>
    //                             )}
    //                         )}
    //                     </ul>
    //                 </div>
    //             </Modal.Body>
    //             <Modal.Footer>
    //                 <Button data-bs-dismiss="modal">Close</Button>
    //             </Modal.Footer>
    //         </Modal>
    //     );
    // }

    render() {

        return (
            <Offcanvas
                id="options-menu"
                onHide={this.props.onHide}
                placement="end"
                show={this.props.showOptionsMenu}>
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title as="h2" className="fw-bold">
                        Options
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ul className="options-menu-items list-unstyled pb-3 px-4">
                        <li className="mb-1 fs-4 d-grid text-start">
                            <button className="btn logout" onClick={this.props.onLogout}>
                                Logout
                            </button>
                        </li>
                        <li className="mb-1 fs-4 d-grid text-start">
                            <button className="btn game-list" onClick={this.toggleGameList}>
                                Game List
                            </button>
                        </li>
                        <Collapse in={this.state.showGameList}>
                            <div>
                                <OptionsGameList
                                    allowedGames={this.props.gamesList?.allowedGames}
                                    validGames={this.props.gamesList?.validGames} />
                            </div>
                        </Collapse>
                    </ul>


                    <div className="position-absolute bottom-0 start-50 translate-middle-x pb-3">
                        <small>{`version ${version}`}</small>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        );
    }
}
