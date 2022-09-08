import {
    ComponentPropsWithoutRef,
    FormEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
/* components */
import { AddTeamLargeInput } from 'Components/Molecules/AddTeamLargeInput';
import { LargeColorPicker } from 'Components/Molecules/LargeColorPicker';
/* modules */
import cn from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AddTeamPayload } from 'Hooks/api';
import { get, last, mapKeys, negate, pipe } from 'lodash/fp';
/* helpers */
import { isEmptyString } from 'Helpers/isEmptyString';
/* assets */
/* styles */
import styles from './styles.module.scss';
/* types */
type CommonProps = {
    onSubmit: (addTeamPayload: AddTeamPayload) => void;
    getFormValidity: (state: boolean) => void;
    formErrors: any;
};
type Props = Omit<ComponentPropsWithoutRef<'form'>, keyof CommonProps> &
    CommonProps;

type Ref = React.HtmlHTMLAttributes<HTMLFormElement>;

const addTeamSchema = yup.object().shape({
    name: yup.string().required(),
});

export const AddTeamForm = forwardRef<Ref, Props>(
    ({ className, onSubmit, getFormValidity, formErrors }, ref) => {
        const {
            register,
            handleSubmit,
            control,
            watch,
            errors,
            reset,
            setError,
        } = useForm<AddTeamPayload>({
            resolver: yupResolver(addTeamSchema),
        });

        const formRef = useRef<Ref>(null!);
        useImperativeHandle(ref, () => imperativeHandle());

        const imperativeHandle = () => {
            return {
                onSubmit: formEvent => {
                    return handleSubmit(onSubmit)(formEvent);
                },
                resetForm: () => {
                    reset();
                },
            } as Ref;
        };

        const handleFormSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
            handleSubmit(onSubmit)(formEvent);
        };

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
            const { name, color } = watch();

            const isValid =
                negate(isEmptyString)(name) &&
                negate(isEmptyString)(color as string);

            getFormValidity(isValid);
        }, [watch()]);

        return (
            <form
                onSubmit={handleFormSubmit}
                ref={formRef as any}
                className={cn(className, styles.form)}
            >
                <AddTeamLargeInput
                    ref={register}
                    className={styles.nameInput}
                    placeholder='Type a name for your team'
                    name='name'
                    error={pipe(get('name.message'))(errors)}
                    data-cy="team-name"
                />

                <Controller
                    control={control}
                    name='color'
                    render={(
                        { onChange, onBlur, value, name },
                        { invalid, isTouched, isDirty }
                    ) => (
                        <LargeColorPicker
                            className={styles.colorPicker}
                            title='Choose a color for your team'
                            onChange={onChange}
                        />
                    )}
                />
            </form>
        );
    }
);
