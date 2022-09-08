import React, { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import Button from '../../Atomes/Button/Button';
import { PopupTemplate } from '../../Templates/PopupTemplate';
/* helpers */
/* assets */
/* styles */
/* types */
export type CommonConfirmPopupProps = {
    confirmMessage: string;
    messageColor: string;
    yesClicked: () => void;
    noClicked: () => void;
};
export type ConfirmPopupProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonConfirmPopupProps
> &
    CommonConfirmPopupProps;

export const ConfirmPopup: FC<ConfirmPopupProps> = ({
    className,
    confirmMessage = '',
    messageColor = '',
    yesClicked = () => {},
    noClicked = () => {},
}) => {
    return (
        <div className={cn(className)} data-cy='confirmModal'>
            <div>
                <p
                    data-cy='confirmMessage'
                    className={` font-bold ml-22 ${messageColor}`}
                >
                    {confirmMessage}
                </p>
                <span className={'mt-30 float-right'}>
                    <Button
                        onClick={noClicked}
                        color={'white'}
                        text={'CANCEL'}
                    />
                    <Button
                        data_cy='confirmOkBtn'
                        onClick={yesClicked}
                        color={'blue'}
                        text={'OK'}
                    />
                </span>
            </div>
        </div>
    );
};
