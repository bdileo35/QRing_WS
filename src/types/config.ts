export interface DireccionConfig {
    calle: string;
    altura: string;
    dpto?: string;
}

export type ConfigData = {
    whatsapp?: string;
    direccion?: {
        calle: string;
        altura: string;
        dpto: string;
    };
    mostrarDireccion: boolean;
    communicationType: 'direct_call' | 'whatsapp';
};

export const CONFIG_STORAGE_KEY = '@QRing_WS:config'; 