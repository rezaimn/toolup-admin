import { ComponentPropsWithoutRef, FC, useState } from 'react';
/* components */
import { EditToolForm } from 'Components/Organisms/EditToolForm';
import { toast } from 'Components/Atomes/ToastContainer';
import { ConfirmModal } from 'Components/Molecules/ConfirmModal';
/* modules */
import cn from 'clsx';
import {
    useEditToolImage as useAddToolImage,
    EditToolImagePayloadProps as AddToolImagePayload,
    useEditTool,
    EditToolPayload,
    useEditToolConfig,
    EditToolConfigPayload,
    useCreateTool,
    Tool,
    useDeleteTool,
} from 'Hooks/api';
import {
    isUndefined,
    merge,
    pick,
    last,
    negate as not,
    pipe,
    isEqual,
    omit,
    capitalize,
} from 'lodash/fp';
import { useHistory } from 'react-router';
/* helpers */
import { isSystemTool } from 'Helpers/isSystemTool';
import { routeTo } from 'Helpers/routeTo';
/* services */
import { queryClient } from 'Services/ReactQueryService';
/* assets */
/* constants */
import API_URLS from 'Constants/apiUrls';
/* styles */
import styles from './styles.module.scss';

/* types */
export type CommonEditToolWrapperProps = {
    formRef: any;
    includeSubmit?: boolean;
    toolId: number;
    onSuccess: (tool: Tool) => void;
    mode: 'create' | 'config' | 'edit';
    tool: Tool;
    isDeletable?: boolean;
};

export type EditToolWrapperProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonEditToolWrapperProps
> &
    CommonEditToolWrapperProps;

export const EditToolWrapper: FC<EditToolWrapperProps> = ({
    className,
    formRef,
    includeSubmit = true,
    toolId,
    onSuccess,
    mode,
    tool,
    isDeletable = false,
    ...restProps
}) => {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editToolFormErrors, setEditToolFormErrors] = useState({});

    const history = useHistory();
    const { mutate: editTool, isLoading: addToolIsLoading } = useEditTool();

    const {
        mutate: createTool,
        isLoading: createToolIsLoading,
    } = useCreateTool();

    const {
        mutate: editToolConfig,
        isLoading: editToolConfigIsLoading,
    } = useEditToolConfig();

    const {
        mutate: addToolImage,
        isLoading: addToolImageIsLoading,
    } = useAddToolImage();

    const {
        mutate: deleteTool,
        isLoading: deleteToolIsLoading,
    } = useDeleteTool();

    const handleOpenDeleteConfirm = () => {
        setIsDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false);
    };

    const handleDeleteTool = (id: number) => () => {
        deleteTool(
            { toolId: id },
            {
                onSuccess: () => {
                    handleCloseDeleteConfirm();
                    toast(
                        'success',
                        <div className='flex space-x-5'>
                            <p className='font-bold'>
                                {capitalize(tool?.name)}
                            </p>
                            <p>successfully deleted.</p>
                        </div>
                    );
                    history.push(routeTo('toolsManagement'));
                    queryClient.invalidateQueries(API_URLS.userTools);
                },
                onError: () => {
                    handleCloseDeleteConfirm();
                    toast('error', 'Someting went wrong in tool deletion.');
                },
            }
        );
    };

    const handleSubmitForm = (
        payload:
            | (EditToolPayload &
                  Omit<AddToolImagePayload, 'icon'> & { appIcon: File[] })
            | EditToolConfigPayload
    ): Promise<Tool> => {
        setEditToolFormErrors({});
        return new Promise(resolve => {
            const dto = merge({ toolId })(payload);

            if (isEqual('config')(mode)) {
                if (isSystemTool(tool?.origin) && 'url' in dto) {
                    editToolConfig(
                        {
                            toolId: toolId.toString(),
                            url: dto.url,
                        },
                        {
                            onSuccess: data => {
                                resolve(data);
                                onSuccess(data);
                            },
                            onError: (e: any) => {
                                setEditToolFormErrors(e);
                            },
                        }
                    );
                }

                if ('appIcon' in payload) {
                    editTool(dto as any, {
                        onSuccess: editToolResult => {
                            if (
                                pipe(last, not(isUndefined))(payload?.appIcon)
                            ) {
                                addToolImage(
                                    pick<
                                        AddToolImagePayload,
                                        'toolId' | 'icon'
                                    >(['icon', 'toolId'])({
                                        toolId,
                                        icon: last(payload?.appIcon),
                                    }),
                                    {
                                        onSuccess: data => {
                                            resolve(data);
                                            onSuccess(data);
                                        },
                                    }
                                );
                            }
                            if (isUndefined(last(payload?.appIcon))) {
                                resolve(editToolResult);
                                onSuccess(editToolResult);
                            }
                        },
                    });
                }
            }
            if (isEqual('create')(mode) && 'appIcon' in payload) {
                const createToolDto = omit('appIcon')(payload);
                const icon = last(payload?.appIcon);

                createTool(createToolDto as any, {
                    onSuccess: data => {
                        if (!payload?.appIcon?.length) {
                            resolve(data);
                            onSuccess(data);
                            return;
                        }
                        addToolImage(
                            pick<AddToolImagePayload, 'toolId' | 'icon'>([
                                'icon',
                                'toolId',
                            ])({
                                toolId: data?.id,
                                icon,
                            }),
                            {
                                onSuccess: x => {
                                    onSuccess({
                                        ...data,
                                        icon: x?.full_path,
                                    });
                                    resolve({
                                        ...data,
                                        icon: x?.full_path,
                                    });
                                    resolve(x);
                                },
                                onError: (e: any) => {
                                    setEditToolFormErrors(e);
                                },
                            }
                        );
                    },
                    onError: (e: any) => {
                        setEditToolFormErrors(e);
                    },
                });
            }

            if (isEqual('edit')(mode)) {
                if ('appIcon' in payload) {
                    editTool(omit('appIcon')(dto) as any, {
                        onSuccess: editToolResult => {
                            if (
                                pipe(
                                    last,
                                    not(isUndefined)
                                )(payload?.appIcon) &&
                                typeof payload?.appIcon !== 'string'
                            ) {
                                addToolImage(
                                    pick<
                                        AddToolImagePayload,
                                        'toolId' | 'icon'
                                    >(['icon', 'toolId'])({
                                        toolId,
                                        icon: last(payload?.appIcon),
                                    }),
                                    {
                                        onSuccess: iconResult => {
                                            resolve({
                                                ...editToolResult,
                                                icon: iconResult.full_path,
                                            });
                                            onSuccess({
                                                ...editToolResult,
                                                icon: iconResult.full_path,
                                            });
                                        },
                                    }
                                );
                            }

                            if (isUndefined(last(payload?.appIcon))) {
                                resolve(editToolResult);
                                onSuccess(editToolResult);
                            }
                        },
                    });
                }
            }
        });
    };

    const isLoading =
        addToolIsLoading || addToolImageIsLoading || editToolConfigIsLoading;

    if (isUndefined(tool)) {
        if (isEqual('config')(mode)) {
            return <div>loading...</div>;
        }
    }

    return (
        <>
            <EditToolForm
                ref={formRef}
                tool={tool}
                className={cn(styles.form, className)}
                loading={isLoading}
                onSubmit={handleSubmitForm}
                includeSubmit={includeSubmit}
                mode={mode}
                isDeletable={isDeletable}
                onDeleteModalOpen={handleOpenDeleteConfirm}
                editToolFormErrors={editToolFormErrors}
            />

            {isDeletable && (
                <ConfirmModal
                    isOpen={isDeleteConfirmOpen}
                    title='Tool deletion'
                    message='Are you sure you want to delete this tool?'
                    onConfirm={handleDeleteTool(tool.id)}
                    onClose={handleCloseDeleteConfirm}
                    isLoading={deleteToolIsLoading}
                />
            )}
        </>
    );
};
