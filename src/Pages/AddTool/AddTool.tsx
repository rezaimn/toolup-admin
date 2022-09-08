import { FC, useEffect, useRef, useState } from 'react';
/* components */
import { SetupTeamToolsWrapper } from 'Components/Organisms/SetupTeamTools/SetupTeamToolsWrapper';
import { AddToolStepper } from 'Components/Molecules/AddToolStepper';
import { AddToolStepperButtons } from 'Components/Molecules/AddToolStepper/AddToolStepperButtons';
import { EditToolWrapper } from 'Components/Templates/EditToolWrapper';
/* modules */
import cn from 'clsx';
import { useHistory, useParams } from 'react-router-dom';
import { Tool, useTool } from 'Hooks/api';
import useList from 'Hooks/useList';
import useGetSetState from 'Hooks/useGetSetState';
import { queryClient } from 'Services/ReactQueryService';
/* helpers */
import { isEqual, negate as not, cond } from 'lodash/fp';
import { routeTo } from 'Helpers/routeTo';
import { useStateCallback } from 'Hooks/useStateCallback';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */

export type AddToolSearch = {
    term: string;
    resultsCount: number;
};

const AddTool: FC = () => {
    const params: { id: string } = useParams();
    const [activeStep, setActiveStep] = useState(
        parseInt(params.id) !== 0 ? 1 : 0
    );
    const [selectedToolId, setSelectedToolId] = useStateCallback(
        parseInt(params.id) || 0
    );

    const [get, setState] = useGetSetState({
        navigate: 'next',
    });

    const [formMode, setFormMode] = useState<'create' | 'config'>('config');

    const initialSearch = {
        term: '',
        resultsCount: 0,
    };
    const [search, setSearch] = useState<AddToolSearch>(initialSearch);

    const [newTools, { push }] = useList<Tool>([]);

    const isToolRequestEnabled =
        not(isEqual(0))(selectedToolId) && not(isEqual(0))(activeStep);

    const { data: tool, isLoading: toolIsLoading, refetch } = useTool(
        selectedToolId,
        {
            enabled: isToolRequestEnabled,
        }
    );

    useEffect(() => {
        if (isToolRequestEnabled) {
            refetch();
        }
    }, [selectedToolId]);

    const history = useHistory();
    const formRef = useRef<any>(null);

    const handleNextStep = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handlePreviousStep = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleAddATool = () => {
        handleNextStep();
    };

    const handleOnNotFoundToolButtonClick = () => {
        setFormMode('create');
        handleNextStep();
    };

    const handleSaveAndAddNewTool = () => {
        setState({ navigate: 'previous' });
        formRef?.current.onSubmit();
    };

    const handleSaveAndAddToTeam = () => {
        setState({ navigate: 'next' });
        formRef?.current.onSubmit();
    };

    const onSuccess = (addedTool: Tool) => {
        if (isEqual('previous')(get().navigate)) {
            handlePreviousStep();
            setSelectedToolId(0, () => {});
            setFormMode('config');
            queryClient.invalidateQueries(API_URLS.unusedTools);
        }

        if (isEqual('next')(get().navigate)) {
            handleNextStep();
            setSelectedToolId(0, () => {});
            setFormMode('config');
            queryClient.invalidateQueries(API_URLS.unusedTools);
        }

        if (isEqual('finish')(get().navigate)) {
            history.push(routeTo('toolsManagement'));
            queryClient.invalidateQueries(API_URLS.unusedTools);
        }
    };

    const handleSaveAndFinish = () => {
        setState({ navigate: 'finish' });
        formRef?.current.onSubmit();
    };

    const handleFinish = () => {
        history.push(routeTo('toolsManagement'));
    };

    const isFirstStep = (currentStep: number) => currentStep === 0;
    const isSecondStep = (currentStep: number) => currentStep === 1;
    const isThirdStep = (currentStep: number) => currentStep === 2;

    const getStepContent = (step: number): JSX.Element => {
        return cond<number, JSX.Element>([
            [
                isFirstStep,
                () => (
                    <SetupTeamToolsWrapper
                        searchClsx={styles.search}
                        includeTeamsToolAssignment={false}
                        className={cn('h-0 flex-grow', 'mt-10', styles.tools)}
                        onToolClick={toolId =>
                            setSelectedToolId(toolId, () => {})
                        }
                        toolSelectionMode='select'
                        selectedToolId={selectedToolId}
                        showCategorizedToolsUnderSearchResult={false}
                        addToolButtonFunctionalityMode='triggerOut'
                        onAddButtonClick={handleOnNotFoundToolButtonClick}
                        setSearch={setSearch}
                        includeCategorized={isEqual('')(search.term)}
                        includeAddButton={false}
                        noResultsFoundMessage='Add your tool by clicking on the button "ADD A CUSTOM TOOL"'
                        toolsQueryMode='unConfiguredTools'
                    />
                ),
            ],
            [
                isSecondStep,
                () => {
                    if (toolIsLoading) {
                        return <div>loading....</div>;
                    }
                    return (
                        <EditToolWrapper
                            className={styles.form}
                            toolId={parseInt(params.id) || selectedToolId}
                            formRef={formRef}
                            includeSubmit={false}
                            onSuccess={addedTool => onSuccess(addedTool)}
                            mode={formMode}
                            tool={tool!}
                            isDeletable={false}
                        />
                    );
                },
            ],
            [
                isThirdStep,
                () => (
                    <SetupTeamToolsWrapper
                        searchClsx={styles.search}
                        includeTeamsToolAssignment
                        includeSearch={false}
                        className={cn('h-0 flex-grow', 'mt-30', styles.tools)}
                        toolBoxType='large'
                        onlyNewTools
                        includeCategorized={false}
                    />
                ),
            ],
        ])(step);
    };

    function getSteps(): string[] {
        return ['Find A Tool', 'Setting', 'Add To Team/s'];
    }

    return (
        <div className={styles.addTool}>
            <AddToolStepper getSteps={getSteps} activeStep={activeStep} />

            {getStepContent(activeStep)}

            <div className={styles.buttons}>
                <AddToolStepperButtons
                    isToolSelected={not(isEqual(0))(selectedToolId)}
                    activeStep={activeStep}
                    handleAddATool={handleAddATool}
                    handleSaveAndAddNewTool={handleSaveAndAddNewTool}
                    handleSaveAndAddToTeam={handleSaveAndAddToTeam}
                    handleFinish={handleFinish}
                    areSecondStepButtonsDisabled={toolIsLoading}
                    search={search}
                    onAddACustomTool={handleOnNotFoundToolButtonClick}
                    setSelectedToolId={setSelectedToolId}
                    selectedToolId={selectedToolId}
                    handleSaveAndFinish={handleSaveAndFinish}
                />
            </div>
        </div>
    );
};

export default AddTool;
