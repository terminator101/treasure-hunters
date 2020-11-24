import React from 'react';
import Card from './card';
import Description from './description';
import { DisplayScreenContext } from "./display-screen-context";

import { CARD_TYPES,
		OBJECT_TYPES,
		OUTER_WATER_TYPES, 
		PLAYER_STATES,
		SCREENS, 
		RESULT_TEXT,
		GAME_SETUPS, } from './constants';

export default class GameBoard extends React.Component {

	constructor(props) {
		super(props);

		this.turnTypes = {
			current: 'current',
			next: 	 'next'
		}

		this.defaults = {
			outerWaterTypes:  	OUTER_WATER_TYPES,
			gameSize:			this.props.gameSize,
			numberOfRows:		this.props.gameSetup.numberOfRows,
			numberCardsPerRow: 	this.props.gameSetup.numberCardsPerRow,
			cardRowWidthClass: 	this.props.gameSetup.cardRowWidthClass,
			cardWidthClass:		this.props.gameSetup.cardWidthClass,
			unitsPerPlayer:		this.props.gameSetup.unitsPerPlayer,
			gameBoardWidthClass:this.props.gameSetup.gameBoardWidthClass,
			outerWaterSideWidth:this.props.gameSetup.outerWaterSideWidth,
			displayValues:		this.props.displayValues,
			treasuresForWin:	this.props.treasuresForWin,
			cardTypeNumbersCount:this.props.gameSetup.cardTypeNumbersCount,
			cardTypes: 			CARD_TYPES,
			objectTypes:		OBJECT_TYPES,
			playerStates:		PLAYER_STATES,
			resultText: 		RESULT_TEXT,
			screens:			SCREENS,
			cardTypeWithTreasure: "chest"
		}

		this.state = {
			playersArray: 		this.props.playersArray,
			playerUnitsArray: 	this._createPlayerUnits(this.defaults.unitsPerPlayer,this.props.playersArray,this.props.gameSize),
			cardArray: 			this._createCards(CARD_TYPES,OUTER_WATER_TYPES,this.defaults.cardTypeNumbersCount),
			playerBoatsArray: 	this._createPlayerBoats(this.props.playersArray,this.props.gameSize),
			treasuresArray:		[],
			possibleMovesUnit: 	[],
			possibleMovesBoat: 	[],
			currentPlayer: 		this.props.playersArray[0],
			currentPlayerUnit: 	null,
			currentPlayerBoat: 	null,
		}

		//Create the treasures using the cards
		this.state.treasuresArray = this._createTreasures(this.state.cardArray);
		//Add the treasures to the cards
		this.state.cardArray = this._addAllTreasuresToCards(this.state.treasuresArray,this.state.cardArray);
		//Add all the units to each boat
		this.state.playerBoatsArray = this._addAllUnitsToBoats(this.state.playerUnitsArray,this.state.playerBoatsArray);
		//Add all boats to cards
		this.state.cardArray = this._addAllBoatsToCards(this.state.playerBoatsArray,this.state.cardArray);

		//Allow the first player to go
		this._createTurn(this.state.currentPlayer);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.cardArray !== prevState.cardArray ) {
			//The cards have been changed so check if the current player has also changed
			if(this.state.currentPlayer && (this.state.currentPlayer !== prevState.currentPlayer)){
				//The current player has changed so create a turn using the changed player
				this._createTurn(this.state.currentPlayer);
			}
			
		}	
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
		this._addUnitToCard(
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

		let futureBoatLocation = { row: boatLocation.row, col: boatLocation.col, objectType: this.defaults.objectTypes.boat };

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
		const updatedCardArray = this.state.cardArray.slice();
		let currentPlayer = this.state.currentPlayer ? this.state.currentPlayer : null;
		let displayCardArray = [];

		//Display the cards, but remove the first and last since that's outer water
		for (let i = 1; i < this.defaults.numberOfRows + 1; i++) {
			let changedCardArray = updatedCardArray[i].slice(1);
			changedCardArray.pop();
			displayCardArray[i] = this._displayCards(changedCardArray);
		}

		//Display each outer water
		let topWater = this._displayCards(this._getOuterWater(this.defaults.outerWaterTypes.top,updatedCardArray));
		let bottomWater = this._displayCards(this._getOuterWater(this.defaults.outerWaterTypes.bottom,updatedCardArray));
		//Left and right outer water need spacer to display properly
		let leftWater = this._addSpacer(this._displayCards(this._getOuterWater(this.defaults.outerWaterTypes.left,updatedCardArray)));
		let rightWater = this._addSpacer(this._displayCards(this._getOuterWater(this.defaults.outerWaterTypes.right,updatedCardArray)));
		
		//Outer water containers have to scale
		let outerWaterSideContainerWitdhClass = "col-" + this.settings.outerWaterSideWidth;
		let outerWaterTopBottomContainerWithClass = this.settings.cardRowWidthClass + " offset-" + this.defaults.outerWaterSideWidth;
		return(
			<div>
				<Description 
					treasuresForWin={this.settings.treasuresForWin}
					unitsPerPlayer={this.settings.unitsPerPlayer}
				/>
				<div className="row justify-content-center no-gutters">
					<div className={ this.settings.gameBoardWidthClass }>
						{currentPlayer ? <div className={"row no-gutters text-white " + currentPlayer.playerClass + "color"}>
							<div className="col-12">
								{ currentPlayer.playerName + " | " + currentPlayer.score }
							</div>
						</div> : ""}
						<div className="row no-gutters">
							<div className={ outerWaterTopBottomContainerWithClass }>
								<div className="row no-gutters">
									{/* This is where the boats will go */}
									{ topWater }
								</div>
							</div>
						</div>
						<div id={this.props.cardsHolderId} className="row no-gutters">
							<div className={ outerWaterSideContainerWitdhClass }>
								<div className="row no-gutters">
									{/* This is where the boats will go */}
									{ leftWater }
								</div>
							</div>
							<div className={ this.settings.cardRowWidthClass }>
								<div className="row no-gutters">
									{ displayCardArray }
								</div>
							</div>
							<div className={ outerWaterSideContainerWitdhClass }>
								<div className="row no-gutters">
									{/* This is where the boats will go */}
									{ rightWater }
								</div>
							</div>
						</div>
						<div className="row no-gutters">
							<div className={ outerWaterTopBottomContainerWithClass }>
								<div className="row no-gutters">
									{/* This is where the boats will go */}
									{ bottomWater }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Add a vertical spacer
	 * @param {Array} objectArray 
	 */
	_addSpacer(objectArray){
		let objectWithSpacerArray = [];
		//Loop though the objects and add spacer after each except for the last one
		for (let i = 0; i < (objectArray.length - 1); i++) {
			objectWithSpacerArray.push(objectArray[i]);
			objectWithSpacerArray.push(<div key={ "spacer" + i } className="w-100"></div>);
		}
		//Add the last object to the return array
		objectWithSpacerArray.push(objectArray.pop());
		return objectWithSpacerArray;
	}

	///////////////////
	/// Outer Water
	///////////////////
	/**
	 * Crete outer water using the specified position
	 * @param {string} position 
	 * @param {integer} index 
	 */
	_createOuterWater(position, index = 0){
		//Create a default outer water
		let outerWater = {
			playerBoat: null, 
			possibleMove: false, 
			disabled: true, 
			cardWidth: this.defaults.cardWidthClass, 
			cardClass: "cardObject", 
			objectType: this.defaults.objectTypes.outerWater, 
			cardType: "horizontal vertical",
			opened: true,
			cardImage: "ocean.png",
		};
		//Add the appropriate properties depending on the position
		switch(position){
			case "top":
				outerWater = { 
					...outerWater,
					row: 0, 
					col: index,
					cardWidth: this.defaults.cardWidthClass, 
					movementType: "horizontal",
				}
			break;
			case "bottom":
				outerWater = {
					...outerWater,
					row: this.defaults.numberOfRows + 1, 
					col: index, 
					cardWidth: this.defaults.cardWidthClass, 
					movementType: "horizontal",
				}
			break;
			case "left":
				outerWater = {
					...outerWater,
					row: index, 
					col: 0,
					cardWidth: "col", 
					movementType: "vertical",
				}
				break;
			case "right":
				outerWater = {
					...outerWater,
					row: index, 
					col: this.defaults.numberCardsPerRow + 1,
					cardWidth: "col", 
					movementType: "vertical",
				}
			break;
			default:
				return false;
		}
		return outerWater;
	}

	/**
	 * Get the outer water depending on the postion
	 * @param {Object} position 
	 * @param {Array} outerWaterArray 
	 */
	_getOuterWater(position,outerWaterArray){
		let displayArray = [];
		switch(position){
			case "top":
				for(let i = 1; i < this.defaults.numberCardsPerRow + 1; i++){
					displayArray.push(outerWaterArray[0][i]);
				}
			break;
			case "bottom":
				for(let i = 1; i < this.defaults.numberCardsPerRow + 1; i++){
					displayArray.push(outerWaterArray[this.defaults.numberOfRows + 1][i]);
				}
			break;
			case "left":
				for(let i = 1; i < this.defaults.numberOfRows + 1; i++){
					displayArray.push(outerWaterArray[i][0]);
				}
			break;
			case "right":
				for(let i = 1; i < this.defaults.numberOfRows + 1; i++){
					displayArray.push(outerWaterArray[i][this.defaults.numberOfRows + 1]);
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
	/**
	 * Create all player boats
	 * @param {Array} playersArray
	 * @param {String} gameSize
	 */
	_createPlayerBoats(playersArray,gameSize){
		let playerBoatsArray = [];
		let movementType = "";
		let startLocation = {};
		for(let player of playersArray){
			//Get the starting positon based on the game size
			startLocation = this._getStartingPlayerLocation(player,gameSize);
			//Update the movement based on the player starting positon
			movementType = this._setBoatUnitMovementType(startLocation);
			playerBoatsArray.push({ 
				key: "boat" + player.playerId,
				id: player.playerId, 
				row: startLocation.row, 
				col: startLocation.col, 
				units: [], 
				possibleMove: false, 
				objectType: this.defaults.objectTypes.boat,
				movementType: movementType,
				playerId: player.playerId, 
				playerName: player.playerName, 
				disabled: true, 
				location: "",
				boatImage: player.boatImage,
				boatClass: player.playerClass })

			/*playerBoatsArray[player.playerId] = { 
				key: "boat" + player.playerId,
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
				location: "" }*/
		};

		return playerBoatsArray;
	}

	/**
	 * Add a player boat to outer water
	 * @param {Object} boat 
	 * @param {Object} spot 
	 * @param {Array} playerBoatsArray 
	 * @param {Array} outerWaterArray 
	 */
	_addPlayerBoatToOuterWater(boat,spot,playerBoatsArray,outerWaterArray){
		let outerWaterUpdatedWithBoatsArray = outerWaterArray.slice();

		outerWaterUpdatedWithBoatsArray[spot.row] = outerWaterUpdatedWithBoatsArray[spot.row].slice();
		outerWaterUpdatedWithBoatsArray[spot.row][spot.col] = Object.assign({}, outerWaterUpdatedWithBoatsArray[spot.row][spot.col], {
			playerBoat: playerBoatsArray[boat.id],
			disabled: false
		});

		return outerWaterUpdatedWithBoatsArray;
	}

	/**
	 * Remove a player boat from outer water
	 * @param {Object} boat 
	 * @param {Array} objectArray 
	 */
	_removePlayerBoatFromOuterWater(boat,objectArray){
		let updatedObjectArray = objectArray;

		updatedObjectArray[boat.row][boat.col] = Object.assign({}, updatedObjectArray[boat.row][boat.col], {
			playerBoat: null,
			disabled: true
		});

		return updatedObjectArray;
	}

	/**
	 * Get the starting location depending on the game size
	 * @param {Object} player 
	 * @param {String} gameSize 
	 */
	_getStartingPlayerLocation(player,gameSize){
		let location = {};
		let gameSizeName = "";
		if(gameSize === GAME_SETUPS.small.value){
			gameSizeName = GAME_SETUPS.small.playerLocations;
		}
		else
		if(gameSize === GAME_SETUPS.medium.value){
			gameSizeName = GAME_SETUPS.medium.playerLocations;
		}
		location = {row: player[gameSizeName].row, col: player[gameSizeName].col}
		return location;
	}

	///////////////////
	/// Player Units
	///////////////////
	/**
	 * Create the player units
	 * @param {Integer} unitsPerPlayer 
	 * @param {Array} playersArray
	 * @param {String} gameSize
	 */
	_createPlayerUnits(unitsPerPlayer,playersArray,gameSize){
		//let playersArray = this.state.playersArray;
		let playerUnitsArray = []; //this.state.playerUnitsArray.slice();
		let unitCounter = 0;
		let startLocation = {};
		//console.log(playersArray);
		for(let player of playersArray){
			//Get the starting positon based on the game size
			startLocation = this._getStartingPlayerLocation(player,gameSize);
			for (let i = 0; i < unitsPerPlayer; i++) {
				playerUnitsArray.push({ 
					id: unitCounter,
					key: player.playerName + i, 
					row: startLocation.row, 
					col: startLocation.col, 
					playerId: player.playerId, 
					playerName: player.playerName, 
					location: "boat",
					dead: false,
					unitClass: player.playerClass
				});
				unitCounter++;
			}
			
		};
		//console.log("Player Units");
		//console.log(playerUnitsArray);
		return playerUnitsArray;		
	}

	/**
	 * Set the way the units will move from the boat
	 * @param {Object} location 
	 */
	_setBoatUnitMovementType(location){
		let movementType = "";
		//If movement type for this location is horizontal, set the unit to move vertically
		if (location.row === 0 || location.row === (this.defaults.numberCardsPerRow + 1)) {
			movementType = "vertical";
		} 
		else
		if (location.col === 0 || location.col === (this.defaults.numberOfRows + 1)){
			movementType = "horizontal";
		}
		//let unitMovementType = location.movementType === "horizontal" ? "vertical" : "horizontal";
		return movementType;
	}

	///////////////////
	/// Cards
	///////////////////
	/**
	 * 
	 * @param {Map} cardTypes 
	 * @param {Object} outerWaterTypes 
	 * @param {Map} cardTypeNumbersCount 
	 */
	_createCards(cardTypes,outerWaterTypes,cardTypeNumbersCount){
		let cardArray = [];
		let cardTypeCounter = 0;
		let generatedCards = [];
		//let createdCardCounter = 0;
		//let totalNumberOfCards = this.defaults.numberCardsPerRow * this.defaults.numberOfRows;

		//Loop through all the card types
		cardTypes.forEach(function(card, cardTypeName) {
			//For each card type, loop through each count
			cardTypeNumbersCount.forEach(function(cardCountNumber, cardCountName){
				if(cardTypeName === cardCountName){
					//A card has been found so use its counter to create appropriate number of cards
					for(let i = 0; i < cardCountNumber; i++) {
						//createdCardCounter++
						generatedCards.push({ card });
					} 
				}
			})
		})
		
		/* Work in progress
		if(createdCardCounter < totalNumberOfCards){
			console.log(createdCardCounter);
			console.log(totalNumberOfCards);
			//Number of cards created is smaller than the desired total, fill the rest with fish
			for(let i = 0; i < (totalNumberOfCards - createdCardCounter); i++) {
				let filler = cardTypes.get("fish");
				generatedCards.push({ filler });
			} 
		} */

		//Randomize the generated cards
		generatedCards = this._randomizeArray(generatedCards);

		//Create all of the rows
		for(let r = 0; r < this.defaults.numberOfRows + 2; r++){
			cardArray[r] = [];
		}

		//top outerWater
		for(let i = 1; i < this.defaults.numberCardsPerRow + 1; i++){
			cardArray[0][i] = this._createOuterWater(outerWaterTypes.top,i);
		}

		for (let r = 1; r < this.defaults.numberOfRows + 1; r++) {
			cardArray[r] = [];

			//Left outerWater
			cardArray[r][0] = this._createOuterWater(outerWaterTypes.left,r);

			for (let c = 1; c < this.defaults.numberCardsPerRow + 1; c++) {
				//Check if the card is at the edge
				let isEdge = this._isAtTheEdge(r,c);
				let displayValues = this.defaults.displayValues;

				cardArray[r][c] = { 
					row: 			r, 
					col: 			c, 
					cardType: 		generatedCards[cardTypeCounter].card.cardType,
					movementType: 	generatedCards[cardTypeCounter].card.movementType,
					cardWidth: 		this.defaults.cardWidthClass, 
					cardClass: 		"cardObject", 
					units: 			[], 
					possibleMove: 	false, 
					cardImage: 		generatedCards[cardTypeCounter].card.cardImage, 
					disabled: 		true, 
					objectType: 	this.defaults.objectTypes.card, 
					edge: 			isEdge,
					opened: 		displayValues,
					cardTypeClass: 	generatedCards[cardTypeCounter].card.cardTypeClass,
					treasures: 		generatedCards[cardTypeCounter].card.treasures ? generatedCards[cardTypeCounter].card.treasures : []
				};

				cardTypeCounter += 1;

				//console.log(cardTypeCounter);
			}

			//right outerWater
			cardArray[r][this.defaults.numberOfRows + 1] = this._createOuterWater(outerWaterTypes.right,r);
		}

		//bottom outerWater
		for(let i = 1; i < this.defaults.numberOfRows + 1; i++){
			cardArray[this.defaults.numberOfRows + 1][i]  = this._createOuterWater(outerWaterTypes.bottom,i);
		}

		return cardArray;
	}

	/**
	 * Randomizing an array
	 * @param {Array} theArray 
	 */
	_randomizeArray(theArray){
		var currentIndex = theArray.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle
		while (0 !== currentIndex) {
		
			// Pick a remaining element
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
		
			// And swap it with the current element
			temporaryValue = theArray[currentIndex];
			theArray[currentIndex] = theArray[randomIndex];
			theArray[randomIndex] = temporaryValue;
		}
		return theArray;
	};

	/**
	 * Check to see if a unit is at the endge
	 * @param {integer} r 
	 * @param {integer} c 
	 */
	_isAtTheEdge(r,c){
		if ( r === 1 || r === this.defaults.numberCardsPerRow || c === 1 || c === this.defaults.numberCardsPerRow) {
			return true
		}
		else {
			return false;
		}
	}

	/**
	 * Map the objects to the Card object
	 * @param {Array} cardArray 
	 */
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
					opened = 	   {card.opened}
					cardTypeClass = {card.cardTypeClass}
					treasures =	   {card.treasures}
				/>
			)
		});
	}

	/**
	 * Add all boats to the appropriate cards
	 * @param {Array} playerBoatsArray 
	 * @param {Array} cardArray 
	 */
	_addAllBoatsToCards(playerBoatsArray,cardArray){
		let cardsUpdatedWithBoats = cardArray.slice();

		for(let boat of playerBoatsArray){
			if (cardsUpdatedWithBoats[boat.row] !== undefined) {
				let disabled = true;
				if (this.state.currentPlayer.playerId === boat.playerId && !this.state.currentPlayerUnit) {
					//Boat with the current player was found and no current player unit is selected so enable it
					disabled = false;
				}

				cardsUpdatedWithBoats[boat.row] = cardsUpdatedWithBoats[boat.row].slice();
				cardsUpdatedWithBoats[boat.row][boat.col] = Object.assign({}, cardsUpdatedWithBoats[boat.row][boat.col], {
					playerBoat: playerBoatsArray[boat.id],
					disabled: disabled
				});
			}
			
		}
		return cardsUpdatedWithBoats;
	}

	/**
	 * Add all units to the appropriate boats
	 * @param {Array} playerUnitsArray 
	 * @param {Array} playerBoatsArray 
	 */
	_addAllUnitsToBoats(playerUnitsArray,playerBoatsArray){
		let boatsUpdatedWithUnitsArray = playerBoatsArray.slice();

		for(let b = 0; b < playerBoatsArray.length; b++){

			let boatUnitsArray = [];

			//Loop through all the units
			for(let unit of playerUnitsArray){

				if( !unit.dead
					&&
					unit.playerId === playerBoatsArray[b].playerId 
					&& 
					unit.row === playerBoatsArray[b].row
					&&
					unit.col === playerBoatsArray[b].col){
					//The unit is not dead, and the unit playerId as well as row and col match the boat,
					//So add the unit
					boatUnitsArray = boatUnitsArray.concat(unit);
				}
			}
			boatsUpdatedWithUnitsArray[b] = Object.assign({}, boatsUpdatedWithUnitsArray[b], {
				units: boatUnitsArray,
			});
		}
		return boatsUpdatedWithUnitsArray;
	}

	/**
	 * Add a unit to a boat
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

	/**
	 * Remove units from a boat
	 * @param {Object} findUnit 
	 * @param {Object} boat 
	 * @param {Array} boatArray 
	 */
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

	/**
	 * Adding a unit to the card
	 * @param {Object} unit 
	 * @param {Object} object 
	 * @param {Array} playerUnitsArray 
	 * @param {Array} objectArray 
	 */
	_addUnitToCard(unit,object,playerUnitsArray,objectArray){

		let objectsUpdatedWithUnitsArray = objectArray.slice();

		objectsUpdatedWithUnitsArray[object.row] = objectsUpdatedWithUnitsArray[object.row].slice();
		objectsUpdatedWithUnitsArray[object.row][object.col] = Object.assign({}, objectsUpdatedWithUnitsArray[object.row][object.col], {
			units: objectsUpdatedWithUnitsArray[object.row][object.col].units.concat(playerUnitsArray[unit.id]),
			disabled: false,
			opened: true
		});

		return objectsUpdatedWithUnitsArray;
	}

	/**
	 * Update the card properties after a shark attack
	 * @param {Object} object 
	 * @param {Array} objectArray 
	 */
	_setCardToStayOpen(object,objectArray){
		let updatedObjects = objectArray.slice();

		updatedObjects[object.row] = updatedObjects[object.row].slice();
		updatedObjects[object.row][object.col] = Object.assign({}, updatedObjects[object.row][object.col], {
			cardType: "dead shark",
			movementType: "horizontal vertical",
			opened: true
		});

		return updatedObjects;
	}

	/**
	 * Update the location of a unit or a boat  to match the object
	 * @param {Object} object 
	 * @param {Object} location 
	 * @param {Array} objectsArray 
	 */
	_updateObjectWithNewLocation(object,location,objectsArray){
		let objectsWithUpdatedLocation = objectsArray.slice();
		let boatUnitMovementType = "";

		if (object.objectType === this.defaults.objectTypes.boat) {
			//This is a boat so change the movement type to be different for the units on the boat
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

	/**
	 * A unit has died
	 * @param {Object} object 
	 * @param {Array} objectsArray 
	 */
	_markUnitAsdead(object,objectsArray){
		let updatedObjects = objectsArray.slice();

		updatedObjects[object.id] = Object.assign({}, updatedObjects[object.id], {
			dead: true
		});

		return updatedObjects;
	}

	/**
	 * Update all units in the location with new parameters
	 * @param {Array} objectUnits 
	 * @param {Object} location 
	 * @param {Array} unitArray 
	 */
	_updateMultipleUnitsWithNewLocation(objectUnits,location,unitArray){
		let objectsWithUpdatedLocation = unitArray.slice();

		for(let unit of objectUnits){
			let boatUnitMovementType = "";
			if (location.objectType === this.defaults.objectTypes.boat) {
				//The unit is being added to a boat so update how it can move
				boatUnitMovementType = this._setBoatUnitMovementType(location);
			}
			//Update
			objectsWithUpdatedLocation[unit.id] = Object.assign({}, objectsWithUpdatedLocation[unit.id], {
				row: location.row,
				col: location.col,
				location: location.objectType,
				movementType: boatUnitMovementType
			});
		}

		return objectsWithUpdatedLocation;
	}

	/**
	 * Remove a specific unit from a card
	 * @param {Object} findUnit 
	 * @param {Array} objectArray 
	 */
	_removeUnitFromCard(findUnit,objectArray){
		let updatedObjectArray = objectArray.slice();
		let objectUnitsArray = updatedObjectArray[findUnit.row][findUnit.col].units;
		const theUnit = objectUnitsArray.find( unit => unit.id === findUnit.id );
		let updatedObjectUnitArray = updatedObjectArray[findUnit.row][findUnit.col].units.filter(unit => unit.id !== theUnit.id);

		updatedObjectArray[findUnit.row] = updatedObjectArray[findUnit.row].slice();
		updatedObjectArray[findUnit.row][findUnit.col] = Object.assign({}, updatedObjectArray[findUnit.row][findUnit.col], {
			units: updatedObjectUnitArray,
			disabled: true
		});

		return updatedObjectArray;
	}

	///////////////////
	/// Treasures
	///////////////////
	/**
	 * Create treasures
	 * @param {Array} cardArray 
	 */
	_createTreasures(cardArray){
		let treasuresArray = [];
		let treasureCounter = 0;

		for(let cardArrayRow of cardArray){
			for(let card of cardArrayRow.slice()){
				//The card exists and its type has a chest 
				if ( card !== undefined && card.cardType === this.defaults.cardTypeWithTreasure) {

					treasuresArray = treasuresArray.concat({
						key: "treasure" + treasureCounter,
						id: treasureCounter,
						row: card.row,
						col: card.col,
						name: "Treasure",
						retrievedBy: ""
					})
					treasureCounter++
				}
			}
		}
		return treasuresArray;
	}

	/**
	 * Add all treasures to cards
	 * @param {Array} treasuresArray 
	 * @param {Array} cardArray 
	 */
	_addAllTreasuresToCards(treasuresArray,cardArray){
		let cardsUpdatedWithTreasures = cardArray.slice();

		for(let treasure of treasuresArray){
			if (cardsUpdatedWithTreasures[treasure.row] !== undefined) {
				cardsUpdatedWithTreasures[treasure.row] = cardsUpdatedWithTreasures[treasure.row].slice();

				cardsUpdatedWithTreasures[treasure.row][treasure.col] = Object.assign({}, cardsUpdatedWithTreasures[treasure.row][treasure.col], {
					treasures: cardsUpdatedWithTreasures[treasure.row][treasure.col].treasures.concat(treasure),
				});
			}
		}
		return cardsUpdatedWithTreasures;
	}

	/**
	 * Ge all treasures from a card
	 * @param {Object} object 
	 */
	_getTreasuresFromObject(object){
		const treasures = object.treasures;
		if (treasures.length > 0) {
			return treasures;
		} else {
			return false;
		}
	}

	/**
	 * Update who retrieved the treasure
	 * @param {Object} object 
	 * @param {Array} objectsArray 
	 * @param {Object} collector 
	 */
	_markTreasureAsRetrieved(object,objectsArray,collector){
		let updatedObjects = objectsArray.slice();

		updatedObjects[object.id] = Object.assign({}, updatedObjects[object.id], {
			retrievedBy: collector.playerName
		});

		return updatedObjects;
	}

	/**
	 * Add a treasure to a card
	 * @param {Object} treasure 
	 * @param {Object} location 
	 * @param {Array} treasuresArray 
	 * @param {Array} locationArray 
	 */
	_addTreasureToCard(treasure,location,treasuresArray,locationArray){

		let objectsUpdatedWithTreasuresArray = locationArray.slice();

		objectsUpdatedWithTreasuresArray[location.row] = objectsUpdatedWithTreasuresArray[location.row].slice();
		objectsUpdatedWithTreasuresArray[location.row][location.col] = Object.assign({}, objectsUpdatedWithTreasuresArray[location.row][location.col], {
			treasures: objectsUpdatedWithTreasuresArray[location.row][location.col].treasures.concat(treasuresArray[treasure.id]),
		});

		return objectsUpdatedWithTreasuresArray;
	}

	/**
	 * Remove a treasure from a card
	 * @param {Object} location 
	 * @param {Array} objectArray 
	 */
	_removeTreasureFromCard(findTreasure,objectArray){
		let updatedObjectArray = objectArray.slice();
		let objectTreasuresArray = updatedObjectArray[findTreasure.row][findTreasure.col].treasures;
		const theTreasure = objectTreasuresArray.find( treasure => treasure.id === findTreasure.id );
		let updatedObjectTreasureArray = updatedObjectArray[findTreasure.row][findTreasure.col].treasures.filter(treasure => treasure.id !== theTreasure.id);

		updatedObjectArray[findTreasure.row] = updatedObjectArray[findTreasure.row].slice();
		updatedObjectArray[findTreasure.row][findTreasure.col] = Object.assign({}, updatedObjectArray[findTreasure.row][findTreasure.col], {
			treasures: updatedObjectTreasureArray //objectTreasures.filter((treasure, i) => i < objectTreasures.length - 1)
		});

		return updatedObjectArray;
	}

	/**
	 * Clear highlighted cards
	 * @param {Array} objectArray 
	 * @param {Array} possibleMoves 
	 */
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

	/**
	 * Highlight all possible moves for an object
	 * @param {Object} object 
	 */
	_highlightPossibleMoves(object){
		let cardArray = this.state.cardArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		let possibleMovesUnit = this.state.possibleMovesUnit.slice();
		let possibleMovesBoat = this.state.possibleMovesBoat.slice();
		let objectUnits = [];
		let currentPlayerUnit = null;
		let currentPlayerBoat = null;
		let playerBoat = playerBoatsArray[this.state.currentPlayer.playerId];
		let allowMovetoBoat = false;

		if (object.objectType === this.defaults.objectTypes.card) {
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
		if (object.objectType === this.defaults.objectTypes.outerWater) {
			
			//Get the boat from the outer water
			currentPlayerBoat = object.playerBoat;

			if (currentPlayerBoat) {
				//get the possible moves for the boat along the outer water
				possibleMovesBoat = this._findPossibleMoves(object, cardArray);
				//Get all units from the boat
				objectUnits = this._getPlayerUnitsFromObject(currentPlayerBoat);
				
				if (objectUnits) {
					//use that to get the current player unit
					currentPlayerUnit = this._getCurrentPlayerUnitFromObject(objectUnits);

					if (currentPlayerUnit) {
						//Current player unit found so find possible moves
						possibleMovesUnit = this._findPossibleMoves(currentPlayerBoat, cardArray);
					}
					
				}
			}
			/*console.log("Boat moves");
			console.log(possibleMovesBoat);
			console.log("Card moves");
			console.log(possibleMovesUnit);*/
		}

		cardArray = this._disableAllCards(cardArray);

		if (possibleMovesUnit.length > 0) {

			//There are possible moves for the card so display them
			for(let position of possibleMovesUnit){
				cardArray[position.row] = cardArray[position.row].slice();

				//Check if the move is to a card or if the card has the current player boat
				if (cardArray[position.row][position.col].objectType === this.defaults.objectTypes.card || this._cardHasThePlayerBoat(cardArray[position.row][position.col],playerBoat)) {
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

	/**
	 * Get all unit for the specified player
	 * @param {Object} player 
	 * @param {Array} allPlayerUnits 
	 */
	_getPlayerUnitsFromPlayer(player,allPlayerUnits){

		let updatedPlayerUnits = allPlayerUnits.slice();
		var specifiedPlayerUnits = [];

		//console.log("Player units during next turn");
		//console.log(updatedPlayerUnits);

		//Loop through all player units in order ot get the ones that belong to the specified player
		for(let playerUnit of updatedPlayerUnits){

			if (!playerUnit.dead) {
				if (playerUnit.playerId === player.playerId) {

					specifiedPlayerUnits.push(playerUnit);
				}
			}
		}

		return specifiedPlayerUnits;
	}

	/**
	 * Find all possible moves based on the card movement type
	 * @param {Object} object 
	 * @param {Array} objectArray 
	 */
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
		//Keep the object location so that it can be selected
		let moves = [{"row" : objectRow, "col" : objectCol}];

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
							//Ignore the coordinates of the object location
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
		return moves;
	}

	/**
	 * Get all player units from the given object
	 * @param {Object} object 
	 */
	_getPlayerUnitsFromObject(object){
		const units = object.units;
		if (units.length > 0) {
			return units;
		} else {
			return false;
		}
	}

	/**
	 * Ge the unit the belongs to the current player
	 * @param {Array} objectUnits 
	 */
	_getCurrentPlayerUnitFromObject(objectUnits){
		if (objectUnits && objectUnits.length > 0) {
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

	/**
	 * Handle what happens when object gets clicked on
	 * @param {Object} object 
	 */
	_handleClick(object){

		console.log("Object clicked");
		let updatedCardArray = this.state.cardArray.slice();
		const possibleMovesUnit = this.state.possibleMovesUnit.slice();
		const possibleMovesBoat = this.state.possibleMovesBoat.slice();
		const unitsArray = this.state.playerUnitsArray.slice();
		const playerBoatsArray = this.state.playerBoatsArray.slice();

		if (!this.state.currentPlayerUnit && !this.state.currentPlayerBoat) {
			//No unit or boat has been set, so just highlight the possible moves
			this._highlightPossibleMoves(object);
		} else
		if (
			(this.state.currentPlayerUnit 
			&&
			(
				(object.row === this.state.currentPlayerUnit.row) 
				&&
				(object.col === this.state.currentPlayerUnit.col)
			))
			||
			(this.state.currentPlayerBoat
			&&
			(
				(object.row === this.state.currentPlayerBoat.row)
				&&
				(object.col === this.state.currentPlayerBoat.col)
			))
		){
			//The player has selected a card that either has the current player unit or current play boat
			//Clear the unit possible moves
			updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
			//Clear the boat possible moves
			updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesBoat);
			//enable all cards that have the current player units and boats
			updatedCardArray = this._enableAllCardsWithCurrentplayerUnitsAndBoats(this.state.currentPlayer,updatedCardArray,unitsArray,playerBoatsArray);

			this.setState({
				currentPlayerUnit: null,
				currentPlayerBoat: null,
				cardArray: updatedCardArray,
				possibleMovesUnit: [],
				possibleMovesBoat: [],
			});
		} 
		else {
			//Current unit or boat have been selected and the destination does not contain either of them
			this._moveToDestination(object);
		}
	}

	/**
	 * Move the object to the destination
	 * @param {Object} object 
	 */
	_moveToDestination(object){
		console.log("Unit to move:");
		console.log(this.state.currentPlayerUnit);
		console.log("Boat to move:");
		console.log(this.state.currentPlayerBoat);

		let updatedCardArray = this.state.cardArray.slice();

		let updatedCurrentPlayer = null;
		let updatedPlayersArray = this.state.playersArray.slice();
		let updatedUnitsArray = this.state.playerUnitsArray.slice();
		let updatedPlayerBoatsArray = this.state.playerBoatsArray.slice();
		let updatedTreasuresArray = this.state.treasuresArray.slice();
		let treasureToMove = null;

		const possibleMovesUnit = this.state.possibleMovesUnit.slice();
		const possibleMovesBoat = this.state.possibleMovesBoat.slice();

		//A boat has been previously clicked
		if (this.state.currentPlayerBoat) {
			if (object.objectType === this.defaults.objectTypes.outerWater){
				console.log('move boat to OuterWater');

				//Get all units from the boat
				let objectUnits = this._getPlayerUnitsFromObject(this.state.currentPlayerBoat);

				if (objectUnits) {
					//Make sure the units get updated with proper location
					let futureBoatLocation = { row: object.row, col: object.col, objectType: this.defaults.objectTypes.boat };
					//Update all the units on the boat
					updatedUnitsArray = this._updateMultipleUnitsWithNewLocation(objectUnits,futureBoatLocation,updatedUnitsArray);
				}
				
				//Update all boats
				updatedPlayerBoatsArray = this._updateObjectWithNewLocation(this.state.currentPlayerBoat,updatedCardArray[object.row][object.col],updatedPlayerBoatsArray);
				//Remove boat from outer water
				updatedCardArray = this._removePlayerBoatFromOuterWater(this.state.currentPlayerBoat,updatedCardArray);
				//update the boats
				updatedCardArray = this._addPlayerBoatToOuterWater(updatedPlayerBoatsArray[this.state.currentPlayerBoat.id], updatedCardArray[object.row][object.col], updatedPlayerBoatsArray, updatedCardArray);
				//Clear the unit possible moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
				//Clear the boat possible moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesBoat);

			} else
			if (object.objectType === this.defaults.objectTypes.card) {
				console.log('move unit from boat to card');

				if(object.cardType === "shark"){
					//Remove the unit from the current location
					updatedPlayerBoatsArray = this._removeUnitFromBoat(this.state.currentPlayerUnit,this.state.currentPlayerBoat,updatedPlayerBoatsArray);
					//Removed the unit from the array
					updatedUnitsArray = this._markUnitAsdead(this.state.currentPlayerUnit,updatedUnitsArray);
					//updatedUnitsArray.splice(this.state.currentPlayerUnit.id,1);
					//Keep the card open
					updatedCardArray = this._setCardToStayOpen(object,updatedCardArray);
				} else {
					//Update the unit with the new location
					updatedUnitsArray = this._updateObjectWithNewLocation(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],this.state.playerUnitsArray);
					
					//Remove the unit from the current location
					updatedPlayerBoatsArray = this._removeUnitFromBoat(this.state.currentPlayerUnit,this.state.currentPlayerBoat,updatedPlayerBoatsArray);
					//Add the updated unit to the card
					updatedCardArray = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],updatedUnitsArray,updatedCardArray);
				}
				//Update the outer water
				updatedCardArray = this._addPlayerBoatToOuterWater(updatedPlayerBoatsArray[this.state.currentPlayerBoat.id], updatedCardArray[this.state.currentPlayerBoat.row][this.state.currentPlayerBoat.col], updatedPlayerBoatsArray, updatedCardArray);
				//Clear the unit possible moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
				//Clear the boat possible moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesBoat);
			}
		} else
		//a field with a unit has previous been clicked
		if (this.state.currentPlayerUnit) {
			//A card has been clicked on while no current boat is set
			if (object.objectType === this.defaults.objectTypes.card && !this.state.currentPlayerBoat) {
				console.log('move unit from card to card');

				if(object.cardType === "shark"){
					//Remove the unit from the current location
					updatedCardArray = this._removeUnitFromCard(this.state.currentPlayerUnit,updatedCardArray);
					//Removed the units from the array
					updatedUnitsArray = this._markUnitAsdead(this.state.currentPlayerUnit,updatedUnitsArray);
					//Keep the card open
					updatedCardArray = this._setCardToStayOpen(object,updatedCardArray);
				} else {
					//Update the unit with the new location
					updatedUnitsArray = this._updateObjectWithNewLocation(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],this.state.playerUnitsArray);
					//Remove the unit from the current location
					updatedCardArray = this._removeUnitFromCard(this.state.currentPlayerUnit,updatedCardArray);
					//Add the updated unit to the new location
					updatedCardArray = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],updatedUnitsArray,updatedCardArray);
				}

				//Get all treasures from the card
				let cardTreasures = this._getTreasuresFromObject(updatedCardArray[this.state.currentPlayerUnit.row][this.state.currentPlayerUnit.col]);

				if(cardTreasures){
					//A card has treasures so get the last one
					treasureToMove = cardTreasures[cardTreasures.length - 1];
					//Update the treasure with a new location
					updatedTreasuresArray = this._updateObjectWithNewLocation(treasureToMove, updatedCardArray[object.row][object.col],updatedTreasuresArray);
					//The object has a tresure so remove it 
					updatedCardArray = this._removeTreasureFromCard(treasureToMove,updatedCardArray);
					//Add it to the new location
					updatedCardArray = this._addTreasureToCard(treasureToMove,updatedCardArray[object.row][object.col],updatedTreasuresArray,updatedCardArray);
				}

				//Clear the unit possible moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);
			} else
			//An outer water with a boat has been clicked so move the unit to the boat
			if (object.objectType === this.defaults.objectTypes.outerWater){
				console.log('move unit from card to boat');
				//Update the unit with the new location
				updatedUnitsArray = this._updateObjectWithNewLocation(this.state.currentPlayerUnit,updatedPlayerBoatsArray[object.playerBoat.id],this.state.playerUnitsArray);
				//Remove the unit from the current location
				updatedCardArray = this._removeUnitFromCard(this.state.currentPlayerUnit,updatedCardArray);
				//Get all treasures from the card
				let cardTreasures = this._getTreasuresFromObject(updatedCardArray[this.state.currentPlayerUnit.row][this.state.currentPlayerUnit.col]);

				if(cardTreasures){
					//A card has treasures so get the last one
					treasureToMove = cardTreasures[cardTreasures.length - 1];
					//The object has a tresure so remove it 
					updatedCardArray = this._removeTreasureFromCard(treasureToMove,updatedCardArray);
					//A treasure has been delivered to a boat
					updatedTreasuresArray = this._markTreasureAsRetrieved(treasureToMove,updatedTreasuresArray,this.state.currentPlayer);
					//Player scored
					updatedPlayersArray = this._increaseScore(this.state.currentPlayer, updatedPlayersArray, 1);
					console.log("Player score increased");
				}

				//Add the updated unit to the boat
				updatedPlayerBoatsArray = this._addUnitToBoat(this.state.currentPlayerUnit, updatedPlayerBoatsArray[object.playerBoat.id], updatedUnitsArray, updatedPlayerBoatsArray);
				//Update the outer water
				updatedCardArray = this._addPlayerBoatToOuterWater(updatedPlayerBoatsArray[object.playerBoat.id], updatedCardArray[object.row][object.col], updatedPlayerBoatsArray, updatedCardArray);
				//Clear the possible moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMovesUnit);

			}
		}

		//Disable all cards
		//updatedCardArray = this._disableAllCards(updatedCardArray);

		//Get all player units
		let currentPlayerUnits = this._getPlayerUnitsFromPlayer(this.state.currentPlayer,updatedUnitsArray);
		//get the current player
		let currentPlayer = this._getCurrentPlayer(updatedPlayersArray);

		if (currentPlayerUnits.length === 0) {
			//All of the current player units are dead so set the player as dead
			updatedCardArray = this._disableAllCards(updatedCardArray);
			updatedPlayersArray = this._changePlayerState(this.state.currentPlayer,updatedPlayersArray,this.defaults.playerStates.dead);
			updatedPlayersArray = this._changePlayerResultText(this.state.currentPlayer,updatedPlayersArray,this.defaults.resultText.lose);

			//The player died so game is over
			this.context.setPlayers(updatedPlayersArray);
			this.context.setDisplayResults(true);
			//this.context.setDisplayScreen(this.defaults.screens.resultsScreen);
		}
		else
		if (currentPlayer.score === this.defaults.treasuresForWin){
			//The current player found enough treasures to win
			updatedCardArray = this._disableAllCards(updatedCardArray);
			updatedPlayersArray = this._changePlayerResultText(this.state.currentPlayer,updatedPlayersArray,this.defaults.resultText.win);
			//Current player reached the desired score so game is over
			this.context.setPlayers(updatedPlayersArray);
			this.context.setDisplayResults(true);
			//this.context.setDisplayScreen(this.defaults.screens.resultsScreen);
		}
		else {
			//Switch to the next player
			updatedPlayersArray = this._goNextPlayer(updatedPlayersArray); //this._createTurn(this.turnTypes.next,updatedPlayersArray); 
		
			//Get the next player
			updatedCurrentPlayer = this._getCurrentPlayer(updatedPlayersArray);

			//enable all cards that have the next players units and boats
			updatedCardArray = this._enableAllCardsWithCurrentplayerUnitsAndBoats(updatedCurrentPlayer,updatedCardArray,updatedUnitsArray,updatedPlayerBoatsArray);
		}

		this.setState({
			currentPlayerUnit: null,
			currentPlayerBoat: null,
			cardArray: updatedCardArray,
			possibleMovesUnit: [],
			possibleMovesBoat: [],
			currentPlayer: updatedCurrentPlayer,
			playersArray: updatedPlayersArray,
			playerUnitsArray: updatedUnitsArray,
			playerBoatsArray: updatedPlayerBoatsArray,
			treasuresArray: updatedTreasuresArray
		});
		console.log("--------------------- turn ended ---------------------------");
	}

	/**
	 * Change who the current player is
	 * @param {Array} playersArray 
	 */
	_goNextPlayer(playersArray){

		//Get the current player
		let currentPlayer = this.state.currentPlayer;
		let updatedPlayersArray = playersArray.slice();
		let currentPlayerId = currentPlayer.playerId;
		let playerStates = this.defaults.playerStates;

		if (currentPlayer.playerId < (playersArray.length -1)) {
			updatedPlayersArray = this._changePlayerState(currentPlayer,updatedPlayersArray,playerStates.previous);
			currentPlayerId += 1;
		} else {
			currentPlayerId = 0;
		}
		
		/* let nextPlayerAlive = false;
		let nextPlayer = "";
		while (nextPlayerAlive === false) {
			nextPlayer = this._getNextPlayer(currentPlayer,playersArray);
			if(nextPlayer.playerState !== "dead"){
				nextPlayerAlive = true;
			}
		} */

		updatedPlayersArray = this._changePlayerState(updatedPlayersArray[currentPlayerId],updatedPlayersArray,playerStates.current);
		return updatedPlayersArray
	};

	_getNextPlayer(currentPlayer,playersArray){
		//let counter = 0;
		//let nextPlayer = "";
		//while (counter < playersArray.length) {
			if((currentPlayer.playerId + 1) < playersArray.length){
				return playersArray[currentPlayer.playerId + 1];
			} else {
				return playersArray[0];
			}
			//counter++;
		//}
	}

	/**
	 * Increase the score for the given player
	 * @param {Object} player 
	 * @param {Array} playersArray 
	 * @param {integer} score 
	 */
	_increaseScore(player,playersArray,score){
		let updatedPlayersArray = playersArray.slice();
		let newScore = updatedPlayersArray[player.playerId].score + score;

		updatedPlayersArray[player.playerId] = Object.assign({}, updatedPlayersArray[player.playerId], {
			score: newScore
		});
		return updatedPlayersArray;
	}

	/**
	 * Create turn in order to allow a computer to go
	 * @param {Object} currentPlayer 
	 */
	_createTurn(currentPlayer){
		
		if(currentPlayer.computer){
			//Let the computer go
			setTimeout(() => {
				this._goComputer(currentPlayer);
			}, 500)
		}
	}

	/**
	 * Computer move, work in progress
	 * @param {Object} computerPlayer 
	 */
	_goComputer(computerPlayer){

		let updatedPlayersArray = this.state.playersArray.slice();

		let updatedCardArray = this.state.cardArray.slice();
		let updatedUnitsArray = this.state.playerUnitsArray.slice();
		let updatedPlayerBoatsArray  = this.state.playerBoatsArray.slice();

		const possibleMovesUnit = this.state.possibleMovesUnit.slice();
		const possibleMovesBoat = this.state.possibleMovesBoat.slice();

		//Get the computer units
		let computerUnits = this._getPlayerUnitsFromPlayer(computerPlayer,updatedUnitsArray);

		//if (this.state.currentPlayerUnit === "" && this.state.currentPlayerBoat === "") {
		
		//A placeholder move until a proper AI can me implemented
		console.log("moves where highlighted on:");
		let computerMoveFrom = updatedCardArray[4][0];
		let computerMoveTo = updatedCardArray[4][1];
		console.log(computerMoveTo);

		this._highlightPossibleMoves(computerMoveFrom);

		setTimeout(() => {

			console.log("move was performed to:");
			console.log(computerMoveTo);

			this._moveToDestination(computerMoveTo);
		},1700);

	}

	/**
	 * Find who the current player is
	 * @param {Array} playersArray 
	 */
	_getCurrentPlayer(playersArray){
		for(let player of playersArray){
			if(player.playerState === this.defaults.playerStates.current){
				return player;
			}
		}
		//No current player has been found so check the state
		return this.state.currentPlayer;
	};

	/**
	 * Enable all cards that contain the current player units and boat
	 * @param {Object} currentPlayer 
	 * @param {Array} cardArray 
	 * @param {Array} updatedUnitsArray 
	 * @param {Array} playerBoatsArray 
	 */
	_enableAllCardsWithCurrentplayerUnitsAndBoats(currentPlayer,cardArray,updatedUnitsArray,playerBoatsArray){

		let playerUnits = this._getPlayerUnitsFromPlayer(currentPlayer,updatedUnitsArray);
		let playerBoat = playerBoatsArray[currentPlayer.playerId];
		let updatedCardArray = cardArray.slice();

		//Add the boat so that it's not disabled
		playerUnits.push(playerBoat);

		for(let playerUnit of playerUnits) {
			if (!playerUnit.dead) {
				updatedCardArray[playerUnit.row] = updatedCardArray[playerUnit.row].slice();

				updatedCardArray[playerUnit.row][playerUnit.col] = Object.assign({}, updatedCardArray[playerUnit.row][playerUnit.col], {
					disabled: false
				});
			}
		}
		
		return updatedCardArray;
	}

	/**
	 * Disable all cards so that the player can only click on cards with their unit and boat
	 * @param {Array} cardArray 
	 */
	_disableAllCards(cardArray){

		let updatedCardArray = cardArray.slice();

		for(let r = 0; r < cardArray.length; r++ ){

			for(let c = 0; c < cardArray[r].length; c++){

				if(cardArray[r] !== undefined){

					updatedCardArray[r][c] = Object.assign({}, updatedCardArray[r][c], {
						disabled: true,
					});
				}
			}
			/* 
			for(let cardArrayRow of updatedCardArray){

				for(let card of cardArrayRow.slice()){
					
					if(card !== undefined){
						card = Object.assign(card, card, {
							disabled: true,
						});
					}
				}
			} */
		}
		return updatedCardArray;

	}

	/**
	 * Set the player state
	 * @param {Player} player 
	 * @param {Array} playersArray 
	 * @param {String} state 
	 */
	_changePlayerState(player,playersArray,state){
		let updatedPlayersArray = playersArray.slice();

		//If the player died, set their state to lost
		/* if(state === this.defaults.playerStates.dead){
			updatedPlayersArray = this._changePlayerResultText(player,updatedPlayersArray,this.defaults.resultText.lose);
		} */

		updatedPlayersArray[player.playerId] = Object.assign({}, updatedPlayersArray[player.playerId], {
			playerState: state
		});
		return updatedPlayersArray;
	}

	/**
	 * Set the result text
	 * @param {Player} player 
	 * @param {Array} playersArray 
	 * @param {String} text 
	 */
	_changePlayerResultText(player,playersArray,text){
		let updatedPlayersArray = playersArray.slice();
		
		console.log("This player should get new text");
		console.log(updatedPlayersArray[player.playerId]);
		console.log(text);
		
		updatedPlayersArray[player.playerId] = Object.assign({}, updatedPlayersArray[player.playerId], {
			resultText: text
		});
		return updatedPlayersArray;
	}

	/* _MarkPlayerAsDead(currentPlayer,playersArray){
		let updatedPlayersArray = playersArray.slice();
		let playerUnits = this._getPlayerUnitsFromPlayer(currentPlayer,updatedUnitsArray);
		if (playerUnits.length === 0) {
			updatedPlayersArray = this._changePlayerState(currentPlayer,playersArray,this.defaults.playerStates.dead);
		}
		return updatedPlayersArray;
	} */

};

GameBoard.contextType = DisplayScreenContext;

///Old code

/*for(let card of cardArray){
			for(let move of allMoves){
				if(card.row !== move.row && card.col !== move.col){
					cardArray[card.row] = cardArray[card.row].slice();
					cardArray[card.row][card.col] = Object.assign({}, cardArray[card.row][card.col], {
						disabled: true
					});
				}
			}
		}*/

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

/*	_createCardTypes(numberOfCards,numberOfPlayers){
		let outerWaterTypes = new Map([
			["horizontal",
				{ 
					cardType: 		"horizontal",
					movementType: 	"horizontal", 
					cardTypeClass: 	"horizontal" 
				}
			],
			["vertical",
				{ 
					cardType: 		"vertical",
					movementType: 	"vertical", 
					cardTypeClass: 	"vertical" 
				}
			]
		]);

		let cardTypes = new Map([
  			["horizontal vertical", 
  				{ 	
					cardType: 		"horizontal vertical",
					movementType: 	"horizontal vertical", 
					cardTypeClass: 	"horizontalVerticalCard",
					defaultCount: 	4
				}
			],
			["diagonal",
				{ 	
					cardType: 		"diagonal",
					movementType: 	"diagonal", 
					cardTypeClass: 	"diagonal",
					defaultCount: 	6
				}
			],
			["shark",
				{ 
					cardType: 		"shark",
					movementType: 	"none", 
					cardTypeClass: 	"shark",
					defaultCount: 	4 
				}
			],
			["sea horse",
				{ 
					cardType: 		"sea horse",
					movementType: 	"sea horse", 
					cardTypeClass: 	"seaHorse",
					defaultCount: 	4 
				}
			],
			["mermaid",
				{ 
					cardType: 		"mermaid",
					movementType: 	"mermaid", 
					cardTypeClass: 	"mermaid",
					defaultCount: 	2
				}
			],
			["all directions",
				{ 
					cardType: 		"all directions",
					movementType: 	"all", 
					cardTypeClass: 	"allDirections",
					defaultCount: 	2
				}
			],
			["fish",
				{ 
					cardType: 		"fish",
					movementType: 	"horizontal vertical", 
					cardTypeClass: 	"fish",
					defaultCount: 	8 
				}
			],
			["treasure",
				{ 
					cardType: 		"treasure",
					movementType: 	"horizontal vertical", 
					cardTypeClass: 	"treasure",
					defaultCount: 	6 
				}
			]
		]);
		return cardTypes;
	}*/

	/*_getAllOuterWater(outerWaterArray){
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		const playerUnitsArray = this.state.playerUnitsArray.slice();
		let updatedOuterWaterArray = outerWaterArray.slice();

		updatedOuterWaterArray = this._addAllBoatsToCards(this._addAllUnitsToBoats(playerUnitsArray,playerBoatsArray),updatedOuterWaterArray);
		return updatedOuterWaterArray
	}*/

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

	/*_updateOuterWaterBoat(boat, boatArray, outerWaterArray, options = {}){
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
	}*/

	//Work in progress
	/*_addMultipleUnitsToObject(unitList,object,playerUnitsArray,objectArray){

		let objectsUpdatedWithUnitsArray = objectArray.slice();

		objectsUpdatedWithUnitsArray[object.row] = objectsUpdatedWithUnitsArray[object.row].slice();
		objectsUpdatedWithUnitsArray[object.row][object.col] = Object.assign({}, objectsUpdatedWithUnitsArray[object.row][object.col], {
			units: objectsUpdatedWithUnitsArray[object.row][object.col].units.concat(playerUnitsArray[unitList]),
			disabled: false
		});

		return objectsUpdatedWithUnitsArray;
	}*/

	/*_createTurn(type,playersArray){
		let updatedPlayersArray = playersArray.slice();
		switch(type){
		case "current":
			console.log("current turn created");

			//Its current players turn so check if it is a computer
			if(this._getCurrentPlayer(updatedPlayersArray).playerType == 'computer'){
				//logAction("Computer Turn");
				//Let the computer go
				//goComputer();
			} else {
				//logAction("Human Turn");
			}
			break;
		case "next":
			//It is the next players turn so switch
			updatedPlayersArray = this._goNextPlayer(updatedPlayersArray);
			break;
		case "end":
			break;
		}
		return updatedPlayersArray;
	}*/

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
	//Highlight all the possible moves /*
/*
_getAllOuterWater(outerWaterArray){
		const playerBoatsArray = this.state.playerBoatsArray.slice();
		const playerUnitsArray = this.state.playerUnitsArray.slice();
		let displayArray = [];
		for(let i = 1; i < this.defaults.numberOfRows + 1; i++){
			displayArray.push(outerWaterArray[0][i]);
			displayArray.push(outerWaterArray[NUMBER_CARDS_PER_ROW + 1][i]);
			displayArray.push(outerWaterArray[i][0]);
			displayArray.push(outerWaterArray[i][this.defaults.numberOfRows + 1]);
		}
		displayArray = this._addAllBoatsToCards(this._addAllUnitsToBoats(playerUnitsArray,playerBoatsArray),displayArray);
		return displayArray;
	}
*/

//Update this to highlight the proper cards
	/*_highlightPossibleMovesOld(object){
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

/*_highlightPossibleMoves(object, objectItems){

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

	/*_highlightPossibleMoves(card){
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

	/*_removeUnitFromCard(findUnit,objectArray){
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
			this._highlightPossibleMoves(object, objectItems);

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
					updatedCardArray = this._removeUnitFromCard(this.state.currentPlayerUnit,cardArray);
					
	 				//Clear all moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
					
					//Add the unit to the object and return arrays to be updated
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

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
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

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
					updatedCardArray = this._removeUnitFromCard(this.state.currentPlayerUnit,cardArray);
					//Clear all moves
					updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
					
					//Add the unit to the card and return arrays to be updated
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

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
					let { objectsUpdatedWithUnitsArray, updatedUnitsArray } = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

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
			this._highlightPossibleMoves(object);

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
				let updatedCardArray = this._removeUnitFromCard(this.state.currentPlayerUnit,cardArray);
				
 				//Clear all moves
				updatedCardArray = this._clearPossibleMoves(updatedCardArray, possibleMoves);
				
				//Add the unit to the object and return arrays to be updated
				let { cardsUpdatedWithUnitsArray, updatedUnitsArray }  = this._addUnitToCard(this.state.currentPlayerUnit,updatedCardArray[object.row][object.col],playerUnitsArray,updatedCardArray);

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
				this._removeUnitFromCard(this.state.currentPlayerUnit);

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

/*_removeUnitFromCard(unit){
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
	/*_highlightPossibleMoves(card){

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
		//if(cardRow < this.defaults.numberOfRows){
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
			if (cardId > this.defaults.numberOfRows) {
				let topLeftRange = 7;
				let topRightRange = 3;
				//left
				//Check if the card is at the left edge
				if( cardId % this.defaults.numberOfRows === 1) {
					topLeftRange -=1;
				}
				//right
				//Check if the card is at the right edge
				if (cardId % this.defaults.numberOfRows === 0) {
					topRightRange +=1;
				}
				//Add all the cards to the moves based on the range
				for(let i = (cardId - topLeftRange); i < (cardId - (topRightRange + 1)); i++) {
					moves.push(i);
				}
			}
			//left side
			//Check if the card is not at the left edge
			if( cardId % this.defaults.numberOfRows !== 1) {
				//Add the card to the left to possible moves
				moves.push(cardId-1);
			}
			//right side
			//Check if the card is not at the right edge
			if (cardId % this.defaults.numberOfRows !== 0) {
				//Add the card to the right to possible moves
				moves.push(cardId+1);
			}
			//bottom
			//Make sure the card is not at the very bottom
			if (cardId < (DEFAULT_NUMBER_OF_CARDS - this.defaults.numberOfRows)) {
				let bottomLeftRange = 5;
				let bottomRightRange = 7;
				//left
				//Check if the card is at the left edge
				if( cardId % this.defaults.numberOfRows === 1) {
					bottomLeftRange +=1;
				}
				//right
				//Check if the card is at the right edge
				if (cardId % this.defaults.numberOfRows === 0) {
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