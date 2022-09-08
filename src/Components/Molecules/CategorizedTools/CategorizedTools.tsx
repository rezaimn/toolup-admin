import React, { ComponentPropsWithoutRef, FC, useState } from 'react';
import { closeIcon } from 'assets/icons';
import { ToolBox } from 'Components/Molecules/ToolBox';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* types */
import { Tool } from 'Components/Organisms/SetupTeamTools';
import { clone, cloneDeep } from 'lodash';

/* styles */
const headerCn = 'flex items-center mb-6';
const toolsWrapperCn = 'flex flex-wrap gap-4';

export type CommonCategorizedToolsProps = {
    name?: string;
    tools: Array<any>;
    id: number;
    onToolsSelected: Function;
    onRemove?: Function;
    onToolClick?: (toolId: number) => void;
    toolSelectionMode?: 'check' | 'select';
    selectedToolId?: number;
    toolBoxType?: 'tiny' | 'large';
};
export type CategorizedToolsProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonCategorizedToolsProps
> &
    CommonCategorizedToolsProps;

export const CategorizedTools: FC<CategorizedToolsProps> = ({
    className,
    ...props
}) => {
    const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
    const [cleared, setCleared] = useState<boolean>(false);

    const handleToolSelect = (data: any) => {
        let _tools: Tool[] = cloneDeep(selectedTools);
        if (data.selected && _tools.some(t => t.id === data.id) === false) {
            const tool = props.tools.find(tool => tool.id === data.id);
            _tools.push(clone(tool));
        } else if (data.selected === false) {
            _tools = _tools.filter(t => t.id !== data.id);
        }
        setSelectedTools(_tools);
        props.onToolsSelected({
            selected: _tools,
            unSelected: cloneDeep(props.tools).filter(
                pt => !_tools.find(t => t.id === pt.id)
            ),
        });
        setCleared(false);
    };
    const handleClear = () => {
        setSelectedTools([]);
        props.onToolsSelected({
            selected: [],
            unSelected: cloneDeep(props.tools),
        });
        setCleared(true);
    };
    const handleClickRemove = () => {
        if (props.onRemove) props.onRemove(props.id);
    };

    const toolsElms = props.tools.map((t: Tool) => (
        <ToolBox
            key={`category-${props.id}-tool-${t.id}`}
            id={t.id}
            name={t.name}
            icon={t.icon}
            selected={
                props?.toolSelectionMode !== 'select' &&
                cleared === false &&
                selectedTools.some(st => st.id === t.id)
            }
            onChange={(value: boolean) =>
                handleToolSelect({ id: t.id, selected: value })
            }
            onClick={props.onToolClick}
            selectedToolId={props?.selectedToolId}
            toolBoxType={props.toolBoxType}
            origin={t.origin}
        />
    ));

    return (
        <div className={cn(className)}>
            {props.name && (
                <div className={headerCn}>
                    <span
                        className={'w-10 h-10 cursor-pointer'}
                        onClick={handleClickRemove}
                    >
                        <img src={closeIcon} alt='ci' className={'w-10 h-10'} />
                    </span>
                    <span className={'pl-4 text-sm font-bold text-gray-700'}>
                        {props.name}
                    </span>
                    <span
                        className={
                            'ml-10 rounded-md text-xs text-white bg-red-400 text-center px-6 cursor-pointer'
                        }
                        hidden={
                            selectedTools.length === 0 ||
                            props.toolSelectionMode === 'select'
                        }
                        onClick={handleClear}
                    >
                        clear
                    </span>
                </div>
            )}
            <div className={toolsWrapperCn}>{toolsElms}</div>
        </div>
    );
};
