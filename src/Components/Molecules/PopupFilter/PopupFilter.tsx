import { ComponentPropsWithoutRef, FC, useEffect, useRef } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { cloneDeep } from 'lodash';
/* helpers */
/* assets */
/* styles */
/* types */
export type PopupFilterItem = {
    id: number;
    name: string;
    checked: boolean;
};
export type CommonPopupFilterProps = {
    items: PopupFilterItem[];
    onChange: Function;
    onClickOutside: Function;
};
export type PopupFilterProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonPopupFilterProps
> &
    CommonPopupFilterProps;

export const PopupFilter: FC<PopupFilterProps> = ({ className, ...props }) => {
    const boxCn =
        'bg-white shadow rounded-md min-w-140 py-10 px-20 flex flex-col gap-6 z-100';
    const rowCn = 'flex gap-10 items-center text-sm font-normal select-none';
    const checkboxCn = 'rounded w-16 h-16';
    const node = useRef<HTMLDivElement>(null);

    const handleClick = (e: any) => {
        if (node?.current?.contains(e.target)) {
            return;
        }
        props.onClickOutside(true);
    };
    useEffect(() => {
        // add when mounted
        document.addEventListener('mousedown', handleClick);

        // return function to be called when unmounted
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const handleChange = (e: any, item: any) => {
        const _items: PopupFilterItem[] = cloneDeep(props.items).map(i => {
            i.checked = i.id === item.id ? !i.checked : i.checked;
            return i;
        });
        props.onChange(_items.filter(i => i.checked).map(i => i.id));
    };

    return (
        <div className={cn(boxCn, className)} ref={node}>
            {props.items.map(item => (
                <div
                    key={`filter-item-${item.id}`}
                    className={cn(rowCn, {
                        'text-gray-500': !item.checked,
                        'text-blue-900': item.checked,
                    })}
                >
                    <input
                        type='checkbox'
                        value={item.id}
                        className={checkboxCn}
                        checked={item.checked}
                        onChange={e => handleChange(e, item)}
                    />
                    {item.name}
                </div>
            ))}
        </div>
    );
};
