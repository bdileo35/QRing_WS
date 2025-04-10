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
                    <View style={[styles.iconContainer, isRouteActive('Inicio') && styles.activeIconContainer]}>
                        <Ionicons
                            name={isRouteActive('Inicio') ? 'home' : 'home-outline'}
                            size={24}
                            color={isRouteActive('Inicio') ? '#1a73e8' : '#5f6368'}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigateToScreen('Config')}
                >
                    <View style={[styles.iconContainer, isRouteActive('Config') && styles.activeIconContainer]}>
                        <Ionicons
                            name={isRouteActive('Config') ? 'settings' : 'settings-outline'}
                            size={24}
                            color={isRouteActive('Config') ? '#1a73e8' : '#5f6368'}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => navigateToScreen('Ayuda')}
                >
                    <View style={[styles.iconContainer, isRouteActive('Ayuda') && styles.activeIconContainer]}>
                        <Ionicons
                            name={isRouteActive('Ayuda') ? 'help-circle' : 'help-circle-outline'}
                            size={24}
                            color={isRouteActive('Ayuda') ? '#1a73e8' : '#5f6368'}
                        />
                    </View>
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
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
    },
    activeIconContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#1a73e8',
    }
});