import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
    useReducer,
} from 'react';
/* components */
import { MemberCard } from 'Components/Molecules/MemberCard';
/* modules */
import _ from 'lodash';
import cn from 'clsx';
import { useHistory } from 'react-router-dom';
import SearchInput from 'Components/Atomes/SearchInput/SearchInput';
import { SortDropDown } from 'Components/Atomes/SortDropDown';
import { FilterDropDown } from 'Components/Atomes/FilterDropDown';
import { Member, useFilterMembers, useOrganizationTeams } from 'Hooks/api';
/* helpers */
/* assets */
import {
    addMember,
    greenClose,
    calendarActive,
    memberCirclePurple,
    memberCircleBlue,
    memberCirclegreen,
    memberCircleOrange,
} from 'assets/icons';
import { routeTo } from 'Helpers/routeTo';
import { NiceDatePickerCalendar } from '../../Components/Molecules/DatePicker';
import { Spinner } from '../../Components/Atomes/Spinner';
import { format } from 'date-fns';
/* styles */
import styles from './styles.module.scss';
import { TeamMembers } from '../../Components/Organisms/TeamMembers';
import { PopupTemplate } from '../../Components/Templates/PopupTemplate';
import { PeoplePlus } from '@icon-park/react';
/* types */

const colors = [
    memberCirclePurple,
    memberCircleBlue,
    memberCirclegreen,
    memberCircleOrange,
];
export type CommonMembersProps = {};
export type MembersProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonMembersProps
> &
    CommonMembersProps;

const initialState = {
    orderBy: {
        field: 'onboarding_date',
        order: 'asc',
    },
    team_id: undefined,
    status: undefined,
    onboarding_date_from: undefined,
    onboarding_date_to: undefined,
    search_term: undefined,
};

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'setFilter':
            return {
                ...state,
                team_id: action.team_id,
                status: action.status,
                onboarding_date_from: action.onboarding_date_from,
                onboarding_date_to: action.onboarding_date_to,
            };
        case 'setSort':
            return {
                ...state,
                orderBy: {
                    field: action.orderBy.field,
                    order: action.orderBy.order,
                },
            };
        case 'setSearch':
            return {
                ...state,
                search_term: action.search_term,
            };
        default:
            return state;
    }
};

const Members: FC<MembersProps> = ({ className }) => {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [searchKeyPressResult, setSearchKeyPressResult] = useState('');
    const [showFilters, setShowFilters] = useState({
        team_id: undefined,
        status: undefined,
        onboarding_date_from: undefined,
        onboarding_date_to: undefined,
    });
    const [filterState, dispatchFilter] = useReducer(reducer, initialState);
    const {
        refetch: refetch,
        data: members = [],
        isLoading: membersIsLoading,
    } = useFilterMembers({
        query: {
            ...filterState,
        },
        options: {
            orderBy: filterState.orderBy,
        },
    });

    useEffect(() => {
        refetch();
    }, [filterState]);

    useEffect(() => {
        if (searchKeyPressResult === 'Enter') {
            dispatchFilter({
                type: 'setSearch',
                search_term: searchInputValue,
            });
        }
    }, [searchKeyPressResult]);

    useEffect(() => {
        if (searchInputValue === '') {
            dispatchFilter({ type: 'setSearch', search: undefined });
        }
    }, [searchInputValue]);

    const { data: teamsData = [] } = useOrganizationTeams();

    const onPressEnterInSearch = (event: any) => {
        setSearchKeyPressResult(event.key);
    };

    const searchMembers = (value: string) => {
        setSearchInputValue(value);
    };

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.firstPart}>
                    <div className={styles.sortWrapper}>
                        <span className={styles.sortText}>Sort by:</span>
                        <SortDropDown
                            selectedOption={filterState}
                            onChange={dispatchFilter}
                            options={[
                                { label: 'First name', value: 'first_name' },
                                { label: 'Last name', value: 'last_name' },
                                {
                                    label: 'Onboarding date',
                                    value: 'onboarding_date',
                                },
                                { label: 'Team', value: 'team' },
                            ]}
                            orderOptions={[
                                { label: 'Ascending', value: 'asc' },
                                { label: 'Descending', value: 'desc' },
                            ]}
                        />
                    </div>
                </div>
                <div className={styles.secondPart}>
                    <div className={styles.searchWrapper}>
                        <SearchInput
                            onKeyPress={onPressEnterInSearch}
                            className='w-full'
                            value={searchInputValue}
                            setValue={searchMembers}
                        />
                    </div>
                    <div className={styles.filterIcon}>
                        <FilterDropDown
                            selectedOption={filterState}
                            onChange={dispatchFilter}
                            teams={teamsData}
                            setShowFilters={setShowFilters}
                            showFilters={filterState}
                            options={[
                                { label: 'First name', value: 'first_name' },
                                { label: 'Last name', value: 'last_name' },
                                {
                                    label: 'Onboarding date',
                                    value: 'onboarding_date',
                                },
                                { label: 'Team', value: 'team' },
                            ]}
                            orderOptions={[
                                { label: 'Ascending', value: 'asc' },
                                { label: 'Descending', value: 'desc' },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.filterWrapper}>
                {_.map(Object.entries(showFilters), item => {
                    return item[1] ? (
                        <div className={styles.filterItem}>
                            {item[0] !== 'status' && (
                                <img
                                    src={
                                        item[0] === 'team_id'
                                            ? colors[
                                                  Math.floor(Math.random() * 7)
                                              ]
                                            : calendarActive
                                    }
                                    className='mx-9'
                                />
                            )}
                            {item[1]}
                            <img
                                src={greenClose}
                                className='mx-9 cursor-pointer'
                                onClick={() => {
                                    dispatchFilter({
                                        type: 'setFilter',
                                        ...filterState,
                                        [item[0]]: undefined,
                                    });
                                    setShowFilters({
                                        ...showFilters,
                                        [item[0]]: undefined,
                                    });
                                }}
                            />
                        </div>
                    ) : null;
                })}
                {(showFilters.team_id ||
                    showFilters.status ||
                    showFilters.onboarding_date_from ||
                    showFilters.onboarding_date_to) && (
                    <div
                        className={styles.clearButton}
                        onClick={() => {
                            dispatchFilter({
                                type: 'setFilter',
                                team_id: undefined,
                                status: undefined,
                                onboarding_date_from: undefined,
                                onboarding_date_to: undefined,
                            });
                            setShowFilters({
                                team_id: undefined,
                                status: undefined,
                                onboarding_date_from: undefined,
                                onboarding_date_to: undefined,
                            });
                        }}
                    >
                        CLEAR ALL
                    </div>
                )}
            </div>
            {membersIsLoading ? (
                <Spinner
                    className={cn(
                        'h-160',
                        'flex',
                        'items-center',
                        'justify-center'
                    )}
                />
            ) : (
                RenderMembers(members)
            )}
        </div>
    );
};

const RenderMembers = (members: Member[]): JSX.Element => {
    const history = useHistory();
    const editSelectedMember = (id: any) => {
        history.push(routeTo('editMember', { id: id }));
    };
    return (
        <div
            className={styles.itemWrapper}
            style={{ height: 'calc(100vh - 260px)' }}
        >
            <div
                className={styles.addButton}
                style={{ maxWidth: '320px', minWidth: '230px' }}
                onClick={() => history.push(routeTo('addMember'))}
            >
                <PeoplePlus
                    theme='filled'
                    size='42'
                    fill='#01395E'
                    className={styles.imgWrapper}
                />
                <div className={styles.addButtonText}>Add member</div>
            </div>
            {_.map(members, (item, index) => {
                return (
                    <MemberCard
                        data_cy={item.first_name}
                        // onDeleteClick={deleteSelectedMember}
                        onEditClick={editSelectedMember}
                        avatar={item.avatar}
                        firstName={item.first_name}
                        lastName={item.last_name}
                        email={item.email}
                        date={item.onboarding_date}
                        index={index}
                        id={item.id}
                        teams={item.teams}
                    />
                );
            })}
        </div>
    );
};

export default Members;
