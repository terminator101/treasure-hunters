import React, { useState, useContext } from 'react';
import { DisplayScreenContext } from "./display-screen-context";
import { SCREENS, DEFAULT_PLAYERS, GAME_SETUPS } from './constants';
import PlayerInput from './playerInput';

const MainMenu = () => {
    
    //Enable context
    const displayScreenContext = useContext(DisplayScreenContext);
    //Set the default player
    const newPlayer = [DEFAULT_PLAYERS[0]]; //[{ playerId: 0, playerName: "", row: 0, col: 3, computer: false, playerClass: "player1", score: 0, boatImage: "ship_brown", resultText: "" }];
    
    const defaultPlayers = DEFAULT_PLAYERS;

    const [displayScreenContextPlayers] = useState(
        //Get the players from the context. If there are no players, just put the default one
        displayScreenContext.playersArray ? displayScreenContext.playersArray : newPlayer
    );

    //Get the game settings
    const gameSettings = displayScreenContext.gameSettings;
    const screens = SCREENS;

    const [gameSizes] = useState([
        {
            label: GAME_SETUPS.small.label,
            value: GAME_SETUPS.small.name,
        },
        {
            label: GAME_SETUPS.medium.label,
            value: GAME_SETUPS.medium.name,
        },
    ]);

    const [playerCounter, updatePlayerCounter] = useState(
        displayScreenContextPlayers.length
    );

    const [gameSettingsState, setGameSettingsState] = useState({
        gameSize: gameSettings,
    });

    const handleGameSettingsChange = (e) => setGameSettingsState({
        ...gameSettingsState,
        gameSize: e.target.value,
    });

    const [playerState, setPlayerState] = useState([
        ...displayScreenContextPlayers,
    ]);

    const addPlayer = () => {
        updatePlayerCounter(playerCounter + 1);
        /* setPlayerState([...playerState, {...newPlayer}]); */
        setPlayerState([...playerState, {...defaultPlayers[playerCounter]}]);
    };

    const addComputer = () => {
        updatePlayerCounter(playerCounter + 1);
        let newComputer = {...defaultPlayers[playerCounter]}
        newComputer.computer = true;
        setPlayerState([...playerState, newComputer]);
    }

    const handlePlayerRemove = (index) => {
        updatePlayerCounter(playerCounter - 1);
        const updatedPlayers = [...playerState];
        updatedPlayers.splice(index, 1);
        setPlayerState(updatedPlayers); 
    };

    const handlePlayerChange = (e) => {
        const updatedPlayers = [...playerState];
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        updatedPlayers[e.target.dataset.idx][e.target.name] = value;
        /* updatedPlayers[e.target.dataset.idx][e.target.className] = 
        e.target.value; */
        setPlayerState(updatedPlayers); 
    };

    //Check for any duplicate player nampes
    const checkPlayerNames = (players) => {
        if(players.length > 1){
            for(let c = 0; c < players.length; c++){
                for(let p = 0; p < players.length; p++){
                    if(c !== p && players[c].playerName === players[p].playerName){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //The submit button has been selected
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!checkPlayerNames(playerState)){
            //The check didn't pass so show error message
            alert('Player names must be unique');
        } else {
            //Pass the players to the context
            displayScreenContext.setPlayers( playerState );
            //Switch the screen to the gameboard
            displayScreenContext.setDisplayScreen(screens.gameBoard);
            //Update the context with the game size
            displayScreenContext.setGameSettings( gameSettingsState.gameSize );
        }
    };

    return (
        <div className="row h-100 no-gutters justify-content-center">
            <div className="col-md-6 col-lg-3">
                <form onSubmit={ handleSubmit }>
                    <div className="form-group">
                        <label htmlFor="gamesize">&nbsp; Game Size</label>
                        <select name="gamesize"
                            value={ gameSettingsState.gameSize }
                            className="form-control"
                            onChange={ handleGameSettingsChange }>
                            {gameSizes.map(({ label, value }) => (
                                <option key={ value } value={ value }>
                                    { label }
                                </option>
                            ))}
                        </select>
                    </div>
                    {
                        playerState.map((val, idx) => (
                            <PlayerInput
                                key={`player-${idx}`}
                                idx={ idx }
                                playerState={ playerState }
                                handlePlayerChange={ handlePlayerChange }
                                handlePlayerRemove={ handlePlayerRemove }
                            />
                        ))
                    }
                    {playerState.length < 2 ?
                    <div className="btn-group w-100 mb-2" role="group">
                        <button type="button" onClick={ addPlayer } className="btn btn-success">Add Player</button>
                        {/* Implement once the computer player is ready
                        <button type="button" onClick={ addComputer } className="btn btn-danger">Add Computer</button>
                        */}
                        </div>
                    : ""}
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block">Start Game</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MainMenu;

/*
<div className="row">
<div className="col pb-1">
    <label htmlFor="player0name">&nbsp; Player 1 Name:</label>
    <div className="row align-items-center">
        <div className="col">
            <input
                name="player0name" 
                className="form-control"
                type="text"
                id="player0name"
                value={ this.state.player0name }
                onChange={ this.handleInputChange }
                maxLength="15"
                required />
        </div>
        <div className="col">
            <div className="checkbox">
                <label>
                    <input
                        hidden="true"
                        name="player0computer"
                        type="checkbox"
                        checked={ this.state.player0computer } 
                        onChange={ this.handleInputChange } />
                    <span> </span>
                    { Computer }
                    </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    export default class MainMenu extends React.Component {

	constructor(props) {
		super(props);

		this.defaults = {
            players: [],
            screens: SCREENS,
        }

        this.state = {
            player0name: "",
            player0computer: false,
            player1name: "",
            player1computer: true,
        }

        //this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.player0name === ""){
            //A name wasn't entered so display error message
            alert("Player 1 must have a name");
        } else {
            //Update the context with the players
            this.context.setPlayers(this._createPlayers());
            //Move to the game board
            this.context.setDisplayScreen(this.defaults.screens.gameBoard);
        }
    }

    /**
     * Get the state of the input and update the value
     * @param {event} event 
    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    //Function for filling the players array
	_createPlayers(){
        let playersArray = [];
        playersArray.push({ playerId: 0, playerName: this.state.player0name, row: 0, col: 3, playerClass: "player1", score: 0, playerType: this.state.player0computer === false ? "human" : "computer", boatImage: "ship_brown", resultText: "" })
		//playersArray.push({ playerId: 0, playerName: "Andrej", row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human", boatImage: "ship_brown", resultText: "" });
		//playersArray.push({ playerId: 1, playerName: "Tester2", row: 3, col: 0, playerClass: "player2", score: 0, playerType: "human", boatImage: "ship_red", resultText: "" });
		return playersArray;
	}

	render(){
		this.settings = Object.assign({}, this.defaults, this.props);
		return(
            <div className="row h-100 no-gutters justify-content-center">
                <form onSubmit={ this.handleSubmit }>
                    <div className="form-group">
                        <div className="row">
                            <div className="col pb-1">
                                <label htmlFor="gamesize">&nbsp; Game Size</label>    
                                <select
                                    name="gamesize"
                                    className="form-control">
                                    <option>Small</option>
                                    <option>Medium</option>
                                </select>
                            </div>    
                        </div>
                        <PlayerEntry
                            playerId={0}
                            playerNumber={1}
                            playerName={""}
                        />
                        <div className="row">
                            <div className="col pb-1">
                                <button type="submit" className="btn btn-primary">Start Game</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
		);
	}
};

MainMenu.contextType = DisplayScreenContext;
*/