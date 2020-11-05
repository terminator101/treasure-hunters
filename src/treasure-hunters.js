import React from 'react';

import GameBoard from './gameBoard';
import Results from './results';
import MainMenu from './mainMenu';

import { SCREENS,
	GAME_SETUPS } from './constants';
import { DisplayScreenContext } from "./display-screen-context";

//import jQuery from 'jquery';

export default class TreasureHunters extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			gameSetup:		 GAME_SETUPS.small,
			treasuresForWin: 1,
			displayValues:	 false,
			screens:		 SCREENS,
			cardImagesArray: ['all_directions.png'],
			cardsHolderId: 	 "cardsHolder"
		}
		this.settings = Object.assign({}, this.defaults, this.props);

		this.state = {
			//playersArray: this._createPlayers(),
			//displayScreen: this.defaults.screens.gameBoard,
			//setDisplayScreen: this._setDisplayScreen,
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

	/* _setDisplayScreen = (vars) => {
        this.setState(state => ({
            displayScreen: vars
        }))
    } */

	render(){
		if(this.context.displayScreen === this.defaults.screens.mainMenu){
			return(
				<MainMenu />
			)
		}
		else
		if(this.context.displayScreen === this.defaults.screens.gameBoard){
			return(
				<GameBoard
					playersArray  = {this.context.playersArray}
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
			)
		} else {
			return(
				<Results />
			)
		}
	}

	//Function for filling the players array
	/* _createPlayers(){
		let playersArray = [];
		playersArray.push({ playerId: 0, playerName: DEAFULT_PLAYER_NAME, row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human", boatImage: "ship_brown" });
		//playersArray.push({ playerId: 1, playerName: "Tester2", row: 3, col: 0, playerClass: "player2", score: 0, playerType: "human", boatImage: "ship_red" });
		return playersArray;
	} */
}

TreasureHunters.contextType = DisplayScreenContext;

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