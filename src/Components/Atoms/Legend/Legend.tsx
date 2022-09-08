import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonLegendProps = {
    title: string;
};
export type LegendProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonLegendProps
> &
    CommonLegendProps;

export const Legend: FC<LegendProps> = ({
    className,
    title,
    children,
    ...restProps
}) => {
    return (
        <div className={cn(className, s.legend)} {...restProps}>
            <p className={s.title}>{title}</p>
            {children}
        </div>
    );
};
