import { ComponentType } from 'react';

/* pages */
import ForgotPassword from 'Pages/auth/ForgotPassword';
import Authentication from 'Pages/auth/Authentication';
import ResetPassword from 'Pages/auth/ResetPassword';
import SetPassword from 'Pages/auth/SetPassword';
import SuccessPage from 'Pages/auth/SuccessPage';
import DashboardPage from 'Pages/Dashboard';
import Members from 'Pages/Members';
import OnboardingOffboardingPage from 'Pages/OnbaordingOffboarding';
/* constants */
import { ROUTES } from 'Constants/routes';
import AddMember from 'Pages/AddMember';
import SetupTeamTools from 'Pages/TeamTools';
import EmailVerifiedPage from 'Pages/auth/EmailVerifiedPage';
import RemoteLoginPage from 'Pages/RemoteLogin';
import ErrorPage from 'Pages/Error';
import ToolManagement from 'Pages/ToolManagement';

/* components */
import { SetupProcessBanner } from 'Components/Organisms/SetupProcessBanner';
import { BreadCrumbType } from 'Components/Organisms/Breadcrumb';

export type RenderDomains = 'DOMAIN' | 'SUBDOMAIN' | 'BOTH';

export type Route = {
    path?: string | string[];
    component?: ComponentType;
    exact: boolean;
    from?: string;
    to?: string;
    config: {
        layout: boolean;
        isPrivate: boolean;
        title?: string;
        description?: string;
        renderDomain: RenderDomains;
        breadcrumbs?: BreadCrumbType[];
    };
};
