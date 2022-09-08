export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const { PORT = 3000 } = process.env;
export const PASSWORD_MANAGEMENT = {
    LOCAL_STORAGE: {
        DEVICE_UUID: 'deviceUUID',
        SECRET_KEY: 'secretKey',
    },
};
