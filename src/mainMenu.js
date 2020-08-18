import React from 'react';
import { DisplayScreenContext } from "./display-screen-context";

import { SCREENS } from './constants';

///
export default class MainMenu extends React.Component {

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
                            <div class="form-group">
                                <label for="player0">&nbsp; Player 1 Name:</label>
                            </div>
                            <div className="form-group">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <input className="form-control" id="player0" type="text" maxlength="15" />
                                    </div>
                                    <div className="col">
                                        <div className="checkbox">
                                            <label>
                                                <input id="computer0" type="checkbox" value="computer" />
                                                <span> Computer</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="button" className="btn btn-primary"
                                    value="Start"     
                                    onClick={() => this._handleClick()}>Start Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
};

MainMenu.contextType = DisplayScreenContext;