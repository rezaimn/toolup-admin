import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { SelectableMemberCard } from 'Components/Molecules/SelectableMemberCard';
/* modules */
import cn from 'clsx';
import { Member } from 'Hooks/api';
import {
    filter,
    includes,
    map,
    isEqual,
    negate as not,
    isEmpty,
} from 'lodash/fp';
import { SelectedMembersWithTeamId } from 'Components/Organisms/AddMembersToTeams';

/* helpers */
import { buildJsxKey } from 'Helpers/buildJsxKey';
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonSelectableMemberCardListProps = {
    members: Member[];
    onSelect: (selectedMembers: SelectedMembersWithTeamId[]) => void;
    selectedMembers: SelectedMembersWithTeamId[];
};

export type SelectableMemberCardListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSelectableMemberCardListProps
> &
    CommonSelectableMemberCardListProps;

export const SelectableMemberCardList: FC<SelectableMemberCardListProps> = ({
    className,
    members,
    onSelect,
    selectedMembers,
    ...restProps
}) => {
    const handleOnSelect = (
        memberId: number,
        teamId: number,
        isSelected: boolean
    ) => {
        if (isSelected) {
            onSelect([...selectedMembers, { memberId, teamId }]);
            return;
        }
        onSelect(
            filter<SelectedMembersWithTeamId>(i =>
                not(isEqual(memberId))(i.memberId)
            )(selectedMembers)
        );
    };

    const fn = map<Member, JSX.Element>(m => {
        let isSelected = false;
        if (isEmpty(selectedMembers)) {
            isSelected = false;
        } else {
            isSelected = includes(m.id)(
                map<SelectedMembersWithTeamId, number>(i => i.memberId)(
                    selectedMembers
                )
            );
        }

        return (
            <div className={styles.item}>
                <SelectableMemberCard
                    key={buildJsxKey(m)}
                    isSelected={isSelected}
                    member={m}
                    onSelect={handleOnSelect}
                    selectedMembers={selectedMembers}
                />
            </div>
        );
    });

    return <div className={cn(className, styles.list)}>{fn(members)}</div>;
};
