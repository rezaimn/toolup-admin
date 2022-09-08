import { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
import { ConfirmModal } from 'Components/Molecules/ConfirmModal';
import { PopupTemplate } from 'Components/Templates/PopupTemplate';
import { TeamMembers } from 'Components/Organisms/TeamMembers';
import { Edit } from '@icon-park/react';
/* modules */
import cn from 'clsx';
import { SelectedMembersWithTeamId } from 'Components/Organisms/AddMembersToTeams';
import {
    membersWithoutTeamQueryKey,
    membersWithTeamQueryKey,
    TeamHttpResponse,
    TeamMember,
    useCustomDeleteTeam,
    useTeamMembers,
} from 'Hooks/api';
import { gt, isEqual, lowerCase, map, pipe, slice, toString } from 'lodash/fp';
import { useDrop } from 'react-dnd';
import { MiniMemberBox } from 'Components/Molecules/MiniMemberBox';
import { useHistory } from 'react-router';
/* helpers */
import { toast } from 'Components/Atomes/ToastContainer';
import { routeTo } from 'Helpers/routeTo';
/* services */
import { queryClient } from 'Services/ReactQueryService';
/* constants */
import { DndTypes } from 'Constants/DndTypes';
import API_URLS from 'Constants/apiUrls';
/* assets */
/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonTeamMembersBoxProps = {
    selectedMembers: SelectedMembersWithTeamId[];
    team: TeamHttpResponse;
    onDropped: (
        teamId: number,
        members: SelectedMembersWithTeamId[],
        name: string
    ) => void;
    isSignleTeam: boolean;
};

export type TeamMembersBoxProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeamMembersBoxProps
> &
    CommonTeamMembersBoxProps;

export const TeamMembersBox: FC<TeamMembersBoxProps> = ({
    className,
    team,
    selectedMembers,
    onDropped,
    isSignleTeam,
    ...restProps
}) => {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

    const SHOW_COUNT = isSignleTeam ? Infinity : 3;

    const boxCn = 'shadow rounded-md py-12 mb-10 h-full';
    const headerBoxCn =
        'flex justify-between items-center border-l-4 pl-10 mb-10';
    const titleCn = 'font-bold text-gray-500 mt-0';
    const subtitleCn = 'text-xs text-gray-125 mb-0';
    const dropboxCn = 'border-dashed border border-gray-200 rounded p-8 mx-8';
    const toolsHolderCn = cn('flex items-center', {
        'flex-wrap': isSignleTeam,
    });

    const isGeneralTeam = isEqual('general')(lowerCase(team.name));
    const mustShowEditAndDelete = !isGeneralTeam;

    const history = useHistory();
    const {
        data: teamMembers = [],
        isLoading: teamMembersIsLoading,
    } = useTeamMembers(team.id, {
        enabled: true,
    });

    const {
        mutate: deleteTeam,
        isLoading: deleteTeamIsLoading,
    } = useCustomDeleteTeam({ toolType: 'new' });

    const [{ isOver }, drop] = useDrop({
        accept: DndTypes.MEMBER,
        canDrop: () => true,
        drop: () => {
            const previousTeamId = 1;
            onDropped(team.id, selectedMembers, team.name);
        },
        collect: monitor => {
            return {
                isOver: !!monitor.isOver(),
            };
        },
    });

    const handleCloseDeleteConfirm = (): void => {
        setIsDeleteConfirmOpen(false);
    };

    const handleCloseMembersModal = (): void => {
        setIsMembersModalOpen(false);
        queryClient.invalidateQueries(['teamMembers', team.id]);

        if (isSignleTeam) {
            queryClient.invalidateQueries(API_URLS.showTeam(toString(team.id)));

            queryClient.invalidateQueries(membersWithoutTeamQueryKey);
            queryClient.invalidateQueries(membersWithTeamQueryKey);

            return;
        }

        queryClient.invalidateQueries(API_URLS.newTeams);
    };
    const handleOpenMembersModal = (): void => {
        setIsMembersModalOpen(true);
    };

    const handleDeleteTeam = (id: number): (() => void) => (): void => {
        deleteTeam(
            { teamId: id },
            {
                onSuccess: () => {
                    handleCloseDeleteConfirm();
                    toast('success', <p>Team successfully deleted.</p>);

                    if (isSignleTeam) {
                        history.push(routeTo('teams'));
                    }
                },
                onError: () => {
                    handleCloseDeleteConfirm();
                    toast('error', 'Someting went wrong in team deletion.');
                },
            }
        );
    };

    const mapMembers = pipe(
        slice(0, SHOW_COUNT),
        map<TeamMember, JSX.Element>(member => {
            return <MiniMemberBox member={member} />;
        })
    );

    function render(
        members: TeamMember[],
        isO: boolean,
        count: number
    ): JSX.Element | JSX.Element[] | undefined {
        if (isEqual(0)(members.length)) {
            return (
                <div
                    className={cn(dropboxCn, {
                        'bg-gray-50': isO,
                        'bg-gray-100': !isO,
                    })}
                >
                    <p className='text-gray-400 text-xs text-center'>
                        Drag & drop to add your members
                    </p>
                    <p className='text-gray-300 text-xs text-center'>
                        No members
                    </p>
                </div>
            );
        }

        if (gt(members.length)(3)) {
            return (
                <div
                    className={cn(toolsHolderCn, {
                        'bg-gray-50': isOver,
                    })}
                >
                    {mapMembers(members)}
                    {!isSignleTeam && (
                        <p className={styles.more}>
                            +{count - SHOW_COUNT} Member(s)
                        </p>
                    )}
                </div>
            );
        }
        return (
            <div
                className={cn(toolsHolderCn, {
                    'bg-gray-50': isOver,
                })}
            >
                {mapMembers(members)}
            </div>
        );
    }

    return (
        <div
            ref={drop}
            className={cn(className, boxCn)}
            data-cy='team-box'
            id='team-box'
        >
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                title='Team deletion'
                message='Are you sure you want to delete this team?'
                onConfirm={handleDeleteTeam(team.id)}
                onClose={handleCloseDeleteConfirm}
                isLoading={deleteTeamIsLoading}
            />

            {isMembersModalOpen && (
                <PopupTemplate
                    title='Team Members'
                    heightTailwindClass='h-480'
                    widthTailwindClass='w-9/12'
                    onClose={handleCloseMembersModal}
                >
                    <TeamMembers team={team} />
                </PopupTemplate>
            )}
            <div
                className={cn(headerBoxCn)}
                style={{ borderColor: team?.color }}
            >
                <div>
                    <h4 className={titleCn}>{team.name}</h4>
                    <h6 className={subtitleCn}>
                        {team.members_count} members in the team
                    </h6>
                </div>

                {mustShowEditAndDelete && (
                    <Edit
                        className='text-24 cursor-pointer'
                        theme='filled'
                        fill='#D5D5D5'
                        onClick={handleOpenMembersModal}
                    />
                )}
            </div>

            {render(teamMembers, isOver, team.members_count)}
        </div>
    );
};
