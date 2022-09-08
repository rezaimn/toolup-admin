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
    createRecoveryGroup,
    grantVaultAccessToRecoveryGroup,
} from 'Hooks/api/passwordManagement';
import { getMemberTeams, getOrganizationTeams } from 'Hooks/api';
/* helpers */
import { collectDeviceInfo } from 'Helpers/collectDeviceInfo';
import * as localStorage from 'Helpers/localStorage';
import { omit } from 'lodash/fp';
import { PASSWORD_MANAGEMENT } from 'Constants/configs';
import { secretKeyExtractor } from '../secretKeyExtractor/secretKeyExtractor';
import { log } from 'Helpers/log';
import { DEFAULT_ITERATIONS } from './configs';
import { ActivatePasswordManagementArgs } from './activation';

export const InitialActivatePasswordManagement = async ({
    password,
    email,
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

        //  Generate Keyset for Recovery Group

        const recoveryGroupKeysetKID = generateUUID({ seprator: '-' });

        const {
            privateKey: recoveryGroupPrivateKey,
            publicKey: recoveryGroupPublicKey,
        } = await generateKey(2048);

        const stringifiedRecoveryGroupPrivateKey = JSON.stringify(
            recoveryGroupPrivateKey
        );

        // Encrypt Recovery Group Private Key with admin's symmetric key
        const recoveryGroupEncryptedPrivateKey = await encryptPrivateKey({
            symmetricKey: symmetricKeyInUintArrayFormat,
            stringifiedPrivateKey: stringifiedRecoveryGroupPrivateKey,
            kid: keySetsUUID,
        });

        const recoveryGroupKeyset = {
            enc_priv_key: recoveryGroupEncryptedPrivateKey,
            pub_key: { ...recoveryGroupPublicKey, kid: keySetsUUID },
        };

        // BE: Store Recovery Group Keyset (will also create the group) REVIEW -> done
        // BE: Add admin to recovery group (send encrypted keyset) REVIEW -> done
        const createdRecoveryGroupKeyset = await createRecoveryGroup({
            keyset: recoveryGroupKeyset,
        });

        log({ createdRecoveryGroupKeyset });
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
            vaultId: createdVault.id,
            enc_vault_key: encryptedVaultKey,
        });

        log({ grantedVaultAccess });

        // 19- BE: Grant Vault access to Recovery Group
        // Load RecoveryGroupKeyset from BE => and then => BE: Grant Vault access to Recovery Group
        // We use this => https://documenter.getpostman.com/view/13642275/TW6uo9FQ#dce22c16-d887-4759-8874-762bb5e8eaf8

        const grantedVaultAccessToRecoveryGroup = await grantVaultAccessToRecoveryGroup(
            {
                vaultId: createdVault.id,
                enc_vault_key: encryptedVaultKey,
            }
        );

        log({ grantedVaultAccessToRecoveryGroup });

        // Get Teams List
        const teamsList = await getOrganizationTeams();

        // Get Member teams list
        const memberTeamsList = await getMemberTeams();

        log({ memberTeamsList });
        // For each Team repeat the following steps

        // We Use member key pairs here

        for await (let { id: teamId } of teamsList) {
            // 17- Create Team Vault
            const teamVault: CreateVaultPayload = {
                enc_attrs: {},
                creator_id: teamId,
                type: 'TEAM',
            };

            // 18- Create Team Vault Key
            const teamVaultKey = await generateVaultKey({
                outputType: 'jwk',
            });

            const stringifiedTeamVaultKey = JSON.stringify(teamVaultKey);

            // 19- Encrypt Personal Vault Key with Member Public key ?
            const encryptedTeamVaultKey = await encryptVaultKey({
                publicKey: importedPublicKey,
                stringifiedVaultKey: stringifiedTeamVaultKey,
                kid: keySetsUUID, // REVIEW what is this Keyset ?
            });

            // 20- BE: Create Vault
            const createdTeamVault = await createVault(teamVault);
            log({ createdTeamVault });

            // 21- BE: Grant Vault Access to Member

            /**
             * 1- get admin teams list
             * 2- check if current user is in the team
             * 2-TRUE => grantVault access
             * 2-FALSE => continue.
             */
            if (memberTeamsList?.some(i => i.id === teamId)) {
                await grantVaultAccess({
                    enc_vault_key: encryptedTeamVaultKey,
                    vaultId: createdTeamVault.id,
                });
            }

            // 22- BE: Grant Vault access to Recovery Group

            const grantedTeamVaultAccessToRecoveryGroup = await grantVaultAccessToRecoveryGroup(
                {
                    vaultId: createdTeamVault.id,
                    enc_vault_key: encryptedTeamVaultKey,
                }
            );

            log({ grantedTeamVaultAccessToRecoveryGroup });
        }

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
