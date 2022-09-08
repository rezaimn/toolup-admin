import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Button } from '@material-ui/core';
import AuthWrapper from './assets/styles/authWrapper.style';
import { logo } from 'assets/icons';
import { useHistory } from 'react-router-dom';
import { routeTo } from 'Helpers/routeTo';

export default function SuccessPage() {
    const history = useHistory();
    const redirectToLogin = () => {
        history.push(routeTo('auth'));
    };
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
            <div className='tab-wrapper success'>
                <AppBar position='static'>
                    <img src={images.success} height='85' width='85' />
                    <div className='success-message'>
                        Your Email successfully Verified.
                    </div>
                    <Button
                        onClick={redirectToLogin}
                        size='large'
                        fullwidth='true'
                        type='submit'
                        className='success-button'
                    >
                        Sign In
                    </Button>
                </AppBar>
            </div>
        </AuthWrapper>
    );
}
