import { NavigatorScreenParams } from '@react-navigation/native';

export type MainStackParamList = {
    Inicio: undefined;
    Config: undefined;
    Ayuda: undefined;
    Historial: undefined;
};

export type RootStackParamList = {
    Splash: undefined;
    Main: NavigatorScreenParams<MainStackParamList>;
    Inicio: undefined;
    Config: undefined;
    Ayuda: undefined;
    Historial: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
} 