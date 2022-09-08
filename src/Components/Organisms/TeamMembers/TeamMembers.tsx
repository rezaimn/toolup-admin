import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
} from 'react';
/* components */
/* services */
import { queryClient } from 'Services/ReactQueryService';
/* modules */
import cn from 'clsx';
import { membersWithoutTeamQueryKey } from 'Hooks/api';
import { PopupTemplate } from '../../Templates/PopupTemplate';
import { Team } from '../../../Store/team/models/Team';
import SearchInput from '../../Atomes/SearchInput/SearchInput';
import Button from '../../Atomes/Button/Button';
import {
    deleteIcon,
    whiteDeleteIcon,
    checkboxCheckedIcon,
    checkboxUnCheckedIcon,
} from '../../../assets/icons';
import { TeamMemberWideCard } from '../../Molecules/TeamMemberWideCard';
import { member, team } from '../../Templates/Layout/assets/images';
import {
    useBulkDetachMembersFromTeam,
    useDetachMemberFromTeam,
    useTeamMembers,
} from '../../../Hooks/api/team';

/* helpers */
/* assets */
/* styles */
/* types */
export type CommonTeamMembersProps = {
    team: Team;
};
export type TeamMembersProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeamMembersProps
> &
    CommonTeamMembersProps;

export const TeamMembers: FC<TeamMembersProps> = ({ className, team }) => {
    const [searchText, setSearchText] = useState('');
    const [allChecked, setAllChecked] = useState(false);
    const [readyForDeleteCount, setReadyForDeleteCount] = useState(0);
    const [totalMembers, setTotalMembers] = useState<any>([]);
    const [filteredMembers, setFilteredMembers] = useState<any>([]);

    const { mutate: bulkDetachMembers } = useBulkDetachMembersFromTeam();
    const { data: teamMembers } = useTeamMembers(team.id || 0, {});

    useEffect(() => {
        setTotalMembers(
            teamMembers
                ? teamMembers.map((memberItem: any) => {
                      const tempMember = { ...memberItem };
                      tempMember.isChecked = false;
                      return tempMember;
                  })
                : []
        );
        setFilteredMembers(
            teamMembers
                ? teamMembers.map((memberItem: any) => {
                      const tempMember = { ...memberItem };
                      tempMember.isChecked = false;
                      return tempMember;
                  })
                : []
        );
    }, [teamMembers]);
    const onPressEnterInSearch = (event: any) => {
        if (event.key === 'Enter') {
            setFilteredMembers(
                totalMembers
                    .filter((item: any) => {
                        if (
                            item.first_name
                                .toLowerCase()
                                .includes(searchText.toLowerCase()) ||
                            item.last_name
                                .toLowerCase()
                                .includes(searchText.toLowerCase()) ||
                            item.email
                                .toLowerCase()
                                .includes(searchText.toLowerCase())
                        ) {
                            return item;
                        }
                    })
                    .map((memberItem: any) => {
                        const editedMember = { ...memberItem };
                        editedMember.isChecked = false;
                        return editedMember;
                    })
            );
        }
    };
    const onSearchInputValue = (value: string) => {
        if (value === '') {
            setFilteredMembers([...totalMembers]);
            setAllChecked(false);
        }
        setSearchText(value);
    };
    const detachSelectedMembersFromTeam = () => {
        bulkDetachMembers(
            {
                teamId: team && team.id,
                member_ids:
                    filteredMembers &&
                    filteredMembers
                        .filter((item: any) => item.isChecked)
                        .map((memberItem: any) => memberItem.id),
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(membersWithoutTeamQueryKey);
                    setFilteredMembers(
                        filteredMembers.filter(
                            (memberItem: any) => !memberItem.isChecked
                        )
                    );
                    setTotalMembers(
                        totalMembers.filter((memberItem: any) => {
                            const comparedMember = filteredMembers.find(
                                (item: any) => item.id === memberItem.id
                            );
                            if (comparedMember) {
                                if (!comparedMember.isChecked) {
                                    return memberItem;
                                }
                            } else {
                                return memberItem;
                            }
                        })
                    );
                },
            }
        );
    };
    const memberCheckClicked = (index: number) => {
        if (filteredMembers[index].isChecked) {
            if (readyForDeleteCount < filteredMembers.length + 1) {
                setAllChecked(false);
            }
            setReadyForDeleteCount(readyForDeleteCount - 1);
        } else {
            if (readyForDeleteCount === filteredMembers.length - 1) {
                setAllChecked(true);
            }
            setReadyForDeleteCount(readyForDeleteCount + 1);
        }
        const tempFilteredMembers = [...filteredMembers];
        tempFilteredMembers[index].isChecked = !tempFilteredMembers[index]
            .isChecked;
        setFilteredMembers(tempFilteredMembers);
    };
    const onAllCheckedChange = () => {
        if (allChecked) {
            setReadyForDeleteCount(0);
        } else {
            setReadyForDeleteCount(filteredMembers.length);
        }
        setFilteredMembers(
            filteredMembers
                ? filteredMembers.map((memberItem: any) => {
                      const tempMember = { ...memberItem };
                      tempMember.isChecked = !allChecked;
                      return tempMember;
                  })
                : []
        );
        setAllChecked(!allChecked);
    };

    return (
        <div className={cn(className)}>
            {team && (
                <>
                    <div
                        className={cn('border-l-8  mb-30 -ml-40')}
                        style={{ borderColor: team.color }}
                    >
                        <div className='grid grid-cols-12 gap-40 mt-10 pl-30'>
                            <div className='col-span-3 '>
                                <h4 className='font-bold text-gray-700 mt-10 text-20'>
                                    {team.name}
                                </h4>
                                <h6 className='text-18 text-gray-125 mb-0'>
                                    {teamMembers?.length} members in the team
                                </h6>
                            </div>
                            <div className='col-span-6 '>
                                <SearchInput
                                    onKeyPress={onPressEnterInSearch}
                                    className={cn('w-full h-34 mb-20')}
                                    value={searchText}
                                    setValue={onSearchInputValue}
                                />
                            </div>
                            <div className='col-span-3 '>
                                <Button
                                    className='mt-14 text-12 float-right mr-0'
                                    svg={
                                        readyForDeleteCount > 0
                                            ? whiteDeleteIcon
                                            : deleteIcon
                                    }
                                    onClick={detachSelectedMembersFromTeam}
                                    color={
                                        readyForDeleteCount > 0
                                            ? 'blue'
                                            : 'gray'
                                    }
                                    disabled={readyForDeleteCount <= 0}
                                    text='REMOVE'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-40'>
                        <div className='col-span-3'>
                            <strong className='ml-30 text-16'>Name</strong>
                        </div>
                        <div className='col-span-3'>
                            <strong className={'text-16'}>Email</strong>
                        </div>
                        <div className='col-span-3'>
                            <strong className={'text-16'}>
                                Onboarding Date
                            </strong>
                        </div>
                        <div className='col-span-3 '>
                            <div className='flex float-right mr-16'>
                                <span>
                                    <p className={'text-16'}>Select All</p>
                                </span>
                                <span className='cursor-pointer ml-14'>
                                    <img
                                        src={
                                            allChecked
                                                ? checkboxCheckedIcon
                                                : checkboxUnCheckedIcon
                                        }
                                        alt=''
                                        onClick={onAllCheckedChange}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='overflow-y-auto h-320'>
                        {filteredMembers &&
                            filteredMembers.map(
                                (memberItem: any, index: number) => {
                                    return (
                                        <TeamMemberWideCard
                                            key={`row-${index}`}
                                            member={memberItem}
                                            isSelectable
                                            onCheckClicked={() =>
                                                memberCheckClicked(index)
                                            }
                                        />
                                    );
                                }
                            )}
                    </div>
                </>
            )}
        </div>
    );
};
