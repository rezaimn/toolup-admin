import { FC, useEffect } from 'react';
/* components */
/* modules */
import {
    ActivatePasswordManagementArgs,
    ActivatePasswordManagement,
    InitialActivatePasswordManagement,
} from 'Helpers/password-management/activation';

/* helpers */
/* assets */
/* styles */
/* types */

const PasswordManagementActivation: FC = () => {
    const l: ActivatePasswordManagementArgs = {
        password: '12345mohsen',
        email: 'mohsen.n@agileful.com',
        userId: 2,
    };

    useEffect(() => {
        /*  ActivatePasswordManagement(l)
            .then(secretKey => {
                console.log(secretKey);
                return secretKey;
            })
            .catch(c => {
                console.log('ERROR!', c);
            }); */
    }, []);

    return <pre />;
};

export default PasswordManagementActivation;
