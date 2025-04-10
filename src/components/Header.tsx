import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const Header: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Formatear fecha DD/MM/AA
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      setDate(`${day}/${month}/${year}`);

      // Formatear hora HH:mm:ss
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={18} color="#1a73e8" />
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Ionicons name="time" size={18} color="#1a73e8" />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingTop: STATUSBAR_HEIGHT,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  gradient: {
    width: '100%',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoContainer: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1a73e8',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a73e8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 150,
    height: 48,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    width: 110,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    width: 110,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#202124',
    fontWeight: '500',
    width: 65,
    textAlign: 'center',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#202124',
    fontWeight: '500',
    width: 65,
    textAlign: 'center',
  },
});

export default Header; 