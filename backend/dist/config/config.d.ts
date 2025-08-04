export declare const config: {
    env: string;
    port: string | number;
    mongoUri: string;
    dbName: string;
    jwtSecret: string;
    jwtExpire: string;
    cloudinary: {
        cloudName: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        currency: string;
    };
    email: {
        host: string | undefined;
        port: number;
        user: string | undefined;
        password: string | undefined;
        from: string | undefined;
    };
    clientUrl: string;
    cookieOptions: {
        httpOnly: boolean;
        secure: boolean;
        signed: boolean;
        maxAge: number;
    };
};
