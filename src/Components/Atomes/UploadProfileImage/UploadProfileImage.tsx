import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { addMemberPlaceholderIcon } from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonUploadProfileImageProps = {
    onChange: (e: any) => void;
    selectedImage: any;
};
export type UploadProfileImageProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonUploadProfileImageProps
> &
    CommonUploadProfileImageProps;

export const UploadProfileImage: FC<UploadProfileImageProps> = ({
    id,
    className,
    onChange,
    selectedImage = null,
}) => {
    return (
        <div className={cn(className)}>
            <label className=' flex flex-col items-center  bg-white  tracking-wide cursor-pointer w-164 h-164  '>
                <img
                    src={
                        selectedImage ? selectedImage : addMemberPlaceholderIcon
                    }
                    alt=''
                    className={`${selectedImage ? 'rounded-full' : ''}`}
                />
                <input
                    id={id}
                    type='file'
                    className='hidden'
                    onChange={onChange}
                />
            </label>
        </div>
    );
};
