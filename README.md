# QRing 2.0

Sistema de timbre inteligente basado en códigos QR que permite la comunicación entre carteros/repartidores y residentes a través de WhatsApp.

## Características

- 🚀 Generación de códigos QR personalizados
- 📱 Integración con WhatsApp
- 🏠 Gestión de dirección y departamento
- 🖨️ Exportación y guardado de etiquetas
- 🎨 Diseño moderno y responsivo
- 🔄 Configuración flexible
- 🎯 Previsualización de etiquetas
- 🔒 Opción de ocultar dirección
- 📋 Formato de número internacional
- 🔄 Botón de reset con confirmación

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/bdileo35/QRing_WS.git
cd QRing_WS
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
│   │   └── icon.png
│   └── help/
│       ├── step1.png
│       ├── step2.png
│       └── step3.png
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── ScreenContainer.tsx
│   │   └── CustomSplash.tsx
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
│       ├── RootNavigator.tsx
│       ├── MainNavigator.tsx
│       └── InitialNavigator.tsx
├── App.tsx
├── app.json
└── package.json
```

## Guía de Uso

1. **Configuración Inicial**
   - Ingresa tu número de WhatsApp en formato internacional (+54 911 XXXX-XXXX)
   - Configura tu dirección (calle, altura y departamento)
   - Opcional: Oculta la dirección en la etiqueta
   - Usa el botón de reset para borrar toda la configuración

2. **Generación de Etiqueta**
   - La etiqueta se genera automáticamente
   - Incluye código QR y dirección (si está habilitada)
   - Previsualiza antes de exportar
   - Guarda en la galería o comparte directamente

3. **Instalación**
   - Imprime la etiqueta
   - Colócala en un lugar visible cerca de tu puerta

4. **Funcionamiento**
   - El cartero/repartidor escanea el código QR
   - Se abre WhatsApp con tu número preconfigurado
   - Recibes una notificación y puedes coordinar la entrega

## Tecnologías Utilizadas

- React Native con Expo SDK 52
- React Navigation 6
- React Native Paper
- AsyncStorage para persistencia
- Expo Sharing y Media Library
- React Native QR Code SVG
- Linear Gradient para efectos visuales

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

MIT
