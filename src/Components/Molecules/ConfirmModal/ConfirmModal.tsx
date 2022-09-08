import { ComponentPropsWithoutRef, FC } from 'react';
/* components */

/* modules */
import cn from 'clsx';
import { Button } from 'Components/Atoms/Button';
import { Modal } from 'Components/Atoms/Modal';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonConfirmModalProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
    title: string;
    message: string;
    confirmText?: string;
    closeText?: string;
    isLoading?: boolean;
};
export type ConfirmModalProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonConfirmModalProps
> &
    CommonConfirmModalProps;

export const ConfirmModal: FC<ConfirmModalProps> = ({
    className,
    isOpen = false,
    onClose,
    onConfirm,
    message,
    title,
    confirmText = 'Yes',
    closeText = 'Cancel',
    isLoading = false,
    ...restProps
}) => {
    const Footer = () => (
        <div>
            <Button onClick={onClose}>{closeText}</Button>
            <Button
                disabled={isLoading}
                type='primary'
                danger
                onClick={onConfirm}
                loading={isLoading}
            >
                {confirmText}
            </Button>
        </div>
    );
    return (
        <Modal
            onCancel={onClose}
            visible={isOpen}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            title={title}
            footer={<Footer />}
        >
            <span>{message}</span>
        </Modal>
    );
};
