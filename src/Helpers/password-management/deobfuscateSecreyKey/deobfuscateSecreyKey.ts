import {
    base64StringToUint8Array,
    deobfuscateSecreyKey,
} from '@agileful/toolup-crypto';

export const getDeobfuscateSecretKey = async () => {
    const secretKey = localStorage.getItem('secretKey');
    const deobfuscatedSecretKey = await deobfuscateSecreyKey({
        obfuscatedSecretKey: base64StringToUint8Array(
            JSON.parse(secretKey || '').data
        ),
    });
    return deobfuscatedSecretKey;
};
