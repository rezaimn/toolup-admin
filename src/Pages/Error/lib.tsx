export type ErrorStatus = 'invalid_token' | 'expired_token';

type Return = {
    title: string;
    message: string;
};

export const buildErrorMessage = (type: ErrorStatus): Return => {
    switch (type) {
        case 'invalid_token':
        case 'expired_token':
            return {
                title: 'Registration Failed!',
                message:
                    'Sorry verification failed! Please request a new verification link',
            };

        default:
            return { title: '', message: '' };
    }
};
