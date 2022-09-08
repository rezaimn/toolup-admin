import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { DashboardToolsListItem } from 'Components/Molecules/DashboardToolsListItem';
/* modules */
import cn from 'clsx';
import { map, pipe, slice, orderBy, gt, get } from 'lodash/fp';
import { BoardingTool } from 'Hooks/api';
import { Link } from 'react-router-dom';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
/* assets */
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonDashboardToolsListProps = {
    tools: BoardingTool[];
};
export type DashboardToolsListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardToolsListProps
> &
    CommonDashboardToolsListProps;

export const DashboardToolsList: FC<DashboardToolsListProps> = ({
    className,
    tools,
    ...restProps
}) => {
    const SHOW_COUNT = 7;

    const TOOLS_COUNT = tools?.length - 7;

    const renderedTools = pipe(
        orderBy<BoardingTool>('boarding_count', 'desc'),
        slice(0, SHOW_COUNT),
        map<BoardingTool, JSX.Element>(tool => (
            <Link
                to={routeTo('onboardingOffboarding', {}, { expanded: tool.id })}
                className={s.item}
            >
                <DashboardToolsListItem tool={tool} />
            </Link>
        ))
    )(tools);

    const mustShowAllCountItem = gt(tools.length)(SHOW_COUNT);

    const allCountItem = (
        <Link className={s.item} to={routeTo('onboardingOffboarding')}>
            <DashboardToolsListItem text='Other tools' count={TOOLS_COUNT} />
        </Link>
    );

    return (
        <div className={cn(className, s.list)}>
            {renderedTools}
            {mustShowAllCountItem && allCountItem}
        </div>
    );
};
