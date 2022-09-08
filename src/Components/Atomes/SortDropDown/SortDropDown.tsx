import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
    createRef,
} from 'react';
/* components */
/* modules */
import cn from 'clsx';
import _ from 'lodash';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonDropDownProps = {
    selectedOption: {
        orderBy: {
            field: string;
            order: string;
        };
    };
    options: any[];
    orderOptions: any[];
    onChange: any;
};
const useOutsideClick = (ref: any, callback: any) => {
    const handleClick = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};
export type DropDownProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDropDownProps
> &
    CommonDropDownProps;

export const SortDropDown: FC<DropDownProps> = ({
    className,
    selectedOption,
    options,
    onChange,
    orderOptions,
    ...restProps
}) => {
    const [open, setOpen] = useState(false);
    const ref = createRef<HTMLDivElement>();

    useOutsideClick(ref, () => {
        setOpen(false);
    });

    return (
        <div className={cn(className)} ref={ref}>
            <div className='relative inline-block text-left text-xs'>
                <div>
                    <button
                        type='button'
                        className='inline-flex justify-center w-full bg-white text-xx text-blue-800 font-bold text-gray-700'
                        onClick={() => setOpen(!open)}
                    >
                        {selectedOption.orderBy && selectedOption.orderBy.field}
                        <svg
                            className='-mr-1 ml-2 h-20 w-24'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            aria-hidden='true'
                        >
                            <path
                                fillRule='evenodd'
                                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className={`${
                        open ? 'absolute' : 'hidden'
                    } mt-2 w-173 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y`}
                >
                    <div
                        className='py-1'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='options-menu'
                    >
                        {_.map(options, item => {
                            return (
                                <button
                                    type='submit'
                                    onClick={() => {
                                        onChange({
                                            type: 'setSort',
                                            orderBy: {
                                                field: item.value,
                                                order:
                                                    selectedOption.orderBy &&
                                                    selectedOption.orderBy
                                                        .order,
                                            },
                                        });
                                        setOpen(false);
                                    }}
                                    className={`${
                                        selectedOption.orderBy &&
                                        selectedOption.orderBy.field ===
                                            item.value
                                            ? 'bg-gray-300 text-blue-900'
                                            : 'text-gray-500 bg-white'
                                    }block w-full text-left px-4 py-2 text-xs hover:bg-gray-200 hover:text-blue-900 focus:outline-none focus:bg-gray-200 focus:text-blue-900`}
                                    role='menuitem'
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                    <div
                        className='py-1'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='options-menu'
                    >
                        {_.map(orderOptions, item => {
                            return (
                                <button
                                    type='submit'
                                    onClick={() => {
                                        onChange({
                                            type: 'setSort',
                                            orderBy: {
                                                order: item.value,
                                                field:
                                                    selectedOption.orderBy &&
                                                    selectedOption.orderBy
                                                        .field,
                                            },
                                        });
                                        setOpen(false);
                                    }}
                                    className={`${
                                        selectedOption.orderBy &&
                                        selectedOption.orderBy.order ===
                                            item.value
                                            ? 'bg-gray-300 text-blue-900'
                                            : 'text-gray-500 bg-white'
                                    }block w-full text-left px-4 py-2 text-xs hover:bg-gray-200 hover:text-blue-900 focus:outline-none focus:bg-gray-200 focus:text-blue-900`}
                                    role='menuitem'
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
