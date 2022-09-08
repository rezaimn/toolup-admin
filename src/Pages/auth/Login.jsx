import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import { useHistory } from 'react-router-dom';
import { AuthRoute } from 'Components/Atomes/AuthRoute';
import HookForm from 'Components/form/index';
import CustomInput from 'Components/form/inputs/Input';

/* modules */
import { useLogin, useSetupStep } from 'Hooks/api';
import { isGateway } from 'Helpers/getDomain';

/*
 LoginComponent is a component to show login form
 */
export const LoginComponent = () => {
    const history = useHistory();
    /* this hook is an example, customize it and please make sure it works well  */
    const { mutate: loginWithReactQuery } = useLogin();
    const { mutate: getSetupStep } = useSetupStep(history);
    const onSuccess = () => {
        if (!isGateway) {
            getSetupStep();
        }
    };
    return (
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
                        },
                    },
                    {
                        name: 'password',
                        label: 'Password',
                        inputId: 'password-input',
                        component: <CustomInput />,
                        type: 'password',
                        adornment: 'password',
                        dynamicClass: 'password',
                        validation: {
                            required: 'required',
                        },
                    },
                ]}
                submitButton={{
                    submitText: 'SIGN IN',
                    submitColor: '#01395E',
                    submitTextColor: 'white',
                }}
                requestType='post'
                url='v1/auth/login'
                customSubmit={(data, setError) =>
                    loginWithReactQuery(data, {
                        onSuccess: () => onSuccess(),
                        onError: e => {
                            if (e.type === 'EmailNotVerifiedException') {
                                setError('email', {
                                    type: 'manual',
                                    message: e.message,
                                });
                            } else {
                                setError('password', {
                                    type: 'manual',
                                    message: e.message,
                                });
                                setError('email', {
                                    type: 'manual',
                                    message: e.message,
                                });
                            }
                        },
                    })
                }
                extraPart={
                    <div className='extra-wrapper font-bold'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event =>
                                        console.log(event.target.checked)
                                    }
                                    name='remember me'
                                    color='primary'
                                />
                            }
                            label='Remember me'
                        />
                        {!isGateway && (
                            <span
                                className='link'
                                onClick={() =>
                                    history.push('/auth/forget-password')
                                }
                            >
                                Forgot Your Password?
                            </span>
                        )}
                    </div>
                }
            />
        </div>
    );
};

export default LoginComponent;
