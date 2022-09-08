import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
} from 'react';
import cn from 'clsx';
import { useHistory, useParams } from 'react-router-dom';
import dayJs from 'dayjs';
import {
    useAttachMemberToTeam,
    useDetachMemberFromTeam,
    useNewTeam,
    useOrganizationTeams,
} from 'Hooks/api';
import { useForm } from 'react-hook-form';
import { capitalize, last, findIndex } from 'lodash/fp';
import { format } from 'date-fns';
import {
    calendar,
    calendarActive,
    grayEditIcon,
    questionMarkIcon,
} from '../../assets/icons/index';
/* components */
/* modules */
import { Member } from '../../Store/member/models/Member';
import { UploadProfileImage } from '../../Components/Atomes/UploadProfileImage';
import { InputText } from '../../Components/Atomes/InputText';
import Button from '../../Components/Atomes/Button/Button';
import {
    useChangeMemberAvatar,
    useCreateUser,
    useDeleteUser,
    useGetUserById,
    useMemberStatus,
    useSendInvitationEmail,
    useUpdateUser,
} from '../../Hooks/api/user';
import { routeTo } from '../../Helpers/routeTo';
import { NiceDatePickerCalendar } from '../../Components/Molecules/DatePicker';
import {
    CreatableSelectInput,
    AutoSelectOptions as AutoSelectOption,
} from '../../Components/Atomes/AutoSelectInput';
import {
    buttonProps,
    SwitchButton,
} from '../../Components/Atomes/SwitchButton';
import { memberStatus } from '../../Enums/MemberEnums';
import { PopupTemplate } from '../../Components/Templates/PopupTemplate';
import { ConfirmPopup } from '../../Components/Molecules/ConfirmPopup';
import { toast, ToastContainer } from '../../Components/Atomes/ToastContainer';
import { queryClient } from '../../Services/ReactQueryService';
import API_URLS from '../../Constants/apiUrls';

/* helpers */
/* assets */
/* styles */
/* types */
export type CommonAddMemberProps = {};
export type AddMemberProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonAddMemberProps
> &
    CommonAddMemberProps;

const EditMember: FC<AddMemberProps> = ({ className }) => {
    /// / Constants
    const StatusButtons: buttonProps[] = [
        {
            selectedBGColor: 'bg-lime-400',
            value: 'ACTIVE',
            label: 'Active',
            onClick: (status: any) => {
                changeMemberStatus(status);
            },
        },
        {
            selectedBGColor: 'bg-yellow-400',
            value: 'SUSPENDED',
            label: 'Suspended',
            onClick: (status: any) => {
                changeMemberStatus(status);
            },
        },
    ];
    const AccessButtons: buttonProps[] = [
        {
            selectedBGColor: 'bg-lime-400',
            value: 'Super Admin',
            label: 'Admin',
            onClick: (access: any) => {
                setSelectedAccessForMember(access);
                setShowMemberAccessConfirmationPopup(true);
            },
        },
        {
            selectedBGColor: 'bg-lime-400',
            value: 'Normal User',
            label: 'User',
            onClick: (access: any) => {
                setSelectedAccessForMember(access);
                setShowMemberAccessConfirmationPopup(true);
            },
        },
    ];

    /// External Hooks
    const history = useHistory();
    // @ts-ignore
    const { id } = useParams();

    const { register, handleSubmit, watch, errors } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        resolver: undefined,
        context: undefined,
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: true,
    });

    /// API Functions
    const { data: selectedMember } = useGetUserById(id);
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: updateMemberAvatar } = useChangeMemberAvatar();
    const { mutate: attachMemberToTeam } = useAttachMemberToTeam();
    const { mutate: detachMemberFromTeam } = useDetachMemberFromTeam();
    const { mutate: changeUserStatus } = useMemberStatus();
    const { mutate: inviteUser } = useSendInvitationEmail();
    const { mutate: deleteUser } = useDeleteUser();
    const { mutate: createNewTeam, data: newTeamResponse } = useNewTeam();
    const { data: teams } = useOrganizationTeams();

    const teamsOptions: AutoSelectOption[] = (
        (teams &&
            teams.filter(team => team.name.toLowerCase() !== 'general')) ||
        []
    ).map(team => ({
        value: team.name,
        label: team.name,
    }));
    /// States
    const [
        selectedMemberProfile,
        setSelectedMemberProfile,
    ] = useState<Member>();
    const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
    const [selectedAccessForMember, setSelectedAccessForMember] = useState<
        'Normal User' | 'Super Admin' | undefined
    >(undefined);
    const [
        showMemberAccessConfirmationPopup,
        setShowMemberAccessConfirmationPopup,
    ] = useState<any>(false);
    const [
        showDeleteConfirmationPopup,
        setShowDeleteConfirmationPopup,
    ] = useState(false);

    const [profileImageFile, setProfileImageFile] = useState<any>(null);
    const [profileDataHasChanged, setProfileDataHasChanged] = useState<boolean>(
        false
    );
    const [inputTextChanged, setInputTextChanged] = useState<boolean>(false);
    const [submitErrors, setSubmitErrors] = useState<any>({});

    const [showOnBoardingCalendar, setShowOnBoardingCalendar] = useState(false);
    const [showOffBoardingCalendar, setShowOffBoardingCalendar] = useState(
        false
    );

    /// / Use Effects
    useEffect(() => {
        if (selectedMember) {
            setSelectedTeamIndex(
                teamsOptions.findIndex(team => {
                    if (selectedMember?.teams && selectedMember?.teams[1]) {
                        return team.value === selectedMember?.teams[1].name;
                    }
                })
            );
            // @ts-ignore
            setSelectedMemberProfile(selectedMember);
        }
    }, [selectedMember]);

    useEffect(() => {
        if (selectedMemberProfile && profileDataHasChanged) {
            updateUser(
                deleteMemberEmptyFields(selectedMemberProfile) as Member,
                {
                    onSuccess: (memberUpdateVariables, memberUpdateRes) => {
                        setProfileDataHasChanged(false);
                        toast('success', 'Member successfully updated.');
                    },
                }
            );
        }
    }, [profileDataHasChanged]);

    /// Event Handlers

    const changeMemberStatus = (status: 'ACTIVE' | 'SUSPENDED' | undefined) => {
        const tempMember = { ...selectedMemberProfile };
        tempMember.member_status = status;
        // @ts-ignore
        setSelectedMemberProfile(tempMember);
        setProfileDataHasChanged(true);
    };

    const changeMemberAccess = () => {
        const tempMember = { ...selectedMemberProfile };
        tempMember.access = selectedAccessForMember;
        setSelectedAccessForMember(undefined);
        // @ts-ignore
        setSelectedMemberProfile(tempMember);
        setProfileDataHasChanged(true);
        setShowMemberAccessConfirmationPopup(false);
    };

    const changeOnBoardingDate = (date: any) => {
        if (selectedMemberProfile?.status === 'NOT_ONBOARDED') {
            updateUser(
                {
                    id: selectedMemberProfile.id,
                    onboarding_date: dayJs(date).format('YYYY/MM/DD'),
                },
                {
                    onSuccess: (memberUpdateVariables, memberUpdateRes) => {
                        setProfileDataHasChanged(false);
                        setSelectedMemberProfile({
                            ...selectedMemberProfile,
                            onboarding_date: dayJs(date).format('YYYY/MM/DD'),
                        });
                        setShowOnBoardingCalendar(false);
                    },
                }
            );
        }
        if (selectedMemberProfile?.status === 'OFFBOARDED') {
            onboardMember(dayJs(date).format('YYYY/MM/DD'));
        }
    };

    const changeOffBoardingDate = (date: any) => {
        if (selectedMemberProfile?.status === 'NOT_OFFBOARDED') {
            updateUser(
                {
                    id: selectedMemberProfile.id,
                    offboarding_date: dayJs(date).format('YYYY/MM/DD'),
                },
                {
                    onSuccess: (memberUpdateVariables, memberUpdateRes) => {
                        setProfileDataHasChanged(false);
                        setSelectedMemberProfile({
                            ...selectedMemberProfile,
                            offboarding_date: dayJs(date).format('YYYY/MM/DD'),
                        });
                        setShowOffBoardingCalendar(false);
                    },
                }
            );
        }
        if (selectedMemberProfile?.status === 'ONBOARDED') {
            offboardMember(dayJs(date).format('YYYY/MM/DD'));
        }
    };

    const onProfileImageChange = (e: any) => {
        const blobFile: any = last(e.target.files);
        setProfileImageFile(URL.createObjectURL(e.target.files[0]));

        if (blobFile) {
            const avatar = new FormData();
            avatar.append('avatar', blobFile);
            // @ts-ignore
            updateMemberAvatar(
                { avatar, userId: id },
                {
                    onSuccess: () => {
                        toast(
                            'success',
                            'Member profile picture successfully updated.'
                        );
                    },
                }
            );
        }
    };
    const setCurrentMemberStatus = (status: any, member: any) => {
        const tempMember = { ...member };
        tempMember.status = status;
        // @ts-ignore
        setSelectedMemberProfile(tempMember);
    };

    const memberDataChange = (e: any) => {
        // @ts-ignore
        setSelectedMemberProfile({
            ...selectedMemberProfile,
            [e.target.name]: e.target.value,
        });
        setInputTextChanged(true);
    };

    const onBlurInput = () => {
        if (inputTextChanged) {
            setProfileDataHasChanged(true);
            setInputTextChanged(false);
        }
    };

    /// Logic Functions
    const attachUserToExistedTeam = (teamItem: any) => {
        // @ts-ignore
        attachMemberToTeam(
            { member_id: id, team_id: teamItem.id },
            {
                onSuccess: (
                    attachMemberToTeamVariables,
                    attachMemberToTeamRes
                ) => {
                    toast('info', 'Member team has been changed successfully');
                    const tempProfile = { ...selectedMemberProfile };
                    tempProfile.teams?.push(teamItem);
                    // @ts-ignore
                    setSelectedMemberProfile(tempProfile);
                },
            }
        );
    };

    const hasError = (field: string) => {
        if (submitErrors.detail && submitErrors.detail[field]) {
            return submitErrors.detail[field];
        }
        return false;
    };

    const addTeamAndAttachMember = (item: any) => {
        const teamIndex = teams
            ? teams.findIndex(team => team.name === item.value)
            : -1;
        if (teamIndex >= 0) {
            attachUserToExistedTeam(teams ? teams[teamIndex] : null);
            setSelectedTeamIndex(
                teamsOptions.findIndex(team => {
                    return team.value === item?.value;
                })
            );
        } else {
            createNewTeam(
                { name: item.value },
                {
                    onSuccess: (teamVariables, teamRes) => {
                        queryClient.invalidateQueries(API_URLS.orgTeams);
                        teamsOptions.unshift({
                            value: item.value,
                            label: item.value,
                        });
                        if (teamVariables) {
                            attachUserToExistedTeam(teamVariables);
                            setSelectedTeamIndex(teams ? teams.length - 1 : 0);
                        }
                    },
                }
            );
        }
    };

    const handleTeamChange = (item: any) => {
        if (item && item.value) {
            let currentTeamId = 0;

            // @ts-ignore
            setSelectedMemberProfile({
                ...selectedMemberProfile,
                team: item.value,
            });
            // @ts-ignore
            if (
                selectedMemberProfile &&
                selectedMemberProfile?.teams &&
                selectedMemberProfile?.teams?.length > 1
            ) {
                // @ts-ignore
                currentTeamId = selectedMemberProfile?.teams[1].id;
                detachMemberFromTeam(
                    {
                        member_id: selectedMemberProfile
                            ? selectedMemberProfile.id
                            : 0,
                        team_id: currentTeamId,
                    },
                    {
                        onSuccess: (attachMemberVariables, memberUpdateRes) => {
                            const tempProfile = { ...selectedMemberProfile };
                            tempProfile.teams?.pop();
                            setSelectedMemberProfile(tempProfile);
                            addTeamAndAttachMember(item);
                        },
                    }
                );
            } else {
                addTeamAndAttachMember(item);
            }
        }
    };

    const deleteMemberEmptyFields = (member: Member) => {
        const body = {
            first_name: member?.first_name,
            last_name: member?.last_name,
            // onboarding_date: member.onboarding_date,
            // offboarding_date: member.offboarding_date,
            member_status: member.member_status,
            access: member.access,
            id: member.id,
        };
        if (body) {
            if (body.first_name === '' || body.first_name === null) {
                delete body.first_name;
            }
            if (body.last_name === '' || body.last_name === null) {
                delete body.last_name;
            }
            // if (body.onboarding_date === '' || body.onboarding_date === null) {
            //     delete body.onboarding_date;
            // }
            // if (
            //     body.offboarding_date === '' ||
            //     body.offboarding_date === null
            // ) {
            //     delete body.offboarding_date;
            // }
            if (
                body.member_status !== 'ACTIVE' &&
                body.member_status !== 'SUSPENDED'
            ) {
                delete body.member_status;
            }
        }
        return body;
    };

    const offboardMember = (date: string) => {
        changeUserStatus(
            {
                userId: selectedMemberProfile ? selectedMemberProfile.id : 0,
                data: {
                    boarding_action: 'OFFBOARD',
                    boarding_date: date,
                },
            },
            {
                onSuccess: () => {
                    // @ts-ignore
                    setShowOffBoardingCalendar(false);
                    setCurrentMemberStatus('NOT_OFFBOARDED', {
                        ...selectedMemberProfile,
                        offboarding_date: dayJs(date).format('YYYY/MM/DD'),
                    });
                },
            }
        );
    };
    const onboardMember = (date: string) => {
        changeUserStatus(
            {
                userId: selectedMemberProfile ? selectedMemberProfile.id : 0,
                data: {
                    boarding_action: 'ONBOARD',
                    boarding_date: date,
                },
            },
            {
                onSuccess: () => {
                    setShowOnBoardingCalendar(false);
                    setCurrentMemberStatus('NOT_ONBOARDED', {
                        ...selectedMemberProfile,
                        onboarding_date: dayJs(date).format('YYYY/MM/DD'),
                    });
                },
            }
        );
    };

    const cancelOffboard = () => {
        changeUserStatus(
            {
                userId: selectedMemberProfile ? selectedMemberProfile.id : 0,
                data: {
                    boarding_action: 'CANCEL',
                },
            },
            {
                onSuccess: () => {
                    setCurrentMemberStatus('ONBOARDED', {
                        ...selectedMemberProfile,
                        offboarding_date: undefined,
                    });
                    setShowOffBoardingCalendar(false);
                },
            }
        );
    };
    const sendInvitationEmail = () => {
        inviteUser(
            { userId: id },
            {
                onSuccess: () => {
                    toast(
                        'info',
                        'Email invitation has been sent successfully to this Member'
                    );
                    const tempMember = { ...selectedMemberProfile };
                    tempMember.member_status = 'INVITED';
                    // @ts-ignore
                    setSelectedMemberProfile(tempMember);
                },
            }
        );
    };
    const deleteMember = () => {
        deleteUser(
            { userId: id },
            {
                onSuccess: () => {
                    setShowDeleteConfirmationPopup(false);
                    history.push(routeTo('members'));
                },
            }
        );
    };
    // @ts-ignore
    return (
        <div
            className={`${cn(className)} bg-white`}
            style={{ height: 'fit-content' }}
        >
            <form>
                <div className=' h-full p-24 pb-40'>
                    {selectedMemberProfile && (
                        <div className='grid grid-cols-10 gap-40 mt-30 px-70'>
                            <div className='col-span-2 '>
                                <UploadProfileImage
                                    id='member-avatar'
                                    selectedImage={
                                        selectedMemberProfile.avatar
                                            ? selectedMemberProfile.avatar
                                            : profileImageFile
                                    }
                                    onChange={onProfileImageChange}
                                />
                            </div>
                            <div className='col-span-8 mt-14 ml-20'>
                                <div className='grid grid-cols-4 gap-40'>
                                    <div className='col-span-2'>
                                        <p className='text-blue-900 font-bold'>
                                            First Name
                                        </p>
                                        <InputText
                                            id='first-name'
                                            onBlur={onBlurInput}
                                            ref={register}
                                            onChange={memberDataChange}
                                            value={
                                                selectedMemberProfile.first_name
                                            }
                                            name='first_name'
                                            placeholder='First Name'
                                            type='text'
                                            hasError={hasError('first_name')}
                                        />
                                        <p
                                            className='text-red-500 mb-10'
                                            hidden={
                                                hasError('first_name') === false
                                            }
                                        >
                                            {hasError('first_name')}
                                        </p>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className='text-blue-900 font-bold'>
                                            Last Name
                                        </p>
                                        <InputText
                                            id='last-name'
                                            onBlur={onBlurInput}
                                            ref={register}
                                            hasError={hasError('last_name')}
                                            onChange={memberDataChange}
                                            value={
                                                selectedMemberProfile.last_name
                                            }
                                            name='last_name'
                                            placeholder='Last Name'
                                            type='text'
                                        />
                                        <p
                                            className='text-red-500 mb-10'
                                            hidden={
                                                hasError('last_name') === false
                                            }
                                        >
                                            {hasError('last_name')}
                                        </p>
                                    </div>
                                </div>
                                <div className='grid grid-cols-4 gap-40'>
                                    <div className='col-span-2 '>
                                        <p className='text-blue-900 font-bold'>
                                            Team
                                        </p>
                                        <CreatableSelectInput
                                            id='select-team'
                                            options={teamsOptions}
                                            onChange={handleTeamChange}
                                            hasError={hasError('team')}
                                            selectedItemIndex={teamsOptions.findIndex(
                                                team => {
                                                    if (
                                                        selectedMember?.teams &&
                                                        selectedMember?.teams[1]
                                                    ) {
                                                        return (
                                                            team.value ===
                                                            selectedMember
                                                                ?.teams[1].name
                                                        );
                                                    }
                                                }
                                            )}
                                            isTypeable
                                        />
                                        <p
                                            className='text-red-500 mb-10'
                                            hidden={hasError('team') === false}
                                        >
                                            {hasError('team')}
                                        </p>
                                        <p className='text-gray-500 -mt-14'>
                                            {' '}
                                            If the team changes, member's access
                                            to the tools will also change
                                        </p>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className='text-blue-900 font-bold'>
                                            Email
                                        </p>
                                        <InputText
                                            id='email'
                                            onChange={() => {}}
                                            value={selectedMemberProfile.email}
                                            name='email'
                                            placeholder='Email'
                                            type='text'
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-4 gap-40 mt-30 '>
                                    <div className='col-span-2 '>
                                        <p className='text-blue-900 font-bold text-16'>
                                            Onboarding status
                                        </p>
                                        <p
                                            data-cy='onboardStatusTitle'
                                            className={`font-bold  mt-14 ${
                                                selectedMemberProfile.status ===
                                                'OFFBOARDED'
                                                    ? 'text-red-500'
                                                    : selectedMemberProfile.status ===
                                                      'ONBOARDED'
                                                    ? 'text-lime-400'
                                                    : 'text-gray-800'
                                            }`}
                                        >
                                            {
                                                memberStatus[
                                                    selectedMemberProfile.status
                                                        ? selectedMemberProfile.status
                                                        : 'NOT_ONBOARDED'
                                                ]
                                            }
                                        </p>
                                        {selectedMemberProfile.status !==
                                            'NOT_OFFBOARDED' &&
                                            selectedMemberProfile.status !==
                                                'OFFBOARDED' && (
                                                <p
                                                    className='text-gray-500 mt-10 '
                                                    data-cy='onboardStatusText'
                                                >
                                                    {selectedMemberProfile.status !==
                                                    'ONBOARDED'
                                                        ? 'Start onboarding the member by adding the tools from the onboarding page'
                                                        : "The member has the access to all of his team's apps"}
                                                </p>
                                            )}
                                        {selectedMemberProfile.status ===
                                            'OFFBOARDED' && (
                                            <p
                                                data-cy='offboardedStatusText'
                                                className='text-gray-500 mt-10 '
                                            >
                                                Offboarding of the member is
                                                complete
                                            </p>
                                        )}

                                        {(selectedMemberProfile.status ===
                                            'NOT_ONBOARDED' ||
                                            selectedMemberProfile.status ===
                                                'ONBOARDING') && (
                                            <div data-cy='onboardingDateInput'>
                                                <p className='text-gray-900 mt-10 '>
                                                    Onboarding date
                                                </p>

                                                <div className='flex justify-evenly items-center h-34 text-gray-400 text-sm w-138 mt-16'>
                                                    <img
                                                        src={
                                                            selectedMemberProfile.status ===
                                                            'NOT_ONBOARDED'
                                                                ? calendarActive
                                                                : calendar
                                                        }
                                                        className='relative left-24'
                                                    />
                                                    <input
                                                        placeholder='From'
                                                        disabled={
                                                            selectedMemberProfile.status ===
                                                            'ONBOARDING'
                                                        }
                                                        value={format(
                                                            selectedMemberProfile.onboarding_date
                                                                ? new Date(
                                                                      selectedMemberProfile.onboarding_date
                                                                  )
                                                                : new Date(),
                                                            'yyyy MM dd'
                                                        ).toString()}
                                                        onClick={() => {}}
                                                        className='w-138 text-12 h-34 border-gray-300 hover:border-gray-300 focus:border-blue-900 active:border-gray-300 focus-within:border-blue-900 rounded border text-gray-500 text-center'
                                                    />
                                                    {selectedMemberProfile.status ===
                                                        'NOT_ONBOARDED' && (
                                                        <img
                                                            data-cy='onboardingEditBtn'
                                                            onClick={() =>
                                                                setShowOnBoardingCalendar(
                                                                    true
                                                                )
                                                            }
                                                            src={grayEditIcon}
                                                            className='relative right-24 cursor-pointer'
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {(selectedMemberProfile.status ===
                                            'NOT_OFFBOARDED' ||
                                            selectedMemberProfile.status ===
                                                'OFFBOARDED') && (
                                            <div data-cy='offboardingDateInput'>
                                                <p className='text-gray-900 mt-10 '>
                                                    Offboarding date
                                                </p>

                                                <div className='flex justify-evenly items-center h-34 text-gray-400 text-sm w-138 mt-16'>
                                                    <img
                                                        src={
                                                            selectedMemberProfile.status ===
                                                            'NOT_OFFBOARDED'
                                                                ? calendarActive
                                                                : calendar
                                                        }
                                                        className='relative left-24'
                                                    />
                                                    <input
                                                        placeholder='From'
                                                        disabled={
                                                            selectedMemberProfile.status ===
                                                            'OFFBOARDED'
                                                        }
                                                        value={format(
                                                            selectedMemberProfile.offboarding_date
                                                                ? new Date(
                                                                      selectedMemberProfile.offboarding_date
                                                                  )
                                                                : new Date(),
                                                            'yyyy MM dd'
                                                        ).toString()}
                                                        onClick={() => {}}
                                                        className='w-138 text-12 h-34 border-gray-300 hover:border-gray-300 focus:border-blue-900 active:border-gray-300 focus-within:border-blue-900 rounded border text-gray-500 text-center'
                                                    />
                                                    {selectedMemberProfile.status ===
                                                        'NOT_OFFBOARDED' && (
                                                        <img
                                                            data-cy='offboardingEditBtn'
                                                            onClick={() =>
                                                                setShowOffBoardingCalendar(
                                                                    true
                                                                )
                                                            }
                                                            src={grayEditIcon}
                                                            className='relative right-24 cursor-pointer'
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='col-span-2 '>
                                        {selectedMemberProfile.status ===
                                            'ONBOARDED' && (
                                            <Button
                                                data_cy='offboardBtn'
                                                onClick={() =>
                                                    setShowOffBoardingCalendar(
                                                        true
                                                    )
                                                }
                                                color='white'
                                                text='OFFBOARD'
                                                className='font-semibold ml-0 mt-40'
                                            />
                                        )}
                                        {selectedMemberProfile.status ===
                                            'NOT_OFFBOARDED' && (
                                            <Button
                                                data_cy='offboardCancelBtn'
                                                onClick={() => cancelOffboard()}
                                                color='white'
                                                text='CANCEL'
                                                className='font-semibold ml-0 mt-40'
                                            />
                                        )}
                                        {selectedMemberProfile.status ===
                                            'OFFBOARDED' && (
                                            <Button
                                                data_cy='onboardBtn'
                                                onClick={() =>
                                                    setShowOnBoardingCalendar(
                                                        true
                                                    )
                                                }
                                                color='white'
                                                text='ONBOARD'
                                                className='font-semibold ml-0 mt-40'
                                            />
                                        )}
                                        {showOnBoardingCalendar && (
                                            <div
                                                className='mt-20 max-w-240'
                                                data-cy='onboardingDatePicker'
                                            >
                                                <NiceDatePickerCalendar
                                                    date={
                                                        selectedMemberProfile.onboarding_date
                                                            ? new Date(
                                                                  selectedMemberProfile.onboarding_date
                                                              )
                                                            : new Date()
                                                    }
                                                    onDateChange={
                                                        changeOnBoardingDate
                                                    }
                                                />
                                            </div>
                                        )}
                                        {showOffBoardingCalendar && (
                                            <div
                                                className='mt-20 max-w-240'
                                                data-cy='offboardingDatePicker'
                                            >
                                                <NiceDatePickerCalendar
                                                    date={
                                                        selectedMemberProfile.offboarding_date
                                                            ? new Date(
                                                                  selectedMemberProfile.offboarding_date
                                                              )
                                                            : new Date()
                                                    }
                                                    onDateChange={
                                                        changeOffBoardingDate
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className='col-span-2'>
                                        <p className='text-blue-900 font-bold text-16 mt-16'>
                                            Member Status
                                        </p>
                                        {(selectedMemberProfile.member_status ===
                                            'ACTIVE' ||
                                            selectedMemberProfile.member_status ===
                                                'SUSPENDED') && (
                                            <SwitchButton
                                                className='mt-20'
                                                buttons={StatusButtons}
                                                defaultBGColor='bg-gray-300'
                                                selectedButton={
                                                    selectedMemberProfile.member_status
                                                }
                                            />
                                        )}
                                        {(selectedMemberProfile.member_status ===
                                            'NEW' ||
                                            selectedMemberProfile.member_status ===
                                                'INVITED') && (
                                            <>
                                                <p
                                                    data-cy='memberStatusTitle'
                                                    className='font-bold text-gray-900 mt-14 '
                                                >
                                                    {
                                                        selectedMemberProfile.member_status
                                                    }
                                                </p>
                                                <p
                                                    data-cy='memberStatusText'
                                                    className='text-gray-500 mt-10 '
                                                >
                                                    {selectedMemberProfile.member_status ===
                                                    'NEW'
                                                        ? 'This member has not been invited yet!'
                                                        : 'Invitation email has been sent to the member'}
                                                </p>
                                            </>
                                        )}
                                        <p className='text-blue-900 font-bold text-16 mt-30'>
                                            Access
                                        </p>
                                        <SwitchButton
                                            className='mt-20 mb-20'
                                            buttons={AccessButtons}
                                            defaultBGColor='bg-gray-300'
                                            selectedButton={
                                                selectedMemberProfile.access
                                            }
                                        />
                                        <Button
                                            data_cy='deleteMemberBtn'
                                            onClick={() =>
                                                setShowDeleteConfirmationPopup(
                                                    true
                                                )
                                            }
                                            color='white'
                                            text='DELETE MEMBER'
                                            className='font-semibold ml-0 '
                                        />
                                        <p className='text-red-600 mt-10 '>
                                            Caution: deleting this member means
                                            all data associated with the member
                                            will be deleted{' '}
                                        </p>
                                    </div>
                                    <div className='col-span-2'>
                                        {selectedMemberProfile.member_status ===
                                            'NEW' && (
                                            <Button
                                                data_cy='sendInvitationBtn'
                                                onClick={() =>
                                                    sendInvitationEmail()
                                                }
                                                color='white'
                                                text='Send Invitation Email'
                                                className='font-semibold ml-0 mt-40'
                                            />
                                        )}
                                        {selectedMemberProfile.member_status ===
                                            'INVITED' && (
                                            <Button
                                                data_cy='resendInvitationBtn'
                                                onClick={() =>
                                                    sendInvitationEmail()
                                                }
                                                color='white'
                                                text='Resend Invitation Email'
                                                className='font-semibold ml-0 mt-40'
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Button
                        onClick={() => history.push(routeTo('members'))}
                        color='blue'
                        text='BACK'
                        className='font-semibold ml-0 mt-40'
                    />
                </div>
            </form>
            {showMemberAccessConfirmationPopup && (
                <PopupTemplate
                    title='Member Access Change Confirmation'
                    widthTailwindClass='w-5/12'
                    heightTailwindClass='h-140'
                    onClose={() => {
                        setShowMemberAccessConfirmationPopup(false);
                    }}
                >
                    <ConfirmPopup
                        confirmMessage={`The user access is changing from ${
                            selectedMemberProfile?.access === 'Super Admin'
                                ? 'Admin'
                                : 'User'
                        } to ${
                            selectedAccessForMember === 'Super Admin'
                                ? 'Admin'
                                : 'User'
                        }`}
                        messageColor='text-blue-900'
                        yesClicked={() => {
                            changeMemberAccess();
                        }}
                        noClicked={() =>
                            setShowMemberAccessConfirmationPopup(false)
                        }
                    />
                </PopupTemplate>
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
                        confirmMessage='Are you sure to delete this member?'
                        messageColor='text-red-600'
                        yesClicked={() => {
                            deleteMember();
                        }}
                        noClicked={() => setShowDeleteConfirmationPopup(false)}
                    />
                </PopupTemplate>
            )}
        </div>
    );
};

export default EditMember;
