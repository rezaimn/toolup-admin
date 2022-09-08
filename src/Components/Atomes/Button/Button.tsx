import React from 'react';

interface Props {
    data_cy?: any;
    id?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset' | undefined;
    color: 'gray' | 'red' | 'yellow' | 'blue' | 'green' | 'white';
    svg?: any | null;
    text: string;
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<Props> = ({
    data_cy,
    id = '',
    onClick,
    type = 'button',
    color = 'blue',
    svg = null,
    text = '',
    className = '',
    disabled = false,
}) => {
    const setDynamicClasses = () => {
        let classes = `focus:ring-${color}-800`;
        switch (color) {
            case 'white':
                classes = `${
                    'text-blue-900 bg-white-900 border border-blue-900 ' +
                    classes
                }`;
                break;
            case 'gray':
                classes = `${
                    'bg-gray-300 hover:bg-gray-300 text-blue ' + classes
                }`;
                break;
            default:
                classes = `${
                    'text-white bg-' +
                    color +
                    '-900 ' +
                    ' hover:bg-' +
                    color +
                    '-800 ' +
                    classes
                }`;
        }
        return classes;
    };
    return (
        <>
            <button
                data-cy={data_cy}
                id={id}
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={` shadow inline-flex items-center px-16 my-10 h-34 border border-transparent rounded-md mx-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${setDynamicClasses()}  ${className}`}
            >
                {svg && <img src={svg} className='mr-3' />}
                {text}
            </button>
        </>
    );
};

export default Button;
