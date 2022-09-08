import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { capitalize, isEqual } from 'lodash/fp';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonCompanyTeamListItemProps = {
    name: string;
    membersCount: number;
    id: number;
    isCurrent: boolean;
    selectedTeamId: number;
};
export type CompanyTeamListItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonCompanyTeamListItemProps
> &
    CommonCompanyTeamListItemProps;

export const CompanyTeamListItem: FC<CompanyTeamListItemProps> = ({
    className,
    name,
    membersCount,
    id,
    isCurrent,
    selectedTeamId,
    ...restProps
}) => {
    return (
        <div
            className={cn(className, styles.team, {
                [styles.active]: isEqual(id)(selectedTeamId),
            })}
            {...restProps}
        >
            <p className={styles.name}>
                {capitalize(name)}
                {isCurrent && <p className={styles.myTeam}>(your team)</p>}
            </p>
            <p className={styles.membersCount}>
                {buildMembersCount(membersCount)}
            </p>
        </div>
    );
};

const buildMembersCount = (count: number | undefined) => {
    switch (count) {
        case 0:
            return 'No members';
        case 1:
            return '1 member';

        default:
            return `${count} members`;
    }
};
