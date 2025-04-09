import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import Inicio from '../screens/InicioScreen';
import Config from '../screens/ConfigScreen';
import Ayuda from '../screens/AyudaScreen';
import Historial from '../screens/HistorialScreen';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator = () => {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Inicio" component={Inicio} />
                    <Stack.Screen name="Config" component={Config} />
                    <Stack.Screen name="Ayuda" component={Ayuda} />
                    <Stack.Screen name="Historial" component={Historial} />
                </Stack.Navigator>
            </View>
            <BottomNavigation />
        </View>
    );
};

export default MainNavigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
    },
}); 