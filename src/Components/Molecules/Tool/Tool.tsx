import React from 'react';
import { googleIcon } from '../../../assets/icons/index';

interface Props {
    img: string;
    toolName: string;
    hasCheckbox: boolean;
    setCheckbox?: () => void;
    hasName: boolean;
}

const Tool: React.FC<Props> = ({
    img = '',
    toolName = '',
    hasCheckbox = false,
    hasName = false,
    setCheckbox,
}) => {
    return (
        <>
            <button
                type='button'
                aria-haspopup='listbox'
                aria-expanded='true'
                aria-labelledby='listbox-label'
                className='h-9 relative cursor-pointer ml-3 mb-2 w-auto bg-white border border-gray-125 rounded-md shadow-sm pl-1 pr-1 py-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm'
            >
                <span className='flex items-center'>
                    <img
                        src={googleIcon}
                        alt=''
                        className='flex-shrink-0 h-6 w-6 rounded-2xl shadow'
                    />
                    {hasName && (
                        <span className='ml-3 ml-3 mr-2 block truncate'>
                            {toolName}
                        </span>
                    )}

                    {hasCheckbox && (
                        <span className='mr-2 block truncate'>
                            <input type={'checkbox'} onChange={setCheckbox} />
                        </span>
                    )}
                </span>
            </button>
        </>
    );
};

export default Tool;
