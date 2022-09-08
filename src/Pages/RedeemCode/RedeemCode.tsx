import { FC } from 'react';
/* components */
import { RedeemCodeForm } from 'Components/Organisms/RedeemCodeForm';
import { RedeemCodeFeatures } from 'Components/Organisms/RedeemCodeFeatures';
/* modules */
import cn from 'clsx';
import { useValidateRedeemCode, ValidateReedemCodeTVariables } from 'Hooks/api';
import { isNil, negate } from 'lodash/fp';
/* helpers */
/* assets */
/* styles */
import s from './styles.module.scss';
/* types */
const RedeemCode: FC = () => {
    const {
        mutate: validateRedeemCode,
        isLoading: validateRedeemCodeIsLoading,
        data: validateRedeemCodeData,
        error: validateRedeemCodeError,
    } = useValidateRedeemCode();

    const handleFormSubmit = (d: ValidateReedemCodeTVariables) => {
        validateRedeemCode(d);
    };

    return (
        <div className={s.reedemCode}>
            <RedeemCodeForm
                loading={validateRedeemCodeIsLoading}
                onSubmit={handleFormSubmit}
                validate={validateRedeemCode}
                data={validateRedeemCodeData}
                error={validateRedeemCodeError}
                visible={isNil(validateRedeemCodeData?.data)}
            />

            <RedeemCodeFeatures
                visible={negate(isNil)(validateRedeemCodeData?.data)}
                details={validateRedeemCodeData}
            />
        </div>
    );
};

export default RedeemCode;
