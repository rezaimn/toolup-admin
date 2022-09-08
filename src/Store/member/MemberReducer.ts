import { SET_MEMBERS, MemberActionTypes } from './models/actions';

import { Member } from './models/Member';

// @ts-ignore
import { Action, Reducer } from 'redux';

const initializeState: Member[] = [];

// @ts-ignore
export const memberReducer: Reducer<Member[], Action> = (
    state = initializeState,
    action: MemberActionTypes
) => {
    const newState = action.payload;
    switch (action.type) {
        case SET_MEMBERS: {
            return newState;
        }
        default:
            return state;
    }
};
