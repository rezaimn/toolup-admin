import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { Member } from '../../../Store/member/models/Member';
import {
    checkboxCheckedIcon,
    checkboxUnCheckedIcon,
    memberDarkBlue,
} from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonTeamMemberWideCardProps = {
    member: any;
    isSelectable: boolean;
    onCheckClicked?: () => void;
};
export type TeamMemberWideCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeamMemberWideCardProps
> &
    CommonTeamMemberWideCardProps;

export const TeamMemberWideCard: FC<TeamMemberWideCardProps> = ({
    className,
    member,
    isSelectable = false,
    onCheckClicked = () => {},
}) => {
    return (
        <div className={cn(className)} data-cy='memberCard'>
            <div className='grid  gap-40 grid-cols-12 border border-gray-300 rounded-md mt-8'>
                <div
                    className={`${
                        isSelectable ? 'col-span-3' : 'col-span-4'
                    } flex`}
                >
                    <span>
                        <img
                            src={member.avatar ? member.avatar : memberDarkBlue}
                            alt='avatar'
                            className='rounded-full w-40 h-40 my-4 mx-8 '
                        />
                    </span>
                    <span className='ml-12 mt-18'>
                        {member.first_name} {member.last_name}
                    </span>
                </div>
                <div
                    className={`${
                        isSelectable ? 'col-span-3' : 'col-span-4 '
                    } mt-18`}
                >
                    {member.email}
                </div>
                <div
                    className={`${
                        isSelectable
                            ? 'col-span-3'
                            : 'col-span-4 text-right pr-40'
                    } mt-18`}
                >
                    {member.onboarding_date}
                </div>
                {isSelectable && (
                    <div
                        className={`${
                            isSelectable ? 'col-span-3' : 'col-span-4'
                        } mt-18`}
                    >
                        <img
                            className='cursor-pointer float-right mr-16'
                            src={
                                member.isChecked
                                    ? checkboxCheckedIcon
                                    : checkboxUnCheckedIcon
                            }
                            alt=''
                            onClick={onCheckClicked}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
