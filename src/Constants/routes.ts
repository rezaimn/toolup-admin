export const ROUTES = {
    root: '/',
    dashboard: '/dashboard',
    intro: '/intro/:step',
    members: '/members',
    addMember: '/members/add',
    editMember: '/members/:id',
    auth: '/auth/sign-in',
    signup: '/auth/sign-up',
    emailVerified: '/auth/email-verified',
    forgetPassword: '/auth/forget-password',
    resetPassword: '/auth/reset-password',
    setPassword: '/auth/set-password',
    successAuth: '/auth/success',
    error: '/error',
    remoteLogin: '/auth/remote-login',
    onboardingOffboarding: '/onboarding-offboarding',
    tools: '/team-tools',
    toolsManagement: '/tools/management',
    completeRegistration: '/auth/complete-registration',
    privacyPolicy: 'https://www.toolup.io/terms-of-service',
    addTool: '/tools/management/add/:id',
    editTool: '/tools/management/edit/:toolId',
    toolPasswordSetup: '/tool-password-setup',
    teams: '/teams',
    addTeam: '/teams/add',
    teamDetail: '/teams/:teamId',
    mainWebsite: 'https://www.toolup.io',
    editTeamMembers: '/teams/:teamId/edit-members',
    editTeamTools: '/teams/:teamId/edit-tools',
    uiSheet: '/ui-sheet',
    redeemCode: '/redeem-code',
    profile: '/profile',
    passwordManagementActivation: '/password-management/activation',
};
