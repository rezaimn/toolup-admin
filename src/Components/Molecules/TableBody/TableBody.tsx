import React, { useEffect, useState } from 'react';
import TableTextInput from '../../Atomes/TableTextInput/TableTextInput';
import AutoCompleteInput from '../../Atomes/AutoCompleteInput/AutoCompleteInput';
import { Member } from '../../../Store/member/models/Member';
import { useDispatch } from 'react-redux';
import { Steps } from 'Components/Organisms/SetupProcessBanner';
import { Team } from '../../../Store/team/models/Team';
import API_URLS from '../../../Constants/apiUrls';
import { useQueryClient } from 'react-query';
import {
    useCreateUser,
    useUpdateUser,
    useUpdateSetupStep,
    useNewTeam,
    useOrgTeams,
    useBulkDeleteUser,
    useAttachMemberToTeam,
    useDetachMemberFromTeam,
} from 'Hooks/api';
import { setMembers } from '../../../Store/member/MemberAction';
import { member } from '../../Templates/Layout/assets/images';
import { enterIcon } from '../../../assets/icons';

interface Props {
    data: any[];
    visibleData: any;
    hasAddNewRow: boolean;
    className: string;
    searchKeyPressResult: string;
    searchInput: string;
    updateNotifsCount: (
        addedCount: number,
        warningCount: number,
        errorCount: number
    ) => void;
    setReadyForDelete: (status: boolean) => void;
    deleteClicked: boolean;
    setDeleteClicked: (status: boolean) => void;
    setSelectedRowsForDeleteCount: (status: number) => void;
    showPressEnterGuid: (status: boolean) => void;
}

const TableBody: React.FC<Props> = ({
    data = [],
    visibleData = [],
    hasAddNewRow = false,
    className = '',
    searchInput = '',
    setReadyForDelete,
    setSelectedRowsForDeleteCount,
    setDeleteClicked,
    deleteClicked = false,
    searchKeyPressResult = '',
    showPressEnterGuid,
    updateNotifsCount = (
        addedCount: number,
        warningCount: number,
        errorCount: number
    ) => {},
}) => {
    /** Generate Uniq Keys for each table row because some of imported members have no id
     so when you need to compare the total member list with filtered member list to find
     an specific member you can compere this generated key for each member
     **/

    /// Utils

    const randomKeyGenerator = () => {
        return Math.random().toString(36).substr(2, 8);
    };
    const configMemberListDataForTable = () => {
        return data
            ? data.map((member, index) => {
                  if (!member.teams) {
                      member.teams = [];
                  }
                  member.team_name = member.teams[1]
                      ? member.teams[1].name
                      : member.teams[0]
                      ? member.teams[0].name
                      : member.team;
                  member.rowNo = randomKeyGenerator();
                  member.selectedForDelete = false;
                  return member;
              })
            : [];
    };

    /// External Hooks
    const dispatch = useDispatch();

    /// States
    const [memberList, setMemberList] = useState(
        configMemberListDataForTable()
    );
    const [totalMemberList, setTotalMemberList] = useState(
        configMemberListDataForTable()
    );
    const [teamList, setTeamList] = useState<Team[]>([]);
    const [newMember, setNewMember] = useState<Member>({
        first_name: '',
        last_name: '',
        email: '',
        team: '',
        status: 'ONBOARDED',
    });
    const [tableHasChanged, setTableHasChanged] = useState(false);
    const [selectRowForDeleteStarted, setSelectRowForDeleteStarted] = useState(
        false
    );
    const [addNewMemberError, setAddNewMemberError] = useState<any>(null);

    /// API Functions
    const queryClient = useQueryClient();
    const { data: teamsData, isLoading } = useOrgTeams();
    const { mutate: createNewTeam, data: newTeamResponse } = useNewTeam();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: createMember } = useCreateUser();
    const { mutate: attachMemberToTeam } = useAttachMemberToTeam();
    const { mutate: detachMemberFromTeam } = useDetachMemberFromTeam();
    const { mutate: updateSetupStep } = useUpdateSetupStep();
    const { mutate: bulkDeleteUser } = useBulkDeleteUser();

    /// Use Effects

    useEffect(() => {
        if (deleteClicked) {
            setDeleteClicked(false);
            setReadyForDelete(false);
            bulkDeleteUser(
                memberList
                    .filter(member => member.selectedForDelete)
                    .map(user => {
                        if (user.id) {
                            return user.id;
                        }
                    }),
                {
                    onSuccess: (newMemberVariables, newMemberRes) => {
                        let tempTotalMemberList = [...totalMemberList];
                        tempTotalMemberList = tempTotalMemberList.filter(
                            member => !member.selectedForDelete
                        );
                        setTotalMemberList(tempTotalMemberList);
                        updateMemberState(tempTotalMemberList);
                        setMemberList(
                            memberList.filter(
                                member => !member.selectedForDelete
                            )
                        );
                    },
                }
            );
        }
    }, [deleteClicked]);
    useEffect(() => {
        setMemberList(configMemberListDataForTable());
        setTotalMemberList(configMemberListDataForTable());
    }, [data]);

    useEffect(() => {
        let addedMembers = 0;
        let membersWithEmailError = 0;
        let membersWithNameWarning = 0;
        for (let i = 0; i < memberList.length; i++) {
            if (memberList[i].id) {
                if (memberList[i].email !== '') {
                    addedMembers++;
                } else {
                    membersWithEmailError++;
                }
            }
            if (memberList[i].errors) {
                if (memberList[i].errors.email || memberList[i].email === '') {
                    membersWithEmailError++;
                    continue;
                } else {
                    membersWithNameWarning++;
                    continue;
                }
            }
        }
        updateNotifsCount(
            addedMembers,
            membersWithNameWarning,
            membersWithEmailError
        );
    }, [memberList]);

    useEffect(() => {
        setTeamList(teamsData || []);
    });
    useEffect(() => {
        updateSearchResult();
    }, [searchKeyPressResult]);

    useEffect(() => {
        if (searchInput === '') {
            setMemberList([
                ...totalMemberList.map(member => {
                    const editedMember = { ...member };
                    editedMember.selectedForDelete = false;
                    return editedMember;
                }),
            ]);
        }
    }, [searchInput]);

    /// Event Handlers

    const onInlineInputKePress = (keyValue: string, rowIndex: number) => {
        if (keyValue === 'Enter') {
            saveRowData(rowIndex);
        }
    };

    /// Logic Functions

    const clearAllSelectedRowsForDelete = () => {
        setTotalMemberList(
            totalMemberList.map(member => {
                const editedMember = { ...member };
                editedMember.selectedForDelete = false;
                return editedMember;
            })
        );
        setMemberList(
            memberList.map(member => {
                const editedMember = { ...member };
                editedMember.selectedForDelete = false;
                return editedMember;
            })
        );
    };

    const readyToSelectTableRows = (rowIndex: number) => {
        setSelectRowForDeleteStarted(true);
        selectAndDeselectRows(rowIndex, true);
    };

    const setSelectedRows = (members: Member[], rowIndex: number) => {
        let selectedCount = 0;
        return members.map((member: any, index: number) => {
            const editedMember = { ...member };
            if (rowIndex === index) {
                editedMember.selectedForDelete = !member.selectedForDelete;
            }
            if (editedMember.selectedForDelete) {
                selectedCount++;
                setReadyForDelete(true);
            }
            if (selectedCount === 0) {
                setReadyForDelete(false);
            }
            setSelectedRowsForDeleteCount(selectedCount);
            return editedMember;
        });
    };

    const selectAndDeselectRows = (
        rowIndex: number,
        selectionStarted: boolean
    ) => {
        if (selectionStarted) {
            setMemberList(setSelectedRows(memberList, rowIndex));
            setTotalMemberList(setSelectedRows(totalMemberList, rowIndex));
        }
    };

    const finishRowSelection = (rowIndex: number) => {
        setSelectRowForDeleteStarted(false);
    };

    const updateNewMemberField = (e: any) => {
        setNewMember({ ...newMember, [e.target.name]: e.target.value });
    };

    const updateSearchResult = () => {
        if (searchKeyPressResult === 'Enter') {
            setMemberList(
                totalMemberList
                    ?.filter(member => {
                        if (
                            member.first_name
                                .toLowerCase()
                                .includes(searchInput.toLowerCase()) ||
                            member.last_name
                                .toLowerCase()
                                .includes(searchInput.toLowerCase()) ||
                            member.email
                                .toLowerCase()
                                .includes(searchInput.toLowerCase())
                        ) {
                            return member;
                        }
                    })
                    .map(member => {
                        const editedMember = { ...member };
                        editedMember.selectedForDelete = false;
                        return editedMember;
                    })
            );
        }
    };

    const tableCellChangeData = (
        rowIndex: number,
        cellKey: string,
        value: string
    ) => {
        setTableHasChanged(true);
        setMemberList(
            memberList.map((member: any, index: number) => {
                const editedMember = { ...member };
                if (index === rowIndex) {
                    editedMember[cellKey] = value;
                }
                return editedMember;
            })
        );
        setTotalMemberList(
            totalMemberList.map((member: any, index: number) => {
                const editedMember = { ...member };
                if (member.rowNo === memberList[rowIndex].rowNo) {
                    editedMember[cellKey] = value;
                }
                return editedMember;
            })
        );
    };

    const clearAddMember = () => {
        showPressEnterGuid(false);
        setNewMember({
            first_name: '',
            last_name: '',
            email: '',
            team: '',
            status: 'ONBOARDED',
        });
    };

    const deleteMemberEmptyFields = (member: Member) => {
        if (member.first_name === '' || member.first_name === null) {
            delete member.first_name;
        }
        if (member.last_name === '' || member.last_name === null) {
            delete member.last_name;
        }
        if (member.email === '' || member.email === null) {
            // @ts-ignore
            delete member.email;
        }
        if (member.team === '' || member.team === null) {
            delete member.team;
        }
        return member;
    };

    const updateMemberState = (members: Member[]) => {
        dispatch(setMembers(members));
    };

    const saveNewMember = (keyPressEvent: string) => {
        let body: Member = { ...newMember };
        if (keyPressEvent === 'Enter') {
            if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(body.email)) {
                createMember(body, {
                    onSuccess: (newMemberVariables, newMemberRes) => {
                        queryClient.invalidateQueries(API_URLS.orgTeams);
                        if (newMemberRes) {
                            if (memberList.length === 0) {
                                updateSetupStep({
                                    setup_process_step: Steps.third,
                                    setup_finished: false,
                                    send_bulk_invitation_emails: undefined,
                                });
                            }
                            const membersTemp: Member[] = [...memberList];
                            const totalMembersTemp: Member[] = [
                                ...totalMemberList,
                            ];
                            newMemberVariables.team_name = newMemberVariables
                                .teams[1]
                                ? newMemberVariables.teams[1].name
                                : newMemberVariables.teams[0].name;
                            newMemberVariables.first_name = body.first_name;
                            newMemberVariables.last_name = body.last_name;
                            newMemberVariables.rowNo = randomKeyGenerator();
                            membersTemp.unshift(newMemberVariables);
                            totalMembersTemp.unshift(newMemberVariables);
                            setMemberList(membersTemp);
                            setTotalMemberList(totalMembersTemp);
                            clearAddMember();
                            updateMemberState(totalMembersTemp);
                            setAddNewMemberError(null);
                        }
                    },
                    onError: (err: any) => {
                        setAddNewMemberError(err?.response?.data?.errors);
                    },
                });
            } else {
                setAddNewMemberError({
                    detail: { email: 'Email Format is wrong.' },
                });
            }
        }
    };

    const attachUserToTeam = (
        memberVariables: any,
        teamVariables: any,
        rowIndex: any
    ) => {
        attachMemberToTeam(
            { member_id: memberVariables.id, team_id: teamVariables.id },
            {
                onSuccess: (attachMemberVariables, memberUpdateRes) => {
                    const membersTemp = [...memberList];
                    let totalMembersTemp: Member[] = [...totalMemberList];
                    memberVariables.rowNo = membersTemp[rowIndex].rowNo;
                    memberVariables.team_name = teamVariables.name;
                    memberVariables.teams = [...memberList[rowIndex].teams];
                    if (memberVariables.teams.length > 1) {
                        memberVariables.teams.pop();
                    }
                    memberVariables.teams.push(teamVariables);
                    membersTemp[rowIndex] = { ...memberVariables };
                    totalMembersTemp = totalMembersTemp.map(member => {
                        if (membersTemp[rowIndex].rowNo === member.rowNo) {
                            member = { ...memberVariables };
                        }
                        return member;
                    });
                    setTotalMemberList(totalMembersTemp);
                    setMemberList(membersTemp);
                    updateMemberState(membersTemp);
                },
            }
        );
    };

    const createTeamAndAssignMemberToTeam = (
        teamIndex: number,
        rowIndex: number,
        userBody: Member
    ) => {
        createNewTeam(
            { name: memberList[rowIndex].team_name },
            {
                onSuccess: (teamVariables, teamRes) => {
                    queryClient.invalidateQueries(API_URLS.orgTeams);
                    if (teamVariables) {
                        updateUser(deleteMemberEmptyFields(userBody), {
                            onSuccess: (memberVariables, memberUpdateRes) => {
                                if (memberVariables) {
                                    if (memberList[rowIndex].teams.length > 1) {
                                        detachMemberFromTeam(
                                            {
                                                member_id: memberVariables.id,
                                                team_id:
                                                    memberList[rowIndex]
                                                        .teams[1].id,
                                            },
                                            {
                                                onSuccess: (
                                                    attachMemberVariables,
                                                    memberUpdateRes
                                                ) => {
                                                    attachUserToTeam(
                                                        memberVariables,
                                                        teamVariables,
                                                        rowIndex
                                                    );
                                                },
                                            }
                                        );
                                    } else {
                                        attachUserToTeam(
                                            memberVariables,
                                            teamVariables,
                                            rowIndex
                                        );
                                    }
                                }
                            },
                        });
                    }
                },
            }
        );
    };

    const attachUserToExistedTeam = (
        memberUpdateRes: any,
        teamIndex: number,
        rowIndex: number
    ) => {
        // @ts-ignore
        attachMemberToTeam(
            {
                member_id: memberList[rowIndex].id,
                team_id: teamList[teamIndex].id,
            },
            {
                onSuccess: (
                    attachMemberToTeamVariables,
                    attachMemberToTeamRes
                ) => {
                    const membersTemp = [...memberList];
                    let totalMembersTemp: Member[] = [...totalMemberList];
                    let tempMember = membersTemp[rowIndex];
                    if (tempMember.teams.length > 1) {
                        tempMember.teams.pop();
                    }
                    tempMember.teams.push(teamList[teamIndex]);
                    membersTemp[rowIndex] = { ...tempMember };
                    if (membersTemp[rowIndex].errors) {
                        delete membersTemp[rowIndex].errors;
                    }
                    totalMembersTemp = totalMembersTemp.map(member => {
                        if (membersTemp[rowIndex].rowNo === member.rowNo) {
                            member = { ...tempMember };
                            if (member.errors) {
                                delete member.errors;
                            }
                        }
                        return member;
                    });
                    setTotalMemberList(totalMembersTemp);
                    setMemberList(membersTemp);
                    updateMemberState(totalMembersTemp);
                },
            }
        );
    };

    const updateUserAndAssignMemberToTeam = (
        teamIndex: number,
        rowIndex: number,
        userBody: Member
    ) => {
        updateUser(deleteMemberEmptyFields(userBody), {
            onSuccess: (memberUpdateVariables, memberUpdateRes) => {
                if (memberUpdateVariables) {
                    if (
                        memberList[rowIndex].teams[1].name !==
                        memberList[rowIndex].team_name
                    ) {
                        detachMemberFromTeam(
                            {
                                member_id: memberList[rowIndex].id,
                                team_id: memberList[rowIndex].teams[1].id,
                            },
                            {
                                onSuccess: (
                                    attachMemberVariables,
                                    memberUpdateRes
                                ) => {
                                    attachUserToExistedTeam(
                                        memberUpdateRes,
                                        teamIndex,
                                        rowIndex
                                    );
                                },
                            }
                        );
                    }
                }
            },
        });
    };

    const createNewMemberInline = (rowIndex: number, userBody: Member) => {
        userBody.team = memberList[rowIndex].team_name;
        userBody.status = 'ONBOARDED';
        createMember(deleteMemberEmptyFields(userBody), {
            onSuccess: (variables, newMemberRes) => {
                queryClient.invalidateQueries(API_URLS.orgTeams);
                if (variables) {
                    const membersTemp = [...memberList];
                    let totalMembersTemp: Member[] = [...totalMemberList];
                    variables.team_name = variables.teams[1]
                        ? variables.teams[1].name
                        : variables.teams[0].name;
                    variables.rowNo = membersTemp[rowIndex].rowNo;
                    membersTemp[rowIndex] = { ...variables };
                    totalMembersTemp = totalMembersTemp.map(member => {
                        if (membersTemp[rowIndex].rowNo === member.rowNo) {
                            member = { ...variables };
                        }
                        return member;
                    });
                    setTotalMemberList(totalMembersTemp);
                    setMemberList(membersTemp);
                    updateMemberState(totalMembersTemp);
                }
            },
        });
    };

    const detachEmptyTeam = (rowIndex: number) => {
        if (memberList[rowIndex].teams.length > 1) {
            detachMemberFromTeam(
                {
                    member_id: memberList[rowIndex].id,
                    team_id: memberList[rowIndex].teams[1].id,
                },
                {
                    onSuccess: (attachMemberVariables, memberUpdateRes) => {
                        const membersTemp = [...memberList];
                        const totalMembersTemp: Member[] = [...totalMemberList];
                        membersTemp[rowIndex].teams.pop();
                        setMemberList(membersTemp);
                        setTotalMemberList(
                            totalMembersTemp.map(member => {
                                if (
                                    membersTemp[rowIndex].rowNo === member.rowNo
                                ) {
                                    member = { ...membersTemp[rowIndex] };
                                }
                                return member;
                            })
                        );
                        updateMemberState(totalMembersTemp);
                    },
                }
            );
        }
    };

    const saveRowData = (rowIndex: number) => {
        if (tableHasChanged) {
            setTableHasChanged(false);
            let userBody: Member = {
                first_name: memberList[rowIndex].first_name,
                last_name: memberList[rowIndex].last_name,
                email: memberList[rowIndex].email,
                id: memberList[rowIndex].id ? memberList[rowIndex].id : 0,
            };
            if (userBody.id === 0) {
                delete userBody.id;
            }
            const teamIndex = teamList
                ? teamList.findIndex(
                      team => team.name === memberList[rowIndex].team_name
                  )
                : -1;
            if (userBody.id) {
                if (teamIndex < 0) {
                    if (memberList[rowIndex].team_name === '') {
                        detachEmptyTeam(rowIndex);
                    } else {
                        createTeamAndAssignMemberToTeam(
                            teamIndex,
                            rowIndex,
                            userBody
                        );
                    }
                } else {
                    updateUserAndAssignMemberToTeam(
                        teamIndex,
                        rowIndex,
                        userBody
                    );
                }
            } else {
                createNewMemberInline(rowIndex, userBody);
            }
        }
    };

    return (
        <>
            <tbody className={` bg-white divide-y  ${className}`}>
                <tr className={` border-solid border border-gray-150`}>
                    <td className='text-center  w-36 text-gray-800 border-solid border border-gray-300 px-2 h-34 whitespace-nowrap bg-gray-100'>
                        New
                    </td>
                    <td
                        className={`text-center h-34  border-solid border border-gray-300 p-0 whitespace-nowrap bg-gray-100`}
                    >
                        <TableTextInput
                            onFocus={() => {
                                showPressEnterGuid(true);
                            }}
                            name={'first_name'}
                            value={newMember.first_name}
                            className={
                                'bg-gray-100 text-gray-600 placeholder-gray-300 h-34'
                            }
                            placeholder={'Type First Name...'}
                            onInlineInputKePress={saveNewMember}
                            onChangeInputValue={updateNewMemberField}
                        />
                    </td>
                    <td
                        className={`text-center h-34  border-solid border border-gray-300 p-0 whitespace-nowrap bg-gray-100`}
                    >
                        <TableTextInput
                            onFocus={() => {
                                showPressEnterGuid(true);
                            }}
                            name={'last_name'}
                            value={newMember.last_name}
                            className={
                                'bg-gray-100 text-gray-600 placeholder-gray-300 h-34'
                            }
                            placeholder={'Type Last Name...'}
                            onInlineInputKePress={saveNewMember}
                            onChangeInputValue={updateNewMemberField}
                        />
                    </td>
                    <td
                        className={`text-center h-34  border-solid   p-0 whitespace-nowrap ${
                            addNewMemberError && addNewMemberError.detail.email
                                ? 'border-2 border-red-300 '
                                : 'border border-gray-300 '
                        } bg-gray-100`}
                    >
                        <TableTextInput
                            onFocus={() => {
                                showPressEnterGuid(true);
                            }}
                            name={'email'}
                            value={newMember.email}
                            className={
                                'bg-gray-100 text-gray-600 placeholder-gray-300 h-34'
                            }
                            placeholder={'Type Email...'}
                            onInlineInputKePress={saveNewMember}
                            onChangeInputValue={updateNewMemberField}
                        />
                    </td>
                    <td
                        className={`text-center h-34 text-gray-400 border-solid border border-gray-300 p-0 whitespace-nowrap bg-gray-100`}
                    >
                        <AutoCompleteInput
                            onKeyPress={saveNewMember}
                            onChange={updateNewMemberField}
                            placeholder={'Type here'}
                            name={'team'}
                            value={newMember.team}
                            className={
                                'bg-gray-100 placeholder-gray-300 text-gray-600'
                            }
                        />
                    </td>
                </tr>
                {memberList?.map((row, index) => {
                    return (
                        <>
                            <tr
                                key={'table-row-' + index}
                                className={` border-solid border  ${
                                    row.selectedForDelete
                                        ? 'border-blue-400'
                                        : row.id
                                        ? 'border-gray-300'
                                        : 'border-orange-500'
                                }`}
                            >
                                <td
                                    onMouseDown={() =>
                                        readyToSelectTableRows(index)
                                    }
                                    onMouseOver={() =>
                                        selectAndDeselectRows(
                                            index,
                                            selectRowForDeleteStarted
                                        )
                                    }
                                    onMouseUp={() => finishRowSelection(index)}
                                    // onClick={()=>{clearAllSelectedRowsForDelete()}}
                                    className={` cursor-move text-center text-gray-800  px-2 h-34 whitespace-nowrap ${
                                        row.selectedForDelete
                                            ? 'bg-blue-200'
                                            : ''
                                    }`}
                                >
                                    {index + 1}
                                </td>
                                {row &&
                                    Object.keys(visibleData).map(
                                        (key: string) => {
                                            return (
                                                <td
                                                    key={key + '-' + index}
                                                    className={` text-gray-600 border-r border-l border-right-gary-300  p-0 whitespace-nowrap `}
                                                >
                                                    <TableTextInput
                                                        name={key}
                                                        className={`h-34  ${
                                                            row.selectedForDelete
                                                                ? 'bg-blue-200'
                                                                : !row.id
                                                                ? row.errors &&
                                                                  row.errors
                                                                      .email
                                                                    ? 'bg-red-100'
                                                                    : 'bg-red-50'
                                                                : index % 2 ===
                                                                  1
                                                                ? 'bg-gray-50'
                                                                : 'bg-white'
                                                        }`}
                                                        value={row[key]}
                                                        placeholder={
                                                            visibleData[key]
                                                        }
                                                        onFocus={() => {
                                                            clearAllSelectedRowsForDelete();
                                                        }}
                                                        onBlur={saveRowData}
                                                        onInlineInputKePress={
                                                            onInlineInputKePress
                                                        }
                                                        rowIndex={index}
                                                        cellKey={key}
                                                        tableCellChangeData={
                                                            tableCellChangeData
                                                        }
                                                    />
                                                </td>
                                            );
                                        }
                                    )}
                            </tr>
                        </>
                    );
                })}
            </tbody>
        </>
    );
};

export default TableBody;
