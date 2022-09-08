import { SET_MEMBERS } from './models/actions';
import { AppActions } from '../models/actions';
import { Member } from './models/Member';

export const setMembers = (members: Member[]): AppActions => {
    return {
        type: SET_MEMBERS,
        payload: members,
    };
};
