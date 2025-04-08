import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import InicioScreen from '../screens/InicioScreen';
import ConfigScreen from '../screens/ConfigScreen';
import AyudaScreen from '../screens/AyudaScreen';
import Header from '../components/Header';

export type RootTabParamList = {
  Inicio: undefined;
  Config: undefined;
  Ayuda: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: '#999999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={InicioScreen}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Config" 
        component={ConfigScreen}
        options={{
          tabBarLabel: 'Configuración',
        }}
      />
      <Tab.Screen 
        name="Ayuda" 
        component={AyudaScreen}
        options={{
          tabBarLabel: 'Ayuda',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 