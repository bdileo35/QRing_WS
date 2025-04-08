@echo off
echo Creando proyecto Expo...

:: Crear el proyecto
npx create-expo-app . --template blank-typescript

:: Instalar dependencias necesarias
npm install @react-navigation/native @react-navigation/bottom-tabs expo-splash-screen react-native-screens react-native-safe-area-context

:: Crear estructura de directorios
mkdir src
mkdir src\screens
mkdir src\navigation
mkdir assets\images

:: Copiar archivos de assets (asumiendo que existen en una carpeta template)
xcopy /E /I template\assets\* assets\
xcopy /E /I template\src\* src\

:: Limpiar caché y node_modules
rmdir /S /Q node_modules
del package-lock.json

:: Reinstalar dependencias
npm install

echo Proyecto creado exitosamente!
echo Para iniciar el proyecto, ejecuta: npx expo start --clear 