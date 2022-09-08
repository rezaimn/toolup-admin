import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import AuthWrapper from './assets/styles/authWrapper.style';
import { logo } from 'assets/icons';
import { isGateway } from 'Helpers/getDomain';
import { routeTo } from 'Helpers/routeTo';
import _ from 'lodash';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Authentication() {
    const location = useLocation();
    const history = useHistory();
    const params = useParams();

    const pathname = _.split(location.pathname, '/');
    const tab = _.last(pathname);
    const [value, setValue] = React.useState(tab === 'sign-up' ? 0 : 1);
    const handleChange = (event, newValue) => {
        if (isGateway) {
            setValue(newValue);
            history.push(`/auth/${newValue === 0 ? 'sign-up' : 'sign-in'}`);
        }
    };

    return (
        <AuthWrapper style={{ overflowY: 'auto' }}>
            <div
                className='logo-wrapper'
                style={{ fontSize: '30px', fontWeight: '800' }}
            >
                <a
                    rel='noreferrer'
                    href={routeTo('mainWebsite')}
                    target='_blank'
                    style={{ margin: '80px 10px' }}
                    className='flex space-x-10'
                >
                    <img src={logo} height='43' width='84' alt='' />
                    <p>Toolup</p>
                </a>
            </div>
            <div className='tab-wrapper'>
                <AppBar position='static'>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label='simple tabs example'
                    >
                        {isGateway && <Tab label='Sign Up' {...a11yProps(0)} />}
                        <Tab label='Sign In' {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                {isGateway && (
                    <TabPanel value={value} index={0}>
                        <SignUp />
                    </TabPanel>
                )}
                <TabPanel value={value} index={1}>
                    <Login />
                </TabPanel>
            </div>
        </AuthWrapper>
    );
}
