import { FC, ComponentPropsWithRef } from 'react';
/* components */
import Button from 'Components/Atomes/Button/Button';
/* modules */
import cn from 'clsx';
/* assets */
import { plusWhite } from 'assets/icons';
/* styles */
import styles from './styles.module.scss';

type Props = {
    onClick: () => void;
    message: string;
    addNewMessage: string;
    buttonText: string;
} & ComponentPropsWithRef<'div'>;

export const NoResultsFound: FC<Props> = ({
    onClick,
    message,
    addNewMessage,
    buttonText,
    ...restProps
}) => {
    return (
        <div>
            <p className={styles.title}>Result</p>
            <div className='p-10 flex flex-col items-center'>
                <p className='font-bold text-gray-500 text-md mb-6'>
                    {message}
                </p>
                <div className={cn('flex', 'items-center')}>
                    <span className='text-gray-400'>{addNewMessage}</span>

                    <Button
                        className='ml-8'
                        color='blue'
                        onClick={onClick}
                        svg={plusWhite}
                        text={buttonText}
                    />
                </div>
            </div>
        </div>
    );
};
