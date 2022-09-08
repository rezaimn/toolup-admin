import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
/* components */
import { SelectedMembersWithTeamId } from 'Components/Organisms/AddMembersToTeams';
/* modules */
import cn from 'clsx';
import { Member } from 'Hooks/api';
import {
    concat,
    join,
    pipe,
    reverse,
    gt,
    capitalize,
    isEqual,
    lowerCase,
} from 'lodash/fp';
import dayJs from 'dayjs';
import { useDrag } from 'react-dnd';
/* helpers */
/* constants */
import { DndTypes } from 'Constants/DndTypes';
/* assets */
import MemberAvatarPlaceholder from 'assets/icons/member-placeholder.svg';
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonSelectableMemberCardProps = {
    member: Member;
    isSelected: boolean;
    onSelect: (memberId: number, teamId: number, isSelected: boolean) => void;
    selectedMembers: SelectedMembersWithTeamId[];
};
export type SelectableMemberCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSelectableMemberCardProps
> &
    CommonSelectableMemberCardProps;

export const SelectableMemberCard: FC<SelectableMemberCardProps> = ({
    className,
    member,
    onSelect,
    isSelected,
    selectedMembers,
    ...restProps
}) => {
    const [isSelectedState, setIsSelectedState] = useState(isSelected);

    useEffect(() => {
        const lastTeam = member?.teams as any;

        const isGeneral = isEqual('general')(
            lowerCase(lastTeam?.name as string)
        );

        if (isGeneral) {
            onSelect(member?.id, 0, isSelectedState);
            return;
        }

        onSelect(member?.id, lastTeam?.id as number, isSelectedState);
    }, [isSelectedState]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setIsSelectedState(e.target.checked);
    };

    const [, drag] = useDrag({
        canDrag: () => isSelected,
        item: {
            type: DndTypes.MEMBER,
            item: {
                id: member.id,
                name: member.last_name,
                avatar: member.avatar,
            },
        },
        collect: monitor => {
            return { isDragging: !!monitor.isDragging() };
        },
    });

    const handleOnBodyClick = () => {
        if (isSelectedState) {
            setIsSelectedState(false);
            return;
        }
        setIsSelectedState(true);
    };

    return (
        <div
            ref={drag}
            id="member-card"
            data-cy={`member-card-${member.id}`}
            className={cn(className, styles.member, {
                [styles.selected]: isSelected,
            })}
            onClick={handleOnBodyClick}
            aria-hidden
        >
            <img
                alt={member?.email}
                className={styles.avatar}
                src={member.avatar || MemberAvatarPlaceholder}
            />
            <p className={cn(styles.text)}>{name(member)}</p>
            <p className={cn(styles.text)}>{email(member)}</p>
            <p className={cn(styles.text)}>Onboarding {boardingDate(member)}</p>

            <input
                className={styles.checkbox}
                type='checkbox'
                onChange={handleSelect}
                checked={isSelected}
                /* key={JSON.stringify(selectedMembers)} */
            />
        </div>
    );
};

function name(m: Member): string {
    const concatenated = pipe(
        concat(capitalize(m.first_name)),
        concat(capitalize(m.last_name)),
        reverse,
        join(' ')
    )([]);

    if (gt(concatenated.length)(1)) {
        return concatenated;
    }

    return 'No Name Defined';
}

function email(m: Member): string {
    if (m.email) {
        return m.email;
    }
    return 'No Email Provided!';
}

function boardingDate(m: Member): string {
    const date = dayJs(new Date(m.onboarding_date));
    const isValidDate = date.isValid();

    if (isValidDate) {
        return date.format('YYYY-MM-DD');
    }
    return 'Invalid Date!';
}
