import { FC } from 'react';
/* components */
import { SetupTeamToolsWrapper } from 'Components/Organisms/SetupTeamTools/SetupTeamToolsWrapper';
/* modules */
import cn from 'clsx';
import { useParams } from 'react-router';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
const EditTeamTools: FC = () => {
    const { teamId } = useParams<{ teamId: string }>();

    return (
        <div className={styles.editTeamTools}>
            <div className='w-full h-full py-10 flex flex-col'>
                <SetupTeamToolsWrapper
                    teamId={teamId}
                    className='h-0 flex-grow'
                />
            </div>
        </div>
    );
};

export default EditTeamTools;
