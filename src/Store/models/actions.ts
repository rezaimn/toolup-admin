import { MemberActionTypes } from '../member/models/actions';
import { TeamsActionTypes } from '../team/models/actions';

export type AppActions = MemberActionTypes | TeamsActionTypes;
