import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Steps } from 'Components/Atoms/Steps';
/* modules */
import clsx from 'clsx';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonSetupStepperProps = {
    activeStep: number;
    getSteps: () => string[];
};
export type SetupStepperProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSetupStepperProps
> &
    CommonSetupStepperProps;

export const SetupStepper: FC<SetupStepperProps> = ({
    className,
    activeStep,
    getSteps,
    ...restProps
}) => {
    return (
        <div className={clsx(className, styles.stepper)}>
            <Steps
                responsive
                current={activeStep}
                size='small'
                labelPlacement='vertical'
            >
                {getSteps().map(i => {
                    return <Steps.Step title={i} className={styles.stepItem} />;
                })}
            </Steps>
        </div>
    );
};
