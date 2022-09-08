import { FC } from 'react';
import cn from 'clsx';
import { Spinner } from 'Components/Atomes/Spinner';

type StatusProps = {
    status: 'pending' | 'success';
    loading?: boolean;
    onChangeStatus?: () => void;
};

export const Status: FC<StatusProps> = ({
    status,
    loading = false,
    onChangeStatus,
    ...props
}) => {
    const clsx = [
        'bg-gray-400',
        'text-white',
        'w-92',
        'py-3',
        'text-center',
        'rounded-lg',
        'text-xs',
        'flex',
        'justify-center',
    ];

    if (loading) {
        return <Spinner className={cn(clsx)} />;
    }

    return (
        <div
            className={cn(clsx, makeStatusClsx(status))}
            onClick={() => onChangeStatus?.()}
            {...props}
        />
    );
};

const makeStatusClsx = (status: 'pending' | 'success') => {
    switch (status) {
        case 'success':
            return 'bg-green-400';

        case 'pending':
            return 'bg-gray-400';

        default:
            return '';
    }
};

type ProfileIconProps = {
    onboarded: boolean;
};

export const ProfileIcon: FC<ProfileIconProps> = ({ onboarded }) => {
    return (
        <div
            className={cn(
                'h-27',
                'w-27',
                'rounded-full',
                'bg-red-100',
                makeProfileIconClsx(onboarded)
            )}
        ></div>
    );
};

const makeProfileIconClsx = (onboarded: boolean) => {
    switch (onboarded) {
        case true:
            return 'bg-green-400';
        case false:
            return 'bg-red-100';
    }
};
