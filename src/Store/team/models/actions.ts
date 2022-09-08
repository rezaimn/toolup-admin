import { Team } from './Team';

export const SET_TEAMS = 'SET_TEAMS';

interface SetTeamsAction {
    type: typeof SET_TEAMS;
    payload: Team[];
}

export type TeamsActionTypes = SetTeamsAction;
