import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConfigScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Pantalla de Configuración</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ConfigScreen; 