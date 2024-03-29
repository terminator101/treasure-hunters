import React, { useState } from 'react';
import { CARD_TYPES, 
	CARD_IMAGE_LOCATION } from './constants';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

/**
 * Game description object
 */
const Description = (props) => {

	const treasuresForWin = props.treasuresForWin;
	const unitsPerPlayer = props.unitsPerPlayer;

	/**
	 * Generate the card information
	 * @param {array} cardTypesArray
	 */
	const _generateCardInformation = (cardTypesArray) => {
		let generatedInfo = [];

		cardTypesArray.forEach(function(card, key) {
			generatedInfo.push({ 
				cardType: card.cardType,
				cardImage: card.cardImage, 
				cardDescription: card.description
			});
		})
		return generatedInfo;
	};

	const [cardInformation] = useState({
		..._generateCardInformation(CARD_TYPES)
	});
	const [open, setOpen] = useState( false );

	/**
	 * Display The card information
	 * @param {array} cardArray 
	 */
	const _displayCardInformation = (cardArray) => {
		return Object.values(cardArray).map((cardInfo) => {
			return(
				<CardInfo
					key = {cardInfo.cardType}
					cardImage = {cardInfo.cardImage}
					cardDescription = {cardInfo.cardDescription}
				/>
			)
		});
	}

	return (
		<div>
			<Collapse in={ open }>
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
									{ _displayCardInformation(cardInformation) }
								</tbody>
							</table>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-lg-8">
							<ul>
								<li>
									The <span className="font-weight-bold">goal</span> of the game is to use your divers to find treasure(s) and bring it to your boat!
								</li>
								<li>
									Each player starts with <span className="font-weight-bold">{ unitsPerPlayer }</span> divers and losing both will end the game
								</li>
								<li>
									Start by selecting your boat and then select an adjacent tile to move
								</li>
								<li>
									A boat can move to the highlighted <span className="outer-water font-weight-bold">outer water</span> tiles, and moved regardless if there are any divers on it. It cannot move to the <span className="shallows font-weight-bold">shallows</span>
								</li>
								<li>
									A diver (circle) can move to the <span className="shallows font-weight-bold">shallows</span>, as well as to and from a boat, and can only carry one treasure at a time
								</li>
								<li>
									Once a shark is killed, it acts same as a tile with fish and if there is a treasure on it, it can be retrieved
								</li>
								<li>
									Delivering <span className="font-weight-bold">{ treasuresForWin }</span> treasure(s) to your boat will win the game
								</li>
							</ul>
						</div>
					</div>
				</div>
			</Collapse>
			<div className="row justify-content-center">
				<div className="col-lg-8">
					<div className="row justify-content-end">
						<div className="col-6 col-md-3">
							<Button className="btn btn-primary" type="button"
								onClick={ () => setOpen( !open ) }
								aria-controls="collapse-info"
								aria-expanded={ open }>
									{ open ? "Hide" : "Show" } instructions
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div> 
	);
};

export default Description;

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