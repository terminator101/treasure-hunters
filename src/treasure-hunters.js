import React from 'react';

import GameBoard from './gameBoard';
import Results from './results';

import { DEFAULT_NUMBER_OF_CARDS, 
	DEFAULT_UNTS_PER_PLAYER, 
	DEAFULT_PLAYER_NAME, 
	NUMBER_OF_ROWS,
	SCREENS } from './constants';
import { DisplayScreenContext } from "./display-screen-context";

//import jQuery from 'jquery';

export default class TreasureHunters extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			numberOfCards: 	 DEFAULT_NUMBER_OF_CARDS,
			numberOfRows:    NUMBER_OF_ROWS,
			unitsPerPlayer:  DEFAULT_UNTS_PER_PLAYER,
			screens:		 SCREENS,
			cardImagesArray: ['img_0663.jpg'],
			numberOfPlayers: 1,
			cardsHolderId: 	 "cardsHolder"
		}
		this.settings = Object.assign({}, this.defaults, this.props);

		this.state = {
			playersArray: this._createPlayers(),
			displayScreen: this.defaults.screens.gameBoard,
			setDisplayScreen: this._setDisplayScreen,
		} 
	}

	_setDisplayScreen = (vars) => {
        this.setState(state => ({
            displayScreen: vars
        }))
    }

	render(){
		if(this.state.displayScreen === this.defaults.screens.gameBoard){
			return(
				<DisplayScreenContext.Provider value={this.state}>
					<GameBoard
						playersArray  = {this.state.playersArray}
						cardsHolderId = {this.settings.cardsHolderId}
						numberOfCards = {this.settings.numberOfCards}
						numberOfRows  = {this.settings.numberOfRows}
						cardImagesArray = {this.settings.cardImagesArray}
						unitsPerPlayer = {this.settings.unitsPerPlayer}
					/>
				  </DisplayScreenContext.Provider>
			)
		} else {
			return(
				<Results />
			)
		}
	}

	//Function for filling the players array
	_createPlayers(){
		let playersArray = [];
		playersArray.push({ playerId: 0, playerName: DEAFULT_PLAYER_NAME, row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human" });
		playersArray.push({ playerId: 1, playerName: "Mike", row: 4, col: 0, playerClass: "player2", score: 0, playerType: "human" });
		return playersArray;
	}
}