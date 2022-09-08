/* components */
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Button } from 'Components/Organisms/SetupProcessBanner/button';
/* modules */
import { ReactNode } from 'react';
import rg4js from 'raygun4js';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */

type Props = {
    children: ReactNode;
};

export default ({ children }: Props): JSX.Element => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
            {children}
        </ErrorBoundary>
    );
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className={styles.alert}>
            <p className={styles.message}>Something went wrong!</p>

            <Button
                variant='primary'
                type='button'
                onClick={resetErrorBoundary}
            >
                Try again
            </Button>
        </div>
    );
}

const errorHandler = (error: Error, info: { componentStack: string }) => {
    rg4js('send', {
        error: error.message,
        customData: { info, err: error.message },
        tags: ['react-internal'],
    });
};
