import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';
import CustomSplash from './src/components/CustomSplash';

export default function App() {
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
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      {!appIsReady ? (
        <CustomSplash />
      ) : (
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      )}
    </>
  );
} 