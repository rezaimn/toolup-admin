import React, { ComponentPropsWithoutRef, FC, Fragment } from 'react';
/* components */
import { DashboardOnboardingCard } from 'Components/Organisms/DashboardOnboardingCard';
import { DashboardOffboardingCard } from 'Components/Organisms/DashboardOffboardingCard';
import { DashboardSuggestedTools } from 'Components/Organisms/DashboardSuggestedTools';

/* modules */
import cn from 'clsx';
/* helpers */

/* assets */
/* styles */
/* types */
export type CommonDashboardProps = {};
export type DashboardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDashboardProps
> &
    CommonDashboardProps;

const Dashboard: FC<DashboardProps> = ({ className, ...restProps }) => {
    return (
        <>
            <div className={cn(className)} style={{ height: 'max-content' }}>
                <div className='first flex w-full mb-30'>
                    <div className='top flex w-full space-x-0 md:space-x-30 flex-wrap md:flex-nowrap'>
                        <div className='left w-full md:w-1/2 mb-20 md:mb-0'>
                            <DashboardOnboardingCard className='h-full' />
                        </div>
                        <div className='right w-full md:w-1/2 '>
                            <DashboardOffboardingCard className='h-full' />
                        </div>
                    </div>
                </div>
                <div className='second'>
                    <DashboardSuggestedTools />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
