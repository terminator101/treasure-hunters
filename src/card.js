import React from 'react';

import { PlayerBoat, PlayerUnit } from './player';

import { CARD_IMAGE_LOCATION, 
		IMAGE_PLACEHOLDER, 
		CARD_CLASS,
		CARD_WIDTH,
		CARD_IMAGE_CLASS } from './constants';

///The Card
export default class Card extends React.Component {
	
	constructor(props) {
		super(props);

		this.defaults = {
			id: 			0,
			row:  			0,
			col: 			0,
			objectType: 	"card",
			movementType:	"horizontal vertical",
			opened: 		false,
			disabled: 		true,
			treasure: 		false,
			cardType: 		"none",
			imageLocation: 	CARD_IMAGE_LOCATION,
			cardImage: 		"",
			currentImage: 	IMAGE_PLACEHOLDER,
			cardWidth:		CARD_WIDTH,
			cardClass: 		CARD_CLASS,
			imageClass:     CARD_IMAGE_CLASS,
			units:          [],
			possibleMove:   false,
			onClick: 		"",
			edge: 			false,
			playerBoat: 	"",
			debug: 			false,
			cardTypeClass: 	"horizontalVerticalCard"
		}
		
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);

		let imageLocation = this.settings.imageLocation + "/" + this._getCardImage();
		let possibleMove = this.props.possibleMove ? 'possibleMove' : '';
		let playerBoat = this.props.playerBoat ? this._displayPlayerBoat(this.props.playerBoat) : '';
		let playerUnits = this.props.units ? this._displayUnits(this.settings.units) : '';
		let cardClasses = this.settings.cardWidth + " " + this.settings.cardClass;
		//let edge = this.settings.edge ? this._displayEdge() : '';
		let debug = this.settings.debug;
		let opened = this.props.opened ? this.props.opened : '';
		let treasure = this.props.treasure ? this._displayTreasure() : '';
		let cardTypeClass = "cardInfo " + this.props.cardTypeClass;
		return(
			<div className={cardClasses} onClick={this.settings.disabled ? null : () => this.props.onClick()}>
				<img className={this.settings.imageClass} src={imageLocation} alt="card" />
				{debug ? <div className="cardInfo">{this.settings.cardType} {this.settings.row} - {this.settings.col}</div> : ""}
				{opened ? <div className={cardTypeClass}>{this.settings.cardType}</div> : ""}
				{(treasure && opened) ? <div className="treasureHolder">{treasure}</div> : ""}
				{playerUnits ? <div className="unitsHolder">{playerUnits}</div> : ""}
				{playerBoat ? <div className="boatsHolder">{playerBoat}</div> : ""}
				{possibleMove ? <div className="possibleMove"></div> : ""}
			</div>
		);
	}
	//

	_displayEdge(){
		return(
			<div className="edge">edge</div>
		)
	}

	_displayTreasure(){
		return(
			<div className="treasure">Treasure</div>
		)
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
					unitClass =	{unit.unitClass}
				/>
			)
		});
	}

	_displayPlayerBoat(playerBoat){
		return(
			<PlayerBoat
				key = 			{playerBoat.key}
				id =			{playerBoat.id}
				row = 			{playerBoat.row}
				col =  			{playerBoat.col}
				location =      {playerBoat.location}
				objectType =    {playerBoat.objectType}
				movementType = 	{playerBoat.movementType}
				units = 		{playerBoat.units}
				playerId = 		{playerBoat.playerId}
				playerName = 	{playerBoat.playerName}
				possibleMove = 	{playerBoat.possibleMove}
				boatClass =		{playerBoat.boatClass}
			/>
		)
	}

	///
	_getCardId(){
		return this.settings.id;
	}

	///
	_getCardImage(){
		return this.settings.currentImage;
	}

	_setType(type){
		this.settings.type = type;
	}

	_getPlayer(){
		return this.settings.playerId;
	}

}