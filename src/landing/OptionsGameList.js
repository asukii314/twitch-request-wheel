import {Component} from 'react';
import {Accordion} from 'react-bootstrap';
import YAML from 'yaml'
import rawJackboxGameList from '../JackboxGames.yaml';
import './OptionsGameList.css';
const fetch = require('node-fetch');

class OptionsGameList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowedGames: [],
            validGames: []
        };
    }

    componentDidMount(props) {
        fetch(rawJackboxGameList)
            .then(r => r.text())
            .then(text => {
                let validGames = YAML.parse(text);
                // this.setState({validGames});
                this.setAllowedGames(validGames);
            });
    }

    componentDidUpdate() {
        if (!this.state.allowedGames || this.state.validGames.length === 0 || this.state.allowedGames.length === 0) return;
        localStorage.setItem('__allowedGames', JSON.stringify(this.state.allowedGames));
    }

    getAllowedGames = function(validGames) {
        let __allowedGames = localStorage.getItem('__allowedGames');
        let allowedGames = (__allowedGames) ? JSON.parse(__allowedGames) : {};


        // let output = {};
        //
        // // return list of valid games merged with existing allowedGames
        // Object.entries(validGames).forEach(([pack, packGames]) => {
        //     // get valid games within each pack
        //     Object.keys(packGames).forEach(game => {
        //         let gameId = `${pack} ${game}`.replace(/\W/ig, '_');
        //         output[gameId] = (allowedGames[gameId])
        //             ? allowedGames[gameId]
        //             : {
        //                 id: gameId,
        //                 game,
        //                 pack,
        //                 enabled: true
        //             };
        //         output[gameId] = allowedGames[gameId];
        //     });
        // });
        // return output;

        // return list of valid games merged with existing allowedGames
        return Object.assign({},
            ...[].concat(
                ...Object.entries(validGames).map(([pack, packGames]) => {
                    // get valid games within each pack
                    return Object.assign({},
                        ...Object.keys(packGames).map(game => {
                            let gameId = `${pack} ${game}`.replace(/\W/ig, '_');
                            if (gameId in allowedGames && allowedGames[gameId].id !== undefined) {
                                return {
                                    [gameId]: allowedGames[gameId]
                                };
                            }
                            // add entry with default value
                            // console.log(`Adding ${gameId}`);
                            return {
                                [gameId]: {
                                    id: gameId,
                                    game,
                                    pack,
                                    enabled: true
                                }
                            }
                        })
                    );
                })
            )
        )
    }

    setAllowedGames = function(validGames) {
        let allowedGames = this.getAllowedGames(validGames);
        this.setState({
            allowedGames,
            validGames
        });
        localStorage.setItem('__allowedGames', JSON.stringify(allowedGames));
    }

    onCheckHandler = ({target}) => {
        let {id, checked} = target;
        this.setState((prevState) => ({
            allowedGames: {
                ...prevState.allowedGames,
                [id]: {
                    ...prevState.allowedGames[id],
                    enabled: checked
                }
            }
        }));
    }

    onGroupCheckHandler = ({target}) => {
        let {value, checked} = target;
        // console.log({value, checked});
        let packGames = Object.values(this.state.allowedGames).filter(game => game.pack === value);
        this.setState((prevState) => ({
            allowedGames: {
                ...prevState.allowedGames,
                ...Object.assign(
                    ...packGames.map(g => ({
                        [g.id]: {
                            ...g,
                            enabled: checked
                        }
                    })
                ))
            }
        }));
    }

    renderGameCard = function(props) {
        let {id, game, pack} = props;
        let {allowedGames} = this.state;
        let checked = allowedGames[id]?.enabled || false;
        return (
            <li className="gameName" key={id}>
                <input type="checkbox" id={id} name={id} value={id} checked={checked} onChange={this.onCheckHandler} />
                {' '}
                <label htmlFor={id} title={`${pack}: ${game}`}>
                    {game}
                </label>
            </li>
        );
    }

    renderPackCheckbox = function(pack) {
        let packGames = Object.values(this.state.allowedGames).filter(game => game.pack === pack);
        let isChecked = packGames.filter(g => g.enabled === true).length === packGames.length;
        return (
            <input type="checkbox" id={pack} name={pack} value={pack} checked={isChecked} onChange={this.onGroupCheckHandler} />
        );
    }

    renderPartyPack = function (props) {
        const gameList = Object.keys(props.metadata);

        let packGames = Object.values(this.state.allowedGames).filter(game => game.pack === props.partyPackName);
        let gamesEnabled = packGames.filter(g => g.enabled === true)
        let isChecked = gamesEnabled.length === packGames.length;
        let isIndeterminate = (!isChecked && gamesEnabled.length !== 0)
        return (
            <Accordion.Item eventKey={props.key} className="party-pack-card" key={props.key}>
                <Accordion.Header className="bg-darker text-white">
                    {props.partyPackName}
                </Accordion.Header>
                <Accordion.Body>
                    <div className="float-end">
                        <small>Select All</small>
                        {` `}
                        <input type="checkbox" id={props.partyPackName} name={props.partyPackName} value={props.partyPackName} checked={isChecked} onChange={this.onGroupCheckHandler} ref={el => el && (el.indeterminate = isIndeterminate)} />
                    </div>
                    <ul className="party-pack-game-list">
                        {gameList.map(
                            (gameName, i) => this.renderGameCard({
                                game: gameName,
                                id: `${props.partyPackName} ${gameName}`.replace(/\W/ig, '_'),
                                pack: props.partyPackName
                            })
                        )}
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    render() {
        let {validGames} = this.state;
        const partyPackList = Object.keys(validGames);

        return (
            <Accordion id="options-game-list" className="accordion-dark" flush>
                {partyPackList.map(
                    (partyPackName, i) => this.renderPartyPack({
                        key: i,
                        partyPackName,
                        metadata: this.state.validGames[partyPackName]
                    })
                )}
            </Accordion>
        );
    }

}
export default OptionsGameList;
