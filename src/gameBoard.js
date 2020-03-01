import React from 'react';
//import update from 'immutability-helper';

import Card from './card';
import { PlayerUnit, PlayerBoat } from './player';
import OuterWater from './outerWater';

import { NUMBER_OF_ROWS, NUMBER_CARDS_PER_ROW, CARD_TYPES } from './constants';

export default class GameBoard extends React.Component {
	constructor(props) {
		super(props);

		this.defaults = {
			cardDatabase: CARD_TYPES,
			numberCardsPerRow: NUMBER_CARDS_PER_ROW,
		}
		this.state = {
			playerUnitsArray: 	this._createPlayerUnits(this.props.playersArray),
			cardArray: 			this._createCards(),
			outerWaterArray: 	this._createOuterWater(), //this._createPlayerBoats(this.props.playersArray)
			playerBoatsArray: 	this._createPlayerBoats(this.props.playersArray),
			possibleMovesCard: 	[],
			possibleMovesBoat: 	[],
			currentPlayerId: 	1,
			currentPlayerUnit: 	"",
			currentPlayerBoat: 	""
		}
		//console.log(this.state.cardArray);
		//this._debug();
	}

	//Used for testing
	componentDidMount() {
		//this._debug({row: 1, col: 1});
		//this._debug2();
		this._debug();
	}

	_debug( cardLocation = {row: 1, col: 1}, boatLocation = {row: 0, col: 1}){

		//Add a test unit to card
		let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.playerUnitsArray[1], this.state.cardArray[cardLocation.row][cardLocation.col], this.state.playerUnitsArray, this.state.cardArray);
		this.setState({
			cardArray: objectsUpdatedWithUnitsArray,
			playerUnitsArray: updatedUnitsArray,
		});

		//Add a test boat to outer water
		let { outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray } = this._addPlayerBoatToOuterWater(this.state.playerBoatsArray[1], this.state.outerWaterArray[boatLocation.row][boatLocation.col], this.state.playerBoatsArray, this.state.outerWaterArray);
		this.setState({
			outerWaterArray: outerWaterUpdatedWithBoatsArray,
			playerBoatsArray: updatedPlayerBoatsArray,
		});

		//this._addPlayerBoatToOuterWater(this.state.outerWaterArray[0][1], this.state.playerBoatsArray[1]);
		//console.log(this.state.outerWaterArray[0][1]);
	}

	_debug2(){

		//const playerBoatsArray = this.state.playerBoatsArray;
		//const 
		//Add a test unit to a boat
		let { objectsUpdatedWithUnitsArray, updatedUnitsArray, outerWaterUpdatedWithBoatsArray } = this._addUnitToBoat(this.state.playerUnitsArray[1], this.state.playerBoatsArray[1], this.state.playerUnitsArray, this.state.playerBoatsArray, this.state.outerWaterArray);
		

		this.setState({
			outerWaterArray: outerWaterUpdatedWithBoatsArray,
			playerBoatsArray: objectsUpdatedWithUnitsArray,
			playerUnitsArray: updatedUnitsArray,
		});
	}

	_debug3( boatLocation = {row: 0, col: 1} ){
		/*var { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.playerUnitsArray[1], this.state.cardArray[3][4], this.state.playerUnitsArray, this.state.cardArray);
		this.setState({
			cardArray: objectsUpdatedWithUnitsArray,
		});*/

		//Add a test boat to outer water
		let { outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray } = this._addPlayerBoatToOuterWater(this.state.playerBoatsArray[1], this.state.outerWaterArray[0][1], this.state.playerBoatsArray, this.state.outerWaterArray);

		return { outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray };
	}

	_debug4(){
		let updatedBoat = this._debug3({row: 0, col: 1});

		let { objectsUpdatedWithUnitsArray, updatedUnitsArray, outerWaterUpdatedWithBoatsArray } = this._addUnitToBoat(this.state.playerUnitsArray[1], updatedBoat.updatedPlayerBoatsArray[1], this.state.playerUnitsArray, updatedBoat.updatedPlayerBoatsArray, updatedBoat.outerWaterUpdatedWithBoatsArray);
		
		//console.log(outerWaterUpdatedWithBoatsArray);

		this.setState({
			playerBoatsArray: objectsUpdatedWithUnitsArray,
			playerUnitsArray: updatedUnitsArray,
			outerWaterArray: outerWaterUpdatedWithBoatsArray,
		});
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		let cardArray = [];
		for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
			cardArray[i] = this._displayCards(this.state.cardArray[i]);
		}
		let topWater = this._displayOuterWater(this._getOuterWater("top"));
		let bottomWater = this._displayOuterWater(this._getOuterWater("bottom"));
		let leftWater = this._displayOuterWater(this._getOuterWater("left"));
		let rightWater = this._displayOuterWater(this._getOuterWater("right"));

		return(
			<div className="container">
				<div className="row">
					<div className="col-12">
						{this.props.playersArray[this.state.currentPlayerId]}
					</div>
				</div>
				<div className="row">
					<div className="col-10 offset-md-1">
						<div className="row">
							{/* This is where the boats will go */}
							{topWater}
						</div>
					</div>
				</div>
				<div id={this.props.cardsHolderId} className="row">
					<div className="col-1">
						<div className="row">
							{/* This is where the boats will go */}
							{leftWater}
						</div>
					</div>
					<div className="col-sm-10">
						<div className="row">
							{cardArray}
						</div>
					</div>
					<div className="col-1">
						<div className="row">
							{/* This is where the boats will go */}
							{rightWater}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-10 offset-md-1">
						<div className="row">
							{/* This is where the boats will go */}
							{bottomWater}
						</div>
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
			outerWaterArray[0][i] = { row: 0, col: i, playerBoat: "", possibleMove: false, disabled: true, cardClass: "col-sm-2 cardObject no-gutters", objectType: "outerWater", cardType: "horizontal vertical" }
		}
		//bottom
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[NUMBER_OF_ROWS + 1][i] = { row: NUMBER_OF_ROWS + 1, col: i, playerBoat: "", possibleMove: false, disabled: true, cardClass: "col-sm-2 cardObject no-gutters", objectType: "outerWater", cardType: "horizontal vertical" }
		}

		//left
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[i][0] = { row: i, col: 0, playerBoat: "", possibleMove: false, disabled: true, cardClass: "col-sm-12 cardObject no-gutters", objectType: "outerWater", cardType: "horizontal vertical" }
		}
		//right
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			outerWaterArray[i][NUMBER_OF_ROWS + 1] = { row: i, col: NUMBER_OF_ROWS + 1, playerBoat: "", possibleMove: false, disabled: true, cardClass: "col-sm-12 cardObject no-gutters", objectType: "outerWater", cardType: "horizontal vertical" }
		}

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
					displayArray.push(outerWaterArray[NUMBER_CARDS_PER_ROW + 1][i]);
				}
			break;
			case "left":
				for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
					displayArray.push(outerWaterArray[i][0]);
				}
			break;
			case "right":
				for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
					displayArray.push(outerWaterArray[i][NUMBER_OF_ROWS + 1]);
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
					objectType =   {outerWater.objectType}
					cardType =	   {outerWater.cardType}
					possibleMove = {outerWater.possibleMove}
					cardClass =	   {outerWater.cardClass ? outerWater.cardClass : ""}
					//onClick = 	   {() => this._handleClick(outerWater)}
					onClick = 	   {outerWater.disabled ? null : () => this._handleClick(outerWater)}
					disabled = 	   {outerWater.disabled}
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
			playerBoatsArray[index] = { id: index, row: 0, col: 0, units: [], possibleMove: false, objectType: "boat", playerId: playersArray[index].props.id, playerName: playersArray[index].props.name, disabled: true, location: "" }
		};

		return playerBoatsArray;
	}

	_addPlayerBoatToOuterWater(boat,spot,playerBoatsArray,outerWaterArray){
		let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();
		let updatedPlayerBoatsArray = playerBoatsArray.slice();
		
		//Update the boats
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

		return playerUnitsArray;
		
	}

	///////////////////
	/// Cards
	///////////////////
	_createCards(){
		let cardArray = [];

		for (let r = 1; r < NUMBER_OF_ROWS + 1; r++) {
			cardArray[r] = [];
			for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
				//Check if the card is at the edge
				let isEdge = this._isAtTheEdge(r,i);
				
				/*if ( r === 1 || r === 6 || i === 1 || i === 6) {
					isEdge = true;
				}*/
				cardArray[r][i] = { row: r, col: i, cardType: "horizontal vertical", units: [], possibleMove: false, cardImage: this.props.cardImagesArray[0], disabled: true, objectType: "card", edge: isEdge };
			}
		}

		return cardArray;
	}

	//
	_isAtTheEdge(r,c){
		if ( r === 1 || r === this.defaults.numberCardsPerRow || c === 1 || c === this.defaults.numberCardsPerRow) {
			return true
		}
		else {
			return false;
		}
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
					edge =		   {card.edge}
					//onClick = 	   {() => this._handleClick(card)}
					onClick = 	   {card.disabled ? null : () => this._handleClick(card)}
					disabled = 	   {card.disabled}
				/>
			)
		});
	}

	_addUnitToBoat(unit,boat,playerUnitsArray,objectArray,outerWaterArray){
		let objectsUpdatedWithUnitsArray = objectArray.slice();
		let updatedUnitsArray = playerUnitsArray.slice();
		let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();
		
		updatedUnitsArray = this._updateObjectWithNewLocation(unit,boat,playerUnitsArray);

		//Update the units
		objectsUpdatedWithUnitsArray[boat.id] = Object.assign({}, objectsUpdatedWithUnitsArray[boat.id], {
			units: objectsUpdatedWithUnitsArray[boat.id].units.concat(updatedUnitsArray[unit.id]),
			disabled: false
		});

		outerWaterUpdatedWithBoatsArray[boat.row] = outerWaterUpdatedWithBoatsArray[boat.row].slice();

		outerWaterUpdatedWithBoatsArray[boat.row][boat.col] = Object.assign({}, outerWaterUpdatedWithBoatsArray[boat.row][boat.col], {
			playerBoat: objectsUpdatedWithUnitsArray[boat.id],
		});

		return {objectsUpdatedWithUnitsArray, updatedUnitsArray, outerWaterUpdatedWithBoatsArray};
	}

	/*_removeUnitFromBoat(findUnit,boat,objectArray,outerWaterArray){
		let updatedPlayerBoatsArray = objectArray.slice();
		let updatedOuterWaterArray = outerWaterArray.slice();

		//Get the units from the boat
		let objectUnitsArray = updatedPlayerBoatsArray[boat.id].units;
		
		//Get the unit to be removed
		const theUnit = objectUnitsArray.find( unit => unit.id === findUnit.id );
		
		//Remove the unit
		let updatedObjectUnitArray = updatedPlayerBoatsArray[boat.id].units.filter(unit => unit.id !== theUnit.id);

		//Update the boats array
		updatedPlayerBoatsArray[boat.id] = Object.assign({}, updatedPlayerBoatsArray[boat.id], {
			units: updatedObjectUnitArray,
			disabled: true
		});

		//Update the outer water array
		updatedOuterWaterArray[boat.row][boat.col] = Object.assign({}, updatedOuterWaterArray[boat.row][boat.col], {
			playerBoat: updatedPlayerBoatsArray[boat.id],
		});

		return {updatedPlayerBoatsArray, updatedOuterWaterArray};
	}*/
	_removeUnitFromBoat(findUnit,boat,boatArray) {
		let updatedPlayerBoatsArray = boatArray.slice();

		//Get the units from the boat
		let objectUnitsArray = updatedPlayerBoatsArray[boat.id].units;
		
		//Get the unit to be removed
		const theUnit = objectUnitsArray.find( unit => unit.id === findUnit.id );
		
		//Remove the unit
		let updatedObjectUnitArray = updatedPlayerBoatsArray[boat.id].units.filter(unit => unit.id !== theUnit.id);

		//Update the boats array
		updatedPlayerBoatsArray[boat.id] = Object.assign({}, updatedPlayerBoatsArray[boat.id], {
			units: updatedObjectUnitArray,
			disabled: true
		});

		return updatedPlayerBoatsArray;
	}

	_updateUnitsOnBoat(boat,playerBoatsArray,playerUnitsArray) {
		let updatedPlayerBoatsArray = playerBoatsArray.slice();
		let updatedUnitsArray = [];

		//Get the units from the boat
		let objectUnitsArray = updatedPlayerBoatsArray[boat.id].units;
		if (objectUnitsArray.length > 0) {
			for(let unit of objectUnitsArray){
				updatedUnitsArray.push(this._updateObjectWithNewLocation(unit,boat,playerUnitsArray))
			}
			playerBoatsArray[boat.id] = Object.assign({}, playerBoatsArray[boat.id], {
				units: updatedUnitsArray,
			});
		}
	}

	_updateOuterWaterBoat(boat, boatArray, outerWaterArray, options = {}){
		let updatedOuterWaterArray = outerWaterArray.slice();

		let defaults = {
			playerBoat: boatArray[boat.id],
			disabled: true
		}

		let settings = Object.assign({}, defaults, options);

		updatedOuterWaterArray[boat.row] = updatedOuterWaterArray[boat.row].slice();

		updatedOuterWaterArray[boat.row][boat.col] = Object.assign({}, updatedOuterWaterArray[boat.row][boat.col], {
			playerBoat: options.playerBoat,
			disabled: options.disabled
		});

		return updatedOuterWaterArray;
	}

	_addUnitToObject(unit,object,playerUnitsArray,objectArray){
		let objectsUpdatedWithUnitsArray = objectArray.slice();
		let updatedUnitsArray = playerUnitsArray.slice();

		//Update the location of the unit  to match the object
		updatedUnitsArray = this._updateObjectWithNewLocation(unit,object,playerUnitsArray);

		objectsUpdatedWithUnitsArray[object.row] = objectsUpdatedWithUnitsArray[object.row].slice();
		objectsUpdatedWithUnitsArray[object.row][object.col] = Object.assign({}, objectsUpdatedWithUnitsArray[object.row][object.col], {
			units: objectsUpdatedWithUnitsArray[object.row][object.col].units.concat(updatedUnitsArray[unit.id]),
			disabled: false
		});

		return {objectsUpdatedWithUnitsArray, updatedUnitsArray};
	}

	//Update the location of the unit  to match the object
	_updateObjectWithNewLocation(object,location,objectsArray){
		let objectWithUpdatedLocation = objectsArray.slice();

		//Update
		objectWithUpdatedLocation[object.id] = Object.assign({}, objectWithUpdatedLocation[object.id], {
			row: location.row,
			col: location.col,
			location: location.objectType,
		});

		return objectWithUpdatedLocation;
	}

	/*_removeUnitFromObject(findUnit,objectArray){
		let updatedObjectArray = objectArray;
		let objectUnitsArray = updatedObjectArray[findUnit.row][findUnit.col].units;
		const theUnit = objectUnitsArray.find( unit => unit.id === findUnit.id );
		let updatedObjectUnitArray = updatedObjectArray[findUnit.row][findUnit.col].units.filter(unit => unit.id !== theUnit.id);

		updatedObjectArray[findUnit.row][findUnit.col] = Object.assign({}, updatedObjectArray[findUnit.row][findUnit.col], {
			units: updatedObjectUnitArray,
			disabled: true
		});

		return updatedObjectArray;
		
	}*/

	_removeUnitFromObject(findUnit,objectArray){
		let updatedObjectArray = objectArray;
		let objectUnitsArray = updatedObjectArray[findUnit.row][findUnit.col].units;
		const theUnit = objectUnitsArray.find( unit => unit.id === findUnit.id );
		let updatedObjectUnitArray = updatedObjectArray[findUnit.row][findUnit.col].units.filter(unit => unit.id !== theUnit.id);

		updatedObjectArray[findUnit.row][findUnit.col] = Object.assign({}, updatedObjectArray[findUnit.row][findUnit.col], {
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

	_higlightPossibleMoves(object){
		const cardArray = this.state.cardArray.slice();
		const outerWaterArray = this.state.outerWaterArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		
		let possibleMovesCard = this.state.possibleMovesCard.slice();
		let possibleMovesBoat = this.state.possibleMovesBoat.slice();

		let objectUnits = 0;
		let currentPlayerUnit = 0;
		let currentPlayerBoat = "";

		if (object.objectType === "card") {
			//Get all of the unit from the object
			objectUnits = this._getPlayerUnitsFromObject(object);
			//use that to get the current player unit
			currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
			//Find all possible moves
			possibleMovesCard = this._findPossibleMoves(object, cardArray);

			if (object.edge === true) {
				//The card is neat the edge so use its location to search the outer water
				let boatLocations = this._findPossibleMoves(object, outerWaterArray);
				//Get the player boat using 
				let playerBoat = playerBoatsArray[this.state.currentPlayerId];

				for(let boat of boatLocations){
					if (boat.row === playerBoat.row && boat.col === playerBoat.col) {
						possibleMovesBoat = [playerBoat];
					}
				}

			}

		} else
		//A boat has been cliced on
		if (object.objectType === "outerWater") {
			//Get the boat from the outer water
			currentPlayerBoat = object.playerBoat;
			if (currentPlayerBoat !== "") {
				//get the possible moves for the boat along the outer water
				possibleMovesBoat = this._findPossibleMoves(currentPlayerBoat, outerWaterArray);
				//Get all units from the boat
				objectUnits = this._getPlayerUnitsFromObject(currentPlayerBoat);
				if (objectUnits !== false) {
					//use that to get the current player unit
					currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
					possibleMovesCard = this._findPossibleMoves(object, cardArray);
				}
			}
		}

		if (possibleMovesCard.length > 0 ) {
			//There are possible moves for the card so display them
			for(let position of possibleMovesCard){
				cardArray[position.row] = cardArray[position.row].slice();
				cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
					possibleMove: true,
					disabled: false
				});
			}
		}
		if (possibleMovesBoat.length > 0 ) {
			//There are possible moves for the boat so display them
			for(let position of possibleMovesBoat){
				outerWaterArray[position.row] = outerWaterArray[position.row].slice();
				outerWaterArray[position.row][position.col] = Object.assign({}, outerWaterArray[position.row][position.col], {
					possibleMove: true,
					disabled: false
				});
			}
		}

		this.setState({
			cardArray: cardArray,
			outerWaterArray: outerWaterArray,
			//playerBoatsArray: playerBoatsArray,
			possibleMovesCard: possibleMovesCard,
			possibleMovesBoat: possibleMovesBoat,
			currentPlayerUnit: currentPlayerUnit,
			currentPlayerBoat: currentPlayerBoat
		});
				
	}
	/*_higlightPossibleMoves(object, objectItems){

		const cardArray = this.state.cardArray.slice();
		const outerWaterArray = this.state.outerWaterArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		
		//let possibleMovesCard = this.state.possibleMoves.slice();
		//let possibleMovesBoat = this.state.possibleMovesBoat.slice();

		let possibleMovesCard = [];
		let boatLocation = [];
		let possibleMovesBoat = [];

		//possibleMoves = this._findPossibleMoves(object, cardArray);

		if (object.objectType === "card") {
			//If thie object clicked is a card, find all possible cards 
			possibleMovesCard = this._findPossibleMoves(object, cardArray);
			
			let boatLocation = this._findPossibleMoves(playerBoatsArray[this.state.currentPlayerId], outerWaterArray);
		}
		else
		if (object.objectType === "outerWater") {
			//If the object clicked is outer water, check if it has a boat
			if (object.playerBoat !== "") {
				//get the possible moves for the boat along the outer water
				possibleMovesBoat = this._findPossibleMoves(object, outerWaterArray);
				//Get at least one player unit from the boat
				let objectUnits = this._getPlayerUnitsFromObject(object.playerBoat);
				
				if (objectUnits !== false) {
					let boatUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
					//Boat usnit has been found so find the possible moves for the unit along the cards
					possibleMovesCard = this._findPossibleMoves(object, cardArray);
				}
			}
			//alert("outerWater will get highlighted");
		}

		if (possibleMovesCard.length > 0 ) {
			//There are possible moves for the card so display them
			for(let position of possibleMovesCard){
				cardArray[position.row] = cardArray[position.row].slice();
				cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
					possibleMove: true,
					disabled: false
				});
			}
		}
		if (possibleMovesBoat.length > 0 ) {
			//There are possible moves for the boat so display them
			for(let position of possibleMovesBoat){
				outerWaterArray[position.row] = outerWaterArray[position.row].slice();
				outerWaterArray[position.row][position.col] = Object.assign({}, outerWaterArray[position.row][position.col], {
					possibleMove: true,
					disabled: false
				});
			}
		}

		this.setState({
			cardArray: cardArray,
			outerWaterArray: outerWaterArray,
			possibleMoves: possibleMovesCard,
			possibleMovesBoat: possibleMovesBoat,
			playerBoatsArray: playerBoatsArray
		});
		return { possibleMovesCard, possibleMovesBoat };
	}*/

	/*_higlightPossibleMoves(card){
		const cardArray = this.state.cardArray.slice();
		let possibleMoves = this.state.possibleMoves.slice();

		//console.log(cardArray);
		possibleMoves = this._findPossibleMoves(card);
		for(let position of possibleMoves){
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
	}*/

	/*_findPossibleMoves(object, objectArray){
		let moves = [];
		let allMoves = this._calculateMoves(object, objectArray);
		if (allMoves.length > 0) {
			moves.push(...allMoves);
		}
		//console.log(moves);
		return moves;
	}*/

	_findPossibleMoves(object, objectArray){
		const {
			col: objectCol,
			row: objectRow,
			cardType,
			edge,
			objectType,
		} = object;

		let start = objectCol - 1;
		let end = objectCol + 1;
		let moves = [];

		//console.log(objectType);
		//console.log(objectArray);

		//objectArray[0] = [this.state.playerBoatsArray[this.state.currentPlayerId]];
		/*if (object.edge === true) {
			let boat = this.state.playerBoatsArray[this.state.currentPlayerId];
			moves.push(
				{"row" : boat.row, "col" : boat.col}
			);
		}*/

		switch(cardType){
			case "shark":
				return 0;

			case "sea horse":
				let firstRow = objectRow - 2;
				if (firstRow in objectArray) {
					let searchRow = objectArray[firstRow];
					if (searchRow.indexOf(searchRow[objectCol - 1]) in searchRow) {
						moves.push(
							{"row" : firstRow, "col" : objectCol - 1}
						);
					}
					if (searchRow.indexOf(searchRow[objectCol + 1]) in searchRow) {
						moves.push(
							{"row" : firstRow, "col" : objectCol + 1}
						);
					}
				}
				let secondRow = objectRow - 1;
				if (secondRow in objectArray) {
					let searchRow =  objectArray[secondRow];
					if (searchRow.indexOf(searchRow[objectCol - 2]) in searchRow) {
						moves.push(
							{"row" : secondRow, "col" : objectCol - 2}
						);
					}
					if (searchRow.indexOf(searchRow[objectCol + 2]) in searchRow) {
						moves.push(
							{"row" : secondRow, "col" : objectCol + 2}
						);
					}
				}
				let thirdRow = objectRow + 1;
				if (thirdRow in objectArray) {
					let searchRow =  objectArray[thirdRow];
					if ((searchRow.indexOf(searchRow[objectCol - 2])) in searchRow) {
						moves.push(
							{"row" : thirdRow, "col" : objectCol - 2}
						);
					}
					if ((searchRow.indexOf(searchRow[objectCol + 2])) in searchRow) {
						moves.push(
							{"row" : thirdRow, "col" : objectCol + 2}
						);
					}
				}
				let fourthRow = objectRow + 2;
				if (fourthRow in objectArray) {
					let searchRow =  objectArray[fourthRow];
					if ((searchRow.indexOf(searchRow[objectCol - 1])) in searchRow) {
						moves.push(
							{"row" : fourthRow, "col" : objectCol - 1}
						);
					}
					if ((searchRow.indexOf(searchRow[objectCol + 1])) in searchRow) {
						moves.push(
							{"row" : fourthRow, "col" : objectCol + 1}
						);
					}
				}
			break;

			case "mermaid":
				let topLeftRow = objectRow - 1;
				let topLeftId = objectCol - 1;
				while((topLeftRow in objectArray) && (topLeftId in objectArray[topLeftRow])){
					moves.push(
						{"row" : topLeftRow, "col" : topLeftId}
					);
					topLeftRow--;
					topLeftId--;
				}
				let topRightRow = objectRow - 1;
				let topRighId = objectCol + 1;
				while((topRightRow in objectArray) && (topRighId in objectArray[topRightRow])){
					moves.push(
						{"row" : topRightRow, "col" : topRighId}
					);
					topRightRow--;
					topRighId++;
				}
				let bottomLeftRow = objectRow + 1;
				let bottomLeftId = objectCol - 1;
				while((bottomLeftRow in objectArray) && (bottomLeftId in objectArray[bottomLeftRow])){
					moves.push(
						{"row" : bottomLeftRow, "col" : bottomLeftId}
					);
					bottomLeftRow++;
					bottomLeftId--;
				}
				let bottomRightRow = objectRow + 1;
				let bottomRighId = objectCol + 1;
				while((bottomRightRow in objectArray) && (bottomRighId in objectArray[bottomRightRow])){
					moves.push(
						{"row" : bottomRightRow, "col" : bottomRighId}
					);
					bottomRightRow++;
					bottomRighId++;
				}
			break;

			default:
			//Search row above and below
			for (let r = (objectRow - 1); r < (objectRow + 2); r++) {
				if (r in objectArray) {
					//The row has been found in the array so assign it to a row array
					const objectRowArray = objectArray[r];
					for(let i = start; i < (end + 1); i++){
						if (i in objectRowArray)  {
							//the column has been found in the object row array so find the right coordinates
							if (((i === objectCol) && (objectRow === r))){
							//Ignore the coordinates of the card itself
							} else {
								if (cardType === "horizontal vertical" || objectType === "boat") {
								//The card allows only for horizontal or vertical movement	
									if ((i === objectCol) ^ (objectRow === r)){
										moves.push(
											{"row" : r, "col" : i}
										);
									}
								} 
								else if (cardType === "diagonal") {
									if ((i !== objectCol) && (objectRow !== r)){
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
		//const cardArray = this.state.cardArray.slice();
		//const playerUnitsArray = this.state.playerUnitsArray.slice();
		//const outerWaterArray = this.state.outerWaterArray.slice();
		//const playerBoatsArray = this.state.playerBoatsArray.slice();
		//const possibleMoves = this.state.possibleMoves;
		//const possibleMovesBoat = this.state.possibleMovesBoat;

		//Set defaults
		/*let objectUnits = 0;
		let currentPlayerUnit = 0;
		let objectBoat = "";*/

		//Make sure that neither a unit nor a boat has been set
		if (this.state.currentPlayerUnit === "" && this.state.currentPlayerBoat === "") {
			//A card has been clicked on
			/*if (object.objectType === "card") {
				//Get all of the unit from the object
				objectUnits = this._getPlayerUnitsFromObject(object);
				//use that to get the current player unit
				currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
			} else
			//A boat has been cliced on
			if (object.objectType === "outerWater") {
				//Get the boat from the outer water
				currentPlayerBoat = object.playerBoat;
				if (currentPlayerBoat !== "") {
					//Get all units from the boat
					objectUnits = this._getPlayerUnitsFromObject(currentPlayerBoat);
					//use that to get the current player unit
					currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
				}
			}
			//Store both units and boats from the object
			let objectItems = { unit: currentPlayerUnit, boat: currentPlayerBoat };*/

			//Highlight all the possible moves
			this._higlightPossibleMoves(object);

			//Store the current player unit
			/*this.setState({
				currentPlayerUnit: currentPlayerUnit,
				currentPlayerBoat: 
			});*/
		} else {
			const cardArray = this.state.cardArray.slice();
			const outerWaterArray = this.state.outerWaterArray.slice();

			const playerUnitsArray = this.state.playerUnitsArray.slice();
			const playerBoatsArray = this.state.playerBoatsArray.slice();

			let updatedCardArray = cardArray;
			let updatedUnitsArray = playerUnitsArray;
			let updatedPlayerBoatsArray = playerBoatsArray;
			let updatedOuterWaterArray = outerWaterArray;
			//let updatedBoatsAndWaterArray = [updatedPlayerBoatsArray],[updatedOuterWaterArray];
			//let updatedBoatsAndWaterArray.updatedPlayerBoatsArray = playerBoatsArray;
			//let updatedBoatsAndWaterArray.updatedOuterWaterArray = outerWaterArray;

			//A boat with a unit has been previously clicked
			/*if (this.state.currentPlayerUnit !== "" && this.state.currentPlayerBoat !== "") {
				if (object.objectType === 'card') {
					console.log('move unit from bost to card');
				} else
				if (object.objectType === 'OuterWater'){
					console.log('move boat to OuterWater');
				}
			} else*/
			//A boat has been previously clicked
			if (this.state.currentPlayerBoat !== "") {
				if (object.objectType === 'outerWater'){
					console.log('move boat to OuterWater');
					//Remove
					updatedOuterWaterArray = this._removePlayerBoatFromOuterWater(this.state.currentPlayerBoat,outerWaterArray);
					//Add
					//updatedOuterWaterArray = this._addPlayerBoatToOuterWater();
					//Update

				} else
				if (object.objectType === 'card') {
					console.log('move unit from boat to card');
					//Remove
					updatedPlayerBoatsArray = this._removeUnitFromBoat(this.state.currentPlayerUnit,this.state.currentPlayerBoat,playerBoatsArray);
					//Add

					//Update
					updatedOuterWaterArray = this._updateOuterWaterBoat(this.state.currentPlayerBoat, updatedPlayerBoatsArray, outerWaterArray);
				}
			} else
			//a field with a unit has previous been clicked
			if (this.state.currentPlayerUnit !== "") {
				//A card has been clicked on while no current boat is set
				if (object.objectType === 'card' && this.state.currentPlayerBoat === "") {
					console.log('move unit from card to card');
					//Remove
					updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
					//Add

					//Update

				} else
				//AN outer water with a boat has been clicked so move the unit to the boat
				if (object.objectType === 'outerWater'){
					console.log('move unit from card to boat');
					//Remove
					updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
					//Add

					//Update

				}
			}

			this.setState({
				cardArray: updatedCardArray,
				possibleMovesCard: [],
				possibleMovesBoat: [],
				playerUnitsArray: updatedUnitsArray,
				playerBoatsArray: updatedPlayerBoatsArray,
				outerWaterArray: updatedOuterWaterArray
			});
			
		}
	}
	/*_handleClick(object){

		//Get all of the arrays that we will work with
		const cardArray = this.state.cardArray.slice();
		//const outerWaterArray = this.state.outerWaterArray.slice();
		const playerUnitsArray = this.state.playerUnitsArray.slice();

		const outerWaterArray = this.state.outerWaterArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();

		//const playerBoatsArray = this.state.playerBoatsArray.slice();
		const possibleMoves = this.state.possibleMoves;
		const possibleMovesBoat = this.state.possibleMovesBoat;

		//Set defaults
		let objectUnits = 0;
		let objectBoat = "";
		let currentPlayerUnit = 0;

		let updatedCardArray = [];

		//console.log("Object type: " + object.objectType);

		//Figure out what kind of object has been clicked on
		if (object.objectType === "card") {
			objectBoat = object.playerBoat;
			//Get all units from the card
			objectUnits = this._getPlayerUnitsFromObject(object);
		}
		else
		//Get boat and units from the outer water
		if (object.objectType === "outerWater") {
			//alert("outerWater");
			objectBoat = object.playerBoat;
			if (objectBoat !== "") {
				//Get all units from the card
				objectUnits = this._getPlayerUnitsFromObject(objectBoat);
			}
		}

		//If there are units, check if any belong to the current player and return the first one
		if (objectUnits.length > 0) {
			currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
		}

		//Possible scenarios
		//First Click
		//- Outer water is clicked with a Boat that has units
		//	- next click could be water or card 
		//- Outer water is clicked with a Boat that has no units
		//	- next click could only be water
		//- Card is clicked with a unit
		//Second click
		//- Outer water is clicked without a Boat
		//- Card is clicked with or without a unit   currentPlayerBoat

		//If there is a unit that belong to the current player and there aren't any possible moves
		if ((currentPlayerUnit !== 0 || objectBoat !== "") && this.state.possibleMoves.length === 0) {
			
			let objectItems = { units: objectUnits, boat: objectBoat };
			//Highlight all the possible moves
			this._higlightPossibleMoves(object, objectItems);

			//Store the current player unit
			this.setState({
				currentPlayerUnit: currentPlayerUnit,
			});
		} else 
		//There are possible moves
		if (this.state.possibleMoves.length > 0) {

			//If the object allows for a possible move
			if(object.possibleMove === true){

				if (object.objectType === "card") {
					console.log("card clicked");
				}
				else
				if (object.objectType ==- "boat") {
					console.log("boat clicked");
				}
				else
				if (object.objectType === "outerWater") {
					console.log("outer water clicked")
				}

				if (this.state.currentPlayerUnit.location === "card") {
					//Remove unit from card
					updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
					
	 				//Clear all moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
					
					//Add the unit to the object and return arrays to be updated
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

					this.setState({
						cardArray: objectsUpdatedWithUnitsArray,
						possibleMoves: [],
						playerUnitsArray: updatedUnitsArray
					});
				} else
				if (this.state.currentPlayerUnit.location === "boat"){

					//remove unit from boat and return updated boat array and outer water array
					let { updatedPlayerBoatsArray, updatedOuterWaterArray } = this._removeUnitFromBoat(this.state.currentPlayerUnit,playerBoatsArray[this.state.currentPlayerId],playerBoatsArray,outerWaterArray);

					//Clear all moves from cards
					updatedCardArray = this._clearPossibleMoves(cardArray, possibleMoves);
					//Clear all moves from outer water
					updatedOuterWaterArray = this._clearPossibleMoves(updatedOuterWaterArray, possibleMovesBoat);

					//Add the unit to the object and return arrays to be updated
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

					this.setState({
						cardArray: objectsUpdatedWithUnitsArray,
						possibleMoves: [],
						playerUnitsArray: updatedUnitsArray,
						playerBoatsArray: updatedPlayerBoatsArray,
						outerWaterArray: updatedOuterWaterArray
					});
				}
				
			} else {
				alert("invalid move");
			}
			
		}

	}*/

				/*if (object.objectType === "card") {
					//A card has been clicked
					updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
					//Clear all moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
					
					//Add the unit to the card and return arrays to be updated
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

					this.setState({
						cardArray: objectsUpdatedWithUnitsArray,
						possibleMoves: [],
						playerUnitsArray: updatedUnitsArray
					});
				}
				else
				if (object.objectType === "boat") {
					//A boat has been clicked
					//remove unit from boat and return updated boat array and outer water array
					let { updatedPlayerBoatsArray, updatedOuterWaterArray } = this._removeUnitFromBoat(this.state.currentPlayerUnit,playerBoatsArray[this.state.currentPlayerId],playerBoatsArray,outerWaterArray);

					//Clear all moves from cards
					updatedCardArray = this._clearPossibleMoves(cardArray, possibleMoves);
					//Clear all moves from outer water
					updatedOuterWaterArray = this._clearPossibleMoves(updatedOuterWaterArray, possibleMovesBoat);

					//Add the unit to the object and return arrays to be updated
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

					this.setState({
						cardArray: objectsUpdatedWithUnitsArray,
						possibleMoves: [],
						playerUnitsArray: updatedUnitsArray,
						playerBoatsArray: updatedPlayerBoatsArray,
						outerWaterArray: updatedOuterWaterArray
					});
				}
				else
				if (object.objectType === "outerWater") {
					//Outer water has been clicked

				}*/

	/*_handleClick(object){

		const cardArray = this.state.cardArray.slice();
		const playerUnitsArray = this.state.playerUnitsArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		const possibleMoves = this.state.possibleMoves;

		//Get all units from the object
		let objectUnits = this._getPlayerUnitsFromObject(object);

		//
		let currentPlayerUnit = 0;

		//If there are units, check if any belong to the current player and return the first one
		if (objectUnits.length > 0) {
			currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
		}

		//If there is a unit that belong to the current player and there aren't any possible moves
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

				//Remove unit
				let updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
				
 				//Clear all moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
				
				//Add the unit to the object and return arrays to be updated
				let { cardsUpdatedWithUnitsArray, updatedUnitsArray }  = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

				this.setState({
					cardArray: cardsUpdatedWithUnitsArray,
					possibleMoves: [],
					playerUnitsArray: updatedUnitsArray
				});
				
			} else {
				alert("invalid move");
			}

		}

	}*/

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

/*
				//Remove the current player unit from its current card
				this._removeUnitFromObject(this.state.currentPlayerUnit);

				this._clearPossibleMoves();
				//this._removeUnitClearPossibleMoves(this.state.currentPlayerUnit);

				//Add the current player unit to a new card
				this._addUnitToCard(cardArray[object.row][object.col],this.state.currentPlayerUnit);*/

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