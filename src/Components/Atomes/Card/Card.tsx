import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Link } from 'react-router-dom';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
/* assets */
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonCardProps = {
    title?: string;
    text?: string;
};
export type CardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonCardProps
> &
    CommonCardProps;

export const Card: FC<CardProps> = ({
    className,
    title,
    children,
    text,
    ...restProps
}) => {
    return (
        <div className={cn(className, s.card)} {...restProps}>
            {title && (
                <Link to={routeTo('onboardingOffboarding')}>
                    <h2 className={s.title}>{title}</h2>
                </Link>
            )}
            {text && <p className={s.text}>{text}</p>}

            <div>{children}</div>
        </div>
    );
};
