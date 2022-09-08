import { ComponentPropsWithoutRef, forwardRef } from 'react';
import cn from 'clsx';
import styles from './input.styles.module.scss';

export type InputProps = ComponentPropsWithoutRef<'input'> & {
    error?: string;
    value: string;
    isEditable?: boolean;
    help?: string;
};
export type InputRef = HTMLInputElement;

export const Input = forwardRef<InputRef, InputProps>(
    (
        { className, error, value, isEditable = true, help, ...restProps },
        ref
    ) => {
        if (isEditable) {
            return (
                <div className={cn('h-35', className)}>
                    <input
                        className={cn(styles.input, {
                            [styles.hasError]: !!error,
                        })}
                        ref={ref}
                        {...restProps}
                    />
                    <div
                        className={cn(styles.error, {
                            [styles.errorShow]: !!error,
                        })}
                    >
                        {error}
                    </div>
                    {help && <p className={styles.help}>{help}</p>}
                </div>
            );
        }
        return <div className={styles.toolName}>{value}</div>;
    }
);
