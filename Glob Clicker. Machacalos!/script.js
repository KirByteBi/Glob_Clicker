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
    stupid: { vida: 1, recompensa: 5, imagen: "Stupid_Pyce.png" },
    guest: { vida: 2, recompensa: 10, imagen: "Guest_Pyce.png" },
    noob: { vida: 3, recompensa: 20, imagen: "Noob_Pyce.png" }
};

// ===== MEJORAS =====
const mejoras = [
    // Globs automáticos
    { id: 1, nombre: "mejora1_nombre", costo: 25, gps: 0.8, stackeable: true, icono: "Red_Glob.png", descripcion: "mejora1" },
    { id: 2, nombre: "mejora2_nombre", costo: 75, gps: 1.6, stackeable: true, icono: "Soap_Glob.png", descripcion: "mejora2" },
    { id: 3, nombre: "mejora3_nombre", costo: 120, gps: 0.8, stackeable: true, icono: "Click_Plus.png", descripcion: "mejora3" },
    { id: 5, nombre: "mejora5_nombre", costo: 246, gps: 2.4, stackeable: true, icono: "Cotton_Glob.png", descripcion: "mejora5" },
    { id: 9, nombre: "mejora9_nombre", costo: 564, gps: 3.2, stackeable: true, icono: "Ducky_Glob.png", descripcion: "mejora9" },
    { id: 11, nombre: "mejora11_nombre", costo: 666, gps: 4.0, stackeable: true, icono: "Robotic_Glob.png", descripcion: "mejora11" },
    { id: 13, nombre: "mejora13_nombre", costo: 867, gps: 5.6, stackeable: true, icono: "Molten_Glob.png", descripcion: "mejora13" },
    { id: 15, nombre: "mejora15_nombre", costo: 1008, gps: 6.4, stackeable: true, icono: "Golden_Ducky_Glob.png", descripcion: "mejora15" },
    { id: 16, nombre: "mejora16_nombre", costo: 1074, gps: 7.2, stackeable: true, icono: "Comet_Glob.png", descripcion: "mejora16" },
    { id: 20, nombre: "mejora20_nombre", costo: 1401, gps: 8.0, stackeable: true, icono: "Dark_Glob.png", descripcion: "mejora20" },
    
    // Eventos y Pyces
    { id: 4, nombre: "mejora4_nombre", costo: 198, evento: "stupid_pyce", icono: "Stupid_Pyce.png", descripcion: "mejora4" },
    { id: 6, nombre: "mejora6_nombre", costo: 330, evento: "lucky_block", icono: "LUCKY_BLOCK-OG.png", descripcion: "mejora6" },
    { id: 7, nombre: "mejora7_nombre", costo: 405, accion: "eliminarStupidPyces", icono: "Pyce_File.png", descripcion: "mejora7" },
    { id: 10, nombre: "mejora10_nombre", costo: 600, evento: "ducky_fever", icono: "Poop_Glob.png", descripcion: "mejora10" },
    { id: 12, nombre: "mejora12_nombre", costo: 765, evento: "noob_pyces", icono: "Increased_Lucky.png", descripcion: "mejora12" },
    { id: 14, nombre: "mejora14_nombre", costo: 939, evento: "golden_glob", icono: "Golden_Glob.png", descripcion: "mejora14" },
    { id: 17, nombre: "mejora17_nombre", costo: 1170, accion: "eliminarNoobPyces", icono: "Old-R_File.png", descripcion: "mejora17" },
    { id: 18, nombre: "mejora18_nombre", costo: 1245, modificador: "rainbow", icono: "Rainbow_Glob.png", descripcion: "mejora18" },
    { id: 19, nombre: "mejora19_nombre", costo: 1308, accion: "eliminarGuestPyces", icono: "Roblox_File.png", descripcion: "mejora19" },
    { id: 21, nombre: "mejora21_nombre", costo: 5000, accion: "obtenerPyceGlob", icono: "Glob_Pyce.png", descripcion: "mejora21" }
];

// ===== EMBLEMAS =====
const emblemas = [
    { id: 1, nombre: "emblema1_nombre", descripcion: "Compra un Glob", icono: "CuteGlob.png", condicion: (game) => game.mejorasCompradas.length > 0 },
    { id: 2, nombre: "emblema2_nombre", descripcion: "Compra Random Time", icono: "Stupid_Pyce.png", condicion: (game) => game.mejorasCompradas.includes(4) },
    { id: 3, nombre: "emblema3_nombre", descripcion: "200 clicks", icono: "Click_Plus.png", condicion: (game) => game.clickCount >= 200 },
    { id: 4, nombre: "emblema4_nombre", descripcion: "Compra Ducky Glob", icono: "Ducky_Glob.png", condicion: (game) => game.mejorasCompradas.includes(9) },
    { id: 5, nombre: "emblema5_nombre", descripcion: "Compra Robotic Glob", icono: "Robotic_Glob.png", condicion: (game) => game.mejorasCompradas.includes(11) },
    { id: 6, nombre: "emblema6_nombre", descripcion: "400 clicks", icono: "Cotton_Glob.png", condicion: (game) => game.clickCount >= 400 },
    { id: 7, nombre: "emblema7_nombre", descripcion: "Rechaza un Lucky Block", icono: "LUCKY_BLOCK-OG.png", condicion: (game) => game.luckyBlockRechazado },
    { id: 8, nombre: "emblema8_nombre", descripcion: "Compra 3 Lucky Blocks", icono: "Increased_Lucky.png", condicion: (game) => game.mejorasCompradas.filter(id => id === 6).length >= 3 },
    { id: 9, nombre: "emblema9_nombre", descripcion: "Ten todos los Pyces en pantalla", icono: "Noob_Pyce.png", condicion: (game) => {
        const pyces = Array.from(document.querySelectorAll('.pyce'));
        return pyces.some(p => p.classList.contains('stupid')) && 
               pyces.some(p => p.classList.contains('noob')) && 
               pyces.some(p => p.classList.contains('guest'));
    }},
    { id: 10, nombre: "emblema10_nombre", descripcion: "555 clicks", icono: "Golden_Glob.png", condicion: (game) => game.clickCount >= 555 },
    { id: 11, nombre: "emblema11_nombre", descripcion: "Compra todos los antivirus", icono: "Pyce_Glob.png", condicion: (game) => 
        game.mejorasCompradas.includes(7) && game.mejorasCompradas.includes(17) && game.mejorasCompradas.includes(19) },
    { id: 12, nombre: "emblema12_nombre", descripcion: "100+ clicks de un golpe", icono: "Old_Glob.png", condicion: (game) => game.maxClicksPorVez >= 100 },
    { id: 13, nombre: "emblema13_nombre", descripcion: "Compra Dark Glob", icono: "Dark_Glob.png", condicion: (game) => game.mejorasCompradas.includes(20) },
    { id: 14, nombre: "emblema14_nombre", descripcion: "888 clicks", icono: "Comet_Glob.png", condicion: (game) => game.clickCount >= 888 },
    { id: 15, nombre: "emblema15_nombre", descripcion: "1999 clicks", icono: "Golden_Ducky_Glob.png", condicion: (game) => game.clickCount >= 1999 },
    { id: 16, nombre: "emblema16_nombre", descripcion: "Compra todas las mejoras BETA", icono: "Glodark.png", condicion: (game) => 
        [4, 6, 7, 10, 12, 14, 17, 18, 19, 21].every(id => game.mejorasCompradas.includes(id)) },
    { id: 17, nombre: "emblema17_nombre", descripcion: "Compra 20 de cada Glob", icono: "Glob_Empire-BAG.png", condicion: (game) => 
        [1, 2, 3, 5, 9, 11, 13, 15, 16, 20].every(id => game.mejorasCompradas.filter(mid => mid === id).length >= 20) },
    { id: 18, nombre: "emblema18_nombre", descripcion: "Woah... Enserio? Bueno, el codigo es '/e Gl0B Cl1cK3r GlPy'... Canjealo en Find those Pyces.", 
      icono: "Glob_Pyce.png", condicion: (game) => game.mejorasCompradas.includes(21) }
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
    globsContainer: document.getElementById('globs-container'),
    spanishBtn: document.getElementById('spanishBtn'),
    englishBtn: document.getElementById('englishBtn'),
    shopTitle: document.getElementById('shop-title')
};

// ===== FUNCIONES PRINCIPALES =====
function verificarEmblemas() {
    const gameState = { 
        mejorasCompradas, 
        clickCount, 
        maxClicksPorVez,
        luckyBlockRechazado
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
            <h2>${translateText('newBadge')}</h2>
            <img src="img/${emblema.icono}" class="emblema-icono" alt="${translateText(emblema.nombre)}">
            <h3>${translateText(emblema.nombre)}</h3>
            <p>${emblema.descripcion}</p>
            <button class="cerrar-emblema">${translateText('awesome')}</button>
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
            badge.setAttribute('data-nombre', translateText(emblema.nombre));
            DOM.contenedorEmblemas.appendChild(badge);
        }
    });
}

// ===== FUNCIONES DEL JUEGO =====
function actualizarContador() {
    DOM.contador.textContent = Math.floor(globs);
    DOM.gpsCounter.textContent = globsPorSegundo.toFixed(1);
    document.querySelector('.gps-display').textContent = `(+${globsPorSegundo.toFixed(1)}/s)`;
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
            <img src="img/${mejora.icono}" class="icono-mejora" alt="${translateText(mejora.nombre)}">
            <h3>${translateText(mejora.nombre)}</h3>
            <p class="${!asequible ? 'no-asequible' : ''}">${translateText('cost')} ${costoActual} globs</p>
            <p class="descripcion-mejora">${translateText(mejora.descripcion)}</p>
            ${vecesComprado > 0 && mejora.stackeable ? `<p>${translateText('level')} ${vecesComprado}</p>` : ''}
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
    switch(evento) {
        case 'stupid_pyce':
            spawnPyce('stupid');
            break;
        case 'lucky_block':
            luckyBlocksComprados++;
            currentMaxProbability = Math.min(MAX_LUCKY_BLOCK_PROB + (INCREASED_LUCK_BOOST * luckyBlocksComprados), MAX_LUCKY_BLOCK_PROB);
            break;
        case 'ducky_fever':
            // Lógica para fiebre de ducky
            break;
        case 'noob_pyces':
            spawnPyce('noob');
            break;
        case 'golden_glob':
            globs += 100;
            actualizarContador();
            break;
    }
}

function ejecutarAccion(accion) {
    switch(accion) {
        case 'eliminarStupidPyces':
            eliminarPyces('stupid');
            break;
        case 'eliminarNoobPyces':
            eliminarPyces('noob');
            break;
        case 'eliminarGuestPyces':
            eliminarPyces('guest');
            break;
        case 'obtenerPyceGlob':
            goldenDuckyActive = true;
            break;
    }
}

function spawnPyce(tipo) {
    const pyce = document.createElement('div');
    pyce.className = `pyce ${tipo}`;
    pyce.style.left = `${Math.random() * 80 + 10}%`;
    pyce.style.top = `${Math.random() * 80 + 10}%`;
    
    const img = document.createElement('img');
    img.src = `img/${pyces[tipo].imagen}`;
    img.style.width = '50px';
    pyce.appendChild(img);
    
    pyce.addEventListener('click', () => {
        globs += pyces[tipo].recompensa;
        actualizarContador();
        pyce.remove();
        pycesActivos = pycesActivos.filter(p => p !== pyce);
        verificarEmblemas();
    });
    
    document.body.appendChild(pyce);
    pycesActivos.push(pyce);
    verificarEmblemas();
}

function eliminarPyces(tipo) {
    document.querySelectorAll(`.pyce.${tipo}`).forEach(pyce => {
        pyce.remove();
        pycesEliminados++;
    });
    pycesActivos = pycesActivos.filter(p => !p.classList.contains(tipo));
    verificarEmblemas();
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
    // Configurar botones de idioma
    DOM.spanishBtn.addEventListener('click', () => updateLanguage('es'));
    DOM.englishBtn.addEventListener('click', () => updateLanguage('en'));
    
    // Inicializar con español
    updateLanguage('es');
    
    // Resto de la inicialización
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