import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import map from 'lodash/map';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
export type CommonTeamCardProps = {
    name: string;
    color: string;
    index: number;
    tools: any[];
    id: any;
    membersCount: number;
};
export type TeamCardProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonTeamCardProps
> &
    CommonTeamCardProps;

const colors = ['#4C2083', '#C7D30A', '#31C2D3', '#FFAD0E'];

export const TeamCard: FC<TeamCardProps> = ({
    className,
    name,
    color,
    tools,
    index,
    membersCount,
    id,
}) => {
    return (
        <div className={`${className} ${styles.main}`}>
            <div className={styles.top}>
                <div
                    className={styles.colorLine}
                    style={{
                        backgroundColor: color ? color : colors[index % 3],
                    }}
                />
                <div className='ml-21'>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.memberCount}>
                        {`${membersCount} Members in the team`}
                    </div>
                </div>
            </div>
            <div className={styles.toolWrapper}>
                {map(tools, (item, index) => {
                    return index < 3 ? (
                        <div className={styles.toolCard}>
                            <img
                                src={item.icon}
                                width={26}
                                className={styles.toolImage}
                            />
                            <div className={styles.toolText}>{item.name}</div>
                        </div>
                    ) : tools.length === 4 ? (
                        <div className={styles.toolCard}>
                            <img
                                src={item.icon}
                                width={26}
                                className={styles.toolImage}
                            />
                            <div className={styles.toolText}>{item.name}</div>
                        </div>
                    ) : index === 3 && tools.length > 4 ? (
                        <div className={styles.plusBox}>
                            {`+${tools.length - 3} Tools`}
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
};
