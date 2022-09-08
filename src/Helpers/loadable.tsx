import React, { lazy, Suspense } from 'react';

type Props = {
    fallback?: React.ReactNode | null;
};
/**
 *
 * @param importFunc
 * @param param1
 * @description lazy loads the component
 */
export const loadable = <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    { fallback = null }: Props = { fallback: null }
) => {
    const LazyComponent = lazy(importFunc);

    return (props: React.ComponentProps<T>): JSX.Element => (
        <Suspense fallback={fallback}>
            <LazyComponent {...props} />
        </Suspense>
    );
};
