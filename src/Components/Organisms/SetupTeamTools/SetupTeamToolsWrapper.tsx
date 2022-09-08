/* components */
import { RenderSetupTeamTools } from 'Components/Organisms/SetupTeamTools/RenderSetupTeamTools';
import { Spinner } from 'Components/Atomes/Spinner';

/* modules */
import { useQueryClient } from 'react-query';
import { ComponentPropsWithoutRef, Dispatch, FC, SetStateAction } from 'react';
import { get, uniqBy } from 'lodash';
import cn from 'clsx';

/* helpers */
import {
    useCreateTool,
    useEditToolImage,
    TeamHttpResponse,
    useAllTools,
    useAddTeamTool,
    useOrganizationTeams,
    useRecommendedTools,
    useUnusedTools,
    AllToolsQueryMode,
} from 'Hooks/api';
import { useDeleteTeamTool } from 'Hooks/api/teams/useDeleteTeamTool';
import API_URLS from 'Constants/apiUrls';

/* assets */
import { defaulToolIcon } from 'assets/icons';

/* types */
import { Team, Tool } from 'Components/Organisms/SetupTeamTools';
import { AddToolSearch } from 'Pages/AddTool/AddTool';
import { toast } from 'Components/Atomes/ToastContainer';

/* styles */

export type CommonSetupTeamToolsProps = {
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
    teamId?: string;
    toolsQueryMode?: AllToolsQueryMode;
};
export type SetupTeamToolsProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonSetupTeamToolsProps
> &
    CommonSetupTeamToolsProps;

export const SetupTeamToolsWrapper: FC<SetupTeamToolsProps> = ({
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
    noResultsFoundMessage = '',
    teamId,
    toolsQueryMode = 'allTools',
}) => {
    const {
        isLoading: teamsIsLoadingTeams,
        data: teamsData = [],
    } = useOrganizationTeams(teamId);
    const { data: toolsData = [], isLoading: userToolsIsLoading } = useAllTools(
        { enabled: !onlyNewTools },
        toolsQueryMode
    );

    const {
        data: recommendedTools = [],
        isLoading: recomendedToolsIsLoading,
    } = useRecommendedTools({}, { enabled: !onlyNewTools });

    const {
        data: unusedTools = [],
        isLoading: unusedToolsIsLoading,
    } = useUnusedTools();

    const isLoaded =
        !userToolsIsLoading &&
        !teamsIsLoadingTeams &&
        !recomendedToolsIsLoading &&
        !unusedToolsIsLoading;

    const teams: Team[] = teamsData?.map((t: TeamHttpResponse) => ({
        id: t.id,
        name: t.name,
        members: t.members_count,
        color: 'blue',
        tools: t.tools.map(tool => ({
            id: tool.id,
            name: tool.name,
            icon: tool.icon || defaulToolIcon,
            category: get(tool.categories, '0.id', 0),
            attributes: tool?.attributes,
        })),
    }));
    const tools: any[] = uniqBy([...toolsData, ...unusedTools], 'id')?.map(
        t => ({
            id: t.id,
            name: t.name,
            icon: t.icon || defaulToolIcon,
            categories: t.categories.map(c => c.id),
        })
    );
    let categories: any[] = uniqBy(
        toolsData?.reduce(
            (group: any[], row: any) => [...group, ...row.categories],
            []
        ),
        'id'
    );
    categories = categories.map(c => {
        return {
            id: c.id,
            name: c.name,
            tools: tools.filter(t => t.categories.includes(c.id)),
        };
    });

    const { mutate: addTools } = useAddTeamTool();
    const { mutate: deleteTool } = useDeleteTeamTool();
    const {
        mutate: createTool,
        isLoading: createToolLoading,
    } = useCreateTool();
    const { mutate: addToolImage } = useEditToolImage();

    const queryClient = useQueryClient();

    const handleDropped = (data: any) => {
        addTools(data, {
            onSuccess: () => {
                console.info('tools added successfully');
                if (teamId) {
                    queryClient.invalidateQueries(API_URLS.showTeam(teamId));
                    return;
                }

                queryClient.invalidateQueries(API_URLS.orgTeams);
                queryClient.invalidateQueries(API_URLS.userTools);
            },
            onError: err => {
                console.error('error on adding tools', err);
            },
        });
    };
    const handleRemoveTool = (data: any) => {
        deleteTool(data, {
            onSuccess: () => {
                console.info('a tool removed');
                if (teamId) {
                    queryClient.invalidateQueries(API_URLS.showTeam(teamId));
                    return;
                }
                queryClient.invalidateQueries(API_URLS.orgTeams);
            },
            onError: err => {
                console.error(err);
            },
        });
    };
    const onToolCreated = (icon: any, id: number, onSuccess: () => void) => {
        console.info('tools is added');
        addToolImage(
            {
                toolId: id,
                icon: icon,
            },
            {
                onSuccess: (response: any) => {
                    console.info('a image added', response);
                    queryClient.invalidateQueries(API_URLS.allTools);
                    queryClient.invalidateQueries(API_URLS.unusedTools);
                    onSuccess();
                    toast('success', 'Tool Successfully added');
                },
                onError: (err: any) => {
                    console.error('adding image to tool', err);
                },
            }
        );
    };
    const handleSubmitNewTool = (payload: any, onSuccess: () => void) => {
        if (payload) {
            console.info('added tool');
            createTool(
                {
                    name: payload.name,
                    url: payload.url,
                    categories: payload.categories,
                },
                {
                    onSuccess: (response: any) => {
                        console.info('a tool created');
                        queryClient.invalidateQueries(API_URLS.allTools);
                        if (payload.image) {
                            onToolCreated(
                                payload.image || '',
                                response.id,
                                onSuccess
                            );
                        }
                        if (!payload.image) {
                            onSuccess();
                            queryClient.invalidateQueries(API_URLS.allTools);
                            queryClient.invalidateQueries(API_URLS.unusedTools);

                            toast('success', 'Tool Successfully added');
                        }
                    },
                    onError: (err: any) => {
                        console.error('creating new tool', err);
                    },
                }
            );
        }
    };

    if (!isLoaded) {
        return (
            <div
                className={
                    'h-full w-full select-none text-gray-500 font-bold flex items-center justify-center'
                }
            >
                <Spinner />
            </div>
        );
    }
    return (
        <RenderSetupTeamTools
            className={className}
            categories={categories}
            teams={teams}
            recommendedTools={recommendedTools!}
            onDropped={handleDropped}
            onRemoveTool={handleRemoveTool}
            onSubmitNewTool={handleSubmitNewTool}
            createToolLoading={createToolLoading}
            includeTeamsToolAssignment={includeTeamsToolAssignment}
            includeSearch={includeSearch}
            searchClsx={searchClsx}
            onToolClick={onToolClick}
            toolSelectionMode={toolSelectionMode}
            selectedToolId={selectedToolId}
            showCategorizedToolsUnderSearchResult={
                showCategorizedToolsUnderSearchResult
            }
            addToolButtonFunctionalityMode={addToolButtonFunctionalityMode}
            onAddButtonClick={onAddButtonClick}
            toolBoxType={toolBoxType}
            onlyNewTools={onlyNewTools}
            setSearch={setSearch}
            newTools={unusedTools!}
            includeCategorized={includeCategorized}
            includeAddButton={includeAddButton}
            noResultsFoundMessage={noResultsFoundMessage}
        />
    );
};
