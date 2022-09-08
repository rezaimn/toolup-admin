import { FC } from 'react';
/* components */
import { AddMembersToTeams } from 'Components/Organisms/AddMembersToTeams';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
/* modules */
import cn from 'clsx';
import { useParams } from 'react-router';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */

const EditTeamMembers: FC = () => {
    const { teamId } = useParams<{ teamId: string }>();

    return (
        <div className={styles.editTeamMembers}>
            <AddMembersToTeams teamId={+teamId} teamsTitle='Team' />
        </div>
    );
};

export default EditTeamMembers;
