import { Member } from './Member';

export const SET_MEMBERS = 'SET_MEMBERS';

interface SetMembersAction {
    type: typeof SET_MEMBERS;
    payload: Member[];
}

export type MemberActionTypes = SetMembersAction;
