import React, { FC } from 'react';
/* components */
import { Error } from 'Components/Molecules/Error';
/* modules */
import queryString from 'query-string';
import { Redirect, useLocation } from 'react-router-dom';
import { includes } from 'lodash/fp';
/* helpers */
import { routeTo } from 'Helpers/routeTo';
import { not } from 'Helpers/fp';
import { buildErrorMessage, ErrorStatus } from './lib';
/* assets */
/* styles */
/* types */
const ErrorPage: FC = () => {
    const query = queryString.parse(useLocation().search);
    const ERROR_KEYS = ['invalid_token', 'expired_token'];

    if (!query.code) {
        return <Redirect to={routeTo('auth')} />;
    }

    if (not(includes(query?.code))(ERROR_KEYS)) {
        return <Redirect to={routeTo('auth')} />;
    }

    const errorMessages = buildErrorMessage(query.code as ErrorStatus);

    return (
        <Error
            title={errorMessages?.title}
            message={errorMessages?.message}
            link='auth'
        />
    );
};

export default ErrorPage;
