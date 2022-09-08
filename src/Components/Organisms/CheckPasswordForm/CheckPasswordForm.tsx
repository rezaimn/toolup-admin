import React, { ComponentPropsWithoutRef, FC, useState } from "react";
/* components */
import { toast } from 'Components/Atomes/ToastContainer';
/* modules */
import cn from 'clsx';
import { Input } from 'Components/Atoms/Input';
import { Button } from 'Components/Atoms/Button';
import { useCheckPassword } from 'Hooks/api';
import {
    InitialActivatePasswordManagement,
    ActivatePasswordManagement,
    ActivatePasswordManagementArgs,
} from 'Helpers/password-management/activation';
import { queryClient } from 'Services/ReactQueryService';
import API_URLS from 'Constants/apiUrls';
import { User } from 'Hooks/api';
/* helpers */
/* assets */
import { ReactComponent as SecurityIcon } from 'assets/icons/security.svg';
/* styles */
import styles from './styles.module.scss';
import { isEmpty } from "lodash";
import { Form } from "Components/Atoms/Form";
import { checkPasswordActivationReturnData } from "Hooks/api/passwordManagement";
/* types */
export type CommonCheckPasswordFormProps = {
    setIsModalVisible: (value: boolean) => void;
    getSecretKey: (data: string) => void;
    secretKey?: string;
}
export type CheckPasswordFormProps = Omit<ComponentPropsWithoutRef<'div'>,
    keyof CommonCheckPasswordFormProps
> &
    CommonCheckPasswordFormProps;

export const CheckPasswordForm: FC<CheckPasswordFormProps> = ({ className, setIsModalVisible, getSecretKey, secretKey, ...restProps }) => {
    const { mutate: checkPassword } = useCheckPassword();
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const currentUser = queryClient.getQueryData<User>(API_URLS.user);
    const activationData = queryClient.getQueryData<checkPasswordActivationReturnData>(API_URLS.passwordManagement.checkPasswordActivation);

    const l: ActivatePasswordManagementArgs = {
        password: value,
        email: currentUser?.email || '',
        userId: currentUser?.id || 0,
    };

    const onSubmit = () => {
        if (!isEmpty(value)) {
            setLoading(true);
            checkPassword({ password: value }, {
                onSuccess: res => onSuccess(res), onError: () => {
                    setLoading(false);
                    toast('error', "Password is incorrect");
                }
            })
        }
    };

    const downloadFile = (secretKey: string) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(secretKey));
        element.setAttribute('download', 'secret-key');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }

    const onSuccess = (response: { result: boolean }) => {
        if (response.result) {
            if (secretKey) {
                // change to regenerate
                ActivatePasswordManagement(l)
                    .then(secretKey => {
                        downloadFile(secretKey);
                        getSecretKey(secretKey);
                        setIsModalVisible(false);
                        setLoading(false);
                        return secretKey;
                    })
                    .catch(c => {
                        console.log(c);
                        setLoading(false);
                    });
            } else {
                if (activationData?.serviceActivationStatus) {
                    ActivatePasswordManagement(l)
                        .then(secretKey => {
                            downloadFile(secretKey);
                            getSecretKey(secretKey);
                            setIsModalVisible(false);
                            setLoading(false);
                            return secretKey;
                        })
                        .catch(c => {
                            console.log(c);
                            setLoading(false);
                        });
                } else {
                    InitialActivatePasswordManagement(l)
                        .then(secretKey => {
                            downloadFile(secretKey);
                            getSecretKey(secretKey);
                            setIsModalVisible(false);
                            setLoading(false);
                            return secretKey;
                        })
                        .catch(c => {
                            console.log(c);
                            setLoading(false);
                        });
                }
            }
        } else {
            toast('error', "Password is incorrect");
            setLoading(false);
        }
    };

    return <div className={cn(className)}>
        <Form className={styles.form}
            form={form} name="mail_service" onFinish={onSubmit}>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: "",
                    },
                ]}
                name="tool_id"
            >
                <div className={styles.inputWrapper}>

                    <SecurityIcon height={134} className={styles.icon} />
                    <div className={styles.innerInput}>

                        <label className={styles.label}>
                            Master password
                </label>
                        <Input.Password
                            onChange={(e) => setValue(e.target.value)}
                            className={styles.password}
                            disabled={loading}
                            placeholder="Enter password"
                            size="large"
                        />
                    </div>
                </div>
            </Form.Item>
            <div className={styles.buttons}>
                <Button
                    disabled={loading}
                    onClick={() => {
                        form.resetFields();
                        setIsModalVisible(false)
                    }}
                    className={styles.cancelButton}
                    color="#84CC16"
                    size="large"
                >
                    CANCEL
                </Button>
                <Button
                    loading={loading}
                    htmlType="submit"
                    className={styles.submitButton}
                    color="#84CC16"
                    size="large"
                >
                    OK
                </Button>
            </div>
        </Form>
    </div>;
};