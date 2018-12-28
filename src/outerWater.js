import React from 'react';

import { CARD_IMAGE_LOCATION, 
		IMAGE_PLACEHOLDER, 
		CARD_IMAGE_CLASS } from './constants';

//Outer water
export default class OuterWater extends React.Component {

	constructor(props) {
		super(props);

		//this.cardClass = this.props."cardObject"

		this.defaults = {
			id: 			0,
			row:  			0,
			col: 			0,
			imageLocation: 	CARD_IMAGE_LOCATION,
			cardImage: 		"",
			currentImage: 	IMAGE_PLACEHOLDER,
			cardClass: 		"col-sm-2 cardObject",
			imageClass:     CARD_IMAGE_CLASS,
			units:          "",
			possibleMove:   false,
			playerBoat: 	""
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);

		let imageLocation = this.settings.imageLocation + "/" + this.settings.imageLocation;
		let possibleMove = this.props.possibleMove ? 'possible' : '';
		let playerBoat = this.props.playerBoat ? this.props.playerBoat : '';
		return(
			<div className={this.settings.cardClass} onClick={() => this.props.onClick()}>
				<img className={this.settings.imageClass} src={imageLocation} alt="water" />
				<div className="waterInfo">{this.settings.row} - {this.settings.col}</div>
				<div className="isPossible">{possibleMove}</div>
				<div className="boatsHolder">{playerBoat}</div>
			</div>
		)
	}
}