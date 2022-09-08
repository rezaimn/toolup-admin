import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import _ from 'lodash';
/* helpers */
/* assets */
import {
    memberCirclePurple,
    memberCircleBlue,
    memberCirclegreen,
    memberCircleOrange,
} from 'assets/icons';
/* styles */
/* types */

const colors = [
    memberCirclePurple,
    memberCircleBlue,
    memberCirclegreen,
    memberCircleOrange,
];

export type CommonSelectInputProps = {
    options: any[];
    selected: any;
    onChange: any;
    hasColor: boolean;
};
export type SelectInputProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSelectInputProps
> &
    CommonSelectInputProps;

export const SelectInput: FC<SelectInputProps> = ({
    className,
    options,
    selected,
    onChange,
    hasColor,
    ...restProps
}) => {
    const [open, setOpen] = useState(false);
    const onSelect = (value: any) => {
        onChange(value);
        setOpen(false);
    };
    return (
        <div className={`${cn(className)}`}>
            <div className='mt-1 relative'>
                <button
                    type='button'
                    aria-haspopup='listbox'
                    aria-expanded='true'
                    onClick={() => setOpen(!open)}
                    aria-labelledby='listbox-label'
                    className='relative w-290 h-34 my-7 mx-auto bg-white border border-gray-300 text-gray-500 rounded shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-700 focus:border-indigo-700 sm:text-sm'
                >
                    <span className='flex items-center'>
                        <span className='ml-15 block truncate'>
                            {selected.name}
                        </span>
                    </span>
                    <span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                        <svg
                            className='-mr-1 ml-2 h-20 w-24'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            aria-hidden='true'
                        >
                            <path
                                fill-rule='evenodd'
                                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                clip-rule='evenodd'
                            />
                        </svg>
                    </span>
                </button>
                <div
                    className={`${
                        open ? 'absolute' : 'hidden'
                    }  mt-1 w-full rounded-md bg-white shadow-lg z-50`}
                >
                    <ul
                        role='listbox'
                        aria-labelledby='listbox-label'
                        aria-activedescendant='listbox-item-3'
                        className='rounded-md py-5 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
                    >
                        {_.map(options, (item, index) => {
                            return (
                                <li
                                    id='listbox-item-0'
                                    role='option'
                                    onClick={() => onSelect(item)}
                                    className={`${
                                        selected.id === item.id &&
                                        'bg-gray-200 text-blue-900'
                                    } text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 hover:text-blue-900 focus:outline-none focus:bg-gray-200 focus:text-blue-900`}
                                >
                                    <div className='flex items-center ml-25 h-25'>
                                        {hasColor && (
                                            <img
                                                src={colors[index % 3]}
                                                className='w-12 h-12 mr-5 '
                                            />
                                        )}
                                        <span className='block font-normal truncate'>
                                            {item.name}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};
