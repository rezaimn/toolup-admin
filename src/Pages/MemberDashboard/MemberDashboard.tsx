import { FC, useEffect, useState } from 'react';
/* components */
import { ToolManagementToolsList } from 'Components/Organisms/ToolManagementToolsList';
import { Spinner } from 'Components/Atomes/Spinner';
import { ToolManagementFilter } from 'Components/Organisms/ToolManagementFilter';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { TeammatesList } from 'Components/Organisms/TeammatesList';
import { CompanyTeamList } from 'Components/Organisms/CompanyTeamList';
/* modules */
import cn from 'clsx';
import {
    filter,
    includes,
    last,
    lowerCase,
    pipe,
    capitalize,
    find,
    isEqual,
} from 'lodash/fp';
import { FilterToolsReducer } from 'Components/Organisms/ToolManagementFilter/lib';
import {
    Tool,
    useUserTools,
    useTeamMembers,
    useOrganizationTeams,
    useMemberTeams,
    useCurrentUserDetails,
    TeamMember,
    TeamHttpResponse,
} from 'Hooks/api';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';

/* types */
const MemberDashboard: FC = () => {
    const { data: userTools, isLoading: userToolsIsLoading } = useUserTools();
    const [teamId, setTeamId] = useState<undefined | number>(undefined);

    const {
        data: user,
        isLoading: userIsLoading = true,
    } = useCurrentUserDetails({
        staleTime: 600_000,
    });

    const {
        data: memberTeams,
        isLoading: memberTeamsIsLoading,
    } = useMemberTeams({
        onSuccess: data => {
            if (isEqual(1)(data.length)) {
                return;
            }
            setTeamId(last(data)?.id as number);
        },
    });

    const {
        data: organgizationTeams,
        isLoading: organizationTeamsIsLoading,
    } = useOrganizationTeams();

    const {
        data: teamMembers,
        isLoading: teamMembersIsLoading = true,
        refetch: refetchTeammates,
        isFetching: teamMembersIsFetching = true,
    } = useTeamMembers(teamId as number, { enabled: !!teamId, retry: 1 });

    useEffect(() => {
        refetchTeammates();
    }, [teamId]);

    const [filterState, setFilterState] = useState<
        FilterToolsReducer | undefined
    >();

    const isLoading = userToolsIsLoading;

    const count = userTools?.length;

    const filterByName = (tools: Tool[]) => {
        return filter<Tool>(item =>
            includes(lowerCase(filterState?.search_term as string))(
                lowerCase(item.name)
            )
        )(tools);
    };

    const tools = pipe(filterByName)(userTools);

    const shouldRenderNothingFound = !isLoading && tools.length === 0;

    const teamTools = (
        <div className={cn(styles.teamTools, styles.container)}>
            <ToolManagementFilter
                title='Team Tools'
                withSort={false}
                description={count ? `${count} tools` : ''}
                onChange={setFilterState}
            />
            {isLoading && (
                <div className={cn(styles.centered)}>
                    <Spinner />
                </div>
            )}
            {!isLoading && (
                <ToolManagementToolsList
                    className={styles.list}
                    withAddTool={false}
                    tools={tools}
                />
            )}

            {shouldRenderNothingFound && (
                <EmptyCardSign title='No Tools Found' />
            )}
        </div>
    );

    const title = (): string => {
        if (isEqual(teamId)(last(memberTeams)?.id)) {
            return `Your teammates`;
        }

        const team = find<TeamHttpResponse>(t => isEqual(t.id)(teamId))(
            organgizationTeams
        ) as TeamHttpResponse;

        return `${capitalize(team?.name)} team`;
    };

    const teammatesLoading = teamMembersIsFetching || userIsLoading;

    const teammates = (
        <TeammatesList
            loading={teammatesLoading}
            members={teamMembers!}
            title={title()}
            user={user!}
        />
    );

    const companysTeams = (
        <CompanyTeamList
            onTeamSelect={setTeamId}
            currentTeamId={last(memberTeams)?.id}
            selectedTeamId={teamId!}
            loading={organizationTeamsIsLoading}
            teams={organgizationTeams}
        />
    );

    return (
        <div className={styles.memberDashboard}>
            {teamTools}
            <div className={styles.teammatesSection}>
                <div className={cn(styles.teammates, styles.container)}>
                    {teammates}
                </div>
                <div className={cn(styles.companyTeams, styles.container)}>
                    {companysTeams}
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
