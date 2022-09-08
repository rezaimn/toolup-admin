import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Card } from 'Components/Atomes/Card';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { DashboardToolsList } from 'Components/Organisms/DashboardToolsList';
import { Spinner } from 'Components/Atomes/Spinner';
/* modules */
import cn from 'clsx';
import { useBoardingTools, useFilterMembers, Member } from 'Hooks/api';
import { isZero, or } from 'Helpers/fp';
import { pipe, get, negate, cond } from 'lodash/fp';
import dayJs from 'dayjs';
/* helpers */
import { randomMember } from 'Helpers/randomMember';
/* assets */
/* styles */
import styles from './styles.module.scss';

/* types */
export type DashboardOnboardingCardProps = ComponentPropsWithoutRef<'div'>;
const today = dayJs(new Date()).format('YYYY-MM-DD');

export const DashboardOnboardingCard: FC<DashboardOnboardingCardProps> = ({
    className,
    ...restProps
}) => {
    const { data: tools = [], isFetching: toolsIsLoading } = useBoardingTools({
        member_tools_status: 'NOT_ONBOARDED',
    });

    const {
        data: members = [],
        isFetching: membersIsLoading,
    } = useFilterMembers({
        query: {
            status: 'NOT_ONBOARDED',
            onboarding_date_to: today,
            onboarding_date_from: today,
        },
    });

    const member = randomMember(members) as Member;
    const MEMBERS_LENGTH = members.length - 1;

    const someGoingToBeOnboarded = pipe(get('length'), negate(isZero));

    const nonGoingToBeOnboarded = negate(someGoingToBeOnboarded);

    const text = cond<Member[], string>([
        [someGoingToBeOnboarded, () => buildText(member, MEMBERS_LENGTH)],
        [
            nonGoingToBeOnboarded,
            () => `No members are going to be onboarded today.`,
        ],
    ])(members);

    // const text = `${member}`
    if (
        or(
            () => toolsIsLoading,
            () => membersIsLoading
        )
    ) {
        return (
            <Card
                className={cn(className, styles.wrapperCard)}
                title='Onboarding'
                text=''
            >
                <div className={cn('flex', 'items-center', 'justify-center')}>
                    <p className='mt-20'>
                        <Spinner />
                    </p>
                </div>
            </Card>
        );
    }

    if (noToolsAvailable(tools)) {
        return (
            <Card
                className={cn(className, styles.wrapperCard)}
                title='Onboarding'
                text=''
            >
                <EmptyContent />
            </Card>
        );
    }
    return (
        <Card
            className={cn(className, styles.wrapperCard)}
            title='Onboarding'
            text={text}
        >
            <DashboardToolsList tools={tools} />
        </Card>
    );
};

const EmptyContent = (): JSX.Element => {
    return (
        <div className={styles.emptyContent}>
            <EmptyCardSign title='No Tools found' />
        </div>
    );
};

const noToolsAvailable = pipe(get('length'), isZero);

const buildText = (member: Member, length: number): string => {
    switch (length) {
        case 0:
            return `${member?.first_name} ${member?.last_name} is going to be onboarded today.`;

        case 1:
            return `${member?.first_name} ${member?.last_name} and 1 more new member are going to be onboarded today.`;

        default:
            return `${member?.first_name} ${member?.last_name} and ${length} more new members are going to be onboarded today.`;
    }
};
