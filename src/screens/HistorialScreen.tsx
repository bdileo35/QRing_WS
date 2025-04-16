import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenContainer from '../components/ScreenContainer';

export default function HistorialScreen() {
    return (
        <ScreenContainer>
            <View style={styles.container}>
                <Text variant="headlineMedium" style={styles.title}>
                    Historial
                </Text>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        marginBottom: 16,
        color: '#1a73e8',
        fontWeight: 'bold',
    },
}); 