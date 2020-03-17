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
		}
		
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);

		let imageLocation = this.settings.imageLocation + "/" + this._getCardImage();
		let possibleMove = this.props.possibleMove ? 'possible' : '';
		let playerBoat = this.props.playerBoat ? this._displayPlayerBoat(this.props.playerBoat) : '';
		let playerUnits = this.props.units ? this._displayUnits(this.settings.units) : '';
		let cardClasses = this.settings.cardWidth + " " + this.settings.cardClass;
		let edge = this.settings.edge ? this._displayEdge() : '';
		return(
			<div className={cardClasses} onClick={this.settings.disabled ? null : () => this.props.onClick()}>
				<img className={this.settings.imageClass} src={imageLocation} alt="card" />
				<div className="cardInfo">{this.settings.cardType} {this.settings.row} - {this.settings.col}</div>
				<div className="isPossible">{possibleMove}</div>
				<div className="unitsHolder">
					{playerUnits}
				</div>
				{edge}
				{playerBoat}
			</div>
		);
	}

	_displayEdge(){
		return(
			<div className="edge">edge</div>
		)
	}

	_displayUnits(units){
		return units.map((unit) => {
			return(
				<PlayerUnit
					key = 		{unit.id}
					id =  		{unit.id}
					row =		{unit.row}
					col =  		{unit.col}
					location =  {unit.location}
					playerId = 	{unit.playerId}
					playerName = {unit.playerName}
				/>
			)
		});
	}

	_displayPlayerBoat(playerBoat){
		return(
			<PlayerBoat
				key = 			{playerBoat.row + "" + playerBoat.col}
				id =			{playerBoat.id}
				row = 			{playerBoat.row}
				col =  			{playerBoat.col}
				location =      {playerBoat.location}
				objectType =    {playerBoat.objectType}
				units = 		{playerBoat.units}
				playerId = 		{playerBoat.playerId}
				playerName = 	{playerBoat.playerName}
				possibleMove = 	{playerBoat.possibleMove}
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