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

//All card types
/*export const CARD_TYPES = {
	'Treasure' : 'test'
}*/