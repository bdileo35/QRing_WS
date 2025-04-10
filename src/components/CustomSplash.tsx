import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
            <View style={styles.content}>
                <Text style={styles.subtitle}>Tu timbre inteligente</Text>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.loadingText}>Verificando configuración...</Text>
                <ActivityIndicator size="large" color="#1a73e8" style={styles.spinner} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50, // Reducido para compensar la nueva disposición
    },
    subtitle: {
        fontSize: 18,
        color: '#5f6368',
        fontWeight: '500',
        marginBottom: 40,
        position: 'absolute',
        top: '25%', // Posiciona el subtítulo a 1/4 de la pantalla
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginTop: -20, // Ajuste fino para centrar visualmente
    },
    logo: {
        width: 180,
        height: 180,
    },
    loadingText: {
        fontSize: 16,
        color: '#5f6368',
        marginTop: 80,
        marginBottom: 20,
    },
    spinner: {
        transform: [{ scale: 1.2 }], // Hace el spinner un poco más grande
    },
}); 