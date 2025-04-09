import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BottomNavigation() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();

    const isRouteActive = (routeName: keyof MainStackParamList) => {
        return route.name === routeName;
    };

    const navigateToScreen = (screen: keyof MainStackParamList) => {
        navigation.navigate('Main', { screen });
    };

    return (
        <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigateToScreen('Inicio')}
                >
                    <Ionicons
                        name={isRouteActive('Inicio') ? 'home' : 'home-outline'}
                        size={24}
                        color={isRouteActive('Inicio') ? '#007AFF' : '#666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigateToScreen('Config')}
                >
                    <Ionicons
                        name={isRouteActive('Config') ? 'settings' : 'settings-outline'}
                        size={24}
                        color={isRouteActive('Config') ? '#007AFF' : '#666'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigateToScreen('Ayuda')}
                >
                    <Ionicons
                        name={isRouteActive('Ayuda') ? 'help-circle' : 'help-circle-outline'}
                        size={24}
                        color={isRouteActive('Ayuda') ? '#007AFF' : '#666'}
                    />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    }
});