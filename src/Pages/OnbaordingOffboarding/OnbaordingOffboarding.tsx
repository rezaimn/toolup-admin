import React, {
    FC,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
} from 'react';
/* components */
import { BoardingAccoidion } from 'Components/Organisms/BoardingAccoidion';
import { Spinner } from 'Components/Atomes/Spinner';
import { ToolMembersFilter } from 'Components/Molecules/ToolMembersFilter';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import SearchInput from 'Components/Atomes/SearchInput/SearchInput';
/* modules */
import cn from 'clsx';
import { useBoardingTools, useOrgTeams, Status } from 'Hooks/api';
import { useDebounce } from 'Hooks/useDebounce';
import { useOrganizationPositions } from 'Hooks/api/organization';
/* helpers */
/* assets */
import { questionMarkIcon } from 'assets/icons';
/* styles */
/* types */

const initialState: FilterOnboardingOffboardingState = {
    member_status: '',
    member_position: '',
    team_id: '',
    search_term: '',
};

export type FilterOnboardingOffboardingState = {
    member_status: Status | string;
    team_id: string | number;
    member_position: string;
    search_term: string;
    boarding_date_from?: string;
    boarding_date_to?: string;
    tool_status?: string[];
};

type TeamPayload = {
    team: number | string;
};

type StatusPayload = {
    status: string;
};

type PositionPayload = {
    position: string;
};

type SearchPayload = {
    search: string;
};

type Action =
    | { type: 'team'; payload: TeamPayload }
    | { type: 'position'; payload: PositionPayload }
    | { type: 'status'; payload: StatusPayload }
    | { type: 'search'; payload: SearchPayload }
    | { type: 'clear' };

function reducer(
    state: FilterOnboardingOffboardingState,
    action: Action
): FilterOnboardingOffboardingState {
    switch (action.type) {
        case 'team':
            return { ...state, team_id: action.payload.team };

        case 'status':
            return { ...state, member_status: action?.payload.status };

        case 'position':
            return { ...state, member_position: action?.payload?.position };

        case 'search':
            return { ...state, search_term: action.payload.search };

        case 'clear':
            return {
                search_term: '',
                member_position: '',
                team_id: '',
                member_status: '',
            };

        default:
            throw new Error();
    }
}

const OnbaordingOffboarding: FC = () => {
    const [filterTools, dispatchFilter] = useReducer(reducer, initialState);
    const debouncedValue = useDebounce<string>(filterTools.search_term, 600);

    const {
        data: userTools = [],
        isLoading: userToolsIsLoading,
        refetch,
    } = useBoardingTools(filterTools);

    const { data: teams, isLoading: teamsIsLoading } = useOrgTeams();

    const {
        data: organizationPositions,
        isLoading: organizationPositionsIsLoading,
    } = useOrganizationPositions();

    useEffect(() => {
        refetch();
    }, [debouncedValue]);

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        if (isEmpty(filterTools)) {
            refetch();
        }
    }, [filterTools]);

    const isEmpty = (object: Record<string, unknown>) =>
        !Object.values(object).some(x => x !== null && x !== '');

    return (
        <div
            className={cn(
                'bg-white',
                'p-30',
                'rounded-lg',
                'w-full',
                'overflow-hidden'
            )}
            style={{ height: 'calc(100vh - 140px)' }}
        >
            <div className={cn('flex', 'items-center', 'space-x-10', 'mb-20')}>
                <div
                    className={cn('w-full', 'lg:w-1/2', 'xl:w-1/3', 'ml-auto')}
                >
                    <SearchInput
                        value={filterTools?.search_term || ''}
                        setValue={search =>
                            dispatchFilter({
                                type: 'search',
                                payload: { search },
                            })
                        }
                        className=''
                        onKeyPress={e => {}}
                    />
                </div>

                <ToolMembersFilter
                    teams={teams}
                    positions={organizationPositions}
                    done={refetch}
                    clear={() => {
                        dispatchFilter({ type: 'clear' });
                    }}
                    onPositionChange={position =>
                        dispatchFilter({
                            type: 'position',
                            payload: { position },
                        })
                    }
                    onStatusChange={status =>
                        dispatchFilter({
                            type: 'status',
                            payload: { status },
                        })
                    }
                    onTeamChange={team =>
                        dispatchFilter({
                            type: 'team',
                            payload: { team },
                        })
                    }
                />
            </div>

            {userToolsIsLoading && (
                <div className={cn('flex', 'justify-center', 'my-20')}>
                    <Spinner />
                </div>
            )}

            {!userToolsIsLoading && userTools?.length <= 0 && (
                <EmptyCardSign className={cn('mt-20')} title='No Tools found' />
            )}

            <BoardingAccoidion filterPayload={filterTools} tools={userTools} />
        </div>
    );
};

export default OnbaordingOffboarding;
