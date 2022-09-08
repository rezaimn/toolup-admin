import { TeamsActionTypes, SET_TEAMS } from './models/actions';

import { Team } from './models/Team';

// @ts-ignore
import { Action, Reducer } from 'redux';

const initializeState: Team[] = [];

// @ts-ignore
export const teamReducer: Reducer<Team[], Action> = (
    state = initializeState,
    action: TeamsActionTypes
) => {
    const newState = { ...action.payload };
    switch (action.type) {
        case SET_TEAMS: {
            return newState;
        }
        default:
            return state;
    }
};
