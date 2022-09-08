export const initialState: FilterToolsReducer = {
    search_term: '',
    sort: {
        name: 'name',
        order: 'asc',
    },
};

export type FilterToolsReducer = {
    search_term: string;
    sort: {
        name: string;
        order: 'asc' | 'desc';
    };
};

type SearchPayload = {
    search: string;
};

type SortByPayload = {
    sort: {
        name: string;
    };
};

type SortOrderPayload = {
    sort: {
        order: 'asc' | 'desc';
    };
};

type Action =
    | { type: 'search'; payload: SearchPayload }
    | { type: 'sortBy'; payload: SortByPayload }
    | { type: 'sortOrder'; payload: SortOrderPayload }
    | { type: 'clear' };

export function reducer(
    state: FilterToolsReducer,
    action: Action
): FilterToolsReducer {
    switch (action.type) {
        case 'search':
            return { ...state, search_term: action.payload.search };

        case 'sortBy':
            return {
                ...state,
                sort: {
                    order: state.sort.order,
                    name: action.payload.sort.name,
                },
            };

        case 'sortOrder':
            return {
                ...state,
                sort: {
                    name: state.sort.name,
                    order: action.payload.sort.order,
                },
            };

        case 'clear':
            return initialState;

        default:
            throw new Error();
    }
}
