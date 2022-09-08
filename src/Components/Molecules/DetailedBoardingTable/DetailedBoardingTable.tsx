import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { RandomColorizedProfileIcon } from 'Components/Atomes/RandomColorizedProfileIcon';
import { OffboardingOnboardingStatusApplier } from 'Components/Atomes/OffboardingOnboardingStatusApplier';
/* modules */
import cn from 'clsx';
import dayJs from 'dayjs';
import { map, last, capitalize } from 'lodash/fp';
import { Member } from 'Hooks/api';
import type { Status as StatusType } from 'Hooks/api';
import { useUpdateToolMember } from 'Hooks/api/tools/useUpdateToolMember';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonDetailedBoardingTableProps = {
    members: Member[];
    type: Member['pivot']['status'];
    toolId: number;
};
export type DetailedBoardingTableProps = Omit<
    ComponentPropsWithoutRef<'table'>,
    keyof CommonDetailedBoardingTableProps
> &
    CommonDetailedBoardingTableProps;

const makeSuccessStatusText = (status: StatusType): string => {
    switch (status) {
        case 'NOT_OFFBOARDED':
            return 'Offboarded';
        case 'NOT_ONBOARDED':
            return 'Onboarded';

        case 'ONBOARDED':
            return 'Onboarded';
        case 'OFFBOARDED':
            return 'Offboarded';
        default:
            return '';
    }
};

const makeStatus = (status: StatusType): StatusType => {
    // eslint-disable-next-line default-case
    switch (status) {
        case 'NOT_OFFBOARDED':
            return 'OFFBOARDED';

        case 'NOT_ONBOARDED':
            return 'ONBOARDED';

        case 'OFFBOARDED':
            return 'NOT_OFFBOARDED';

        case 'ONBOARDED':
            return 'NOT_ONBOARDED';
    }
};
export const DetailedBoardingTable: FC<DetailedBoardingTableProps> = ({
    className,
    members,
    toolId,
    type,
    ...restProps
}) => {
    const {
        mutate: updateToolMember,
        isLoading: updateToolMemberIsLoading,
    } = useUpdateToolMember();

    const handleChangeStatus = (
        memberId: number,
        currentStatus: StatusType
    ) => {
        const newStatus = makeStatus(currentStatus);
        updateToolMember({ member_ids: [memberId], toolId, status: newStatus });
    };

    const teamMemberNormalizer = (member: Member) => {
        const name = `${capitalize(member.first_name)} ${capitalize(
            member.last_name
        )}`;
        const position = member?.position || member?.pivot?.position || '-';
        const team = capitalize(last(member?.teams)?.name!) || '';
        const date = dayJs(new Date(member?.pivot?.boarding_date)).format(
            'YYYY-MM-DD'
        );

        const status = (
            <OffboardingOnboardingStatusApplier
                onPendingClick={(): void | boolean => {
                    /* Do not make api call if the user is already in pending state */

                    if (
                        member?.pivot?.status === 'NOT_ONBOARDED' ||
                        member?.pivot?.status === 'NOT_OFFBOARDED'
                    ) {
                        return false;
                    }
                    handleChangeStatus(member.id, member?.pivot?.status);
                }}
                onBoardingClick={(): void | boolean => {
                    /* Do not make api call if the user is already onboarded or offboarded */
                    if (
                        member?.pivot?.status === 'ONBOARDED' ||
                        member?.pivot?.status === 'OFFBOARDED'
                    ) {
                        return false;
                    }
                    handleChangeStatus(member.id, member?.pivot?.status);
                }}
                status={member?.pivot?.status}
                isPending={
                    member?.pivot?.status === 'NOT_ONBOARDED' ||
                    member?.pivot?.status === 'NOT_OFFBOARDED'
                }
                boardedText={makeSuccessStatusText(member?.pivot?.status)}
            />
        );

        /* If the user is already offboarded or onboarded show a green check mark on their profile image */
        const isChecked =
            member?.pivot?.status === 'OFFBOARDED' ||
            member?.pivot?.status === 'ONBOARDED';

        const profileIcon = (
            <RandomColorizedProfileIcon isChecked={isChecked} />
        );
        return { name, position, team, date, status, profileIcon };
    };

    const data = map<Member, JSX.Element>(member => {
        const {
            date,
            name,
            position,
            profileIcon,
            status,
            team,
        } = teamMemberNormalizer(member);
        return (
            <div className={styles.row}>
                <div className={styles.avatarRow}>{profileIcon}</div>
                <div className={styles.rowItem}>{name}</div>
                <div className={styles.rowItem}>{position}</div>
                <div className={styles.rowItem}>{team}</div>
                <div className={styles.rowItem}>{date}</div>
                <div className={styles.rowItem}>{status}</div>
            </div>
        );
    })(members);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <div className={styles.avatarHeader} />
                <div className={styles.headerItem}>Name</div>
                <div className={styles.headerItem}>Position</div>
                <div className={styles.headerItem}>Team</div>
                <div className={styles.headerItem}>Date</div>
                <div className={styles.headerItem}>Status</div>
            </div>
            {data}
        </div>
    );
};
