import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import ScreenContainer from '../components/ScreenContainer';

const tutorialSteps = [
    {
        title: "Paso 1: Escanear el QR",
        description: "El cartero/repartidor escanea el código QR de tu timbre con su teléfono",
        image: require('../../assets/help/step1.png')
    },
    {
        title: "Paso 2: Comunicación",
        description: "Te llega una notificación por WhatsApp indicando que alguien está en la puerta",
        image: require('../../assets/help/step2.png')
    },
    {
        title: "Paso 3: Recepción",
        description: "Recibes tu envío después de coordinar con el repartidor",
        image: require('../../assets/help/step3.jpg')
    }
];

export default function AyudaScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const { width } = useWindowDimensions();
    const imageSize = Math.min(width * 0.8, 300);

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <Text variant="headlineMedium" style={styles.mainTitle}>
                    ¿Cómo funciona QRing?
                </Text>

                <Surface style={styles.tutorialCard} elevation={2}>
                    <View style={styles.stepIndicator}>
                        {tutorialSteps.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentStep === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.contentContainer}>
                        <Text variant="titleLarge" style={styles.stepTitle}>
                            {tutorialSteps[currentStep].title}
                        </Text>

                        <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
                            <Image 
                                source={tutorialSteps[currentStep].image}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <Text variant="bodyLarge" style={styles.description}>
                            {tutorialSteps[currentStep].description}
                        </Text>
                    </View>

                    <View style={styles.navigation}>
                        <Button
                            mode="outlined"
                            onPress={prevStep}
                            disabled={currentStep === 0}
                        >
                            Anterior
                        </Button>
                        <Button
                            mode="contained"
                            onPress={nextStep}
                            disabled={currentStep === tutorialSteps.length - 1}
                        >
                            Siguiente
                        </Button>
                    </View>
                </Surface>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    mainTitle: {
        marginBottom: 16,
        color: '#1a73e8',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tutorialCard: {
        width: '100%',
        padding: 12,
        borderRadius: 16,
        backgroundColor: 'white',
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
    activeDot: {
        backgroundColor: '#1a73e8',
        width: 24,
    },
    contentContainer: {
        alignItems: 'center',
        gap: 20,
    },
    stepTitle: {
        color: '#202124',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    description: {
        textAlign: 'center',
        color: '#5f6368',
        paddingHorizontal: 16,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
    },
}); 