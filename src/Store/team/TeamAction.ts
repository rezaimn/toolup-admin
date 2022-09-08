import { SET_TEAMS } from './models/actions';
import { AppActions } from '../models/actions';
import { Team } from './models/Team';

export const setTeams = (teams: Team[]): AppActions => {
    return {
        type: SET_TEAMS,
        payload: teams,
    };
};
