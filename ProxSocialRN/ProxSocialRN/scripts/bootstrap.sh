#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${1:-ProxSocialRNApp}"

echo "1) Creando proyecto React Native: $APP_NAME"
npx react-native@latest init "$APP_NAME" --template react-native-template-typescript

echo "2) Copiando código (src + App.tsx + config) dentro de $APP_NAME"
cp -R ./src "$APP_NAME"/
cp ./App.tsx "$APP_NAME"/App.tsx
cp ./babel.config.js "$APP_NAME"/babel.config.js
cp ./metro.config.js "$APP_NAME"/metro.config.js

echo "3) NOTA: No sobrescribo package.json automáticamente."
echo "   Abre ./package.json y copia dependencias a $APP_NAME/package.json manualmente."
echo "   Luego ejecuta npm install (o yarn)."

echo "4) Copia también los módulos nativos:"
echo "   - iOS: ./ios/ProxBleAdvertiser.swift y ./ios/ProxBleAdvertiser.m"
echo "   - Android: ./android/app/src/main/java/.../ble/*"

echo "Hecho."
