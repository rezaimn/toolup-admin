import { FC, useEffect } from 'react';
/* components */
/* modules */
import cn from 'clsx';
import qs from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { useRemoteLogin } from 'Hooks/api';
/* helpers */
/* assets */
/* styles */
/* types */

const RemoteLogin: FC = () => {
    const location = useLocation();
    const history = useHistory();
    const { mutate: remoteLogin } = useRemoteLogin(history);
    const queryString = qs.parse(location.search);
    useEffect(() => {
        remoteLogin({ token: queryString?.token as string });
    }, []);

    return <> </>;
};

export default RemoteLogin;
