import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { FC } from 'react';
import cn from 'clsx';
/* assets */
import ProfileIcon from 'assets/icons/profile.png';

export const AccordionSummary = withStyles({
    root: {
        backgroundColor: '#fff',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
        background: 'black',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

export const AccordionDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
}))(MuiAccordionDetails);

export const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        marginBottom: '10px',
        borderRadius: '10px',
        width: '100%',
        display: 'block',
        overflow: 'hidden',
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
            marginBottom: '10px',
        },
    },
    expanded: {
        border: '1px solid #0C4A6E',
    },
})(MuiAccordion);

export const ToolImage: FC<
    React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
    >
> = ({ className, ...props }) => {
    return (
        <img
            className={cn(className, 'h-40', 'w-40', 'shadow-lg', 'rounded-lg')}
            {...props}
        />
    );
};

type PendingsCountIconProps = {
    count: number;
};

export const PendingsCountIcon: FC<
    PendingsCountIconProps & React.ComponentPropsWithoutRef<'div'>
> = ({ count, children, className, ...props }) => {
    return (
        <div
            className={cn(
                'bg-blue-900',
                'relative',
                'h-24',
                'w-24',
                'rounded-md',
                'flex',
                'items-end',
                'justify-center',
                className
            )}
            {...props}
        >
            <img src={ProfileIcon} className={cn('h-17', 'w-12', 'mb-4')} />
            <span
                className={cn(
                    'absolute',
                    '-top-6',
                    '-right-6',
                    'text-white',
                    'bg-red-500',
                    'rounded-full',
                    'h-17',
                    'w-17',
                    'flex',
                    'items-center',
                    'justify-center',
                    'text-xs'
                )}
            >
                {count}
            </span>
        </div>
    );
};
