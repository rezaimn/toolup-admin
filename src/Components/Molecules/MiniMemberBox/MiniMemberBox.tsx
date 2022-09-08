import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { TeamMember } from 'Hooks/api';
/* helpers */
import { capitalize, concat, pipe, reverse, join, gt } from 'lodash/fp';
/* assets */
import MemberAvatarPlaceholder from 'assets/icons/member-placeholder.svg';
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonMiniMemberBoxProps = {
    member: TeamMember;
};
export type MiniMemberBoxProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonMiniMemberBoxProps
> &
    CommonMiniMemberBoxProps;

export const MiniMemberBox: FC<MiniMemberBoxProps> = ({
    className,
    member,
    ...restProps
}) => {
    return (
        <div className={cn(className, styles.member)} title={name(member)} data-cy={`member-card-${member.id}`} >
            <img
                className={styles.avatar}
                alt={member.email}
                src={member.avatar || MemberAvatarPlaceholder}
            />
            <p className={styles.name}>{name(member)}</p>
        </div>
    );
};

function name(m: TeamMember): string {
    const concatinated = pipe(
        concat(capitalize(m.first_name)),
        concat(capitalize(m.last_name)),
        reverse,
        join(' ')
    )([]);

    if (gt(concatinated.length)(1)) {
        return concatinated;
    }

    return 'No Name Defined';
}
