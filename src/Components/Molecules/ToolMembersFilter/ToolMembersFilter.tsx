import { FC, useRef, useState, useEffect } from 'react';
/* components */
import Select, { Styles } from 'react-select';
/* modules */
import cn from 'clsx';
import { useOnClickOutside } from 'Hooks';
import { OrganizationPosition, Status } from 'Hooks/api';
/* helpers */
import { map, capitalize, uniqueId } from 'lodash/fp';
/* assets */
import { ReactComponent as FilterIcon } from 'assets/icons/fixed-filter.svg';
/* styles */
/* types */
import { Team } from 'Store/team/models/Team';

export type CommonToolMembersFilterProps = {
    teams?: Team[];
    positions?: OrganizationPosition[];

    onTeamChange: (teamId: number) => void;
    onStatusChange: (status: Status) => void;
    onPositionChange: (position: string) => void;
    clear: () => void;
    done: () => void;
};

export type ToolMembersFilterProps = CommonToolMembersFilterProps;

const filterStyles: Styles<any, any, any> = {
    container: styles => ({
        ...styles,
        marginBottom: '10px',
    }),
    control: styles => ({
        ...styles,
        backgroundColor: 'white',
        height: '20px',
    }),

    menu: styles => ({
        ...styles,
    }),

    indicatorSeparator: styles => ({ ...styles, display: 'none' }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            padding: '3px 10px',
        };
    },
};

type Option = {
    label: string;
    value: string;
};
export const ToolMembersFilter: FC<ToolMembersFilterProps> = ({
    teams,
    onPositionChange,
    onStatusChange,
    onTeamChange,
    clear,
    positions,
    done,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(o => !o);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const [uniqKey, setUniqKey] = useState({
        position: uniqueId('prefix'),
        team: uniqueId('team-'),
        status: uniqueId('-status-'),
    });
    const ref = useRef(null);

    useOnClickOutside(ref, close);

    const teamOptions = map<Team, Option>(team => ({
        label: capitalize(team.name!),
        value: String(team.id!),
    }))(teams);

    const positionOptions = map<OrganizationPosition, Option>(position => ({
        label: capitalize(position.position),
        value: position.position,
    }))(positions);

    const handleClear = () => {
        setUniqKey({
            position: uniqueId('prefix'),
            team: uniqueId('team-'),
            status: uniqueId('-status-'),
        });
        clear();
        close();
    };
    const statusOptions = [
        {
            label: 'Not Onboarded',
            value: 'NOT_ONBOARDED',
        },

        {
            label: 'Onboarding',
            value: 'ONBOARDING',
        },

        {
            label: 'Not Offboarded',
            value: 'NOT_OFFBOARDED',
        },
    ];

    const handleDone = () => {
        done();
        toggle();
    };

    return (
        <div className={cn('flex', 'flex-col', 'relative', 'select-none')}>
            <FilterIcon
                className={cn(
                    'w-20',
                    'h-20',
                    'self-end',
                    'mb-10',
                    'cursor-pointer',
                    { 'text-gray-300': !isOpen },
                    { 'text-parimary': isOpen }
                )}
                onClick={open}
            />

            <div
                className={cn(
                    'p-20',
                    'bg-white',
                    'shadow-lg',
                    'rounded-lg',
                    'absolute',
                    { 'z-10': isOpen },
                    'right-0',
                    'top-30',
                    'w-320',
                    'opacity-0',
                    { 'opacity-100': isOpen }
                )}
                ref={ref}
            >
                <Select
                    key={uniqKey.team}
                    styles={filterStyles}
                    options={teamOptions}
                    placeholder='Team'
                    onChange={selectEvent => onTeamChange(selectEvent.value)}
                />

                <Select
                    key={uniqKey.status}
                    styles={filterStyles}
                    options={statusOptions}
                    placeholder='Member Status'
                    onChange={selectEvent => onStatusChange(selectEvent.value)}
                />

                <Select
                    key={uniqKey.position}
                    styles={filterStyles}
                    options={positionOptions}
                    placeholder='Position'
                    onChange={selectEvent =>
                        onPositionChange(selectEvent.value)
                    }
                />

                <div className={btnParentClsx}>
                    <button
                        className={cn(btnClsx, clearBtnClsx)}
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                    <button
                        className={cn(btnClsx, primaryBtnClsx)}
                        onClick={handleDone}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
const btnParentClsx =
    'flex w-full justify-center mt-20 space-x-10 outline-none';
const btnClsx = 'rounded-lg text-center uppercase py-8 font-bold w-80';
const primaryBtnClsx = 'bg-primary text-white';
const clearBtnClsx =
    'bg-white text-primary border-2 border-solid border-primary';
