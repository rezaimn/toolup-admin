import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { MiniToolBox } from 'Components/Molecules/MiniToolBox';
import { useDrop } from 'react-dnd';
import { arrowUpDarkBlue } from 'assets/icons';
/* components */
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
/* types */
import { DndTypes } from 'Constants/DndTypes';
import { Tool } from 'Components/Organisms/SetupTeamTools';
import { uniqBy } from 'lodash';

export type CommonTeamToolsBoxProps = {
    id: number;
    name: string;
    members: number;
    tools: Tool[];
    color: string;
    selectedTools: Tool[];
    onDropped: Function;
    onRemove: Function;
};
export type TeamToolsBoxProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeamToolsBoxProps
> &
    CommonTeamToolsBoxProps;

export const TeamToolsBox: FC<TeamToolsBoxProps> = ({
    className,
    selectedTools,
    ...props
}) => {
    const boxCn = 'shadow rounded-md py-12';
    const headerBoxCn =
        'border-l-4 pl-10 mb-10 flex items-center justify-between';
    const titleCn = 'font-bold text-gray-500 mt-0';
    const subtitleCn = 'text-xs text-gray-125 mb-0';
    let dropboxCn = 'border-dashed border border-gray-200 rounded p-8 mx-8';
    const toolsHolderCn = ['grid grid-cols-4 px-10 pt-10 gap-8 pb-8'];
    const rnd = Math.random();

    const [justAddedTools, setAddedTools] = useState<Tool[]>([]);

    let teamColor = '';
    switch (true) {
        case rnd < 0.2:
            teamColor = 'border-blue-500';
            break;
        case rnd >= 0.2 && rnd < 0.4:
            teamColor = 'border-red-500';
            break;
        case rnd >= 0.4 && rnd < 0.6:
            teamColor = 'border-green-500';
            break;
        case rnd >= 0.6 && rnd < 0.8:
            teamColor = 'border-yellow-500';
            break;
        case rnd >= 0.8:
            teamColor = 'border-purple-500';
            break;
        default:
            teamColor = 'border-red-500';
            break;
    }

    const [{ isOver }, drop] = useDrop({
        accept: DndTypes.CARD,
        canDrop: () => true,
        drop: (data: any) => {
            let _tools = selectedTools.slice();
            if (selectedTools.some(st => st.id === data.item.id) === false) {
                _tools.push(data.item);
            }
            _tools = _tools.filter(
                t => props.tools.some(ti => ti.id === t.id) === false
            );

            props.onDropped({
                teamId: props.id,
                toolIds: _tools.map(t => t.id),
            });
            setAddedTools(_tools);
        },
        collect: monitor => {
            return {
                isOver: !!monitor.isOver(),
            };
        },
    });

    const [showMore, toggleShowMore] = useState(true);

    const handleShowMore = () => toggleShowMore(!showMore);
    const handleRemoveTool = (id: number) => {
        props.onRemove({ teamId: props.id, toolId: id });
    };

    const toolsElms = uniqBy(props.tools, 'id').map(t => {
        return (
            <MiniToolBox
                id={t.id}
                name={t.name}
                icon={t.icon}
                attributes={t.attributes}
                key={`minitool-${props.id}-${t.id}`}
                onRemove={handleRemoveTool}
            />
        );
    });

    return (
        <div ref={drop} className={cn(boxCn, className)} data-cy="team-box" >
            <div className={cn(headerBoxCn, teamColor)}>
                <div>
                    <h4 className={titleCn}>{props.name}</h4>
                    <h6 className={subtitleCn}>
                        {props.members} members in the team
                    </h6>
                </div>
            </div>
            {props.tools.length > 0 && (
                <div
                    className={cn(toolsHolderCn, {
                        'h-65 overflow-hidden': showMore,
                        'bg-gray-50': isOver,
                    })}
                >
                    {toolsElms}
                </div>
            )}
            {props.tools.length > 4 && (
                <div
                    className={'text-center h-6 cursor-pointer pb-16'}
                    onClick={handleShowMore}
                >
                    <img
                        src={arrowUpDarkBlue}
                        alt='au'
                        className={cn('inline transform', {
                            'rotate-180': showMore,
                        })}
                    />
                </div>
            )}
            {props.tools.length === 0 && (
                <div
                    className={cn(dropboxCn, {
                        'bg-gray-50': isOver,
                        'bg-gray-100': !isOver,
                    })}
                >
                    <p className={'text-gray-400 text-xs text-center'}>
                        Drag & drop to add your tools
                    </p>
                    <p className={'text-gray-300 text-xs text-center'}>
                        No tools
                    </p>
                </div>
            )}
        </div>
    );
};
