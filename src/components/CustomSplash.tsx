import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Progress from 'react-native-progress';

const CustomSplash: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 1) {
          clearInterval(timer);
          return 1;
        }
        return prevProgress + 0.1;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Cargando datos</Text>
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={200}
          color="#666666"
          unfilledColor="#e0e0e0"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  progressContainer: {
    width: 200,
  },
});

export default CustomSplash; 