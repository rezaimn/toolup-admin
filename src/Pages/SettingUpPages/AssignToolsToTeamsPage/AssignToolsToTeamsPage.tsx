import React from 'react';
import { SetupTeamToolsWrapper } from 'Components/Organisms/SetupTeamTools/SetupTeamToolsWrapper';

interface Props { }

const AssignToolsToTeamsPage: React.FC<Props> = () => {
    return (
        <div className={'w-full h-full py-10 flex flex-col'}>
            <SetupTeamToolsWrapper className={'h-0 flex-grow'} />
        </div>
    );
};
export default AssignToolsToTeamsPage;
