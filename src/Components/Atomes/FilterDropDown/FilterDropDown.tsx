import React, {
    ComponentPropsWithoutRef,
    FC,
    useEffect,
    useState,
} from 'react';
/* components */
import { NiceDatePickerCalendar } from 'Components/Molecules/DatePicker';
import { SelectInput } from 'Components/Atomes/SelectInput';
/* modules */
import cn from 'clsx';
import { format } from 'date-fns';
/* helpers */
/* assets */
import { grayFilterIcon, calendarActive, calendar } from 'assets/icons/index';
import Button from '../Button/Button';
/* styles */
/* types */
export type CommonDropDownProps = {
    selectedOption: {
        field: string;
        order: string;
    };
    options: any[];
    orderOptions: any[];
    teams: any[];
    onChange: any;
    setShowFilters: any;
    showFilters: any;
};
export type DropDownProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonDropDownProps
> &
    CommonDropDownProps;

export const FilterDropDown: FC<DropDownProps> = ({
    className,
    selectedOption,
    options,
    onChange,
    orderOptions,
    teams,
    setShowFilters,
    showFilters,
    ...restProps
}) => {
    const [open, setOpen] = useState(false);
    const [team, setTeam] = useState({ name: 'Team', id: undefined });
    const [status, setStatus] = useState({ name: 'Status', id: undefined });
    const [access, setAccess] = useState({ name: 'Access', id: undefined });
    const [currentDate, setCurrentDate] = useState('from');
    const [fromOnboardingDate, setfromOnboardingDate] = useState(new Date());
    const [toOnboardingDate, settoOnboardingDate] = useState(new Date());
    const [hasFromDate, setHasFromDate] = useState(false);
    const [hasToDate, setHasToDate] = useState(false);

    const onChangeDate = (date: any) => {
        if (currentDate === 'from') {
            if (date < toOnboardingDate || !hasToDate) {
                setfromOnboardingDate(date);
                setHasFromDate(true);
            }
        } else if (currentDate === 'to') {
            if (date > fromOnboardingDate || !hasFromDate) {
                settoOnboardingDate(date);
                setHasToDate(true);
            }
        }
    };

    const clearFilters = () => {
        setStatus({ name: 'Team', id: undefined });
        setTeam({ name: 'Status', id: undefined });
        setAccess({ name: 'Access', id: undefined });
        onChange({
            type: 'setFilter',
            team_id: undefined,
            status: undefined,
            onboarding_date_from: undefined,
            onboarding_date_to: undefined,
        });
        setHasFromDate(false);
        setHasToDate(false);
        setfromOnboardingDate(new Date());
        settoOnboardingDate(new Date());
        setShowFilters({});
    };

    useEffect(() => {
        setTeam({
            name: teams[showFilters.team_id]
                ? teams[showFilters.team_id].name
                : 'Team',
            id: showFilters.team_id,
        });
        setStatus({
            name: teams[showFilters.status]
                ? teams[showFilters.status]
                : 'Status',
            id: showFilters.status,
        });
        setfromOnboardingDate(
            showFilters.onboarding_date_from
                ? showFilters.onboarding_date_from
                : new Date()
        );
        settoOnboardingDate(
            showFilters.onboarding_date_to
                ? showFilters.onboarding_date_to
                : new Date()
        );
        if (!showFilters.onboarding_date_from) {
            setHasFromDate(false);
        }
        if (!showFilters.onboarding_date_to) {
            setHasToDate(false);
        }
    }, [showFilters]);

    const setFilters = () => {
        onChange({
            type: 'setFilter',
            team_id: team.id !== 0 ? team.id : undefined,
            status: status.id !== 0 ? status.id : undefined,
            onboarding_date_from: hasFromDate ? fromOnboardingDate : undefined,
            onboarding_date_to: hasToDate ? toOnboardingDate : undefined,
        });
        setShowFilters({
            team_id: team.id ? team.name : undefined,
            status: status.id ? status.name : undefined,
            onboarding_date_from: hasFromDate
                ? `from ${format(fromOnboardingDate, 'yyyy MM dd')}`
                : undefined,
            onboarding_date_to: hasToDate
                ? `to ${format(toOnboardingDate, 'yyyy MM dd')}`
                : undefined,
        });
    };

    return (
        <div className={cn(className)}>
            <div className='relative inline-block text-left'>
                <div>
                    <button
                        type='button'
                        className='inline-flex justify-center w-full bg-white text-xx text-blue-800 font-bold text-gray-700'
                        onClick={() => setOpen(!open)}
                    >
                        <img src={grayFilterIcon} className='cursor-pointer' />
                    </button>
                </div>
                {open && (
                    <div className='h-480 overflow-y-auto grid z-50 absolute origin-top-right right-0 mt-7 w-323 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y'>
                        <div
                            role='menu'
                            aria-orientation='vertical'
                            aria-labelledby='options-menu'
                        >
                            <div className='flex flex-col'>
                                <div className='flex justify-evenly items-center h-75 text-gray-400 text-sm'>
                                    <img
                                        src={
                                            currentDate === 'from'
                                                ? calendarActive
                                                : calendar
                                        }
                                        className='absolute left-20'
                                    />
                                    <input
                                        placeholder='From'
                                        value={
                                            hasFromDate
                                                ? format(
                                                      fromOnboardingDate,
                                                      'yyyy MM dd'
                                                  ).toString()
                                                : ''
                                        }
                                        onClick={() => setCurrentDate('from')}
                                        className='w-138 h-44 border-gray-300 hover:border-gray-300 focus:border-gray-300 active:border-gray-300 focus-within:border-gray-600 rounded border text-gray-500 text-center'
                                    />
                                    --
                                    <img
                                        src={
                                            currentDate === 'to'
                                                ? calendarActive
                                                : calendar
                                        }
                                        className='absolute left-185'
                                    />
                                    <input
                                        placeholder='To'
                                        value={
                                            hasToDate
                                                ? format(
                                                      toOnboardingDate,
                                                      'yyyy MM dd'
                                                  ).toString()
                                                : ''
                                        }
                                        onClick={() => setCurrentDate('to')}
                                        className='w-138 h-44 border-gray-300 rounded border text-gray-500 text-center'
                                    />
                                </div>
                                <NiceDatePickerCalendar
                                    date={
                                        currentDate === 'from'
                                            ? fromOnboardingDate
                                            : toOnboardingDate
                                    }
                                    onDateChange={onChangeDate}
                                />
                            </div>
                            <div className='flex flex-col items-center'>
                                <SelectInput
                                    options={teams}
                                    onChange={setTeam}
                                    selected={team}
                                    hasColor
                                />
                                <SelectInput
                                    options={[
                                        {
                                            id: 'NOT_ONBOARDED',
                                            name: 'Not Onboarded',
                                        },
                                        { id: 'ONBOARDED', name: 'Onboarded' },
                                        {
                                            id: 'OFFBOARDED',
                                            name: 'Offboarded',
                                        },
                                        {
                                            id: 'NOT_OFFBOARDED',
                                            name: 'Not Offboarded',
                                        },
                                    ]}
                                    onChange={setStatus}
                                    selected={status}
                                    hasColor={false}
                                />
                                {/*<SelectInput options={[1,2]} onChange={setAccess} selected={access} />*/}
                            </div>
                            <div className='flex justify-center mb-15'>
                                <Button
                                    text={'CLEAR'}
                                    onClick={() => {
                                        clearFilters();
                                        setOpen(false);
                                    }}
                                    color={'white'}
                                    className={'font-semibold'}
                                />
                                <Button
                                    text={'DONE'}
                                    onClick={() => {
                                        setFilters();
                                        setOpen(false);
                                    }}
                                    color={'blue'}
                                    className={'font-semibold'}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
