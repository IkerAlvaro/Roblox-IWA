# Roblox IWA (ChromeOS)

Cliente **Isolated Web App** para abrir Roblox como aplicación instalada en Chrome / ChromeOS.

## Qué hace (y qué no)

- Empaqueta una shell IWA (`isolated-app://…`) con UI propia, icono y manifiesto.
- Carga `https://www.roblox.com` **dentro de la app**, no como pestaña normal.
- En ChromeOS, un IWA en modo desarrollo se instala desde `chrome://web-app-internals` y no depende de que el dominio esté en la lista de pestañas permitidas.

**No es un exploit.** Si el filtro es de red, DNS o política de administrador que corta `roblox.com`, esta app tampoco podrá conectar. No salta MDM, no firma políticas y no incluye malware.

## Requisitos en el Chromebook

1. Cuenta que pueda usar flags de Chrome (dispositivo no bloqueado por admin, o flags permitidas).
2. Activa:
   - `chrome://flags/#enable-isolated-web-apps` → Enabled
   - `chrome://flags/#enable-isolated-web-app-dev-mode` → Enabled
3. Reinicia Chrome.

## Instalar en modo desarrollo

1. En este repo: `npm start` (sirve en el puerto 4173).
2. Abre `chrome://web-app-internals`.
3. En **Install IWA via Dev Mode**, usa la URL del servidor (proxy de preview o `http://HOST:4173`).
4. Instala. El icono **Roblox IWA** aparece en el launcher de ChromeOS.

## Uso

- **Abrir Roblox** carga el home web.
- Pestañas: Inicio, Descubrir, Populares, Catálogo, Crear.
- Solo se permiten URLs `https://*.roblox.com`.

## Instalar el `.swbn` (directo)

El paquete firmado está en `dist/roblox-iwa.swbn`.

1. Copia el archivo al Chromebook (USB, Drive, Downloads).
2. Activa flags:
   - `chrome://flags/#enable-isolated-web-apps`
   - `chrome://flags/#enable-isolated-web-app-dev-mode` (hace falta para bundles de desarrollo)
3. Reinicia Chrome.
4. Abre `chrome://web-app-internals`.
5. **Install IWA from Signed Web Bundle** → elige `roblox-iwa.swbn`.

Web Bundle ID:

```
ukqtgrxisoes7sevadibkglghsku4q5t5iwgktf33fzqg4mdeigaaaic
```

Origen: `isolated-app://ukqtgrxisoes7sevadibkglghsku4q5t5iwgktf33fzqg4mdeigaaaic/`

Regenerar el bundle (hace falta `keys/iwa-ed25519.pem` local):

```bash
npm install
npm run bundle
```

La clave privada **no** va en el repositorio.

## Sobre “desbloqueo”

No hay bypass de filtros de ChromeOS, DNS, red ni políticas de administrador. Eso sería eludir controles de seguridad, no un IWA. Si `roblox.com` está cortado a nivel de red, el `.swbn` tampoco podrá cargarlo. Roblox además suele enviar `X-Frame-Options`, así que el iframe puede quedar en blanco aunque la red esté abierta.
