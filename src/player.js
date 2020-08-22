import React from 'react';

import { DEAFULT_PLAYER_NAME,
	CARD_IMAGE_LOCATION, 
	CARD_IMAGE_CLASS,
	UNIT_HOLDERS, } from './constants';

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
			boatImage: "ship_black",
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
			possibleMove: 	false,
			objectType: 	"boat",
			movementType: 	"horizontal vertical",
			units: 			[],
			unitsHolders: 	UNIT_HOLDERS,
			debug: 			false,
			boatClass: 		"boat",
			boatImage:  	"ship_black",
			imageLocation: 	CARD_IMAGE_LOCATION,
			imageClass:     CARD_IMAGE_CLASS,
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		let debug = this.settings.debug;
		let boatImage = this.settings.boatImage ? this._displayBoat(this.settings.boatImage,this.settings) : this._displayBoat("ship_black");
		let unitsHolderClass = this.settings.units ? this._getUnitsHolder(this.settings.units.length,this.settings) : "";
		return(
			<div className={this.settings.boatClass + "boat"}>
				{debug ? <div>Player Boat R:{this.settings.row}|C:{this.settings.col}</div> : boatImage}
				<div className={unitsHolderClass}>{this._displayUnits(this.settings.units)}</div>
			</div>
		);
	}

	_displayBoat(boatImage,settings){
		return(
			<img className={settings.imageClass} src={this.defaults.imageLocation + "/" + boatImage + ".png"} alt="boat" />
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

	_getUnitsHolder(number,settings){
		let holderClass = "";
		switch(number) {
			case 1:
				holderClass = settings.unitsHolders.oneUnit
			break;
			case 2:
				holderClass = settings.unitsHolders.twoUnits
			break;
			case 3:
				holderClass = settings.unitsHolders.threeUnits
			break;
			case 4:
				holderClass = settings.unitsHolders.fourUnits
			break;
			default:
				holderClass = settings.unitsHolders.oneUnit
			break;
		}
		return holderClass;
	}
}

///
export { Player, PlayerUnit, PlayerBoat };