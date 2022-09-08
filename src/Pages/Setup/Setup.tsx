import React, { Fragment, useRef, FC, useState } from "react";
/* components */
/* modules */
import cn from 'clsx';
import { SetupStepper } from "Components/Molecules/SetupStepper";
import { cond } from "lodash";
import ImportTeamMethodPage from "Pages/SettingUpPages/ImportTeamMethodPage/ImportTeamMethodPage";
import BulkUploadPage from "Pages/SettingUpPages/BulkUploadPage/BulkUploadPage";
import MembersListTablePage from "Pages/SettingUpPages/MembersListTablePage/MembersListTablePage";
import AssignToolsToTeamsPage from "Pages/SettingUpPages/AssignToolsToTeamsPage/AssignToolsToTeamsPage";
import SelectMailService from "Pages/SettingUpPages/SelectMailService/SelectMailService";
import { useHistory, useParams } from "react-router-dom";
import { useUpdateSetupStep } from "Hooks/api";
import { routeTo } from "Helpers/routeTo";
import { Steps } from 'Components/Organisms/SetupProcessBanner';
import { SettingUpModal } from "Components/Organisms/SettingUpModal";
/* helpers */
/* assets */
/* styles */
/* types */
const Setup: FC = () => {
    const history = useHistory();
    const params: { step: string } = useParams();
    const { mutate: updateSetupStep } = useUpdateSetupStep();
    const formRef = useRef<any>(null);
    const redirectToDashboard = () => {
        setShowSetup(false);
        history.push(routeTo('dashboard'));
    };
    const setupDone = (checked: boolean) => {
        updateSetupStep(
            {
                setup_process_step: 'finished',
                setup_finished: true,
                send_bulk_invitation_emails: checked,
            },
            {
                onSuccess: () => {
                    setShowSetup(false);
                    history.push(routeTo('dashboard'));
                },
            }
        );
    };

    const [currentStep, setCurrentStep] = useState(
        params.step === Steps.first
            ? 0
            : params.step === Steps.second
                ? 1
                : params.step === Steps.forth
                    ? 3
                    : params.step === Steps.fifth
                        ? 4
                        : 0
    );
    const [prevStep, setPrevStep] = useState(0);
    const [showSetup, setShowSetup] = useState(true);
    const [fileName, setFileName] = useState('');
    const [fileUploadFinished, setFileUploadFinished] = useState(false);
    const [mailServiceSelected, setMailServiceSelected] = useState(false);

    const isFirstStep = (currentStep: number) => currentStep === 0;
    const isSecondStep = (currentStep: number) => currentStep === 1;
    const isThirdStep = (currentStep: number) => currentStep === 2;
    const isForthStep = (currentStep: number) => currentStep === 3;
    const isFifthStep = (currentStep: number) => currentStep === 4;

    const getStepContent = (step: number): JSX.Element => {
        return cond<number, JSX.Element>([
            [
                isFirstStep,
                () => (
                    <SelectMailService
                        formRef={formRef}
                        mailServiceSelected={setMailServiceSelected}
                    />
                ),
            ],
            [
                isSecondStep,
                () => (
                    <ImportTeamMethodPage
                        setCurrentStep={setCurrentStep}
                        setPrevStep={setPrevStep}
                    />
                ),
            ],
            [
                isThirdStep,
                () => (
                    <BulkUploadPage
                        setFileUploadFinished={setFileUploadFinished}
                        setPrevStep={setPrevStep}
                        setFileName={setFileName}
                    />
                ),
            ],
            [
                isForthStep,
                () => (
                    <MembersListTablePage prevStep={prevStep} />
                ),
            ],
            [
                isFifthStep,
                () => (
                    <AssignToolsToTeamsPage />
                ),
            ],
        ])(step);
    };

    function getSteps(): string[] {
        return ['Email service', 'Import type', 'Upload file', 'view / edit list members', 'Add tools to team/s'];
    }

    return (
        <>
            { showSetup && (
                <SettingUpModal
                    setStepNumber={setCurrentStep}
                    currentStep={currentStep}
                    prevStep={prevStep}
                    title={''}
                    formRef={formRef}
                    skipOrClose={redirectToDashboard}
                    done={setupDone}
                    fileUploadDone={fileUploadFinished}
                    mailServiceSelected={mailServiceSelected}
                    fileName={fileName}
                ><SetupStepper getSteps={getSteps} activeStep={currentStep} />

                    {getStepContent(currentStep)}
                </SettingUpModal>
            )}
        </>
    );
};

export default Setup;