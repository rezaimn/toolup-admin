/* eslint-disable */
/* modules */
import {
    deriveMuk,
    encryptPrivateKey,
    generateKey,
    generateSalt,
    generateSecretKey,
    generateSymmetricKey,
    obfuscateSecretKey,
    encryptSymmetricKey,
    generateVaultKey,
    encryptVaultKey,
    base64StringToUint8Array,
    generateUUID,
    randomBytes,
    arrayToBase64String,
} from '@agileful/toolup-crypto';
import {
    CreateVaultPayload,
    saveKeyset,
    addDevice,
    createVault,
    grantVaultAccess,
    getRecoveryGroupKeyset,
    grantVaultAccessToRecoveryGroup,
} from 'Hooks/api/passwordManagement';
/* helpers */
import { collectDeviceInfo } from 'Helpers/collectDeviceInfo';
import * as localStorage from 'Helpers/localStorage';
import { omit } from 'lodash/fp';
import { PASSWORD_MANAGEMENT } from 'Constants/configs';
import { secretKeyExtractor } from '../secretKeyExtractor/secretKeyExtractor';
import { log } from 'Helpers/log';
import { DEFAULT_ITERATIONS } from './configs';

export type ActivatePasswordManagementArgs = {
    password: string;
    email: string;
    userId: number;
};

export const ActivatePasswordManagement = async ({
    password,
    email,
    userId,
}: ActivatePasswordManagementArgs): Promise<string> => {
    // 1- Get Master Password ~> we got it from arguments
    // request to  server -> start
    try {
        // 2- generate Salt and UUIDs
        const salt = generateSalt();
        var keySetsUUID = generateUUID({ seprator: '-' });
        var vaultKeyUUID = generateUUID({ seprator: '-' });

        // 3- Generate Secret Key
        const monolithSecretKey = generateSecretKey(
            arrayToBase64String(randomBytes(16))
        );
        log(monolithSecretKey);

        const secretKey = secretKeyExtractor(monolithSecretKey);
        log({ secretKey });
        console.log(secretKey.accountId, 'qqqqqq');
        // 4- Create MUK
        const muk = await deriveMuk({
            accountId: secretKey.accountId,
            email,
            iterations: DEFAULT_ITERATIONS,
            password,
            salt,
            version: secretKey.version,
            secret: secretKey.secret,
        });

        // 5- Create Symmetric Key
        const symmetricKey = (await generateSymmetricKey({
            outputType: 'jwk',
        })) as JsonWebKey;

        // 6- Generate Public/Private Keys
        const { privateKey, publicKey: pub_key } = await generateKey(2048);

        const importedPublicKey = await crypto.subtle.importKey(
            'jwk',
            pub_key,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['encrypt']
        );

        const stringifiedPrivateKey = JSON.stringify({
            ...privateKey,
            kid: keySetsUUID,
        });

        // 7- Encrypt Symmetric Key
        const stringifiedSymmetricKey = JSON.stringify({
            ...symmetricKey,
            kid: keySetsUUID,
        });

        const encryptSymmetricKeyExtra = {
            alg: 'PBES2g-HS256',
            kid: 'mp',
            p2c: DEFAULT_ITERATIONS,
            p2s: salt,
        };

        const enc_sym_key = await encryptSymmetricKey<
            typeof encryptSymmetricKeyExtra
        >({
            muk,
            stringifiedSymmetricKey,
            extra: encryptSymmetricKeyExtra,
            kid: keySetsUUID,
        });

        // 8- Encrypt Private Key
        const symmetricKeyInUintArrayFormat = base64StringToUint8Array(
            symmetricKey?.k as string
        );

        const enc_priv_key = await encryptPrivateKey({
            symmetricKey: symmetricKeyInUintArrayFormat,
            stringifiedPrivateKey,
            kid: keySetsUUID,
        });

        // 9- Create Keyset
        const keyset = {
            enc_sym_key,
            enc_priv_key,
            pub_key: { ...pub_key, kid: keySetsUUID },
        };

        log({ keyset });
        // 10- BE: Save Keyset
        const savedKeySet = await saveKeyset(keyset);
        log({ savedKeySet });

        // 11- Get Device Info
        const deviceInfo = collectDeviceInfo();

        // 12- Generate/local storage Device UUID
        const deviceUUID = generateUUID({ seprator: '-' });

        localStorage.setItem(
            PASSWORD_MANAGEMENT.LOCAL_STORAGE.DEVICE_UUID,
            deviceUUID
        );

        // 13- BE: Store Device
        const addedDevice = await addDevice({
            ...omit('client')(deviceInfo),
            uuid: deviceUUID,
            client: 'WebApp',
        });

        log({ addedDevice });

        // 14- Create Vault REVIEW

        // 15- Create Vault Key
        const vaultKey = (await generateVaultKey({
            outputType: 'jwk',
        })) as JsonWebKey;

        const stringifiedVaultKey = JSON.stringify({
            ...vaultKey,
            kid: vaultKeyUUID,
        });

        // 16- Encrypt Vault Key with Member Private Key
        const encryptedVaultKey = await encryptVaultKey({
            publicKey: importedPublicKey,
            stringifiedVaultKey,
            kid: keySetsUUID,
        });

        log({ encryptedVaultKey });

        // 17- BE: Create Vault
        const vault: CreateVaultPayload = {
            enc_attrs: {},
        };

        const createdVault = await createVault(vault);
        log({ createdVault });

        // 18- BE: Grant Vault Access to Member
        const grantedVaultAccess = await grantVaultAccess({
            enc_vault_key: encryptedVaultKey,
            vaultId: createdVault?.id,
        });

        log({ grantedVaultAccess });

        // 19- BE: Grant Vault access to Recovery Group

        const recoveryGroupKeyset = await getRecoveryGroupKeyset({
            userId: userId,
        });

        log({ recoveryGroupKeyset });

        const recoveryGroupKeysetPublicKey = recoveryGroupKeyset.pub_key;

        const importedRecoveryGroupKeysetPublicKey = await crypto.subtle.importKey(
            'jwk',
            recoveryGroupKeysetPublicKey,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['encrypt']
        );
        /**
         * 1- load recovery group keyset from server -> Done
         * 2- get public key from loaded data -> Done
         * 3- const encryptedVaultKeyWithRecoveryGroupPublicKey = encrypt vault key with recovery group public key
         * 4- run the function of grantedVaultAccessToRecoveryGroup with payload of -> { enc_vault_key: encryptedVaultKeyWithRecoveryGroupPublicKey }
         */
        const encryptedVaultKeyWithRecoveryGroupPublicKey = await encryptVaultKey(
            {
                stringifiedVaultKey,
                publicKey: importedRecoveryGroupKeysetPublicKey,
                kid: recoveryGroupKeysetPublicKey.kid,
            }
        );
        log({ encryptedVaultKeyWithRecoveryGroupPublicKey });

        const grantedVaultAccessToRecoveryGroup = await grantVaultAccessToRecoveryGroup(
            {
                enc_vault_key: encryptedVaultKeyWithRecoveryGroupPublicKey,
                vaultId: createdVault.id,
            }
        );

        log({ grantedVaultAccessToRecoveryGroup });

        // 20- Store Obfuscated Secret Key in Local Storage
        const obfuscatedSecretKey = await obfuscateSecretKey({
            secretKey: monolithSecretKey,
        });

        localStorage.setItem(
            PASSWORD_MANAGEMENT.LOCAL_STORAGE.SECRET_KEY,
            JSON.stringify(obfuscatedSecretKey)
        );

        return monolithSecretKey;
        // request to server -> done
    } catch (e) {
        throw e;
    }
};
