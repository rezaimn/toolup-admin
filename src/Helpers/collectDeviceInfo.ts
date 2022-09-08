import { UAParser } from 'ua-parser-js';
import { AddDevicePayload } from '../Hooks/api/passwordManagement/useAddDevice';

export const collectDeviceInfo = (): Omit<AddDevicePayload, 'uuid'> => {
    const UAP = new UAParser();
    return {
        client: UAP.getResult().browser.name,
        client_version: UAP.getResult().browser.version,
        user_agent: UAP.getResult().ua,
        os_name: UAP.getResult().os.name,
        os_version: UAP.getResult().os.version,
        device_model: UAP.getResult().device.model,
        device_type: UAP.getResult().device.type,
        device_vendor: UAP.getResult().device.vendor,
    };
};
