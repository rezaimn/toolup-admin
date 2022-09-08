import React, { ReactElement, useRef } from 'react';
/* modules */
import { Redirect, Switch, useLocation } from 'react-router-dom';
import { useCurrentUserDetails, User } from 'Hooks/api';
/* components */
import { Route } from 'Components/Atomes/Route';
import { AuthRoute } from 'Components/Atomes/AuthRoute';
import { Spinner } from 'Components/Atomes/Spinner';
/* helpers */
import { concat } from 'lodash/fp';
import { uniqueId } from 'lodash';
import * as localStorage from 'Helpers/localStorage';
import { DeepPartial } from 'react-hook-form';
/* services */
/* import { isAdmin } from 'Services/RBAC/config'; */
/* route imports */
import { adminRoutes } from './adminRoutes';
import { globalRoutes } from './globalRoutes';
import { normalUserRoutes } from './normalUserRoutes';

/* styles */
import s from './styles.module.scss';
import { isAdmin } from 'Services/RBAC/config';
/* modules */

const Routings = (): ReactElement => {
    const location = useLocation();

    const defaultData: DeepPartial<User> = {
        access: 'Normal User',
    };

    const { data = defaultData, isLoading, isError } = useCurrentUserDetails({
        enabled: !!localStorage.getItem('token') || false,
    });

    if (isLoading) {
        return (
            <div className={s.fScreen}>
                <Spinner />
            </div>
        );
    }

    const concatWith = isAdmin() ? adminRoutes : normalUserRoutes;

    const routes = concat(concatWith)(globalRoutes);

    const pages = routes.map(route => {
        const { component: Component, exact, path, config, to } = route;

        if (to) {
            return <Redirect from={path as string} to={to} />;
        }

        if (config.isPrivate) {
            return (
                <AuthRoute
                    key={uniqueId()}
                    path={path}
                    exact={exact}
                    component={Component!}
                    layout={config.layout}
                    title={config?.title}
                    renderDomain={config.renderDomain}
                    breadcrumbs={config?.breadcrumbs}
                    description={config?.description}
                />
            );
        }

        return (
            <Route
                layout={config.layout}
                key={uniqueId()}
                path={path}
                exact={exact}
                component={Component}
                title={config?.title}
                renderDomain={config.renderDomain}
                breadcrumbs={config?.breadcrumbs}
                description={config?.description}
            />
        );
    });

    return <Switch location={location}>{pages}</Switch>;
};

export default Routings;
