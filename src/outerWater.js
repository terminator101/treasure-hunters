import React from 'react';

import { PlayerBoat } from './player';

import { CARD_IMAGE_LOCATION, 
		IMAGE_PLACEHOLDER, 
		CARD_IMAGE_CLASS } from './constants';

//Outer water
export default class OuterWater extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			id: 			0,
			row:  			0,
			col: 			0,
			cardType: 		"outerWater",
			objectType: 	"outerWater",
			imageLocation: 	CARD_IMAGE_LOCATION,
			cardImage: 		"",
			currentImage: 	IMAGE_PLACEHOLDER,
			cardClass: 		"col-sm-2 cardObject",
			imageClass:     CARD_IMAGE_CLASS,
			units:          [],
			possibleMove:   false,
			playerBoat: 	"",
			disabled: 		true,
			onClick: 		""
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);

		let imageLocation = this.settings.imageLocation + "/" + this.settings.currentImage;
		let possibleMove = this.props.possibleMove ? 'possible' : '';
		let playerBoat = this.props.playerBoat ? this.props.playerBoat : '';
		return(
			<div className={this.settings.cardClass} onClick={this.settings.disabled ? null : () => this.props.onClick()}>
				<img className={this.settings.imageClass} src={imageLocation} alt="water" />
				<div className="waterInfo">{this.settings.row} - {this.settings.col}</div>
				<div className="isPossible">{possibleMove}</div>
				<div className="boatsHolder">{this.settings.playerBoat ? this._displayPlayerBoat(this.settings.playerBoat) : ""}</div>
			</div>
		)
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
}