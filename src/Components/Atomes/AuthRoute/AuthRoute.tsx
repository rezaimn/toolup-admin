import React, { ComponentType, FC, useEffect } from 'react';
/* components */
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Route } from 'Components/Atomes/Route';
/* modules */
/* helpers */
import { routeTo } from 'Helpers/routeTo';
import { useCurrentUserDetails } from 'Hooks/api';
import { isNil, negate } from 'lodash/fp';
import * as localStorage from 'Helpers/localStorage';
/* assets */
/* styles */
import s from './styles.module.scss';
/* types */

export type $ElementProps<T> = T extends React.ComponentType<infer Props>
    ? Props extends object
        ? Props
        : never
    : never;

export type CommonAuthRouteProps = {
    component: ComponentType;
};

type AuthRouteProps = $ElementProps<typeof Route> & CommonAuthRouteProps;

export const AuthRoute: FC<AuthRouteProps> = ({
    component: Component,
    ...rest
}) => {
    const token = localStorage.getItem('token');

    const { data, isLoading, isError } = useCurrentUserDetails({
        enabled: !!token,
    });

    const UnauthorizedRedirectionConfig = {
        pathname: routeTo('auth'),
        state: { from: rest.location },
    };

    if (!token) {
        return <Redirect to={UnauthorizedRedirectionConfig} />;
    }

    if (isLoading) {
        return <div className={s.fScreen}>Loading...</div>;
    }

    if (isError) {
        return <Redirect to={UnauthorizedRedirectionConfig} />;
    }

    const authUser = !isLoading && negate(isNil)(data?.id);

    const renderComponent = (props: RouteComponentProps) => {
        if (authUser) {
            return <Component {...props} />;
        }
        return <Redirect to={UnauthorizedRedirectionConfig} />;
    };
    return <Route {...rest} render={renderComponent} />;
};
