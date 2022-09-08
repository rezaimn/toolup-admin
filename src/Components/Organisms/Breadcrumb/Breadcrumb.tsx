import { ComponentPropsWithoutRef, FC } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import { last, map, pipe, slice } from 'lodash/fp';
import {
    generatePath,
    Link,
    matchPath,
    RouteComponentProps,
    useLocation,
} from 'react-router-dom';
/* helpers */
/* assets */
/* styles */
import styles from './styles.module.scss';

/* types */

export type BreadCrumbType = {
    title: string;
    link: string;
};

export type CommonBreadcrumbProps = {
    breadcrumbs: BreadCrumbType[];
};

export type BreadcrumbProps = Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof CommonBreadcrumbProps
> &
    CommonBreadcrumbProps &
    RouteComponentProps;

export const Breadcrumb: FC<BreadcrumbProps> = ({
    className,
    breadcrumbs,
    location: locationProp,
    history,
    ...restProps
}) => {
    const location = useLocation();
    const currentLocation = location.pathname;
    const mchp = (p: string) =>
        matchPath(locationProp.pathname, {
            exact: true,
            path: p,
            strict: true,
        });

    /* capitalization pipe */
    const main = pipe(last, (x: BreadCrumbType) => ({
        title: x?.title,
        link: x?.link,
    }))(breadcrumbs) as BreadCrumbType;

    const mainParams = mchp(main.link)?.params;
    const breadcrumb = pipe(
        slice(0, -1),
        /* capitalization pipe  */
        map<BreadCrumbType, BreadCrumbType>(m => ({
            title: m?.title,
            link: m?.link,
        })),
        /* rendering pipe */
        map<BreadCrumbType, JSX.Element>(item => {
            return (
                <Link
                    to={generatePath(item.link, mainParams)}
                    className={item?.link}
                >
                    <div className={styles.title}>{item?.title} &gt;</div>
                </Link>
            );
        })
    )(breadcrumbs);

    return (
        <div className={cn(className, styles.breadcrumb)}>
            {breadcrumb}
            {currentLocation === main?.link ? (
                <span>
                    <p className={styles?.main}>{main?.title}</p>
                </span>
            ) : (
                <Link to={generatePath(main.link, mainParams)}>
                    <p className={styles?.main}>{main?.title}</p>
                </Link>
            )}
        </div>
    );
};
