import React from 'react';

interface Props {
    text: string;
    icon: any;
    onClick: any;
    selected: boolean;
    onMouseEnter: any;
    onMouseLeave: any;
    hovered: boolean;
    customClass: string;
    imgClass: string;
}

const SelectBox: React.FC<Props> = ({
    text,
    icon,
    onClick,
    selected,
    onMouseEnter,
    onMouseLeave,
    hovered,
    customClass,
    imgClass,
}) => (
    <div
        className={`${selected && 'border-blue-900 font-semibold'} ${
            hovered && ' border-blue-900 font-semibold text-gray-700'
        } ${customClass} sm:w-220 sm:h-150 flex justify-center flex-col items-center shadow-md border-solid rounded-lg m-20 border-2 font-normal pointer-events-auto cursor-pointer border-transparent hover:border-blue-900 focus:border-blue-900 hover:shadow-lg focus:shadow-lg text-gray-500 hover:font-semibold focus:font-semibold`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <img
            src={icon}
            alt=''
            className={`${imgClass} sm:w-42 flex-shrink-0 h-auto mt-2`}
        />
        <span className='m-3 text-center w-180 '>{text}</span>
    </div>
);

export default SelectBox;
