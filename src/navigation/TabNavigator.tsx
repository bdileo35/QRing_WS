import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
          backgroundColor: '#f5f5f5',
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#666666',
        tabBarInactiveTintColor: '#999999',
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