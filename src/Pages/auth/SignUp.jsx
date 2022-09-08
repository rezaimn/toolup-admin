import React, { useEffect } from 'react';
import _, { merge } from 'lodash';
import HookForm from '../../Components/form/index';
import CustomInput from '../../Components/form/inputs/Input';
import CheckboxGroup from '../../Components/form/inputs/checkboxGroup';
import Checkbox from '../../Components/form/inputs/checkbox';
import { useHistory } from 'react-router';

import { useSignUp, useValidateRedeemCode } from 'Hooks/api';
import { routeTo } from 'Helpers/routeTo';
import { ROUTES } from 'Constants/routes';
import { useQueryString } from 'Hooks/useQueryString';
import { message } from 'Components/Atoms/Message';
import { notification } from 'antd';
import { toast } from 'Components/Atomes/ToastContainer';
import { useLocation } from 'react-use';

export const SignUpComponent = () => {
    const history = useHistory();
    const [queryString = { redeemCode: '' }, setQueryString] = useQueryString();

    const redeemCode = queryString?.redeemCode;

    const {
        mutate: validateRedeemCode,
        isLoading: validateRedeemCodeIsLoading,
        data: validateRedeemCodeData,
        error: validateRedeemCodeError,
    } = useValidateRedeemCode();

    useEffect(() => {
        if (redeemCode) {
            validateRedeemCode(
                { code: redeemCode },
                {
                    onError: () => {
                        history.push(routeTo('redeemCode'));
                        toast(
                            'error',
                            'Something went wrong in applying redeem code! please try again'
                        );
                    },
                }
            );
        }
    }, []);

    const onSuccess = () => history.push(routeTo('successAuth'));
    const { mutate: signUpWithReactQuery } = useSignUp();

    return (
        <div
            className='form'
            style={{ marginTop: '30px', marginBottom: '30px' }}
        >
            <HookForm
                inputs={[
                    {
                        name: 'first_name',
                        label: 'First Name',
                        inputId: 'first-name-input',
                        component: <CustomInput />,
                        dynamicClass: 'first-half',
                        validation: {
                            required: 'required',
                        },
                    },
                    {
                        name: 'last_name',
                        label: 'Last Name',
                        inputId: 'last-name-input',
                        component: <CustomInput />,
                        dynamicClass: 'second-half',
                        validation: {
                            required: 'required',
                        },
                    },
                    {
                        name: 'name',
                        label: "Company's name",
                        inputId: 'name-input',
                        component: <CustomInput />,
                        dynamicClass: 'first-half',
                        validation: {
                            required: 'required',
                        },
                    },
                    {
                        name: 'position',
                        label: 'Your position',
                        inputId: 'position-input',
                        component: <CustomInput />,
                        dynamicClass: 'second-half',
                        validation: {
                            required: 'required',
                        },
                    },
                    {
                        name: 'team_size',
                        label: 'Company Size',
                        inputId: 'team-size-input',
                        component: <CheckboxGroup />,
                        items: [
                            { value: '1 - 10', label: '1 - 10' },
                            { value: '11 - 50', label: '11 - 50' },
                            { value: '51 - 100', label: '51 - 100' },
                            { value: '101 - 500', label: '101 - 500' },
                            { value: '500+', label: '500+' },
                        ],
                        max: 1,
                        dynamicClass: 'ts',
                        validation: {
                            required: 'required',
                        },
                    },
                    {
                        name: 'subdomain',
                        label: 'Domain',
                        inputId: 'subdomain-input',
                        component: <CustomInput />,
                        adornment: '.toolup.io',
                        validation: {
                            required: 'required',
                        },
                    },
                    {
                        name: 'email',
                        label: 'Email',
                        inputId: 'email-input',
                        component: <CustomInput />,
                        validation: {
                            required: 'required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'not email pattern',
                            },
                        },
                    },
                    {
                        name: 'password',
                        label: 'Password',
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
                                    'You must use at least one upper case, lower case, digits, special characters.',
                            },
                        },
                    },
                    {
                        name: 'password_confirmation',
                        label: 'Confirm Password',
                        inputId: 'password-confirmation-input',
                        component: (
                            <CustomInput
                                equalValidation={{
                                    field: 'password',
                                    message: 'The password does not match',
                                }}
                            />
                        ),
                        type: 'password',
                        adornment: 'password',
                        dynamicClass: 'password',
                        validation: {
                            required: 'required',
                            pattern: {
                                value: /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                message:
                                    'You must use at least one upper case, lower case, digits, special characters.',
                            },
                        },
                    },
                    {
                        name: 'agreement',
                        dynamicClass: 'agreement',
                        inputId: 'agreement-input',
                        label: 'Terms & Conditions',
                        link: ROUTES.privacyPolicy,
                        component: <Checkbox />,
                        validation: {
                            required: 'required',
                        },
                    },
                ]}
                submitButton={{
                    submitText: 'SIGN UP',
                    submitColor: '#01395E',
                    submitTextColor: 'white',
                }}
                requestType='post'
                url='v1/auth/register'
                customSubmit={(data, setError) =>
                    signUpWithReactQuery(
                        merge(data, {
                            promotion_code: redeemCode || '',
                        }),
                        {
                            onSuccess,
                            onError: e =>
                                _.forEach(Object.keys(e.detail), item => {
                                    setError(item, {
                                        type: 'manual',
                                        message: e.detail[item],
                                    });
                                }),
                        }
                    )
                }
                changeData={data => {
                    const customData = data;
                    customData.team_size = data.team_size[0];
                    return customData;
                }}
            />
        </div>
    );
};

export default SignUpComponent;
