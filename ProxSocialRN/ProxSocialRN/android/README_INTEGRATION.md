# Android – Integración del módulo nativo

1) Copia estos archivos a tu proyecto React Native:
- `android/app/src/main/java/com/proxsocial/ble/ProxBleAdvertiserModule.kt`
- `android/app/src/main/java/com/proxsocial/ble/ProxBleAdvertiserPackage.kt`

2) Registra el package en `MainApplication.java` / `MainApplication.kt`:
- Añade `new ProxBleAdvertiserPackage()` en la lista de packages.

3) Permisos:
- Android 12+:
  - BLUETOOTH_SCAN, BLUETOOTH_CONNECT, BLUETOOTH_ADVERTISE
- (y FINE_LOCATION según tu configuración)

4) Rebuild:
- `cd android && ./gradlew clean && cd ..`
