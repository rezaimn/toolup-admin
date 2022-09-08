import React, { ComponentPropsWithoutRef, FC, useRef, useState } from 'react';
import { photoIcon } from 'assets/icons';
/* components */
import Button from 'Components/Atomes/Button/Button';
import { get } from 'lodash';

/* modules */
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonToolFormProps = {
    text: string;
    categories: any[];
    onSubmitForm: Function;
    createToolLoading: boolean;
};
export type ToolFormProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonToolFormProps
> &
    CommonToolFormProps;

export const ToolForm: FC<ToolFormProps> = ({
    className,
    onSubmitForm,
    createToolLoading,
    ...props
}) => {
    const formCn = 'flex flex-col gap-4';
    const formInputsCn = 'flex gap-4';
    const inputCn =
        'h-34 border border-gray-200 rounded-md px-6 text-gray-600 focus:outline-blue-800';
    const formActionsCn = 'flex flex-row-reverse';

    const [payload, setPayload] = useState<any>({ name: props.text || '' });
    const [submitted, setSubmitted] = useState(false);

    // methods
    const cancle = () => {
        onSubmitForm(null);
    };
    const save = () => {
        setSubmitted(true);
        onSubmitForm({
            name: payload.name,
            url: payload.url,
            categories: [payload.category], // todo: check with backend ? shouldn't we use ids insted of texts
            image: imageFile,
        });
    };

    const [imageFile, setImage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = () => {
        setImage(get(inputRef, 'current.files.0', null));
    };
    const triggerFileInput = () => {
        inputRef.current?.click();
    };
    const isValid = payload.name && payload.url && payload.category;

    const categoriesOptions = (
        <>
            <option value='' disabled selected hidden>
                Category
            </option>
            {props.categories.map(c => (
                <option value={c.name} key={`cat-option-${c.id}`}>
                    {c.name}
                </option>
            ))}
        </>
    );

    return (
        <div className={cn(formCn, className)}>
            <div className={formInputsCn}>
                <span
                    onClick={triggerFileInput}
                    className={cn(
                        'cursor-pointer w-34 h-34 border rounded-lg flex items-center justify-center',
                        {
                            'border-blue-800': !!imageFile,
                            'border-gray-200': !imageFile,
                        }
                    )}
                >
                    {imageFile ? (
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt='up'
                            className={'w-16 h-16'}
                        />
                    ) : (
                        <img src={photoIcon} alt='up' className={'w-16 h-16'} />
                    )}
                </span>
                <input
                    placeholder='Tool name'
                    className={inputCn}
                    value={payload.name}
                    onChange={(e: any) =>
                        setPayload({ ...payload, name: e.target.value })
                    }
                />
                <input
                    placeholder='Website Url'
                    className={cn('flex-grow', inputCn)}
                    onChange={(e: any) =>
                        setPayload({ ...payload, url: e.target.value })
                    }
                />
                <select
                    className={inputCn}
                    onChange={(e: any) =>
                        setPayload({ ...payload, category: e.target.value })
                    }
                    placeholder='Select one category'
                >
                    {categoriesOptions}
                </select>
            </div>
            <div className={formActionsCn}>
                <Button
                    disabled={!isValid}
                    text={createToolLoading ? 'Adding...' : 'Add'}
                    color={isValid ? 'blue' : 'gray'}
                    onClick={save}
                    className={'h-34 shadow-none mx-0 ml-10 font-bold'}
                />
                <Button
                    text='Cancel'
                    color='white'
                    onClick={cancle}
                    className={
                        'h-34 border border-gray-200 shadow-none mx-0 font-bold'
                    }
                />
            </div>
            <input
                type='file'
                ref={inputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};
