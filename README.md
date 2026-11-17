# ProxSocial

Red social por proximidad: ves quién está a menos de 500 m, sus intereses, su situación sentimental y sus otras redes.

- `backend/`: NestJS + PostgreSQL/PostGIS + Redis + WebSockets
- raíz: app Expo SDK 54 (Android, iOS y web)

## Probar en local (Windows)

Necesitas Node 20+, Docker Desktop y Expo Go en el móvil (versión para SDK 54).

### 1. Backend (terminal 1)

```bash
cd backend
docker compose down -v      # solo la primera vez: borra la base de datos antigua (su esquema ha cambiado)
docker compose up -d        # Postgres+PostGIS y Redis
npm install
npm run start:dev           # espera a "ProxSocial API running on http://localhost:3001"
```

Comprobación opcional (en otra terminal, con el backend arrancado):

```bash
cd backend
npm run test:smoke          # debe terminar con "OK: todas las comprobaciones pasaron"
```

### 2. App (terminal 2)

```bash
npm install
npx expo start -c
```

Escanea el QR con Expo Go. **No hace falta tocar ninguna IP**: la app usa la misma máquina que sirve Expo. El móvil y el PC deben estar en la misma Wi-Fi, y Windows debe permitir conexiones entrantes al puerto 3001 (la primera vez el firewall pregunta: acepta en redes privadas).

Pulsa `w` en esa terminal para abrirla también en el navegador.

### 3. Recorrido de prueba

1. En el login pulsa **Entrar con datos de prueba**: crea 6 usuarios y entras como Ana.
2. Acepta el permiso de ubicación. Como los usuarios de prueba están en el centro de Madrid, en el radar pulsa **Traer usuarios de prueba aquí**: se colocan a tu alrededor.
3. Toca a alguien en el radar o en la lista: verás su perfil y sus redes. Pulsa **Escribir** o **Conectar**.
4. Para hablar entre dos usuarios: en el navegador (tecla `w`) entra como `luis@test.com` / `test123` y en el móvil como Ana. Los mensajes llegan al instante.

Cuentas: `ana`, `luis`, `mar`, `pablo`, `sara`, `ivan` @test.com, contraseña `test123`.

## Problemas frecuentes

| Síntoma | Solución |
|---|---|
| "No se puede conectar con http://…:3001" | Backend parado, otra Wi-Fi o firewall de Windows bloqueando el puerto 3001 |
| El backend falla al arrancar tras actualizar | `docker compose down -v` y `docker compose up -d` |
| Backend en otra máquina | Crea `.env` en la raíz de la app con `EXPO_PUBLIC_API_URL=http://IP:3001` |
| Expo pide otra versión de Expo Go | Instala Expo Go para SDK 54 |

## API

Swagger en http://localhost:3001/docs.
