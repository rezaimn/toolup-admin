import { generatePath } from 'react-router-dom';

const API_URLS = {
    login: '/auth/login',
    logout: '/auth/logout',
    remoteLogin: '/auth/remote-login',
    signUp: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    setPassword: '/auth/set-password',
    earlyAdaption: '/auth/early-adoption',
    earlyAdaptionRegister: '/auth/early-adoption/register',
    users: '/members',
    memberBulkDelete: '/members/bulk/delete',
    membersFilter: '/members/filter',
    membersSearch: '/members/search',
    orgTools: '/organization/tools',
    allTools: '/tools/all',
    unConfiguredTools: '/tools/unconfigured',
    userTools: '/tools',
    user: '/user',
    mailService: '/services/mail/tools',
    singleMailService: '/services/mail',
    checkPassword: '/auth/password-check',
    addDevice: '/device',
    changeAvatar: '/setting/change-avatar',
    teams: '/teams',
    orgTeams: '/organization/teams',
    allTeams: '/teams',
    categories: '/categories',
    addTool: `/teams/__id__/tools`,
    createTool: '/tools',
    editToolImage: '/tools/__id__/change-icon',
    boardingTools: '/tools/boarding-tools',
    setupStatus: '/setup/status',
    createBulk: '/members/bulk/create',
    changeLogo: '/organization/logo',
    organization: '/organization',
    suggestedTools: '/tools/suggested',

    updateToolMember: (toolId: number): string =>
        generatePath('/tools/:toolId/members', { toolId }),

    toolMembers: (toolId: number): string =>
        generatePath('/tools/:toolId/members/filter', { toolId }),

    organizationPositions: '/organization/positions',

    toolMembersFilter: (toolId: number): void => {},
    organizationTools: '/organization/tools',
    resetOrganization: '/organization/reset',
    teamMembers: (teamId: number): string =>
        generatePath('/teams/:teamId/members', { teamId }),
    tool: (toolId: number): string =>
        generatePath('/tools/:toolId', { toolId }),

    editTool: (toolId: string): string =>
        generatePath('/tools/:toolId', { toolId }),

    editToolConfig: (toolId: string): string =>
        generatePath('/tools/:toolId/config', { toolId }),

    recommendedTools: '/tools/filter',
    unusedTools: '/tools/unused',
    deleteTeamTool: (teamId: string): string =>
        generatePath('/teams/:teamId/tools/delete', { teamId }),
    deleteTool: (toolId: string): string =>
        generatePath('/tools/:toolId', { toolId }),

    allMembers: '/members',

    addMembersToTeam: (teamId: string): string =>
        generatePath('/teams/:teamId/members/bulk/add', { teamId }),

    newTeams: '/teams/new',
    members: '/members',
    memberAvatar: (memberId: string): string =>
        generatePath('/members/:memberId/avatar', { memberId }),

    deleteTeam: (teamId: string): string =>
        generatePath('/teams/:teamId', { teamId }),

    showTeam: (teamId: string): string =>
        generatePath('/teams/:teamId', { teamId }),

    deleteMembersFromTeam: (teamId: string): string =>
        generatePath('/teams/:teamId/members/bulk/delete', { teamId }),

    validateReedemCode: '/promotion/check',
    passwordManagement: {
        keyset: '/services/password/keyset',
        devices: '/services/password/devices',
        vaults: '/services/password/vaults',
        grantVaultAccess: (vaultId: string): string =>
            generatePath('/services/password/vaults/:vaultId/access', {
                vaultId,
            }),
        checkPasswordActivation: '/services/password/activation',
        recoveryGroup: '/services/password/recovery-group',
        recoveryGroupKeysets: (userId: string): string =>
            generatePath('/services/password/recovery-group/keyset/:userId', {
                userId,
            }),
        grantVaultAccessToRecoveryGroup: (vaultId: string): string =>
            generatePath('/services/password/vaults/:vaultId/access/recovery', {
                vaultId,
            }),
        deleteDevice: (deviceId: string): string =>
            generatePath('/services/password/devices/:deviceId', { deviceId }),
    },
};

export default API_URLS;
