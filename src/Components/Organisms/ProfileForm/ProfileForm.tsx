import React, { ComponentPropsWithoutRef, FC } from "react";
/* components */
/* modules */
import cn from 'clsx';
import { Input } from 'Components/Atoms/Input';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonProfileFormProps = {
    first_name?: string,
    last_name?: string,
    email?: string,
}
export type ProfileFormProps = Omit<ComponentPropsWithoutRef<'div'>,
    keyof CommonProfileFormProps
> &
    CommonProfileFormProps;

export const ProfileForm: FC<ProfileFormProps> = ({ className, first_name, last_name, email, ...restProps }) => {
    return <div className={styles.wrapper}>
        <div className={styles.inputWrapper}>
            <label>
                First name
            </label>
            <Input value={first_name} />
        </div>
        <div className={styles.inputWrapper}>
            <label>
                Email
            </label>
            <Input value={email} disabled />
        </div>
        <div className={styles.inputWrapper}>
            <label>
                Last name
            </label>
            <Input value={last_name} />
        </div>
        <div className={styles.inputWrapper}>
            <label>
                Password
            </label>
            <Input.Password />
            <div className={styles.changePassword}>
                Change password
            </div>
        </div>
    </div>;

};