import { FC, useEffect, useRef, useState } from 'react';
/* components */
import { BoardingAccordionItem } from 'Components/Molecules/BoardingAccordionItem';

/* modules */
import cn from 'clsx';
import { get, map, find, pipe, isEqual, isNumber } from 'lodash/fp';
import { BoardingTool } from 'Hooks/api';
import { FilterOnboardingOffboardingState } from 'Pages/OnbaordingOffboarding/OnbaordingOffboarding';
import { useQueryString } from 'Hooks/useQueryString';

/* helpers */
/* assets */
/* styles */
/* types */
export type CommonBoardingAccoidionProps = {
    tools: BoardingTool[];
    filterPayload: FilterOnboardingOffboardingState;
};
export type BoardingAccoidionProps = CommonBoardingAccoidionProps;

export const BoardingAccoidion: FC<BoardingAccoidionProps> = ({
    tools,
    filterPayload,
}) => {
    const [queryString = { expanded: 0 }, setQueryString] = useQueryString();

    const expandedTool = find<BoardingTool>(
        pipe(get('id'), isEqual(+get('expanded')(queryString)))
    )(tools);

    const expandedToolId = get('id')(expandedTool);
    const [expanded, setExpanded] = useState<number | false>(
        expandedToolId || 0
    );

    const accordionRef = useRef<HTMLDivElement>();

    const isToolExpanded = pipe(get('id'), isEqual(expandedToolId));
    useEffect(() => {
        if (isNumber(expandedToolId)) {
            accordionRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }
        setExpanded(expandedToolId);
    }, [expandedToolId]);

    const handleChange = (panel: number) => (
        event: React.ChangeEvent<unknown>,
        newExpanded: boolean
    ) => {
        setExpanded(newExpanded ? panel : false);
    };

    const data = map<BoardingTool, JSX.Element>(tool => {
        return (
            <div ref={isToolExpanded(tool) ? accordionRef : (null as any)}>
                <BoardingAccordionItem
                    key={tool.id?.toString()}
                    expanded={expanded === tool.id}
                    onChange={handleChange(tool.id)}
                    tool={tool}
                    filterPayload={filterPayload}
                />
            </div>
        );
    })(tools);

    return (
        <div
            className={cn('overflow-auto')}
            style={{ height: 'calc(100vh - 300px)' }}
        >
            {data}
        </div>
    );
};
