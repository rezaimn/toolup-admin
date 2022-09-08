import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { CompanyTeamListItem } from 'Components/Molecules/CompanyTeamListItem';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { Spinner } from 'Components/Atomes/Spinner';
/* modules */
import { TeamHttpResponse } from 'Hooks/api';
import cn from 'clsx';
import { isEqual, map, filter, lowerCase, negate } from 'lodash/fp';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonCompanyTeamListProps = {
    teams?: TeamHttpResponse[];
    currentTeamId?: number;
    loading?: boolean;
    onTeamSelect: (teamId: number) => void;
    selectedTeamId: number;
};
export type CompanyTeamListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonCompanyTeamListProps
> &
    CommonCompanyTeamListProps;

export const CompanyTeamList: FC<CompanyTeamListProps> = ({
    className,
    teams,
    loading = false,
    currentTeamId,
    onTeamSelect,
    selectedTeamId,
    ...restProps
}) => {
    const sanitized = filter<TeamHttpResponse>(t =>
        negate(isEqual('general'))(lowerCase(t.name))
    )(teams);

    const list = map<TeamHttpResponse, JSX.Element>(team => (
        <div className={styles.item} key={team?.id?.toString()}>
            <CompanyTeamListItem
                onClick={() => onTeamSelect(team?.id)}
                isCurrent={isEqual(currentTeamId)(team?.id)}
                id={team?.id}
                membersCount={team?.members_count}
                name={team?.name}
                selectedTeamId={selectedTeamId}
            />
        </div>
    ))(sanitized);

    const shouldRenderEmptySignCard = sanitized?.length === 0;

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
        <div className={cn(className)}>
            <div className={styles.titleSection}>
                <p className={styles.title}>Company&apos;s teams</p>
                <p className={styles.description}>
                    {buildTeamCount(sanitized?.length)}
                </p>
            </div>

            {!shouldRenderEmptySignCard && (
                <div className={styles.list}>{list}</div>
            )}

            {shouldRenderEmptySignCard && (
                <EmptyCardSign className='mt-30' title='No teams found' />
            )}
        </div>
    );
};

const buildTeamCount = (count: number | undefined) => {
    switch (count) {
        case 0:
            return 'No teams';
        case 1:
            return '1 team';

        default:
            return `${count} teams`;
    }
};
