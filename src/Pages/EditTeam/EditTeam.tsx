import React, { Fragment, FC, useState, useEffect } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import './edit-team.scss';
import { Link, useHistory, useParams } from 'react-router-dom';
import { InputText } from '../../Components/Atomes/InputText';
import COLORS from '../../Constants/colors';
import Button from '../../Components/Atomes/Button/Button';
import { whiteDeleteIcon, blueEditIcon } from '../../assets/icons';

import {
    useDeleteTeam,
    useGetTeamById,
    useTeamMembers,
    useUpdateTeam,
} from '../../Hooks/api/team';
import { routeTo } from '../../Helpers/routeTo';
import { TeamMemberWideCard } from '../../Components/Molecules/TeamMemberWideCard';
import { ToolManagementToolItem } from '../../Components/Molecules/ToolManagementToolItem';
import ToolImagePlaceholderIcon from '../../assets/icons/tool-image-placeholder.svg';
import { isNormalUser } from '../../Services/RBAC/config';
import { toast } from '../../Components/Atomes/ToastContainer';
import { PopupTemplate } from '../../Components/Templates/PopupTemplate';
import { ConfirmPopup } from '../../Components/Molecules/ConfirmPopup';
/* helpers */
/* assets */
/* styles */
/* types */
const EditTeam: FC = () => {
    const history = useHistory();
    // @ts-ignore
    const { teamId: id } = useParams();

    const [teamNameChanged, setTeamNameChanged] = useState(false);
    const [submitErrors, setSubmitErrors] = useState<any>({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [
        showDeleteConfirmationPopup,
        setShowDeleteConfirmationPopup,
    ] = useState(false);

    const { data: selectedTeam } = useGetTeamById(id);
    const { data: selectedTeamMembers } = useTeamMembers(id, {});
    const [currentTeam, setCurrentTeam] = useState(selectedTeam);
    const { mutate: updateTeam } = useUpdateTeam();
    const { mutate: deleteTeam } = useDeleteTeam();

    useEffect(() => {
        if (selectedTeam) {
            setCurrentTeam(selectedTeam);
        }
    }, [selectedTeam]);
    useEffect(() => {
        if (selectedTeamMembers) {
            // @ts-ignore
            setTeamMembers([...selectedTeamMembers]);
        }
    }, [selectedTeamMembers]);
    const onTeamNameChanged = (e: any) => {
        setTeamNameChanged(true);
        setCurrentTeam({ ...currentTeam, name: e.target.value });
    };
    const onDeleteTeam = () => {
        deleteTeam(id, {
            onSuccess: () => {
                history.push(routeTo('teams'));
            },
        });
    };
    const onUpdateTeam = () => {
        if (teamNameChanged) {
            updateTeam(
                {
                    id: currentTeam && currentTeam.id,
                    name: currentTeam ? currentTeam.name : '',
                },
                {
                    onSuccess: () => {
                        toast('success', 'Team name updated successfully.');
                    },
                    onError: (err: any) => {
                        setSubmitErrors(err?.response?.data?.errors || {});
                    },
                }
            );
        }
    };
    const hasError = (field: string) => {
        if (submitErrors.detail && submitErrors.detail[field]) {
            return submitErrors.detail[field];
        }
        return false;
    };
    const updateTeamColor = (color: string) => {
        updateTeam(
            {
                id: currentTeam && currentTeam.id,
                color,
            },
            {
                onSuccess: () => {
                    // @ts-ignore
                    setCurrentTeam({ ...currentTeam, color });
                    toast('success', 'Team color updated successfully.');
                },
            }
        );
    };
    const editMembersPage = () => {};
    const editToolsPage = () => {};
    return (
        <>
            {currentTeam && (
                <div
                    className={'bg-white p-30 shadow-md rounded-lg '}
                    style={{ height: 'fit-content' }}
                >
                    <div className='grid grid-cols-12 gap-40'>
                        <div className='col-span-4'>
                            <InputText
                                id='team-name'
                                onBlur={() => onUpdateTeam()}
                                onChange={onTeamNameChanged}
                                value={currentTeam.name}
                                name='team'
                                disabled={
                                    currentTeam.name.toLowerCase() === 'general'
                                }
                                placeholder='Team Name'
                                type='text'
                                hasError={hasError('name')}
                            />
                            <p
                                data-cy='teamNameError'
                                className='text-red-500 mb-10'
                                hidden={hasError('name') === false}
                            >
                                {hasError('name')[0]}
                            </p>
                        </div>
                        <div className='col-span-4'>
                            <div className='grid grid-cols-10 gap-30 -mt-14 mb-10'>
                                {COLORS &&
                                    COLORS.slice(0, 10).map(
                                        (color: string, index: number) => {
                                            return (
                                                <span
                                                    data-cy={color.substr(
                                                        1,
                                                        color.length - 1
                                                    )}
                                                    onClick={() =>
                                                        currentTeam.name.toLowerCase() !==
                                                        'general'
                                                            ? updateTeamColor(
                                                                  color
                                                              )
                                                            : () => {}
                                                    }
                                                    className={`circle rounded-full cursor-pointer  ${
                                                        color ===
                                                        currentTeam.color
                                                            ? 'border'
                                                            : ''
                                                    }`}
                                                    style={{
                                                        backgroundColor: color,
                                                        borderColor: color,
                                                    }}
                                                />
                                            );
                                        }
                                    )}
                            </div>
                            <div className='grid grid-cols-10 gap-30 '>
                                {COLORS &&
                                    COLORS.slice(10, 20).map(
                                        (color: string, index: number) => {
                                            return (
                                                <span
                                                    onClick={() =>
                                                        currentTeam.name.toLowerCase() !==
                                                        'general'
                                                            ? updateTeamColor(
                                                                  color
                                                              )
                                                            : () => {}
                                                    }
                                                    className={`circle rounded-full cursor-pointer  ${
                                                        color ===
                                                        currentTeam.color
                                                            ? 'border'
                                                            : ''
                                                    }`}
                                                    style={{
                                                        backgroundColor: color,
                                                        borderColor: color,
                                                    }}
                                                />
                                            );
                                        }
                                    )}
                            </div>
                        </div>
                        {currentTeam.name.toLowerCase() !== 'general' && (
                            <div className='col-span-4'>
                                <Button
                                    data_cy='deleteTeamBtn'
                                    className='mt-0 text-12 float-right mr-0'
                                    svg={whiteDeleteIcon}
                                    onClick={() => {
                                        setShowDeleteConfirmationPopup(true);
                                    }}
                                    color='blue'
                                    text='DELETE TEAM'
                                />
                            </div>
                        )}
                    </div>

                    <div className='grid grid-cols-12 gap-40 mt-10 pl-30 bg-blue-100 rounded-md px-10'>
                        <div className='col-span-9 '>
                            <h4 className='font-bold text-blue-900 mt-8 text-16'>
                                Members
                            </h4>
                            <h6 className='text-s text-gray-400 mb-0'>
                                {teamMembers && teamMembers.length} members in
                                the team
                            </h6>
                        </div>
                        <div className='col-span-3'>
                            <Link
                                to={routeTo('editTeamMembers', {
                                    teamId: id,
                                })}
                            >
                                {currentTeam.name.toLowerCase() !==
                                    'general' && (
                                    <Button
                                        data_cy='teamMembersEditBtn'
                                        className='mt-12 text-12 float-right mr-0'
                                        svg={blueEditIcon}
                                        onClick={() => {
                                            editMembersPage();
                                        }}
                                        color='white'
                                        text='EDIT'
                                    />
                                )}
                            </Link>
                        </div>
                    </div>

                    <div className='grid grid-cols-12 gap-40 mt-12'>
                        <div className='col-span-4'>
                            <strong className='ml-30 text-16'>Name</strong>
                        </div>
                        <div className='col-span-4'>
                            <strong className={'text-16'}>Email</strong>
                        </div>
                        <div className='col-span-4 '>
                            <strong className='float-right mr-30 text-16'>
                                Onboarding Date
                            </strong>
                        </div>
                    </div>
                    <div
                        className='overflow-y-auto '
                        style={{ height: '20vh' }}
                    >
                        {teamMembers &&
                            teamMembers.map(
                                (memberItem: any, index: number) => {
                                    return (
                                        <TeamMemberWideCard
                                            key={`row-${index}`}
                                            member={memberItem}
                                            isSelectable={false}
                                        />
                                    );
                                }
                            )}
                    </div>

                    <div className='grid grid-cols-12 gap-40 mt-10 pl-30 bg-blue-100 rounded-md px-10'>
                        <div className='col-span-9 '>
                            <h4 className='font-bold text-blue-900 mt-8 text-16'>
                                Tools
                            </h4>
                            <h6 className='text-s text-gray-400 mb-0'>
                                {currentTeam.tools && currentTeam.tools.length}{' '}
                                tools in the team
                            </h6>
                        </div>
                        <div className='col-span-3'>
                            <Link to={routeTo('editTeamTools', { teamId: id })}>
                                <Button
                                    data_cy='teamToolsEditBtn'
                                    className='mt-12 text-12 float-right mr-0'
                                    svg={blueEditIcon}
                                    onClick={() => {
                                        editToolsPage();
                                    }}
                                    color='white'
                                    text='EDIT'
                                />
                            </Link>
                        </div>
                    </div>
                    <div
                        className={`overflow-y-auto flex -mx-10 flex-wrap `}
                        style={{
                            height: '20vh',
                        }}
                    >
                        {currentTeam.tools &&
                            currentTeam.tools.map(
                                (tool: any, index: number) => {
                                    return (
                                        <div
                                            className={
                                                'p-10  w-full  sm:w-1/2  md:w-1/4 lg:w-1/5  2xl:w-1/6'
                                            }
                                            key={tool.id.toString()}
                                        >
                                            <ToolManagementToolItem
                                                icon={
                                                    tool.icon ||
                                                    ToolImagePlaceholderIcon
                                                }
                                                name={tool.name}
                                                url={tool.url}
                                                categories={tool.categories}
                                                created_at={tool.created_at}
                                                id={tool.id}
                                                members_count={
                                                    tool.members_count
                                                }
                                                organization_id={
                                                    tool.organization_id
                                                }
                                                origin={tool.origin}
                                                teams_count={tool.teams_count}
                                                type={tool.type}
                                                updated_at={tool.updated_at}
                                                isCustomTool={
                                                    tool.origin !== 'SYSTEM'
                                                }
                                                isStatic={isNormalUser()}
                                            />
                                        </div>
                                    );
                                }
                            )}
                    </div>
                </div>
            )}
            {showDeleteConfirmationPopup && (
                <PopupTemplate
                    title='Delete Member Confirmation'
                    widthTailwindClass='w-5/12'
                    heightTailwindClass='h-140'
                    onClose={() => {
                        setShowDeleteConfirmationPopup(false);
                    }}
                >
                    <ConfirmPopup
                        confirmMessage='Are you sure to delete this team?'
                        messageColor='text-red-600'
                        yesClicked={() => {
                            onDeleteTeam();
                        }}
                        noClicked={() => setShowDeleteConfirmationPopup(false)}
                    />
                </PopupTemplate>
            )}
        </>
    );
};

export default EditTeam;
