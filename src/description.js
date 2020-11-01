import React from 'react';
import { CARD_TYPES, 
	CARD_IMAGE_LOCATION } from './constants';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

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

		this.state = {
			open: false,
		}
	}
	
	_openInfo(){
		this.setState({ 
			open: !this.state.open 
		});
	}

	render(){
        this.settings = Object.assign({}, this.defaults, this.props);
        const cardInformation = this._displayCardInformation(this.settings.cardInformation);
		return(
            <div>
				<Collapse in={ this.state.open }>
        			<div id="collapse-info">
						<div className="row justify-content-center">
							<div className="col-lg-5">
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
										The <span className="font-weight-bold">goal</span> of the game is to use your units to find treasures and deliver them to your boat!
									</li>
									<li>
										You can select your boat and then you can move it to the highlighted <span className="outer-water font-weight-bold">outer water</span> tiles
									</li>
									<li>
										You can select a unit (circle) and then you can move it to the <span className="shallows font-weight-bold">shallows</span>, as well as to and from a boat
									</li>
									<li>
										A boat can be moved regardless if there are any units on it
									</li>
									<li>
										A unit can only carry one treasure at a time
									</li>
									<li>
										Once a shark is killed, it acts same as a tile with fish
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
				</Collapse>
				<div className="row justify-content-center">
					<div className="col-lg-8">
						<div className="row justify-content-end">
							<div className="col-5">
								<Button className="btn btn-primary" type="button"
									onClick={ () => this._openInfo() }
									aria-controls="collapse-info"
									aria-expanded={ this.state.open }>
										{ this.state.open ? "Hide" : "Show" } instructions
								</Button>
							</div>
						</div>
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
				cardImage: card.cardImage, 
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
					cardImage = {cardInfo.cardImage}
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
			cardImage: "",
			cardDescription: "",
			imageLocation: CARD_IMAGE_LOCATION,
			imageClass:    "w-50",
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<tr>
				<td><img className={this.settings.imageClass} src={this.settings.imageLocation + "/" + this.settings.cardImage} alt="card" /></td>
				<td>{ this.settings.cardDescription }</td>
    		</tr>
		);
	}
}