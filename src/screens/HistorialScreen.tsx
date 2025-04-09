import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, IconButton, Divider } from 'react-native-paper';
import ScreenContainer from '../components/ScreenContainer';

type HistorialItem = {
    id: string;
    fecha: string;
    hora: string;
    estado: 'atendido' | 'no_atendido';
};

const mockData: HistorialItem[] = [
    { id: '1', fecha: '08/04/2024', hora: '14:30', estado: 'atendido' },
    { id: '2', fecha: '08/04/2024', hora: '16:45', estado: 'no_atendido' },
];

export default function HistorialScreen() {
    const renderItem = ({ item }: { item: HistorialItem }) => (
        <Surface style={styles.itemCard} elevation={2}>
            <View style={styles.itemHeader}>
                <IconButton
                    icon={item.estado === 'atendido' ? 'check-circle' : 'close-circle'}
                    size={24}
                    iconColor={item.estado === 'atendido' ? '#34a853' : '#ea4335'}
                />
                <View style={styles.itemInfo}>
                    <Text variant="titleMedium">
                        {item.estado === 'atendido' ? 'Atendido' : 'No Atendido'}
                    </Text>
                    <Text variant="bodyMedium" style={styles.itemDate}>
                        {item.fecha} - {item.hora}
                    </Text>
                </View>
            </View>
        </Surface>
    );

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Historial de Timbres
                    </Text>
                </View>
                <FlatList
                    data={mockData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        color: '#1a73e8',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 16,
    },
    itemCard: {
        borderRadius: 12,
        backgroundColor: 'white',
        padding: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 8,
    },
    itemDate: {
        color: '#5f6368',
        marginTop: 4,
    },
    separator: {
        height: 12,
    },
}); 