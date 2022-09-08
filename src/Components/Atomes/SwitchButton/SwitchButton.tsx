import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
/* modules */
import './SwitchButton.scss';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';

export interface buttonProps {
    label: string;
    value: string;
    selectedBGColor: string;
    onClick: (status: string) => void;
}

/* types */
export type CommonSwitchButtonProps = {
    buttons: buttonProps[];
    defaultBGColor: string;
    selectedButton: any;
};

export type SwitchButtonProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSwitchButtonProps
> &
    CommonSwitchButtonProps;

export const SwitchButton: FC<SwitchButtonProps> = ({
    className,
    buttons = [],
    selectedButton = undefined,
    defaultBGColor = 'bg-gray-300',
    ...restProps
}) => {
    return (
        <div className={className + ' wrapper'}>
            {buttons.map((button: buttonProps, index: number) => {
                return (
                    <span
                        data-cy={button.label}
                        onClick={() => {
                            button.onClick(button.value);
                        }}
                        className={
                            (button.value === selectedButton
                                ? button.selectedBGColor
                                : defaultBGColor) + ' switch-button'
                        }
                    >
                        {button.label}
                    </span>
                );
            })}
        </div>
    );
};
