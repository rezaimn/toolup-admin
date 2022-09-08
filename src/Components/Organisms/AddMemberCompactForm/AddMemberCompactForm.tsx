import {
    ChangeEvent,
    ComponentPropsWithoutRef,
    FC,
    FormEvent,
    useEffect,
    useState,
} from 'react';
/* components */
import { Input } from 'Components/Organisms/EditToolForm/input';
import { NiceDatePicker } from 'Components/Molecules/DatePicker';
import { Calendar } from '@icon-park/react';
/* modules */
import cn from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AddMemberPayload, EditMemberAvatarPayload } from 'Hooks/api';
import { useList } from 'react-use';
/* helpers */
import {
    flow,
    capitalize,
    get,
    last,
    negate,
    startsWith,
    isUndefined,
    pipe,
    toString,
    omit,
    mapKeys,
} from 'lodash/fp';
import { toBase64 } from 'Helpers/toBase64';
import { toast } from 'Components/Atomes/ToastContainer';
/* assets */
import MemberImagePlaceholder from 'assets/icons/member-image-placeholder.svg';
/* styles */
import styles from './styles.module.scss';
import { Button } from '../SetupProcessBanner/button';

/* types */
type CommonProps = {
    visible?: boolean;
    onCancel?: () => void;
    onSubmit: (addToolPayload: FormPayload) => void;
    isLoading?: boolean;
    formErrors?: any;
};

type Props = Omit<ComponentPropsWithoutRef<'form'>, keyof CommonProps> &
    CommonProps;

type FormPayload = AddMemberPayload & Omit<EditMemberAvatarPayload, 'userId'>;
export type { FormPayload as AddMemberCompactFormPayload };
const addMemberSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email must be provided')
        .email('Email is not valid'),
    avatar: yup.mixed(),
    onboarding_date: yup.string().required('Onboarding date must be provided'),
});

export const AddMemberCompactForm: FC<Props> = ({
    className,
    visible,
    onCancel = () => {},
    onSubmit,
    isLoading = false,
    formErrors,
    ...restProps
}) => {
    /* 
    
    */

    const [imageList, { push }] = useList([MemberImagePlaceholder]);

    const {
        register,
        errors,
        handleSubmit,
        setValue,
        setError,
        watch,
        control,
    } = useForm<FormPayload>({
        resolver: yupResolver(addMemberSchema),
        defaultValues: {
            onboarding_date: '',
        },
    });

    const getFieldErros = (path: string) =>
        flow(get(path), get('message'), capitalize)(errors);

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
        if (negate(startsWith('image'))(file?.type)) {
            throw new Error('File format is not valid!');
        }
    };
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        /*
         */
        mapKeys((key: string) => {
            setError(key, {
                type: 'validate',
                message: pipe(get(key), last)(formErrors),
            });
            /*
             */
        })(formErrors);
        /*
         */
    }, [formErrors]);

    useEffect(() => {
        setDate(undefined);
    }, [visible]);

    if (visible) {
        return (
            <form
                className={cn(className, styles.form)}
                onSubmit={handleFormSubmit}
                /* key={`$${toString(visible)}-form`} */
            >
                <p className={styles.title}>Add New Member</p>
                <div className={styles.formContent}>
                    <label htmlFor='avatar' className={cn(styles.avatar)}>
                        <img src={last(imageList)} alt='img' />

                        <input
                            ref={register}
                            type='file'
                            name='avatar'
                            id='avatar'
                            className='hidden'
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                    </label>
                    <Input
                        name='first_name'
                        ref={register}
                        className={styles.input}
                        value=''
                        placeholder='First name'
                        error={getFieldErros('first_name')}
                    />
                    <Input
                        name='last_name'
                        ref={register}
                        className={styles.input}
                        value=''
                        placeholder='Last name'
                        error={getFieldErros('last_name')}
                    />
                    <Input
                        name='email'
                        ref={register}
                        className={styles.input}
                        value=''
                        placeholder='Email'
                        error={getFieldErros('email')}
                    />

                    <Controller
                        control={control}
                        name='onboarding_date'
                        render={(
                            { onChange, onBlur, value, name, ref },
                            { invalid, isTouched, isDirty }
                        ) => (
                            <NiceDatePicker
                                date={date}
                                onDateChange={e => {
                                    setDate(e!);
                                    onChange(e);
                                }}
                                minimumDate={new Date()}
                            >
                                {({ inputProps, focused }) => {
                                    return (
                                        <>
                                            <div
                                                className={cn(
                                                    styles.dateInput,
                                                    {
                                                        [styles.hasError]: !!getFieldErros(
                                                            'onboarding_date'
                                                        ),
                                                    }
                                                )}
                                            >
                                                <Calendar
                                                    fill='#01395E'
                                                    theme='filled'
                                                    size={17}
                                                />
                                                <input
                                                    title='Onboarding Date'
                                                    placeholder='Onboarding date'
                                                    name='onboarding_date'
                                                    ref={register}
                                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                                    {...omit(['placeholder'])(
                                                        inputProps
                                                    )}
                                                />
                                            </div>
                                            <div
                                                className={cn(styles.error, {
                                                    [styles.errorShow]: !!getFieldErros(
                                                        'onboarding_date'
                                                    ),
                                                })}
                                            >
                                                {getFieldErros(
                                                    'onboarding_date'
                                                )}
                                            </div>
                                        </>
                                    );
                                }}
                            </NiceDatePicker>
                        )}
                    />
                </div>

                <div className={styles.formFooter}>
                    <Button type='button' variant='outline' onClick={onCancel}>
                        CANCEL
                    </Button>

                    <Button
                        type='submit'
                        variant='primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'loading...' : 'SAVE'}
                    </Button>
                </div>
            </form>
        );
    }
    return <div />;
};
