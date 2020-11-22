//Defaults

//Game
//export const DEFAULT_NUMBER_OF_CARDS = 36;
//export const NUMBER_OF_ROWS = 6;
//export const NUMBER_CARDS_PER_ROW = 6;

//Player
export const DEAFULT_PLAYER_NAME = 'Tester';

export const DEFAULT_PLAYERS = [
	{ playerId: 0, playerName: "player1", 
		gameSmallLocation: {row: 0, col: 2}, 
		gameMediumLocation: {row: 0, col: 2}, 
		computer: false, playerClass: "player1", score: 0, boatImage: "ship_brown", resultText: ""},
	{ playerId: 1, playerName: "player2", 
		gameSmallLocation: {row: 2, col: 0}, 
		gameMediumLocation: {row: 3, col: 0},
		computer: false, playerClass: "player2", score: 0, boatImage: "ship_red", resultText: ""},
	{ playerId: 2, playerName: "player3", 
		gameSmallLocation: {row: 2, col: 4}, 
		gameMediumLocation: {row: 2, col: 5},
		computer: false, playerClass: "player3", score: 0, boatImage: "ship_green", resultText: ""},
	{ playerId: 3, playerName: "player4", 
		gameSmallLocation: {row: 4, col: 2}, 
		gameMediumLocation: {row: 5, col: 3},
		computer: false, playerClass: "player4", score: 0, boatImage: "ship_yellow", resultText: ""},
]

export const PLAYER_STATES = {
	current: 	'current',
	previous: 	'previous',
	dead: 		'dead'
}

export const SCREENS = {
	mainMenu:	'mainMenu',
	gameBoard: 	'gameBoard',
	resultsScreen: 'resultsScreen'
}

export const UNIT_HOLDERS = {
	oneUnit: 'unitsHolderOne',
	twoUnits: 'unitsHolderTwo',
	threeUnits: 'unitsHolderThree',
	fourUnits: 'unitsHolderFour',
}

export const RESULT_TEXT = {
	win: "Won the game",
	lose: "Lost all divers",
}

export const DEFAULT_UNTS_PER_PLAYER = 2;

//Card
export const CARD_IMAGE_LOCATION = 'http://andrejdeveloper.com/wp-content/uploads';
export const IMAGE_PLACEHOLDER   = 'shallow.png';
export const CARD_CLASS    		 = 'cardObject';
export const CARD_IMAGE_CLASS	 = 'img-fluid mx-auto d-block cardImage';
export const CARD_WIDTH		 	 = 'col-md-2';

export const OUTER_WATER_TYPES = {
	top: 	'top',
	bottom: 'bottom',
	left: 	'left',
	right: 	'right'
}

export const GAME_SETUPS = {
	small: 
	{
		label: "Small",
		value: "small",
		playerLocations: "gameSmallLocation",
		numberOfRows: 3,
		numberCardsPerRow: 3,
		unitsPerPlayer: 2,
		gameBoardWidthClass: "col-12 col-md-6",
		cardRowWidthClass: "col-6 col-md-6",
		cardWidthClass: "col-4 col-md-4",
		outerWaterSideWidth: "2",
		cardTypeNumbersCount: new Map ([
			['horizontal_vertical', 1],
			['chest', 2],
			['shark', 2],
			['all_directions', 1],
			['fish', 1],
			['mermaid', 1],
			['diagonal', 1],
		]),
	},
	medium: 
	{
		label: "Medium (work in progress)",
		value: "medium",
		playerLocations: "gameMediumLocation",
		numberOfRows: 4,
		numberCardsPerRow: 4,
		unitsPerPlayer: 2,
		gameBoardWidthClass: "col-12 col-md-8",
		cardRowWidthClass: "col-8 col-md-8",
		cardWidthClass: "col-3 col-md-3",
		outerWaterSideWidth: "2",
		cardTypeNumbersCount: new Map ([
			['horizontal_vertical', 2],
			['chest', 3],
			['shark', 3],
			['sea_horse', 2],
			['all_directions', 2],
			['fish', 1],
			['mermaid', 1],
			['diagonal', 2],
		]),
	},
	large: 
	{
		numberOfRows: 6,
		numberCardsPerRow: 6,
		unitsPerPlayer: 2,
		gameBoardWidthClass: "col-12",
		cardRowWidthClass: "col-sm-10",
		cardWidthClass: "col-sm-2",
		outerWaterSideWidth: "1",
		cardTypeNumbersCount: new Map ([
			['horizontal_vertical', 4],
			['diagonal', 6],
			['shark', 4],
			['sea_horse', 4],
			['mermaid', 2],
			['all_directions', 2],
			['fish', 8],
			['chest', 6],
		]),
	}
}

export const CARD_TYPES = new Map([
	["horizontal_vertical", 
		{ 	
			cardType: 		"horizontal vertical",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"horizontalVerticalCard",
			description:	"The diver can move horizontally or vertically",
			cardImage: 		"horizontal_vertical.png"
		}
	],
	["diagonal",
		{ 	
			cardType: 		"diagonal",
			movementType: 	"diagonal", 
			cardTypeClass: 	"diagonal",
			description:	"The diver can move diagonally",
			cardImage: 		"diagonal.png"
		}
	],
	["shark",
		{ 
			cardType: 		"shark",
			movementType: 	"none", 
			cardTypeClass: 	"shark",
			description:	"Kills the diver and dies as well",
			cardImage: 		"shark.png"
		}
	],
	["sea_horse",
		{ 
			cardType: 		"sea horse",
			movementType: 	"sea horse", 
			cardTypeClass: 	"seaHorse",
			description:	"The diver can move in L like direction",
			cardImage: 		"seahorse.png",
		}
	],
	["mermaid",
		{ 
			cardType: 		"mermaid",
			movementType: 	"mermaid", 
			cardTypeClass: 	"mermaid",
			description:	"The diver can move diagonally as far as allowed",
			cardImage: 		"mermaid.png",
		}
	],
	["all_directions",
		{ 
			cardType: 		"all directions",
			movementType: 	"all", 
			cardTypeClass: 	"allDirections",
			description:	"The diver can move in every direction",
			cardImage: 		"all_directions.png",
		}
	],
	["fish",
		{ 
			cardType: 		"fish",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"fish",
			description:	"Empty sea",
			cardImage: 		"fish.png",
		}
	],
	["chest",
		{ 
			cardType: 		"chest",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"chest",
			treasures: 		[],
			description:	"Find these and deliver the treasure to your boat",
			cardImage: 		"chest.png",
		}
	]
]);

/* export const CARD_TYPES_TEST = {
	horizontal_vertical: 
	{ 	
		cardType: 		"horizontal vertical",
		movementType: 	"horizontal vertical", 
		cardTypeClass: 	"horizontalVerticalCard",
		defaultCount: 	4,
		description:	"The diver can move horizontally or vertically"
	},
	diagonal: 
	{ 	
		cardType: 		"diagonal",
		movementType: 	"diagonal", 
		cardTypeClass: 	"diagonal",
		defaultCount: 	6,
		description:	"The diver can move diagonally"
	},
	shark: 
	{ 
		cardType: 		"shark",
		movementType: 	"none", 
		cardTypeClass: 	"shark",
		defaultCount: 	4,
		description:	"Kills the diver and dies as well",
		image: 			"shark.png"
	},
	sea_horse:
	{ 
		cardType: 		"sea horse",
		movementType: 	"sea horse", 
		cardTypeClass: 	"seaHorse",
		defaultCount: 	4,
		description:	"The diver can move in L like direction",
		image: 			"seahorse.png"
	},
	mermaid:
	{ 
		cardType: 		"mermaid",
		movementType: 	"mermaid", 
		cardTypeClass: 	"mermaid",
		defaultCount: 	2,
		description:	"The diver can move diagonally as far as allowed",
	},
	all_directions:
	{ 
		cardType: 		"all directions",
		movementType: 	"all", 
		cardTypeClass: 	"allDirections",
		defaultCount: 	2,
		description:	"The diver can move in every direction",
		image: 			"all_directions.png"
	},
	fish:
	{ 
		cardType: 		"fish",
		movementType: 	"horizontal vertical", 
		cardTypeClass: 	"fish",
		defaultCount: 	8,
		description:	"Empty ocean",
		image: 			"fish.png"
	},
	chest:
	{ 
		cardType: 		"chest",
		movementType: 	"horizontal vertical", 
		cardTypeClass: 	"chest",
		defaultCount: 	6,
		treasures: 		[],
		description:	"Find these and deliver the treasure to your boat",
	},
}; */

//All card types
/*export const CARD_TYPES = {
	'Treasure' : 'test'
}*/