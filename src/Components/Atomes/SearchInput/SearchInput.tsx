import React, { useState } from 'react';
import {
    searchIcon,
    clearSearchIcon,
    clearSearchBlueIcon,
    searchIconBlue,
} from '../../../assets/icons/index';
interface Props {
    className: string;
    value: string;
    setValue: (value: string) => void;
    onKeyPress: (event: any) => void;
}

const SearchInput: React.FC<Props> = ({
    className = '',
    value = '',
    setValue,
    onKeyPress,
}) => {
    const [clearIcon, setClearIcon] = useState(clearSearchIcon);
    const clearSearch = () => {
        setValue('');
    };
    const clearMouseOver = () => {
        setClearIcon(clearSearchBlueIcon);
    };
    const clearMouseLeave = () => {
        setClearIcon(clearSearchIcon);
    };
    const searchIconClick = () => {
        onKeyPress({ key: 'Enter' });
    };
    return (
        <>
            <div className={`${className} pt-2 relative mx-auto `}>
                <input
                    value={value}
                    onChange={e => {
                        setValue(e.target.value);
                    }}
                    onKeyPress={onKeyPress}
                    className={`placeholder-gray-300 text-gray-500  my-12 border-solid border ${
                        value === '' ? 'border-gray-200' : 'border-blue-900'
                    } bg-white h-34 w-full   px-30 rounded-md text-sm focus:outline-none`}
                    type='text'
                    name='search'
                    placeholder='Search...'
                    data-cy="search-input"
                />
                <button
                    type='button'
                    className='absolute left-8 top-22  mr-20 cursor-pointer focus:outline-none'
                    onClick={searchIconClick}
                >
                    <img src={value === '' ? searchIcon : searchIconBlue} />
                </button>
                <button
                    type='button'
                    className='absolute -right-10 top-24  mr-16 cursor-pointer focus:outline-none'
                    onClick={clearSearch}
                >
                    <img
                        src={clearIcon}
                        onMouseOver={clearMouseOver}
                        onMouseLeave={clearMouseLeave}
                    />
                </button>
            </div>
        </>
    );
};

export default SearchInput;
