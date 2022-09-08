import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonDashboardMemberCardProps = {};
export type DashboardMemberCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardMemberCardProps
> &
    CommonDashboardMemberCardProps;

export const DashboardMemberCard: FC<DashboardMemberCardProps> = ({
    className,
    ...restProps
}) => {
    return <div className={cn(className)}></div>;
};
