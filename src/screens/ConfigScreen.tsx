import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme, Checkbox, RadioButton, List, Divider } from 'react-native-paper';
import { useConfigStorage } from '../hooks/useConfigStorage';
import { ConfigData } from '../types/config';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ScreenContainer from '../components/ScreenContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COMMUNICATION_TYPES = {
    DIRECT_CALL: 'direct_call',
    WHATSAPP: 'whatsapp'
} as const;

export default function ConfigScreen() {
    const { config, saveConfig, clearConfig, updateConfig } = useConfigStorage();
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const [formData, setFormData] = useState<ConfigData>({
        whatsapp: '',
        direccion: {
            calle: '',
            altura: '',
            dpto: ''
        },
        mostrarDireccion: true,
        communicationType: COMMUNICATION_TYPES.DIRECT_CALL
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

    const handleCommunicationTypeChange = (type: string) => {
        updateConfig({ ...formData, communicationType: type });
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

                    <View style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Modo de Comunicación
                        </Text>
                        
                        <RadioButton.Group
                            value={formData.communicationType}
                            onValueChange={handleCommunicationTypeChange}
                        >
                            <List.Section>
                                <List.Item
                                    title="Llamada Directa"
                                    description="Llamada telefónica inmediata al escanear"
                                    left={props => <RadioButton {...props} value={COMMUNICATION_TYPES.DIRECT_CALL} />}
                                />
                                <Divider />
                                <List.Item
                                    title="WhatsApp"
                                    description="Contacto directo por WhatsApp al escanear"
                                    left={props => <RadioButton {...props} value={COMMUNICATION_TYPES.WHATSAPP} />}
                                />
                            </List.Section>
                        </RadioButton.Group>

                        <View style={styles.advantagesContainer}>
                            <Text variant="titleSmall" style={styles.advantagesTitle}>
                                Ventajas del modo seleccionado:
                            </Text>
                            {(formData.communicationType === COMMUNICATION_TYPES.WHATSAPP ? [
                                "Mensajes de texto adicionales",
                                "Confirmación de lectura",
                                "Envío de fotos/videos",
                                "Comunicación gratuita por internet"
                            ] : [
                                "Conexión telefónica inmediata",
                                "No requiere WhatsApp instalado",
                                "Compatible con cualquier teléfono",
                                "Ideal para timbres de emergencia"
                            ]).map((advantage, index) => (
                                <Text key={index} style={styles.advantageItem}>
                                    • {advantage}
                                </Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            Guardar
                        </Button>
                        
                        <Button
                            mode="outlined"
                            onPress={() => {
                                Alert.alert(
                                    'Restablecer Configuración',
                                    '¿Estás seguro que deseas borrar toda la configuración? Esta acción no se puede deshacer.',
                                    [
                                        {
                                            text: 'Cancelar',
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'Restablecer',
                                            style: 'destructive',
                                            onPress: async () => {
                                                const success = await clearConfig();
                                                if (success) {
                                                    setFormData({
                                                        whatsapp: '',
                                                        direccion: {
                                                            calle: '',
                                                            altura: '',
                                                            dpto: ''
                                                        },
                                                        mostrarDireccion: true,
                                                        communicationType: COMMUNICATION_TYPES.DIRECT_CALL
                                                    });
                                                    Alert.alert(
                                                        'Configuración Restablecida',
                                                        'Por favor, ingresa los nuevos datos de configuración.',
                                                        [
                                                            {
                                                                text: 'OK',
                                                                onPress: () => {
                                                                    // Limpiar errores también
                                                                    setErrors({});
                                                                }
                                                            }
                                                        ]
                                                    );
                                                } else {
                                                    Alert.alert(
                                                        'Error',
                                                        'No se pudo restablecer la configuración'
                                                    );
                                                }
                                            }
                                        }
                                    ]
                                );
                            }}
                            style={[styles.button, { marginTop: 12 }]}
                            contentStyle={styles.buttonContent}
                            textColor="#B00020"
                        >
                            Restablecer Configuración
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
        margin: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
        color: '#1a73e8',
        fontSize: 28,
    fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 12,
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
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    qrTitle: {
        marginBottom: 8,
        color: '#5f6368',
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
        marginTop: 12,
        gap: 8,
    },
    button: {
        borderRadius: 8,
    },
    buttonContent: {
        height: 48,
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
    advantagesContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    advantagesTitle: {
        marginBottom: 12,
        color: '#202124',
    },
    advantageItem: {
        marginBottom: 8,
        color: '#5f6368',
        fontSize: 14,
  },
});