import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InicioScreen from '../screens/InicioScreen';
import ConfigScreen from '../screens/ConfigScreen';
import AyudaScreen from '../screens/AyudaScreen';

export type RootTabParamList = {
  Inicio: undefined;
  Config: undefined;
  Ayuda: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
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