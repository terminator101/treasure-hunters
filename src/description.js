import React from 'react';
import { CARD_TYPES } from './constants';

/**
 * Game description object
 */
export default class Description extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
            treasuresForWin: this.props.treasuresForWin,
            cardInformation: this._generateCardInformation(CARD_TYPES),
        }
    }

	render(){
        this.settings = Object.assign({}, this.defaults, this.props);
        const cardInformation = this._displayCardInformation(this.settings.cardInformation);
		return(
            <div>
			    <div className="row justify-content-center">
					<div className="col-lg-8">
						<table className="table table-bordered">
							<thead className="thead-dark">
								<tr>
									<th scope="col">Card</th>
									<th scope="col">Description</th>
								</tr>
							</thead>
							<tbody>
								{ cardInformation }
							</tbody>
						</table>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-lg-8">
					<ul>
						<li>
							Use your units to find treasures and deliver them to your boat!
						</li>
						<li>
							Tap on your boat and then you can move it to the highlighted tiles or you can move your units to the shallows
						</li>
						<li>
							A boat can be moved regardless if there are any units on it
						</li>
						<li>
							Delivering { this.settings.treasuresForWin } treasure(s) will win the game
						</li>
						<li>
							Losing all units will kick the player out of the game
						</li>
					</ul>
					</div>
				</div>
            </div>
		);
    }
    
    /**
	 * Generate the card information
	 * @param {array} cardTypesArray
	 */
	_generateCardInformation(cardTypesArray){
		let generatedInfo = [];

		cardTypesArray.forEach(function(card, key) {
			generatedInfo.push({ 
				cardName: card.cardType, 
				cardDescription: card.description
			});
		})
		return generatedInfo;
	}

	/**
	 * Display The card information
	 * @param {array} cardArray 
	 */
	_displayCardInformation(cardArray){
		return cardArray.map((cardInfo) => {
			return(
				<CardInfo
					key = {cardInfo.cardName}
					cardName = {cardInfo.cardName}
					cardDescription = {cardInfo.cardDescription}
				/>
			)
		});
	}
};

/**
 * Card Information object
 */
class CardInfo extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			cardName: "",
			cardDescription: ""
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<tr>
				<td>{ this.settings.cardName }</td>
				<td>{ this.settings.cardDescription }</td>
    		</tr>
		);
	}
}