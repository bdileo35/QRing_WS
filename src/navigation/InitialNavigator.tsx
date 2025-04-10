import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useConfigStorage } from '../hooks/useConfigStorage';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function InitialNavigator() {
    const navigation = useNavigation<NavigationProp>();
    const { config, loading } = useConfigStorage();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loading) {
                if (config && config.whatsapp && config.direccion.calle && config.direccion.altura) {
                    navigation.replace('Inicio');
                } else {
                    navigation.replace('Config');
                }
            }
        }, 1000); // Pequeño delay para evitar parpadeos

        return () => clearTimeout(timer);
    }, [loading, config]);

    // Mostrar un loading mientras se verifica la configuración
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size="large" color="#1a73e8" />
            <Text style={{ marginTop: 16, color: '#5f6368' }}>
                Verificando configuración...
            </Text>
        </View>
    );
} 