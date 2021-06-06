import React from 'react';
import TreasureHunters from './treasure-hunters';
import { SCREENS, DEFAULT_PLAYERS, DEFAULT_PLAYERS_DEBUG, GAME_SETUPS } from './constants';
import { DisplayScreenContext } from "./display-screen-context";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.defaults = {
          defaultScreen: SCREENS.mainMenu,
          defaultPlayerArray: [DEFAULT_PLAYERS[0]],
          defaultGameSetup: GAME_SETUPS.small.name,
          //Used for testing the computer player
          //defaultScreen: SCREENS.gameBoard,
          //defaultPlayerArray: DEFAULT_PLAYERS_DEBUG,
        }

        this.settings = Object.assign({}, this.defaults, this.props);

        this.state = {
          displayScreen:    this.settings.defaultScreen,
          setDisplayScreen: this._setDisplayScreen,
          displayResults:   false,
          setDisplayResults: this._setDisplayResults,
          playersArray:     this.settings.defaultPlayerArray,//[{ playerId: 0, playerName: "", row: 0, col: 3, computer: false, playerClass: "player1", score: 0, boatImage: "ship_brown", resultText: "" }],
          setPlayers:       this._setPlayers,
          gameSettings:     this.settings.defaultGameSetup,
          setGameSettings:  this._setGameSettings,
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