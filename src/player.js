import React from 'react';

import { DEAFULT_PLAYER_NAME } from './constants';

///
class Player extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			playerName: DEAFULT_PLAYER_NAME,
			playerId: 0,
			col: 0,
			row: 0,
			score: 0,
			playerUnitNumber: 2,
			playerClass: "player",
			playerState: "",
			playerType: "human",
			dead: false,
		}

		this.state = {
			playerUnitsArray: [],
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		
		return(
			<div>Player {this.settings.playerName} </div>
		);
	}

	_getPlayerLocation(){
		return this.settings.currentLocationCardId;
	}

}

///
class PlayerUnit extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			id: 0,
			col: 0,
			row: 0,
			playerId: 0,
			playerName: "",
			location: "",
			dead: false,
			unitClass: "unit"
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div className={this.settings.unitClass + "unit"}></div>
		);
	}

} 

//{this.settings.playerName} unit {this.settings.id} R:{this.settings.row}|C:{this.settings.col}

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
			id: 			0,
			row: 			"",
			col: 			"",
			name: 			"",
			image: 			"",
			playerId: 		"",
			playerName: 	"",
			imageLocation: 	"",
			possibleMove: 	false,
			objectType: 	"boat",
			movementType: 	"horizontal vertical",
			units: 			[],
			debug: 			false,
			boatClass: 		"boat"
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		let possibleMove = this.props.possibleMove ? 'possible' : '';
		let debug = this.settings.debug;
		return(
			<div className={this.settings.boatClass + "boat"}>
				{debug ? <div>Player Boat R:{this.settings.row}|C:{this.settings.col}</div> : ""}
				<div className="unitsHolder">{this._displayUnits(this.settings.units)}</div>
			</div>
		);
	}

	_displayUnits(units){
		return units.map((unit) => {
			return(
				<PlayerUnit
					key = 		{unit.key}
					id =  		{unit.id}
					row =		{unit.row}
					col =  		{unit.col}
					location =  {unit.location}
					playerId = 	{unit.playerId}
					playerName = {unit.playerName}
					unitClass = {unit.unitClass}
				/>
			)
		});
	}
}

///
export { Player, PlayerUnit, PlayerBoat };