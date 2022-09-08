import { useCallback, useEffect, useRef, useState } from 'react';

export function useStateCallback<T>(
    initialState: T
): readonly [T, (x: any, cb: any) => void] {
    const [state, setState] = useState<T>(initialState);
    const cbRef = useRef<any>(null); // mutable ref to store current callback

    const setStateCallback = useCallback((x, cb) => {
        cbRef.current = cb; // store passed callback to ref
        setState(x);
    }, []);

    useEffect(() => {
        // cb.current is `null` on initial render, so we only execute cb on state *updates*
        if (cbRef.current) {
            cbRef?.current?.(state);
            cbRef.current = null; // reset callback after execution
        }
    }, [state]);

    return [state, setStateCallback] as const;
}
