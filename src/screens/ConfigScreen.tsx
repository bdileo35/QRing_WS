import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme, Checkbox } from 'react-native-paper';
import { useConfigStorage } from '../hooks/useConfigStorage';
import { ConfigData } from '../types/config';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';
import { Portal, Dialog } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConfigScreen() {
    const { config, saveConfig, clearConfig } = useConfigStorage();
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const [formData, setFormData] = useState<ConfigData>({
        whatsapp: '',
        direccion: {
            calle: '',
            altura: '',
            dpto: ''
        },
        mostrarDireccion: true
    });
    const [errors, setErrors] = useState<{
        whatsapp?: string;
        calle?: string;
        altura?: string;
    }>({});
    const [showResetDialog, setShowResetDialog] = useState(false);

    useEffect(() => {
        if (config) {
            setFormData(config);
        }
    }, [config]);

    const formatWhatsAppNumber = (text: string) => {
        // Eliminar todo excepto números
        const numbers = text.replace(/\D/g, '');
        
        // Si no hay números, retornar vacío
        if (!numbers) return '';
        
        // Formatear según la longitud
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 5) {
            return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        } else {
            return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 13)}`;
        }
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

    const handleReset = async () => {
        try {
            // Primero limpiamos AsyncStorage
            await Promise.all([
                AsyncStorage.removeItem('@config'),
                AsyncStorage.removeItem('@inicio_data')
            ]);

            // Luego reseteamos el estado local
            const emptyConfig = {
                whatsapp: '',
                direccion: {
                    calle: '',
                    altura: '',
                    dpto: ''
                },
                mostrarDireccion: true
            };
            
            setFormData(emptyConfig);
            await saveConfig(emptyConfig);
            
            // Cerramos el diálogo
            setShowResetDialog(false);
            
            // Redirigimos a Config
            navigation.reset({
                index: 0,
                routes: [{ name: 'Config' }],
            });
        } catch (error) {
            console.error('Error al resetear:', error);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Configuración
                    </Text>
                    
                    {/* QR Code Preview */}
                    <View style={styles.qrContainer}>
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
                        <Text style={styles.boldText}>Número de WhatsApp</Text>
                        <TextInput
                            mode="outlined"
                            value={formData.whatsapp}
                            onChangeText={(text) => {
                                const formatted = formatWhatsAppNumber(text);
                                setFormData({
                                    ...formData,
                                    whatsapp: formatted
                                });
                                if (errors.whatsapp) setErrors({...errors, whatsapp: undefined});
                            }}
                            keyboardType="numeric"
                            maxLength={15}
                            placeholder="+54 911 XXXX-XXXX"
                            style={styles.input}
                            error={!!errors.whatsapp}
                        />
                        {errors.whatsapp && (
                            <Text style={styles.errorText}>{errors.whatsapp}</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Dirección</Text>
                            <View style={styles.checkboxContainer}>
                                <Checkbox
                                    status={formData.mostrarDireccion ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setFormData({
                                            ...formData,
                                            mostrarDireccion: !formData.mostrarDireccion
                                        });
                                    }}
                                    color="#1a73e8"
                                />
                                <Text 
                                    variant="bodyMedium" 
                                    style={styles.checkboxLabel}
                                    onPress={() => {
                                        setFormData({
                                            ...formData,
                                            mostrarDireccion: !formData.mostrarDireccion
                                        });
                                    }}
                                >
                                    Mostrar en la etiqueta
                                </Text>
                            </View>
                        </View>
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
                            mode="outlined" 
                            onPress={() => setShowResetDialog(true)}
                            style={[styles.button, styles.resetButton]}
                            labelStyle={[styles.buttonLabel, styles.resetButtonLabel]}
                        >
                            Reset
                        </Button>
                        <Button 
                            mode="contained" 
                            onPress={handleSave}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Guardar
                        </Button>
                    </View>
                </View>
            </ScrollView>

            {/* Reset Confirmation Dialog */}
            <Portal>
                <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
                    <Dialog.Title>¿Estás seguro?</Dialog.Title>
                    <Dialog.Content>
                        <Text>Esta acción eliminará todos los datos configurados y no se puede deshacer.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowResetDialog(false)}>Cancelar</Button>
                        <Button onPress={handleReset} textColor="#d32f2f">Reset</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    formContainer: {
        margin: 8,
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a73e8',
        marginTop: 0,
        marginBottom: 8,
        textAlign: 'center',
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        marginBottom: 8,
        color: '#5f6368',
    },
    input: {
        marginBottom: 8,
        backgroundColor: 'white',
        height: 48,
    },
    compactInput: {
        height: 40,
        paddingVertical: 0,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    qrSurface: {
        padding: 8,
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
        paddingHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 8,
    },
    button: {
        flex: 1,
        borderRadius: 8,
    },
    resetButton: {
        borderColor: '#d32f2f',
    },
    resetButtonLabel: {
        color: '#d32f2f',
    },
    buttonLabel: {
        fontWeight: 'bold',
    },
    rowContainer: {
        flexDirection: 'row',
        gap: 8,
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
        marginTop: -4,
        marginBottom: 8,
        marginLeft: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        marginLeft: 4,
        color: '#1a73e8',
        fontSize: 13,
    },
    boldText: {
        fontWeight: 'bold',
    },
});