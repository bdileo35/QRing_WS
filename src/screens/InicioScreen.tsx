import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

const InicioScreen: React.FC = () => (
  <ScreenContainer>
    <View style={styles.section}>
      <Text style={styles.title}>Pantalla de Inicio</Text>
      <Text style={styles.subtitle}>Bienvenido a la aplicación</Text>
    </View>
    
    <View style={styles.section}>
      <Text style={styles.heading}>Sección 1</Text>
      <Text style={styles.text}>
        Este es un ejemplo de contenido que puede crecer automáticamente.
        El contenedor se ajustará según sea necesario.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.heading}>Sección 2</Text>
      <Text style={styles.text}>
        Puedes agregar tanto contenido como necesites.
        El scroll se activará automáticamente si el contenido excede el espacio disponible.
      </Text>
    </View>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default InicioScreen; 