import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { useConfigStorage } from '../hooks/useConfigStorage';
import { ConfigData } from '../types/config';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConfigScreen() {
    const { config, saveConfig } = useConfigStorage();
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const [formData, setFormData] = useState<ConfigData>({
        whatsapp: '',
        direccion: {
            calle: '',
            altura: '',
            dpto: ''
        }
    });
    const [errors, setErrors] = useState<{
        whatsapp?: string;
        calle?: string;
        altura?: string;
    }>({});

    useEffect(() => {
        if (config) {
            setFormData(config);
        }
    }, [config]);

    const formatWhatsAppNumber = (number: string) => {
        // Eliminar todo excepto números
        const cleaned = number.replace(/\D/g, '');
        
        // Si no hay números, retornar vacío
        if (!cleaned) return '';

        // Si empieza con 549, está completo
        if (cleaned.startsWith('549')) {
            return cleaned;
        }

        // Si empieza con 54, verificar si sigue un 9
        if (cleaned.startsWith('54')) {
            if (cleaned[2] === '9') {
                return cleaned; // ya tiene el formato correcto
            }
            return '549' + cleaned.slice(2);
        }

        // Si empieza con 9, agregar 54
        if (cleaned.startsWith('9')) {
            return '54' + cleaned;
        }

        // Si no tiene prefijo, agregar 54
        return '54' + cleaned;
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        
        // Validar WhatsApp
        if (!formData.whatsapp) {
            newErrors.whatsapp = 'El número de WhatsApp es requerido';
        } else {
            const cleaned = formData.whatsapp.replace(/\D/g, '');
            if (cleaned.length < 10) {
                newErrors.whatsapp = 'El número debe tener al menos 10 dígitos';
            }
        }

        // Validar dirección
        if (!formData.direccion.calle) {
            newErrors.calle = 'La calle es requerida';
        }
        if (!formData.direccion.altura) {
            newErrors.altura = 'La altura es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validateForm()) {
            // Formatear el número antes de guardar
            const formattedData = {
                ...formData,
                whatsapp: formatWhatsAppNumber(formData.whatsapp)
            };
            const success = await saveConfig(formattedData);
            if (success) {
                navigation.replace('Inicio');
            }
        }
    };

    const getWhatsAppUrl = () => {
        if (!formData.whatsapp) return '';
        const formattedNumber = formatWhatsAppNumber(formData.whatsapp);
        return `https://wa.me/${formattedNumber}`;
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container}>
                <Surface style={styles.formContainer} elevation={2}>
                    <Text variant="headlineMedium" style={styles.title}>Configuración del Timbre</Text>
                    
                    {/* QR Code Preview */}
                    <View style={styles.qrContainer}>
                        <Text variant="titleMedium" style={styles.qrTitle}>Vista previa del QR</Text>
                        <Surface style={styles.qrSurface} elevation={4}>
                            {getWhatsAppUrl() ? (
                                <QRCode
                                    value={getWhatsAppUrl()}
                                    size={250}
                                    backgroundColor="white"
                                />
                            ) : (
                                <View style={styles.emptyQR}>
                                    <Text variant="bodyMedium" style={styles.emptyQRText}>
                                        Complete el número de WhatsApp
                                    </Text>
                                </View>
                            )}
                        </Surface>
                    </View>

                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>WhatsApp</Text>
                        <TextInput
                            mode="outlined"
                            label="Número de WhatsApp"
                            value={formData.whatsapp}
                            onChangeText={(text) => {
                                setFormData({...formData, whatsapp: text});
                                if (errors.whatsapp) setErrors({...errors, whatsapp: undefined});
                            }}
                            style={styles.input}
                            keyboardType="phone-pad"
                            placeholder="Ej: +54 9 11 1234-5678"
                            error={!!errors.whatsapp}
                        />
                        {errors.whatsapp && (
                            <Text style={styles.errorText}>{errors.whatsapp}</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Dirección</Text>
                        <TextInput
                            mode="outlined"
                            label="Calle"
                            value={formData.direccion.calle}
                            onChangeText={(text) => {
                                setFormData({
                                    ...formData,
                                    direccion: {...formData.direccion, calle: text}
                                });
                                if (errors.calle) setErrors({...errors, calle: undefined});
                            }}
                            style={styles.input}
                            placeholder="Nombre de la calle"
                            error={!!errors.calle}
                        />
                        {errors.calle && (
                            <Text style={styles.errorText}>{errors.calle}</Text>
                        )}

                        <View style={styles.rowContainer}>
                            <View style={styles.alturaContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Altura"
                                    value={formData.direccion.altura}
                                    onChangeText={(text) => {
                                        // Solo permitir números
                                        const numericValue = text.replace(/[^0-9]/g, '');
                                        setFormData({
                                            ...formData,
                                            direccion: {...formData.direccion, altura: numericValue}
                                        });
                                        if (errors.altura) setErrors({...errors, altura: undefined});
                                    }}
                                    style={[styles.input, { marginBottom: 0 }]}
                                    keyboardType="number-pad"
                                    placeholder="Número"
                                    error={!!errors.altura}
                                />
                                {errors.altura && (
                                    <Text style={styles.errorText}>{errors.altura}</Text>
                                )}
                            </View>

                            <View style={styles.dptoContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Dpto"
                                    value={formData.direccion.dpto}
                                    onChangeText={(text) => setFormData({
                                        ...formData,
                                        direccion: {...formData.direccion, dpto: text}
                                    })}
                                    style={[styles.input, { marginBottom: 0 }]}
                                    placeholder="Opcional"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button 
                            mode="contained" 
                            onPress={handleSave}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            Guardar y Continuar
                        </Button>
                    </View>
                </Surface>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        color: '#1a73e8',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        color: '#5f6368',
    },
    input: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    qrTitle: {
        marginBottom: 16,
        color: '#5f6368',
    },
    qrSurface: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    emptyQR: {
        width: 250,
        height: 250,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    emptyQRText: {
        color: '#5f6368',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    buttonContainer: {
        marginTop: 24,
    },
    button: {
        borderRadius: 8,
    },
    buttonContent: {
        height: 48,
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    alturaContainer: {
        flex: 0.6,
    },
    dptoContainer: {
        flex: 0.4,
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 12,
        marginLeft: 8,
    },
}); 