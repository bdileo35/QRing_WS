# ExpoBasico

Plantilla base para proyectos Expo con:
- Splash Screen
- Navegación por pestañas
- TypeScript
- Estructura organizada de archivos

## Características

- 🚀 Configuración inicial rápida
- 📱 Splash Screen personalizable
- 🔄 Navegación por pestañas (Inicio, Configuración, Ayuda)
- 📝 TypeScript para mejor desarrollo
- 📁 Estructura de archivos organizada

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/bdileo35/ExpoBasico.git mi-proyecto
cd mi-proyecto
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el proyecto:
```bash
npx expo start --clear
```

## Estructura del Proyecto

```
├── assets/
│   └── images/
│       ├── icon.png
│       ├── splash.png
│       ├── adaptive-icon.png
│       └── favicon.png
├── src/
│   ├── screens/
│   │   ├── InicioScreen.tsx
│   │   ├── ConfigScreen.tsx
│   │   └── AyudaScreen.tsx
│   └── navigation/
│       └── TabNavigator.tsx
├── App.tsx
├── app.json
└── tsconfig.json
```

## Uso como Template

1. Crea un nuevo proyecto:
```bash
npx create-expo-app mi-proyecto --template blank-typescript
cd mi-proyecto
```

2. Ejecuta el script de configuración:
```bash
.\setup.bat
```

## Personalización

- Modifica los assets en `assets/images/`
- Personaliza las pantallas en `src/screens/`
- Ajusta la navegación en `src/navigation/`

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

MIT
