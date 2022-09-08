import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
import { Button } from 'Components/Atoms/Button';
import { Legend } from 'Components/Atoms/Legend';
/* modules */
import { Link, useHistory } from 'react-router-dom';
import cn from 'clsx';
import { ValidateReedemCodeTData } from 'Hooks/api';
import { capitalize, get, mapKeys } from 'lodash/fp';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
/* assets */
/* styles */
import s from './styles.module.scss';

/* types */
export type CommonRedeemCodeFeaturesProps = {
    details?: ValidateReedemCodeTData;
    visible: boolean;
};
export type RedeemCodeFeaturesProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonRedeemCodeFeaturesProps
> &
    CommonRedeemCodeFeaturesProps;

export const RedeemCodeFeatures: FC<RedeemCodeFeaturesProps> = ({
    className,
    details,
    visible,
    ...restProps
}) => {
    if (visible) {
        return (
            <div className={s.wrap}>
                <div className={s.header}>
                    <p className={s.planText}>Your LTD plan: </p>
                    <p className={s.price}>{details?.data?.price || 0}$</p>
                </div>

                <Link to={routeTo('signup', {}, { redeemCode: details?.code })}>
                    <Button
                        className={s.register}
                        type='primary'
                        htmlType='button'
                        block
                    >
                        COMPLETE THE REGISTRATION
                    </Button>
                </Link>
                <p className={s.title}>Features:</p>
                {Object.entries(details?.data?.features || {}).map(
                    ([key, value]) => {
                        return (
                            <Legend
                                className={s.feature}
                                title={capitalize(key)}
                            >
                                <ul className={s.list}>
                                    {value?.map(i => (
                                        <li>{i}</li>
                                    ))}
                                </ul>
                            </Legend>
                        );
                    }
                )}
            </div>
        );
    }
    return <div />;
};
