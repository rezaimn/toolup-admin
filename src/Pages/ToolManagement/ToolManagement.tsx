/* eslint-disable */
import { FC, useState } from 'react';
/* components */
import { ToolManagementToolsList } from 'Components/Organisms/ToolManagementToolsList';
import { ToolManagementFilter } from 'Components/Organisms/ToolManagementFilter';
import { FilterToolsReducer } from 'Components/Organisms/ToolManagementFilter/lib';
import { Spinner } from 'Components/Atomes/Spinner';
import { EmptyCardSign } from 'Components/Molecules/EmptyCardSign';
/* modules */
import { Tool, useOrganizationTools } from 'Hooks/api';
import cn from 'clsx';
/* helpers */
import {
    pipe,
    filter,
    includes,
    lowerCase,
    orderBy,
    negate,
    isEqual,
    get,
} from 'lodash/fp';
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */

const ToolManagement: FC = () => {
    const {
        data: organizationTools,
        isLoading: organizationToolsIsLoading,
        isFetching,
    } = useOrganizationTools();

    const [filterState, setFilterState] = useState<
        FilterToolsReducer | undefined
    >();

    const isLoading = organizationToolsIsLoading;

    if (isLoading || !organizationTools || isFetching) {
        return (
            <div className={cn(styles.toolManagement, styles.centered)}>
                <Spinner />
            </div>
        );
    }

    const handleFilterChange = (filterResult: FilterToolsReducer) => {
        setFilterState(filterResult);
    };

    const filterByName = (tools: Tool[]) => {
        return filter<Tool>(item =>
            includes(lowerCase(filterState?.search_term as string))(
                lowerCase(item.name)
            )
        )(tools);
    };

    const sort = (tools: Tool[]) =>
        orderBy<Tool>((tool: any) => tool?.[filterState?.sort?.name!])([
            filterState?.sort?.order as any,
        ])(tools);

    const tools = pipe(filterByName, sort)(organizationTools);
    const count = organizationTools?.length;

    const isSearching = pipe(
        get('search_term'),
        negate(isEqual(''))
    )(filterState);

    return (
        <div className={styles.toolManagement}>
            <ToolManagementFilter
                title="Company's Tools"
                description={`${count} tools added`}
                onChange={handleFilterChange}
            />

            <ToolManagementToolsList
                withAddTool={!isSearching}
                className={styles.list}
                tools={tools}
            />

            {/* {renderEmptyCardSign(tools?.length)} */}
        </div>
    );

    function renderEmptyCardSign(toolsLength: number): JSX.Element | undefined {
        if (isEqual(0)(toolsLength)) {
            return <EmptyCardSign title='No Tools found' />;
        }
    }
};

export default ToolManagement;
