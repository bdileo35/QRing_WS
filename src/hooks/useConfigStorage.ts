import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfigData, CONFIG_STORAGE_KEY } from '../types/config';

export const useConfigStorage = () => {
    const [config, setConfig] = useState<ConfigData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const storedConfig = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
            if (storedConfig) {
                setConfig(JSON.parse(storedConfig));
            }
        } catch (error) {
            console.error('Error al cargar la configuración:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async (newConfig: ConfigData) => {
        try {
            await AsyncStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
            setConfig(newConfig);
            return true;
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            return false;
        }
    };

    const clearConfig = async () => {
        try {
            await AsyncStorage.removeItem(CONFIG_STORAGE_KEY);
            setConfig(null);
            return true;
        } catch (error) {
            console.error('Error al limpiar la configuración:', error);
            return false;
        }
    };

    return {
        config,
        loading,
        saveConfig,
        clearConfig,
        loadConfig
    };
}; 