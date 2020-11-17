import React from 'react';
import { SCREENS, DEAFULT_PLAYER_NAME } from './constants';

export const DisplayScreenContext = React.createContext({
    displayScreen: SCREENS.mainMenu,
    setDisplayScreen: () => {},
    playersArray: [{ playerId: 0, playerName: "", row: 0, col: 3, computer: false, playerClass: "player1", score: 0, boatImage: "ship_brown", resultText: "" }],
    //playersArray: [{ playerId: 0, playerName: "Tester", row: 0, col: 3, playerClass: "player1", score: 0, playerType: "human", boatImage: "ship_brown" }],
    setPlayers: () => {},
    displayResults: false,
    setDisplayResults: () => {},
    gameSettings: 'small',
    setGameSettings: () => {},
});