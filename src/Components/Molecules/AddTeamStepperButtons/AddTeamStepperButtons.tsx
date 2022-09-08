import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
import styles from 'Components/Molecules/AddToolStepper/AddToolStepperButtons.styles.module.scss';
import { cond } from 'lodash/fp';
import { isFirstStep, isSecondStep, isThirdStep } from 'Helpers/steps';
/* types */
type Props = {
    activeStep: number;
    isFirstStepDisabled: boolean;
    onClick: () => void;
    saveAndAddNewTeam: () => void;
    addToolsToTeams: () => void;
    addMembersToTeams: () => void;
    handleFinish: () => void;
    addMembersToTeams3rdStep: () => void;
    isAddMembersToTeamsButtonDisabled: () => boolean;
} & ComponentPropsWithoutRef<'div'>;

export const AddTeamStepperButtons: FC<Props> = ({
    isFirstStepDisabled,
    onClick,
    className,
    activeStep,
    saveAndAddNewTeam,
    addToolsToTeams,
    addMembersToTeams,
    handleFinish,
    addMembersToTeams3rdStep,
    isAddMembersToTeamsButtonDisabled,
}) => {
    const buttons = cond<number, JSX.Element>([
        [
            isFirstStep,
            () => (
                <>
                    <button
                        type='button'
                        disabled={isFirstStepDisabled}
                        className={cn(styles.button, styles.outline)}
                        onClick={onClick}
                        data-cy="save-and-add-team"
                    >
                        save and add new team
                    </button>

                    <button
                        type='button'
                        disabled={isAddMembersToTeamsButtonDisabled()}
                        className={cn(styles.button, styles.primary, {
                            [styles.disabled]: isAddMembersToTeamsButtonDisabled(),
                        })}
                        onClick={addMembersToTeams}
                        data-cy="save-and-add-member"
                    >
                        save and add members to team/s
                    </button>
                </>
            ),
        ],
        [
            isSecondStep,
            () => (
                <>
                    <button
                        type='button'
                        className={cn(styles.button, styles.outline)}
                        onClick={saveAndAddNewTeam}
                        data-cy="save-and-add-new-team"
                    >
                        save and add new team
                    </button>

                    <button
                        type='button'
                        className={cn(styles.button, styles.primary)}
                        onClick={addToolsToTeams}
                        data-cy="save-and-add-tools"
                    >
                        save and add tools to team/s
                    </button>
                </>
            ),
        ],
        [
            isThirdStep,
            () => (
                <>
                    <button
                        type='button'
                        className={cn(styles.button, styles.outline)}
                        onClick={addMembersToTeams3rdStep}
                        data-cy="add-members"
                    >
                        add members to team/s
                    </button>

                    <button
                        type='button'
                        className={cn(styles.button, styles.primary)}
                        onClick={handleFinish}
                        data-cy="finish"
                    >
                        finish
                    </button>
                </>
            ),
        ],
    ])(activeStep);

    return (
        <div
            className={cn(
                'flex items-center space-x-10 mx-auto mt-auto',
                className
            )}
        >
            {buttons}
        </div>
    );
};
