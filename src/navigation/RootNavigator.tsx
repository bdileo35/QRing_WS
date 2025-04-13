import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomSplash from '../components/CustomSplash';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade'
      }}
    >
      <Stack.Screen name="Splash" component={CustomSplash} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
} 