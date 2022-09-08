import React, { ComponentPropsWithoutRef, FC, ReactElement } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { closeIcon, questionMarkIcon } from '../../../assets/icons';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonPopupTemplateProps = {
    title: string;
    heightTailwindClass: string;
    widthTailwindClass: string;
    children?: any;
    onClose: () => void;
};
export type PopupTemplateProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonPopupTemplateProps
> &
    CommonPopupTemplateProps;

export const PopupTemplate: FC<PopupTemplateProps> = ({
    className,
    title = '',
    heightTailwindClass = '',
    widthTailwindClass = '',
    children = <></>,
    onClose = () => {},
}) => {
    return (
        <div className={cn(className)}>
            <div
                className=' fixed z-10 inset-0 overflow-y-auto'
                style={{
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'transparent',
                }}
            >
                <div className='grid grid-cols-12 gap-2  flex items-end justify-center min-h-screen pt-2 px-1 pb-20 text-center sm:block sm:p-0'>
                    <div
                        className='fixed inset-0 transition-opacity'
                        aria-hidden='true'
                    >
                        <div className='absolute inset-0 bg-gray-300 opacity-50'></div>
                    </div>

                    <span
                        className='hidden sm:inline-block sm:align-middle sm:h-screen'
                        aria-hidden='true'
                    >
                        &#8203;
                    </span>
                    <div
                        className={` inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all ${widthTailwindClass} `}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='modal-headline'
                    >
                        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
                            <div className='px-4 py-5 sm:px-6'>
                                <div className='grid xl:grid-cols-6 sm:col-auto gap-4'>
                                    <div className='xl:text-lg sm:text-xs mt-20 ml-20 font-medium col-start-1 xl:col-end-5 sm:col-end-5 text-gray-500'>
                                        <img
                                            src={questionMarkIcon}
                                            className='px-10 float-left cursor-pointer '
                                        />
                                        <span className={'font-semibold py-10'}>
                                            {title}
                                        </span>
                                    </div>
                                    <div className='col-end-7 col-span-2 mt-20 mr-20'>
                                        <div
                                            className='float-right cursor-pointer'
                                            onClick={onClose}
                                        >
                                            <img
                                                src={closeIcon}
                                                className='px-3'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={` xl:px-40 sm:px-12 py-12 h-100 ${heightTailwindClass}`}
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
