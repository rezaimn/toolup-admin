import React from 'react';

interface Props {
    className?: string;
    name: string;
    value?: string;
    placeholder: string;
    onChange: (e: any) => any;
    onKeyPress: (value: string) => any;
}

const AutoCompleteInput: React.FC<Props> = ({
    className = '',
    name = '',
    value = '',
    placeholder = '',
    onChange = (e: any) => {},
    onKeyPress = (value: string) => {},
}) => {
    return (
        <>
            <input
                type='text'
                className={` flex-1 block w-full focus:outline-none  sm:text-sm px-10 h-34 ${className}`}
                name={name}
                value={value}
                onChange={onChange}
                onKeyPress={e => {
                    onKeyPress(e.key);
                }}
                placeholder={placeholder}
            />

            {/*{*/}
            {/*    currentValue.length>0 && currentValue!=='' &&*/}
            {/*    <div className="relative ">*/}
            {/*        <div className="absolute z-50 left-0 right-0 rounded border border-gray-100 shadow py-10 bg-white">*/}

            {/*            <div className="cursor-pointer p-10 hover:bg-gray-200 focus:bg-gray-200">*/}

            {/*            </div>*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}
        </>
    );
};

export default AutoCompleteInput;
