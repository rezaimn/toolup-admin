import { FC, Fragment } from 'react';
/* components */
import Layout from 'Components/Templates/Layout';
import {
    Redirect,
    RouteProps as ReactRouterRouteProps,
} from 'react-router-dom';
/* modules */
import { Route as ReactRouterRoute } from 'react-router-dom';
import cn from 'clsx';
/* helpers */
/* assets */
/* styles */
/* types */
import { RenderDomains } from 'Routings/routes';
import { isGateway, isProduction, isStaging } from 'Helpers/getDomain';
import { routeTo } from 'Helpers/routeTo';
import { BreadCrumbType } from 'Components/Organisms/Breadcrumb';
import { DocumentTitle } from '../DocumentTitle';
import { last } from 'lodash/fp';

export type CommonRouteProps = {
    layout?: boolean;
    title?: string;
    description?: string;
    renderDomain: RenderDomains;
    breadcrumbs?: BreadCrumbType[];
};
export type RouteProps = ReactRouterRouteProps & CommonRouteProps;

export const Route: FC<RouteProps> = ({
    layout,
    title,
    renderDomain,
    breadcrumbs,
    description,
    ...restProps
}) => {
    const LayoutPlaceholder = layout ? Layout : Fragment;

    const result = () => {
        switch (renderDomain) {
            case 'BOTH':
                return <ReactRouterRoute {...restProps} />;

            case 'DOMAIN':
                if (isGateway) {
                    return <ReactRouterRoute {...restProps} />;
                }
                return <Redirect to={routeTo('auth')} />;

            case 'SUBDOMAIN':
                if (isStaging || isProduction) {
                    return <ReactRouterRoute {...restProps} />;
                }
                return <Redirect to={routeTo('auth')} />;

            default:
                return <Redirect to={routeTo('auth')} />;
        }
    };

    const lastItemOfBreadcrumb = last(breadcrumbs) as BreadCrumbType;
    return (
        <LayoutPlaceholder breadcrumbs={breadcrumbs} {...restProps}>
            <DocumentTitle>
                <title>
                    {`TOOLUP - ${lastItemOfBreadcrumb?.title || title}`}
                </title>
            </DocumentTitle>

            {result()}
        </LayoutPlaceholder>
    );
};
