import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
import { lowerCase } from 'lodash/fp';
/* assets */
/* styles */
import s from './styles.module.scss';
/* types */
type Status = 'Trend' | 'Recommended' | 'New' | '';

export type Tool = {
    status?: Status;
    name: string;
    icon: string;
};
export type CommonDashboardSuggestedToolItemProps = Tool;
export type DashboardSuggestedToolItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardSuggestedToolItemProps
> &
    CommonDashboardSuggestedToolItemProps;

export const DashboardSuggestedToolItem: FC<DashboardSuggestedToolItemProps> = ({
    className,
    name,
    status = '',
    icon: Icon,
    ...restProps
}) => {
    return (
        <div
            className={cn(
                className,
                'px-10',
                'py-7',
                'rounded-md',
                'flex',
                'justify-center',
                'flex-col',
                'items-center',
                'overflow-hiden',
                'h-full',
                s.card
            )}
        >
            {status && (
                <div
                    className={cn(
                        s.status,
                        'font-bold',
                        s[`status--${status?.toLowerCase()}`]
                    )}
                >
                    {status}
                </div>
            )}

            <img
                src={Icon}
                className={cn('w-30', '2xl:w-40', 'mt-20', 'rounded-lg', s.img)}
                alt={name}
            />

            <div
                className={cn('text-center', '2xl:text-18', 'text-12', 'mt-15')}
            >
                <p className={cn('')}>{name}</p>
            </div>
        </div>
    );
};
