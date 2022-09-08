/* pages */
import Setup from 'Pages/Setup';
import DashboardPage from 'Pages/Dashboard';
import Members from 'Pages/Members';
import OnboardingOffboardingPage from 'Pages/OnbaordingOffboarding';
import AddMember from 'Pages/AddMember';
import SetupTeamTools from 'Pages/TeamTools';
import ToolManagement from 'Pages/ToolManagement';
import EditTool from 'Pages/EditTool';
import AddTool from 'Pages/AddTool';
import Teams from 'Pages/Teams';
/* components */
import AddTeam from 'Pages/AddTeam';
/* constants */
import { ROUTES } from 'Constants/routes';
/* types */
import EditTeam from 'Pages/EditTeam';
import EditMember from 'Pages/EditMember';
import EditTeamMembers from 'Pages/EditTeamMembers';
import EditTeamTools from 'Pages/EditTeamTools';
import Profile from 'Pages/Profile';

import PasswordManagementActivation from 'Pages/PasswordManagement/PasswordManagementActivation';

import { Route } from './routes';
import ToolPasswordSetup from 'Pages/ToolPasswordSetup';
/* components */

export const adminRoutes: Route[] = [
    {
        path: ROUTES.intro,
        component: Setup,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            title: 'System setup',
        },
    },
    {
        path: ROUTES.dashboard,
        component: DashboardPage,
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
        path: ROUTES.members,
        component: Members,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            title: 'Member Management',
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.members,
                    title: 'Member Management',
                },
            ],
        },
    },
    {
        path: ROUTES.addMember,
        component: AddMember,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.members,
                    title: 'Member Management',
                },
                {
                    link: ROUTES.addMember,
                    title: 'Add Member',
                },
            ],
        },
    },
    {
        path: ROUTES.editMember,
        component: EditMember,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.members,
                    title: 'Member Management',
                },
                {
                    link: ROUTES.editMember,
                    title: 'Edit Member',
                },
            ],
        },
    },
    {
        path: ROUTES.editMember,
        component: AddMember,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.members,
                    title: 'Member Management',
                },
                {
                    link: ROUTES.editMember,
                    title: 'Edit Member',
                },
            ],
        },
    },
    {
        path: ROUTES.onboardingOffboarding,
        component: OnboardingOffboardingPage,
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
                    link: ROUTES.onboardingOffboarding,
                    title: 'Onboarding / Offboarding',
                },
            ],
        },
    },
    {
        path: ROUTES.tools,
        component: SetupTeamTools,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.tools,
                    title: 'Team / Tools',
                },
            ],
        },
    },
    {
        path: ROUTES.toolsManagement,
        component: ToolManagement,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.toolsManagement,
                    title: 'Tool Management',
                },
            ],
        },
    },
    {
        path: ROUTES.editTool,
        component: EditTool,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.toolsManagement,
                    title: 'Tool Management',
                },

                {
                    link: ROUTES.editTool,
                    title: 'Edit Tool',
                },
            ],
        },
    },
    {
        path: ROUTES.addTool,
        component: AddTool,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.toolsManagement,
                    title: 'Tool Management',
                },

                {
                    link: ROUTES.addTool,
                    title: 'Add Tool',
                },
            ],
        },
    },
    {
        path: ROUTES.toolPasswordSetup,
        component: ToolPasswordSetup,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.toolPasswordSetup,
                    title: 'Tool Password Setup',
                },
            ],
        },
    },
    {
        path: ROUTES.teams,
        component: Teams,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.teams,
                    title: 'Teams',
                },
            ],
        },
    },
    {
        path: ROUTES.addTeam,
        component: AddTeam,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.teams,
                    title: 'Teams',
                },

                {
                    link: ROUTES.addTeam,
                    title: 'Add team',
                },
            ],
        },
    },
    {
        path: ROUTES.teamDetail,
        component: EditTeam,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.teams,
                    title: 'Teams',
                },

                {
                    link: ROUTES.teamDetail,
                    title: 'Edit Team',
                },
            ],
        },
    },
    {
        path: ROUTES.editTeamMembers,
        component: EditTeamMembers,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.teams,
                    title: 'Teams',
                },
                {
                    link: ROUTES.teamDetail,
                    title: 'Edit Team',
                },
                {
                    link: ROUTES.editTeamMembers,
                    title: 'Edit team members',
                },
            ],
        },
    },
    {
        path: ROUTES.editTeamTools,
        component: EditTeamTools,
        exact: true,
        config: {
            layout: true,
            isPrivate: true,
            renderDomain: 'SUBDOMAIN',
            breadcrumbs: [
                {
                    link: ROUTES.teams,
                    title: 'Teams',
                },
                {
                    link: ROUTES.teamDetail,
                    title: 'Edit Team',
                },
                {
                    link: ROUTES.editTeamTools,
                    title: 'Edit team tools',
                },
            ],
        },
    },
    {
        path: ROUTES.profile,
        component: Profile,
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
