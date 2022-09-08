import { ComponentPropsWithoutRef, FC, useState, useEffect, memo } from 'react';
/* components */
import { SelectableMemberCardList } from 'Components/Organisms/SelectableMemberCardList';
import { CheckFilterDropdown } from 'Components/Molecules/CheckFilterDropdown';
/* modules */
import cn from 'clsx';
import { Member } from 'Hooks/api';
import { filter, includes, isEqual, map, negate as not, pipe } from 'lodash/fp';
import { SelectedMembersWithTeamId } from 'Components/Organisms/AddMembersToTeams';
/* helpers */
/* assets */
import { closeIcon } from 'assets/icons';
/* styles */
import styles from './styles.module.scss';

/* types */
type TGroupedMembers = {
    teamName: string;
    members: Member[];
};

export type CommonGroupedMembersProps = {
    data: TGroupedMembers[];
    isDeletable?: boolean;
    onSelect: (selectedMembers: SelectedMembersWithTeamId[]) => void;
    selectedMembers: SelectedMembersWithTeamId[];
    withPositionFilter?: boolean;
};

export type GroupedMembersProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonGroupedMembersProps
> &
    CommonGroupedMembersProps;

export const GroupedMembers: FC<GroupedMembersProps> = memo(
    ({
        className,
        data,
        isDeletable = true,
        onSelect,
        selectedMembers,
        withPositionFilter = true,
        ...restProps
    }) => {
        const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

        useEffect(() => {
            setSelectedTeams(pickFilterItems(data));
        }, [data]);

        const handleOnSelect = (members: SelectedMembersWithTeamId[]) => {
            onSelect(members);
        };

        const handleOnChangeSelectedPosition = (
            isSelected: boolean,
            selected: string
        ) => {
            if (isSelected) {
                setSelectedTeams(prev => [...prev, selected]);
                return;
            }
            setSelectedTeams(filter(not(isEqual(selected)))(selectedTeams));
        };

        const handleClickRemove = (team: string) => () => {
            setSelectedTeams(filter(not(isEqual(team)))(selectedTeams));
        };

        function render(group: TGroupedMembers) {
            return (
                <div className={styles.group}>
                    <div className='flex items-center space-x-5'>
                        {isDeletable && (
                            <span
                                className='w-10 h-10 cursor-pointer'
                                onClick={handleClickRemove(group.teamName)}
                                aria-hidden
                            >
                                <img
                                    src={closeIcon}
                                    alt='ci'
                                    className='w-12 h-12 rounded-full'
                                />
                            </span>
                        )}

                        <p className={styles.title}>{group.teamName}</p>
                    </div>

                    <SelectableMemberCardList
                        onSelect={handleOnSelect}
                        members={group.members}
                        selectedMembers={selectedMembers}
                    />
                </div>
            );
        }

        const r = pipe(
            filterDataByTeamName(selectedTeams),
            map<TGroupedMembers, JSX.Element>(render)
        );

        return (
            <div className={cn(className, 'w-full', 'mb-30')}>
                {renderPositionFilter()}
                {r(data)}
            </div>
        );

        function filterDataByTeamName(teamNames: string[]) {
            return filter<TGroupedMembers>(i =>
                includes(i.teamName)(teamNames)
            );
        }

        function renderPositionFilter(): JSX.Element | undefined {
            if (withPositionFilter) {
                return (
                    <CheckFilterDropdown
                        items={pickFilterItems(data)}
                        onChange={handleOnChangeSelectedPosition}
                        defaultSelectedItems={pickFilterItems(data)}
                        selectedItems={selectedTeams}
                        title='Team Filter'
                    />
                );
            }
            return undefined;
        }
    }
);

const pickFilterItems = map<TGroupedMembers, string>(gm => gm.teamName);
