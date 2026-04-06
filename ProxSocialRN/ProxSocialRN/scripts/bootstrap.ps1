param(
  [string]$AppName = "ProxSocialRNApp"
)

Write-Host "1) Creando proyecto React Native: $AppName"
npx react-native@latest init $AppName --template react-native-template-typescript

Write-Host "2) Copiando código (src + App.tsx + config) dentro de $AppName"
Copy-Item -Recurse -Force .\src (Join-Path $AppName "src")
Copy-Item -Force .\App.tsx (Join-Path $AppName "App.tsx")
Copy-Item -Force .\babel.config.js (Join-Path $AppName "babel.config.js")
Copy-Item -Force .\metro.config.js (Join-Path $AppName "metro.config.js")

Write-Host "3) NOTA: No sobrescribo package.json automáticamente."
Write-Host "   Abre ./package.json y copia dependencias a $AppName/package.json manualmente."
Write-Host "   Luego ejecuta npm install (o yarn)."

Write-Host "4) Copia también los módulos nativos:"
Write-Host "   - iOS: ./ios/ProxBleAdvertiser.swift y ./ios/ProxBleAdvertiser.m"
Write-Host "   - Android: ./android/app/src/main/java/.../ble/*"

Write-Host "Hecho."
