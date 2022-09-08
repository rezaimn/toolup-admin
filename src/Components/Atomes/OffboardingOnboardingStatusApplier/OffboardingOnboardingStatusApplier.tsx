import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Status } from 'Hooks/api';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonOffboardingOnboardingStatusApplierProps = {
    status: Status;
    isPending: boolean;
    boardedText: string;
    onPendingClick: () => void;
    onBoardingClick: () => void;
};

export type OffboardingOnboardingStatusApplierProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonOffboardingOnboardingStatusApplierProps
> &
    CommonOffboardingOnboardingStatusApplierProps;

export const OffboardingOnboardingStatusApplier: FC<OffboardingOnboardingStatusApplierProps> = ({
    className,
    status,
    isPending,
    boardedText,
    onBoardingClick,
    onPendingClick,
    ...restProps
}) => {
    return (
        <div className={cn(className, styles.wrapper)}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
            <span
                onClick={() => onPendingClick()}
                className={cn(styles.pending, {
                    [styles['bg-yellow']]: isPending,
                })}
            >
                Pending
            </span>
            <span
                onClick={() => onBoardingClick()}
                className={cn(styles.boarded, {
                    [styles['bg-green']]: !isPending,
                })}
            >
                {boardedText}
            </span>
        </div>
    );
};
