import { FC, useRef, useState } from 'react';
/* components */
import { AddTeamForm } from 'Components/Organisms/AddTeamForm';
import { AddToolStepper as AddTeamStepper } from 'Components/Molecules/AddToolStepper';
import { AddTeamStepperButtons } from 'Components/Molecules/AddTeamStepperButtons';
import { toast } from 'Components/Atomes/ToastContainer';
import { AddMembersToTeams } from 'Components/Organisms/AddMembersToTeams';
import { SetupTeamToolsWrapper } from 'Components/Organisms/SetupTeamTools/SetupTeamToolsWrapper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
/* modules */
import cn from 'clsx';
import { AddTeamPayload, useAddTeam, useNewTeams } from 'Hooks/api';
import { cond } from 'lodash/fp';
import { useHistory } from 'react-router';
import { useGetSetState } from 'react-use';
/* helpers */
import { isFirstStep, isSecondStep, isThirdStep } from 'Helpers/steps';
import { routeTo } from 'Helpers/routeTo';
import { queryClient } from 'Services/ReactQueryService';
import { and } from 'Helpers/fp';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* assets */
/* styles */
import styles from './styles.module.scss';

const getSteps = (): string[] => {
    return ['Create team', 'Add members to team/s', 'Add tools to team'];
};

const AddTeam: FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);

    const [canGoToNextStep, setCanGoToNextStep] = useState(false);

    const [addTeamFormErrors, setAddTeamFormErrors] = useState({});

    const { mutate: addTeam, isLoading: addTeamIsLoading } = useAddTeam();

    const [getNext, setNextState] = useGetSetState<{ action: 'next' | 'stay' }>(
        { action: 'next' }
    );

    const history = useHistory();
    const formRef = useRef<any>(null!);

    const handleNextStep = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handlePreviousStep = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleFinish = () => {
        history.push(routeTo('teams'));
    };

    const handleAddTeam = (v: AddTeamPayload) => {
        setAddTeamFormErrors({});
        addTeam(v, {
            onSuccess: data => {
                toast('success', `${data.name} team successfully added`);
                queryClient.invalidateQueries(API_URLS.newTeams);

                if (getNext().action === 'next') {
                    handleNextStep();
                    return;
                }

                if (getNext().action === 'stay') {
                    formRef?.current?.resetForm();
                }

                setCanGoToNextStep(true);
            },
            onError: (err: any) => {
                /*  toast('error', err.message); */
                setAddTeamFormErrors(err.detail);
            },
        });
    };

    const handleFormSubmit = () => {
        formRef?.current?.onSubmit();
    };

    const getStepContent = (step: number): JSX.Element => {
        return cond<number, JSX.Element>([
            [
                isFirstStep,
                () => (
                    <AddTeamForm
                        className={styles.content}
                        getFormValidity={setIsFormValid}
                        onSubmit={handleAddTeam}
                        ref={formRef}
                        formErrors={addTeamFormErrors}
                    />
                ),
            ],
            [
                isSecondStep,
                () => <AddMembersToTeams className={styles.content} />,
            ],
            [
                isThirdStep,
                () => <SetupTeamToolsWrapper className='h-0 flex-grow' />,
            ],
        ])(step);
    };

    return (
        <div className={styles.addTeam}>
            <AddTeamStepper getSteps={getSteps} activeStep={activeStep} />

            {getStepContent(activeStep)}

            <AddTeamStepperButtons
                className={styles.buttons}
                activeStep={activeStep}
                isFirstStepDisabled={!isFormValid || addTeamIsLoading}
                onClick={() => {
                    handleFormSubmit();
                    setNextState({ action: 'stay' });
                }}
                addToolsToTeams={handleNextStep}
                saveAndAddNewTeam={handlePreviousStep}
                addMembersToTeams={() => {
                    if (
                        and(
                            () => !isFormValid,
                            () => canGoToNextStep
                        )
                    ) {
                        handleNextStep();
                        return;
                    }

                    handleFormSubmit();
                    setNextState({ action: 'next' });
                }}
                addMembersToTeams3rdStep={handlePreviousStep}
                handleFinish={handleFinish}
                isAddMembersToTeamsButtonDisabled={() => {
                    if (addTeamIsLoading) {
                        return true;
                    }

                    if (canGoToNextStep) {
                        return false;
                    }
                    return !isFormValid || addTeamIsLoading;
                }}
            />
        </div>
    );
};

export default AddTeam;
