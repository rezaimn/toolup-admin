/* constants */
/* modules */
import { useMutation, UseMutationResult } from 'react-query';
/* services */
import { http } from 'Http/api';
import { AxiosError } from 'axios';
import API_URLS from 'Constants/apiUrls';
import { isEqual } from 'lodash/fp';
import { message } from 'Components/Atoms/Message';
/* types */

type TData = {
    code: string;
    created_at: null;
    data: {
        price: number;
        features: {
            [k: string]: string[];
        };
    };
    expires_at: null;
    id: number;
    plan: string;
    quantity: number;
    reward: null;
    starts_at: null;
    type: string;
    updated_at: null;
};
type TError = AxiosError;
type TVariables = {
    code: string;
};
type TContext = {
    rollback: () => void;
};

export type { TData as ValidateReedemCodeTData };
export type { TError as ValidateReedemCodeTError };
export type { TVariables as ValidateReedemCodeTVariables };
export type { TContext as ValidateReedemCodeTContext };

async function fn(variables: TVariables): Promise<TData> {
    const { data } = await http.post<TData>(
        API_URLS.validateReedemCode,
        variables,
        {
            shouldAuthenticate: false,
            headers: {
                'X-Toolup-Seed': 1,
            },
        }
    );
    return data;
}

export function useValidateRedeemCode(): UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
> {
    return useMutation(API_URLS.validateReedemCode, fn, {
        onMutate,
        onError,
        onSuccess,
    });
}

function onMutate(v: TVariables): TContext {
    return {
        rollback: () => {},
    };
}

function onError(e: TError, v: TVariables, context?: TContext) {
    if (isEqual(e?.response?.status)(422)) {
        message.error('Something went wrong!');
    }

    if (isEqual(e?.response?.status)(429)) {
        message.error('Too many requests!, please try again in 5 mins.');
    }
}

function onSuccess(d: TData, v: TVariables, context?: TContext) {
    /* revalidate data */
}
