import { pipe, first, shuffle, reject, get } from 'lodash/fp';
import { isNullOrUndefined } from './isNullOrUndefined';

export const randomMember = pipe(
    shuffle,
    reject(pipe(get('first_name'), isNullOrUndefined)),
    reject(pipe(get('last_name'), isNullOrUndefined)),
    first
);
