import { FC, ReactText } from 'react';
/* components */
import {
    toast as ReactToastifyToast,
    ToastContainer as ReactToastifyToastContainer,
    ToastContainerProps,
} from 'react-toastify';
/* modules */
import merge from 'lodash/fp/merge';
import { capitalize } from 'lodash/fp';
import cn from 'clsx';
/* helpers */
import { pickToastIcon } from './lib';
/* assets */
/* styles */
import 'react-toastify/dist/ReactToastify.min.css';
import './custom.scss';
/* types */
export const ToastContainer: FC<ToastContainerProps> = props => {
    return (
        <ReactToastifyToastContainer
            {...merge(defaultToastContainerProps)(props)}
        />
    );
};

const defaultToastContainerProps: ToastContainerProps = {
    hideProgressBar: true,
    position: 'bottom-left',
    autoClose: 2500,
};

export type ToastType = 'info' | 'warning' | 'error' | 'success';

export const toast = (
    ToastType: ToastType = 'info',
    message: string | JSX.Element
): ReactText =>
    ReactToastifyToast(
        <div className='flex items-center'>
            <img
                src={pickToastIcon(ToastType)}
                className='toast-icon'
                alt='toast-icon'
            />
            <div>
                <p
                    id='toast-title'
                    className={cn(`${ToastType}-title`, 'toast-title')}
                >
                    {capitalize(ToastType)}
                </p>
                <div
                    id='toast-message'
                    className={cn(`${ToastType}-message`, 'toast-message')}
                >
                    {message}
                </div>
            </div>
        </div>,
        {
            bodyClassName: `${ToastType}-toast`,
        }
    );
