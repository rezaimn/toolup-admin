import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
/* helpers */
/* assets */
/* styles */
import styles from './checkbox.module.scss';
/* types */
export type CommonCheckboxProps = {
    label: string;
    onChange: any;
    checked: boolean;
    labelClass: string;
    classNames: string;
};
export type CheckboxProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonCheckboxProps
> &
    CommonCheckboxProps;

export const Checkbox: FC<CheckboxProps> = ({
    className,
    classNames,
    onChange,
    checked,
    label,
    labelClass,
    ...restProps
}) => {
    return (
        <div className={styles.checkbox}>
            <input
                type='checkbox'
                className={`${classNames} font-sans text-white	`}
                checked={checked}
                onChange={onChange}
            />
            <label className={labelClass}>
                Invitation email will be sent to all the added members
            </label>
        </div>
    );
};
