import React from 'react';
import { SCREENS } from './constants';

export const DisplayScreenContext = React.createContext({
    displayScreen: SCREENS.gameBoard,
    setDisplayScreen: () => {},
});