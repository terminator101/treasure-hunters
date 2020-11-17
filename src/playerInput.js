import React from 'react';
import PropTypes from 'prop-types';

const PlayerInput = ({ idx, playerState, handlePlayerChange, handlePlayerRemove }) => {
    const playerId = `name-${idx}`;
    const computerId = `computer-${idx}`;
    return (
        <div key={`player-${idx}`} className="border">
            <div className="form-group">
                <label htmlFor={ playerId }>&nbsp; {`Player #${idx + 1} Name:`} </label>
                <input
                    name={ playerId }
                    data-idx={ idx }
                    className="playerName"
                    type="text"
                    id={ playerId }
                    maxLength="15"
                    value={ playerState[idx].playerName }
                    onChange={ handlePlayerChange }
                    required 
                />
                {/* Implement once the computer player is ready  
                <div className="form-check">
                    <input
                        name={ computerId }
                        id={ computerId }
                        type="checkbox"
                        className="computer"
                        data-idx={ idx }
                        checked={ playerState[idx].computer }
                        onChange={ handlePlayerChange }
                    /> 
                    <label className="form-check-label" htmlFor={ computerId }>
                        Computer
                    </label>
                </div>*/}
            </div>
            {//Display the remove button but only if there are at least two players
            idx > 0 ? 
                <div className="form-group">
                    <button type="button" onClick={() => handlePlayerRemove(idx) } className="btn btn-danger">Remove player</button>
                </div>
            : ""}
        </div>
    );
};

PlayerInput.propTypes = {
    idx: PropTypes.number,
    playerState: PropTypes.array,
    handlePlayerChange: PropTypes.func,
};

export default PlayerInput;