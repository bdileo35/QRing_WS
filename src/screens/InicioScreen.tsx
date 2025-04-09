import React, { useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Text, Surface, IconButton, Portal, Modal, Button, FAB } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useConfigStorage } from '../hooks/useConfigStorage';
import ScreenContainer from '../components/ScreenContainer';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function InicioScreen() {
    const { config } = useConfigStorage();
    const { width, height } = useWindowDimensions();
    const qrSize = Math.min(width * 0.45, 200);
    const isActive = true; // TODO: Implementar lógica de estado
    const [previewVisible, setPreviewVisible] = useState(false);
    const labelRef = useRef<ViewShot>(null);

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
            if (!labelRef.current) return;
            
            // Capturar solo el contenido de la etiqueta
            const uri = await captureRef(labelRef, {
                format: 'png',
                quality: 0.9,
                result: 'tmpfile',
                width: 600,
                height: 800
            });
            
            // Verificamos si podemos compartir
            if (!(await Sharing.isAvailableAsync())) {
                alert('Lo siento, compartir no está disponible en este dispositivo');
                return;
            }

            // Compartir la imagen
            await Sharing.shareAsync(uri);

            // Cerrar el modal después de compartir
            setPreviewVisible(false);

        } catch (error) {
            console.error('Error específico:', error);
            alert('Error al capturar la imagen. Asegúrese de tener suficiente espacio en el dispositivo.');
        }
    };

    const LabelContent = () => (
        <Surface style={styles.labelCard} elevation={4}>
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
                    />
                </View>

                <View style={[styles.direccionContainer, { width: qrSize }]}>
                    <Text variant="titleLarge" style={styles.direccionLabel}>
                        {getDireccionCompleta()}
                    </Text>
                </View>

                <Text variant="titleMedium" style={styles.footerText}>QRing 2.0</Text>
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
                        {config.whatsapp || 'No configurado'}
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
                            style={styles.previewContainer}
                        >
                            <Surface style={[styles.labelCard, {
                                elevation: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                                margin: 16
                            }]}>
                                <LabelContent />
                            </Surface>
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
                                onPress={captureAndShare}
                                style={styles.modalButton}
                            >
                                Exportar
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        gap: 12,
    },
    statusCard: {
        borderRadius: 12,
        padding: 16,
        paddingTop: 24,
        backgroundColor: 'white',
        borderWidth: 2,
        position: 'relative',
    },
    statusLabel: {
        position: 'absolute',
        top: -12,
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
        paddingVertical: 8,
    },
    labelCard: {
        height: 'auto',
        borderRadius: 16,
        padding: 16,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    contentContainer: {
        paddingVertical: 16,
        alignItems: 'center',
        gap: 20,
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
        borderColor: '#e0e0e0',
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
    footerText: {
        color: '#5f6368',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 'auto',
        paddingBottom: 8,
    },
    actionButtons: {
        width: '100%',
        paddingHorizontal: 16,
        gap: 12,
        marginTop: 16,
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
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        minWidth: 120,
    },
}); 