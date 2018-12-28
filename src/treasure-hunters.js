import React from 'react';
import ReactDOM from 'react-dom';

import GameBoard from './gameBoard';
import { Player } from './player';

import { DEFAULT_NUMBER_OF_CARDS, DEFAULT_UNTS_PER_PLAYER, DEAFULT_PLAYER_NAME, NUMBER_OF_ROWS } from './constants';
//import jQuery from 'jquery';

class TreasureHunters extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			numberOfCards: 	 DEFAULT_NUMBER_OF_CARDS,
			numberOfRows:    NUMBER_OF_ROWS,
			unitsPerPlayer:  DEFAULT_UNTS_PER_PLAYER,
			cardImagesArray: ['img_0663.jpg'],
			numberOfPlayers: 1,
			cardsHolderId: 	 "cardsHolder"
		}
		this.settings = Object.assign({}, this.defaults, this.props);

		this.state = {
			playersArray: this._createPlayers(),
		} 
		
	}

	render(){	
		const playersArray = this._displayPlayers(this.state.playersArray);
		return(
			<GameBoard
				playersArray  = {playersArray}
				cardsHolderId = {this.settings.cardsHolderId}
				numberOfCards = {this.settings.numberOfCards}
				numberOfRows  = {this.settings.numberOfRows}
				cardImagesArray = {this.settings.cardImagesArray}
				unitsPerPlayer = {this.settings.unitsPerPlayer}
			/>
		);
	}

	//Function for filling the players array
	_createPlayers(){
		let playersArray = [];
		playersArray[1] = { id: 1, name: DEAFULT_PLAYER_NAME };
		return playersArray;
	}

	///
	_displayPlayers(playersArray){
		return playersArray.map((player) => {
			return(
				<Player
					key = 		 			{player.id}
					id = 		 			{player.id}
					name = 					{player.name}
				/>
			)
		});
	}

}

ReactDOM.render(<TreasureHunters />, document.getElementById('root'));