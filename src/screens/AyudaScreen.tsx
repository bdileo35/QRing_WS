import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AyudaScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Pantalla de Ayuda</Text>
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

export default AyudaScreen; 