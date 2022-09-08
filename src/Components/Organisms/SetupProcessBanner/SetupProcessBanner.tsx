import { FC } from 'react';
/* components */
import { toast } from 'Components/Atomes/ToastContainer';
/* modules */
import {
    useSetupStatus,
    useUpdateSetupStep,
    SetupStep,
    useResetOrganization,
} from 'Hooks/api';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { queryClient } from 'Services/ReactQueryService';
/* services */
import { isAdmin } from 'Services/RBAC/config';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
/* assets */
import { ReactComponent as InfoIcon } from 'assets/icons/toast/info.svg';
/* constants */
import API_URLS from 'Constants/apiUrls';
/* styles */
import styles from './styles.module.scss';
/* types */
/* internals */
import { Button } from './button';

export enum Steps {
    first = 'step_00_intro',
    second = 'step_01_mail_selected',
    third = 'step_01_mail_selected',
    forth = 'step_03_member_added',
    fifth = 'step_04_member_checked',
}

export const SetupProcessBanner: FC = () => {
    const history = useHistory();
    const location = useLocation();

    const {
        isLoading: setupStatusIsLoading,
        data: setupStatus,
    } = useSetupStatus({ enabled: isAdmin() });
    const { mutate: updateSetupStep } = useUpdateSetupStep();
    const { mutate: resetOrganization } = useResetOrganization();

    const handleResetSetup = () => {
        resetOrganization(
            {
                reset_setup: true,
                reset_members: true,
                reset_teams: true,
                reset_tools: true,
            },
            {
                onSuccess: () => {
                    toast('success', 'Setup reset was successful.');
                    queryClient.invalidateQueries(API_URLS.setupStatus);
                    history.push(routeTo('intro', { step: Steps.first }));
                },
                onError: () => {
                    toast('error', 'An error occurred in setup reset.');
                },
            }
        );
    };

    /* REVIEW shall we move this invalidateQueries to the hook? @mahmood.b */
    const handleCancelSetup = () => {
        resetOrganization(
            {
                reset_setup: true,
                reset_members: true,
                reset_teams: true,
                reset_tools: true,
            },
            {
                onSuccess: () => {
                    updateSetupStep(
                        {
                            setup_finished: true,
                            setup_process_step: Steps.first,
                        } as SetupStep,
                        {
                            onSuccess: () => {
                                toast(
                                    'success',
                                    'Setup cancellation was successful.'
                                );
                                queryClient.invalidateQueries(
                                    API_URLS.setupStatus
                                );
                            },
                            onError: () => {
                                toast(
                                    'error',
                                    'An error occurred in setup cancellation.'
                                );
                            },
                        }
                    );
                },
            }
        );
    };

    const handleContinueSetup = () => {
        const step = setupStatus?.setup_process_step as string;
        history.push(routeTo('intro', { step }));
    };

    const isLoading = setupStatusIsLoading || !setupStatus;

    /* !isAdmin is for not showing banner for other users */
    if (isLoading || setupStatus?.setup_finished || !isAdmin()) {
        return <div className='mb-20' />;
    }

    /* show banner only in dashboard */
    if (
        !matchPath(location.pathname, {
            exact: true,
            path: routeTo('dashboard'),
        })
    ) {
        return <div className='mb-20' />;
    }

    return (
        <div className={styles.banner}>
            <InfoIcon className={styles.infoIcon} />

            <div className={styles.message}>
                from here you can continue setup process
            </div>

            <Button
                onClick={handleContinueSetup}
                variant='primary'
                className={styles.continueSetup}
            >
                continue setup
            </Button>

            <Button
                onClick={handleResetSetup}
                variant='outline'
                className={styles.resetSetup}
            >
                Reset Setup
            </Button>

            <Button
                onClick={handleCancelSetup}
                variant='outline'
                className={styles.cancelSetup}
            >
                cancel setup
            </Button>
        </div>
    );
};
