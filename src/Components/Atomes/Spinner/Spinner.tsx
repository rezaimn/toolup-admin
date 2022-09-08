import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
import s from './styles.module.scss';
/* types */
export type CommonSpinnerProps = {
    spinnerClassname?: string;
};
export type SpinnerProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSpinnerProps
> &
    CommonSpinnerProps;

export const Spinner: FC<SpinnerProps> = ({ className, ...restProps }) => {
    return (
        <div className={cn(className)}>
            <div className={cn(s.loader)} />
        </div>
    );
};
