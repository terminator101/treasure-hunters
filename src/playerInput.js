import React from 'react';
import PropTypes from 'prop-types';

const PlayerInput = ({ idx, playerState, handlePlayerChange, handlePlayerRemove }) => {
    const playerId = `name-${idx}`;
    const computerId = `computer-${idx}`;
    return (
        <div key={`player-${idx}`} className={"border " + playerState[idx].playerClass + "color mb-2"}>
            <div className="form-row">
                <div className="form-group col-3 text-white mb-0">
                    <label htmlFor={ playerId }>&nbsp; {`Player #${idx + 1}`}</label>&nbsp; 
                </div>
                <div className="form-group col-7 mb-0">
                    <input
                        name="playerName"
                        data-idx={ idx }
                        className="playerName"
                        placeholder="Enter Name"
                        type="text"
                        id={ playerId }
                        maxLength="15"
                        value={ playerState[idx].playerName }
                        onChange={ handlePlayerChange }
                        required 
                    />
                </div>
                {//Display the remove button but only if there are at least two players and only display this for the last player
                (idx > 0 && idx === (playerState.length - 1)) ?
                <div className="form-group col-2 text-white mb-0">
                    <button type="button" onClick={() => handlePlayerRemove(idx) } className="btn btn-danger">X</button>
                </div>
                : ""}
            </div>
            {/* Implement once the computer player is ready  
            idx > 0 ?
            <div className="form-row">
                <div className="form-check col-10 offset-3 text-white">
                    <input
                        name="computer"
                        id={ computerId }
                        type="checkbox"
                        className="computer"
                        data-idx={ idx }
                        checked={ playerState[idx].computer }
                        onChange={ handlePlayerChange }
                    />&nbsp;
                    <label className="form-check-label" htmlFor={ computerId }>
                        Computer
                    </label>
                </div>
            </div>
            : ""*/}
        </div>
    );
};

PlayerInput.propTypes = {
    idx: PropTypes.number,
    playerState: PropTypes.array,
    handlePlayerChange: PropTypes.func,
};

export default PlayerInput;