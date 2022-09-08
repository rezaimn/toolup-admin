import { generatePath } from 'react-router-dom';
import { stringify } from 'qs';
import get from 'lodash/get';
import { ROUTES } from 'Constants/routes';

export type PathType = keyof typeof ROUTES;
type ParamsType = { [paramName: string]: string | number | boolean };

// todo -> provide needed descriptions
/**
 *
 * @param path ]
 * @param params
 * @param queryString
 */
export const routeTo = (
    path: PathType,
    params?: ParamsType,
    queryString?: Record<string, unknown>
): string => {
    const url = generatePath(get(ROUTES, path), params);
    return queryString ? `${url}?${stringify(queryString)}` : url;
};
