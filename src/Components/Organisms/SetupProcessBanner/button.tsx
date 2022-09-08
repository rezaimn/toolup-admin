import { ComponentPropsWithoutRef, FC } from 'react';
/* modules */
import cn from 'clsx';
/* styles */
import styles from './styles.module.scss';
import { Spinner } from 'Components/Atomes/Spinner';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    variant?: 'outline' | 'primary' | 'danger';
    loading?: boolean;
};

export const Button: FC<ButtonProps> = ({
    variant = 'outline',
    className,
    loading = false,
    children,
    ...restProps
}) => {
    return (
        <button
            type='button'
            className={cn(
                className,
                styles.button,
                { [styles.primaryButton]: variant === 'primary' },
                { [styles.outlineButton]: variant === 'outline' },
                { [styles.dangerButton]: variant === 'danger' }
            )}
            {...restProps}
        >
            {loading && <Spinner className={styles.buttonSpinner} />}
            {!loading && children}
        </button>
    );
};
