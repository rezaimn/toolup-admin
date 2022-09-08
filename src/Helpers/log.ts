import { curry } from 'lodash';

const LOG_ENABLED = process.env.NODE_ENV !== 'production';

// eslint-disable-next-line no-console
export const log = curry(a => (LOG_ENABLED ? console.log(a) : undefined));
