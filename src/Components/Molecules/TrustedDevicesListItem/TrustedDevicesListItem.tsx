import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
import { Button } from 'Components/Atoms/Button';
/* modules */
import cn from 'clsx';
import { TrustedDevice, useDeleteDevice } from 'Hooks/api/passwordManagement';
import dayJs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { isEqual } from 'lodash/fp';
/* constants */
import { PASSWORD_MANAGEMENT } from 'Constants/configs';
/* helpers */
import * as LocalStorage from 'Helpers/localStorage';
/* assets */
import ComputerIcon from 'assets/icons/computer.svg';
/* styles */
import s from './styles.module.scss';
import { ConfirmModal } from '../ConfirmModal';
/* types */
export type CommonTrustedDevicesListItemProps = {
    device: TrustedDevice;
};
export type TrustedDevicesListItemProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTrustedDevicesListItemProps
> &
    CommonTrustedDevicesListItemProps;

dayJs.extend(duration);
dayJs.extend(relativeTime);

export const TrustedDevicesListItem: FC<TrustedDevicesListItemProps> = ({
    className,
    device,
    ...restProps
}) => {
    const deviceUUIDFromLocalStorage = LocalStorage.getItem(
        PASSWORD_MANAGEMENT.LOCAL_STORAGE.DEVICE_UUID
    ) as string;

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleOpenModal = () => setDeleteModalOpen(true);
    const handleCloseModal = () => setDeleteModalOpen(false);

    const {
        mutate: deleteDevice,
        isLoading: deleteDeviceIsLoading,
    } = useDeleteDevice();

    const renderDevice = (id: string, dId: string): string | JSX.Element => {
        if (isEqual(id)(dId)) {
            return `The current device you are logged in`;
        }

        return <Button onClick={handleOpenModal}>Remove</Button>;
    };

    const handleDeleteDevice = (deviceId: number) => () =>
        deleteDevice(
            { deviceId },
            {
                onSuccess: () => {
                    handleCloseModal();
                },
            }
        );

    return (
        <div className={s.device}>
            <img src={ComputerIcon} alt={device?.client} className={s.icon} />
            <div className={s.details}>
                <div className={s.name}>
                    {device?.client}, {device?.client_version}
                </div>
                <div className={s.content}>
                    <div className={s.col}>
                        <p>{device?.last_ip || 'IP ADDRESS NOT_VALID'}</p>
                        <div>
                            {device?.country_alpha2 || 'COUNTRY NOT AVAILABLE'}
                        </div>
                    </div>
                    <div className={s.col}>
                        <p>
                            {device?.os_name} {device?.os_version}
                        </p>

                        <p>{humanizeDate(new Date(device?.last_used))}</p>
                    </div>

                    <div className={cn(s.col, s.actions)}>
                        {renderDevice(device.uuid, deviceUUIDFromLocalStorage)}
                    </div>
                </div>
            </div>

            <ConfirmModal
                message='Are you sure you want to delete this device?'
                title='Delete Device Confirm'
                onClose={handleCloseModal}
                isOpen={deleteModalOpen}
                onConfirm={handleDeleteDevice(device?.id)}
                isLoading={deleteDeviceIsLoading}
            />
        </div>
    );
};

const humanizeDate = (date: Date) => {
    if (!dayJs(date).isValid()) return 'Invalid Date';

    return `${dayJs(date).fromNow()} at ${dayJs(date).format('hh:mm A')}`;
};
