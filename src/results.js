import React from 'react';
import { DisplayScreenContext } from "./display-screen-context";

import { SCREENS } from './constants';

///
export default class Results extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			players: [],
			screens: SCREENS,
		}
	}

	_handleClick(e) {    
        //e.preventDefault();    
        //console.log('The link was clicked.');
        this.context.setDisplayScreen(this.defaults.screens.gameBoard);
    }

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div className="container">
                <div className="row h-100 no-gutters justify-content-center">
					<div className="form-group">
						<div className="col pb-1">
							<div className="form-group">
								Game Over
							</div>
							<div class="form-group">
								<button type="button" className="btn btn-primary"
									value="Start"     
									onClick={() => this._handleClick()}>Restart
								</button>
							</div>
						</div>
					</div>
                </div>
            </div>
		);
	}
}

Results.contextType = DisplayScreenContext;