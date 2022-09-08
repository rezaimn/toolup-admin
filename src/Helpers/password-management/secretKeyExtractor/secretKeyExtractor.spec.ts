import {
    arrayToBase64String,
    generateSecretKey,
    randomBytes,
} from '@agileful/toolup-crypto';
import { secretKeyExtractor } from './secretKeyExtractor';

describe('Secret Key Extractor functions', () => {
    it('Should have appropriate length', () => {
        const { accountId, secret, version } = secretKeyExtractor(
            'A3airbzQQDKZ9WJXRTCQF8KKXYT2AVRHFS'
        );

        expect(version).toHaveProperty('length', 2);
        expect(accountId).toHaveProperty('length', 6);
        expect(secret).toHaveProperty('length', 26);
    });
});

export {};
