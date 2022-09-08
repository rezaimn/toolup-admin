import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
import { ReactComponent as EmptyCardSignIcon } from 'assets/icons/empty-sign.svg';
/* styles */
/* types */
export type CommonEmptyCardSignProps = {
    title?: string;
    leanTitle?: string;
    showMainTitle?: boolean;
    subtitle?: string;
};
export type EmptyCardSignProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonEmptyCardSignProps
> &
    CommonEmptyCardSignProps;

export const EmptyCardSign: FC<EmptyCardSignProps> = ({
    className,
    title,
    leanTitle,
    showMainTitle = true,
    subtitle,
    ...restProps
}) => {
    return (
        <div className={cn(className, 'flex', 'flex-col', 'items-center')}>
            <EmptyCardSignIcon className={cn('opacity-50')} />
            <p className={cn('text-gray-300', 'mt-20', 'text-base')}>
                {showMainTitle ? (
                    <div className={cn('text-center', 'font-bold')}>
                        {title}
                        <p className={cn('text-gray-600', 'mt-10')}>
                            {subtitle}
                        </p>
                    </div>
                ) : (
                    leanTitle
                )}
            </p>
        </div>
    );
};
