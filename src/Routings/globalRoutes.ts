/* global pages */
import ForgotPassword from 'Pages/auth/ForgotPassword';
import Authentication from 'Pages/auth/Authentication';
import ResetPassword from 'Pages/auth/ResetPassword';
import SetPassword from 'Pages/auth/SetPassword';
import SuccessPage from 'Pages/auth/SuccessPage';
import CompleteRegistration from 'Pages/auth/CompleteRegistration';
import ErrorPage from 'Pages/Error';
import EmailVerifiedPage from 'Pages/auth/EmailVerifiedPage';
import RemoteLoginPage from 'Pages/RemoteLogin';
import RedeemCode from 'Pages/RedeemCode';
/* helpers */
import { isAuthSubdomain } from 'Helpers/getDomain';
/* constants */
import { ROUTES } from 'Constants/routes';
/* types */
import { Route } from './routes';

const globalRoutes: Route[] = [
    {
        path: ROUTES.forgetPassword,
        component: ForgotPassword,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Forgot Password',
        },
    },
    {
        path: ROUTES.auth,
        component: Authentication,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Authentication',
        },
    },
    {
        path: ROUTES.signup,
        component: Authentication,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Authentication',
        },
    },

    {
        path: ROUTES.resetPassword,
        component: ResetPassword,
        exact: false,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Reset Password',
        },
    },
    {
        path: ROUTES.setPassword,
        component: SetPassword,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'SUBDOMAIN',
            title: 'Set Password',
        },
    },
    {
        path: ROUTES.successAuth,
        component: SuccessPage,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Successful Authentication',
        },
    },
    {
        path: ROUTES.emailVerified,
        component: EmailVerifiedPage,
        exact: true,
        config: {
            layout: false,
            isPrivate: true,
            renderDomain: 'BOTH',
            title: 'Email Verification',
        },
    },
    {
        path: ROUTES.remoteLogin,
        component: RemoteLoginPage,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Logging in...',
        },
    },
    {
        path: ROUTES.completeRegistration,
        component: CompleteRegistration,
        exact: true,
        config: {
            layout: false,
            isPrivate: false,
            renderDomain: 'BOTH',
            title: 'Complete Registration',
        },
    },

    {
        from: '*',
        to: ROUTES.dashboard,
        component: undefined,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'BOTH',
        },
    },
];
if (isAuthSubdomain) {
    globalRoutes.unshift(
        {
            path: ROUTES.root,
            component: Authentication,
            exact: true,
            config: {
                layout: false,
                isPrivate: false,
                renderDomain: 'SUBDOMAIN',
                title: 'Authentication',
            },
        },
        {
            path: ROUTES.error,
            component: ErrorPage,
            exact: true,
            config: {
                layout: false,
                isPrivate: false,
                renderDomain: 'BOTH',
                title: 'Error',
            },
        },
        {
            path: ROUTES.redeemCode,
            component: RedeemCode,
            exact: true,
            config: {
                layout: false,
                isPrivate: false,
                renderDomain: 'BOTH',
                title: 'Redeem Code',
            },
        }
    );
}

export { globalRoutes };
