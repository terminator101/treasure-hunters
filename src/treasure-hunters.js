import React from 'react';

import GameBoard from './gameBoard';
import Results from './results';

import { DEFAULT_NUMBER_OF_CARDS, 
	DEFAULT_UNTS_PER_PLAYER, 
	DEAFULT_PLAYER_NAME, 
	NUMBER_OF_ROWS,
	SCREENS,
	GAME_SETUPS,
	CARD_TYPES_TEST } from './constants';
import { DisplayScreenContext } from "./display-screen-context";

//import jQuery from 'jquery';

export default class TreasureHunters extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			gameSetup:		 GAME_SETUPS.small,
			treasuresForWin: 1,
			displayValues:	 false,
			cardTypes: 		 CARD_TYPES_TEST,
			screens:		 SCREENS,
			cardImagesArray: ['all_directions.png'],
			cardsHolderId: 	 "cardsHolder"
		}
		this.settings = Object.assign({}, this.defaults, this.props);

		this.state = {
			playersArray: this._createPlayers(),
			displayScreen: this.defaults.screens.gameBoard,
			setDisplayScreen: this._setDisplayScreen,
		}

	}

	/* _getCards(){
		let theCardsCountArray = this.defaults.gameSetup.cardTypeNumbersCount;
		let theCards = [];
		let entries = Object.entries(this.defaults.cardTypes);
		theCardsCountArray.forEach(function(card, key) {
			theCards = {  }
		}) 
	}*/

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
						displayValues = {this.settings.displayValues}
						treasuresForWin = {this.settings.treasuresForWin}
						//numberOfCards = {this.settings.numberOfCards}
						gameSetup = {this.settings.gameSetup}
						/* numberOfRows  = {this.settings.gameSetup.numberOfRows}
						numberCardsPerRow = {this.settings.gameSetup.numberCardsPerRow}
						cardRowWidthClass = {this.settings.gameSetup.cardRowWidthClass}
						cardWidthClass = {this.settings.gameSetup.cardWidthClass}
						unitsPerPlayer = {this.settings.gameSetup.unitsPerPlayer} */
						cardImagesArray = {this.settings.cardImagesArray}
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
		playersArray.push({ playerId: 0, playerName: DEAFULT_PLAYER_NAME, row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human", boatImage: "ship_brown" });
		//playersArray.push({ playerId: 1, playerName: "Tester2", row: 3, col: 0, playerClass: "player2", score: 0, playerType: "human", boatImage: "ship_red" });
		return playersArray;
	}
}

/*
//numberOfCards: 	 DEFAULT_NUMBER_OF_CARDS,
			//numberOfRows:    NUMBER_OF_ROWS,
			//unitsPerPlayer:  DEFAULT_UNTS_PER_PLAYER,
	<GameBoard
						playersArray  = {this.state.playersArray}
						cardsHolderId = {this.settings.cardsHolderId}
						//numberOfCards = {this.settings.numberOfCards}
						numberOfRows  = {this.settings.numberOfRows}
						cardImagesArray = {this.settings.cardImagesArray}
						unitsPerPlayer = {this.settings.unitsPerPlayer}
					/>

*/