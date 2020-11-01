//Defaults

//Game
export const DEFAULT_NUMBER_OF_CARDS = 36;
export const NUMBER_OF_ROWS = 6;
export const NUMBER_CARDS_PER_ROW = 6;

//Player
export const DEAFULT_PLAYER_NAME = 'Tester';

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
	lose: "Lost all units",
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
		numberOfRows: 3,
		numberCardsPerRow: 3,
		unitsPerPlayer: 2,
		gameBoardWidthClass: "col-12 col-md-8",
		cardRowWidthClass: "col-6 col-md-6",
		cardWidthClass: "col-4 col-md-4",
		outerWaterSideWidth: "2",
		cardTypeNumbersCount: [
			{horizontal_vertical: 1},
			{chest: 2},
			{shark: 2},
			{all_directions: 1},
			{fish: 1},
			{mermaid: 1},
			{diagonal: 1},
		],
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
		cardTypeNumbersCount: [
			{horizontal_vertical: 4},
			{diagonal: 6},
			{shark: 4},
			{sea_horse: 4},
			{mermaid: 2},
			{all_directions: 2},
			{fish: 8},
			{chest: 6},
		],
	}
}

export const CARD_TYPES_TEST = {
	horizontal_vertical: 
	{ 	
		cardType: 		"horizontal vertical",
		movementType: 	"horizontal vertical", 
		cardTypeClass: 	"horizontalVerticalCard",
		defaultCount: 	4,
		description:	"Player can move horizontally or vertically"
	},
	diagonal: 
	{ 	
		cardType: 		"diagonal",
		movementType: 	"diagonal", 
		cardTypeClass: 	"diagonal",
		defaultCount: 	6,
		description:	"Player can move diagonally"
	},
	shark: 
	{ 
		cardType: 		"shark",
		movementType: 	"none", 
		cardTypeClass: 	"shark",
		defaultCount: 	4,
		description:	"Kills the player unit and dies as well",
		image: 			"shark.png"
	},
	sea_horse:
	{ 
		cardType: 		"sea horse",
		movementType: 	"sea horse", 
		cardTypeClass: 	"seaHorse",
		defaultCount: 	4,
		description:	"Player can move in L like direction",
		image: 			"seahorse.png"
	},
	mermaid:
	{ 
		cardType: 		"mermaid",
		movementType: 	"mermaid", 
		cardTypeClass: 	"mermaid",
		defaultCount: 	2,
		description:	"Player can move diagonally as far as allowed",
	},
	all_directions:
	{ 
		cardType: 		"all directions",
		movementType: 	"all", 
		cardTypeClass: 	"allDirections",
		defaultCount: 	2,
		description:	"Player can move in every direction",
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
};

export const CARD_TYPES = new Map([
	["horizontal_vertical", 
		{ 	
			cardType: 		"horizontal vertical",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"horizontalVerticalCard",
			defaultCount: 	4,
			description:	"Player can move horizontally or vertically",
			smallCount:		1,
			cardImage: 		"horizontal_vertical.png"
		}
	],
	["diagonal",
		{ 	
			cardType: 		"diagonal",
			movementType: 	"diagonal", 
			cardTypeClass: 	"diagonal",
			defaultCount: 	6,
			description:	"Player can move diagonally",
			smallCount:		0,
			cardImage: 		"diagonal.png"
		}
	],
	["shark",
		{ 
			cardType: 		"shark",
			movementType: 	"none", 
			cardTypeClass: 	"shark",
			defaultCount: 	4,
			description:	"Kills the player unit and dies as well",
			smallCount:		2,
			cardImage: 		"shark.png"
		}
	],
	["sea_horse",
		{ 
			cardType: 		"sea horse",
			movementType: 	"sea horse", 
			cardTypeClass: 	"seaHorse",
			defaultCount: 	4,
			description:	"Player can move in L like direction",
			smallCount:		0,
			cardImage: 		"seahorse.png",
		}
	],
	["mermaid",
		{ 
			cardType: 		"mermaid",
			movementType: 	"mermaid", 
			cardTypeClass: 	"mermaid",
			defaultCount: 	2,
			description:	"Player can move diagonally as far as allowed",
			smallCount:		1,
			cardImage: 		"mermaid.png",
		}
	],
	["all_directions",
		{ 
			cardType: 		"all directions",
			movementType: 	"all", 
			cardTypeClass: 	"allDirections",
			defaultCount: 	2,
			description:	"Player can move in every direction",
			smallCount:		1,
			cardImage: 		"all_directions.png",
		}
	],
	["fish",
		{ 
			cardType: 		"fish",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"fish",
			defaultCount: 	8,
			description:	"Empty sea",
			smallCount:		2,
			cardImage: 		"fish.png",
		}
	],
	["chest",
		{ 
			cardType: 		"chest",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"chest",
			defaultCount: 	6,
			treasures: 		[],
			description:	"Find these and deliver the treasure to your boat",
			smallCount:		2,
			cardImage: 		"chest.png",
		}
	]
]);

//All card types
/*export const CARD_TYPES = {
	'Treasure' : 'test'
}*/