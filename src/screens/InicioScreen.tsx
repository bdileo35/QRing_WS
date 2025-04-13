import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform, Alert } from 'react-native';
import { Text, Surface, IconButton, Portal, Modal, Button, FAB } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useConfigStorage } from '../hooks/useConfigStorage';
import ScreenContainer from '../components/ScreenContainer';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

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
        const cleanNumber = config.whatsapp.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}`;
    };

    const formatWhatsAppNumber = (number: string) => {
        const cleanNumber = number.replace(/\D/g, '');
        if (cleanNumber.length === 12) { // 54 911 XXXXXXXX
            return `${cleanNumber.slice(0,2)} ${cleanNumber.slice(2,5)} ${cleanNumber.slice(5)}`;
        }
        return number;
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

    const LabelContent = ({ isPreview = false }) => (
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
                <IconButton
                    icon="bell"
                    size={32}
                    iconColor="#1a73e8"
                />
                <Text variant="displaySmall" style={styles.title}>TIMBRE</Text>
                <IconButton
                    icon="bell"
                    size={32}
                    iconColor="#1a73e8"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.qrContainer}>
                    <QRCode
                        value={getWhatsAppUrl()}
                        size={qrSize}
                        backgroundColor="white"
                        color="black"
                    />
                </View>

                {config?.mostrarDireccion && (
                    <View style={[styles.direccionContainer, { width: qrSize }]}>
                        <Text variant="titleLarge" style={styles.direccionLabel}>
                            {getDireccionCompleta()}
                        </Text>
                    </View>
                )}

                <View style={styles.footerContainer}>
                    <Text variant="titleMedium" style={styles.footerText}>
                        <Text style={styles.qrText}>QR</Text>
                        <Text style={styles.ingText}>ing</Text>
                        <Text style={styles.versionText}> 2.0</Text>
                    </Text>
                </View>
            </View>
        </Surface>
    );

    if (!config) {
        return (
            <ScreenContainer>
                <View style={styles.container}>
                    <Surface style={styles.statusCard} elevation={4}>
                        <Text>Por favor, configure su QRing</Text>
                    </Surface>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <View style={[styles.container, { minHeight: height }]}>
                <Text variant="headlineMedium" style={styles.mainTitle}>
                    Tu QRing!
                </Text>
                {/* Contenedor de Estado */}
                <Surface 
                    style={[
                        styles.statusCard,
                        { 
                            borderColor: isActive ? '#34a853' : '#ea4335',
                            backgroundColor: 'white'
                        }
                    ]} 
                    elevation={4}
                >
                    <View style={styles.statusLabel}>
                        <View style={[styles.statusDot, { backgroundColor: isActive ? '#34a853' : '#ea4335' }]} />
                        <Text 
                            variant="labelLarge" 
                            style={[styles.statusText, { color: isActive ? '#34a853' : '#ea4335' }]}
                        >
                            {isActive ? 'ACTIVADO' : 'DESACTIVADO'}
                        </Text>
                    </View>
                    <Text variant="displayMedium" style={styles.whatsappNumber}>
                        {formatWhatsAppNumber(config.whatsapp || 'No configurado')}
                    </Text>
                </Surface>

                {/* Etiqueta Normal */}
                <LabelContent />

                {/* Botón de Exportar */}
                <View style={styles.actionButtons}>
                    <Button
                        mode="contained"
                        onPress={() => setPreviewVisible(true)}
                        style={styles.actionButton}
                        labelStyle={styles.actionButtonLabel}
                        icon="share-variant"
                    >
                        Exportar Etiqueta
                    </Button>
                </View>

                {/* Mensaje Informativo */}
                <Surface style={styles.infoCard} elevation={1}>
                    <Text variant="bodyMedium" style={styles.infoText}>
                        💡 Después de imprimir tu etiqueta:
                    </Text>
                    <View style={styles.infoBullets}>
                        <Text variant="bodyMedium" style={styles.infoText}>
                            • Pégala cerca de tu puerta
                        </Text>
                        <Text variant="bodyMedium" style={styles.infoText}>
                            • Asegúrate que esté en un lugar visible y de fácil acceso
                        </Text>
                        <Text variant="bodyMedium" style={styles.infoText}>
                            • Protégela de la exposición directa al sol y la lluvia
                        </Text>
                    </View>
                </Surface>

                {/* Modal de Vista Previa */}
                <Portal>
                    <Modal
                        visible={previewVisible}
                        onDismiss={() => setPreviewVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Text variant="titleLarge" style={styles.modalTitle}>
                            Vista Previa de la Etiqueta
                        </Text>
                        
                        <ViewShot
                            ref={labelRef}
                            style={{
                                backgroundColor: 'white',
                                padding: 32,
                                width: '100%',
                                alignItems: 'center'
                            }}
                        >
                            <LabelContent isPreview={false} />
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
                                Guardar en Galería
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

                {/* FAB para exportar */}
                <FAB
                    icon="share-variant"
                    style={styles.fab}
                    onPress={() => setPreviewVisible(true)}
                    label="Compartir Etiqueta"
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        gap: 8,
    },
    mainTitle: {
        marginBottom: 8,
        color: '#1a73e8',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statusCard: {
        borderRadius: 12,
        padding: 12,
        paddingTop: 16,
        backgroundColor: 'white',
        borderWidth: 2,
        position: 'relative',
    },
    statusLabel: {
        position: 'absolute',
        top: -10,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 8,
        gap: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    whatsappNumber: {
        color: '#202124',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 48,
        paddingVertical: 4,
    },
    labelCard: {
        height: 'auto',
        borderRadius: 16,
        padding: 12,
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
        marginBottom: 4,
    },
    contentContainer: {
        paddingVertical: 4,
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
        marginVertical: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#2196F3',
        marginVertical: 8,
        textAlign: 'center',
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
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
    footerText: {
        fontSize: 16,
        color: '#2196F3',
        marginVertical: 8,
        textAlign: 'center',
    },
    qrText: {
        color: '#1a73e8',
    },
    ingText: {
        color: '#202124',
    },
    versionText: {
        color: '#5f6368',
    },
    actionButtons: {
        width: '100%',
        paddingHorizontal: 12,
        gap: 12,
        marginTop: 12,
    },
    actionButton: {
        width: '100%',
        borderRadius: 25,
        height: 48,
        backgroundColor: '#1a73e8',
    },
    actionButtonLabel: {
        fontSize: 16,
        fontWeight: '500',
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    infoCard: {
        marginHorizontal: 8,
        marginTop: 8,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#E8F0FE',
    },
    infoText: {
        color: '#1967D2',
        fontSize: 14,
        lineHeight: 20,
    },
    infoBullets: {
        marginTop: 4,
        gap: 4,
    },
}); 