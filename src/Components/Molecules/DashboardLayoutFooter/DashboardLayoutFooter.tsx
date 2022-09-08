import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
import ToolUpFooterIcon from 'assets/icons/toolup-footer.png';
import BetaTag from 'assets/icons/beta-tag.png';
import LinkedInIcon from 'assets/icons/linkedin.png';
import MobileIcon from 'assets/icons/mobile.png';
import TwitterIcon from 'assets/icons/twitter.png';
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonDashboardLayoutFooterProps = {};
export type DashboardLayoutFooterProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardLayoutFooterProps
> &
    CommonDashboardLayoutFooterProps;

export const DashboardLayoutFooter: FC<DashboardLayoutFooterProps> = ({
    className,
    ...restProps
}) => {
    return (
        <div className={cn(className, s.footer)}>
            <div className={cn(s.logo, 'flex', 'font-bold', 'items-center')}>
                <img
                    className={cn(s.logoIcon)}
                    src={ToolUpFooterIcon}
                    alt='toolup icon'
                />
                <p className={cn(s.logoText, 'ml-10')}>Toolup</p>
                <img className={cn(s.betaIcon)} src={BetaTag} alt='beta tag' />
            </div>

            <p className={cn(s.terms, 'font-bold')}>
                @ {new Date().getFullYear()} TOOLUP, All rights reserved.
            </p>

            <div className={cn('flex', s.contact)}>
                <p className={cn('font-bold', 'mr-20')}>Find us on</p>
                <img
                    className={cn('w-23', 'h-23', 'mr-10')}
                    src={MobileIcon}
                    alt='mobile number'
                />
                <img
                    className={cn('w-23', 'h-23', 'mr-10')}
                    src={LinkedInIcon}
                    alt='linkedin'
                />
                <img
                    className={cn('w-23', 'h-23', 'mr-10')}
                    src={TwitterIcon}
                    alt='twitter'
                />
            </div>
        </div>
    );
};
