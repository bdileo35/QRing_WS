import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useConfigStorage } from '../hooks/useConfigStorage';

export default function CustomSplash() {
    const navigation = useNavigation();
    const { config } = useConfigStorage();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Verificar si existe configuración
            if (!config || !config.whatsapp) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main', params: { screen: 'Config' } }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main', params: { screen: 'Inicio' } }],
                });
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [config]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.title}>QRing</Text>
                <Text style={styles.subtitle}>Tu timbre inteligente</Text>
            </View>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a73e8" style={styles.spinner} />
                <Text style={styles.loadingText}>Verificando configuración...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1a73e8',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#5f6368',
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    spinner: {
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 16,
        color: '#5f6368',
    },
}); 