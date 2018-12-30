import React from 'react';

import { PlayerUnit } from './player';

import { CARD_IMAGE_LOCATION, 
		IMAGE_PLACEHOLDER, 
		CARD_CLASS, 
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
			opened: 		false,
			disabled: 		true,
			treasure: 		false,
			cardType: 		"none",
			imageLocation: 	CARD_IMAGE_LOCATION,
			cardImage: 		"",
			currentImage: 	IMAGE_PLACEHOLDER,
			cardClass: 		CARD_CLASS,
			imageClass:     CARD_IMAGE_CLASS,
			units:          [],
			possibleMove:   false,
			onClick: 		""
		}
		
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);

		let imageLocation = this.settings.imageLocation + "/" + this._getCardImage();
		let possibleMove = this.props.possibleMove ? 'possible' : '';
		return(
			//<div className="col-md-4" onClick={this._handleClick.bind(this)}>
			<div className={this.settings.cardClass} onClick={this.settings.disabled ? null : () => this.props.onClick()}>
				<img className={this.settings.imageClass} src={imageLocation} alt="card" />
				<div className="cardInfo">{this.settings.cardType} {this.settings.row} - {this.settings.col}</div>
				<div className="isPossible">{possibleMove}</div>
				<div className="unitsHolder">{this._displayUnits(this.settings.units)}</div>
			</div>
		);
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