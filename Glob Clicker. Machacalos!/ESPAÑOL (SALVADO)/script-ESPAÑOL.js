// ===== VARIABLES DEL JUEGO =====
let globs = 0;
let globsPorSegundo = 0;
let clickCount = 0;
let mejorasCompradas = [];
let emblemasObtenidos = [];
let tiendaAbierta = false;
let pycesActivos = [];
let goldenDuckyActive = false;
let intervalosActivos = [];
let clicksAdicionales = 0;
let maxClicksPorVez = 1;
let luckyBlockRechazado = false;
let pycesEliminados = 0;

// Sistema de Lucky Blocks
let luckyBlockProbability = 0.05;
let luckyBlocksComprados = 0;
const MAX_LUCKY_BLOCK_PROB = 0.3;
const INCREASED_LUCK_BOOST = 0.15;
let currentMaxProbability = MAX_LUCKY_BLOCK_PROB;
const LUCKY_BLOCK_REWARD_MIN = 10;
const LUCKY_BLOCK_REWARD_MAX = 50;

// Configuración
const inflacionPorMejora = 1.15;
const reduccionGPS = 0.8;

// Pyces
const pyces = {
    stupid: { vida: 1, recompensa: -5, imagen: "Stupid_Pyce.png" },
    guest: { vida: 2, recompensa: -10, imagen: "Guest_Pyce.png" },
    noob: { vida: 3, recompensa: -20, imagen: "Noob_Pyce.png" }
};

// ===== MEJORAS =====
const mejoras = [
    // Globs automáticos
    { id: 1, nombre: "Glob Rojo", costo: 25, gps: 0.8, stackeable: true, icono: "Red_Glob.png", descripcion: "Genera 0.8 globs por segundo" },
    { id: 2, nombre: "Glob de Jabon", costo: 75, gps: 1.6, stackeable: true, icono: "Soap_Glob.png", descripcion: "Genera 1.6 globs por segundo" },
    { id: 3, nombre: "¡Mas Clicks!", costo: 120, gps: 0.8, stackeable: true, icono: "Click_Plus.png", descripcion: "+1 click extra por clic" },
    { id: 5, nombre: "Glob de Nube de Azucar", costo: 246, gps: 2.4, stackeable: true, icono: "Cotton_Glob.png", descripcion: "Genera 2.4 globs por segundo" },
    { id: 9, nombre: "Ducky Glob", costo: 564, gps: 3.2, stackeable: true, icono: "Ducky_Glob.png", descripcion: "Genera 3.2 globs por segundo" },
    { id: 11, nombre: "Glob Robotoico", costo: 666, gps: 4.0, stackeable: true, icono: "Robotic_Glob.png", descripcion: "Genera 4.0 globs por segundo" },
    { id: 13, nombre: "Glob Fundido", costo: 867, gps: 5.6, stackeable: true, icono: "Molten_Glob.png", descripcion: "Genera 5.6 globs por segundo" },
    { id: 15, nombre: "Ducky Glob Dorado", costo: 1008, gps: 6.4, stackeable: true, icono: "Golden_Ducky_Glob.png", descripcion: "Genera 6.4 globs por segundo + Guest Pyces" },
    { id: 16, nombre: "Glob Cometa", costo: 1074, gps: 7.2, stackeable: true, icono: "Comet_Glob.png", descripcion: "Genera 7.2 globs por segundo" },
    { id: 20, nombre: "Glob Oscuro", costo: 1401, gps: 8.0, stackeable: true, icono: "Dark_Glob.png", descripcion: "Genera 8.0 globs por segundo" },
    
    // Eventos y Pyces
    { id: 4, nombre: "Tiempo Aleatorio", costo: 198, evento: "stupid_pyce", icono: "Stupid_Pyce.png", descripcion: "¡Aparecen Stupid Pyces! Golpéalos para obtener globs." },
    { id: 6, nombre: "Lucky Block", costo: 330, evento: "lucky_block", icono: "LUCKY_BLOCK-OG.png", descripcion: "5% de aparecer (+2% por compra). ¡Clickéalos para 10-50 globs!" },
    { id: 7, nombre: "Antivirus de Pyces por Defecto", costo: 405, accion: "eliminarStupidPyces", icono: "Pyce_File.png", descripcion: "Elimina todos los Stupid Pyces" },
    { id: 10, nombre: "Fiebre de Ducky", costo: 600, evento: "ducky_fever", icono: "Poop_Glob.png", descripcion: "¡1% de Ducky dorado (200 globs)!" },
    { id: 12, nombre: "Mas Suerte", costo: 765, evento: "noob_pyces", icono: "Increased_Lucky.png", descripcion: "Aumenta probabilidad de eventos (+15% inicial)" },
    { id: 14, nombre: "Glob Dorado", costo: 939, evento: "golden_glob", icono: "Golden_Glob.png", descripcion: "¡+100 globs instantáneos!" },
    { id: 17, nombre: "Antiguo Actualizador de Roblox", costo: 1170, accion: "eliminarNoobPyces", icono: "Old-R_File.png", descripcion: "Elimina todos los Noob Pyces" },
    { id: 18, nombre: "Glob Arcoiris", costo: 1245, modificador: "rainbow", icono: "Rainbow_Glob.png", descripcion: "¡Efecto visual especial!" },
    { id: 19, nombre: "Eliminacion de Guests", costo: 1308, accion: "eliminarGuestPyces", icono: "Roblox_File.png", descripcion: "Elimina todos los Guest Pyces" },
    { id: 21, nombre: "Stupid GoldPyce", costo: 5000, accion: "obtenerGoldenPyce", icono: "Stupid_GoldPyce.png", descripcion: "Me pregunto dónde podré obtener esto... Alomejor Kirb sabe!" }
];

// ===== EMBLEMAS =====
const emblemas = [
    { id: 1, nombre: "Glob!", descripcion: "Compra un Glob", icono: "CuteGlob.png", condicion: (game) => game.mejorasCompradas.length > 0 },
    { id: 2, nombre: "te sientes Pycante?", descripcion: "Compra Random Time", icono: "Stupid_Pyce.png", condicion: (game) => game.mejorasCompradas.includes(4) },
    { id: 3, nombre: "Clicks verdosos!", descripcion: "200 clicks", icono: "Click_Plus.png", condicion: (game) => game.clickCount >= 200 },
    { id: 4, nombre: "Encontramos a Ducky Glob!", descripcion: "Compra Ducky Glob", icono: "Ducky_Glob.png", condicion: (game) => game.mejorasCompradas.includes(9) },
    { id: 5, nombre: "Oh no...", descripcion: "Compra Robotic Glob", icono: "Robotic_Glob.png", condicion: (game) => game.mejorasCompradas.includes(11) },
    { id: 6, nombre: "Clicks Gelatinosos", descripcion: "400 clicks", icono: "Cotton_Glob.png", condicion: (game) => game.clickCount >= 400 },
    { id: 7, nombre: "Suerte Bloqueada", descripcion: "Rechaza un Lucky Block", icono: "LUCKY_BLOCK-OG.png", condicion: (game) => game.luckyBlockRechazado },
    { id: 8, nombre: "Suerte Bloqueada", descripcion: "Compra 3 Lucky Blocks", icono: "Increased_Lucky.png", condicion: (game) => game.mejorasCompradas.filter(id => id === 6).length >= 3 },
    { id: 9, nombre: "OGs Pyces", descripcion: "Ten todos los Pyces en pantalla", icono: "Noob_Pyce.png", condicion: (game) => game.pycesActivos.some(p => p.classList.contains('stupid')) && game.pycesActivos.some(p => p.classList.contains('noob')) && game.pycesActivos.some(p => p.classList.contains('guest')) },
    { id: 10, nombre: "Master de Clicks", descripcion: "555 clicks", icono: "Golden_Glob.png", condicion: (game) => game.clickCount >= 555 },
    { id: 11, nombre: "Pyces Desintalados", descripcion: "Compra todos los antivirus", icono: "Pyce_Glob.png", condicion: (game) => game.mejorasCompradas.includes(7) && game.mejorasCompradas.includes(17) && game.mejorasCompradas.includes(19) },
    { id: 12, nombre: "Lanzada de Azar", descripcion: "100+ clicks de un golpe", icono: "Old_Glob.png", condicion: (game) => game.maxClicksPorVez >= 100 },
    { id: 13, nombre: "Tiempo Noctuno", descripcion: "Compra Dark Glob", icono: "Dark_Glob.png", condicion: (game) => game.mejorasCompradas.includes(20) },
    { id: 14, nombre: "Experto de Clicks", descripcion: "888 clicks", icono: "Comet_Glob.png", condicion: (game) => game.clickCount >= 888 },
    { id: 15, nombre: "Buscador sin vida", descripcion: "1999 clicks", icono: "Golden_Ducky_Glob.png", condicion: (game) => game.clickCount >= 1999 },
    { id: 16, nombre: "Ultramejorado! (BETA)", descripcion: "Compra todas las mejoras BETA", icono: "Glodark.png", condicion: (game) => [4, 6, 7, 10, 12, 14, 17, 18, 19, 21].every(id => game.mejorasCompradas.includes(id)) },
    { id: 17, nombre: "Imperio de Globs", descripcion: "Compra 20 de cada Glob", icono: "Glob_Empire-BAG.png", condicion: (game) => [1, 2, 3, 5, 9, 11, 13, 15, 16, 20].every(id => game.mejorasCompradas.filter(mid => mid === id).length >= 20) }
];

// ===== DOM ELEMENTS =====
const DOM = {
    contador: document.querySelector('#counter span'),
    gpsCounter: document.querySelector('#gps'),
    botonGlob: document.getElementById('main-glob'),
    clickEffects: document.getElementById('click-effects'),
    contenedorTienda: document.getElementById('mejoras-container'),
    popupTienda: document.getElementById('tienda-popup'),
    botonAbrirTienda: document.getElementById('abrirTienda'),
    botonCerrarTienda: document.getElementById('cerrar-tienda'),
    contenedorEmblemas: document.getElementById('emblemas-container'),
    pycesContainer: document.getElementById('pyces-container'),
    globsContainer: document.getElementById('globs-container')
};

// ===== FUNCIONES PRINCIPALES =====
function verificarEmblemas() {
    const gameState = { 
        mejorasCompradas, 
        clickCount, 
        pycesActivos: document.querySelectorAll('.pyce'), 
        luckyBlockRechazado, 
        maxClicksPorVez 
    };
    
    emblemas.forEach(emblema => {
        if (!emblemasObtenidos.includes(emblema.id) && emblema.condicion(gameState)) {
            desbloquearEmblema(emblema);
        }
    });
}

function desbloquearEmblema(emblema) {
    emblemasObtenidos.push(emblema.id);
    mostrarEmblemaDesbloqueado(emblema);
    actualizarEmblemasUI();
}

function mostrarEmblemaDesbloqueado(emblema) {
    const popup = document.createElement('div');
    popup.className = 'emblema-popup';
    popup.innerHTML = `
        <div class="emblema-contenido">
            <h2>¡Nuevo Emblema Desbloqueado!</h2>
            <img src="img/${emblema.icono}" class="emblema-icono" alt="${emblema.nombre}">
            <h3>${emblema.nombre}</h3>
            <p>${emblema.descripcion}</p>
            <button class="cerrar-emblema">¡Genial!</button>
        </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector('.cerrar-emblema').addEventListener('click', () => popup.remove());
}

function actualizarEmblemasUI() {
    DOM.contenedorEmblemas.innerHTML = '';
    emblemasObtenidos.sort((a, b) => a - b).forEach(emblemaId => {
        const emblema = emblemas.find(e => e.id === emblemaId);
        if (emblema) {
            const badge = document.createElement('div');
            badge.className = 'emblema-badge obtenido';
            badge.style.backgroundImage = `url('img/${emblema.icono}')`;
            badge.setAttribute('data-nombre', emblema.nombre);
            DOM.contenedorEmblemas.appendChild(badge);
        }
    });
}

// ===== FUNCIONES DEL JUEGO =====
function actualizarContador() {
    DOM.contador.textContent = Math.floor(globs);
    DOM.gpsCounter.textContent = globsPorSegundo.toFixed(1);
}

function generarTienda() {
    DOM.contenedorTienda.innerHTML = '';
    mejoras.forEach(mejora => {
        const vecesComprado = mejorasCompradas.filter(id => id === mejora.id).length;
        const costoActual = Math.floor(mejora.costo * Math.pow(inflacionPorMejora, vecesComprado));
        const asequible = globs >= costoActual;
        
        const elementoMejora = document.createElement('div');
        elementoMejora.className = `mejora ${vecesComprado > 0 ? 'comprada' : ''} ${!asequible ? 'no-asequible' : ''}`;
        elementoMejora.innerHTML = `
            <img src="img/${mejora.icono}" class="icono-mejora" alt="${mejora.nombre}">
            <h3>${mejora.nombre}</h3>
            <p class="${!asequible ? 'no-asequible' : ''}">Costo: ${costoActual} globs</p>
            <p class="descripcion-mejora">${mejora.descripcion}</p>
            ${vecesComprado > 0 && mejora.stackeable ? `<p>Nivel: ${vecesComprado}</p>` : ''}
            ${vecesComprado > 0 ? '<div class="comprado-badge">✓</div>' : ''}
        `;
        
        if (asequible || vecesComprado > 0) {
            elementoMejora.addEventListener('click', () => comprarMejora(mejora.id));
        }
        DOM.contenedorTienda.appendChild(elementoMejora);
    });
}

function comprarMejora(id) {
    const mejora = mejoras.find(m => m.id === id);
    if (!mejora) return;

    const vecesComprado = mejorasCompradas.filter(mid => mid === id).length;
    const costo = Math.floor(mejora.costo * Math.pow(inflacionPorMejora, vecesComprado));

    if (globs >= costo) {
        globs -= costo;
        mejorasCompradas.push(id);
        
        // Aplicar efectos de la mejora
        if (mejora.gps) {
            globsPorSegundo += mejora.gps;
        }
        
        if (mejora.id === 3) { // Click Plus
            clicksAdicionales++;
        }
        
        if (mejora.evento) {
            manejarEvento(mejora.evento);
        }
        
        if (mejora.accion) {
            ejecutarAccion(mejora.accion);
        }
        
        actualizarContador();
        generarTienda();
        verificarEmblemas();
    }
}

function manejarEvento(evento) {
    // Lógica para manejar eventos especiales
    console.log(`Evento activado: ${evento}`);
}

function ejecutarAccion(accion) {
    // Lógica para ejecutar acciones especiales
    console.log(`Acción ejecutada: ${accion}`);
}

// ===== EVENTOS =====
DOM.botonGlob.addEventListener('click', () => {
    const clicksTotales = 1 + clicksAdicionales;
    maxClicksPorVez = Math.max(maxClicksPorVez, clicksTotales);
    
    for (let i = 0; i < clicksTotales; i++) {
        globs++;
        clickCount++;
        
        const efecto = document.createElement('div');
        efecto.className = 'click-effect positive';
        efecto.textContent = '+1';
        efecto.style.left = `${Math.random() * 100 + 100}px`;
        efecto.style.top = `${Math.random() * 100 + 200}px`;
        DOM.clickEffects.appendChild(efecto);
        setTimeout(() => efecto.remove(), 1000);
    }
    actualizarContador();
    verificarEmblemas();
});

DOM.botonAbrirTienda.addEventListener('click', () => {
    generarTienda();
    DOM.popupTienda.style.display = 'flex';
    tiendaAbierta = true;
});

DOM.botonCerrarTienda.addEventListener('click', () => {
    DOM.popupTienda.style.display = 'none';
    tiendaAbierta = false;
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    DOM.popupTienda.style.display = 'none';
    
    // Intervalo para generación automática de globs
    setInterval(() => {
        if (globsPorSegundo > 0) {
            globs += globsPorSegundo * 0.9;
            actualizarContador();
            
            // Mostrar efecto visual de generación automática
            if (Math.random() < 0.3) {
                const efecto = document.createElement('div');
                efecto.className = 'click-effect auto-glob';
                efecto.textContent = `+${globsPorSegundo.toFixed(1)}`;
                efecto.style.left = `${Math.random() * 300 + 50}px`;
                efecto.style.top = `${Math.random() * 300 + 50}px`;
                DOM.clickEffects.appendChild(efecto);
                setTimeout(() => efecto.remove(), 1500);
            }
        }
    }, 1000);
    
    // Verificar emblemas cada segundo
    setInterval(verificarEmblemas, 1000);
});