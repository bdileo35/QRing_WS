import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomSplash from '../components/CustomSplash';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={appIsReady ? "Main" : "Splash"}
      screenOptions={{
        headerShown: false,
        animation: 'fade'
      }}
    >
      {!appIsReady ? (
        <Stack.Screen name="Splash" component={CustomSplash} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
} 