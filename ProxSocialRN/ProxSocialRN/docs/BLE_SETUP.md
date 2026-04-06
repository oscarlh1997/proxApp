# BLE Setup (React Native CLI)

## Android
1) `AndroidManifest.xml` (android/app/src/main/AndroidManifest.xml):
- Android 12+:
  - BLUETOOTH_SCAN
  - BLUETOOTH_CONNECT
  - BLUETOOTH_ADVERTISE
- Location (dependiendo de tu target/OS):
  - ACCESS_FINE_LOCATION

2) `react-native-permissions`:
- Añade en `android/app/src/main/AndroidManifest.xml` las permissions anteriores.
- Ejecuta clean/rebuild.

3) Advertising
- Este repo incluye `android/app/src/main/java/.../ProxBleAdvertiserModule.kt`
- Debes registrar el package en `MainApplication`.

## iOS
1) Info.plist:
- NSBluetoothAlwaysUsageDescription
- NSBluetoothPeripheralUsageDescription

2) Capabilities:
- Background Modes: **Uses Bluetooth LE accessories** (si quieres background; iOS limita)

3) Advertising
- Este repo incluye `ios/ProxBleAdvertiser.swift` + bridge Objective-C.
- Debes añadirlos al target Xcode y asegurarte de que el módulo exporta `ProxBleAdvertiser`.

## Escaneo
- Se hace con `react-native-ble-plx` filtrando por `SERVICE_UUID` (`src/ble/constants.ts`).
