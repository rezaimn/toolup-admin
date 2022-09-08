import { ComponentPropsWithoutRef, FC, memo, useRef } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
import { importAll } from 'Helpers/importAll';
import { first, pipe, shuffle } from 'lodash/fp';
/* assets */
import { ReactComponent as CheckIcon } from 'assets/icons/check.svg';
import Img from 'assets/icons/colorized-member/member-1.svg';
/* styles */
import s from './styles.module.scss';
/* types */
export type CommonRandomColorizedProfileIconProps = {
    loading?: boolean;
    isChecked?: boolean;
};
export type RandomColorizedProfileIconProps = Omit<
    ComponentPropsWithoutRef<'img'>,
    keyof CommonRandomColorizedProfileIconProps
> &
    CommonRandomColorizedProfileIconProps;

const images = importAll(
    require.context(
        '../../../assets/icons/colorized-member',
        false,
        /\.(png|jpe?g|svg)$/
    )
);

const Cmp: FC<RandomColorizedProfileIconProps> = ({
    className,
    loading = false,
    isChecked = false,
    onClick,
    ...restProps
}) => {
    return (
        <div className={cn(s.wrap)} onClick={onClick} {...restProps}>
            <img
                className={cn(className, s.image)}
                style={{ minWidth: '31px' }}
                src={Img}
                alt=''
            />
            {isChecked && (
                <span className={cn(s.checkmarked)}>
                    <CheckIcon />
                </span>
            )}
        </div>
    );
};
export const RandomColorizedProfileIcon = Cmp;
