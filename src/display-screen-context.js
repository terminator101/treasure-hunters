import React from 'react';
import { SCREENS, DEFAULT_PLAYERS, GAME_SETUPS } from './constants';

export const DisplayScreenContext = React.createContext({
    displayScreen: SCREENS.mainMenu,
    setDisplayScreen: () => {},
    playersArray: [DEFAULT_PLAYERS[0]],
    setPlayers: () => {},
    displayResults: false,
    setDisplayResults: () => {},
    gameSettings: GAME_SETUPS.small.value,
    setGameSettings: () => {},
});