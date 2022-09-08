import { pipe, get, toString } from 'lodash/fp';

export const buildJsxKey = pipe(get('id'), toString);
