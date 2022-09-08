import React, {
    ComponentPropsWithoutRef,
    ComponentPropsWithRef,
    FC,
    forwardRef,
} from 'react';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonInputTextProps = {
    hasError?: boolean;
};
export type InputTextProps = Omit<
    ComponentPropsWithRef<'input'>,
    keyof CommonInputTextProps
> &
    CommonInputTextProps;

export type inputRef = HTMLInputElement;

export const InputText = forwardRef<inputRef, InputTextProps>((props, ref) => {
    return (
        <div className={cn(props.className)}>
            <input
                ref={ref}
                type={props.type}
                id={props.id}
                placeholder={props.placeholder}
                name={props.name}
                value={props.value}
                disabled={props.disabled}
                onChange={props.onChange}
                onBlur={props.onBlur}
                className={` h-34 flex-shrink flex-grow flex-auto leading-normal w-full flex-1 border-2 h-10  rounded   px-10 relative focus:outline-none  focus:border-gray-400  ${
                    props.hasError
                        ? 'focus:border-red-500 border-red-500 mb-6'
                        : 'border-grey-light mb-24'
                }`}
            />
        </div>
    );
});
