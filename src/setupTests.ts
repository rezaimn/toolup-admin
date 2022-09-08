// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { Crypto } from '@peculiar/webcrypto';
import encoding from 'text-encoding';

Object.defineProperty(global, 'crypto', {
    value: new Crypto(),
});
Object.defineProperty(global, 'TextDecoder', {
    value: encoding.TextDecoder,
});
Object.defineProperty(global, 'TextEncoder', {
    value: encoding.TextEncoder,
});

jest.setTimeout(60000);
