import React from 'react';
import _ from 'lodash';
import { post } from '../../Http/api';
import HookForm from '../../Components/form/index';
import CustomInput from '../../Components/form/inputs/Input';
import { logo } from 'assets/icons';
import AuthWrapper from './assets/styles/authWrapper.style';
import { useLocation, useHistory } from 'react-router-dom';

import { useSetPassword } from 'Hooks/api';
import { routeTo } from 'Helpers/routeTo';

export const SetPassword = () => {
    const location = useLocation();
    const history = useHistory();
    const search = _.split(location.search, '=');
    const token = _.split(search[1], '&')[0];
    const { mutate: setPasswordWithReactQuery } = useSetPassword();
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
                <div className='forgot-password-title'>Set password</div>
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
                            submitText: 'SET',
                            submitColor: '#01395E',
                            submitTextColor: 'white',
                        }}
                        customSubmit={(data, setError) =>
                            setPasswordWithReactQuery(data, {
                                onError: e =>
                                    _.forEach(Object.keys(e.error), item => {
                                        setError(item, {
                                            type: 'manual',
                                            message: e.error[item],
                                        });
                                    }),
                            })
                        }
                        changeData={data => {
                            const customData = data;
                            customData.token = token;
                            return customData;
                        }}
                    />
                </div>
            </div>
        </AuthWrapper>
    );
};

export default SetPassword;
