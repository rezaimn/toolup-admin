export type IExtractedSecretKey = {
    version: string;
    accountId: string;
    secret: string;
};

export const secretKeyExtractor = (s: string): IExtractedSecretKey => {
    return {
        version: s.slice(0, 2),
        accountId: s.slice(2, 8),
        secret: s.slice(8, 34),
    };
};
