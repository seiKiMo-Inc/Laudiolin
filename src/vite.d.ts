/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GATEWAY_URL: string;
    readonly VITE_DEV_GATEWAY_URL: string;
    readonly VITE_USE_ENCRYPTION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
