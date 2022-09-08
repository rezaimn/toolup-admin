import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
} from 'react';
import cn from 'clsx';
import dayJs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { useOrganizationTeams } from 'Hooks/api';
import { useForm } from 'react-hook-form';
import { last } from 'lodash/fp';
import { Member } from '../../Store/member/models/Member';
import { UploadProfileImage } from '../../Components/Atomes/UploadProfileImage';
import { InputText } from '../../Components/Atomes/InputText';
import Button from '../../Components/Atomes/Button/Button';
import { useChangeMemberAvatar, useCreateUser } from '../../Hooks/api/user';
import { routeTo } from '../../Helpers/routeTo';
import { NiceDatePickerCalendar } from '../../Components/Molecules/DatePicker';
import {
    CreatableSelectInput,
    AutoSelectOptions as AutoSelectOption,
} from '../../Components/Atomes/AutoSelectInput';

/* helpers */
/* assets */
/* styles */
/* types */
// eslint-disable-next-line @typescript-eslint/ban-types
export type CommonAddMemberProps = {};
export type AddMemberProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonAddMemberProps
> &
    CommonAddMemberProps;

const AddMember: FC<AddMemberProps> = ({ className }) => {
    /// / External Hooks
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        resolver: undefined,
        context: undefined,
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: true,
    });

    /// API functions
    const { mutate: createMember } = useCreateUser();
    const { mutate: updateMemberAvatar } = useChangeMemberAvatar();
    const { data: teams } = useOrganizationTeams();

    // states
    const [profileImageFile, setProfileImageFile] = useState<any>(null);
    const [
        profileImageFileForUpload,
        setProfileImageFileForUpload,
    ] = useState<any>(null);
    const [onboardingDate, setOnboardingDate] = useState();
    const [selectedTeamIndex, setSelectedTeamIndex] = useState<
        number | undefined
    >();
    const [newMember, setNewMember] = useState<Member>({
        first_name: '',
        last_name: '',
        email: '',
        onboarding_date: '',
        team: '',
    });
    const [submitErrors, setSubmitErrors] = useState<any>({});
    const [teamsOptions, setTeamOptions] = useState<AutoSelectOption[]>([]);

    /// Use Effects
    useEffect(() => {
        setTeamOptions(
            (teams || []).map(teamItem => ({
                value: teamItem.name,
                label: teamItem.name,
            }))
        );
    }, [teams]);

    /// Event Handlers

    const hasError = (field: string) => {
        if (submitErrors.detail && submitErrors.detail[field]) {
            return submitErrors.detail[field];
        }
        return false;
    };

    const updateMemberData = (e: any) => {
        setNewMember({ ...newMember, [e.target.name]: e.target.value });
    };

    const setDate = (date: any) => {
        setOnboardingDate(date);
    };
    const onProfileImageChange = (e: any) => {
        setProfileImageFileForUpload(last(e.target.files));
        setProfileImageFile(URL.createObjectURL(e.target.files[0]));
    };

    const handleTeamChange = (item: any) => {
        if (item && item.value) {
            const tempOpts: AutoSelectOption[] = [...teamsOptions];
            const teamIndex = tempOpts.findIndex(
                (teamItem: any) => teamItem.value === item.value
            );

            if (teamIndex < 0) {
                tempOpts.unshift({
                    value: item.value,
                    label: item.value,
                });
                setSelectedTeamIndex(0);
                setTeamOptions(tempOpts);
            } else {
                setSelectedTeamIndex(teamIndex);
            }
            setNewMember({ ...newMember, team: item.value });
        }
    };

    /// Logic Functions
    const saveNewUser = () => {
        createMember(
            {
                ...newMember,
                onboarding_date: dayJs(onboardingDate).format('YYYY/MM/DD'),
            },
            {
                onSuccess: (newMemberVariables, newMemberRes) => {
                    if (profileImageFileForUpload) {
                        const avatar = new FormData();
                        avatar.append('avatar', profileImageFileForUpload);
                        updateMemberAvatar(
                            { avatar, userId: newMemberVariables.id },
                            {
                                onSuccess: () => {
                                    history.push(routeTo('members'));
                                },
                            }
                        );
                    } else {
                        history.push(routeTo('members'));
                    }
                },
                onError: (err: any) => {
                    setSubmitErrors(err?.response?.data?.errors || {});
                },
            }
        );
    };
    return (
        <div
            className={`${cn(className)} h-full bg-white`}
            style={{ height: 'calc(100vh - 140px)' }}
        >
            <form onSubmit={handleSubmit(saveNewUser)}>
                <div className=' h-full p-24 pb-40'>
                    <div className='grid grid-cols-5 gap-40 mt-70 px-70'>
                        <div className='col-span-3 '>
                            <div className='  flex  '>
                                <span>
                                    <h4 className='font-semibold text-blue-900 -mt-50'>
                                        Member information
                                    </h4>
                                </span>
                            </div>
                            <div className='flex'>
                                <UploadProfileImage
                                    id='member-avatar'
                                    selectedImage={profileImageFile}
                                    onChange={onProfileImageChange}
                                />
                                <div className='grid grid-cols-1 gap-4 w-full ml-40'>
                                    <div className='col-span-1'>
                                        <InputText
                                            id='first-name'
                                            ref={register}
                                            onChange={updateMemberData}
                                            value={newMember.first_name}
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
                                    <div className='col-span-1'>
                                        <InputText
                                            id='last-name'
                                            ref={register}
                                            hasError={hasError('last_name')}
                                            onChange={updateMemberData}
                                            value={newMember.last_name}
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
                                    <div className='col-span-1 '>
                                        <CreatableSelectInput
                                            id='select-team'
                                            options={teamsOptions}
                                            onChange={handleTeamChange}
                                            hasError={hasError('team')}
                                            selectedItemIndex={
                                                selectedTeamIndex
                                            }
                                            isTypeable
                                        />
                                        <p
                                            className='text-red-500 mb-10'
                                            hidden={hasError('team') === false}
                                        >
                                            {hasError('team')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 gap-4 w-full '>
                                <div className='col-span-1'>
                                    <InputText
                                        id='email'
                                        ref={register({
                                            required: 'Required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message:
                                                    'invalid email address',
                                            },
                                        })}
                                        hasError={
                                            hasError('email') || errors.email
                                        }
                                        onChange={updateMemberData}
                                        value={newMember.email}
                                        name='email'
                                        placeholder='Email'
                                        type='text'
                                    />
                                    {errors.email && (
                                        <span
                                            id='email-pattern-error'
                                            className='text-red-500 -mt-20'
                                        >
                                            {errors.email.message}
                                        </span>
                                    )}
                                    <p
                                        id='email-existed-error'
                                        className='text-red-500 mb-10'
                                        hidden={hasError('email') === false}
                                    >
                                        {hasError('email')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-2 -mt-50'>
                            <span>
                                <h4 className='font-semibold text-blue-900 mt-4 ml-12'>
                                    Oboarding date
                                </h4>
                            </span>
                            <NiceDatePickerCalendar
                                date={onboardingDate}
                                onDateChange={setDate}
                            />
                        </div>
                    </div>
                    <div className='flex justify-center mt-70'>
                        <div className=''>
                            <Button
                                onClick={() => {
                                    history.push(routeTo('members'));
                                }}
                                color='white'
                                text='CANCEL'
                                className='px-30 -mr-0 -mt-8 w-124'
                            />
                            <Button
                                id='submit-new-member'
                                type='submit'
                                onClick={() => {
                                    setSubmitErrors({});
                                }}
                                color='blue'
                                text='ADD'
                                className='px-30 -mr-0 -mt-8 w-124 justify-center'
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddMember;
