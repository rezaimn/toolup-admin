import { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
import { Steps } from 'Components/Atoms/Steps';
/* modules */
import clsx from 'clsx';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonAddToolStepperProps = {
    activeStep: number;
    getSteps: () => string[];
};
export type AddToolStepperProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonAddToolStepperProps
> &
    CommonAddToolStepperProps;

export const AddToolStepper: FC<AddToolStepperProps> = ({
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
                    return <Steps.Step title={i} />;
                })}
            </Steps>
        </div>
    );
};
