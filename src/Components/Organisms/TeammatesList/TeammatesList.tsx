import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { RandomColorizedProfileIcon } from 'Components/Atomes/RandomColorizedProfileIcon';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { Spinner } from 'Components/Atomes/Spinner';
/* modules */
import cn from 'clsx';
import { TeamMember, User } from 'Hooks/api';
import { capitalize, isEqual, map } from 'lodash/fp';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonTeammatesListProps = {
    members: TeamMember[];
    loading?: boolean;
    title: string;
    user: User;
};
export type TeammatesListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeammatesListProps
> &
    CommonTeammatesListProps;

export const TeammatesList: FC<TeammatesListProps> = ({
    className,
    members = [],
    loading = false,
    title,
    user,
    ...restProps
}) => {
    const list = map<TeamMember, JSX.Element>(member => {
        if (isEqual(user.id)(member.id)) {
            return (
                <div className={styles.item} key={member.id.toString()}>
                    <div>
                        <RandomColorizedProfileIcon />
                    </div>
                    <div className={styles.property}>You</div>
                    <div className={styles.property}>
                        {capitalize(member.position) || '-'}
                    </div>
                    <div className={styles.property}>{member.email}</div>
                </div>
            );
        }

        return (
            <div className={styles.item} key={member.id.toString()}>
                <div>
                    <RandomColorizedProfileIcon />
                </div>
                <div className={styles.property}>
                    {capitalize(member.first_name)}{' '}
                    {capitalize(member.last_name)}
                </div>
                <div className={styles.property}>
                    {capitalize(member.position) || '-'}
                </div>
                <div className={styles.property}>{member.email}</div>
            </div>
        );
    })(members);

    const shouldRenderEmptySignCard = members?.length === 0 && !loading;

    if (loading) {
        return (
            <div className={cn(className, styles.temmatesList)}>
                <div className={styles.titleSection} />
                <div className={styles.centered}>
                    <Spinner />
                </div>
            </div>
        );
    }
    return (
        <div
            className={cn(className, styles.temmatesList, {
                [styles.centered]: shouldRenderEmptySignCard,
            })}
        >
            <div className={styles.titleSection}>
                {!shouldRenderEmptySignCard && (
                    <p className={styles.title}>{title}</p>
                )}
                {!shouldRenderEmptySignCard && (
                    <p className={styles.description}>
                        {makeMembersCount(members?.length)}
                    </p>
                )}
            </div>

            {!shouldRenderEmptySignCard && (
                <div className={styles.list}>{list}</div>
            )}

            {shouldRenderEmptySignCard && (
                <EmptyCardSign className='mt-30' title='No teammates found' />
            )}
        </div>
    );
};

const makeMembersCount = (count: number | undefined) => {
    switch (count) {
        case 0:
            return 'No members';
        case 1:
            return '1 member';

        default:
            return `${count} members`;
    }
};
