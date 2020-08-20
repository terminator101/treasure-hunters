import React from 'react';
import TreasureHunters from './treasure-hunters';
import { SCREENS } from './constants';
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
        }
    }

    _setDisplayScreen = (vars) => {
        this.setState(state => ({
          displayScreen: vars
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