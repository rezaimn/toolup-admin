import {
    ComponentPropsWithoutRef,
    FC,
    useCallback,
    useMemo,
    useState,
} from 'react';
/* components */
import { GroupedMembers } from 'Components/Organisms/GroupedMembers';
import { DroppableTeamsList } from 'Components/Organisms/DroppableTeamsList';
import SearchInput from 'Components/Atomes/SearchInput/SearchInput';
import {
    AddMemberCompactForm,
    AddMemberCompactFormPayload,
} from 'Components/Organisms/AddMemberCompactForm';
import { RenderSearchResult } from 'Components/Organisms/AddMembersToTeams/RenderSearchResult';
/* modules */
import cn from 'clsx';
import dayJs from 'dayjs';
import {
    Member,
    membersWithoutTeamQueryKey,
    useAddMember,
    useAddMembersToTeam,
    useEditMemberAvatar,
    useFilterMembers,
    useNewTeams,
    useShowTeam,
    membersWithTeamQueryKey,
    useDeleteMembersFromTeam,
} from 'Hooks/api';
import {
    flow,
    groupBy,
    map,
    head,
    omit,
    filter,
    negate,
    pipe,
    isNil,
    last,
    isEmpty,
    get,
    uniq,
    toString,
    concat,
    uniqueId,
    reject,
    isEqual,
    uniqBy,
} from 'lodash/fp';
import { useHistory } from 'react-router';
/* helpers */
import { isNullOrUndefined } from 'Helpers/isNullOrUndefined';
import { toast } from 'Components/Atomes/ToastContainer';
import { and, isZero, or } from 'Helpers/fp';
import { routeTo } from 'Helpers/routeTo';
/* services */
import { queryClient } from 'Services/ReactQueryService';
import API_URLS from 'Constants/apiUrls';
/* assets */
/* styles */
import styles from './styles.module.scss';
import { NoResultsFound } from './NoResultsFound';
/* types */

export type Props = ComponentPropsWithoutRef<'div'> & {
    teamId?: number;
    teamsTitle?: string;
};

export type SelectedMembersWithTeamId = {
    memberId: number;
    teamId: number;
};

export const AddMembersToTeams: FC<Props> = ({
    className,
    teamId,
    teamsTitle = 'New Teams',
}) => {
    const [selectedMembers, setSelectedMembers] = useState<
        SelectedMembersWithTeamId[]
    >([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSarchResultVisible, setSearchResultVisibility] = useState(true);
    const [addMemberFormErrors, setAddMemberFormErrors] = useState({});

    const [showEmptyResultForm, setShowEmptyResultForm] = useState(true);

    const [randomStringKey, setRandomStringKey] = useState('');

    const showForm = () => {
        setIsFormVisible(true);
        setShowEmptyResultForm(false);
    };
    const hideForm = () => {
        setIsFormVisible(false);
        setShowEmptyResultForm(true);
    };

    const showSearchResult = () => setSearchResultVisibility(true);
    const hideSearchResult = () => setSearchResultVisibility(false);

    const history = useHistory();

    const {
        data: withoutTeamMembers = [],
        isLoading: withoutTeamMembersIsLoading,
    } = useFilterMembers({
        query: {
            teams_count: 1,
        },
    });

    const {
        data: withTeamMembers = [],
        isLoading: withTeamMembersIsLoading,
    } = useFilterMembers({
        query: {
            teams_count: 2,
        },
    });

    const { data: teams = [], isLoading: teamsIsLoading } = useNewTeams({
        /* 10 mins */
        staleTime: 1000 * 60 * 10,
    });

    const { data: team, isLoading: teamIsLoading = false } = useShowTeam(
        teamId || (0 as number),
        {
            /* 10 mins */
            enabled: !!teamId,
            retry: 1,
            onError: () => {
                history.push(routeTo('teams'));
            },
        }
    );

    const {
        mutate: addMembersToTeam,
        isLoading: addMembersToTeamIsLoading,
    } = useAddMembersToTeam();

    const {
        mutate: deleteMembersFromTeam,
        isLoading: deleteMemberFromTeamIsLoading,
    } = useDeleteMembersFromTeam();

    const { mutate: addMember, isLoading: addMemberIsLoading } = useAddMember();

    const {
        mutate: editMemberAvatar,
        isLoading: editMemberAvatarIsLoading,
    } = useEditMemberAvatar();

    type Return = {
        teamName: string | undefined;
        members: Partial<Member>[];
    };

    const isRoleDefined = (member: Member) =>
        negate(isNullOrUndefined)(member.position);

    const membersWithTeam = useMemo(
        () =>
            flow(
                map<Member, Member>(i => ({
                    ...i,
                    teams: last(i.teams) as any,
                })),
                reject<any>(i => isEqual(i.teams.id)(teamId)),
                groupBy<any>(i => i?.teams?.name),
                map<Member[], Return>(group => {
                    return {
                        teamName: pipe(head, get('teams.name'))(group),
                        members: map(omit('position'), group),
                    };
                })
            )(withTeamMembers),
        [withTeamMembers]
    );

    const handleSelectMembers = (
        members: SelectedMembersWithTeamId[]
    ): void => {
        setSelectedMembers(members);
    };

    const membersWithoutTeam = [
        {
            members: flow(
                filter(negate(isRoleDefined)),
                map<Member, Member>(i => ({
                    ...i,
                    teams: last(i.teams) as any,
                }))
            )(withoutTeamMembers),
            teamName: 'Members without team',
        },
    ];

    const isLoading = or(
        () => withoutTeamMembersIsLoading,
        () => teamsIsLoading,
        () => teamIsLoading
    );

    const mustShowSearchInput = or(
        () =>
            pipe(
                last,
                get('members'),
                get('length'),
                negate(isZero)
            )(membersWithoutTeam),

        () =>
            pipe(
                last,
                get('members'),
                get('length'),
                negate(isZero)
            )(membersWithTeam)
    );

    const renderGroupedMembers = () => {
        type T = { name: string; Component: JSX.Element };
        const returnValue: T[] = [];

        const hasMembersWihtoutTeam = pipe(
            last,
            get('members'),
            get('length'),
            negate(isZero)
        )(membersWithoutTeam);

        const hasMembersWithTeam = pipe(
            get('length'),
            negate(isZero)
        )(membersWithTeam);

        const neitherHasNewMembersNorHasMembers = and(
            () => !hasMembersWihtoutTeam,
            () => !hasMembersWithTeam
        );

        if (hasMembersWihtoutTeam) {
            returnValue.push({
                name: 'membersWithoutTeam',
                Component: (
                    <GroupedMembers
                        key={`${randomStringKey}-membersWithoutTeam`}
                        data={membersWithoutTeam}
                        onSelect={handleSelectMembers}
                        selectedMembers={selectedMembers}
                        isDeletable={false}
                        withPositionFilter={false}
                    />
                ),
            });
        }
        if (hasMembersWithTeam) {
            returnValue.push({
                name: 'membersWithTeam',
                Component: (
                    <GroupedMembers
                        key={`${randomStringKey}-membersWithTeam`}
                        data={membersWithTeam}
                        onSelect={handleSelectMembers}
                        selectedMembers={selectedMembers}
                        isDeletable
                        withPositionFilter
                    />
                ),
            });
        }

        if (
            and(
                () => neitherHasNewMembersNorHasMembers,
                () => showEmptyResultForm
            )
        ) {
            returnValue.push({
                name: 'noResulstsFound',
                Component: (
                    <NoResultsFound
                        onClick={handleOnAddButtonClick}
                        message='No results found'
                        addNewMessage='Add a new member by clicking on'
                        buttonText='ADD NEW MEMBER'
                    />
                ),
            });
        }

        return pipe(
            uniqBy<T>(i => i.name),
            map(get('Component'))
        )(returnValue);
    };

    if (isLoading) {
        return <div>loading...</div>;
    }

    return (
        <div className={cn(className, styles.addMembersToTeams)}>
            <div
                className={cn(styles.members, {
                    [styles.fullHeight]: !teamId,
                    [styles.minHeight]: !!teamId,
                })}
            >
                {renderSearchInput()}

                <AddMemberCompactForm
                    visible={isFormVisible}
                    onCancel={handleCancelAddMember}
                    onSubmit={handleFormSubmit}
                    isLoading={addMemberIsLoading}
                    formErrors={addMemberFormErrors}
                />

                <RenderSearchResult
                    all={concat(withoutTeamMembers)(withTeamMembers)}
                    searchQuery={searchQuery}
                    onSelectMembers={handleSelectMembers}
                    selectedMembers={selectedMembers}
                    onButtonClick={handleOnAddButtonClick}
                    visible={isSarchResultVisible}
                />

                {renderGroupedMembers()}
            </div>

            <div
                className={cn(styles.teams, {
                    [styles.fullHeight]: !teamId,
                    [styles.minHeight]: !!teamId,
                })}
            >
                <DroppableTeamsList
                    selectedMembers={selectedMembers}
                    onDropped={handleDrop}
                    teams={teamId ? [team!] : teams}
                    title={teamsTitle}
                    isSignleTeam={!!teamId}
                />
            </div>
        </div>
    );

    function renderSearchInput(): JSX.Element | undefined {
        if (mustShowSearchInput)
            return (
                <SearchInput
                    className={cn()}
                    onKeyPress={() => { }}
                    setValue={setSearchQuery}
                    value={searchQuery}
                />
            );
        return undefined;
    }

    function handleReset() {
        setSelectedMembers([]);
    }

    function handleDrop(
        team_id: number,
        members: SelectedMembersWithTeamId[],
        teamName: string
    ): void {
        const selectedMembersFromNonGeneralTeam = filter<SelectedMembersWithTeamId>(
            pipe(get('teamId'), negate(isZero))
        )(members);

        const func = () => {
            addMembersToTeam(
                {
                    teamId: team_id,
                    member_ids: map(get('memberId'))(members),
                    isSingleTeam: !!teamId,
                    teamName,
                },
                {
                    onSuccess: () => {
                        handleReset();
                        toast(
                            'success',
                            'member succesfully assigned to team!'
                        );

                        if (!teamId) {
                            queryClient.invalidateQueries(API_URLS.newTeams);
                            queryClient.invalidateQueries([
                                'teamMembers',
                                team_id,
                            ]);

                            const updatedTeamIds = pipe(
                                map(get('teamId')),
                                uniq,
                                concat(team_id)
                            )(selectedMembersFromNonGeneralTeam);

                            map<number, void>(tId => {
                                queryClient.invalidateQueries([
                                    'teamMembers',
                                    tId,
                                ]);
                            })(updatedTeamIds);
                        } else {
                            queryClient.invalidateQueries(
                                API_URLS.showTeam(toString(teamId))
                            );
                            queryClient.invalidateQueries([
                                'teamMembers',
                                teamId,
                            ]);
                        }

                        queryClient.invalidateQueries(membersWithTeamQueryKey);
                        queryClient.invalidateQueries(
                            membersWithoutTeamQueryKey
                        );

                        setRandomStringKey(uniqueId('key-prefix-'));
                    },
                }
            );
        };

        if (negate(isEmpty)(selectedMembersFromNonGeneralTeam)) {
            type T = { teamId: number; memberIds: number[] };

            const detachPromise = () => {
                return new Promise((resolve, reject): void => {
                    pipe(
                        groupBy<SelectedMembersWithTeamId>(i => i.teamId),

                        map<SelectedMembersWithTeamId[], T>(i => {
                            return {
                                teamId: head(i)?.teamId as number,
                                memberIds: map(get('memberId'))(i),
                            };
                        }),

                        map<T, void>(i => {
                            deleteMembersFromTeam(
                                {
                                    teamId: i.teamId,
                                    member_ids: i.memberIds,
                                },
                                {
                                    onSuccess: () => {
                                        handleReset();
                                        resolve(undefined);
                                    },
                                }
                            );
                        })
                    )(selectedMembersFromNonGeneralTeam);
                });
            };

            detachPromise()
                .then(() => {
                    func();
                    return {};
                })
                .catch(() => { });
        } else {
            func();
        }
    }

    function handleFormSubmit(v: AddMemberCompactFormPayload): void {
        /* reset api call errors */
        setAddMemberFormErrors({});
        addMember(
            {
                ...(omit('avatar')(v) as Omit<
                    AddMemberCompactFormPayload,
                    'avatar'
                >),
                status: 'NOT_ONBOARDED',
                onboarding_date: dayJs(v.onboarding_date).format('YYYY/MM/DD'),
            },
            {
                onSuccess: member => {
                    if (
                        and(
                            () => negate(isNil)(v.avatar),
                            () => negate(isEmpty)(v.avatar)
                        )
                    ) {
                        editMemberAvatar(
                            {
                                memberId: member.id,
                                avatar: last(v.avatar),
                            },
                            {
                                onSuccess: () => {
                                    queryClient.invalidateQueries(
                                        membersWithoutTeamQueryKey
                                    );
                                    toast(
                                        'success',
                                        'Member successfully added'
                                    );
                                    handleCancelAddMember();
                                },
                            }
                        );
                    } else {
                        queryClient.invalidateQueries(
                            membersWithoutTeamQueryKey
                        );
                        toast('success', 'Member successfully added');
                        handleCancelAddMember();
                    }
                },

                onError: (err: Record<string, any>) => {
                    setAddMemberFormErrors(err?.detail);
                },
            }
        );
    }

    function clearSearchQuery(): void {
        setSearchQuery('');
    }

    function handleOnAddButtonClick(): void {
        pipe(showForm, hideSearchResult)();
    }

    function handleCancelAddMember(): void {
        pipe(hideForm, showSearchResult, clearSearchQuery)();
    }
};
