import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform, Alert, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, Portal, Modal, Button, FAB, TextInput, Provider as PaperProvider } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useConfigStorage } from '../hooks/useConfigStorage';
import ScreenContainer from '../components/ScreenContainer';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

// Mock data - Luego vendrá de la configuración real
const MOCK_DATA = {
    numeroPrincipal: '+54 911 1234-5678',
    numeroBackup: '+54 911 8765-4321',
    estadoPrincipal: true, // true = activo, false = DND
    backupActivo: true
};

// Mock data para las últimas llamadas
const MOCK_CALLS = [
    {
        type: 'incoming',
        number: '+54 911 2345-6789',
        time: 'Hace 5 min',
        duration: '1:23'
    },
    {
        type: 'outgoing',
        number: '+54 911 3456-7890',
        time: 'Hace 15 min',
        duration: '2:45'
    },
    {
        type: 'incoming',
        number: '+54 911 4567-8901',
        time: 'Hace 30 min',
        duration: '0:45'
    }
];

// Tipos de comunicación
const COMMUNICATION_TYPES = {
    DIRECT_CALL: 'direct_call',
    WHATSAPP: 'whatsapp'
} as const;

// Ventajas de cada modo
const ADVANTAGES = {
    [COMMUNICATION_TYPES.DIRECT_CALL]: [
        "Conexión telefónica inmediata",
        "No requiere WhatsApp instalado",
        "Compatible con cualquier teléfono",
        "Ideal para timbres de emergencia"
    ],
    [COMMUNICATION_TYPES.WHATSAPP]: [
        "Mensajes de texto adicionales",
        "Confirmación de lectura",
        "Envío de fotos/videos",
        "Comunicación gratuita por internet"
    ]
};

// Función para generar datos de llamada
const generateCallData = (phoneNumber: string) => {
    const callData = {
        type: 'phone_call',
        phoneNumber: phoneNumber,
        timestamp: Date.now(),
        // En producción, esto debería ser una firma real
        signature: 'test_signature'
    };
    
    // Convertir a string seguro para QR
    return JSON.stringify(callData);
};

// Función para generar URL según el tipo
const getCallUrl = (config: any) => {
    const phoneNumber = '1122473759';
    const communicationType = config?.communicationType || COMMUNICATION_TYPES.DIRECT_CALL;

    if (communicationType === COMMUNICATION_TYPES.WHATSAPP) {
        return `https://wa.me/54${phoneNumber}`;
    }
    return `tel:+54${phoneNumber}`;
};

export default function InicioScreen() {
    const { config } = useConfigStorage();
    const { width, height } = useWindowDimensions();
    const qrSize = Math.min(width * 0.45, 200);
    const isActive = true; // TODO: Implementar lógica de estado
    const [previewVisible, setPreviewVisible] = useState(false);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const labelRef = useRef<ViewShot>(null);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasGalleryPermission(status === 'granted');
        })();
    }, []);

    const getWhatsAppUrl = () => {
        if (!config?.whatsapp) return 'https://qring.com';
        const whatsappNumber = config.whatsapp.replace(/\D/g, '');
        return whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://qring.com';
    };

    const getDireccionCompleta = () => {
        if (!config?.direccion) return 'Dirección no configurada';
        const { calle = '', altura = '', dpto = '' } = config.direccion;
        return `${calle} ${altura}${dpto ? ` - ${dpto}` : ''}`.trim() || 'Dirección no configurada';
    };

    const captureAndShare = async () => {
        try {
            const uri = await captureRef(labelRef, {
                format: 'png',
                quality: 0.9,
                result: 'tmpfile',
                width: 600,
                height: 800
            });
            
            await Sharing.shareAsync(uri, {
                mimeType: 'image/png',
                dialogTitle: 'Compartir etiqueta QRing'
            });

            setPreviewVisible(false);

        } catch (error) {
            console.error('Error al compartir:', error);
            Alert.alert(
                'Error',
                'No se pudo compartir la etiqueta'
            );
        }
    };

    const saveToGallery = async () => {
        try {
            if (!hasGalleryPermission) {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso denegado',
                        'Necesitamos acceso a tu galería para guardar la etiqueta.'
                    );
                    return;
                }
                setHasGalleryPermission(true);
            }

            const uri = await captureRef(labelRef, {
                format: 'png',
                quality: 0.9,
                result: 'tmpfile',
                width: 600,
                height: 800
            });

            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('QRing', asset, false);

            Alert.alert(
                'Éxito',
                'La etiqueta se ha guardado en tu galería en el álbum "QRing"'
            );
            setPreviewVisible(false);

        } catch (error) {
            console.error('Error al guardar en galería:', error);
            Alert.alert(
                'Error',
                'No se pudo guardar la etiqueta en la galería'
            );
        }
    };

    const LabelContent = ({ isPreview = false }) => {
        const { config } = useConfigStorage();
        const communicationType = config?.communicationType || COMMUNICATION_TYPES.DIRECT_CALL;
        
        return (
            <Surface style={[styles.labelCard, {
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                margin: isPreview ? 16 : 0,
                backgroundColor: 'white',
            }]} elevation={4}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>
                        {communicationType === COMMUNICATION_TYPES.WHATSAPP ? 'WHATSAPP' : 'LLAMADA DIRECTA'}
                    </Text>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={getCallUrl(config)}
                            size={qrSize}
                            backgroundColor="white"
                        />
    </View>
    
                    <View style={styles.qrInstructions}>
                        <Text style={styles.instructionText}>
                            {communicationType === COMMUNICATION_TYPES.WHATSAPP 
                                ? 'Escanea para contactar por WhatsApp'
                                : 'Escanea para llamada directa'}
                        </Text>
                        <Text style={[styles.instructionText, { fontSize: 14, color: '#666' }]}>
                            {communicationType === COMMUNICATION_TYPES.WHATSAPP 
                                ? 'Se abrirá WhatsApp automáticamente'
                                : 'La llamada se realizará automáticamente'}
      </Text>
    </View>

                    {config?.mostrarDireccion && (
                        <View style={[styles.direccionContainer, { width: qrSize }]}>
                            <Text variant="titleLarge" style={styles.direccionLabel}>
                                {getDireccionCompleta()}
      </Text>
    </View>
                    )}

                    <TouchableOpacity 
                        style={[styles.footerContainer, {
                            borderColor: communicationType === COMMUNICATION_TYPES.WHATSAPP ? '#25D366' : '#1a73e8'
                        }]}
                        onPress={() => setPreviewVisible(true)}
                    >
                        <View style={styles.footerContent}>
                            <Text style={[styles.footerText, {
                                color: communicationType === COMMUNICATION_TYPES.WHATSAPP ? '#25D366' : '#1a73e8'
                            }]}>
                                Compartir QR
                            </Text>
                            <IconButton
                                icon="share-variant"
                                size={20}
                                iconColor={communicationType === COMMUNICATION_TYPES.WHATSAPP ? '#25D366' : '#1a73e8'}
                                style={styles.shareIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </Surface>
        );
    };

    if (!config) {
        return (
            <PaperProvider>
                <ScreenContainer>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                        <Surface style={styles.statusCard} elevation={4}>
                            <Text>Por favor, configure su QRing</Text>
                        </Surface>
                    </ScrollView>
  </ScreenContainer>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ScreenContainer>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Contenedor de Estado */}
                    <Surface 
                        style={[styles.statusCard, { borderRadius: 12 }]} 
                        elevation={4}
                    >
                        <Text style={styles.cardLabel}>Números</Text>
                        {/* Número Principal */}
                        <TextInput
                            mode="outlined"
                            label="Principal"
                            value={MOCK_DATA.numeroPrincipal}
                            editable={false}
                            left={<TextInput.Icon 
                                icon={MOCK_DATA.estadoPrincipal ? 'bell' : 'bell-off'}
                                color={MOCK_DATA.estadoPrincipal ? '#34a853' : '#ea4335'}
                            />}
                            style={styles.input}
                            contentStyle={styles.inputContent}
                            theme={{
                                roundness: 12,
                            }}
                        />

                        {/* Número Backup */}
                        <TextInput
                            mode="outlined"
                            label="Backup"
                            value={MOCK_DATA.numeroBackup}
                            editable={false}
                            left={<TextInput.Icon 
                                icon={MOCK_DATA.backupActivo ? 'phone-check' : 'phone-off'}
                                color={MOCK_DATA.backupActivo ? '#34a853' : '#ea4335'}
                            />}
                            style={[styles.input, styles.backupInput]}
                            outlineStyle={[
                                styles.backupOutline,
                                { borderColor: MOCK_DATA.backupActivo ? '#34a853' : '#ea4335' }
                            ]}
                            contentStyle={styles.inputContent}
                            theme={{
                                roundness: 12,
                            }}
                        />
                    </Surface>

                    {/* Últimas Llamadas */}
                    <Surface 
                        style={[styles.recentCallsCard, { borderRadius: 12 }]} 
                        elevation={4}
                    >
                        <Text style={styles.cardLabel}>Últimas Llamadas</Text>
                        <View style={styles.callsList}>
                            {MOCK_CALLS.map((call, index) => (
                                <View key={index} style={[
                                    styles.callItem,
                                    index === MOCK_CALLS.length - 1 && styles.lastCallItem
                                ]}>
                                    <IconButton
                                        icon={call.type === 'incoming' ? 'phone-incoming' : 'phone-outgoing'}
                                        size={18}
                                        iconColor={call.type === 'incoming' ? '#34a853' : '#1a73e8'}
                                        style={styles.callIcon}
                                    />
                                    <View style={styles.callInfo}>
                                        <Text style={styles.callNumber}>{call.number}</Text>
                                        <Text style={styles.callTime}>{call.time}</Text>
                                    </View>
                                    <Text style={styles.callDuration}>{call.duration}</Text>
                                </View>
                            ))}
                        </View>
                    </Surface>

                    {/* Etiqueta QR */}
                    <Surface 
                        style={[styles.qrCard, { borderRadius: 12 }]} 
                        elevation={4}
                    >
                        <LabelContent />
                    </Surface>
                </ScrollView>

                <Portal>
                    <Modal
                        visible={previewVisible}
                        onDismiss={() => setPreviewVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Text variant="titleLarge" style={styles.modalTitle}>
                            Compartir Etiqueta
                        </Text>
                        
                        <ViewShot
                            ref={labelRef}
                            style={styles.previewContainer}
                        >
                            <LabelContent isPreview={true} />
                        </ViewShot>

                        <View style={styles.modalActions}>
                            <Button 
                                mode="outlined" 
                                onPress={() => setPreviewVisible(false)}
                                style={styles.modalButton}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                mode="contained" 
                                onPress={saveToGallery}
                                style={styles.modalButton}
                            >
                                Guardar
                            </Button>
                            <Button 
                                mode="contained" 
                                onPress={captureAndShare}
                                style={styles.modalButton}
                            >
                                Compartir
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </ScreenContainer>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
        paddingBottom: 80,
        gap: 16,
    },
    statusCard: {
        padding: 12,
        paddingTop: 20,
        backgroundColor: 'white',
        gap: 8,
        position: 'relative',
        marginTop: 4,
    },
    input: {
        backgroundColor: 'white',
    },
    inputContent: {
        fontSize: 16,
        textAlign: 'right',
        paddingRight: 12,
    },
    backupInput: {
        marginTop: 4,
    },
    backupOutline: {
        borderStyle: 'dashed',
        borderWidth: 1,
    },
    recentCallsCard: {
        padding: 12,
        paddingTop: 20,
        backgroundColor: 'white',
        position: 'relative',
        marginTop: 4,
    },
    cardLabel: {
        position: 'absolute',
        top: -10,
        left: 0,
        right: 0,
        textAlign: 'center',
        backgroundColor: 'white',
        color: '#1a73e8',
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingHorizontal: 8,
        width: 'auto',
        marginHorizontal: 'auto',
        zIndex: 1,
    },
    callsList: {
        gap: 2,
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    lastCallItem: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    callIcon: {
        margin: 0,
        padding: 0,
        width: 28,
        height: 28,
    },
    callInfo: {
        flex: 1,
        marginLeft: 4,
    },
    callNumber: {
        fontSize: 13,
        color: '#202124',
        fontWeight: '500',
    },
    callTime: {
        fontSize: 11,
        color: '#5f6368',
    },
    callDuration: {
        fontSize: 11,
        color: '#5f6368',
        marginLeft: 8,
    },
    qrCard: {
        padding: 12,
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#1a73e8',
    },
    fabSpace: {
        height: 68,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
    marginBottom: 20,
        color: '#202124',
        textAlign: 'center',
    },
    previewContainer: {
        backgroundColor: 'white',
        padding: 16,
        width: '100%',
        alignItems: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
    },
    labelCard: {
        height: 'auto',
        borderRadius: 16,
        padding: 16,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    contentContainer: {
        paddingVertical: 8,
        alignItems: 'center',
        gap: 16,
  },
  title: {
        color: '#1a73e8',
        marginHorizontal: 12,
    fontWeight: 'bold',
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1a73e8',
        shadowColor: '#1a73e8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    direccionContainer: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    direccionLabel: {
        color: '#5f6368',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '500',
    },
    footerContainer: {
        borderWidth: 1,
        borderColor: '#1a73e8',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'white',
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    footerText: {
        fontWeight: 'bold',
    fontSize: 16,
        color: '#1a73e8',
    },
    shareIcon: {
        margin: 0,
        padding: 0,
    },
    qrInstructions: {
        marginTop: 8,
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 16,
        color: '#5f6368',
        fontWeight: '500',
  },
});