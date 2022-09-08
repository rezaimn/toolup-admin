import { isNull, isUndefined } from 'lodash/fp';

export const isNullOrUndefined = (text: string): boolean =>
    isUndefined(text) || isNull(text);
