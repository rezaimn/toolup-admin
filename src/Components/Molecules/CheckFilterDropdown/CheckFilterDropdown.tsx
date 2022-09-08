import { ComponentPropsWithoutRef, FC, useRef, useState } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { includes, toString } from 'lodash/fp';
import { useClickAway } from 'react-use';
/* helpers */
import { and } from 'Helpers/fp';
/* assets */
import {
    filter as filterIcon,
    chevronDownGray,
    chevronDownDarkBlue,
} from 'assets/icons';
/* styles */
import styles from './styles.module.scss';

/* types */
type CommonProps = {
    items: string[];
    defaultSelectedItems: string[];
    selectedItems: string[];
    onChange: (isSelected: boolean, position: string) => void;
    title?: string;
};

type Props = Omit<ComponentPropsWithoutRef<'div'>, keyof CommonProps> &
    CommonProps;

export const CheckFilterDropdown: FC<Props> = ({
    className,
    items,
    onChange,
    defaultSelectedItems,
    selectedItems,
    title = 'Category filter',
    ...restProps
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const boxCn =
        'bg-white shadow rounded-md min-w-140 py-10 px-20 flex flex-col gap-6';
    const rowCn = 'flex gap-10 items-center text-sm font-normal select-none';
    const checkboxCn = 'rounded w-16 h-16';
    const headCn = 'font-bold text-blue-900 mb-6';

    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);
    const toggle = () => setIsOpen(io => !io);

    useClickAway(ref, close);

    const isByDefaultChecked = (name: string) =>
        includes(name)(defaultSelectedItems);

    const isChecked = (name: string) =>
        and(
            () => includes(name)(defaultSelectedItems),
            () => includes(name)(selectedItems)
        );

    const handleChange = (item: string) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => onChange(detectSelection(e), item);

    return (
        <div ref={ref} className='inline-block'>
            <h4 className={cn(headCn, 'flex gap-10 items-center')}>
                {title}
                <div className='relative flex-grow flex items-center'>
                    <span
                        onClick={toggle}
                        className='cursor-pointer flex items-center'
                        aria-hidden
                    >
                        <img src={filterIcon} className='w-20 h-20' alt='' />

                        <img
                            src={isOpen ? chevronDownDarkBlue : chevronDownGray}
                            className='w-16 h-16'
                            alt=''
                        />
                    </span>

                    {render()}
                </div>
            </h4>
        </div>
    );

    function render(): JSX.Element | undefined {
        return (
            <div
                className={cn(boxCn, className, 'absolute top-24 left-0 z-50', {
                    hidden: !isOpen,
                })}
            >
                {items.map(item => (
                    <label
                        key={`filter-item-${item}`}
                        className={cn(rowCn, styles.row)}
                        htmlFor={toString(item)}
                    >
                        <input
                            type='checkbox'
                            id={item}
                            className={checkboxCn}
                            defaultChecked={isByDefaultChecked(item)}
                            checked={isChecked(item)}
                            onChange={handleChange(item)}
                        />
                        {item}
                    </label>
                ))}
            </div>
        );
    }
};

const detectSelection = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    return e.target.checked;
};
