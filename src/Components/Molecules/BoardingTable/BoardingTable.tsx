import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Member } from 'Hooks/api';
import dayJs from 'dayjs';
/* helpers */
import { map, pipe, slice } from 'lodash/fp';
import { useTable, Column } from 'react-table';
import { RandomColorizedProfileIcon } from 'Components/Atomes/RandomColorizedProfileIcon';
/* assets */
/* styles */
/* types */
export type CommonBoardingTableProps = {
    members: Member[];
};

export type BoardingTableProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonBoardingTableProps
> &
    CommonBoardingTableProps;

export const BoardingTable: FC<BoardingTableProps> = ({
    className,
    members,
    ...restProps
}) => {
    const data = React.useMemo(
        () =>
            pipe(
                slice(0, 2),
                map<Member, object>(member => ({
                    col1: <RandomColorizedProfileIcon />,
                    col2: `${member.first_name} ${member.last_name}`,
                    col3: member?.pivot?.position || '-',
                    col4: dayJs(new Date(member.created_at)).format(
                        'YYYY-MM-DD'
                    ),
                }))
            )(members),
        []
    );

    const columns: any = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'col1',
                width: 30,
            },
            {
                Header: 'Name',
                accessor: 'col2',
            },
            {
                Header: 'Position',
                accessor: 'col3',
            },
            {
                Header: 'Date',
                accessor: 'col4',
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    const hasMoreThan2Members = members.length > 3;
    return (
        <div className={cn(className, 'flex', 'items-start', 'flex-col')}>
            {/* {renderedMembers} */}
            <table className={cn('w-full')} {...getTableProps()}>
                <thead className='text-left'>
                    {
                        // Loop over the header rows
                        headerGroups.map((headerGroup, index) => (
                            // Apply the header row props
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    // Loop over the headers in each row
                                    headerGroup.headers.map(column => (
                                        // Apply the header cell props
                                        <th
                                            className={cn('px-5')}
                                            {...column.getHeaderProps()}
                                        >
                                            {
                                                // Render the header
                                                column.render('Header')
                                            }
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody className={cn('text-gray-500')} {...getTableBodyProps()}>
                    {
                        // Loop over the table rows
                        rows.map(row => {
                            // Prepare the row for display
                            prepareRow(row);
                            return (
                                // Apply the row props
                                <tr {...row.getRowProps()}>
                                    {
                                        // Loop over the rows cells
                                        row.cells.map(cell => {
                                            // Apply the cell props
                                            return (
                                                <td
                                                    style={{
                                                        width:
                                                            cell?.column?.width,
                                                    }}
                                                    className={cn(
                                                        'py-10',
                                                        'px-5',
                                                        'truncate'
                                                    )}
                                                    {...cell.getCellProps()}
                                                >
                                                    {
                                                        // Render the cell contents
                                                        cell.render('Cell')
                                                    }
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            {hasMoreThan2Members && <ShowMore count={members.length - 2} />}
        </div>
    );
};

type ShowMoreProps = {
    count: number;
};

const ShowMore = ({ count = 0 }: ShowMoreProps) => {
    return (
        <div
            className={cn(
                'mt-10',
                'flex',
                'items-center',
                'w-full',
                'justify-between'
            )}
        >
            <p className={cn('w-2/3', 'font-bold', 'text-gray-500', 'text-xs')}>
                And {count} other members
            </p>

            <p className={cn('w-1/3')}></p>
        </div>
    );
};
