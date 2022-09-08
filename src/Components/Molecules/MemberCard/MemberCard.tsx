import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import { format, isValid } from 'date-fns';
/* helpers */
/* assets */
import {
    memberPurple,
    memberCirclePurple,
    memberBlue,
    memberDarkBlue,
    memberGreen,
    memberLightBlue,
    memberOrange,
    memberRed,
    memberYellow,
    memberCircleBlue,
    memberCirclegreen,
    memberCircleOrange,
    grayDeleteIcon,
    grayEditIcon,
    calendar,
} from 'assets/icons';
/* styles */
/* types */
export type CommonMemberCardProps = {
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    date: string;
    index: number;
    teams: any[];
    id: any;
    onEditClick: (id: any) => void;
    data_cy: any;
    // onDeleteClick:(id:any)=>void
};

const icons = [
    memberPurple,
    memberBlue,
    memberDarkBlue,
    memberGreen,
    memberLightBlue,
    memberOrange,
    memberRed,
    memberYellow,
];

const colors = ['#4C2083', '#C7D30A', '#31C2D3', '#FFAD0E'];
export type MemberCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonMemberCardProps
> &
    CommonMemberCardProps;

export const MemberCard: FC<MemberCardProps> = ({
    className,
    firstName,
    lastName,
    email,
    date,
    avatar,
    index,
    id,
    onEditClick,
    data_cy,
    teams,
    // onDeleteClick
}) => {
    return (
        <div
            className={`${className} h-185 rounded-xl border border-gray-400 m-16 flex flex-col`}
            style={{ maxWidth: '320px', minWidth: '230px' }}
        >
            <div
                className={
                    'flex flex-row sticky w-max mt-20 left-full mr-10 z-0'
                }
            >
                <img
                    data-cy={data_cy}
                    onClick={() => {
                        onEditClick(id);
                    }}
                    src={grayEditIcon}
                    className={'h-20 mr-5 cursor-pointer edit-member '}
                    alt='edit-icon'
                />
                {/*<img onClick={()=>{onDeleteClick(id)}} src={grayDeleteIcon} className={'h-20 ml-5 cursor-pointer'}  alt="delete-icon"/>*/}
            </div>

            <div className='flex h-101 justify-center items-center -mt-30'>
                <img
                    src={avatar || icons[index % 8]}
                    className='w-78 h-79 rounded-full'
                />
            </div>
            <div className='flex flex-col items-center'>
                <div className='flex justify-center items-center text-sm text-gray-500'>
                    <span
                        className='w-12 h-12 m-4 rounded-full'
                        style={{
                            backgroundColor: 'blue',
                        }}
                    />
                    {firstName} {lastName}
                </div>
                <div
                    className='flex items-center text-gray-500'
                    style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: '180px',
                    }}
                >
                    {email}
                </div>
                <div className='flex justify-center items-center text-xs'>
                    {date}
                    {/*  {isValid(date) ? format(new Date(date), 'yyyy MM dd') : '-'} */}
                </div>
            </div>
        </div>
    );
};
