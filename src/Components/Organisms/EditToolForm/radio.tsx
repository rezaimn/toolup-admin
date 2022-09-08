import { ComponentPropsWithoutRef, forwardRef } from 'react';
/* modules */
import cn from 'clsx';
/* assets */
import { ReactComponent as InfoIcon } from 'assets/icons/toast/info.svg';

/* styles */
import styles from './radio.styles.module.scss';

export type InputProps = ComponentPropsWithoutRef<'input'> & {
    label?: string;
    text: string;
};
export type InputRef = HTMLInputElement;

export const Radio = forwardRef<InputRef, InputProps>(
    ({ className, text, label, ...restProps }, ref) => {
        return (
            <div className={styles.row}>
                <div
                    className={cn(className, styles.radioWrap, styles.disabled)}
                >
                    <input
                        disabled
                        type='radio'
                        className={styles.radio}
                        ref={ref}
                        checked={false}
                        {...restProps}
                    />
                    <p className={styles.label}>{label}</p>
                </div>
                <div className={styles.infoWrap}>
                    <InfoIcon className={styles.info} />
                    <p className={styles.text}>{text}</p>
                </div>
            </div>
        );
    }
);
