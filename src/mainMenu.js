import React from 'react';
import { DisplayScreenContext } from "./display-screen-context";

import { SCREENS, DEAFULT_PLAYER_NAME } from './constants';

///
export default class MainMenu extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
            players: [],
            screens: SCREENS,
        }

        this.state = {
            player0name: "",
            player0computer: false,
            player1name: "",
            player1computer: true,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    _handleClick(e) {
        //e.preventDefault();    
        //console.log('The link was clicked.');

        if(this.state.player0name === ""){
            //A name wasn't entered so display error message
            alert("Player 1 must have a name");
        } else {
            //Update the context with the players
            this.context.setPlayers(this._createPlayers());
            //Move to the game board
            this.context.setDisplayScreen(this.defaults.screens.gameBoard);
        }
    }

    /**
     * Get the state of the input and update the value
     * @param {event} event 
     */
    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    //Function for filling the players array
	_createPlayers(){
        let playersArray = [];
        playersArray.push({ playerId: 0, playerName: this.state.player0name, row: 0, col: 3, playerClass: "player1", score: 0, playerType: this.state.player0computer === false ? "human" : "computer", boatImage: "ship_brown", resultText: "" })
		//playersArray.push({ playerId: 0, playerName: "Andrej", row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human", boatImage: "ship_brown", resultText: "" });
		//playersArray.push({ playerId: 1, playerName: "Tester2", row: 3, col: 0, playerClass: "player2", score: 0, playerType: "human", boatImage: "ship_red", resultText: "" });
		return playersArray;
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div className="container">
                <div className="row h-100 no-gutters justify-content-center">
                    <div className="form-group">
                        <div className="col pb-1">
                            <div class="form-group">
                                <label for="player0name">&nbsp; Player 1 Name:</label>
                            </div>
                            <div className="form-group">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <input
                                            name="player0name" 
                                            className="form-control"
                                            type="text"
                                            id="player0name"
                                            value={this.state.player0name}
                                            onChange={this.handleInputChange}
                                            maxlength="15"
                                            required />
                                    </div>
                                    <div className="col">
                                        <div className="checkbox">
                                            <label>
                                                <input
                                                    hidden="true"
                                                    name="player0computer"
                                                    type="checkbox"
                                                    checked={this.state.player0computer} 
                                                    onChange={this.handleInputChange} />
                                                <span> </span>
                                                {/* Computer */}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="button" className="btn btn-primary"
                                    value="Start"     
                                    onClick={() => this._handleClick()}>Start Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
};

MainMenu.contextType = DisplayScreenContext;