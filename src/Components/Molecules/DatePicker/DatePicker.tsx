import React, { FC } from 'react';
/* components */
import {
    DatePickerProps as ReactNiceDateDatePickerProps,
    DatePicker as ReactNiceDatePicker,
    DateRangePickerProps,
    DateRangePicker as RNCDateRangePicker,
    DatePickerCalendar as RNDDatePickerCalendar,
    DatePickerCalendarProps,
} from 'react-nice-dates';
import enUS from 'date-fns/locale/en-US';
import { merge } from 'lodash/fp';
import 'assets/styles/calendar-custom-styles.css';
/* modules */
/* helpers */
/* assets */
/* styles */
/* types */

/* REVIEW @mahmood.b refactor this part. */
export type DatePickerProps = Omit<ReactNiceDateDatePickerProps, 'locale'>;

const NiceDatePicker: FC<DatePickerProps> = props => {
    return <ReactNiceDatePicker {...merge({ locale: enUS })(props)} />;
};
const NiceDateRangePicker: FC<DateRangePickerProps> = props => {
    return (
        <div className={'max-w-330'}>
            <RNCDateRangePicker {...merge({ locale: enUS })(props)} />
        </div>
    );
};

const NiceDatePickerCalendar: FC<
    Omit<DatePickerCalendarProps, 'locale'>
> = props => {
    return <RNDDatePickerCalendar {...merge({ locale: enUS })(props)} />;
};
export { NiceDatePicker, NiceDateRangePicker, NiceDatePickerCalendar };
