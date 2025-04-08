import React from 'react';
import { Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

const ConfigScreen: React.FC = () => (
  <ScreenContainer>
    <Text style={styles.text}>Pantalla de Configuración</Text>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default ConfigScreen; 