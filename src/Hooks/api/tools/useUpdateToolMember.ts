/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { queryClient } from 'Services/ReactQueryService';
import {
    find,
    findIndex,
    filter,
    includes,
    map,
    uniqBy,
    pipe,
} from 'lodash/fp';
import dayJs from 'dayjs';
import produce from 'immer';
import { replaceElement } from 'Helpers/replaceElement';
import { Member } from '../members';
import { BoardingTool } from './useBoardingTools';

export type Status =
    | 'NOT_ONBOARDED'
    | 'NOT_OFFBOARDED'
    | 'OFFBOARDED'
    | 'ONBOARDED';

type PayloadProps = {
    status: Status;
    toolId: number;
    member_ids: number[];
};

const updateToolMember = async ({ toolId, ...dto }: PayloadProps) => {
    try {
        const { data } = await http.put(API_URLS.updateToolMember(toolId), dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useUpdateToolMember = () => {
    return useMutation<any, any, any, any>(updateToolMember, {
        onMutate: variables => {
            const today = dayJs(new Date()).format('YYYY-MM-DD');

            const previousToolMembers = queryClient.getQueryData([
                API_URLS.toolMembers(variables.toolId),
                undefined,
            ]) as Member[];

            /* find all tool members */
            const todayToolMembers = queryClient.getQueryData([
                API_URLS.toolMembers(variables.toolId),
                today,
            ]) as Member[];

            const toolMembers = pipe(uniqBy('id'))([
                ...previousToolMembers,
                ...todayToolMembers,
            ]);

            const userFinder = (member: Member) =>
                includes(member.id)(variables.member_ids);

            /* find current updated member */
            const updatedMembers = filter<Member>(userFinder)(toolMembers);

            const updateMembersIds = map<Member, number>(member => member.id)(
                updatedMembers
            );

            /* find index of current updated member */
            const updatedMemberIndexes = map(memberId => {
                return findIndex<Member>(member => member.id === memberId)(
                    toolMembers
                );
            })(updateMembersIds);

            const result = produce(toolMembers, (draftState: any) => {
                updatedMemberIndexes.map(idx => {
                    draftState[idx].pivot.status = variables.status;
                });
            });

            queryClient.setQueryData(
                [API_URLS.toolMembers(variables.toolId), undefined],
                result
            );

            const previousBoardingTools = queryClient.getQueryData([
                API_URLS.boardingTools,
                undefined,
            ]) as BoardingTool[];

            const copyOfPreviousBoardingTools = previousBoardingTools.slice();

            const toolFinder = (tool: BoardingTool) => {
                return tool.id === variables.toolId;
            };
            const updatedTool = find<BoardingTool>(toolFinder)(
                copyOfPreviousBoardingTools
            );
            const updatedToolIndex = findIndex<BoardingTool>(toolFinder)(
                copyOfPreviousBoardingTools
            );

            const updatedToolCopy = { ...updatedTool };

            switch (variables.status) {
                case 'NOT_OFFBOARDED':
                    updatedToolCopy.boarding_count =
                        updatedToolCopy.boarding_count + updatedMembers.length;
                    break;
                case 'NOT_ONBOARDED':
                    updatedToolCopy.boarding_count =
                        updatedToolCopy.boarding_count + updatedMembers?.length;
                    break;
                case 'ONBOARDED':
                    updatedToolCopy.boarding_count =
                        updatedToolCopy.boarding_count - updatedMembers.length;
                    break;
                case 'OFFBOARDED':
                    updatedToolCopy.boarding_count =
                        updatedToolCopy.boarding_count -
                        updatedMembers?.filter(
                            member => member.pivot.status === 'NOT_OFFBOARDED'
                        ).length;
                    break;
                default:
                    break;
            }

            queryClient.setQueryData<any>(
                [API_URLS.boardingTools, undefined],
                (old: any) =>
                    replaceElement(old, updatedToolCopy, updatedToolIndex)
            );

            return {
                previousBoardingTools,
                toolMembers,
            };
        },

        onError: (error, variables, { previousBoardingTools, toolMembers }) => {
            queryClient.setQueryData(
                [API_URLS.boardingTools, undefined],
                previousBoardingTools
            );

            queryClient.setQueryData(
                [API_URLS.toolMembers(variables.toolId), undefined],
                toolMembers
            );
        },
    });
};
