/* services */
import { http } from 'Http/api';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* modules */
import { useMutation } from 'react-query';
import { History } from 'history';
import { routeTo } from 'Helpers/routeTo';
import { toString } from 'lodash/fp';
import { Steps } from 'Components/Organisms/SetupProcessBanner';
import { toast } from 'Components/Atomes/ToastContainer';

export type SetupStep = {
    setup_process_step: string;
    setup_finished: boolean;
    send_bulk_invitation_emails: boolean | undefined;
};

const getSetupStep = async () => {
    try {
        /* this is post because of implementation of serverside */
        const { data } = await http.get(API_URLS.setupStatus);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error?.message;
    }
};

export const useSetupStep = (history: History) => {
    return useMutation(getSetupStep, {
        onSuccess: data => {
            if (data.setup_finished) {
                history.push(routeTo('dashboard'));
            } else {
                history.push(
                    routeTo('intro', {
                        step: data.setup_process_step || Steps.first,
                    })
                );
            }
        },
        onError: error => {
            toast('error', toString(error));
            history.push(routeTo('auth'));
        },
    });
};
