import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Tool } from 'Hooks/api';
/* helpers */
/* assets */
import ToolImagePlaceholderIcon from 'assets/icons/tool-image-placeholder.svg';

/* styles */
/* types */
export type CommonDashboardToolsSidebarItemProps = {
    collapsed: boolean;
} & Tool;
export type DashboardToolsSidebarItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardToolsSidebarItemProps
> &
    CommonDashboardToolsSidebarItemProps;

export const DashboardToolsSidebarItem: FC<DashboardToolsSidebarItemProps> = ({
    className,
    icon,
    name,
    collapsed,
    url,
    ...restProps
}) => {
    return (
        <a
            rel='noreferrer'
            href={url}
            target='_blank'
            className={cn(
                className,
                'flex',
                'justify-center',
                'items-center',
                'flex-col',
                'mb-30',
                { 'w-1/3': !collapsed },
                { 'w-full': collapsed }
            )}
            title={name}
        >
            <img
                className={cn('h-40', 'w-40', 'shadow-md', 'rounded-lg')}
                src={icon || ToolImagePlaceholderIcon}
                alt={name}
            />
            <p
                className={cn(
                    'text-black',
                    'font-xs',
                    'mt-5',
                    'truncate',
                    'w-80',
                    'text-center'
                )}
            >
                {name}
            </p>
        </a>
    );
};
