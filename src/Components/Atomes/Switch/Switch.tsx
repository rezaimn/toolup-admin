import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
import styles from './switch.module.scss';
/* types */
// export type CommonSwitchProps = {};
export type SwitchProps = ComponentPropsWithoutRef<'input'>;

export const Switch: FC<SwitchProps> = ({
    className,
    onChange,
    id,
    checked,
    ...restProps
}) => {
    return (
        <div className={styles.switcher}>
            <label htmlFor={id}>
                <input
                    onChange={onChange}
                    className='active'
                    type='checkbox'
                    id={id}
                    checked={checked}
                />
                <span>
                    <small />
                </span>
            </label>
        </div>
    );
};
