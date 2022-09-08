import React from 'react';
import HookForm from '../../Components/form/index';
import CustomInput from '../../Components/form/inputs/Input';
import { logo } from 'assets/icons';
import AuthWrapper from './assets/styles/authWrapper.style';

import { useForgotPassword } from 'Hooks/api';
import { useHistory } from 'react-router';
import { routeTo } from 'Helpers/routeTo';
import _ from 'lodash';
import { toast } from 'Components/Atomes/ToastContainer';
export const ForgotPassword = () => {
    const history = useHistory();
    const { mutate: forgotPasswordWithReactQuery } = useForgotPassword();
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
                <div className='forgot-password-title'>
                    Forgot your password?
                </div>
                <div className='forgot-password-detail'>
                    Enter your email below to reset your password
                </div>
                <div className='form'>
                    <HookForm
                        inputs={[
                            {
                                name: 'email',
                                label: 'Email',
                                inputId: 'email-input',
                                component: <CustomInput />,
                                validation: {
                                    required: 'required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Not mail pattern',
                                    },
                                },
                            },
                        ]}
                        submitButton={{
                            submitText: 'SEND',
                            cancelText: 'Return to sign in',
                            double: 'true',
                            submitColor: '#01395E',
                            submitTextColor: 'white',
                            cancelTextColor: 'white',
                            cancelbtnClass: 'link',
                            cancelFunction: () => history.push(routeTo('auth')),
                        }}
                        customSubmit={(data, setError) =>
                            forgotPasswordWithReactQuery(data, {
                                onSuccess: (r) =>{
                                    history.push(routeTo('auth'));
                                    toast('info', r?.message)
                                },


                                onError: e => {
                                    setError('email', {
                                        type: 'manual',
                                        message: e.message,
                                    });
                                },
                            })
                        }
                        requestType='post'
                        url='v1/auth/forgot-password'
                    />
                </div>
            </div>
        </AuthWrapper>
    );
};

export default ForgotPassword;
