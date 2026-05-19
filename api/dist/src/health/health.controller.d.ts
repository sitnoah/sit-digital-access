export declare class HealthController {
    getHealth(): {
        data: {
            status: string;
            service: string;
            timestamp: string;
            environment: string;
            uptimeSeconds: number;
            backendConfig: {
                FIREBASE_PROJECT_ID: boolean;
                FIREBASE_CLIENT_EMAIL: boolean;
                FIREBASE_PRIVATE_KEY: boolean;
                ADMIN_WEB_ORIGINS: boolean;
                PORT: boolean;
            };
        };
    };
}
