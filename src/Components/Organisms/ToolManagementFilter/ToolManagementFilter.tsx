/* eslint-disable */
import { ComponentPropsWithoutRef, FC, useEffect, useReducer } from 'react';
/* components */
import SearchInput from 'Components/Atomes/SearchInput/SearchInput';
/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
import ChevronIcon from 'assets/icons/chevron-down-gray.svg';
/* styles */
import styles from './styles.module.scss';
/* types */
/* internals */
import { initialState, reducer, FilterToolsReducer } from './lib';
import { find, pipe } from 'lodash/fp';

export type CommonToolManagementFilterProps = {
    onChange: (filter: FilterToolsReducer) => void;
    title: string;
    description: string;
    withSort?: boolean;
};
export type ToolManagementFilterProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolManagementFilterProps
> &
    CommonToolManagementFilterProps;

export const ToolManagementFilter: FC<ToolManagementFilterProps> = ({
    className,
    onChange,
    title,
    withSort = true,
    description,
    ...restProps
}) => {
    const [filterState, dispatchFilter] = useReducer(reducer, initialState);

    const handleSetSearchTerm = (search: string) => {
        dispatchFilter({
            type: 'search',
            payload: { search },
        });
    };

    const handleSetSort = (name: string) => {
        dispatchFilter({
            type: 'sortBy',
            payload: {
                sort: { name },
            },
        });
    };
    const handleSetOrder = (order: string) => {
        dispatchFilter({
            type: 'sortOrder',
            payload: {
                sort: {
                    order: order as 'asc' | 'desc',
                },
            },
        });
    };

    useEffect(() => onChange(filterState), [filterState]);

    return (
        <div className={cn(className, styles.filter)}>
            <div className={styles.title}>
                <p className={styles.companyTools}>{title}</p>
                <p className={styles.countText}>{description}</p>
            </div>
            {withSort && (
                <div className={styles.sort}>
                    <p className={styles.sortByTitle}>Sort by</p>
                    <p className={styles.appliedSortByText}>
                        {
                            pipe(
                                find<Props>(
                                    item => item.value === filterState.sort.name
                                )
                            )(propertySortOptions).name
                        }
                    </p>
                    <img className={styles.sortIcon} src={ChevronIcon} alt='' />
                    <div className={styles.sortWrapper}>
                        {propertySortOptions.map(sortOptionItem => (
                            <div
                                className={cn(styles.sortOption, {
                                    [styles.activeSortOption]:
                                        filterState.sort.name ===
                                        sortOptionItem.value,
                                })}
                                onClick={() =>
                                    handleSetSort(sortOptionItem.value)
                                }
                            >
                                {sortOptionItem.name}
                            </div>
                        ))}
                        <div className={styles.seprator} />

                        {orderSortOptions.map(sortOptionItem => (
                            <div
                                onKeyDown={() => {}}
                                onClick={() =>
                                    handleSetOrder(sortOptionItem.value)
                                }
                                className={cn(styles.sortOption, {
                                    [styles.activeSortOption]:
                                        filterState.sort.order ===
                                        sortOptionItem.value,
                                })}
                            >
                                {sortOptionItem.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.search}>
                <SearchInput
                    className=''
                    onKeyPress={() => {}}
                    setValue={handleSetSearchTerm}
                    value={filterState.search_term || ''}
                />
            </div>
        </div>
    );
};

type Props = {
    name: string;
    value: string;
};

const propertySortOptions = [
    {
        name: 'Name',
        value: 'name',
    },
    {
        name: 'Created at',
        value: 'created_at',
    },
];

const orderSortOptions = [
    {
        name: 'Ascending',
        value: 'asc',
    },
    {
        name: 'Descending',
        value: 'desc',
    },
];
