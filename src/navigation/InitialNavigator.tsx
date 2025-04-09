import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useConfigStorage } from '../hooks/useConfigStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function InitialNavigator() {
    const navigation = useNavigation<NavigationProp>();
    const { config, loading } = useConfigStorage();

    useEffect(() => {
        if (!loading) {
            if (config && config.whatsapp && config.direccion.calle && config.direccion.altura) {
                navigation.replace('Inicio');
            } else {
                navigation.replace('Config');
            }
        }
    }, [loading, config]);

    return null;
} 