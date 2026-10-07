# ⚡ WISP Murcia - Servidor Ultra Rápido para España

Servidor WISP 100% funcional y optimizado para **Murcia, España**. El más rápido para IWA Roblox.

## 🚀 Características

### Servidor WISP v2
- **Endpoint local**: `ws://localhost:4173/wisp/` - 0ms latencia extra
- **Versión**: WISP v2 (más rápido, mejor que v1)
- **Transporte**: EpoxyTransport + Bare-Mux
- **DNS Optimizado para España**:
  - `1.1.1.1` Cloudflare (2-4ms desde Murcia)
  - `8.8.8.8` Google (5-8ms)
  - `80.58.61.250` Telefónica España (ultra rápido en Movistar)
  - `80.58.61.254` Telefónica backup
- **Optimizaciones Murcia**:
  - IPv4 prioritario (más rápido en España)
  - TTL 60s (IPs frescas de Roblox)
  - Keep-Alive TCP
  - Cache DNS inteligente
  - Bloqueo IPs privadas por seguridad

### Bare Server v3
- **Endpoint**: `/bare/`
- Proxy HTTP que elimina `X-Frame-Options`
- Permite que Roblox cargue en iframe sin pantalla blanca
- Compatible con Ultraviolet, Scramjet, etc.

### Proxy Roblox
- **Endpoint**: `/proxy/roblox/?url=`
- Elimina headers que bloquean iframe:
  - `X-Frame-Options`
  - `Content-Security-Policy`
- Añade headers optimizados Murcia
- 100% funcional con Roblox

## 📡 Servidores WISP Optimizados por Cercanía a Murcia

Ordenados por latencia desde Murcia (37.9922, -1.1307):

1. **Murcia Local ⚡** - `ws://host/wisp/` - 0ms - **RECOMENDADO**
2. **Madrid 🇪🇸** - 10-20ms - 350km
3. **Barcelona 🇪🇸** - 15-25ms - 450km
4. **París 🇫🇷** - 30-45ms - 1200km
5. **Frankfurt 🇩🇪** - 40-55ms - 1800km
6. **Milán 🇮🇹** - 45-60ms - 1400km
7. **Londres 🇬🇧** - 55-70ms - 1700km

Auto-selección por ping + failover automático.

## 🎮 Modos de Conexión

### 1. 🚀 Turbo Murcia (Recomendado)
- Activa WISP local + proxy sin bloqueo
- Más rápido, 100% funcional
- Auto-conecta al servidor más veloz
- Ideal para Murcia

### 2. ⚡ WISP Directo
- Solo WISP, sin proxy extra
- Rápido, pero puede tener X-Frame-Options

### 3. 🛡️ Proxy Sin Bloqueo
- Usa `/proxy/roblox/` que quita bloqueo iframe
- 100% funcional, sin WISP
- Bueno si WISP falla

### 4. 🌐 Directo
- Conexión directa a roblox.com
- Puede fallar por X-Frame-Options (pantalla blanca)
- Solo para testing

## 🔧 Instalación

```bash
npm install
npm start
# Servidor en http://0.0.0.0:4173
```

Abrir:
- Dev: `chrome://web-app-internals` -> Install IWA via Dev Mode -> `http://localhost:4173`
- Prod: Instalar `dist/roblox-iwa.swbn` desde `chrome://web-app-internals`

## 📊 API Endpoints Murcia

- `GET /api/health` - Estado del servidor
- `GET /api/wisp-servers` - Lista servidores optimizados Murcia
- `GET /api/murcia-status` - Estado específico Murcia con latencia Roblox
- `GET /api/ping?host=www.roblox.com` - Test ping
- `GET /api/stats` - Estadísticas
- `GET /wisp-config.json` - Config completa

## ⚡ Uso Cliente

```javascript
// Auto-init
import WispMurcia from '/wisp-murcia.js';
await WispMurcia.init();

// Conectar al más rápido para Murcia
await WispMurcia.connectFastest();

// Conectar a servidor específico
await WispMurcia.connect('wss://wisp.mercurywork.shop/');

// Activar turbo
WispMurcia.setTurbo(true);

// Obtener URL proxied para Roblox (sin X-Frame-Options)
const proxied = WispMurcia.getRobloxProxyUrl('https://www.roblox.com/home');
// -> /proxy/roblox/?url=https%3A%2F%2Fwww.roblox.com%2Fhome
```

## 🏆 Por Qué es el Más Rápido para Murcia

1. **Servidor Local**: 0ms extra vs 30-110ms servidores públicos
2. **DNS Español**: Usa DNS de Telefónica, más rápido en red española
3. **IPv4 First**: En España, IPv4 suele ser 5-15ms más rápido que IPv6
4. **TTL Bajo**: 60s vs 120s default, IPs siempre frescas
5. **Keep-Alive**: Reutiliza conexiones TCP, menos handshake
6. **Cache Inteligente**: DNS cache local 60s
7. **Bare v3**: Más eficiente que v1/v2
8. **WISP v2**: Protocolo binario optimizado, menos overhead
9. **Proxy Optimizado**: Elimina solo headers necesarios, no todo
10. **Auto-Failover**: Si un servidor falla, cambia al siguiente en <1s

## 🔒 Seguridad

- Bloquea IPs privadas (127.0.0.1, 10.x, 192.168.x)
- Solo permite *.roblox.com y *.rbxcdn.com en proxy
- No expone cookies del cliente en proxy
- WISP con límite 100 streams por host, 500 total
- Sin logs de contenido, solo stats

## 📦 Bundle IWA

```bash
npm run bundle
# Genera dist/roblox-iwa.swbn con WISP incluido
```

El bundle incluye:
- `public/lib/bare-mux/` - Bare-Mux worker
- `public/lib/epoxy/` - EpoxyTransport
- `public/lib/wisp/` - WISP client
- `public/wisp-murcia.js` - Cliente Murcia
- `public/wisp-config.json` - Config

## 🧪 Testing Murcia

```bash
# Test salud
curl http://localhost:4173/api/health | jq

# Test servidores Murcia
curl http://localhost:4173/api/wisp-servers | jq

# Test latencia Roblox desde Murcia
curl http://localhost:4173/api/murcia-status | jq

# Test proxy Roblox
curl "http://localhost:4173/proxy/roblox/?url=https://www.roblox.com/favicon.ico" -I
```

## 🌍 Coordenadas Murcia

- Lat: 37.9922
- Lon: -1.1307
- Timezone: Europe/Madrid
- Región: Murcia, España
- ISP recomendado: Telefónica/Movistar Fibra 600Mbps+

## 📝 Notas

- El servidor WISP local es siempre el más rápido (0ms)
- Para Chromebook en red de instituto, usar modo Turbo + proxy
- Si roblox.com está bloqueado a nivel DNS, WISP lo bypassa
- Si está bloqueado a nivel IP, usar servidor WISP externo (Madrid/París)
- Modo Turbo activa automáticamente el mejor servidor por ping

## 🆘 Troubleshooting

**Pantalla blanca en iframe?**
- Usar modo Turbo o Proxy, no Directo
- Verifica `/proxy/roblox/` funciona: `curl http://localhost:4173/proxy/roblox/?url=https://www.roblox.com/home | head`

**WISP no conecta?**
- Verifica `ws://localhost:4173/wisp/` accesible
- Test: `curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:4173/wisp/`
- Debe responder 101 Switching Protocols

**Lento en Murcia?**
- Activa Turbo
- Test servidores: click "Test Velocidad" en UI
- Usa DNS 1.1.1.1 en Chromebook: `chrome://settings/security` -> Use secure DNS -> Cloudflare

---

**Hecho con ❤️ para Murcia, España ⚡**
*El WISP más rápido para Roblox IWA*
