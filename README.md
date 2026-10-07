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

## Empaquetado de producción (Signed Web Bundle)

Para un `.swbn` firmado hace falta una clave de desarrollo IWA (`chrome://web-app-internals` → generate bundle). Este repo entrega el origen web listo para empaquetar; no incluye claves privadas.
