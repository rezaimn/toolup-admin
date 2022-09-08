import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { closeIcon } from 'assets/icons';

/* components */
import { ToolIcon } from 'Components/Atomes/ToolIcon';

/* modules */
import cn from 'clsx';
/* helpers */
/* assets */

/* styles */
const boxCn = 'flex flex-col items-center w-60 relative';

/* types */
export type CommonMiniToolBoxProps = {
    id: number;
    name: string;
    icon: string;
    onRemove: Function;
    attributes?: string;
};
export type MiniToolBoxProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonMiniToolBoxProps
> &
    CommonMiniToolBoxProps;

export const MiniToolBox: FC<MiniToolBoxProps> = ({ className, attributes = '', ...props }) => {
    const [isHover, setHover] = useState(false);
    const handleMouseEnter = () => setHover(true);
    const handleMouseLeave = () => setHover(false);
    const handleRemoveTool = () => props.onRemove(props.id);
    const isMailing = JSON.parse(attributes) && JSON.parse(attributes).mailing_system;

    return (
        <div
            className={cn(boxCn, className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-cy={`tool-box-${props.id}`}
        >
            <ToolIcon
                src={props.icon}
                styles={{ width: 'w-22', height: 'h-22' }}
            />
            <span
                className={
                    'text-xs mt-8 w-60 truncate overflow-ellipsis text-center'
                }
            >
                {props.name}
            </span>
            {isMailing ? '' : isHover && (
                <span
                    className={
                        'absolute w-16 h-16 bg-blue-500 rounded cursor-pointer'
                    }
                    style={{ left: '2px', top: '-4px' }}
                    onClick={handleRemoveTool}
                >
                    <img src={closeIcon} className='w-16 h-16' alt='' />
                </span>
            )}
        </div>
    );
};
