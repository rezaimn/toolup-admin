export interface Member {
    id?: number;
    first_name?: string;
    last_name?: string;
    email: string;
    errors?: any;
    teams?: any[];
    team?: string;
    team_name?: string;
    rowNo?: string;
    onboarding_date?: string;
    offboarding_date?: string;
    selectedForDelete?: boolean;
    status?:
        | 'NOT_ONBOARDED'
        | 'ONBOARDING'
        | 'ONBOARDED'
        | 'NOT_OFFBOARDED'
        | 'OFFBOARDED'
        | undefined;
    avatar?: any;
    member_status?: 'ACTIVE' | 'SUSPENDED' | 'NEW' | 'INVITED' | undefined;
    access?: 'Normal User' | 'Super Admin' | undefined;
}

interface Team {
    id?: number;
    name: string;
}
