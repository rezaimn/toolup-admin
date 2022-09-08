/* assets */
import InfoIcon from 'assets/icons/toast/info.svg';
import ErrorIcon from 'assets/icons/toast/error.svg';
import WarningIcon from 'assets/icons/toast/warning.svg';
import SuccessIcon from 'assets/icons/toast/success.svg';
/* modules */
import { ToastType } from './ToastContainer';

export const pickToastIcon = (type: ToastType): string => {
    switch (type) {
        case 'info':
            return InfoIcon;
        case 'warning':
            return WarningIcon;
        case 'success':
            return SuccessIcon;
        case 'error':
            return ErrorIcon;

        default:
            return '';
    }
};
