import React from 'react';
//import update from 'immutability-helper';

import Card from './card';
import { PlayerUnit, PlayerBoat } from './player';
import OuterWater from './outerWater';

import { NUMBER_OF_ROWS, CARD_TYPES } from './constants';

export default class GameBoard extends React.Component {
	constructor(props) {
		super(props);

		this.defaults = {
			cardDatabase: CARD_TYPES,
		}
		this.state = {
			playerUnitsArray: 	this._createPlayerUnits(this.props.playersArray),
			cardArray: 			this._createCards(),
			outerWaterArray: 	this._createOuterWater(), //this._createPlayerBoats(this.props.playersArray)
			playerBoatsArray: 	this._createPlayerBoats(this.props.playersArray),
			possibleMoves: 		[],
			currentPlayerId: 	1,
			currentPlayeUnit: 	"",
		}
		//console.log(this.state.cardArray);
		//this._debug();
	}

	//Used for testing
	componentDidMount() {
		this._debug();
	}

	_debug(){
		let { cardsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.playerUnitsArray[1], this.state.cardArray[3][4], this.state.playerUnitsArray, this.state.cardArray);
		this.setState({
			cardArray: cardsUpdatedWithUnitsArray,
			playerUnitsArray: updatedUnitsArray,
		});

		let { outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray } = this._addPlayerBoatToOuterWater(this.state.playerBoatsArray[1], this.state.outerWaterArray[0][1], this.state.playerBoatsArray, this.state.outerWaterArray);
		this.setState({
			outerWaterArray: outerWaterUpdatedWithBoatsArray,
			playerBoatsArray: updatedPlayerBoatsArray,
		});

		//this._addPlayerBoatToOuterWater(this.state.outerWaterArray[0][1], this.state.playerBoatsArray[1]);
		//console.log(this.state.outerWaterArray[0][1]);
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		//const cardArray = this.state.cardArray;
		//const cardArray = this._displayCards(this.state.cardArray);
		let cardArray = [];
		for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
			cardArray[i] = this._displayCards(this.state.cardArray[i]);
		}
		let topWater = this._displayOuterWater(this._getOuterWater("top"));
		let bottomWater = this._displayOuterWater(this._getOuterWater("bottom"));
		let leftWater = this._displayOuterWater(this._getOuterWater("left"));
		let rightWater = this._displayOuterWater(this._getOuterWater("right"));

		//const playerUnitsArray = this._displayPlayerUnits(this.state.playerUnitsArray);
		
		//console.log(this._findPlayerById(1));
		return(
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
						{this.props.playersArray[this.state.currentPlayerId]}
					</div>
				</div>
				<div className="row">
					<div className="col-sm-10 col-sm-offset-1">
						{/* This is where the top boat will go */}
						{topWater}
					</div>
				</div>
				<div id={this.props.cardsHolderId} className="row">
					<div className="col-sm-1">
						{/* This is where the boats will go */}
						{leftWater}
					</div>
					<div className="col-sm-10">
						{cardArray}
					</div>
					<div className="col-sm-1">
						{/* This is where the boats will go */}
						{rightWater}
					</div>
				</div>
				<div className="row">
					<div className="col-sm-10 col-sm-offset-1">
						{/* This is where the boats will go */}
						{bottomWater}
					</div>
				</div>
			</div>
		);
	}

	///////////////////
	/// Outer Water
	///////////////////
	_createOuterWater(){
		let outerWaterArray = [];
		for(let r = 0; r < NUMBER_OF_ROWS + 2; r++){
			outerWaterArray[r] = [];
		}

		//top
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[0][i] = { row: 0, col: i, playerBoat: "", possibleMove: false, cardClass: "col-sm-2 cardObject", objectType: "outerWater" }
		}
		//bottom
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[7][i] = { row: 7, col: i, playerBoat: "", possibleMove: false, cardClass: "col-sm-2 cardObject", objectType: "outerWater" }
		}

		//left
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[i][0] = { row: i, col: 0, playerBoat: "", possibleMove: false, cardClass: "col-sm-12 cardObject", objectType: "outerWater" }
		}
		//right
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[i][7] = { row: i, col: 7, playerBoat: "", possibleMove: false, cardClass: "col-sm-12 cardObject", objectType: "outerWater" }
		}
		//console.log(outerWaterArray);

		return outerWaterArray;
	}

	_getOuterWater(posittion){
		const outerWaterArray = this.state.outerWaterArray.slice();
		let displayArray = [];
		switch(posittion){
			case "top":
				for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
					displayArray.push(outerWaterArray[0][i]);
				}
			break;
			case "bottom":
				for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
					displayArray.push(outerWaterArray[7][i]);
				}
			break;
			case "left":
				for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
					displayArray.push(outerWaterArray[i][0]);
				}
			break;
			case "right":
				for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
					displayArray.push(outerWaterArray[i][7]);
				}
			break;
			default:
				return 0;
		}
		return displayArray;
	}

	_displayOuterWater(outerWaterArray){
		return outerWaterArray.map((outerWater) => {
			return(
				<OuterWater
					key = 		   {outerWater.row + "" + outerWater.col}
					row = 		   {outerWater.row}
					col = 		   {outerWater.col}
					playerBoat =   {outerWater.playerBoat}
					possibleMove = {outerWater.possibleMove}
					cardClass =	   {outerWater.cardClass ? outerWater.cardClass : ""}
					onClick = 	   {() => this._handleClick(outerWater)}
				/>
			)
		});
	}

	///////////////////
	/// Player Boats
	///////////////////
	_createPlayerBoats(playersArray){
		let playerBoatsArray = [];
		for(let index in playersArray){
			playerBoatsArray[index] = { id: index, row: 0, col: 0, units: [], possibleMove: false, playerId: playersArray[index].props.id, playerName: playersArray[index].props.name, disabled: true, location: "" }
		};

		return playerBoatsArray;
	}

	_addPlayerBoatToOuterWater(boat,spot,playerBoatsArray,outerWaterArray){
		let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();
		let updatedPlayerBoatsArray = playerBoatsArray.slice();
		
		//Update
		updatedPlayerBoatsArray = this._updateObjectWithNewLocation(boat,spot,updatedPlayerBoatsArray);

		outerWaterUpdatedWithBoatsArray[spot.row] = outerWaterUpdatedWithBoatsArray[spot.row].slice();
		outerWaterUpdatedWithBoatsArray[spot.row][spot.col] = Object.assign({}, outerWaterUpdatedWithBoatsArray[spot.row][spot.col], {
			playerBoat: updatedPlayerBoatsArray[boat.id],
			disabled: false
		});

		return {outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray};
	}

	_removePlayerBoatFromOuterWater(boat,objectArray){
		let updatedObjectArray = objectArray;

		updatedObjectArray[boat.row][boat.col] = Object.assign({}, updatedObjectArray[boat.row][boat.col], {
			playerBoat: "",
			disabled: true
		});

		return updatedObjectArray;
	}

	///////////////////
	/// Player Units
	///////////////////
	_createPlayerUnits(playersArray){
		//let playersArray = this.state.playersArray;
		let playerUnitsArray = []; //this.state.playerUnitsArray.slice();
		for(let index in playersArray){
			//console.log(playersArray[index]);
			//this._createUnit(playersArray[index]);
			for (let i = 1; i < this.props.unitsPerPlayer + 1; i++) {
				playerUnitsArray[i] = { id: i, row: 0, col: 0, playerId: playersArray[index].props.id, playerName: playersArray[index].props.name, location: "" };
			}
			
		};

		//playerUnitsArray = this._displayPlayerUnits(playerUnitsArray);
		return playerUnitsArray;
		
	}

	/*_displayPlayerUnits(playerUnitsArray){
		return playerUnitsArray.map((unit) => {
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

	_displayPlayerUnit(playerUnit){
		return(
			<PlayerUnit
				key = 		{playerUnit.row + "" + playerUnit.col}
				id =		{playerUnit.id}
				row =		{playerUnit.row}
				col =  		{playerUnit.col}
				location =  {playerUnit.location}
				playerId = 	{playerUnit.playerId}
				playerName = {playerUnit.playerName}
			/>
		)
	}

	_addUnitToBoat(boat,unit){
		unit.row = boat.row;
		unit.col = boat.col;
		unit = this._displayPlayerUnit(unit);
		boat.units.push(unit);
		return boat;
	}*/

	///////////////////
	/// Cards
	///////////////////
	_createCards(){
		let cardArray = [];

		for (let r = 1; r < NUMBER_OF_ROWS + 1; r++) {
			cardArray[r] = [];
			for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
				cardArray[r][i] = { row: r, col: i, cardType: "mermaid", units: [], possibleMove: false, cardImage: this.props.cardImagesArray[0], disabled: true, objectType: "card" };
			}
			//cardArray[i] = { id: i, cardType: "test", units: [], possibleMove: false, cardImage: this.props.cardImagesArray[0] };
		}

		return cardArray;

		// let displayCardArray = [];
		// for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
		// 	displayCardArray[i] = this._displayCards(cardArray[i]);
		// }
		// //cardArray = this._displayCards(cardArray);
		// return displayCardArray;
	}

	_displayCards(cardArray){
		return cardArray.map((card) => {
			return(
				<Card
					key = 		   {card.row + "" + card.col}
					col = 		   {card.col}
					row = 		   {card.row}
					cardType = 	   {card.cardType}
					units =	  	   {card.units}
					possibleMove = {card.possibleMove}
					cardImage =	   {card.cardImage}
					//onClick = 	   {() => this._handleClick(card)}
					onClick = 	   {card.disabled ? null : () => this._handleClick(card)}
					disabled = 	   {card.disabled}
				/>
			)
		});
	}

	/*_addUnitToCard(card,unit){

		const cardArray = this.state.cardArray;
		const playerUnitsArray = this.state.playerUnitsArray;

		//Update the unit in the array with the location on the card
		const updatedUnitsArray = update(playerUnitsArray, {
			[unit.props.id]: {
				props: {
					row: {
						$set: card.props.row
					},
					col: {
						$set: card.props.col
					},
					location: {
						$set: "card"
					}
				}
			}
		});

		//console.log(updatedUnitsArray[unit.props.id]);

		//Add the unit to the card and set it as enabled
		const updatedCardArray = update(cardArray, {
			[card.props.row]: {
				[card.props.col]: {
					props: {
						units: {
							$push: [updatedUnitsArray[unit.props.id]]
						},
						disabled: {
							$set: false
						},
						onClick: {
							$set: () => this._handleClick(card)
						}
					}
				}
			}
		});

		//this.state.playerUnitsArray = updatedUnitsArray;
		//this.state.cardArray = updatedCardArray;
		
		this.setState({
			cardArray: updatedCardArray,
			playerUnitsArray: updatedUnitsArray,
		});

		//console.log(this.state.cardArray[card.props.row][card.props.col]);
	}*/

	/*_addUnitToCard(card,unit){
		const cardArray = this.state.cardArray.slice();
		const playerUnitsArray = this.state.playerUnitsArray.slice();

		//console.log(cardArray[card.row][card.col]);
		//console.log(playerUnitsArray[unit.id]);

		unit.row = card.row;
		unit.col = card.col;
		unit.location = "card";
		//unit = this._displayPlayerUnit(unit);

		//Update
		playerUnitsArray[unit.id] = Object.assign({}, playerUnitsArray[unit.id], {
			row: unit.row,
			col: unit.col
		});

		cardArray[card.row] = cardArray[card.row].slice();
		cardArray[card.row][card.col] = Object.assign({}, cardArray[card.row][card.col], {
			units: cardArray[card.row][card.col].units.concat(playerUnitsArray[unit.id]),
			disabled: false
		});

		this.setState({
			playerUnitsArray: playerUnitsArray,
			cardArray: cardArray,
		});
		return cardArray;
	}*/

	_addUnitToObject(unit,object,playerUnitsArray,cardArray){
		let cardsUpdatedWithUnitsArray = cardArray.slice();
		let updatedUnitsArray = playerUnitsArray.slice();

		//Update
		updatedUnitsArray = this._updateObjectWithNewLocation(unit,object,playerUnitsArray);

		cardsUpdatedWithUnitsArray[object.row] = cardsUpdatedWithUnitsArray[object.row].slice();
		cardsUpdatedWithUnitsArray[object.row][object.col] = Object.assign({}, cardsUpdatedWithUnitsArray[object.row][object.col], {
			units: cardsUpdatedWithUnitsArray[object.row][object.col].units.concat(updatedUnitsArray[unit.id]),
			disabled: false
		});

		return {cardsUpdatedWithUnitsArray, updatedUnitsArray};
	}

	_updateObjectWithNewLocation(object,location,objectsArray){
		let objectsWithUpdatedLocation = objectsArray.slice();

		//Update
		objectsWithUpdatedLocation[object.id] = Object.assign({}, objectsWithUpdatedLocation[object.id], {
			row: location.row,
			col: location.col,
			location: location.objectType,
		});

		return objectsWithUpdatedLocation;
	}

	/*_removeUnitFromObject(unit){
		const cardArray = this.state.cardArray.slice();
		//const playerUnitsArray = this.state.playerUnitsArray;

		cardArray[unit.row] = cardArray[unit.row].slice();

		let cardUnitsArray = cardArray[unit.row][unit.col].units;

		const theUnit = cardUnitsArray.find( unit => unit.id === unit.id );

		console.log(cardArray[unit.row][unit.col].units);
		console.log(theUnit);

		let newCardUnitArray = cardArray[unit.row][unit.col].units.filter(unit => unit.id !== theUnit.id);
		console.log(newCardUnitArray);

		
		cardArray[unit.row][unit.col] = Object.assign({}, cardArray[unit.row][unit.col], {
			units: newCardUnitArray,
			disabled: true
		});

		//units: cardArray[unit.row][unit.col].units.filter(e => e !== playerUnitsArray[unit.id]),

		const cardArray = this.state.cardArray.slice();
		let cardUnitsArray = cardArray[unit.row][unit.col].units;
		//console.log(cardUnitsArray);
		//this._clearPossibleMoves();

		for(let i = 0; i < cardUnitsArray.length+1; i++){
			if (cardUnitsArray[i].id === unit.id) {
				cardUnitsArray.splice(i);
			}
		}
		//cardArray[unit.row][unit.col].units = cardUnitsArray;


		this.setState({
			cardArray: cardArray,
		});
		return unit;
		
	}*/
	_removeUnitFromObject(unit,objectArray){
		let updatedObjectArray = objectArray;
		let objectUnitsArray = updatedObjectArray[unit.row][unit.col].units;
		const theUnit = objectUnitsArray.find( unit => unit.id === unit.id );
		let updatedObjectUnitArray = updatedObjectArray[unit.row][unit.col].units.filter(unit => unit.id !== theUnit.id);

		updatedObjectArray[unit.row][unit.col] = Object.assign({}, updatedObjectArray[unit.row][unit.col], {
			units: updatedObjectUnitArray,
			disabled: true
		});

		return updatedObjectArray;
		
	}

	_clearPossibleMoves(objectArray,possibleMoves){
		let updatedObjectArray = objectArray;

		for(let position of possibleMoves){
			updatedObjectArray[position.row] = updatedObjectArray[position.row].slice();
			updatedObjectArray[position.row][position.col] = Object.assign({}, updatedObjectArray[position.row][position.col], {
				possibleMove: false,
				disabled: true
			});
		}
		return updatedObjectArray;
	}

	_higlightPossibleMoves(card){
		const cardArray = this.state.cardArray.slice();
		let possibleMoves = this.state.possibleMoves.slice();

		//console.log(cardArray);
		possibleMoves = this._findPossibleMoves(card);
		for(let position of possibleMoves){
			// cardArray[position.row][position.col].props.possibleMove = true;
			// cardArray[position.row][position.col].props.disabled = false;

			cardArray[position.row] = cardArray[position.row].slice();
			cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
				possibleMove: true,
				disabled: false
			});
		}

		this.setState({
			cardArray: cardArray,
			possibleMoves: possibleMoves,
		});
		return possibleMoves;
	}

	/*_clearPossibleMoves(){
		const cardArray = this.state.cardArray.slice();
		let possibleMoves = this.state.possibleMoves.slice();
		
		//console.log(possibleMoves);
		for(let position of possibleMoves){
			cardArray[position.row] = cardArray[position.row].slice();
			cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
				possibleMove: false,
				disabled: true
			});
		}

		this.setState({
			cardArray: cardArray,
			possibleMoves: [],
		});
	}*/

	_findPossibleMoves(object){
		let moves = [];
		let allMoves = this._calculateMoves(object);
		if (allMoves.length > 0) {
			moves.push(...allMoves);
		}
		return moves;
	}

	_calculateMoves(card){
		const {
			col: cardCol,
			row: cardRow,
			cardType,
		} = card;

		const cardArray = this.state.cardArray;

		let start = cardCol - 1;
		let end = cardCol + 1;
		let moves = [];

		switch(cardType){
			case "shark":
				return 0;

			case "sea horse":
				let firstRow = cardRow - 2;
				if (firstRow in cardArray) {
					let searchRow = cardArray[firstRow];
					if (searchRow.indexOf(searchRow[cardCol - 1]) in searchRow) {
						moves.push(
							{"row" : firstRow, "col" : cardCol - 1}
						);
					}
					if (searchRow.indexOf(searchRow[cardCol + 1]) in searchRow) {
						moves.push(
							{"row" : firstRow, "col" : cardCol + 1}
						);
					}
				}
				let secondRow = cardRow - 1;
				if (secondRow in cardArray) {
					let searchRow =  cardArray[secondRow];
					if (searchRow.indexOf(searchRow[cardCol - 2]) in searchRow) {
						moves.push(
							{"row" : secondRow, "col" : cardCol - 2}
						);
					}
					if (searchRow.indexOf(searchRow[cardCol + 2]) in searchRow) {
						moves.push(
							{"row" : secondRow, "col" : cardCol + 2}
						);
					}
				}
				let thirdRow = cardRow + 1;
				if (thirdRow in cardArray) {
					let searchRow =  cardArray[thirdRow];
					if ((searchRow.indexOf(searchRow[cardCol - 2])) in searchRow) {
						moves.push(
							{"row" : thirdRow, "col" : cardCol - 2}
						);
					}
					if ((searchRow.indexOf(searchRow[cardCol + 2])) in searchRow) {
						moves.push(
							{"row" : thirdRow, "col" : cardCol + 2}
						);
					}
				}
				let fourthRow = cardRow + 2;
				if (fourthRow in cardArray) {
					let searchRow =  cardArray[fourthRow];
					if ((searchRow.indexOf(searchRow[cardCol - 1])) in searchRow) {
						moves.push(
							{"row" : fourthRow, "col" : cardCol - 1}
						);
					}
					if ((searchRow.indexOf(searchRow[cardCol + 1])) in searchRow) {
						moves.push(
							{"row" : fourthRow, "col" : cardCol + 1}
						);
					}
				}
			break;

			case "mermaid":
				let topLeftRow = cardRow - 1;
				let topLeftId = cardCol - 1;
				while((topLeftRow in cardArray) && (topLeftId in cardArray[topLeftRow])){
					moves.push(
						{"row" : topLeftRow, "col" : topLeftId}
					);
					topLeftRow--;
					topLeftId--;
				}
				let topRightRow = cardRow - 1;
				let topRighId = cardCol + 1;
				while((topRightRow in cardArray) && (topRighId in cardArray[topRightRow])){
					moves.push(
						{"row" : topRightRow, "col" : topRighId}
					);
					topRightRow--;
					topRighId++;
				}
				let bottomLeftRow = cardRow + 1;
				let bottomLeftId = cardCol - 1;
				while((bottomLeftRow in cardArray) && (bottomLeftId in cardArray[bottomLeftRow])){
					moves.push(
						{"row" : bottomLeftRow, "col" : bottomLeftId}
					);
					bottomLeftRow++;
					bottomLeftId--;
				}
				let bottomRightRow = cardRow + 1;
				let bottomRighId = cardCol + 1;
				while((bottomRightRow in cardArray) && (bottomRighId in cardArray[bottomRightRow])){
					moves.push(
						{"row" : bottomRightRow, "col" : bottomRighId}
					);
					bottomRightRow++;
					bottomRighId++;
				}
			break;

			default:
			for (let r = (cardRow - 1); r < (cardRow + 2); r++) {
				if (r in cardArray) {
					const cardRowArray = cardArray[r];
					for(let i = start; i < (end + 1); i++){
						if (i in cardRowArray)  {
							if ((i === cardCol) && (cardRow === r)){

							} else {
								if (cardType === "horizontal vertical") {
									if ((i === cardCol) ^ (cardRow === r)){
										moves.push(
											{"row" : r, "col" : i}
										);
									}
								} 
								else if (cardType === "diagonal") {
									if ((i !== cardCol) && (cardRow !== r)){
										moves.push(
											{"row" : r, "col" : i}
										);
									}
								}
								else {
									moves.push(
										{"row" : r, "col" : i}
									);
								}
							}
						}
					}
				}
			}
		}
		//console.log(moves);
		return moves;
	}

	_getPlayerUnitsFromObject(object){
		const units = object.units;
		if (units.length > 0) {
			return units;
		} else {
			return false;
		}
	}

	_getCurrentPlayerUnitFromObject(objectUnits){
		if (objectUnits !== false && objectUnits.length > 0) {
			for(let unit of objectUnits){
				if (unit.playerId === this.state.currentPlayerId) {
					return unit;
				}
			}
		} else {
			return false;
		}
	}

	//Click on a card
	//- Check how many current player units are on the card
	//- If there is at least one, highlight the possible moves based on the card type

	//- If there are no current player units, check this id if the current unit
	//- if there is a current unit with current player id, check if this is a possible move
	//- If it is a possible move, store the old row and col from the unit and then add the unit to the new card
	//- Get the card row and col from the unit and use those to remove the unit from the previous card

	//
	_handleClick(object){

		//const { cardArray, playerUnitsArray, possibleMoves } = this.state;
		const cardArray = this.state.cardArray.slice();
		const playerUnitsArray = this.state.playerUnitsArray.slice();
		const possibleMoves = this.state.possibleMoves;

		//console.log(this.state.playerUnitsArray);
		//Get all units from the card
		let objectUnits = this._getPlayerUnitsFromObject(object);
		let currentPlayerUnit = 0;

		//If there are units, check if any belonf to the current player and return the first one
		if (objectUnits.length > 0) {
			currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
		}

		//console.log(currentPlayerUnit);
		//console.log(this.state.possibleMoves.length);

		//If there is a unit that belong to the current player and there aren't any possible moves, yet
		if (currentPlayerUnit !== 0 && this.state.possibleMoves.length === 0) {
			
			//Highlight all the possible moves
			this._higlightPossibleMoves(object);

			//Store the current player unit
			this.setState({
				currentPlayerUnit: currentPlayerUnit,
			});
		} else 
		//There are possible moves
		if (this.state.possibleMoves.length > 0) {
			
			//If the object allows for a possible move
			if(object.possibleMove === true){

				//Remove unit and clear all moves
				let updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
				
				let { cardsUpdatedWithUnitsArray, updatedUnitsArray }  = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

				this.setState({
					cardArray: cardsUpdatedWithUnitsArray,
					possibleMoves: [],
					playerUnitsArray: updatedUnitsArray
				});
				/*
				//Remove the current player unit from its current card
				this._removeUnitFromObject(this.state.currentPlayerUnit);

				this._clearPossibleMoves();
				//this._removeUnitClearPossibleMoves(this.state.currentPlayerUnit);

				//Add the current player unit to a new card
				this._addUnitToCard(cardArray[object.row][object.col],this.state.currentPlayerUnit);*/
				
			} else {
				alert("invalid move");
			}

		}
		//alert("This card does not have units");

	}

}

///
class PlayerTurn extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {

		}

	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div></div>
		);
	}
}


///Old code
/*_removeUnitClearPossibleMoves(unit){
		const cardArray = this.state.cardArray.slice();
		let cardUnitsArray = cardArray[unit.row][unit.col].units.slice();
		let possibleMoves = this.state.possibleMoves.slice();
		let playerUnitsArray = this.state.playerUnitsArray.slice();

		//Find the unit in the unit array and remove it
		for(let i = 0; i < cardUnitsArray.length+1; i++){
			if (cardUnitsArray[i].id === playerUnitsArray[unit.id].id) {
				console.log("unit found and removed");
				cardUnitsArray.splice(i);
			}
		}

		//Update
		//playerUnitsArray[unit.id] = Object.assign({}, playerUnitsArray[unit.id], {
		//	row: 0,
		//	col: 0
		//});

		//assign the updated unit array back to the card
		cardArray[unit.row] = cardArray[unit.row].slice();
		cardArray[unit.row][unit.col] = Object.assign({}, cardArray[unit.row][unit.col], {
			units: cardUnitsArray,
			disabled: true
		});

		//Loop through the possible moves and update the cards accordingly
		for(let position of possibleMoves){
			cardArray[position.row] = cardArray[position.row].slice();
			cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
				possibleMove: false,
				disabled: true
			});
		}

		console.log(cardArray);

		this.setState({
			cardArray: cardArray,
			possibleMoves: [],
		});
		return unit;
	}
*/
	/*_higlightPossibleMoves(card){

		const cardArray = this.state.cardArray;
		let possibleMoves = this.state.possibleMoves.slice();

		possibleMoves = this._findPossibleMoves(card);

		let updatedCardArray = [];
		
		//Loop through 
		for(let position of possibleMoves){
			updatedCardArray.push(
				updatedCardArray = update(cardArray, {
				[position.row]: {
						[position.col]: {
							props: {
								possibleMove: {
									$set: true
								},
								disabled: {
									$set: false
								}
							}
						}
					}
				})
			)
		}

		this.setState({
			cardArray: updatedCardArray,
			possibleMoves: possibleMoves,
		});

	}*/


	/*_displayPlayerBoats(playerBoatsArray){
		return playerBoatsArray.map((boat) => {
			return(
				<PlayerBoat
					key = 			{boat.row + "" + boat.id}
					row = 			{boat.row}
					id =  			{boat.id}
					units = 		{boat.units}
					playerId = 		{boat.playerId}
					playerName = 	{boat.playerName}
					possibleMove = 	{boat.possibleMove}
					onClick = 	   	{() => this._handleClick(boat)}
				/>
			)
		});
	}*/

		/*_displayPlayerUnits(playerUnitsArray){
		return playerUnitsArray.map((unit) => {
			return(
				<PlayerUnit
					key = 		{unit.id}
					row =		{unit.row}
					id =  		{unit.id}
					playerId = 	{unit.playerId}
					playerName = {unit.playerName}
				/>
			)
		});
	}*/

	//top
		//if(cardRow > 1){
			/*let topMoves = this._calculateMoves(card,"top");
			if (topMoves.length > 0) {
				moves.push(...topMoves);
			}*/
			
			/*const topCardRowArray = cardArray[cardRow - 1];
			let row = cardRow - 1; 
			for(let i = start; i < (end + 1); i++){
				if (i in topCardRowArray) {
					moves.push(row + "-" + i);
				}
			}*/
		//}

		//Left and right
		//moves.push(...this._calculateMoves(card,"left-right"));
		
		/*const centerCardRowArray = cardArray[cardRow];
		for(let i = start; i < (end + 1); i++){
			if ((i in centerCardRowArray) && i !== cardId)  {
				moves.push(cardRow + "-" + i);
			}
		}*/

		//bottom
		//if(cardRow < NUMBER_OF_ROWS){
			/*let bottomMoves = this._calculateMoves(card,"bottom");
			if (bottomMoves.length > 0) {
				moves.push(...bottomMoves);
			}*/
			/*const bottomCardRowArray = cardArray[cardRow + 1];
			let row = cardRow + 1; 
			for(let i = start; i < (end + 1); i++){
				if (i in bottomCardRowArray) {
					moves.push(row + "-" + i);
				}
			}*/
		//}
		//console.log(moves);

		/*_calculateMoves(card,direction){
		const cardId = card.id;
		const cardRow = card.row;
		const cardArray = this.state.cardArray.slice();
		let start = cardId - 1;
		let end = cardId + 1;
		let moves = [];
		let searchRow = "";
		switch (direction){
		case "top":
			searchRow = (cardRow - 1);
			break;
		case "left-right":
			searchRow = cardRow;
			break;
		case "bottom":
			searchRow = (cardRow + 1);
			break;
		}
		if (searchRow in cardArray) {
			const cardRowArray = cardArray[searchRow];
			for(let i = start; i < (end + 1); i++){
				if (i in cardRowArray)  {
					if ((i === cardId) && (cardRow === searchRow)){

					} else {
						let moveInfo = {
							"row" : searchRow,
							"id" : i
						};
						moves.push(moveInfo);
					}
					//if ((i === cardId) ^ (cardRow === searchRow)) {
					//	moves.push(searchRow + "-" + i);
					//}
				}
			}
			return moves;
		}
		return 0;
	}*/


	/*_findPossibleMoves(card){
		const cardId = card.id;
		let moves = [];
			//top
			//Make sure the card is not at the very top
			if (cardId > NUMBER_OF_ROWS) {
				let topLeftRange = 7;
				let topRightRange = 3;
				//left
				//Check if the card is at the left edge
				if( cardId % NUMBER_OF_ROWS === 1) {
					topLeftRange -=1;
				}
				//right
				//Check if the card is at the right edge
				if (cardId % NUMBER_OF_ROWS === 0) {
					topRightRange +=1;
				}
				//Add all the cards to the moves based on the range
				for(let i = (cardId - topLeftRange); i < (cardId - (topRightRange + 1)); i++) {
					moves.push(i);
				}
			}
			//left side
			//Check if the card is not at the left edge
			if( cardId % NUMBER_OF_ROWS !== 1) {
				//Add the card to the left to possible moves
				moves.push(cardId-1);
			}
			//right side
			//Check if the card is not at the right edge
			if (cardId % NUMBER_OF_ROWS !== 0) {
				//Add the card to the right to possible moves
				moves.push(cardId+1);
			}
			//bottom
			//Make sure the card is not at the very bottom
			if (cardId < (DEFAULT_NUMBER_OF_CARDS - NUMBER_OF_ROWS)) {
				let bottomLeftRange = 5;
				let bottomRightRange = 7;
				//left
				//Check if the card is at the left edge
				if( cardId % NUMBER_OF_ROWS === 1) {
					bottomLeftRange +=1;
				}
				//right
				//Check if the card is at the right edge
				if (cardId % NUMBER_OF_ROWS === 0) {
					bottomRightRange -=1;
				}
				//Add all the cards to the moves based on the range
				for(let i = (cardId + bottomLeftRange); i < (cardId + (bottomRightRange + 1)); i++) {
					moves.push(i);
				}
			}
			console.log(moves);
		return moves;
	}*/

	/*cardArray[object.id] = this._addUnitToCard(cardArray[object.id], this.state.playerUnitsArray[1])

		this.setState({
			cardArray: cardArray
		});*/

		/*console.log("Object id:");
		console.log(object.id);
		console.log("Card Array:");
		console.log(this.state.cardArray);
		console.log("Object in the array:");
		console.log(this.state.cardArray[object.id]);*/
		
		//const playersArray = this.state.playerUnitsArray.slice();
		
		//console.log(this.state.cardArray[object.id].props.units);


		/*const playerUnitsArray = this.state.playerUnitsArray.slice();

		const currentPlayerId = this.props.playersArray[1].playerId;
		const currentPlayerUnitId = playerUnitsArray[1].id;

		for(let index in playerUnitsArray){
			if (playerUnitsArray[index].playerId === currentPlayerId) {
				if (playerUnitsArray[index].id === currentPlayerUnitId) {
					playerUnitsArray[index].currentLocationCardId = object.id;
				}
			}
		}

		this.setState({
			playerUnitsArray: playerUnitsArray
		})*/

		
		/*this.setState((state, props) = ({
			cardArray: cardArray
		}));*/

		//console.log(this._findPlayerUnit(5))
		//console.log(cardArray[object.id].units);




		/*const cardArray = this.state.cardArray[object.id].props.units.slice();
		cardArray = this.state.playerUnitsArray[1];*/
		//this._addPlayerToCard(cardId,1);
		//console.log(this);
		//alert("Card " + cardId + " was clicked");

		/*_findPlayerById(playerId){
		
		for (let i = 1; i < this.props.playersArray.length + 1; i++) {
			if( this.props.playersArray[i].props.id === playerId){
				return this.props.playersArray[i].props.name;
			}
		}
		return "not found";

		//return this.props.playersArray[1].props.name;
		console.log(this.props.playersArray[1].props.id);
		console.log(playerId);

		const playersArray = this.props.playersArray;
		//console.log(this.props.playersArray[1].props);
		const player = playersArray.find( player => player.id == playerId);
		return player;
	}*/

	//Search through all of the units and find all that are located on a card
	

	/*_findPlayerUnit(unitId){
		const cardArray = this.state.cardArray;
		return cardArray[1];
		//for(let index in cardArray){
			//console.log(cardArray[index].props.units.length());
			if (cardArray[index].units.length > 0) {
				let unitArray = cardArray[index].units;
				return unitArray;
				for( let unitIndex in unitArray ) {
					if (unitArray[unitIndex].props.id == unitId) {
						return `unit with id ${unitId} is in card with id ${cardArray[index].props.id}`
					}
				
			}}
		//}
		//return `unit with id ${unitId} has not been found`;
	}*/