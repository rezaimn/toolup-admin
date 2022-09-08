import React, { FC } from 'react';
/* modules */
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

/*  you can move this part (`queryClient`) into the component, but! be aware that you have to 
    wrap it into a React.useMemo fn
*/
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const ReactQueryService: FC = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
