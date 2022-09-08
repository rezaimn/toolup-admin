import {
    ChangeEvent,
    ComponentPropsWithoutRef,
    FormEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
/* components */
import { Button } from 'Components/Organisms/SetupProcessBanner/button';
/* modules */
import cn from 'clsx';
import {
    EditToolImagePayloadProps as AddToolImagePayload,
    EditToolPayload,
    Tool,
} from 'Hooks/api';
import useList from 'Hooks/useList';
import {
    capitalize,
    flow,
    get,
    isUndefined,
    last,
    pipe,
    startsWith,
    toString,
    negate as not,
    isEqual,
    isNull,
    mapKeys,
} from 'lodash/fp';
import { useForm } from 'react-hook-form';
import { toast } from 'Components/Atomes/ToastContainer';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
/* helpers */
import { toBase64 } from 'Helpers/toBase64';
import { isSystemTool } from 'Helpers/isSystemTool';
/* assets */
import { ReactComponent as InfoIcon } from 'assets/icons/toast/info.svg';
import ToolImagePlaceholderIcon from 'assets/icons/tool-image-placeholder.svg';
/* styles */
import styles from './styles.module.scss';
import { Input } from './input';
import { Radio } from './radio';

/* types */
export type CommonEditToolFormProps = {
    onSubmit: (
        addToolPayload: EditToolPayload &
            Omit<AddToolImagePayload, 'icon'> & { appIcon: File[] }
    ) => Promise<Tool>;
    loading?: boolean;
    tool: Tool;
    includeSubmit?: boolean;
    mode: 'create' | 'config' | 'edit';
    isDeletable: boolean;
    onDeleteModalOpen: () => void;
    editToolFormErrors: any;
};
export type EditToolFormProps = Omit<
    ComponentPropsWithoutRef<'form'>,
    keyof CommonEditToolFormProps
> &
    CommonEditToolFormProps;

export type EditToolFormRef = React.HtmlHTMLAttributes<HTMLFormElement>;

export const EditToolForm = forwardRef<EditToolFormRef, EditToolFormProps>(
    (
        {
            className,
            loading = false,
            onSubmit,
            tool,
            includeSubmit = true,
            mode,
            isDeletable,
            onDeleteModalOpen,
            editToolFormErrors,
            ...restProps
        },
        ref
    ) => {
        const formRef = useRef<EditToolFormRef>(null!);

        const isNullOrUndefined = (x: any) => isUndefined(x) || isNull(x);

        useEffect(() => {
            if (
                !isNullOrUndefined(tool?.icon) ||
                !isNullOrUndefined(tool?.icon)
            ) {
                push(tool?.icon);
            }
        }, []);
        const imperativeHandle = () => {
            return {
                onSubmit: formEvent => {
                    return handleSubmit(onSubmit)(formEvent);
                },
            } as EditToolFormRef;
        };

        useImperativeHandle(ref, () => imperativeHandle());

        const [imageList, { push }] = useList([ToolImagePlaceholderIcon]);

        const editToolSchema = yup.object().shape({
            name: isSystemTool(tool?.origin)
                ? yup.string()
                : yup.string().required(),
            url: yup
                .string()
                .matches(
                    /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                    'Url not valid'
                ),
            appIcon: yup.mixed(),
        });

        let defaultValues = {};
        if (tool) {
            defaultValues = {
                ...tool,
                url: isSystemTool(tool?.origin)
                    ? tool?.pivot?.config?.url || tool?.url
                    : tool?.url,
            };
        }

        const {
            register,
            setValue,
            handleSubmit,
            errors,
            getValues,
            setError,
        } = useForm<EditToolPayload & AddToolImagePayload>({
            defaultValues,
            resolver: yupResolver(editToolSchema),
        });

        useEffect(() => {
            /*
             */
            mapKeys((key: string) => {
                setError(key, {
                    type: 'validate',
                    message: pipe(get(key), last)(editToolFormErrors),
                });
                /*
                 */
            })(editToolFormErrors);
            /*
             */
        }, [editToolFormErrors]);

        const handleFormSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
            handleSubmit(onSubmit)(formEvent);
        };

        const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
            if (!last(e?.target?.files)) {
                return;
            }

            try {
                pipe(last, makeSureAsImage)(e?.target?.files);
                const icon = await toBase64(last(e?.target?.files) as File);

                if (isUndefined(icon)) {
                    throw new Error('Something went wrong!');
                }

                push(icon as string);
                setValue('icon', last(e?.target?.files));
            } catch (error) {
                toast('error', toString(error.message));
            }
        };

        const makeSureAsImage = (file: File) => {
            if (not(startsWith('image'))(file?.type)) {
                throw new Error('File format is not valid!');
            }
        };

        const renderIconPicker = (): JSX.Element | undefined => {
            if (
                not(isEqual('config'))(mode) ||
                not(isSystemTool)(tool?.origin)
            ) {
                return (
                    <label
                        htmlFor='appIcon'
                        className={cn(styles.button, styles.outlineButton)}
                    >
                        <input
                            className={styles.fileInput}
                            onChange={handleImageChange}
                            type='file'
                            id='appIcon'
                            name='appIcon'
                            accept='image/*'
                            ref={register}
                        />
                        Browse File...
                    </label>
                );
            }
        };
        return (
            <form
                onSubmit={handleFormSubmit}
                className={cn(className, styles.form)}
                ref={formRef as any}
            >
                <div className={styles.section}>
                    <div className={styles.title}>General information</div>
                    <div
                        className={cn(
                            styles.sectionContent,
                            styles.toolDetails
                        )}
                    >
                        <div className={styles.imageUpload}>
                            <img
                                className={cn(styles.image, {
                                    [styles.imageError]: flow(
                                        get('appIcon.message'),
                                        capitalize
                                    )(errors),
                                })}
                                src={last(imageList)}
                                alt='img'
                            />

                            {renderIconPicker()}
                        </div>
                        <div className={styles.toolInfo}>
                            <Input
                                isEditable={!isSystemTool(tool?.origin)}
                                ref={register}
                                name='name'
                                value={tool?.name}
                                placeholder='App Name'
                                data-cy="app-name"
                                error={flow(
                                    get('name.message'),
                                    capitalize
                                )(errors)}
                            />

                            <Input
                                ref={register}
                                name='url'
                                value={
                                    isSystemTool(tool?.origin)
                                        ? tool?.pivot?.config?.url || ''
                                        : tool?.url
                                }
                                placeholder='App URL'
                                id='app-url'
                                data-cy='app-url'
                                error={flow(
                                    get('url.message'),
                                    capitalize
                                )(errors)}
                                help='i.e. [yourcompany.slack.com | http://yourcompany.slack.com]'
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.title}>Access options</div>
                    <div
                        className={cn(
                            styles.sectionContent,
                            styles.accessOptionsSectionContent
                        )}
                    >
                        <Radio
                            text='This service will be available from 04/2021'
                            label='Password'
                        />

                        <Radio
                            text='This service will be available from 05/2021'
                            label='SSO'
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.title}>Integration</div>
                    <div className={styles.integration}>
                        <div className={styles.integrationWrap}>
                            <div className={styles.autoProvisioning}>
                                Auto provisioning setting
                            </div>
                            <div className={styles.apiSettings}>
                                API access setting
                            </div>
                        </div>
                        <div className={styles.provisioningMessage}>
                            <InfoIcon />
                            <p className='text-12'>
                                This service will be available from 07/2021
                            </p>
                        </div>
                        <div className='flex space-x-10 items-center mt-32'>
                            {isDeletable && (
                                <Button
                                    onClick={onDeleteModalOpen}
                                    variant='danger'
                                    className={cn(styles.deleteButton)}
                                >
                                    Delete Tool
                                </Button>
                            )}

                            {includeSubmit && (
                                <button
                                    type='submit'
                                    className={cn(
                                        { [styles.disabled]: loading },
                                        styles.button,
                                        styles.doneButton
                                    )}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        );
    }
);
