import React from 'react';
import { PlayerScore } from './player';
import { DisplayScreenContext } from "./display-screen-context";

import { SCREENS,
		PLAYER_STATES } from './constants';

///
export default class Results extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			players: [],
			screens: SCREENS,
			playerStates: PLAYER_STATES,
		}
	}

	/**
	 * When rematch button is pressed
	 * @param {event} e 
	 */
	_rematch(e) {     
		//Hide the results
		this.context.setDisplayResults(false);

		//Update the players
		this.context.setPlayers(this._resetPlayerProperties(this.context.playersArray));

		//Change the screen
		this.context.setDisplayScreen(this.defaults.screens.mainMenu);
	}

	/**
	 * When restart button is pressed
	 * @param {event} e 
	 */
	_reset(e){
		//Hide the results
		this.context.setDisplayResults(false); 
		
		//Update the players
		this.context.setPlayers(null);

		//Reset the game settings back to defaults
		this.context.setGameSettings('small');

		//Change the screen
		this.context.setDisplayScreen(this.defaults.screens.mainMenu);
	}

	/**
	 * Reset players so that a new game can start without problems
	 * @param {Array} playersArray 
	 */
	_resetPlayerProperties(playersArray){
		let updatedPlayersArray = playersArray.slice();

		for(let player of updatedPlayersArray){
			let thePlayerState = "";
			if(player.id === 0){
				//Set the first player as the current so that they can go first
				thePlayerState = this.defaults.playerStates.current;
			}
			updatedPlayersArray[player.id] = Object.assign({}, updatedPlayersArray[player.id], {
				score: 0,
				playerState: thePlayerState,
				resultText: "",
			});
		}
		return updatedPlayersArray;
	}


	_displayPlayerScores(players){
		return players.map((player) => {
			return(
				<PlayerScore
					key = 		{player.playerId}
					playerId = 	{player.playerId}
					playerName = {player.playerName}
					score = 	{player.score}
					resultText = {player.resultText}
				/>
			)
		});
	}
	
	/* _displayPlayerScores(){
		let displayScores = [];
		let playersArray = this.context.playersArray;
		for(let player of playerArray){
			displayScores.push()
		}
	} */

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		let displayResults = this.context.displayResults ? "" : "d-none"; 
		return(
			<div className={"row h-100 no-gutters justify-content-center " + displayResults}>
				<div className="col-lg-6 pt-4">
					<div className="row no-gutters justify-content-center">
						<div className="col pb-1">
							<h4 className="text-center">Game Over</h4>
						</div>
					</div>
					<div className="row no-gutters justify-content-center">
						<div className="col pb-3 text-center">
							<table className="table table-bordered">
								<thead className="thead-dark">
									<tr>
										<th scope="col">Name</th>
										<th scope="col">Score</th>
										<th scope="col">Result</th>
									</tr>
								</thead>
								<tbody>
									{this._displayPlayerScores(this.context.playersArray)}
								</tbody>
							</table>
						</div>
					</div>
					<div className="row no-gutters justify-content-center">
						<div className="col-md-12 btn-group btn-group-justified">
							<button type="button" className="btn btn-primary"
								value="Rematch"     
								onClick={() => this._rematch()}>Rematch
							</button> 
							<button type="button" className="btn btn-success"
								value="Reset"     
								onClick={() => this._reset()}>Reset
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Results.contextType = DisplayScreenContext;