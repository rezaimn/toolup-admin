import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
} from 'react';
/* components */
import Button from 'Components/Atomes/Button/Button';
/* modules */
import cn from 'clsx';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    useCreateBulkData,
    useResetOrganization,
    useUpdateSetupStep,
} from 'Hooks/api';
import { caution, closeIcon, questionMarkIcon } from 'assets/icons';
import { Steps } from 'Components/Organisms/SetupProcessBanner';
import { Checkbox } from 'Components/Atomes/Checkbox';
import { stepsElements } from 'Constants/setupConfigElements';
import { setMembers } from 'Store/member/MemberAction';
import { routeTo } from 'Helpers/routeTo';
import { toast } from 'Components/Atomes/ToastContainer';
import { toString } from 'lodash/fp';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonSettingUpModalProps = {
    children: any;
    title: string;
    currentStep: number;
    prevStep: number;
    setStepNumber: (step: number) => void;
    skipOrClose: () => void;
    done: (checked: boolean) => void;
    fileUploadDone: boolean;
    fileName: string;
    formRef: any;
    mailServiceSelected: boolean;
};

export type SettingUpModalProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSettingUpModalProps
> &
    CommonSettingUpModalProps;

export const SettingUpModal: FC<SettingUpModalProps> = ({
    className,
    children = <></>,
    title = '',
    currentStep = 0,
    prevStep = 0,
    setStepNumber,
    skipOrClose,
    done,
    formRef,
    fileUploadDone = false,
    mailServiceSelected,
    fileName,
    ...restProps
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [stepsConfigElements, setStepsConfigElements] = useState(
        stepsElements
    );
    const [emailChecked, setEmailChecked] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const { mutate: updateSetupStep } = useUpdateSetupStep();
    const { mutate: createBulkData } = useCreateBulkData();
    const { mutate: resetOrganization } = useResetOrganization();
    useEffect(() => {
        if (fileUploadDone) {
            const stepsConfigElementsT = [...stepsConfigElements];
            stepsConfigElementsT[2].buttons[1].active = true;
            setStepsConfigElements(stepsConfigElementsT);
        }
    }, [fileUploadDone]);
    useEffect(() => {
        if (mailServiceSelected) {
            const stepsConfigElementsT = [...stepsConfigElements];
            stepsConfigElementsT[0].buttons[0].active = true;
            setStepsConfigElements(stepsConfigElementsT);
        }
    }, [mailServiceSelected]);
    const updateStatus = () => {
        if (currentStep === 0) {
            formRef?.current.onSubmit();
        } else if (currentStep === 2) {
            createBulkData(
                {
                    members_file: fileName,
                    options: {
                        system_setup_step: Steps.forth,
                    },
                },
                {
                    onSuccess: response => {
                        dispatch(setMembers(response));
                        history.push(routeTo('intro', { step: Steps.forth }));
                    },
                    onError: error => {
                        toast('error', toString(error));
                    },
                }
            );
        } else if (currentStep === 3) {
            updateSetupStep(
                {
                    setup_process_step: Steps.fifth,
                    setup_finished: false,
                    send_bulk_invitation_emails: undefined,
                },
                {
                    onSuccess: () => {
                        history.push(routeTo('intro', { step: Steps.fifth }));
                    },
                    onError: error => {
                        toast('error', toString(error));
                    },
                }
            );
        }
    };
    return (
        <div
            className='fixed z-10 inset-0 overflow-y-auto'
            style={{
                backdropFilter: 'blur(4px)',
                backgroundColor: 'transparent',
            }}
        >
            <div className='flex items-end justify-center min-h-screen lg:pt-2 lg:px-1 lg:pb-20 text-center block p-0'>
                <div
                    className='fixed inset-0 transition-opacity'
                    aria-hidden='true'
                >
                    <div className='absolute inset-0 bg-gray-300 opacity-50'></div>
                </div>

                <span
                    className='hidden inline-block align-middle h-screen'
                    aria-hidden='true'
                >
                    &#8203;
                </span>
                <div
                    className='w-full md:w-4/5 lg:10/12 inline-block items-center content-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all justify-center self-center lg:align-middle  '
                    role='dialog'
                    aria-modal='true'
                    aria-labelledby='modal-headline'
                >
                    <div className='bg-white shadow overflow-hidden rounded-lg'>
                        <div className='lg:px-4 py-5 px-6 w-1/10'>
                            <div className='grid lg:grid-cols-6 col-auto gap-4'>
                                <div className='lg:text-lg text-xs mt-20 ml-20 font-medium col-start-1 lg:col-end-3 col-end-5 text-gray-500'>
                                    <span className={'font-semibold py-10'}>
                                        Set up your team and tools
                                    </span>
                                </div>
                                {currentStep !== 0 && (
                                    <div className='col-end-7 col-span-2 mt-20 mr-20'>
                                        <div
                                            className='float-right cursor-pointer'
                                            onClick={skipOrClose}
                                        >
                                            <img
                                                src={closeIcon}
                                                className='px-3'
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            style={{ height: '80vh', marginTop: '-50px' }}
                            className={`${showMessage
                                ? 'opacity-30 pointer-events-none'
                                : ''
                                } lg:px-120 px-12 pt-50 pb-30`}
                        >
                            {children}
                        </div>
                        <div className='lg:px-4 py-5 px-6'>
                            {showMessage ? (
                                <div className='flex'>
                                    <div className='flex-none'>
                                        <Button
                                            text={'Yes'}
                                            onClick={() => {
                                                dispatch(setMembers([]));
                                                resetOrganization(
                                                    {
                                                        reset_members: true,
                                                        reset_teams: true,
                                                        reset_setup: true,
                                                    },
                                                    {
                                                        onSuccess: () => {
                                                            setShowMessage(
                                                                false
                                                            );
                                                            history.push(
                                                                routeTo(
                                                                    'intro',
                                                                    {
                                                                        step:
                                                                            Steps.second,
                                                                    }
                                                                )
                                                            );
                                                        },
                                                    }
                                                );
                                            }}
                                            color={'blue'}
                                            className={
                                                'font-bold w-80 text-sm justify-center ml-19 mr-4'
                                            }
                                        />
                                        <Button
                                            text={'No'}
                                            onClick={() => {
                                                setShowMessage(false);
                                            }}
                                            color={'white'}
                                            className={
                                                'font-bold w-80 text-sm justify-center'
                                            }
                                        />
                                    </div>
                                    <div className='flex align-self flex-nowrap overflow-auto'>
                                        <img src={caution} className='w-22' />
                                        <span className='my-auto ml-10 text-base h-19'>
                                            Do you want to return? When you go
                                            back, all entered information will
                                            be deleted.
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                    <div className='grid lg:grid-cols-6 grid-auto gap-4'>
                                        <div className='col-start-1 col-end-3'>
                                            {stepsConfigElements[currentStep]
                                                .buttons[0].name === 'back' && (
                                                    <Button
                                                        text={'BACK'}
                                                        onClick={() => {
                                                            currentStep === 3
                                                                ? setShowMessage(true)
                                                                : setStepNumber(
                                                                    currentStep - 1
                                                                );
                                                        }}
                                                        color={'blue'}
                                                        className={'font-semibold'}
                                                    />
                                                )}
                                        </div>

                                        {stepsConfigElements[
                                            currentStep
                                        ].buttons.map(button => {
                                            return (
                                                <>
                                                    {button.name === 'next' && (
                                                        <div className='col-end-7 col-span-2'>
                                                            <div
                                                                className={
                                                                    'float-right'
                                                                }
                                                            >
                                                                <Button
                                                                    text={'NEXT'}
                                                                    onClick={() => {
                                                                        updateStatus();
                                                                    }}
                                                                    disabled={
                                                                        !button.active
                                                                    }
                                                                    color={
                                                                        button.active
                                                                            ? 'blue'
                                                                            : 'gray'
                                                                    }
                                                                    className={
                                                                        button.active
                                                                            ? 'cursor-pointer'
                                                                            : 'cursor-default' +
                                                                            ' font-semibold'
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {button.name === 'done' && (
                                                        <div className='col-end-7 col-span-4'>
                                                            <div
                                                                className={
                                                                    'float-right flex'
                                                                }
                                                            >
                                                                <Checkbox
                                                                    label='Invitation email will be sent to all the added members'
                                                                    labelClass='mx-10 block text-base text-gray-900'
                                                                    checked={
                                                                        emailChecked
                                                                    }
                                                                    onChange={() =>
                                                                        setEmailChecked(
                                                                            !emailChecked
                                                                        )
                                                                    }
                                                                    classNames='h-24 w-24 bg-blue-900 text-red-900 focus:ring-blue-900 border-gray-900 rounded-lg'
                                                                />
                                                                <Button
                                                                    text={'DONE'}
                                                                    onClick={() => {
                                                                        done(
                                                                            emailChecked
                                                                        );
                                                                    }}
                                                                    color={'blue'}
                                                                    className={
                                                                        'font-semibold'
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
