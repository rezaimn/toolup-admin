import { FC } from 'react';
/* modules */
import cn from 'clsx';
import { cond, isEqual, negate } from 'lodash/fp';
import { AddToolSearch } from 'Pages/AddTool/AddTool';
/* styles */
import styles from './AddToolStepperButtons.styles.module.scss';

type Props = {
    activeStep: number;
    isToolSelected: boolean;
    handleAddATool: () => void;
    handleSaveAndAddNewTool: () => void;
    handleSaveAndAddToTeam: () => void;
    handleFinish: () => void;
    areSecondStepButtonsDisabled: boolean;
    search: AddToolSearch;
    onAddACustomTool: () => void;
    setSelectedToolId: (x: any, cb: any) => void;
    selectedToolId: number;
    handleSaveAndFinish: () => void;
};

const isFirstStep = (currentStep: number) => currentStep === 0;
const isSecondStep = (currentStep: number) => currentStep === 1;
const isThirdStep = (currentStep: number) => currentStep === 2;
const isEmptyString = (text: string) => text?.length === 0;

export const AddToolStepperButtons: FC<Props> = ({
    activeStep,
    isToolSelected,
    handleAddATool,
    handleSaveAndAddNewTool,
    handleSaveAndAddToTeam,
    handleFinish,
    areSecondStepButtonsDisabled,
    search,
    onAddACustomTool,
    setSelectedToolId,
    selectedToolId,
    handleSaveAndFinish,
}) => {
    const renderFirstStepText = (): string => {
        if (
            isEmptyString(search?.term) &&
            negate(isEqual(0))(search.resultsCount) &&
            isToolSelected
        ) {
            return 'add the tool';
        }

        if (
            negate(isEmptyString)(search?.term) &&
            isEqual(0)(search.resultsCount)
        ) {
            return 'add a custom tool';
        }

        return 'add the tool';
    };

    const isDisabled = () => {
        if (
            !isToolSelected &&
            !isEmptyString(search.term) &&
            isEqual(0)(search.resultsCount)
        ) {
            return false;
        }

        if (isToolSelected) {
            return false;
        }
        return true;
    };

    const handleFirstStepClick = () => {
        if (!isEmptyString(search.term) && isEqual(0)(search.resultsCount)) {
            if (isEqual(0)(selectedToolId)) {
                onAddACustomTool();
            }

            setSelectedToolId(0, () => {
                onAddACustomTool();
            });
            return;
        }

        if (negate(isEqual(false))(isToolSelected)) {
            handleAddATool();
        }
    };

    const buttons = cond<number, JSX.Element>([
        [
            isFirstStep,
            () => (
                <button
                    onClick={handleFirstStepClick}
                    type='button'
                    data-cy="first-step"
                    disabled={isDisabled()}
                    className={cn(styles.button, {
                        [styles.disabled]: isDisabled(),
                        [styles.primary]: !isDisabled(),
                    })}
                >
                    {renderFirstStepText()}
                </button>
            ),
        ],
        [
            isSecondStep,
            () => (
                <div className={cn('flex', 'space-x-16')}>
                    <button
                        onClick={handleSaveAndAddNewTool}
                        type='button'
                        id="save-and-add-tools"
                        data-cy="save-and-add-tools"
                        className={cn(styles.button, styles.outline, {
                            [styles.disabled]: areSecondStepButtonsDisabled,
                        })}
                    >
                        SAVE AND ADD A NEW TOOL
                    </button>
                    <button
                        onClick={handleSaveAndFinish}
                        type='button'
                        id="save-and-finish"
                        data-cy="save-and-finish"
                        className={cn(styles.button, styles.outline, {
                            [styles.disabled]: areSecondStepButtonsDisabled,
                        })}
                    >
                        SAVE AND FINISH
                    </button>
                    <button
                        onClick={handleSaveAndAddToTeam}
                        type='button'
                        id="save-and-add-team"
                        data-cy="save-and-add-team"
                        className={cn(styles.button, styles.primary, {
                            [styles.disabled]: areSecondStepButtonsDisabled,
                        })}
                    >
                        save and add to team
                    </button>
                </div>
            ),
        ],
        [
            isThirdStep,
            () => (
                <button
                    onClick={handleFinish}
                    type='button'
                    data-cy="finish"
                    className={cn(styles.button, styles.primary)}
                >
                    Finish
                </button>
            ),
        ],
    ])(activeStep);

    return <div className={styles.buttonsWrap}>{buttons}</div>;
};
