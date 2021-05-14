import { Component } from 'react';
import YAML from 'yaml'
import rawJackboxGameList from './JackboxGames.yaml';
import './JackboxGameList.css';
const fetch = require('node-fetch');

const PartyPackCard = function (props) {
  const gameList = Object.keys(props.metadata);
  return (
    <div className="partyPackCard">
      <p className="partyPackName">{props.partyPackName} </p>
      {gameList.map((gameName, i) =>
        <GameCard
          key={i}
          gameName={gameName}
          possibleMatches={props.metadata[gameName]}
        />
      )}
    </div>
  );
}


// <p> {props.gameName} <p>

const GameCard = function(props) {
  return (
    <div>
      <p className="gameName">{props.gameName} </p>
      {props.possibleMatches.map((possibleMatch, i) =>
        <li className="possibleGameMatch">!request {possibleMatch}</li>
      )}
    </div>
  );
}

export default class JackboxGameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validGames: []
    };
  }

  componentDidMount(props) {
    fetch(rawJackboxGameList)
      .then(r => r.text())
      .then(text => {
        this.setState((state) => {
          return {
            ...state,
            validGames: YAML.parse(text)
          };
        });
      })
    }



    render() {
      const partyPackList = Object.keys(this.state.validGames);
      return (
        <div className="partyPackList">
          {partyPackList.map((partyPackName, i) =>
            <PartyPackCard
              key={i}
              partyPackName={partyPackName}
              metadata={this.state.validGames[partyPackName]}
            />
          )}
        </div>
      );
    }

}
