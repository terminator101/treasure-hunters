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
			playersArray: 		this.props.playersArray,
			playerUnitsArray: 	this._createPlayerUnits(this.props.playersArray),
			cardArray: 			this._createCards(),
			//outerWaterArray: 	this._createOuterWater(), //this._createPlayerBoats(this.props.playersArray)
			playerBoatsArray: 	this._createPlayerBoats(this.props.playersArray),
			possibleMovesUnit: 	[],
			possibleMovesBoat: 	[],
			currentPlayer: 		this.props.playersArray[0],
			currentPlayerUnit: 	"",
			currentPlayerBoat: 	""
		}
		//console.log(this.state.cardArray);
		//this._debug();
	}

	//Used for testing
	componentDidMount() {
		//this._debug({row: 1, col: 1});
		//this._debug4();
		//this._debug2();
	}

	//Add unit to a card and a boat to another card
	_debug( unitId = 1, boatdId = 1, cardLocation = {row: 1, col: 1}, boatLocation = {row: 0, col: 2}){

		let updatedUnitsArray = this.state.playerUnitsArray.slice();
		let updatedPlayerBoatsArray = this.state.playerBoatsArray.slice();
		let newUnit = updatedUnitsArray[unitId];
		let newBoat = updatedPlayerBoatsArray[boatdId];
		let updatedCardArray = this.state.cardArray.slice();

		//Update the unit with the location
		updatedUnitsArray = 
		this._updateObjectWithNewLocation(
			newUnit,
			this.state.cardArray[cardLocation.row][cardLocation.col],
			this.state.playerUnitsArray
		);

		//Add the unit to card
		let objectsUpdatedWithUnitsArray = 
		this._addUnitToObject(
			newUnit, 
			this.state.cardArray[cardLocation.row][cardLocation.col], 
			updatedUnitsArray, 
			updatedCardArray
		);

		//Update the boat with the location
		updatedPlayerBoatsArray = 
		this._updateObjectWithNewLocation(
			newBoat,
			this.state.cardArray[boatLocation.row][boatLocation.col],
			this.state.playerBoatsArray
		);

		//Now add a test boat to outer water
		let objectsUpdatedWithBoatsArray = 
		this._addPlayerBoatToOuterWater(
			newBoat, 
			objectsUpdatedWithUnitsArray[boatLocation.row][boatLocation.col], 
			updatedPlayerBoatsArray, 
			objectsUpdatedWithUnitsArray
		);
		
		//Update the state of cards, units and boats
		this.setState({
			cardArray: objectsUpdatedWithBoatsArray,
			playerUnitsArray: updatedUnitsArray,
			playerBoatsArray: updatedPlayerBoatsArray,
		});
	}

	//Add a boat with a unit to a card
	_debug2( unitId = 1, boatdId = 1, boatLocation = {row: 0, col: 2}){

		let updatedUnitsArray = this.state.playerUnitsArray.slice();
		let updatedPlayerBoatsArray = this.state.playerBoatsArray.slice();
		let newUnit = updatedUnitsArray[unitId];
		let newBoat = updatedPlayerBoatsArray[boatdId];

		//console.log(updatedUnitsArray);
		//console.log(updatedPlayerBoatsArray);

		let updatedCardArray = this.state.cardArray.slice();

		let futureBoatLocation = { row: boatLocation.row, col: boatLocation.col, objectType: "boat" };

		//Update the unit with the location.
		//Since the boathas not been updated yet, assume that the location will be a boat
		updatedUnitsArray = 
		this._updateObjectWithNewLocation(
			newUnit,
			futureBoatLocation,
			//this.state.cardArray[boatLocation.row][boatLocation.col],
			this.state.playerUnitsArray
		);

		//Add the unit to boat
		updatedPlayerBoatsArray = 
		this._addUnitToBoat(
			newUnit, 
			updatedPlayerBoatsArray[boatdId], 
			updatedUnitsArray, 
			updatedPlayerBoatsArray
		);

		//Update the boat with the location
		updatedPlayerBoatsArray = 
		this._updateObjectWithNewLocation(
			newBoat,
			this.state.cardArray[boatLocation.row][boatLocation.col],
			updatedPlayerBoatsArray
		);

		//Now add the boat to outer water
		let objectsUpdatedWithBoatsArray = 
		this._addPlayerBoatToOuterWater(
			newBoat, 
			updatedCardArray[boatLocation.row][boatLocation.col], 
			updatedPlayerBoatsArray, 
			updatedCardArray
		);
		
		//Update the state of cards, units and boats
		this.setState({
			cardArray: objectsUpdatedWithBoatsArray,
			playerUnitsArray: updatedUnitsArray,
			playerBoatsArray: updatedPlayerBoatsArray,
		});
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		let cardArray = [];
		let playerBoatsArray = this.state.playerBoatsArray;
		//playerBoatsArray = this._addAllUnitsToBoats(this.state.playerUnitsArray,playerBoatsArray);

		//Display the cards, but remove the first and last since that's outer water
		for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
			let theCardArray = this.state.cardArray[i].slice(1);
			theCardArray.pop();
			cardArray[i] = this._displayCards(theCardArray);
		}
		//console.log(this.state.cardArray);
		//(this._addAllBoatsToCards(this.state.playerBoatsArray,theCardArray)

		//Display each outer water
		let topWater = this._displayCards(this._addAllBoatsToCards(this._addAllUnitsToBoats(this.state.playerUnitsArray,playerBoatsArray),this._getOuterWater("top")));
		let bottomWater = this._displayCards(this._getOuterWater("bottom"));
		//Left and right outer water need spacer to display properly
		let leftWater = this._addSpacer(this._displayCards(this._getOuterWater("left")));
		let rightWater = this._addSpacer(this._displayCards(this._getOuterWater("right")));

		return(
			<div className="container">
				<div className="row no-gutters">
					<div className="col-12">
						{ this.state.currentPlayer.playerName }
					</div>
				</div>
				<div className="row no-gutters">
					<div className="col-10 offset-md-1">
						<div className="row no-gutters">
							{/* This is where the boats will go */}
							{ topWater }
						</div>
					</div>
				</div>
				<div id={this.props.cardsHolderId} className="row no-gutters">
					<div className="col-1">
						<div className="row no-gutters">
							{/* This is where the boats will go */}
							{ leftWater }
						</div>
					</div>
					<div className="col-sm-10">
						<div className="row no-gutters">
							{cardArray}
						</div>
					</div>
					<div className="col-1">
						<div className="row no-gutters">
							{/* This is where the boats will go */}
							{ rightWater }
						</div>
					</div>
				</div>
				<div className="row no-gutters">
					<div className="col-10 offset-md-1">
						<div className="row no-gutters">
							{/* This is where the boats will go */}
							{ bottomWater }
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Add a vertical spacer
	 * @param {array} objectArray 
	 */
	_addSpacer(objectArray){
		let objectWithSpacerArray = [];
		//Loop though the objects and add spacer after each except for the last one
		for (let i = 0; i < (objectArray.length - 1); i++) {
			objectWithSpacerArray.push(objectArray[i]);
			objectWithSpacerArray.push(<div className="w-100"></div>);
		}
		//Add the last object to the return array
		objectWithSpacerArray.push(objectArray.pop());
		return objectWithSpacerArray;
	}

	///////////////////
	/// Outer Water
	///////////////////
	_createOuterWater(posittion, index = 0){
		let outerWater = "";
		switch(posittion){
			case "top":
				outerWater = { 
					row: 0, 
					col: index, 
					playerBoat: "", 
					possibleMove: false, 
					disabled: true, 
					cardWidth: "col-sm-2", 
					cardClass: "cardObject", 
					objectType: "outerWater", 
					cardType: "horizontal vertical",
					movementType: "horizontal"
				}
			break;
			case "bottom":
				outerWater = { 
					row: NUMBER_OF_ROWS + 1, 
					col: index, 
					playerBoat: "", 
					possibleMove: false, 
					disabled: true, 
					cardWidth: "col-sm-2", 
					cardClass: "cardObject", 
					objectType: "outerWater", 
					cardType: "horizontal vertical",
					movementType: "horizontal"
				}
			break;
			case "left":
				outerWater = { 
					row: index, 
					col: 0, 
					playerBoat: "", 
					possibleMove: false, 
					disabled: true, 
					cardWidth: "col", 
					cardClass: "cardObject", 
					objectType: "outerWater", 
					cardType: "horizontal vertical",
					movementType: "vertical"
				}
				break;
			case "right":
				outerWater = { 
					row: index, 
					col: NUMBER_OF_ROWS + 1, 
					playerBoat: "", 
					possibleMove: false, 
					disabled: true, 
					cardWidth: "col", 
					cardClass: "cardObject", 
					objectType: "outerWater", 
					cardType: "vertical"
				}
			break;
			default:
				return 0;
		}
		return outerWater;
	}

	_getOuterWater(posittion){
		const outerWaterArray = this.state.cardArray.slice();
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

	///////////////////
	/// Player Boats
	///////////////////
	_createPlayerBoats(playersArray){
		let playerBoatsArray = [];
		let movementType = "";
		for(let player of playersArray){

			movementType = this._setBoatUnitMovementType(player);

			playerBoatsArray[player.playerId] = { 
				id: player.playerId, 
				row: player.row, 
				col: player.col, 
				units: [], 
				possibleMove: false, 
				objectType: "boat",
				movementType: movementType,
				playerId: player.playerId, 
				playerName: player.playerName, 
				disabled: true, 
				location: "" }
		};

		return playerBoatsArray;
	}

	_addPlayerBoatToOuterWater(boat,spot,playerBoatsArray,outerWaterArray){
		let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();

		console.log(outerWaterUpdatedWithBoatsArray[spot.row]);
		outerWaterUpdatedWithBoatsArray[spot.row] = outerWaterUpdatedWithBoatsArray[spot.row].slice();
		outerWaterUpdatedWithBoatsArray[spot.row][spot.col] = Object.assign({}, outerWaterUpdatedWithBoatsArray[spot.row][spot.col], {
			playerBoat: playerBoatsArray[boat.id],
			disabled: false
		});

		return outerWaterUpdatedWithBoatsArray;
	}

	_removePlayerBoatFromOuterWater(boat,objectArray){
		let updatedObjectArray = objectArray;

		updatedObjectArray[boat.row][boat.col] = Object.assign({}, updatedObjectArray[boat.row][boat.col], {
			playerBoat: "",
			disabled: true
		});

		return updatedObjectArray;
	}

	//Set the way the units will move from the boat
	_setBoatUnitMovementType(location){
		let movementType = "";
		//If movement type for this location is horizontal, set the unit to move vertically
		if (location.row === 0 || location.row === (NUMBER_OF_ROWS + 1)) {
			movementType = "vertical";
		} 
		else
		if (location.col === 0 || location.col === (NUMBER_OF_ROWS + 1)){
			movementType = "horizontal";
		}
		//let unitMovementType = location.movementType === "horizontal" ? "vertical" : "horizontal";
		return movementType;
	}

	///////////////////
	/// Player Units
	///////////////////
	_createPlayerUnits(playersArray){
		//let playersArray = this.state.playersArray;
		let playerUnitsArray = []; //this.state.playerUnitsArray.slice();
		//console.log(playersArray);
		for(let player of playersArray){
			//console.log(player);
			//this._createUnit(playersArray[index]);
			for (let i = 1; i < this.props.unitsPerPlayer + 1; i++) {
				playerUnitsArray[i] = { 
					id: i, 
					row: player.row, 
					col: player.col, 
					playerId: player.playerId, 
					playerName: player.playerName, 
					location: "boat" 
				};
			}
			
		};
		return playerUnitsArray;		
	}

	_removeUnitFromBoat(findUnit,boat,objectArray){
		let updatedPlayerBoatsArray = objectArray.slice();

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

	///////////////////
	/// Cards
	///////////////////
	_createCards(){
		let cardArray = [];

		for(let r = 0; r < NUMBER_OF_ROWS + 2; r++){
			cardArray[r] = [];
		}

		//top outerWater
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			cardArray[0][i] = this._createOuterWater("top",i);
		}

		for (let r = 1; r < NUMBER_OF_ROWS + 1; r++) {
			cardArray[r] = [];

			//Left outerWater
			cardArray[r][0] = this._createOuterWater("left",r);

			for (let i = 1; i < NUMBER_OF_ROWS + 1; i++) {
				//Check if the card is at the edge
				let isEdge = this._isAtTheEdge(r,i);
				
				cardArray[r][i] = { 
					row: 		r, 
					col: 		i, 
					cardType: 	"horizontal vertical",
					movementType: "horizontal vertical",
					cardWidth: 	"col-sm-2", 
					cardClass: 	"cardObject", 
					units: 		[], 
					possibleMove: false, 
					cardImage: 	this.props.cardImagesArray[0], 
					disabled: 	true, 
					objectType: "card", 
					edge: 		isEdge 
				};
			}

			//right outerWater
			cardArray[r][NUMBER_OF_ROWS + 1] = this._createOuterWater("right",r);
			
		}

		//bottom outerWater
		for(let i = 1; i < NUMBER_OF_ROWS + 1; i++){
			cardArray[NUMBER_OF_ROWS + 1][i]  = this._createOuterWater("bottom",i);
		}

		return cardArray;
	}

	/**
	 * Check to see if a unit is at the endge
	 * @param {row} r 
	 * @param {column} c 
	 */
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
					cardWidth =	   {card.cardWidth}
					movementType = {card.movementType}
					playerBoat =   {card.playerBoat ? card.playerBoat : null}
					units =	  	   {card.units}
					possibleMove = {card.possibleMove}
					cardImage =	   {card.cardImage}
					edge =		   {card.edge}
					objectType =   {card.objectType}
					cardClass =	   {card.cardClass}
					onClick = 	   {card.disabled ? null : () => this._handleClick(card)}
					disabled = 	   {card.disabled}
				/>
			)
		});
	}

	_addAllBoatsToCards(playerBoatsArray,cardArray){
		let cardsUpdatedWithBoats = cardArray.slice();
		for(let card of cardsUpdatedWithBoats){
			//console.log(cardsUpdatedWithBoats[card.row]);
			//console.log(card);
			for(let boat of playerBoatsArray){
				if (boat !== undefined) {
					//console.log(boat);
					if(boat.row === card.row && boat.col === card.col){
						//console.log(playerBoatsArray[boat.id]);
						//console.log("Boat found");
						//card = card.slice();

						card = Object.assign(card, card, {
							playerBoat: playerBoatsArray[boat.id],
							disabled: false
						});
						//console.log(cardsUpdatedWithBoats[card.row]);
						//cardsUpdatedWithBoats[card.row] = cardsUpdatedWithBoats[card.row].slice();
						/*cardsUpdatedWithBoats[card.row][card.col] = Object.assign({}, cardsUpdatedWithBoats[card.row][card.col], {
							playerBoat: playerBoatsArray[boat.id],
							disabled: false
						});*/
					}
				}
			}
		}
		//console.log(cardsUpdatedWithBoats);
		return cardsUpdatedWithBoats;
	}

	_addAllUnitsToBoats(playerUnitsArray,playerBoatsArray){
		let boatsUpdatedWithUnitsArray = playerBoatsArray.slice();
		
		//console.log(playerUnitsArray);

		let boatUnitArray = [];

		for(let boat of boatsUpdatedWithUnitsArray){

			if (boat !== undefined) {

				for(let unit of playerUnitsArray){

					if (unit !== undefined) {

						if(unit.playerId === boat.playerId 
							&& 
							unit.row === boat.row
							&&
							unit.col === boat.col){
							
							boatUnitArray.push(unit);
							
						}
					}
					
				}
				boat = Object.assign(boat, boat, {
					units: boatUnitArray,
					disabled: false
				});
			}
			
		}

		/*for(let unit of playerUnitsArray){

			if (unit !== undefined) {

				for(let boat of boatsUpdatedWithUnitsArray){

					if (boat !== undefined) {

						if(unit.playerId === boat.playerId){
							boat = Object.assign(boat, boat, {
								units: boat.units.concat(unit),
								disabled: false
							});
							
						}
					}
					
				}
			}
			
		}*/
		return boatsUpdatedWithUnitsArray;
	}

	/*boatsUpdatedWithUnitsArray[boat.id] = Object.assign({}, boatsUpdatedWithUnitsArray[boat.id], {
								units: boat.units.concat(unit),
								disabled: false
							});*/

	/**
	 * Adding unit to a boat
	 * @param {Object} unit 
	 * @param {Object} boat 
	 * @param {Array} playerUnitsArray 
	 * @param {Array} playerBoatsArray 
	 */
	_addUnitToBoat(unit,boat,playerUnitsArray,playerBoatsArray){
		/*let boatsUpdatedWithUnitsArray = playerBoatsArray.slice();
		let updatedUnitsArray = playerUnitsArray.slice();
		let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();
		
		updatedUnitsArray = this._updateObjectWithNewLocation(unit,boat,playerUnitsArray);

		//Update the units
		boatsUpdatedWithUnitsArray[boat.id] = Object.assign({}, boatsUpdatedWithUnitsArray[boat.id], {
			units: boatsUpdatedWithUnitsArray[boat.id].units.concat(updatedUnitsArray[unit.id]),
			disabled: false
		});

		outerWaterUpdatedWithBoatsArray[boat.row] = outerWaterUpdatedWithBoatsArray[boat.row].slice();

		outerWaterUpdatedWithBoatsArray[boat.row][boat.col] = Object.assign({}, outerWaterUpdatedWithBoatsArray[boat.row][boat.col], {
			playerBoat: boatsUpdatedWithUnitsArray[boat.id],
		});

		return {boatsUpdatedWithUnitsArray, updatedUnitsArray, outerWaterUpdatedWithBoatsArray};
		*/	
		let boatsUpdatedWithUnitsArray = playerBoatsArray.slice();
		//let updatedUnitsArray = playerUnitsArray.slice();
		//let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();
		
		//updatedUnitsArray = this._updateObjectWithNewLocation(unit,boat,playerUnitsArray);

		//Update the units
		boatsUpdatedWithUnitsArray[boat.id] = Object.assign({}, boatsUpdatedWithUnitsArray[boat.id], {
			units: boatsUpdatedWithUnitsArray[boat.id].units.concat(playerUnitsArray[unit.id]),
			disabled: false
		});

		return boatsUpdatedWithUnitsArray;
}

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

/*	_updateUnitsOnBoat(boat,playerBoatsArray,playerUnitsArray) {
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
	}*/

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

		objectsUpdatedWithUnitsArray[object.row] = objectsUpdatedWithUnitsArray[object.row].slice();
		objectsUpdatedWithUnitsArray[object.row][object.col] = Object.assign({}, objectsUpdatedWithUnitsArray[object.row][object.col], {
			units: objectsUpdatedWithUnitsArray[object.row][object.col].units.concat(playerUnitsArray[unit.id]),
			disabled: false
		});

		return objectsUpdatedWithUnitsArray;
	}

	//Work in progress
	_addMultipleUnitsToObject(unitList,object,playerUnitsArray,objectArray){

		let objectsUpdatedWithUnitsArray = objectArray.slice();

		objectsUpdatedWithUnitsArray[object.row] = objectsUpdatedWithUnitsArray[object.row].slice();
		objectsUpdatedWithUnitsArray[object.row][object.col] = Object.assign({}, objectsUpdatedWithUnitsArray[object.row][object.col], {
			units: objectsUpdatedWithUnitsArray[object.row][object.col].units.concat(playerUnitsArray[unitList]),
			disabled: false
		});

		return objectsUpdatedWithUnitsArray;
	}

	//Update the location of the unit  to match the object
	_updateObjectWithNewLocation(object,location,objectsArray){
		let objectsWithUpdatedLocation = objectsArray.slice();
		let boatUnitMovementType = "";

		if (object.objectType === "boat") {
			boatUnitMovementType = this._setBoatUnitMovementType(location);
		}

		//Update
		objectsWithUpdatedLocation[object.id] = Object.assign({}, objectsWithUpdatedLocation[object.id], {
			row: location.row,
			col: location.col,
			location: location.objectType,
			movementType: boatUnitMovementType
		});

		return objectsWithUpdatedLocation;
	}

	_updateMultipleObjectsWithNewLocation(objectList,location,objectsArray){
		let objectsWithUpdatedLocation = objectsArray.slice();

		for(let object of objectList){
			let boatUnitMovementType = "";
			if (object.objectType === "boat") {
				boatUnitMovementType = this._setBoatUnitMovementType(location);
			}
			//Update
			objectsWithUpdatedLocation[object.id] = Object.assign({}, objectsWithUpdatedLocation[object.id], {
				row: location.row,
				col: location.col,
				location: location.objectType,
				movementType: boatUnitMovementType
			});
		}

		return objectsWithUpdatedLocation;
	}

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
		//console.log(possibleMoves);

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
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		let possibleMovesUnit = this.state.possibleMovesUnit.slice();
		let possibleMovesBoat = this.state.possibleMovesBoat.slice();
		let objectUnits = 0;
		let currentPlayerUnit = "";
		let currentPlayerBoat = "";
		let playerBoat = playerBoatsArray[this.state.currentPlayer.playerId];
		let allowMovetoBoat = false;

		if (object.objectType === "card") {
			//Get all of the unit from the object
			objectUnits = this._getPlayerUnitsFromObject(object);

			//use that to get the current player unit
			currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
			
			//Find all possible moves
			possibleMovesUnit = this._findPossibleMoves(object, cardArray);

			/*if (object.edge === true) {
				//The card is near the edge so use its location to search for the player boat
				
				//Get the player boat using 
				let playerBoat = playerBoatsArray[this.state.currentPlayerId];

				for(let boat of possibleMovesUnit){
					if (boat.row === playerBoat.row && boat.col === playerBoat.col) {
						possibleMovesBoat = [playerBoat];
					}
				}

			}*/

		} else
		if (object.objectType === "outerWater") {
			
			//Get the boat from the outer water
			currentPlayerBoat = object.playerBoat;

			if (currentPlayerBoat !== "") {
				//get the possible moves for the boat along the outer water
				possibleMovesBoat = this._findPossibleMoves(object, cardArray);
				//Get all units from the boat
				objectUnits = this._getPlayerUnitsFromObject(currentPlayerBoat);
				
				console.log(objectUnits);

				if (objectUnits !== false) {
					//use that to get the current player unit
					currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);
					//Find possible moves for the unit
					possibleMovesUnit = this._findPossibleMoves(currentPlayerBoat, cardArray);
				}
			}
			/*console.log("Boat moves");
			console.log(possibleMovesBoat);
			console.log("Card moves");
			console.log(possibleMovesUnit);*/

		}

		if (possibleMovesUnit.length > 0 ) {
			let playerBoatLocation = playerBoatsArray[this.state.currentPlayer.playerId];


			//There are possible moves for the card so display them
			for(let position of possibleMovesUnit){
				cardArray[position.row] = cardArray[position.row].slice();

				//Check if the move is to a card or if the card has the current player boat
				if (cardArray[position.row][position.col].objectType === "card" || this._cardHasThePlayerBoat(cardArray[position.row][position.col],playerBoat)) {
					cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
						possibleMove: true,
						disabled: false
					});
				}
				
			}
		}
		if (possibleMovesBoat.length > 0 ) {
			//There are possible moves for the boat so display them
			for(let position of possibleMovesBoat){
				cardArray[position.row] = cardArray[position.row].slice();
				cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
					possibleMove: true,
					disabled: false
				});
			}
		}

		this.setState({
			cardArray: cardArray,
			possibleMovesUnit: possibleMovesUnit,
			possibleMovesBoat: possibleMovesBoat,
			currentPlayerUnit: currentPlayerUnit,
			currentPlayerBoat: currentPlayerBoat
		});
	}

	//Check if the card has the specified player boat
	_cardHasThePlayerBoat(card,boat){
		if (card.row === boat.row && card.col === boat.col) {
			return true;
		}
		return false;
	}

	//Get all unit for the specified player
	_getPlayerUnits(player,allPlayerUnits = this.state.playerUnitsArray){

		var specifiedPlayerUnits = [];

		//Loop through all player units in order ot get the ones that belong to the specified player
		for(let playerUnit of allPlayerUnits){
			if (playerUnit !== undefined && playerUnit.playerId === player.playerId) {
				specifiedPlayerUnits.push(playerUnit);
			}
		}
		return specifiedPlayerUnits;
	}

	//Update this to highlight the proper cards
	/*_higlightPossibleMovesOld(object){
		const cardArray = this.state.cardArray.slice();
		const outerWaterArray = this.state.outerWaterArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		
		let possibleMovesUnit = this.state.possibleMovesUnit.slice();
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
			possibleMovesUnit = this._findPossibleMoves(object, cardArray);

			if (object.edge === true) {
				//The card is near the edge so use its location to search the outer water
				//let boatLocations = this._findPossibleMoves(object, outerWaterArray);
				//Get the player boat using 
				let playerBoat = playerBoatsArray[this.state.currentPlayerId];

				for(let boat of possibleMovesUnit){
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
					possibleMovesUnit = this._findPossibleMoves(object, cardArray);
				}
			}
		}

		if (possibleMovesUnit.length > 0 ) {
			//There are possible moves for the card so display them
			for(let position of possibleMovesUnit){
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
			possibleMovesUnit: possibleMovesUnit,
			possibleMovesBoat: possibleMovesBoat,
			currentPlayerUnit: currentPlayerUnit,
			currentPlayerBoat: currentPlayerBoat
		});
				
	}	*/

	_findPossibleMoves(object, objectArray){
		const {
			col: objectCol,
			row: objectRow,
			cardType,
			movementType,
			edge,
			objectType,
		} = object;

		let start = objectCol - 1;
		let end = objectCol + 1;
		let moves = [];

		/*console.log("movementType");
		console.log(movementType);

		console.log("objectType");
		console.log(objectType);*/

		//console.log(objectArray);

		//objectArray[0] = [this.state.playerBoatsArray[this.state.currentPlayerId]];
		/*if (object.edge === true) {
			let boat = this.state.playerBoatsArray[this.state.currentPlayerId];
			moves.push(
				{"row" : boat.row, "col" : boat.col}
			);
		}*/
		let cardTypes = ["shark","sea horse","mermaid"];

		switch(movementType){
			case "none":
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
					for(let c = start; c < (end + 1); c++){
						if (c in objectRowArray)  {
							//the column has been found in the object row array so find the right coordinates
							if (((c === objectCol) && (objectRow === r))){
							//Ignore the coordinates of the card itself
							} else {
								if (movementType === "horizontal vertical") {
								//The card allows only for horizontal or vertical movement	
									if ((c === objectCol) ^ (objectRow === r)){
										moves.push(
											{"row" : r, "col" : c}
										);
									}
								} 
								else if (movementType === "diagonal") {
									if ((c !== objectCol) && (objectRow !== r)){
										moves.push(
											{"row" : r, "col" : c}
										);
									}
								}
								else if (movementType === "horizontal") {
									console.log("move horizontal");
									if (r === objectRow) {
										moves.push(
											{"row" : r, "col" : c}
										);
									}
								}
								else if (movementType === "vertical") {
									console.log("move vertical");
									if (c === objectCol) {
										moves.push(
											{"row" : r, "col" : c}
										);
									}
								}
								else {
									moves.push(
										{"row" : r, "col" : c}
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
				if (unit.playerId === this.state.currentPlayer.playerId) {
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
		console.log("Object clicked");
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

			//console.log("No unit to move");
			//Highlight all the possible moves
			this._higlightPossibleMoves(object);

			//Store the current player unit
			/*this.setState({
				currentPlayerUnit: currentPlayerUnit,
				currentPlayerBoat: 
			});*/
		} else {
			console.log("Unit to move:" + this.state.currentPlayerUnit + " || " + this.state.currentPlayerBoat);

			const cardArray = this.state.cardArray.slice();
			//const outerWaterArray = this.state.outerWaterArray.slice();

			const playerUnitsArray = this.state.playerUnitsArray.slice();
			const playerBoatsArray = this.state.playerBoatsArray.slice();

			let updatedCardArray = cardArray;
			let updatedUnitsArray = playerUnitsArray;
			let updatedPlayerBoatsArray = playerBoatsArray;

			const possibleMovesUnit = this.state.possibleMovesUnit.slice();
			const possibleMovesBoat = this.state.possibleMovesBoat.slice();

			//let updatedOuterWaterArray = outerWaterArray;
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
			console.log("Boat moves");
			console.log(possibleMovesBoat);
			console.log("Card moves");
			console.log(possibleMovesUnit);

			//A boat has been previously clicked
			if (this.state.currentPlayerBoat !== "") {
				if (object.objectType === 'outerWater'){
					console.log('move boat to OuterWater');

					//Get all units from the boat
					let objectUnits = this._getPlayerUnitsFromObject(this.state.currentPlayerBoat);

					if (objectUnits) {
						//Make sure the units get updated with proper location
						let futureBoatLocation = { row: object.row, col: object.col, objectType: "boat" };
						//Update all the units on the boat
						updatedUnitsArray = this._updateMultipleObjectsWithNewLocation(objectUnits,futureBoatLocation,updatedUnitsArray);
					}
					
					//Update all boats
					updatedPlayerBoatsArray = this._updateObjectWithNewLocation(this.state.currentPlayerBoat,cardArray[object.row][object.col],updatedPlayerBoatsArray);
					//Remove boat from outer water
					updatedCardArray = this._removePlayerBoatFromOuterWater(this.state.currentPlayerBoat,updatedCardArray);
					//update the boats
					updatedCardArray = this._addPlayerBoatToOuterWater(updatedPlayerBoatsArray[this.state.currentPlayerBoat.id], updatedCardArray[object.row][object.col], updatedPlayerBoatsArray, updatedCardArray);
					//Clear the unit possible moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
					//Clear the boat possible moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesBoat);

				} else
				if (object.objectType === 'card') {
					console.log('move unit from boat to card');

					//Update the unit with the new location
					updatedUnitsArray = this._updateObjectWithNewLocation(this.state.currentPlayerUnit,cardArray[object.row][object.col],this.state.playerUnitsArray);
					//Remove the unit from the current location
					updatedPlayerBoatsArray = this._removeUnitFromBoat(this.state.currentPlayerUnit,this.state.currentPlayerBoat,updatedPlayerBoatsArray);
					//Add the updated unit to the card
					updatedCardArray = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],updatedUnitsArray,updatedCardArray);
					//Update the outer water
					updatedCardArray = this._addPlayerBoatToOuterWater(updatedPlayerBoatsArray[this.state.currentPlayerBoat.id], updatedCardArray[this.state.currentPlayerBoat.row][this.state.currentPlayerBoat.col], updatedPlayerBoatsArray, updatedCardArray);
					//Clear the unit possible moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
					//Clear the boat possible moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesBoat);
				}
			} else
			//a field with a unit has previous been clicked
			if (this.state.currentPlayerUnit !== "") {
				//A card has been clicked on while no current boat is set
				if (object.objectType === 'card' && this.state.currentPlayerBoat === "") {
					console.log('move unit from card to card');
					//Update the unit with the new location
					updatedUnitsArray = this._updateObjectWithNewLocation(this.state.currentPlayerUnit,cardArray[object.row][object.col],this.state.playerUnitsArray);
					//Remove the unit from the current location
					updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
					//Add the updated unit to the new location
					updatedCardArray = this._addUnitToObject(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],updatedUnitsArray,updatedCardArray);
					//Clear the unit possible moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
				} else
				//AN outer water with a boat has been clicked so move the unit to the boat
				if (object.objectType === 'outerWater'){
					console.log('move unit from card to boat');
					//Update the unit with the new location
					updatedUnitsArray = this._updateObjectWithNewLocation(this.state.currentPlayerUnit,updatedPlayerBoatsArray[object.playerBoat.id],this.state.playerUnitsArray);
					//Remove the unit from the current location
					updatedCardArray = this._removeUnitFromObject(this.state.currentPlayerUnit,cardArray);
					//Add the updated unit to the boat
					updatedPlayerBoatsArray = this._addUnitToBoat(this.state.currentPlayerUnit, updatedPlayerBoatsArray[object.playerBoat.id], updatedUnitsArray, updatedPlayerBoatsArray);
					//Update the outer water
					updatedCardArray = this._addPlayerBoatToOuterWater(updatedPlayerBoatsArray[object.playerBoat.id], updatedCardArray[object.row][object.col], updatedPlayerBoatsArray, updatedCardArray);
					//Clear the possible moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);

				}
			}

			//enable all cards that have the next players units
			updatedCardArray = this._goNextPlayer(updatedCardArray,updatedUnitsArray,updatedPlayerBoatsArray);

			this.setState({
				currentPlayerUnit: "",
				currentPlayerBoat: "",
				cardArray: updatedCardArray,
				possibleMovesUnit: [],
				possibleMovesBoat: [],
				playerUnitsArray: updatedUnitsArray,
				playerBoatsArray: updatedPlayerBoatsArray,
			});
			
		}
	}

	//Let the next player make a turn
	_goNextPlayer(cardArray,updatedUnitsArray,updatedPlayerBoatsArray){

		//Get the current player
		let currentPlayer = this.state.currentPlayer;
		let playerUnits = this._getPlayerUnits(currentPlayer,updatedUnitsArray);
		let playerBoat = updatedPlayerBoatsArray[this.state.currentPlayer.playerId];
		//Add the boat so that it's not disabled
		playerUnits.push(playerBoat);

		for(let position of playerUnits){
			cardArray[position.row] = cardArray[position.row].slice();

			cardArray[position.row][position.col] = Object.assign({}, cardArray[position.row][position.col], {
				disabled: false
			});
		}
		return cardArray;
	};

	//Create a turn based on the type
	_createTurn(type){
		switch(type){
			case "current":
				//Its current players turn so check if it is a computer
				if(this.state.playersArray[this.state.currentPlayer].getPlayerType() === 'computer'){
					//logAction("Computer Turn");
					//Let the computer go
					//this._goComputer();
				} else {
					//logAction("Human Turn");
				}
				break;
			case "next":
				//It is the next players turn so switch
				this._goNextPlayer();
				break;
			default:
				break;
		}
	}
};


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

/*	//Create a boat
	_debug3( boatLocation = {row: 0, col: 1} ){

		//Add a test boat to outer water
		let { outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray } = 
			this._addPlayerBoatToOuterWater(
				this.state.playerBoatsArray[1], 
				this.state.cardArray[boatLocation.row][boatLocation.col], 
				this.state.playerBoatsArray, 
				this.state.cardArray
			);

		return { outerWaterUpdatedWithBoatsArray, updatedPlayerBoatsArray };
	}

	//
	_debug4(){
		//Get a boat
		let updatedBoat = this._debug3({row: 0, col: 1});

		//Add an unit to the boat
		let { objectsUpdatedWithUnitsArray, updatedUnitsArray, outerWaterUpdatedWithBoatsArray } = 
			this._addUnitToBoat(
				this.state.playerUnitsArray[1], 
				updatedBoat.updatedPlayerBoatsArray[1], 
				this.state.playerUnitsArray, 
				updatedBoat.updatedPlayerBoatsArray, 
				updatedBoat.outerWaterUpdatedWithBoatsArray
			);

		this.setState({
			cardArray: outerWaterUpdatedWithBoatsArray,
			playerUnitsArray: updatedUnitsArray,
			playerBoatsArray: objectsUpdatedWithUnitsArray,
		});
	}*/

/*_higlightPossibleMoves(object, objectItems){

		const cardArray = this.state.cardArray.slice();
		const outerWaterArray = this.state.outerWaterArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		
		//let possibleMovesUnit = this.state.possibleMoves.slice();
		//let possibleMovesBoat = this.state.possibleMovesBoat.slice();

		let possibleMovesUnit = [];
		let boatLocation = [];
		let possibleMovesBoat = [];

		//possibleMoves = this._findPossibleMoves(object, cardArray);

		if (object.objectType === "card") {
			//If thie object clicked is a card, find all possible cards 
			possibleMovesUnit = this._findPossibleMoves(object, cardArray);
			
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
					possibleMovesUnit = this._findPossibleMoves(object, cardArray);
				}
			}
			//alert("outerWater will get highlighted");
		}

		if (possibleMovesUnit.length > 0 ) {
			//There are possible moves for the card so display them
			for(let position of possibleMovesUnit){
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
			possibleMoves: possibleMovesUnit,
			possibleMovesBoat: possibleMovesBoat,
			playerBoatsArray: playerBoatsArray
		});
		return { possibleMovesUnit, possibleMovesBoat };
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

/* _displayOuterWater(outerWaterArray){
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
	} */

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