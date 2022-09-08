import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import CreatableSelect from 'react-select/creatable';
/* helpers */
/* assets */
/* styles */
/* types */
export type AutoSelectOptions = {
    value: string;
    label: string;
};
export type CommonAutoSelectInputProps = {
    options: AutoSelectOptions[];
    onChange: Function;
    hasError?: boolean;
    selectedItemIndex?: number;
    isTypeable: boolean;
};
export type AutoSelectInputProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonAutoSelectInputProps
> &
    CommonAutoSelectInputProps;

export const CreatableSelectInput: FC<AutoSelectInputProps> = ({
    className,
    selectedItemIndex = 0,
    isTypeable = true,
    ...props
}) => {
    const customStyles = {
        control: (provided: any, state: any) => {
            return {
                ...provided,
                borderColor: props.hasError
                    ? 'rgb(239, 68, 68)'
                    : state.isFocused
                    ? '#9ca3af'
                    : '#e5e7eb',
                borderWidth: '2px',
                height: '34px',
                outline: 'none',
                marginBottom: props.hasError ? ' 6px ' : ' 28px',
            };
        },
        option: (provided: any, state: any) => ({
            ...provided,
            backgroudColor: props.hasError
                ? 'rgb(239, 68, 68)'
                : state.isSelected
                ? '#86b3ec'
                : '#EFF6FF',
        }),
    };
    const [value, setValue] = useState<string>();
    const textChange = (value: string) => {
        if (isTypeable) {
            setValue(value);
        } else {
            setValue('');
        }
    };
    return (
        <CreatableSelect
            id={props.id}
            className={cn(className)}
            styles={customStyles}
            onChange={item => props.onChange(item)}
            options={props.options}
            value={[props.options[selectedItemIndex]]}
            onInputChange={textChange}
            inputValue={value}
        />
    );
};
