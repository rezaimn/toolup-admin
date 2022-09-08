import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { TeamMembersBox } from 'Components/Molecules/TeamMembersBox';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
import { SelectedMembersWithTeamId } from 'Components/Organisms/AddMembersToTeams';
/* modules */
import cn from 'clsx';
import { TeamHttpResponse } from 'Hooks/api';
import { get, map, pipe } from 'lodash/fp';
/* helpers */
import { isZero } from 'Helpers/fp';
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonDroppableTeamsListProps = {
    teams: TeamHttpResponse[];
    selectedMembers: SelectedMembersWithTeamId[];
    onDropped: (
        teamId: number,
        members: SelectedMembersWithTeamId[],
        name: string
    ) => void;
    specificTeamId?: number;
    title: string;
    isSignleTeam: boolean;
};
export type DroppableTeamsListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDroppableTeamsListProps
> &
    CommonDroppableTeamsListProps;

export const DroppableTeamsList: FC<DroppableTeamsListProps> = ({
    className,
    teams,
    selectedMembers,
    onDropped,
    title,
    isSignleTeam,
    ...restProps
}) => {
    const render = map<TeamHttpResponse, JSX.Element>(team => {
        return (
            <TeamMembersBox
                team={team}
                selectedMembers={selectedMembers}
                onDropped={onDropped}
                isSignleTeam={isSignleTeam}
            />
        );
    });

    return (
        <div className={cn(className)}>
            <p className={styles.title}>{title}</p>

            {pipe(get('length'), isZero)(teams) && (
                <EmptyCardSign className='mt-20' title='No new teams found!' />
            )}

            {render(teams)}
        </div>
    );
};
