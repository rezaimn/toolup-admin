export * from './RenderSetupTeamTools';
export interface Tool {
    id: number;
    name: string;
    icon: string;
    categories?: number[];
    origin?: string;
    attributes?: string;
}

export interface ToolCategory {
    id: number;
    name: string;
    tools: Tool[];
}

export interface Team {
    id: number;
    name: string;
    members: number;
    color: string;
    tools: Tool[];
}
