import { ComponentPropsWithoutRef, FC, useEffect } from 'react';
/* components */
import { Form } from 'Components/Atoms/Form';
import { Input } from 'Components/Atoms/Input';
import { Button } from 'Components/Atoms/Button';
/* modules */
import cn from 'clsx';
import { UseMutateFunction } from 'react-query';
import {
    ValidateReedemCodeTContext,
    ValidateReedemCodeTData,
    ValidateReedemCodeTError,
    ValidateReedemCodeTVariables,
} from 'Hooks/api';
import { lowerCase, negate, pipe, startsWith } from 'lodash/fp';
import { Link } from 'react-router-dom';
import { routeTo } from 'Helpers/routeTo';
/* helpers */
/* assets */
import SAAS from 'assets/icons/saastrounatics.png';
import TOOLUP from 'assets/icons/logo.png';
/* styles */
import s from './styles.module.scss';

/* types */
type CommonProps = {
    onSubmit: (v: ValidateReedemCodeTVariables) => void;
    loading: boolean;
    validate: UseMutateFunction<
        ValidateReedemCodeTData,
        ValidateReedemCodeTError,
        ValidateReedemCodeTVariables,
        ValidateReedemCodeTContext
    >;
    data?: ValidateReedemCodeTData;
    error: ValidateReedemCodeTError | null;
    visible: boolean;
};

type Props = Omit<ComponentPropsWithoutRef<'div'>, keyof CommonProps> &
    CommonProps;

export const RedeemCodeForm: FC<Props> = ({
    className,
    onSubmit,
    loading = false,
    validate,
    data,
    error,
    visible,
    ...restProps
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (error?.response?.data?.errors?.message) {
            form.setFields([
                {
                    name: 'code',
                    errors: ['Code is not valid!'],
                },
            ]);
        }
    }, [error]);

    if (visible) {
        return (
            <div className={s.wrap}>
                <div className={s.logoWrap}>
                    <div className={s.logo}>
                        <img src={TOOLUP} alt='' />
                        <p className={s.companyName}>TOOLUP</p>
                    </div>

                    <div className={s.seprator} />
                    <div className={s.customLogo}>
                        <img src={SAAS} alt='' />
                    </div>
                </div>

                <div className={s.header}>
                    <p className={s.title}>Welcome to TOOLUP!</p>
                    <div className={s.message}>
                        Please enter the redeem code
                    </div>
                </div>

                <Form
                    className={s.form}
                    layout='vertical'
                    onFinish={onSubmit}
                    form={form}
                >
                    <Form.Item
                        name='code'
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the redeem code!',
                                validateTrigger: 'onSubmit',
                            },
                            {
                                validateTrigger: 'onSubmit',
                                validator: (rule, value, callback) => {
                                    return validateCodeFormat(value);
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder='Enter code...'
                            className={s.input}
                            size='large'
                            allowClear
                        />
                    </Form.Item>

                    <Button
                        disabled={loading}
                        loading={loading}
                        type='primary'
                        htmlType='submit'
                        block
                        className={s.btn}
                    >
                        APPLY CODE
                    </Button>
                </Form>
            </div>
        );
    }
    return <div />;
};

function validateCodeFormat(value: string) {
    return new Promise((resolve, reject) => {
        if (value) {
            if (pipe(lowerCase, negate(startsWith('tu')))(value)) {
                reject(new Error('Code is not valid!'));
                return;
            }
        }

        resolve(value);
    });
}
