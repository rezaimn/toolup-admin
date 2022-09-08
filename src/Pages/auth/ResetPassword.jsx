import React from 'react';
import _ from 'lodash';
import { post } from '../../Http/api';
import HookForm from '../../Components/form/index';
import CustomInput from '../../Components/form/inputs/Input';
import { logo } from 'assets/icons';
import AuthWrapper from './assets/styles/authWrapper.style';
import { useLocation, useHistory } from 'react-router-dom';

import { useResetPassword } from 'Hooks/api';
import { routeTo } from 'Helpers/routeTo';

export const ResetPassword = () => {
    const location = useLocation();
    const history = useHistory();
    const onSuccess = () => history.push(routeTo('auth'));
    const pathname = _.split(location.pathname, '/');
    const search = _.split(location.search, '=');
    const token = _.last(pathname);
    const email = _.replace(_.split(search[1], '&')[0], '%40', '@');
    const { mutate: resetPasswordWithReactQuery } = useResetPassword();
    return (
        <AuthWrapper>
            <div
                className='logo-wrapper'
                style={{ fontSize: '30px', fontWeight: '800' }}
            >
                <img
                    src={logo}
                    height='43'
                    width='84'
                    style={{ marginRight: '10px' }}
                />
                Toolup
            </div>
            <div className='tab-wrapper forgot-password'>
                <div className='forgot-password-title'>Reset password</div>
                <div className='form'>
                    <HookForm
                        inputs={[
                            {
                                name: 'password',
                                label: 'New password',
                                inputId: 'password-input',
                                component: <CustomInput equalValidation />,
                                type: 'password',
                                adornment: 'password',
                                dynamicClass: 'password',
                                validation: {
                                    required: 'required',
                                    pattern: {
                                        value: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                        message:
                                            'Uppercase characters Lowercase characters Digits Special characters',
                                    },
                                },
                            },
                            {
                                name: 'password_confirmation',
                                label: 'Password confirmation',
                                inputId: 'password-confirmation-input',
                                component: (
                                    <CustomInput
                                        equalValidation={{
                                            field: 'password',
                                            message:
                                                'The password does not match',
                                        }}
                                    />
                                ),
                                type: 'password',
                                adornment: 'password',
                                dynamicClass: 'password',
                                validation: {
                                    required: 'required',
                                },
                            },
                        ]}
                        submitButton={{
                            submitText: 'RESET',
                            cancelText: 'BACK',
                            double: 'true',
                            submitColor: '#01395E',
                            submitTextColor: 'white',
                            cancelTextColor: 'white',
                            cancelFunction: () =>
                                history.push('/auth/forget-password'),
                        }}
                        onSuccess={() => history.push('/auth')}
                        customSubmit={(data, setError) =>
                            resetPasswordWithReactQuery(data, {
                                onSuccess,
                                onError: e =>
                                    setError('password', {
                                        type: 'manual',
                                        message: e.message,
                                    }),
                            })
                        }
                        changeData={data => {
                            const customData = data;
                            customData.email = email;
                            customData.token = token;
                            return customData;
                        }}
                    />
                </div>
            </div>
        </AuthWrapper>
    );
};

export default ResetPassword;
