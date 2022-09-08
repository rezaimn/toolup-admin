import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Button } from '@material-ui/core';
import AuthWrapper from './assets/styles/authWrapper.style';
import { logo, success } from 'assets/icons';
import { useHistory } from 'react-router';
import { routeTo } from 'Helpers/routeTo';

export default function SuccessPage() {
    const history = useHistory();
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
                    <img src={success} height='85' width='85' />
                    <div className='success-message'>
                        Registration Successful
                    </div>
                    <div className='success-detail'>
                        A registration confirmation email has been sent to you
                    </div>
                    <Button
                        size='large'
                        fullwidth='true'
                        type='submit'
                        onClick={() => history.push(routeTo('auth'))}
                        className='success-button'
                    >
                        OK
                    </Button>
                </AppBar>
            </div>
        </AuthWrapper>
    );
}
