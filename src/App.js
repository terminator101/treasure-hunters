import React from 'react';
import TreasureHunters from './treasure-hunters';
import { SCREENS, DEAFULT_PLAYER_NAME } from './constants';
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
          playersArray: [{ playerId: 0, playerName: DEAFULT_PLAYER_NAME, row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human", boatImage: "ship_brown" }],
          setPlayers: this._setPlayers,
        }
    }

    _setDisplayScreen = (vars) => {
        this.setState(state => ({
          displayScreen: vars
        }));
    };

    _setPlayers = (vars) => {
      this.setState(state => ({
        playersArray: vars
      }));
  };
    
    render(){
        return (
          <div className="container">
            <DisplayScreenContext.Provider value={this.state}>
              <TreasureHunters />
            </DisplayScreenContext.Provider>
          </div>
        )
    } 
}

export default App;