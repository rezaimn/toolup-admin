import { ComponentPropsWithoutRef, FC } from 'react';
import { checkWhite as checkedWhiteIcon } from 'assets/icons';
import { useDrag } from 'react-dnd';
/* components */
import { ToolIcon } from 'Components/Atomes/ToolIcon';

/* modules */
import cn from 'clsx';
import { isEqual, negate } from 'lodash/fp';

/* helpers */
/* assets */

/* styles */
import styles from './styles.module.scss';

/* types */
import { DndTypes } from 'Constants/DndTypes';

export type CommonToolBoxProps = {
    id: number;
    name: string;
    selected: boolean;
    icon: string;
    onChange: Function;
    onClick?: (toolId: number) => void;
    selectedToolId?: number;
    toolBoxType?: 'tiny' | 'large';
    origin?: string;
};
export type ToolBoxProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolBoxProps
> &
    CommonToolBoxProps;

export const ToolBox: FC<ToolBoxProps> = ({
    className,
    toolBoxType,
    origin,
    ...props
}) => {
    let _className = [
        cn(
            'bg-white border rounded-md p-10 flex items-center cursor-pointer select-none overflow-hidden',
            {
                'border-primary border-solid border-2':
                    props?.selectedToolId === props.id,
            },
            {
                'h-34 flex-row pr-20': toolBoxType === 'tiny',
            },
            {
                'flex flex-col items-center justify-start text-center break-all py-5 space-y-5 relative':
                    toolBoxType === 'large',
            }
        ),
    ];
    const toolIconCn = cn(
        'rounded-md',
        {
            'h-33 w-33 m-0': toolBoxType === 'large',
        },
        {
            'w-22 h-22 mr-10': toolBoxType === 'tiny',
        }
    );

    const toolCaptionCn = 'text-black-100';
    const toolCheckboxCn = cn(
        'w-18 h-18 p-1 rounded bg-white-500 ml-10 bg-blue-900',
        {
            hidden: toolBoxType === 'large',
        }
    );

    const toggleSelection = () => {
        props.onChange(!props.selected);
        props.onClick?.(props.id);
    };

    const [, drag] = useDrag({
        item: {
            type: DndTypes.CARD,
            item: { id: props.id, name: props.name, icon: props.icon },
        },
        collect: monitor => {
            return { isDragging: !!monitor.isDragging() };
        },
    });

    const isCustomTool = negate(isEqual('SYSTEM'))(origin);
    return (
        <div
            ref={drag}
            className={cn(_className, className, {
                'border-blue-500': props.selected,
            })}
            data-cy={`tool-box-${props.id}`}
            onClick={toggleSelection}
            style={toolBoxType === 'large' ? { minWidth: '104px' } : {}}
        >
            <ToolIcon
                src={props.icon}
                styles={{ width: 'w-22', height: 'h-22' }}
                className={toolIconCn}
            />
            <span className={toolCaptionCn}>{props.name}</span>
            <span
                className={toolCheckboxCn}
                style={{ opacity: props.selected ? 1 : 0 }}
            >
                <img src={checkedWhiteIcon} alt='c' />
            </span>
            {isCustomTool && toolBoxType === 'large' && (
                <div className={styles.customBanner}>Custom</div>
            )}
        </div>
    );
};
