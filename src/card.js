import React from 'react';

import { PlayerBoat, PlayerUnit } from './player';

import { CARD_IMAGE_LOCATION, 
		IMAGE_PLACEHOLDER, 
		CARD_CLASS,
		CARD_WIDTH,
		CARD_IMAGE_CLASS,
		UNIT_HOLDERS } from './constants';

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
			treasures: 		[],
			cardType: 		"none",
			imageLocation: 	CARD_IMAGE_LOCATION,
			cardImage: 		"",
			backImage: 		IMAGE_PLACEHOLDER,
			cardWidth:		CARD_WIDTH,
			cardClass: 		CARD_CLASS,
			imageClass:     CARD_IMAGE_CLASS,
			units:          [],
			unitsHolders: 	UNIT_HOLDERS,
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
		let treasures = this.props.treasures ? this._displayTreasures(this.settings) : '';
		let cardTypeClass = "cardInfo " + this.props.cardTypeClass;
		let cardImage = this._displayCardImage(this.settings);
		let cardBack = this._displayCardBack(this.settings);
		let unitsHolderClass = this.settings.units ? this._getUnitsHolder(this.settings.units.length,this.settings) : "";
		return(
			<div className={cardClasses} onClick={this.settings.disabled ? null : () => this.props.onClick()}>
				{opened ? cardImage : cardBack}
				{debug ? <div className="cardInfo">{this.settings.cardType} {this.settings.row} - {this.settings.col}</div> : ""}
				{debug ? <div className={cardTypeClass}>{this.settings.cardType}</div> : ""}
				{(treasures && opened) ? <div className="treasureHolder">{treasures}</div> : ""}
				{playerBoat ? <div className="boatsHolder">{playerBoat}</div> : ""}
				{playerUnits ? <div className={unitsHolderClass}>{playerUnits}</div> : ""}
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

	_displayTreasures(settings){
		if (settings.treasures[settings.treasures.length - 1] !== undefined) {
			return(
				<img className="img-fluid mx-auto d-block" src={this.defaults.imageLocation + "/treasure.png"} alt="treasure" />
			);
		}
		/* Hidden for now so that only one treasure shows up at a time
		{treasures[treasures.length - 1].name}

		return treasures.map((treasure) => {
			return(
				<Treasure
					key = 		{treasure.key}
					id =		{treasure.id}
					row =		{treasure.row}
					col = 		{treasure.col}
					name = 		{treasure.name}
					retrievedBy = {treasure.retrievedBy}
				/>
			)
		}); */
	}

	_displayCardImage(settings){
		return(
			<img className={settings.imageClass} src={settings.imageLocation + "/" + settings.cardImage} alt="card" />
		)
	}
	_displayCardBack(settings){
		return(
			<img className={settings.imageClass} src={settings.imageLocation + "/" + settings.backImage} alt="ocean" />
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
				boatImage = 	{playerBoat.boatImage}
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
/* Reserved for future so that different treasures can be added
class Treasure extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			id: 0,
			row: 0,
			col: 0,
			name: "Treasure",
			retrievedBy: ""
		}

	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div className="treasure">{this.settings.name}</div>
		);
	}
} */