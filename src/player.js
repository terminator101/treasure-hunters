import React from 'react';

import { DEAFULT_PLAYER_NAME } from './constants';

///
class Player extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			name: DEAFULT_PLAYER_NAME,
			playerId: 0,
			score: 0,
			playerUnitNumber: 2,
		}

		this.state = {
			playerUnitsArray: [],
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		//this._createPlayerUnits();
		//this.state.playerUnitsArray = this._displayPlayerUnits();
		return(
			<div>Player {this.settings.name}</div>
		);
	}
	///
	_getPlayerLocation(){
		return this.settings.currentLocationCardId;
	}

	/*_createPlayerUnits(){
		for (let i = 1; i < this.settings.playerUnitNumber + 1; i++) {
			this.state.playerUnitsArray[i] = { id: i, playerName: this.settings.name, playerId: this.settings.playerId }; // onClick={() => this._handleClick(i) }; //this._createCard(i,"ha");
		}
	}

	_displayPlayerUnits(){
		return this.state.playerUnitsArray.map((playerUnit) => {
			return(
				<PlayerUnit
					key =		  {playerUnit.id}
					id = 		  {playerUnit.id}
					playerName =  {playerUnit.playerName}
					playerId =	  {playerUnit.playerId}
				/>
			)
		});
	}

	_getPlayerUnits(){
		return this.state.playerUnitsArray[0];
	}*/

}

///
class PlayerUnit extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			id: 0,
			col: 0,
			row: 0,
			playerName: "",
			playerId: 0
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div>
				<div>{this.settings.playerName} unit {this.settings.id}</div>
				<div>At {this.settings.row} and {this.settings.col}</div>
			</div>
		);
	}
} 

///
class PlayerIcon extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			name: "",
			icon: "",
			iconLocation: ""
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div>Player icon</div>
		);
	}
}

///
class PlayerBoat extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			id: 0,
			row: "",
			col: "",
			name: "",
			image: "",
			imageLocation: "",
			possibleMove: false,
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		let possibleMove = this.props.possibleMove ? 'possible' : '';
		return(
			<div>
				<div>Player Boat</div>
				<div>At {this.settings.row} and {this.settings.col}</div>
				<div className="isPossible">{possibleMove}</div>
			</div>
		);
	}
}

///
export { Player, PlayerUnit, PlayerBoat };