# iOS – Integración del módulo nativo

1) Añade `ProxBleAdvertiser.swift` y `ProxBleAdvertiser.m` al target iOS en Xcode.

2) Activa Swift bridging si es necesario.

3) Info.plist:
- NSBluetoothAlwaysUsageDescription
- NSBluetoothPeripheralUsageDescription

4) Capabilities:
- Background Modes (opcional): Uses Bluetooth LE accessories

5) Pod install:
- `cd ios && pod install && cd ..`
