import { isEqual } from 'lodash/fp';

export const isEmptyString = (v: string): boolean => isEqual('')(v);
