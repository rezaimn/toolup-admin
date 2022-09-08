import React from 'react';
import { sortUpIcon } from '../../../../src/assets/icons/index';

interface Props {
    columns: any;
}

const TableHeaders: React.FC<Props> = ({ columns = {} }) => {
    return (
        <>
            <thead
                className={
                    'sticky -top-1 border-solid border border-gray-300  rounded-lg '
                }
            >
                <tr>
                    <th
                        scope='col'
                        className={`sticky -top-1  w-8 h-24  border-solid border border-gray-300 bg-gray-200  px-6  text-left text-sm font-medium text-blue-900  tracking-wider`}
                    >
                        No.
                        {
                            <img
                                className={
                                    'float-right mt-8 mr-6 cursor-pointer'
                                }
                                src={sortUpIcon}
                            />
                        }
                    </th>
                    {columns &&
                        Object.keys(columns).map(
                            (key: string, index: number) => {
                                return (
                                    <th
                                        scope='col'
                                        key={key + '-head'}
                                        className={`sticky -top-1 w-8 h-24  border-solid border border-gray-300 bg-gray-200  px-6  text-left text-sm font-medium text-blue-900  tracking-wider`}
                                    >
                                        {columns[key]}
                                        {index == 0 && (
                                            <img
                                                className={
                                                    'float-right mt-8 mr-6 cursor-pointer'
                                                }
                                                src={sortUpIcon}
                                            />
                                        )}
                                    </th>
                                );
                            }
                        )}
                </tr>
            </thead>
        </>
    );
};

export default TableHeaders;
