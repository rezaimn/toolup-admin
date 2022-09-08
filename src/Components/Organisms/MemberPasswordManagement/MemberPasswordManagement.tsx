import React, {
    ComponentPropsWithoutRef,
    FC,
    useState,
    useRef,
    useEffect,
} from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Input } from 'Components/Atoms/Input';
import { Modal } from 'Components/Atoms/Modal';
import { MemberCheckPasswordForm } from 'Components/Organisms/MemberCheckPasswordForm';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
import { Button } from 'Components/Atoms/Button';
import { CopyOne, DownloadOne } from '@icon-park/react';
import { cond, isEmpty } from 'lodash';
import { getDeobfuscateSecretKey } from 'Helpers/password-management/deobfuscateSecreyKey';
import { queryClient } from 'Services/ReactQueryService';
import { checkPasswordActivationReturnData } from 'Hooks/api/passwordManagement';
import API_URLS from 'Constants/apiUrls';
import { TrustedDevicesList } from '../TrustedDevicesList';
/* types */
export type CommonMemberPasswordManagementProps = {};
export type MemberPasswordManagementProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonMemberPasswordManagementProps
> &
    CommonMemberPasswordManagementProps;

export const MemberPasswordManagement: FC<MemberPasswordManagementProps> = ({
    className,
    ...restProps
}) => {
    const activationData = queryClient.getQueryData<checkPasswordActivationReturnData>(
        API_URLS.passwordManagement.checkPasswordActivation
    );
    const [secretKey, setSecretKey] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [showRegenerateModal, setShowRegenerateModal] = useState(false);
    const getSecretKeyFromLocalStorage = async () => {
        const secretKey = await getDeobfuscateSecretKey();
        setSecretKey(secretKey);
    };
    getSecretKeyFromLocalStorage();
    const getSecretKey = (data: string) => {
        setSecretKey(data);
    };
    const ref = useRef<HTMLInputElement>(null);

    const copyToClipboard = () => {
        ref.current?.select();
        document.execCommand('copy');
    };
    useEffect(() => {
        if (!isEmpty(secretKey)) {
            makeTextFile();
        }
    }, [secretKey]);
    const makeTextFile = () => {
        const data = new Blob([secretKey], { type: 'text/plain' });
        if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink);
        setDownloadLink(window.URL.createObjectURL(data));
    };

    const condition = !activationData?.memberServiceActivationStatus
        ? 1
        : isEmpty(secretKey)
        ? 2
        : 3;

    const activation = (currentCondition: number) => currentCondition === 1;
    const trustedDevice = (currentCondition: number) => currentCondition === 2;
    const regenerate = (currentCondition: number) => currentCondition === 3;

    const getContent = (condition: number): JSX.Element => {
        return cond<number, JSX.Element>([
            [
                activation,
                () => (
                    <>
                        <label className={styles.label}>Secret Key</label>
                        <Input.Password
                            className={styles.secretKey}
                            ref={ref}
                            value={secretKey
                                .replace(/[^\dA-Z]/g, '')
                                .replace(/(.{4})/g, '$1 - ')
                                .trim()}
                            placeholder='---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----'
                            size='large'
                            addonAfter={
                                <div className={styles.addonWrapper}>
                                    <div className={styles.copy}>
                                        <CopyOne
                                            onClick={copyToClipboard}
                                            theme='outline'
                                            size='20'
                                            fill={
                                                isEmpty(secretKey)
                                                    ? '#D5D5D5'
                                                    : '#01395E'
                                            }
                                        />
                                    </div>
                                    <Button
                                        className={
                                            isEmpty(secretKey)
                                                ? styles.downloadButton
                                                : styles.downloadButtonActive
                                        }
                                        color='#D5D5D5'
                                        href={downloadLink}
                                        disabled={isEmpty(secretKey)}
                                        download='secret-key.txt'
                                    >
                                        <DownloadOne
                                            className={styles.downloadIcon}
                                            theme='outline'
                                            size='20'
                                            fill='white'
                                        />
                                        <div className={styles.downloadText}>
                                            DOWNLOAD
                                        </div>
                                    </Button>
                                </div>
                            }
                        />
                        <div
                            className={
                                isEmpty(secretKey)
                                    ? styles.keyWrapper
                                    : styles.regenerateKeyWrapper
                            }
                        >
                            {isEmpty(secretKey) ? (
                                <Button
                                    onClick={() => setShowActiveModal(true)}
                                    className={styles.activeKey}
                                    color='#84CC16'
                                    size='large'
                                >
                                    ACTIVATE THE PASSWORD MANAGEMENT SERVICE
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setShowRegenerateModal(true)}
                                    className={styles.regenerateKey}
                                    color='#84CC16'
                                    size='large'
                                >
                                    REGENERATE SECRET KEY
                                </Button>
                            )}
                        </div>
                    </>
                ),
            ],
            [trustedDevice, () => <div>show trusted device</div>],
            [
                regenerate,
                () => (
                    <>
                        <label className={styles.label}>Secret Key</label>
                        <Input.Password
                            className={styles.secretKey}
                            ref={ref}
                            value={secretKey
                                .replace(/[^\dA-Z]/g, '')
                                .replace(/(.{4})/g, '$1 - ')
                                .trim()}
                            placeholder='---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----'
                            size='large'
                            addonAfter={
                                <div className={styles.addonWrapper}>
                                    <div className={styles.copy}>
                                        <CopyOne
                                            onClick={copyToClipboard}
                                            theme='outline'
                                            size='20'
                                            fill='#01395E'
                                        />
                                    </div>
                                    <Button
                                        className={styles.downloadButtonActive}
                                        color='#D5D5D5'
                                        href={downloadLink}
                                        download='secret-key.txt'
                                    >
                                        <DownloadOne
                                            className={styles.downloadIcon}
                                            theme='outline'
                                            size='20'
                                            fill='white'
                                        />
                                        <div className={styles.downloadText}>
                                            DOWNLOAD
                                        </div>
                                    </Button>
                                </div>
                            }
                        />
                        <div className={styles.regenerateKeyWrapper}>
                            <Button
                                onClick={() => setShowRegenerateModal(true)}
                                className={styles.regenerateKey}
                                color='#84CC16'
                                size='large'
                            >
                                REGENERATE SECRET KEYS
                            </Button>
                        </div>
                    </>
                ),
            ],
        ])(condition);
    };

    return (
        <div>
            <div className={styles.wrapper}>
                {getContent(condition)}
                <Modal
                    width='40%'
                    visible={showActiveModal}
                    footer={null}
                    centered
                    closeIcon={<></>}
                >
                    <MemberCheckPasswordForm
                        setIsModalVisible={setShowActiveModal}
                        getSecretKey={getSecretKey}
                    />
                </Modal>
                <Modal
                    width='40%'
                    visible={showRegenerateModal}
                    footer={null}
                    centered
                    closeIcon={<></>}
                >
                    <MemberCheckPasswordForm
                        setIsModalVisible={setShowRegenerateModal}
                        getSecretKey={getSecretKey}
                        secretKey={secretKey}
                    />
                </Modal>
            </div>
            <TrustedDevicesList className={styles.trustedDevices} />
        </div>
    );
};
