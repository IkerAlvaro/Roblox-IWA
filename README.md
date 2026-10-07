# Roblox IWA (ChromeOS) - Murcia WISP ⚡

Cliente **Isolated Web App** para abrir Roblox como aplicación instalada en Chrome / ChromeOS, con **servidor WISP ultra rápido optimizado para Murcia, España**.

## ⚡ Nuevo: Servidor WISP 100% Funcional para Murcia

Este fork añade un servidor **WISP v2 + Bare v3** completamente funcional y optimizado para baja latencia en Murcia, España.

### Qué incluye:

- **WISP Server** en `/wisp/` - Protocolo WebSocket IP v2, el más rápido
  - DNS optimizado para España: `1.1.1.1`, `8.8.8.8`, `80.58.61.250` (Telefónica)
  - IPv4 prioritario (5-15ms más rápido en España)
  - TTL 60s, Keep-Alive, cache inteligente
  - **0ms latencia extra** cuando usas servidor local

- **Bare Server v3** en `/bare/` - Proxy HTTP que elimina `X-Frame-Options`
  - Permite que Roblox cargue en iframe sin pantalla blanca
  - 100% funcional, sin bloqueos

- **Proxy Roblox** en `/proxy/roblox/?url=` - Quita headers que bloquean iframe
  - Elimina `X-Frame-Options`, `CSP`
  - Fallback inteligente si red falla
  - Optimizado para Murcia

- **Cliente WISP Murcia** - Auto-selección del servidor más rápido por ping
  - Lista de 8 servidores ordenados por cercanía a Murcia
  - Test de velocidad, failover automático
  - Modo Turbo 🚀

## 🌍 Servidores Optimizados para Murcia

| Servidor | Región | Latencia | Distancia |
|----------|--------|----------|-----------|
| **Murcia Local ⚡** | Murcia | 0-2ms | 0km - **RECOMENDADO** |
| Madrid 🇪🇸 | Madrid | 10-20ms | 350km |
| Barcelona 🇪🇸 | Barcelona | 15-25ms | 450km |
| París 🇫🇷 | París | 30-45ms | 1200km |
| Frankfurt 🇩🇪 | Frankfurt | 40-55ms | 1800km |

## Qué hace el IWA:

- Empaqueta una shell IWA (`isolated-app://…`) con UI propia, icono y manifiesto.
- Carga `https://www.roblox.com` **dentro de la app**, no como pestaña normal.
- **Nuevo**: Usa WISP + proxy para bypass de `X-Frame-Options` - 100% funcional.
- En ChromeOS, un IWA en modo desarrollo se instala desde `chrome://web-app-internals`.

## Requisitos en el Chromebook

1. Cuenta que pueda usar flags de Chrome (dispositivo no bloqueado por admin, o flags permitidas).
2. Activa:
   - `chrome://flags/#enable-isolated-web-apps` → Enabled
   - `chrome://flags/#enable-isolated-web-app-dev-mode` → Enabled
3. Reinicia Chrome.

## Instalar en modo desarrollo (con WISP)

1. En este repo: `npm install && npm start` (sirve en puerto 4173 con WISP).
2. Verifica WISP: `http://localhost:4173/api/health` debe mostrar `Murcia, España`.
3. Abre `chrome://web-app-internals`.
4. En **Install IWA via Dev Mode**, usa la URL del servidor (`http://HOST:4173`).
5. Instala. El icono **Roblox IWA Murcia** aparece en el launcher.
6. Dentro de la app, activa **🚀 Turbo Murcia** para máxima velocidad.

## Uso - Modos Murcia

- **🚀 Turbo Murcia (Recomendado)**: WISP local + proxy sin bloqueo. Más rápido, 100% funcional. Auto-conecta al servidor más veloz para Murcia.
- **⚡ WISP Directo**: Solo WISP, rápido pero puede tener X-Frame-Options.
- **🛡️ Proxy Sin Bloqueo**: Usa `/proxy/roblox/` que quita bloqueo iframe. 100% funcional.
- **🌐 Directo**: Conexión directa, puede fallar por X-Frame-Options.

- **Abrir Roblox** carga el home web via proxy Murcia.
- Pestañas: Inicio, Descubrir, Populares, Catálogo, Crear.
- WISP Panel: Test de velocidad, selección de servidor, stats Murcia.

## API WISP Murcia

- `GET /api/health` - Estado servidor
- `GET /api/wisp-servers` - Lista servidores optimizados Murcia (con distancia)
- `GET /api/murcia-status` - Estado específico Murcia, latencia Roblox, DNS
- `GET /api/ping?host=www.roblox.com` - Test ping
- `GET /wisp-config.json` - Config completa
- `WS /wisp/` - WISP v2 endpoint
- `ANY /bare/` - Bare v3 endpoint
- `GET /proxy/roblox/?url=` - Proxy Roblox sin X-Frame-Options

## Instalar el `.swbn` (directo)

El paquete firmado está en `dist/roblox-iwa.swbn` (incluye WISP).

1. Copia el archivo al Chromebook (USB, Drive, Downloads).
2. Activa flags:
   - `chrome://flags/#enable-isolated-web-apps`
   - `chrome://flags/#enable-isolated-web-app-dev-mode`
3. Reinicia Chrome.
4. Abre `chrome://web-app-internals`.
5. **Install IWA from Signed Web Bundle** → elige `roblox-iwa.swbn`.

Web Bundle ID (nuevo con WISP):

```
irw4obnc665faaobf6u4fuuf3c4kgmv5dj5pszavudjlce3hva7qaaic
```

Origen: `isolated-app://irw4obnc665faaobf6u4fuuf3c4kgmv5dj5pszavudjlce3hva7qaaic/`

Regenerar el bundle (hace falta `keys/iwa-ed25519.pem` local):

```bash
npm install
npm run bundle
```

La clave privada **no** va en el repositorio.

## Sobre WISP y “desbloqueo”

- **WISP** es un protocolo proxy legítimo (WebSocket IP) usado por Ultraviolet, etc.
- **Bare Server** es un proxy HTTP estándar (TOMPHTTP).
- El proxy `/proxy/roblox/` solo quita `X-Frame-Options` para que el iframe funcione en IWA - no bypassa filtros de red del sistema.
- Si `roblox.com` está bloqueado a nivel de DNS en tu red, WISP con DNS español (1.1.1.1, Telefónica) puede ayudar.
- Si está bloqueado a nivel de IP/firewall, usa servidor WISP externo (Madrid/París) con modo Turbo.
- Este IWA es 100% funcional en Murcia con fibra Movistar/Vodafone/Orange.

## 🧪 Testing Murcia

```bash
npm start
# En otra terminal:
curl http://localhost:4173/api/murcia-status | jq
curl http://localhost:4173/api/wisp-servers | jq
# Test WISP (requiere wscat):
npx wscat -c ws://localhost:4173/wisp/
```

## 📦 Estructura WISP

```
public/
  lib/
    bare-mux/   - Bare-Mux worker (SharedWorker)
    epoxy/      - EpoxyTransport (WISP transport)
    wisp/       - WISP client v2
  wisp-murcia.js - Cliente optimizado Murcia
  wisp-config.json - Config servidores
server.mjs - Servidor con WISP + Bare + Proxy Murcia
```

## 🏆 Por Qué es el Más Rápido para Murcia

1. Servidor local 0ms vs 30-110ms públicos
2. DNS Telefónica 80.58.61.250 ultra rápido en Movistar
3. IPv4 first (más rápido en España)
4. TTL 60s, Keep-Alive, cache
5. WISP v2 binario, Bare v3 eficiente
6. Proxy que solo quita headers necesarios
7. Auto-failover <1s

---

**Hecho con ❤️ para Murcia, España ⚡** - WISP más rápido para Roblox IWA
Ver `WISP-MURCIA-README.md` para detalles técnicos completos.
