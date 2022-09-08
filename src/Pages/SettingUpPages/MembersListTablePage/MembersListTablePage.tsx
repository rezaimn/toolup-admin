import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useFilterMembers } from 'Hooks/api';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import TableHeaders from '../../../Components/Molecules/TableHeaders/TableHeaders';
import TableBody from '../../../Components/Molecules/TableBody/TableBody';
import Button from '../../../Components/Atomes/Button/Button';
import SearchInput from '../../../Components/Atomes/SearchInput/SearchInput';
import {
    deleteIcon,
    whiteDeleteIcon,
    grayFilterIcon,
    redCircleIcon,
    orangeCircleIcon,
    enterIcon,
} from '../../../assets/icons/index';

import { Member } from '../../../Store/member/models/Member';
import { setMembers } from '../../../Store/member/MemberAction';

interface Props {
    columns?: Member;
    prevStep: number;
}

const MembersListTablePage: React.FC<Props> = ({
    columns = {
        first_name: 'First Name',
        last_name: 'Last Name',
        email: 'Email',
        team_name: 'Team',
    },
    prevStep,
}) => {
    // @ts-ignore
    const member: Member[] = useSelector(state => state.members);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [addedMembersCount, setAddedMembersCount] = useState(0);
    const [readyForDelete, setReadyForDelete] = useState(false);
    const [showPressEnterGuid, setShowPressEnterGuid] = useState(false);
    const [
        selectedRowsForDeleteCount,
        setSelectedRowsForDeleteCount,
    ] = useState(0);
    const [deleteClicked, setDeleteClicked] = useState(false);
    const dispatch = useDispatch();
    const [
        membersWithNameWarningCount,
        setMembersWithNameWarningCount,
    ] = useState(0);
    const [
        membersWithEmailErrorCount,
        setMembersWithEmailErrorCount,
    ] = useState(0);
    const [searchKeyPressResult, setSearchKeyPressResult] = useState('');
    const { data: updatedMembers = [], isFetching } = useFilterMembers({
        query: {
            access: 'Normal User',
        },
    });
    useEffect(() => {
        if (isEmpty(member)) {
            if (!isFetching) {
                // @ts-ignore
                dispatch(setMembers(updatedMembers));
            }
        }
    }, [updatedMembers]);
    const onPressEnterInSearch = (event: any) => {
        setSearchKeyPressResult(event.key);
    };
    const searchMembers = (value: string) => {
        setSearchInputValue(value);
    };
    const updateNotifsCount = (
        addedCount: number,
        warningCount: number,
        errorCount: number
    ) => {
        setAddedMembersCount(addedCount);
        setMembersWithNameWarningCount(warningCount);
        setMembersWithEmailErrorCount(errorCount);
    };
    return (
        <>
            <div className='grid grid-cols-12 gap-4 mb-3 mx-10'>
                <div className='col-span-2 -ml-12 '>
                    <Button
                        className='mt-14'
                        svg={readyForDelete ? whiteDeleteIcon : deleteIcon}
                        onClick={() => {
                            setDeleteClicked(true);
                        }}
                        color={readyForDelete ? 'blue' : 'gray'}
                        disabled={!readyForDelete}
                        text='Delete'
                    />
                </div>
                <div className='col-span-4'>
                    <p className='text-gray-700 mt-22'>{`${
                        selectedRowsForDeleteCount > 0
                            ? `${selectedRowsForDeleteCount} Members Are Selected`
                            : ''
                    }`}</p>
                </div>
                <div className='col-span-5'>
                    <SearchInput
                        onKeyPress={onPressEnterInSearch}
                        className={'float-right'}
                        value={searchInputValue}
                        setValue={searchMembers}
                    />
                </div>
                <div className='col-span-1 mt-22'>
                    <img
                        src={grayFilterIcon}
                        className='ml-8 cursor-pointer'
                        alt={'gray-filter'}
                    />
                </div>
            </div>
            <div className='flex flex-col h-320 mx-10'>
                {showPressEnterGuid && (
                    <div
                        style={{
                            width: 'fit-content',
                            position: 'absolute',
                            right: '16px',
                            marginTop: '20px',
                        }}
                    >
                        <img
                            style={{ marginLeft: '38e %', marginBottom: '8px' }}
                            src={enterIcon}
                            alt='enter icon'
                        />
                        <p className='text-gray-400 text-12'>
                            Press Enter to add
                        </p>
                    </div>
                )}
                <div className='flex-grow overflow-auto border border-blue-900 rounded-sm not-selectable'>
                    <table className='relative w-full border'>
                        <TableHeaders columns={columns} />
                        <TableBody
                            showPressEnterGuid={setShowPressEnterGuid}
                            setSelectedRowsForDeleteCount={
                                setSelectedRowsForDeleteCount
                            }
                            setReadyForDelete={setReadyForDelete}
                            deleteClicked={deleteClicked}
                            setDeleteClicked={setDeleteClicked}
                            updateNotifsCount={updateNotifsCount}
                            searchKeyPressResult={searchKeyPressResult}
                            searchInput={searchInputValue}
                            className={''}
                            hasAddNewRow
                            data={member}
                            visibleData={columns}
                        />
                    </table>
                </div>
            </div>
            <div className='grid grid-cols-3 gap-4 mt-14'>
                <div className='font-bold'>
                    {addedMembersCount > 0 && (
                        <h4>
                            {addedMembersCount > 0 ? addedMembersCount : ''}{' '}
                            members have been added to the list.
                        </h4>
                    )}
                </div>
                <div className='flex'>
                    {membersWithNameWarningCount > 0 && (
                        <>
                            <div className='flex-initial'>
                                <img
                                    className={'mt-4 mr-6'}
                                    src={orangeCircleIcon}
                                />
                            </div>
                            <div className='flex-initial'>
                                <h4 className={'text-yellow-500'}>
                                    {membersWithNameWarningCount > 0
                                        ? membersWithNameWarningCount
                                        : ''}{' '}
                                    members without a name/last name
                                </h4>
                            </div>
                        </>
                    )}
                </div>
                <div className='flex'>
                    {membersWithEmailErrorCount > 0 && (
                        <>
                            <div className='flex-initial'>
                                <img
                                    className={'mt-4 mr-6'}
                                    src={redCircleIcon}
                                />
                            </div>
                            <div className='flex-initial'>
                                <h4 className={'text-red-600'}>
                                    {membersWithEmailErrorCount > 0
                                        ? membersWithEmailErrorCount
                                        : ''}{' '}
                                    members with an error email
                                </h4>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default MembersListTablePage;
