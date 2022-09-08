import React, { FC, useRef } from 'react';
/* components */
import { EditToolWrapper } from 'Components/Templates/EditToolWrapper';
import { EditToolFormRef } from 'Components/Organisms/EditToolForm';
import { Spinner } from 'Components/Atomes/Spinner';
/* modules */
import { useHistory, useParams } from 'react-router-dom';
import { useTool } from 'Hooks/api';
import { isUndefined, negate } from 'lodash/fp';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
import { isSystemTool } from 'Helpers/isSystemTool';
import cn from 'clsx';
/* services */
import { queryClient } from 'Services/ReactQueryService';
/* assets */
/* constants */
import API_URLS from 'Constants/apiUrls';
/* styles */
import styles from './styles.module.scss';

/* types */
const AddEditTool: FC = () => {
    const params = useParams<{ toolId: string }>();
    const formRef = useRef<EditToolFormRef>(null!);
    const history = useHistory();

    const renderTitle = () =>
        +params.toolId ? `Edit your  tool` : `Add your new tool`;

    const onSuccess = () => {
        history.push(routeTo('toolsManagement'));

        /* refetching tools sidebar items */
        queryClient.invalidateQueries(API_URLS.userTools);
    };

    const { data: tool, isFetching: toolIsLoading, isIdle } = useTool(
        +params?.toolId,
        {
            enabled: !!params.toolId,
            retry: 1,
            onError: () => {
                history.push(routeTo('toolsManagement'));
            },
        }
    );

    if (!tool || toolIsLoading) {
        return (
            <div className={cn(styles.addTool, styles.centered)}>
                <Spinner />
            </div>
        );
    }

    const mode = (): 'config' | 'create' | 'edit' => {
        if (isSystemTool(tool?.origin)) {
            return 'config';
        }

        if (
            negate(isUndefined)(tool?.id) &&
            negate(isSystemTool)(tool?.origin)
        ) {
            return 'edit';
        }

        return 'create';
    };

    return (
        <div className={styles.addTool}>
            <h3 className={styles.pageTitle}>{renderTitle()}</h3>
            <EditToolWrapper
                onSuccess={onSuccess}
                toolId={+params?.toolId}
                includeSubmit
                formRef={formRef as any}
                mode={mode()}
                tool={tool}
                isDeletable
            />
        </div>
    );
};
export default AddEditTool;
