import React from 'react';

interface Props {
    placeholder: string;
    value?: string;
    name: string;
    onChangeInputValue?: (e: any) => void;
    className: string;
    rowIndex?: number;
    onBlur?: (rowIndex: number) => any;
    onFocus?: (rowIndex: number) => any;
    onInlineInputKePress?: (keyValue: string, rowIndex: number) => any;
    cellKey?: string;
    tableCellChangeData?: (
        rowIndex: number,
        cellKey: string,
        value: string
    ) => void;
}

const TableTextInput: React.FC<Props> = ({
    placeholder = '',
    value = '',
    name = '',
    onChangeInputValue = (e: any) => {},
    className = '',
    rowIndex = -1,
    onBlur = (rowIndex: number) => {},
    onFocus = (rowIndex: number) => {},
    onInlineInputKePress = (keyValue: string, rowIndex: number) => {},
    cellKey = '',
    tableCellChangeData = (
        rowIndex: number,
        cellKey: string,
        value: string
    ) => {},
}) => {
    return (
        <>
            <div className=' flex '>
                <input
                    type='text'
                    name={name}
                    value={value}
                    onChange={e => {
                        tableCellChangeData(rowIndex, cellKey, e.target.value);
                        onChangeInputValue(e);
                    }}
                    onBlur={() => onBlur(rowIndex)}
                    onKeyPress={e => {
                        onInlineInputKePress(e.key, rowIndex);
                    }}
                    onFocus={() => onFocus(rowIndex)}
                    className={`flex-1 block w-full focus:outline-none  sm:text-sm px-6 h-8 ${className}`}
                    placeholder={placeholder}
                />
            </div>
        </>
    );
};

export default TableTextInput;
