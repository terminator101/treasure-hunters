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

	_handleClick(e) {    
        //e.preventDefault();    
		
		//Update the players
		this.context.setPlayers(this._resetPlayers(this.context.playersArray));
		
		//Change the screen
		this.context.setDisplayScreen(this.defaults.screens.gameBoard);
	}

	/**
	 * Reset players so that a new game can start without problems
	 * @param {array} playersArray 
	 */
	_resetPlayers(playersArray){
		let updatedPlayersArray = playersArray.slice();

		for(let player of updatedPlayersArray){
			let thePlayerState = "";
			if(player.id === 0){
				thePlayerState = this.defaults.playerStates.current;
			}
			updatedPlayersArray[player.id] = Object.assign(player, updatedPlayersArray[player.id], {
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
		return(
			<div className="container">
				<div className="row h-100 no-gutters justify-content-center">
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
							<button type="button" className="btn btn-primary"
								value="Start"     
								onClick={() => this._handleClick()}>Restart
							</button>
						</div>
					</div>
				</div>
            </div>
		);
	}
}

Results.contextType = DisplayScreenContext;