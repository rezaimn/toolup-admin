import React, { ComponentPropsWithoutRef, FC, forwardRef } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */

type Props = ComponentPropsWithoutRef<'input'> & {
    error: string;
};

type Ref = HTMLInputElement;

export const AddTeamLargeInput = forwardRef<Ref, Props>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className={cn(styles.wrap, className)}>
                <input
                    className={cn(styles.input, {
                        [styles.hasError]: !!error,
                    })}
                    ref={ref}
                    {...props}
                />
                <div
                    className={cn(styles.error, {
                        [styles.errorShow]: !!error,
                    })}
                >
                    {error}
                </div>
            </div>
        );
    }
);
