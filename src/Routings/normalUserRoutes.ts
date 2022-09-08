/* pages */
import Dashboard from 'Pages/MemberDashboard';
import MemberProfile from 'Pages/MemberProfile';
/* constants */
import { ROUTES } from 'Constants/routes';
/* types */
import { Route } from './routes';

export const normalUserRoutes: Route[] = [
    {
        path: ROUTES.dashboard,
        component: Dashboard,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.dashboard,
                    title: 'Dashboard',
                },
            ],
        },
    },
    {
        path: ROUTES.profile,
        component: MemberProfile,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.dashboard,
                    title: 'Dashboard',
                },
                {
                    link: ROUTES.profile,
                    title: 'Profile',
                },
            ],
        },
    },
];
