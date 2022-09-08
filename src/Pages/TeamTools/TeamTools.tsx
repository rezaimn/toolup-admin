import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { SetupTeamToolsWrapper } from 'Components/Organisms/SetupTeamTools/SetupTeamToolsWrapper';
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
import { qMark } from 'assets/icons';
/* styles */
/* types */
export type CommonSetupTeamToolsProps = {};
export type SetupTeamToolsProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSetupTeamToolsProps
> &
    CommonSetupTeamToolsProps;

const TeamTools: FC<SetupTeamToolsProps> = ({ className }) => {
    return (
        <div
            className={cn(
                'bg-white shadow-md rounded-lg p-20 w-full flex flex-col',
                className
            )}
            style={{ height: 'calc(100vh - 140px)' }}
        >
            <SetupTeamToolsWrapper className={'h-0 flex-grow'} />
        </div>
    );
};

export default TeamTools;
