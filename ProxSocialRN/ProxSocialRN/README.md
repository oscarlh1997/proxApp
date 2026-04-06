# ProxSocialRN (React Native + BLE real) – Código fuente

Este paquete es un **código base completo de la app** (TypeScript) + un **módulo nativo** (iOS/Android) para **advertising BLE** (peripheral),
y uso de **react-native-ble-plx** para escaneo BLE (central). Incluye UI estilo red social (feed, stories, posts con likes/saves/comentarios, mensajes, perfil)
y un radar de proximidad.

⚠️ Importante (privacidad y consentimiento):
- La app está diseñada para detectar **solo** a personas que **también** estén usando la app y hayan activado **“Visible”**.
- Lo que se anuncia por BLE es un **ID efímero** (RPI) que rota, **no** el nombre.
- El “ángulo” del radar es **cosmético** (salvo UWB, no implementado aquí).

## Cómo ponerlo a correr en tu ordenador

### 1) Crear un proyecto React Native CLI (base)
En tu terminal (con Node.js instalado):
```bash
npx react-native@latest init ProxSocialRNApp --template react-native-template-typescript
```

### 2) Copiar este código dentro del proyecto creado
Copia el contenido de este ZIP dentro de la raíz de `ProxSocialRNApp` (sobrescribiendo cuando pregunte):
- `src/`
- `App.tsx`
- `package.json` (**solo** para ver dependencias; integra cuidadosamente en el tuyo)
- `ios/ProxBleAdvertiser.swift` + `ios/ProxBleAdvertiser.m`
- `android/.../ProxBleAdvertiserModule.kt` + `ProxBleAdvertiserPackage.kt`

> Recomendación: en vez de sobrescribir `package.json`, copia las dependencias listadas en este `package.json` a tu proyecto.

### 3) Instalar dependencias
Dentro de `ProxSocialRNApp`:
```bash
npm install
# o yarn
```

### 4) iOS (Pods)
```bash
cd ios
pod install
cd ..
```

### 5) Ejecutar
```bash
npx react-native run-android
npx react-native run-ios
```

## BLE: cómo funciona en este MVP
- **Advertising (peripheral)**: módulo nativo `ProxBleAdvertiser` anuncia:
  - `SERVICE_UUID`: UUID fijo (para filtrar)
  - `manufacturerData`: bytes con RPI efímero (hex -> bytes)
- **Scanning (central)**: `react-native-ble-plx` escanea con filtro por `SERVICE_UUID` y lee `manufacturerData`/`serviceData`.
- Se calcula **distancia aproximada** por RSSI + suavizado EMA.
- En UI, se muestra “muy cerca / cerca / a la vista”.

## Ajustes importantes
- `src/ble/constants.ts`: UUID y parámetros de distancia
- `src/ble/bleService.ts`: pipeline de scan + parse + store
- `src/store/useFeedStore.ts`: posts, likes, saves, comentarios (persistente)
- `src/store/useProximityStore.ts`: usuarios cercanos

Fecha: 2026-01-22
