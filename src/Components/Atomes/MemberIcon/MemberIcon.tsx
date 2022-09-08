import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
import MemberIconSvg from 'assets/icons/boarding-member-badge.svg';
import DeactiveMemberIcon from 'assets/icons/boarding-member-gray.svg';
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonMemberIconProps = {
    badge: number;
};
export type MemberIconProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonMemberIconProps
> &
    CommonMemberIconProps;

export const MemberIcon: FC<MemberIconProps> = ({ badge, className }) => {
    const src = badge <= 0 ? DeactiveMemberIcon : MemberIconSvg;

    return (
        <div className={cn(className, styles.membersIcon)}>
            <img
                src={src}
                className={styles.membersIconImage}
                alt='Member icon'
            />
            {Boolean(badge) && (
                <div className={styles.memberIconBadge}>{badge}</div>
            )}
        </div>
    );
};
