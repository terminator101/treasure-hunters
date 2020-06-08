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

export const DEFAULT_UNTS_PER_PLAYER = 2;

//Card
export const CARD_IMAGE_LOCATION = '/card_images';
export const IMAGE_PLACEHOLDER   = 'empty.jpg';
export const CARD_CLASS    		 = 'cardObject';
export const CARD_IMAGE_CLASS	 = 'img-fluid mx-auto d-block';
export const CARD_WIDTH		 	 = 'col-sm-2';

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
		unitsPerPlayer: 1,
		gameBoardWidthClass: "col-8",
		cardRowWidthClass: "col-sm-8",
		cardWidthClass: "col-sm-4",
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
		description:	"Kills the player unit and dies as well"
	},
	sea_horse:
	{ 
		cardType: 		"sea horse",
		movementType: 	"sea horse", 
		cardTypeClass: 	"seaHorse",
		defaultCount: 	4,
		description:	"Player can move in L like direction"
	},
	mermaid:
	{ 
		cardType: 		"mermaid",
		movementType: 	"mermaid", 
		cardTypeClass: 	"mermaid",
		defaultCount: 	2,
		description:	"Player can move diagonally as far as allowed"
	},
	all_directions:
	{ 
		cardType: 		"all directions",
		movementType: 	"all", 
		cardTypeClass: 	"allDirections",
		defaultCount: 	2,
		description:	"Player can move in every direction"
	},
	fish:
	{ 
		cardType: 		"fish",
		movementType: 	"horizontal vertical", 
		cardTypeClass: 	"fish",
		defaultCount: 	8,
		description:	"Empty ocean"
	},
	chest:
	{ 
		cardType: 		"chest",
		movementType: 	"horizontal vertical", 
		cardTypeClass: 	"chest",
		defaultCount: 	6,
		treasures: 		[],
		description:	"Find these and deliver the treasure to your boat"
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
			smallCount:		1
		}
	],
	["diagonal",
		{ 	
			cardType: 		"diagonal",
			movementType: 	"diagonal", 
			cardTypeClass: 	"diagonal",
			defaultCount: 	6,
			description:	"Player can move diagonally",
			smallCount:		1
		}
	],
	["shark",
		{ 
			cardType: 		"shark",
			movementType: 	"none", 
			cardTypeClass: 	"shark",
			defaultCount: 	4,
			description:	"Kills the player unit and dies as well",
			smallCount:		2
		}
	],
	["sea_horse",
		{ 
			cardType: 		"sea horse",
			movementType: 	"sea horse", 
			cardTypeClass: 	"seaHorse",
			defaultCount: 	4,
			description:	"Player can move in L like direction",
			smallCount:		0
		}
	],
	["mermaid",
		{ 
			cardType: 		"mermaid",
			movementType: 	"mermaid", 
			cardTypeClass: 	"mermaid",
			defaultCount: 	2,
			description:	"Player can move diagonally as far as allowed",
			smallCount:		1
		}
	],
	["all_directions",
		{ 
			cardType: 		"all directions",
			movementType: 	"all", 
			cardTypeClass: 	"allDirections",
			defaultCount: 	2,
			description:	"Player can move in every direction",
			smallCount:		1
		}
	],
	["fish",
		{ 
			cardType: 		"fish",
			movementType: 	"horizontal vertical", 
			cardTypeClass: 	"fish",
			defaultCount: 	8,
			description:	"Empty sea",
			smallCount:		1
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
			smallCount:		2
		}
	]
]);

//All card types
/*export const CARD_TYPES = {
	'Treasure' : 'test'
}*/