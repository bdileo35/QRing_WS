# QRing

Sistema de timbre inteligente basado en códigos QR que permite la comunicación entre carteros/repartidores y residentes a través de WhatsApp.

## Características

- 🚀 Generación de códigos QR personalizados
- 📱 Integración con WhatsApp
- 🏠 Gestión de dirección y departamento
- 🖨️ Exportación de etiquetas para imprimir
- 🎨 Diseño moderno y responsivo
- 📝 Tutorial paso a paso
- 🔄 Historial de timbres

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/tu-usuario/QRing.git
cd QRing
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el proyecto:
```bash
npx expo start
```

## Estructura del Proyecto

```
├── assets/
│   ├── images/
│   │   ├── icon.png
│   │   └── splash.png
│   └── help/
│       ├── step1.png
│       ├── step2.png
│       └── step3.jpg
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── BottomNavigation.tsx
│   │   └── ScreenContainer.tsx
│   ├── screens/
│   │   ├── InicioScreen.tsx
│   │   ├── ConfigScreen.tsx
│   │   ├── AyudaScreen.tsx
│   │   └── HistorialScreen.tsx
│   ├── hooks/
│   │   └── useConfigStorage.ts
│   ├── types/
│   │   ├── config.ts
│   │   └── navigation.ts
│   └── navigation/
│       ├── InitialNavigator.tsx
│       └── TabNavigator.tsx
├── App.tsx
├── app.json
└── package.json
```

## Guía de Uso

1. **Configuración Inicial**
   - Ingresa tu número de WhatsApp
   - Configura tu dirección
   - Opcional: Oculta la dirección en la etiqueta

2. **Generación de Etiqueta**
   - La etiqueta se genera automáticamente
   - Incluye código QR y dirección (opcional)
   - Exporta o comparte la etiqueta

3. **Instalación**
   - Imprime la etiqueta
   - Colócala en un lugar visible cerca de tu timbre

4. **Funcionamiento**
   - El cartero/repartidor escanea el código QR
   - Se abre WhatsApp con tu número preconfigurado
   - Recibes una notificación y puedes coordinar la entrega

## Tecnologías Utilizadas

- React Native con Expo
- React Navigation
- React Native Paper
- AsyncStorage para persistencia
- Expo Sharing y Media Library
- React Native QR Code SVG

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

MIT
