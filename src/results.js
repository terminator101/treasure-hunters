import React from 'react';

///
export default class Results extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
			players: []
		}
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
			<div className="container">
                <div className="row justify-content-center">
                    <div className="col-8">
                        Game Over
                    </div>
                </div>
            </div>
		);
	}
}