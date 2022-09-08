import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
import { defaulToolIcon } from 'assets/icons';

/* styles */
/* types */
export type ToolIconStyles = {
    shadow?: string;
    width?: string;
    height?: string;
    radius?: string;
};
export type CommonToolIconProps = {
    src: string;
    alt?: string;
    styles?: ToolIconStyles;
};
export type ToolIconProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolIconProps
> &
    CommonToolIconProps;

export const ToolIcon: FC<ToolIconProps> = ({ className, ...props }) => {
    const styles = {
        ...{
            shadow: 'shadow',
            width: 'w-32',
            height: 'h-32',
            radius: 'rounded-md',
        },
        ...props.styles,
    };

    const cns = cn(
        [styles.shadow, styles.width, styles.height, styles.radius],
        'flex items-center justify-center'
    );

    return (
        <img
            src={props.src || defaulToolIcon}
            alt={props.alt || 'tool icon'}
            className={cn(cns, className)}
        />
    );
};
