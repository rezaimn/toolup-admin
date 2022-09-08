/* components */
import { CategorizedTools } from 'Components/Molecules/CategorizedTools';
import { TeamToolsBox } from 'Components/Molecules/TeamToolsBox';
import SearchInput from 'Components/Atomes/SearchInput/SearchInput';
import { PopupFilter } from 'Components/Molecules/PopupFilter';
import { Team, Tool } from 'Components/Organisms/SetupTeamTools';
import Button from 'Components/Atomes/Button/Button';
import { ToolForm } from 'Components/Organisms/ToolForm';

/* modules */
import React, {
    ComponentPropsWithoutRef,
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import cn from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep, remove, uniqBy } from 'lodash';
import { filter, flow, last, map } from 'lodash/fp';

/* helpers */
/* assets */
import {
    plusWhite,
    filter as filterIcon,
    chevronDownGray,
    chevronDownDarkBlue,
} from 'assets/icons';
import { AddToolSearch } from 'Pages/AddTool/AddTool';
/* types */
/* styles */

export type CommonSetupTeamToolsProps = {
    categories: any[];
    teams: any[];
    recommendedTools: any[];
    onDropped: Function;
    onRemoveTool: Function;
    onSubmitNewTool: Function;
    includeTeamsToolAssignment?: boolean;
    includeSearch?: boolean;
    searchClsx?: string;
    onToolClick?: (toolId: number) => void;
    toolSelectionMode?: 'check' | 'select';
    selectedToolId?: number;
    showCategorizedToolsUnderSearchResult?: boolean;
    addToolButtonFunctionalityMode?: 'internal' | 'triggerOut';
    onAddButtonClick?: () => void;
    toolBoxType?: 'tiny' | 'large';
    onlyNewTools?: boolean;
    setSearch?: Dispatch<SetStateAction<AddToolSearch>>;
    newTools?: Tool[];
    includeCategorized?: boolean;
    includeAddButton?: boolean;
    noResultsFoundMessage?: string;
    createToolLoading: boolean;
};
export type SetupTeamToolsProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSetupTeamToolsProps
> &
    CommonSetupTeamToolsProps;

export const RenderSetupTeamTools: FC<SetupTeamToolsProps> = ({
    className,
    includeTeamsToolAssignment = true,
    includeSearch = true,
    searchClsx = '',
    onToolClick = () => { },
    toolSelectionMode = 'check',
    selectedToolId,
    showCategorizedToolsUnderSearchResult = true,
    addToolButtonFunctionalityMode = 'internal',
    onAddButtonClick = () => { },
    toolBoxType = 'tiny',
    onlyNewTools = false,
    setSearch = () => { },
    newTools,
    includeCategorized = true,
    includeAddButton = true,
    noResultsFoundMessage,
    createToolLoading,
    ...props
}) => {
    const _className = 'w-full flex';
    const headCn = 'font-bold text-blue-900 mb-6';
    const noResultBoxCn = 'p-10 flex flex-col items-center';

    const [searchText, setSearchText] = useState('');
    const [formStatus, setFormStatus] = useState(false);
    const [choisenCategories, setChoisenCategories] = useState<number[] | null>(
        null
    );
    const [hideFilter, setHideFilter] = useState<boolean>(true);
    const [toolsCart, setToolsCart] = useState<Tool[]>([]);

    const handleSelectedTools = (data: any) => {
        if (toolSelectionMode === 'check') {
            let _tools = cloneDeep(toolsCart);
            _tools = [..._tools, ...data.selected];
            remove(_tools, t =>
                data.unSelected.some((ut: Tool) => ut.id === t.id)
            );
            _tools = uniqBy(_tools, 'id');

            setToolsCart(_tools);
        }
    };

    const handleHideCategory = (id: number) => {
        let ids = [];
        if (choisenCategories === null) {
            ids = props.categories
                .map(c => c.id)
                .filter((cId: number) => cId !== id);
        } else {
            ids = choisenCategories.filter(cc => cc !== id);
        }
        setChoisenCategories(ids);
    };

    const onPressEnterInSearch = () => { };
    const handleCategoriesFilterChange = (ids: number[]) => {
        setChoisenCategories(ids);
    };
    const handleFilterClickOutside = () => setHideFilter(true);
    const onSearchInputValue = (value: string) => {
        setSearchText(value);
    };

    useEffect(() => {
        setSearch?.(s => ({
            ...s,
            term: searchText,
            resultsCount: searchedTools?.length,
        }));
    }, [searchText]);

    let searchedTools: Tool[] =
        searchText === ''
            ? []
            : props.categories
                .reduce(
                    (group: Tool[], cat) => [
                        ...group,
                        ...cloneDeep(cat.tools),
                    ],
                    []
                )
                .filter((t: any) =>
                    t.name.toLowerCase().includes(searchText.toLowerCase())
                );
    searchedTools = uniqBy(searchedTools, 'id');
    if (searchedTools.length > 0 && formStatus) {
        setFormStatus(false);
    }
    const triggerNewTool = () => {
        if (addToolButtonFunctionalityMode === 'internal') {
            setFormStatus(true);
            return;
        }
        onAddButtonClick();
    };
    const onToolFormSubmit = (payload: any | null) => {
        props.onSubmitNewTool(payload, () => {
            setFormStatus(false);
            setSearchText('');
        });
        if (!payload) {
            setFormStatus(false);
        }
    };

    const couldShowResult = !!searchText;
    const couldShowNoResult =
        couldShowResult && searchedTools.length === 0 && !formStatus;

    const filterItems = props.categories.map(c => ({
        id: c.id,
        name: c.name,
        checked: choisenCategories === null || choisenCategories.includes(c.id),
    }));

    const categoriesElms = flow(
        filter(
            (c: any) =>
                choisenCategories === null || choisenCategories.includes(c.id)
        ),
        map(c => (
            <CategorizedTools
                key={`category-${c.id}`}
                id={c.id}
                name={c.name}
                tools={c.tools}
                onToolsSelected={handleSelectedTools}
                onRemove={handleHideCategory}
                onToolClick={onToolClick}
                toolSelectionMode={toolSelectionMode}
                selectedToolId={selectedToolId}
                toolBoxType={toolBoxType}
            />
        ))
    )(props.categories);
    const teamToolsElms = props.teams.length
        ? props.teams.map((team: Team) => {
            return (
                <TeamToolsBox
                    id={team.id}
                    key={`team-${team.id}`}
                    name={team.name}
                    members={team.members}
                    tools={team.tools}
                    color={team.color}
                    selectedTools={toolsCart}
                    onDropped={props.onDropped}
                    onRemove={props.onRemoveTool}
                />
            );
        })
        : '';

    return (
        <div className={cn(_className, className)}>
            <div
                className={'flex-grow  overflow-y-scroll mr-20'}
                style={{ height: '58vh' }}
            >
                <div className={'font-semibold py-10 mb-10 text-center	'}>
                    choose your tools, drag and drop to the team
                    </div>
                <div className={'mb-30'}>
                    {includeSearch && (
                        <SearchInput
                            onKeyPress={onPressEnterInSearch}
                            className={cn('w-full h-34 mb-20', searchClsx)}
                            value={searchText}
                            setValue={onSearchInputValue}
                        />
                    )}
                    {couldShowResult && !formStatus && (
                        <h4 className={headCn}>Result</h4>
                    )}
                    {formStatus && <h4 className={headCn}>Add a new tool</h4>}
                    {couldShowNoResult && (
                        <div className={noResultBoxCn}>
                            <p
                                className={
                                    'font-bold text-gray-500 text-md mb-6'
                                }
                            >
                                No results found
                            </p>
                            <div className={cn('flex', 'items-center')}>
                                <span className={'text-gray-400'}>
                                    {noResultsFoundMessage ||
                                        'Add your own tool by clicking on'}
                                </span>

                                {includeAddButton && (
                                    <Button
                                        className={'ml-8'}
                                        color={'blue'}
                                        onClick={triggerNewTool}
                                        svg={plusWhite}
                                        text={'ADD TOOL'}
                                    ></Button>
                                )}
                            </div>
                        </div>
                    )}
                    {formStatus && (
                        <ToolForm
                            text={searchText}
                            categories={props.categories}
                            onSubmitForm={onToolFormSubmit}
                            createToolLoading={createToolLoading}
                        />
                    )}
                    {renderSearchResults(
                        searchedTools,
                        handleSelectedTools,
                        toolBoxType,
                        toolSelectionMode,
                        selectedToolId,
                        onToolClick
                    )}
                </div>
                {Boolean(newTools?.length) &&
                    newTools &&
                    showCategorizedToolsUnderSearchResult && (
                        <div className='mb-20'>
                            <h4 className={headCn}>New Tool(s)</h4>
                            <CategorizedTools
                                id={10}
                                tools={newTools as any}
                                onToolsSelected={handleSelectedTools}
                                toolSelectionMode={toolSelectionMode}
                                selectedToolId={selectedToolId}
                                onToolClick={onToolClick}
                                toolBoxType={toolBoxType}
                            />
                        </div>
                    )}
                {props?.recommendedTools?.length && includeCategorized ? (
                    <>
                        <h4 className={headCn}>Recommended</h4>
                        <CategorizedTools
                            id={10}
                            tools={props.recommendedTools}
                            onToolsSelected={handleSelectedTools}
                            toolSelectionMode={toolSelectionMode}
                            selectedToolId={selectedToolId}
                            onToolClick={onToolClick}
                            toolBoxType={toolBoxType}
                        />
                    </>
                ) : (
                        ''
                    )}

                {includeCategorized && (
                    <>
                        <h4
                            className={cn(
                                headCn,
                                {
                                    'mt-30':
                                        props.recommendedTools &&
                                        props.recommendedTools.length, // or have search result box
                                },
                                'flex gap-10 items-center'
                            )}
                        >
                            Category filter
                            <div
                                className={
                                    'relative flex-grow flex items-center'
                                }
                            >
                                <span
                                    onClick={() => setHideFilter(false)}
                                    className={
                                        'cursor-pointer flex items-center'
                                    }
                                >
                                    <img
                                        src={filterIcon}
                                        className={'w-20 h-20'}
                                    />
                                    <img
                                        src={
                                            hideFilter
                                                ? chevronDownGray
                                                : chevronDownDarkBlue
                                        }
                                        className={'w-16 h-16'}
                                    />
                                </span>
                                <PopupFilter
                                    className={cn('absolute top-24 left-0', {
                                        hidden: hideFilter,
                                    })}
                                    items={filterItems}
                                    onChange={handleCategoriesFilterChange}
                                    onClickOutside={handleFilterClickOutside}
                                />
                            </div>
                        </h4>
                        {includeCategorized && (
                            <div className={'flex flex-col gap-24'}>
                                {categoriesElms}
                            </div>
                        )}
                    </>
                )}
            </div>
            {includeTeamsToolAssignment && (
                <div
                    className={'w-2/6  overflow-y-scroll px-6 flex-shrink-0'}
                    style={{ height: '58vh' }}
                >
                    <h4
                        className={cn(
                            headCn,
                            'mb-8 sticky top-0 bg-white z-10'
                        )}
                    >
                        Teams ({teamToolsElms.length})
                    </h4>
                    <div className={'py-6 flex flex-col gap-12'}>
                        {teamToolsElms}
                    </div>
                </div>
            )}
        </div>
    );
};

const renderSearchResults = (
    tools: Tool[],
    handleSelectedTools: Function,
    toolBoxType: 'tiny' | 'large',
    toolSelectionMode: 'check' | 'select',
    selectedToolId: number | undefined,
    onToolClick: (toolId: number) => void
) => {
    if (tools.length === 0) {
        return '';
    }
    return (
        <CategorizedTools
            id={100078}
            name={''}
            tools={tools}
            className={'mb-16'}
            onToolsSelected={handleSelectedTools}
            toolBoxType={toolBoxType}
            toolSelectionMode={toolSelectionMode}
            selectedToolId={selectedToolId}
            onToolClick={onToolClick}
        />
    );
};
