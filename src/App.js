import React from 'react';
import TreasureHunters from './treasure-hunters';
import { SCREENS, DEFAULT_PLAYERS, GAME_SETUPS } from './constants';
import { DisplayScreenContext } from "./display-screen-context";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.defaults = {
          screens: SCREENS,
        }

        this.settings = Object.assign({}, this.defaults, this.props);

        this.state = {
          displayScreen: this.defaults.screens.mainMenu,
          setDisplayScreen: this._setDisplayScreen,
          displayResults: false,
          setDisplayResults: this._setDisplayResults,
          playersArray: [DEFAULT_PLAYERS[0]],//[{ playerId: 0, playerName: "", row: 0, col: 3, computer: false, playerClass: "player1", score: 0, boatImage: "ship_brown", resultText: "" }],
          setPlayers: this._setPlayers,
          gameSettings: GAME_SETUPS.small.value,
          setGameSettings: this._setGameSettings,
        }
    }

    _setDisplayResults = (vars) => {
      this.setState(state => ({
        displayResults: vars
      }));
    }

    _setDisplayScreen = (vars) => {
      this.setState(state => ({
        displayScreen: vars
      }));
    };

    _setPlayers = (vars) => {
      this.setState(state => ({
        playersArray: vars ? vars.slice() : vars
      }));
    };

    _setGameSettings = (vars) => {
      this.setState(state => ({
        gameSettings: vars
      }));
    };
    
    render(){
        return (
            <DisplayScreenContext.Provider value={this.state}>
              <TreasureHunters />
            </DisplayScreenContext.Provider>
        )
    } 
}

export default App;