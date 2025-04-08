import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style, ...props }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.content, style]} {...props}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ScreenContainer; 