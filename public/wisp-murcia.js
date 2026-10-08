/**
 * WISP Murcia - Cliente optimizado para España
 * 100% funcional, más rápido para Murcia
 * 
 * Características:
 * - Auto-selección del servidor más rápido por ping
 * - Optimizado para latencia baja en Murcia
 * - Fallback automático
 * - Modo Turbo
 * - Integración Bare-Mux + Epoxy
 */

class WispMurcia {
  constructor() {
    this.servers = [];
    this.currentServer = null;
    this.connection = null;
    this.bareMux = null;
    this.isConnected = false;
    this.isTurbo = localStorage.getItem('murcia-turbo') === 'true';
    this.latencies = new Map();
    this.stats = {
      connected: false,
      server: null,
      latency: -1,
      region: 'Murcia, España',
      mode: 'direct'
    };
    this.listeners = [];
    
    // Servidores por defecto - se actualizarán desde /api/wisp-servers
    this.defaultServers = [
      { id: 'local', name: 'Murcia Local ⚡', url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/wisp/`, priority: 0, country: 'ES' },
      { id: 'madrid', name: 'Madrid 🇪🇸', url: 'wss://wisp.mercurywork.shop/', priority: 1, country: 'ES' },
      { id: 'eu', name: 'EU Auto', url: 'wss://wisp.nightnetwork.cloud/', priority: 2, country: 'EU' }
    ];
  }

  async init() {
    console.log('[WISP Murcia] Inicializando para Murcia, España ⚡');
    
    // Cargar servidores desde API
    try {
      const res = await fetch('/api/wisp-servers');
      if (res.ok) {
        const data = await res.json();
        this.servers = data.servers;
        console.log(`[WISP Murcia] ${this.servers.length} servidores cargados`);
      } else {
        throw new Error('API no disponible');
      }
    } catch (e) {
      console.warn('[WISP Murcia] Usando servidores por defecto:', e.message);
      this.servers = this.defaultServers;
    }

    // Inicializar Bare-Mux si está disponible
    await this.initBareMux();

    // Auto-conectar al más rápido si turbo está activo
    if (this.isTurbo) {
      setTimeout(() => this.connectFastest(), 1000);
    }

    this.notifyListeners();
    return this.servers;
  }

  async initBareMux() {
    try {
      // Intentar cargar bare-mux
      if (typeof BareMuxConnection !== 'undefined') {
        this.bareMux = new BareMuxConnection('/lib/bare-mux/worker.js');
        console.log('[WISP Murcia] Bare-Mux inicializado');
      }
    } catch (e) {
      console.warn('[WISP Murcia] Bare-Mux no disponible:', e.message);
    }
  }

  async pingServer(serverUrl, timeout = 3000) {
    return new Promise((resolve) => {
      const start = performance.now();
      let ws;
      let done = false;

      const finish = (latency) => {
        if (done) return;
        done = true;
        try { ws && ws.close(); } catch {}
        resolve(latency);
      };

      try {
        ws = new WebSocket(serverUrl);
        ws.onopen = () => {
          const latency = Math.round(performance.now() - start);
          this.latencies.set(serverUrl, latency);
          finish(latency);
        };
        ws.onerror = () => finish(-1);
        ws.onclose = () => {
          if (!done) finish(-1);
        };
        
        setTimeout(() => finish(-1), timeout);
      } catch (e) {
        finish(-1);
      }
    });
  }

  async testAllServers() {
    console.log('[WISP Murcia] Testeando latencia de servidores desde Murcia...');
    const results = [];
    
    // Testear solo los primeros 5 para rapidez
    const toTest = this.servers.slice(0, 6);
    
    for (const server of toTest) {
      const latency = await this.pingServer(server.url, 2500);
      results.push({
        ...server,
        latency,
        online: latency !== -1,
        tested: true
      });
      console.log(`[WISP Murcia] ${server.name}: ${latency === -1 ? 'offline' : latency + 'ms'}`);
      
      // Actualizar UI si existe
      this.updateServerUI(server.id, latency);
    }

    // Ordenar por latencia
    const sorted = results
      .filter(r => r.online)
      .sort((a, b) => a.latency - b.latency);

    return sorted.length > 0 ? sorted : results;
  }

  updateServerUI(serverId, latency) {
    const el = document.getElementById(`ping-${serverId}`);
    if (el) {
      if (latency === -1) {
        el.textContent = '❌ offline';
        el.className = 'ping offline';
      } else {
        el.textContent = `${latency}ms`;
        el.className = `ping ${latency < 30 ? 'fast' : latency < 80 ? 'medium' : 'slow'}`;
      }
    }
  }

  async connectFastest() {
    console.log('[WISP Murcia] Buscando servidor más rápido para Murcia...');
    this.setStatus('Buscando servidor más rápido en Murcia...', 'testing');
    
    const sorted = await this.testAllServers();
    const fastest = sorted.find(s => s.online) || this.servers[0];
    
    if (!fastest) {
      this.setStatus('No hay servidores disponibles', 'error');
      return false;
    }

    console.log(`[WISP Murcia] Más rápido: ${fastest.name} (${fastest.latency}ms)`);
    return this.connect(fastest.url, fastest);
  }

  async connect(serverUrl, serverInfo = null) {
    if (this.isConnected && this.currentServer?.url === serverUrl) {
      console.log('[WISP Murcia] Ya conectado a', serverUrl);
      return true;
    }

    // Desconectar previo
    if (this.connection) {
      try { this.connection.close(); } catch {}
    }

    const server = serverInfo || this.servers.find(s => s.url === serverUrl) || { name: serverUrl, url: serverUrl };
    
    this.setStatus(`Conectando a ${server.name}...`, 'connecting');
    console.log(`[WISP Murcia] Conectando a ${server.name} - ${serverUrl}`);

    try {
      // Si tenemos Bare-Mux, usar EpoxyTransport
      if (this.bareMux && serverUrl) {
        try {
          // Intentar con EpoxyTransport
          const epoxyPath = '/lib/epoxy/index.mjs';
          await this.bareMux.setTransport(epoxyPath, [{ wisp: serverUrl }]);
          console.log('[WISP Murcia] EpoxyTransport configurado con', serverUrl);
        } catch (e) {
          console.warn('[WISP Murcia] Epoxy falló, intentando bare:', e.message);
          try {
            await this.bareMux.setTransport('/lib/bare-mux/index.mjs', [serverUrl]);
          } catch (e2) {
            console.warn('[WISP Murcia] Bare-Mux también falló:', e2.message);
          }
        }
      }

      // Test de conexión WISP directa
      const latency = await this.pingServer(serverUrl, 5000);
      
      if (latency === -1) {
        throw new Error('Servidor no responde');
      }

      this.currentServer = { ...server, latency, url: serverUrl };
      this.isConnected = true;
      this.stats = {
        connected: true,
        server: this.currentServer,
        latency,
        region: 'Murcia, España',
        mode: 'wisp',
        url: serverUrl
      };

      localStorage.setItem('wisp-murcia-server', serverUrl);
      localStorage.setItem('wisp-murcia-server-info', JSON.stringify(this.currentServer));

      this.setStatus(`✅ Conectado a ${server.name} - ${latency}ms - Murcia Turbo`, 'connected');
      console.log(`[WISP Murcia] ✅ Conectado: ${server.name} (${latency}ms)`);
      
      this.notifyListeners();
      return true;

    } catch (e) {
      console.error('[WISP Murcia] Error conectando:', e);
      this.isConnected = false;
      this.setStatus(`❌ Error: ${e.message}`, 'error');
      
      // Auto-failover al siguiente servidor
      const currentIdx = this.servers.findIndex(s => s.url === serverUrl);
      if (currentIdx !== -1 && currentIdx < this.servers.length - 1) {
        console.log('[WISP Murcia] Intentando failover...');
        const next = this.servers[currentIdx + 1];
        setTimeout(() => this.connect(next.url, next), 1000);
      }
      
      return false;
    }
  }

  disconnect() {
    if (this.connection) {
      try { this.connection.close(); } catch {}
    }
    this.isConnected = false;
    this.currentServer = null;
    this.stats.connected = false;
    this.setStatus('Desconectado', 'disconnected');
    this.notifyListeners();
    console.log('[WISP Murcia] Desconectado');
  }

  setTurbo(enabled) {
    this.isTurbo = enabled;
    localStorage.setItem('murcia-turbo', enabled.toString());
    
    if (enabled) {
      console.log('[WISP Murcia] 🚀 Modo Turbo Murcia ACTIVADO');
      this.connectFastest();
    } else {
      console.log('[WISP Murcia] Modo Turbo desactivado');
    }
    
    this.notifyListeners();
  }

  setStatus(text, type = 'info') {
    const el = document.getElementById('wisp-status');
    if (el) {
      el.textContent = text;
      el.className = `wisp-status ${type}`;
    }
    
    // Actualizar indicador principal
    const indicator = document.getElementById('wisp-indicator');
    if (indicator) {
      indicator.textContent = text;
      indicator.className = `indicator ${type}`;
    }

    // Actualizar dot
    const dot = document.getElementById('wisp-dot');
    if (dot) {
      dot.className = `dot ${type}`;
    }
  }

  onStatusChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.stats); } catch {}
    });
  }

  // Proxy optimizado para Roblox
  getRobloxProxyUrl(robloxUrl) {
    if (this.isConnected && this.isTurbo) {
      // Usar proxy local optimizado que quita X-Frame-Options
      return `/proxy/roblox/?url=${encodeURIComponent(robloxUrl)}`;
    }
    return robloxUrl;
  }

  // Obtener URL de WISP para usar con Epoxy
  getWispUrl() {
    if (this.currentServer) {
      return this.currentServer.url;
    }
    // Fallback a local
    return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/wisp/`;
  }

  async getMurciaStatus() {
    try {
      const res = await fetch('/api/murcia-status');
      if (res.ok) return await res.json();
    } catch {}
    return null;
  }
}

// Instancia global
window.WispMurcia = new WispMurcia();

// Auto-init cuando DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.WispMurcia.init());
} else {
  window.WispMurcia.init();
}

// Export para módulos
export default window.WispMurcia;
