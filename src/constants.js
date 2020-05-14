//Defaults

//Game
export const DEFAULT_NUMBER_OF_CARDS = 36;
export const NUMBER_OF_ROWS = 6;
export const NUMBER_CARDS_PER_ROW = 6;

//Player
export const DEAFULT_PLAYER_NAME = 'Andrej';

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

export const CARD_TYPES = new Map([
  			["horizontal vertical", 
  				{ 	
					cardType: 		"horizontal vertical",
					movementType: 	"horizontal vertical", 
					cardTypeClass: 	"horizontalVerticalCard",
					defaultCount: 	4,
					description:	"Player can move horizontally or vertically"
				}
			],
			["diagonal",
				{ 	
					cardType: 		"diagonal",
					movementType: 	"diagonal", 
					cardTypeClass: 	"diagonal",
					defaultCount: 	6,
					description:	"Player can move diagonally"
				}
			],
			["shark",
				{ 
					cardType: 		"shark",
					movementType: 	"none", 
					cardTypeClass: 	"shark",
					defaultCount: 	4,
					description:	"Kills the player unit"
				}
			],
			["sea horse",
				{ 
					cardType: 		"sea horse",
					movementType: 	"sea horse", 
					cardTypeClass: 	"seaHorse",
					defaultCount: 	4,
					description:	"Player can move in L like direction"
				}
			],
			["mermaid",
				{ 
					cardType: 		"mermaid",
					movementType: 	"mermaid", 
					cardTypeClass: 	"mermaid",
					defaultCount: 	2,
					description:	"Player can move diagonally as far as allowed"
				}
			],
			["all directions",
				{ 
					cardType: 		"all directions",
					movementType: 	"all", 
					cardTypeClass: 	"allDirections",
					defaultCount: 	2,
					description:	"Player can move in every direction"
				}
			],
			["fish",
				{ 
					cardType: 		"fish",
					movementType: 	"horizontal vertical", 
					cardTypeClass: 	"fish",
					defaultCount: 	8,
					description:	"Empty ocean"
				}
			],
			["chest",
				{ 
					cardType: 		"chest",
					movementType: 	"horizontal vertical", 
					cardTypeClass: 	"chest",
					defaultCount: 	6,
					treasure: 		true,
					description:	"Find these and deliver the treasure to your boat"
				}
			]
		]);

//All card types
/*export const CARD_TYPES = {
	'Treasure' : 'test'
}*/