import { FC, useEffect } from 'react';
/* components */
import { AccordionProps } from '@material-ui/core/Accordion';
import { Spinner } from 'Components/Atomes/Spinner';
import { Switch } from 'Components/Atomes/Switch';
import { DetailedBoardingTable } from 'Components/Molecules/DetailedBoardingTable';
/* modules */
import cn from 'clsx';
import {
    BoardingTool,
    Member,
    useToolMembers,
    useUpdateToolMember,
} from 'Hooks/api';
import { FilterOnboardingOffboardingState } from 'Pages/OnbaordingOffboarding/OnbaordingOffboarding';
import dayJs from 'dayjs';
/* helpers */
import { every, filter, isEqual, merge, omit, pipe, uniqBy } from 'lodash/fp';
/* assets */
import { ReactComponent as ToolsSidebarToggler } from 'assets/icons/chevron-left.svg';
import ToolImagePlaceholderIcon from 'assets/icons/tool-image-placeholder.svg';

/* styles */
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ToolImage,
    PendingsCountIcon,
} from './internals';
import { EmptyCardSign } from '../EmptyCardSign';

/* types */
export type BoardingAccordionItemProps = Omit<AccordionProps, 'children'> & {
    tool: BoardingTool;
    filterPayload: FilterOnboardingOffboardingState;
};

export const BoardingAccordionItem: FC<BoardingAccordionItemProps> = ({
    expanded,
    tool,
    filterPayload,
    ...props
}) => {
    const today = dayJs(new Date()).format('YYYY-MM-DD');
    const {
        data: boardingMembers = [],
        refetch: refetchBoardingMembers,
        isFetching: boardingMembersIsLoading,
        isIdle,
    } = useToolMembers(
        tool.id,
        pipe(
            omit('search_term'),
            merge({
                tool_status: ['NOT_ONBOARDED', 'NOT_OFFBOARDED'],
                boarding_date_to: today,
            })
        )(filterPayload),
        {
            enabled: expanded,
            refetchOnMount: false,
        }
    );

    const {
        data: todayBoardingMembers = [],
        refetch: refetchTodayBoardingMembers,
        isFetching: todayBoardingMembersIsLoading,
    } = useToolMembers(
        tool.id,
        pipe(
            omit('search_term'),
            merge({
                tool_status: ['ONBOARDED', 'OFFBOARDED'],
                boarding_date_from: today,
                boarding_date_to: today,
            })
        )(filterPayload),
        {
            enabled: expanded,
            refetchOnMount: false,
        }
    );

    const toolMembers = pipe(uniqBy('id'))([
        ...boardingMembers,
        ...todayBoardingMembers,
    ]);

    const toolMembersIsLoading =
        boardingMembersIsLoading && todayBoardingMembersIsLoading;

    const refetch = () => {
        refetchBoardingMembers();
        refetchTodayBoardingMembers();
    };

    const filterOnboarding = (member: Member) =>
        isEqual('NOT_ONBOARDED')(member?.pivot?.status) ||
        isEqual('ONBOARDED')(member?.pivot?.status);

    const filterOffboarding = (member: Member) =>
        member?.pivot?.status === 'NOT_OFFBOARDED' ||
        member?.pivot?.status === 'OFFBOARDED';

    const OnBoardedNotOnBoardedMembers = filter<Member>(filterOnboarding)(
        toolMembers
    );

    const OffBoardedNotOffBoardedMembers = filter(filterOffboarding)(
        toolMembers
    );

    const offboardingCount = filter((member: Member) =>
        isEqual('NOT_OFFBOARDED')(member?.pivot?.status)
    )(toolMembers);

    const onboardingCount = filter((member: Member) =>
        isEqual('NOT_ONBOARDED')(member?.pivot?.status)
    )(toolMembers);

    const {
        mutate: updateToolMember,
        isLoading: updateToolMemberIsLoading,
    } = useUpdateToolMember();

    /* useEffect(() => {
        if (!isIdle) {
            refetch();
        }
    }, [filterPayload]); */

    const handleAllOffboardeSwitch = (checked: boolean) => {
        const offboardings = filter(
            (member: Member) =>
                isEqual('NOT_OFFBOARDED')(member?.pivot?.status) ||
                isEqual('OFFBOARDED')(member?.pivot?.status)
        )(toolMembers);

        const offboardingIds = offboardings.map(o => o.id);
        if (checked) {
            updateToolMember({
                member_ids: offboardingIds,
                toolId: tool.id,
                status: 'OFFBOARDED',
            });
        } else {
            updateToolMember({
                member_ids: offboardingIds,
                toolId: tool.id,
                status: 'NOT_OFFBOARDED',
            });
        }
    };
    const makeCount = (count: number) => {
        if (count === 0) {
            return `No members are`;
        }
        if (count === 1) {
            return `${count} member is`;
        }
        return `${count} members are`;
    };
    return (
        <Accordion square expanded={expanded} {...props}>
            <AccordionSummary>
                <ToolImage src={tool.icon || ToolImagePlaceholderIcon} />
                <p className={cn('ml-10', 'font-bold')}>{tool.name}</p>
                <ToolsSidebarToggler
                    className={cn(
                        'transform',
                        { 'rotate-90 opacity-50': !expanded },
                        { '-rotate-90': expanded },
                        'h-15',
                        'w-15',
                        'ml-10'
                    )}
                />
                <p
                    className={cn(
                        'font-bold',
                        'text-gray-400',
                        'ml-auto',
                        'text-14'
                    )}
                >
                    {makeCount(tool?.boarding_count)} pending to onboard or
                    offboard
                </p>
            </AccordionSummary>

            {toolMembersIsLoading && (
                <Spinner className={cn('block', 'mx-auto', 'w-25', 'py-10')} />
            )}

            {!toolMembersIsLoading && (
                <AccordionDetails>
                    <div
                        className={cn(
                            'flex',
                            'bg-blue-50',
                            'p-20',
                            'rounded-lg'
                        )}
                    >
                        <p
                            className={cn(
                                'text-base',
                                'font-bold',
                                'text-primary'
                            )}
                        >
                            Onboarding
                        </p>
                        {Boolean(OnBoardedNotOnBoardedMembers.length) && (
                            <PendingsCountIcon
                                className='ml-20'
                                count={onboardingCount?.length}
                            />
                        )}
                    </div>

                    {Boolean(OnBoardedNotOnBoardedMembers.length) && (
                        <DetailedBoardingTable
                            className={cn('mt-15')}
                            members={OnBoardedNotOnBoardedMembers}
                            type='NOT_ONBOARDED'
                            toolId={tool.id}
                        />
                    )}

                    {!Boolean(OnBoardedNotOnBoardedMembers.length) && (
                        <EmptyCardSign
                            className='mt-20'
                            title='There are no members'
                        />
                    )}

                    <div
                        className={cn(
                            'flex',
                            'bg-blue-50',
                            'p-20',
                            'rounded-lg',
                            'mt-30',
                            'justify-between'
                        )}
                    >
                        <div className={cn('flex')}>
                            <p
                                className={cn(
                                    'text-base',
                                    'font-bold',
                                    'text-primary'
                                )}
                            >
                                Offboarding
                            </p>

                            {Boolean(OffBoardedNotOffBoardedMembers.length) && (
                                <PendingsCountIcon
                                    className='ml-20'
                                    count={offboardingCount?.length}
                                />
                            )}
                        </div>
                        {Boolean(OffBoardedNotOffBoardedMembers.length) && (
                            <div className={cn('flex', 'items-center')}>
                                <p
                                    className={cn(
                                        'text-primary',
                                        'text-16',
                                        'font-bold',
                                        'mr-10'
                                    )}
                                >
                                    All offboarded
                                </p>

                                <Switch
                                    id={tool.id?.toString()}
                                    checked={every<Member>(
                                        member =>
                                            member?.pivot?.status !==
                                            'NOT_OFFBOARDED'
                                    )(toolMembers)}
                                    onChange={e =>
                                        handleAllOffboardeSwitch(
                                            e.target.checked
                                        )
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* if there was members available */}
                    {Boolean(OffBoardedNotOffBoardedMembers.length) && (
                        <DetailedBoardingTable
                            className={cn('mt-15')}
                            members={OffBoardedNotOffBoardedMembers}
                            type='NOT_OFFBOARDED'
                            toolId={tool.id}
                        />
                    )}

                    {!Boolean(OffBoardedNotOffBoardedMembers.length) && (
                        <EmptyCardSign
                            className='mt-20'
                            title='There are no members'
                        />
                    )}
                </AccordionDetails>
            )}
        </Accordion>
    );
};
