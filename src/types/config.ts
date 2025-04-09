export interface DireccionConfig {
    calle: string;
    altura: string;
    dpto: string;
}

export interface ConfigData {
    whatsapp: string;
    direccion: DireccionConfig;
}

export const CONFIG_STORAGE_KEY = '@QRing_WS:config'; 