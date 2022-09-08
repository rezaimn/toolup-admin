import React, { useEffect } from 'react';
import _ from 'lodash';
import HookForm from '../../Components/form/index';
import CustomInput from '../../Components/form/inputs/Input';
import CheckboxGroup from '../../Components/form/inputs/checkboxGroup';
import Checkbox from '../../Components/form/inputs/checkbox';
import AuthWrapper from './assets/styles/authWrapper.style';
import { useLocation } from 'react-router';
import { logo } from 'assets/icons';

import { useEarlyAdaption, useEarlyAdaptionRegister } from 'Hooks/api';
import { routeTo } from 'Helpers/routeTo';
import { ROUTES } from 'Constants/routes';

export const CompleteRegistrationComponent = () => {
    const location = useLocation();
    const search = _.split(location.search, '=');
    const token = search[1];
    const { mutate: earlyAdaptionRegisterQuery } = useEarlyAdaptionRegister();

    const {
        data: userData = {
            first_name: '',
            last_name: '',
            name: '',
            position: '',
            team_size: '',
            subdomain: '',
        },
    } = useEarlyAdaption({
        token: token,
    });
    return (
        <AuthWrapper style={{ overflowY: 'auto' }}>
            <div
                className='logo-wrapper'
                style={{ fontSize: '30px', fontWeight: '800' }}
            >
                <img
                    src={logo}
                    height='43'
                    width='84'
                    style={{ margin: '80px 10px' }}
                />
                Toolup
            </div>
            <div className='tab-wrapper complete-register'>
                <div className='title'>Complete registration</div>
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
                                initailValue: userData.first_name,
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
                                initailValue: userData.last_name,
                            },
                            {
                                name: 'name',
                                label: 'Company Name',
                                inputId: 'name-input',
                                component: <CustomInput />,
                                dynamicClass: 'first-half',
                                validation: {
                                    required: 'required',
                                },
                                initailValue: userData.name,
                            },
                            {
                                name: 'position',
                                label: 'Company Position',
                                inputId: 'position-input',
                                component: <CustomInput />,
                                dynamicClass: 'second-half',
                                validation: {
                                    required: 'required',
                                },
                                initailValue: userData.position,
                            },
                            {
                                name: 'team_size',
                                label: 'Company Size',
                                inputId: 'team-size-input',
                                component: <CheckboxGroup />,
                                items: [
                                    { value: '1 - 10', label: '1 - 10' },
                                    { value: '11 - 50', label: '11 - 50' },
                                    { value: '50 - 100', label: '51 - 100' },
                                    { value: '101 - 500', label: '101 - 500' },
                                    { value: '500+', label: '500+' },
                                ],
                                max: 1,
                                dynamicClass: 'ts',
                                validation: {
                                    required: 'required',
                                },
                                initailValue: userData.team_size,
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
                                initailValue: userData.subdomain,
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
                                label: 'Terms & Conditions',
                                inputId: 'agreement-input',
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
                            earlyAdaptionRegisterQuery(data, {
                                onError: e =>
                                    _.forEach(Object.keys(e.detail), item => {
                                        setError(item, {
                                            type: 'manual',
                                            message: e.detail[item],
                                        });
                                    }),
                            })
                        }
                        defaultValues={userData}
                        changeData={data => {
                            const customData = data;
                            customData.team_size = data.team_size[0];
                            customData.token = token;
                            return customData;
                        }}
                    />
                </div>
            </div>
        </AuthWrapper>
    );
};

export default CompleteRegistrationComponent;
