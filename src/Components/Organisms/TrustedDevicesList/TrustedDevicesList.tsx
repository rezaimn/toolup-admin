import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
import { TrustedDevicesListItem } from 'Components/Molecules/TrustedDevicesListItem';
import { ConfirmModal } from 'Components/Molecules/ConfirmModal';
import { Spinner } from 'Components/Atomes/Spinner';

/* modules */
import cn from 'clsx';
import {
    useTrustedDevices,
    TrustedDevice,
    useDeleteDevice,
    useCheckPasswordServiceActivation,
} from 'Hooks/api/passwordManagement';
import { isEmpty, map } from 'lodash/fp';
/* helpers */
/* assets */
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonTrustedDevicesListProps = unknown;
export type TrustedDevicesListProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTrustedDevicesListProps
> &
    CommonTrustedDevicesListProps;

export const TrustedDevicesList: FC<TrustedDevicesListProps> = ({
    className,
    ...restProps
}) => {
    const { data: passwordServiceStatus } = useCheckPasswordServiceActivation();

    const { data: trustedDevices, isLoading } = useTrustedDevices({
        enabled: passwordServiceStatus?.serviceActivationStatus,
    });

    if (
        !passwordServiceStatus?.serviceActivationStatus ||
        isEmpty(trustedDevices)
    ) {
        return <></>;
    }

    if (!trustedDevices || isLoading) {
        return (
            <div className={cn(className)}>
                <p className={s.title}>Your trusted devices</p>
                <div className={s.spinner}>
                    <Spinner />
                </div>
            </div>
        );
    }

    const renderTrustedDevices = map<TrustedDevice, JSX.Element>(td => (
        <TrustedDevicesListItem device={td} />
    ));

    return (
        <div className={cn(className)}>
            <p className={s.title}>Your trusted devices</p>
            {renderTrustedDevices(trustedDevices)}
        </div>
    );
};
