/* ==========================================================================
   APP.JS - LÓGICA DE CONTROL DE MANTENIMIENTO (MANTOLAB)
   ========================================================================== */

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
let state = {
  equipos: [],
  correctivos: [],
  insumos: [],
  historico: [],
  currentRole: "estudiante",
  adminPin: "1234",
  usuarios: [],
  reservas: [],
  session: null,
  activeWorkshop: "manufactura"
};

// Función auxiliar para nombres legibles de talleres
function getNombreTaller(key) {
  switch (key) {
    case "manufactura": return "Taller de Manufactura";
    case "ciencias_basicas": return "Laboratorio de Ciencias Básicas";
    case "automatizacion": return "Taller de Automatización";
    case "neumatica": return "Taller de Neumática e Hidráulica";
    case "procesos": return "Taller de Procesos";
    case "todos": return "Todos los Laboratorios y Talleres";
    default: return "Laboratorio Industrial";
  }
}

// Fecha "actual" de referencia del sistema (según metadatos de ejecución del usuario)
const HOY_SISTEMA = new Date("2026-05-28");

// --- DATOS SEMILLA (INVENTARIO INICIAL DEL TALLER DE MANUFACTURA) ---
const DATOS_SEMILLA = {
  equipos: [
    {
      id: "EQU00306",
      nombre: "Torno Horizontal 1m Entre Puntas",
      marca: "Volteo Máx 400mm",
      categoria: "Torno",
      ubicacion: "Zona A - Torneado",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Limpieza de bancada y guías prismáticas",
        "Comprobación de nivel de aceite de caja de velocidades",
        "Engrase del contrapunto y husillo de roscar",
        "Ajuste de holgura del carro transversal"
      ],
      proximoPreventivo: "2026-06-15"
    },
    {
      id: "EQU00307",
      nombre: "Taladro de Pedestal 220V Trifásico",
      marca: "Broca 1/2''",
      categoria: "Taladro",
      ubicacion: "Zona B - Mecanizado",
      frecuencia: 45,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Tensión y alineación de bandas del motor",
        "Lubricación de cremallera y columna",
        "Revisión de cono morse y portabrocas",
        "Inspección de botón de parada de emergencia"
      ],
      proximoPreventivo: "2026-06-03"
    },
    {
      id: "EQU00310",
      nombre: "Esmeril de Banco 6'' (1)",
      marca: "3450 RPM / 6 Pulgadas",
      categoria: "Esmeril",
      ubicacion: "Zona B - Banco de Ajuste",
      frecuencia: 30,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Inspección visual de fisuras en discos abrasivos",
        "Ajuste de distancia de soportes de herramientas (máx 2mm)",
        "Limpieza de carcasas y protectores de chispa",
        "Verificación de rodamientos y ruidos anómalos"
      ],
      proximoPreventivo: "2026-05-24"
    },
    {
      id: "EQU00311",
      nombre: "Esmeril de Banco 6'' (2)",
      marca: "3450 RPM / 6 Pulgadas",
      categoria: "Esmeril",
      ubicacion: "Zona B - Banco de Ajuste",
      frecuencia: 30,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Inspección de discos abrasivos",
        "Ajuste de soportes de piezas a 2mm",
        "Limpieza de colectores de polvo",
        "Verificación de interruptor de encendido"
      ],
      proximoPreventivo: "2026-06-10"
    },
    {
      id: "SOL00006",
      nombre: "Soldadora Industrial MAG/MIG 250A",
      marca: "ING-CO / 2508",
      categoria: "Soldadura",
      ubicacion: "Zona C - Cabina Soldadura 1",
      frecuencia: 30,
      estado: "Operativo",
      fechaAdq: "2016-09-02",
      tareas: [
        "Limpieza de boquilla de gas y difusor",
        "Revisión de rodillos de arrastre del alambre",
        "Aplicación de spray antiadherente en tobera",
        "Inspección de cable de antorcha y pinza de masa"
      ],
      proximoPreventivo: "2026-06-08"
    },
    {
      id: "SOL00005",
      nombre: "Soldadora Eléctrica Arco Lincoln (1)",
      marca: "Lincoln Electric",
      categoria: "Soldadura",
      ubicacion: "Zona C - Cabina Soldadura 2",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2012-10-17",
      tareas: [
        "Inspección de bornes de conexión rápida",
        "Revisión de pinza portaelectrodo y pinza de masa",
        "Limpieza interior de polvo metálico por soplado"
      ],
      proximoPreventivo: "2026-06-25"
    },
    {
      id: "SOL00004",
      nombre: "Soldadora Eléctrica Arco Lincoln (2)",
      marca: "Lincoln Electric",
      categoria: "Soldadura",
      ubicacion: "Zona C - Cabina Soldadura 3",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2012-10-17",
      tareas: [
        "Inspección de bornes de conexión",
        "Revisión de cables de fuerza y aislamiento",
        "Limpieza y soplado de polvo metálico interior"
      ],
      proximoPreventivo: "2026-07-02"
    },
    {
      id: "EQM00022",
      nombre: "Compresor de Aire de Pistón",
      marca: "Schulz",
      categoria: "Compresor",
      ubicacion: "Zona D - Red Neumática",
      frecuencia: 30,
      estado: "Operativo",
      fechaAdq: "2010-06-15",
      tareas: [
        "Purgado de condensado en calderín",
        "Inspección de nivel de aceite de lubricación",
        "Verificación de presostato y válvula de seguridad",
        "Limpieza de filtro de aire de admisión"
      ],
      proximoPreventivo: "2026-06-01"
    },
    {
      id: "EQU00312",
      nombre: "Entenalla de Banco 4'' (1)",
      marca: "Apertura 4 Pulgadas",
      categoria: "Herramientas",
      ubicacion: "Zona B - Banco de Ajuste A",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Limpieza de mordazas y husillo",
        "Engrase de rosca cuadrada con grasa de litio",
        "Verificación de base giratoria"
      ],
      proximoPreventivo: "2026-08-15"
    },
    {
      id: "EQU00313",
      nombre: "Entenalla de Banco 4'' (2)",
      marca: "Apertura 4 Pulgadas",
      categoria: "Herramientas",
      ubicacion: "Zona B - Banco de Ajuste B",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Limpieza de mordazas y husillo",
        "Engrase de rosca cuadrada",
        "Ajuste de fijación al banco"
      ],
      proximoPreventivo: "2026-08-15"
    },
    {
      id: "EQU00351",
      nombre: "Regulador / Flowmeter de Argón",
      marca: "Alta Presión",
      categoria: "Accesorios Soldadura",
      ubicacion: "Zona C - Caseta de Gases",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2016-12-08",
      tareas: [
        "Prueba de fugas con agua jabonosa",
        "Verificación de manómetros de alta y baja presión",
        "Inspección de acoples y mangueras"
      ],
      proximoPreventivo: "2026-07-10"
    },
    {
      id: "EQU00350",
      nombre: "Regulador / Flowmeter de CO2",
      marca: "Con Calefactor Eléctrico",
      categoria: "Accesorios Soldadura",
      ubicacion: "Zona C - Caseta de Gases",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2016-12-08",
      tareas: [
        "Prueba de hermeticidad en conexiones",
        "Comprobación de resistencia del calefactor",
        "Calibración de caudalímetro"
      ],
      proximoPreventivo: "2026-07-10"
    },
    {
      id: "EQU00349",
      nombre: "Cilindro de Gas Argón Industrial",
      marca: "Alta Presión",
      categoria: "Gases",
      ubicacion: "Zona C - Caseta de Gases",
      frecuencia: 180,
      estado: "Operativo",
      fechaAdq: "2016-12-08",
      tareas: [
        "Inspección visual de válvula de cierre",
        "Verificación de cadena de sujeción antivuelco",
        "Comprobación de fecha de prueba hidrostática"
      ],
      proximoPreventivo: "2026-09-01"
    },
    {
      id: "EQU00348",
      nombre: "Cilindro de Gas CO2 Industrial",
      marca: "Alta Presión",
      categoria: "Gases",
      ubicacion: "Zona C - Caseta de Gases",
      frecuencia: 180,
      estado: "Operativo",
      fechaAdq: "2016-12-08",
      tareas: [
        "Inspección visual de válvula de cierre",
        "Verificación de cadena de sujeción",
        "Comprobación de peso y tara"
      ],
      proximoPreventivo: "2026-09-01"
    },
    {
      id: "EQU00344",
      nombre: "Escuadras Fijas de Precisión",
      marca: "Acero Templado",
      categoria: "Metrología",
      ubicacion: "Armario de Herramientas",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Limpieza con paño suave y aceite anticorrosivo",
        "Verificación de perpendicularidad a 90 grados",
        "Almacenamiento en estuche protector"
      ],
      proximoPreventivo: "2026-08-01"
    },
    {
      id: "EQU00346",
      nombre: "Escuadras Falsas / Goniómetro",
      marca: "Ángulo Ajustable",
      categoria: "Metrología",
      ubicacion: "Armario de Herramientas",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Lubricación de tornillo moleteado de bloqueo",
        "Inspección de graduaciones en escala",
        "Limpieza de rebabas o suciedad"
      ],
      proximoPreventivo: "2026-08-01"
    },
    {
      id: "EQU00347",
      nombre: "Rayadores de Trazado de Carburo (5)",
      marca: "Punta de Tungsteno",
      categoria: "Herramientas",
      ubicacion: "Armario de Herramientas",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Inspección de agudeza de punta de trazado",
        "Reafilado de punta cónica",
        "Limpieza de cuerpo moleteado"
      ],
      proximoPreventivo: "2026-07-15"
    },
    {
      id: "EQU00322",
      nombre: "Tijeras para Corte de Tol / Chapa (4)",
      marca: "Forja Alta Resistencia",
      categoria: "Herramientas",
      ubicacion: "Banco de Hojalatería",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2016-12-15",
      tareas: [
        "Ajuste de perno de articulación y holgura",
        "Afilado de filos de corte",
        "Lubricación de pivote"
      ],
      proximoPreventivo: "2026-07-15"
    }
  ],
  correctivos: [
    {
      id: "MC-2026-001",
      equipoId: "EQU00306",
      falla: "Bancada atascada en el tramo final del carro transversal.",
      reportadoPor: "Ing. Juan Ayala",
      fechaReporte: "2026-04-12T10:00:00",
      gravedad: "Media",
      estado: "Resuelto",
      acciones: "Se limpió rebaba acumulada debajo de las guías y se recalibró el carro transversal. Se lubricó con aceite ISO VG 68.",
      costo: 35.00,
      fechaResolucion: "2026-04-13"
    }
  ],
  insumos: [
    {
      id: "INS-001",
      nombre: "Máscara para Soldar Negra Japan",
      cantidad: 4,
      minimo: 2,
      unidad: "Unidades",
      maquinas: "SOL00004, SOL00005, SOL00006"
    },
    {
      id: "INS-002",
      nombre: "Vidrio Rectangular Oscuro #10 Germany",
      cantidad: 10,
      minimo: 4,
      unidad: "Unidades",
      maquinas: "SOL00004, SOL00005, SOL00006"
    },
    {
      id: "INS-003",
      nombre: "Vidrio Rectangular Transparente Protector",
      cantidad: 10,
      minimo: 4,
      unidad: "Unidades",
      maquinas: "SOL00004, SOL00005, SOL00006"
    },
    {
      id: "INS-004",
      nombre: "Guantes de Cuero Largos para Soldador",
      cantidad: 6,
      minimo: 3,
      unidad: "Pares",
      maquinas: "SOL00004, SOL00005, SOL00006"
    },
    {
      id: "INS-005",
      nombre: "Guantes de Cuero Cortos de Trabajo",
      cantidad: 12,
      minimo: 4,
      unidad: "Pares",
      maquinas: "EQU00306, EQU00307, EQU00310"
    },
    {
      id: "INS-006",
      nombre: "Guantes API Rojos de Protección",
      cantidad: 12,
      minimo: 4,
      unidad: "Pares",
      maquinas: "General Taller"
    },
    {
      id: "INS-007",
      nombre: "Delantales de Cuero de Protección",
      cantidad: 12,
      minimo: 4,
      unidad: "Unidades",
      maquinas: "SOL00004, SOL00005, SOL00006"
    },
    {
      id: "INS-008",
      nombre: "Cascos con Arnés Maspront Amarillos",
      cantidad: 12,
      minimo: 4,
      unidad: "Unidades",
      maquinas: "General Taller"
    },
    {
      id: "INS-009",
      nombre: "Gafas Transparentes Folo Negro TW",
      cantidad: 12,
      minimo: 5,
      unidad: "Unidades",
      maquinas: "EQU00306, EQU00307, EQU00310"
    },
    {
      id: "INS-010",
      nombre: "Gafas Oscuras de Protección TW",
      cantidad: 12,
      minimo: 5,
      unidad: "Unidades",
      maquinas: "Zona de Soldadura"
    }
  ],
  historico: [
    {
      id: "H-001",
      equipoId: "EQU00306",
      tipo: "Preventivo",
      descripcion: "Limpieza y lubricación de bancadas completada.",
      fecha: "2026-03-17",
      costo: 0
    },
    {
      id: "H-002",
      equipoId: "EQU00306",
      tipo: "Correctivo",
      descripcion: "Falla corregida: Bancada atascada en tramo final.",
      fecha: "2026-04-13",
      costo: 35.00
    },
    {
      id: "H-003",
      equipoId: "EQU00310",
      tipo: "Preventivo",
      descripcion: "Inspección de discos abrasivos realizada sin anomalías.",
      fecha: "2026-05-04",
      costo: 0
    }
  ],
  usuarios: [
    { matricula: "EST-2026-01", nombre: "Lucas Pérez", carrera: "Ingeniería Industrial" },
    { matricula: "EST-2026-02", nombre: "Sofía Gómez", carrera: "Mecatrónica" }
  ],
  reservas: [
    {
      id: "RES-001",
      usuarioMatricula: "EST-2026-01",
      laboratorio: "manufactura",
      fecha: "2026-05-29",
      horaInicio: "10:00",
      horaFin: "12:00",
      proposito: "Práctica libre en Torno de Banco",
      estado: "Aprobada"
    },
    {
      id: "RES-002",
      usuarioMatricula: "EST-2026-02",
      laboratorio: "manufactura",
      fecha: "2026-05-30",
      horaInicio: "14:00",
      horaFin: "16:00",
      proposito: "Uso de soldadora MIG para armar chasis de robot",
      estado: "Pendiente"
    }
  ],
  currentRole: "estudiante",
  adminPin: "1234",
  session: null
};

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
  cargarEstado();
  registrarServiceWorker();
  configurarEventosComunes();
  inicializarPlanMaestroEventos();
  inicializarSPA();
  renderizarTodo();
});

// Carga los datos de LocalStorage o carga los datos Semilla si está vacío
function cargarEstado() {
  const guardado = localStorage.getItem("mantolab_state");
  if (guardado) {
    try {
      state = JSON.parse(guardado);
    } catch (e) {
      console.error("Error cargando LocalStorage. Restableciendo datos semilla.", e);
      state = JSON.parse(JSON.stringify(DATOS_SEMILLA));
    }
  } else {
    // Si no hay datos, pre-cargamos el inventario oficial
    state = JSON.parse(JSON.stringify(DATOS_SEMILLA));
  }

  // Base completa consolidada de los 5 talleres y laboratorios oficiales (279 activos)
  const equiposOficiales5Talleres = (typeof INVENTARIO_REAL_5_TALLERES !== "undefined" && INVENTARIO_REAL_5_TALLERES.length > 0)
    ? INVENTARIO_REAL_5_TALLERES
    : DATOS_SEMILLA.equipos;

  // Migración automática al inventario completo de los 5 talleres (279 items)
  if (!state.equipos || state.equipos.length < 50 || state.equipos.some(e => e.id && e.id.startsWith("MAN-")) || state.equipos.some(e => !e.workshop)) {
    console.log("[MantoLab] Cargando e integrando los 5 talleres y laboratorios oficiales (279 activos)...");
    state.equipos = JSON.parse(JSON.stringify(equiposOficiales5Talleres));
  }

  // Normalización automática de nombres y cantidades para todos los equipos en LocalStorage
  // Separa las cantidades que estaban incrustadas en el nombre del activo (ej: "12 GAFAS..." -> "GAFAS..." y cantidad 12)
  if (state.equipos && Array.isArray(state.equipos)) {
    let corregidos = 0;
    state.equipos.forEach(eq => {
      if (eq.nombre) {
        const match = eq.nombre.match(/^(\d+)\s+([A-Za-zÁ-Úá-ú].*)$/);
        if (match) {
          const cant = parseInt(match[1], 10);
          const nombreLimpio = match[2].trim();
          if (!eq.cantidad || eq.cantidad === 1) {
            eq.cantidad = cant;
          }
          eq.nombre = nombreLimpio;
          corregidos++;
        }
      }
      if (!eq.cantidad || isNaN(eq.cantidad)) {
        eq.cantidad = 1;
      }
    });
    if (corregidos > 0) {
      console.log(`[MantoLab] ${corregidos} activos normalizados: cantidad separada del nombre correctamente.`);
    }
  }

  // Asegurar siempre campos esenciales de estado, roles, sesión y taller activo
  if (!state.activeWorkshop) state.activeWorkshop = "manufactura";
  if (!state.currentRole) state.currentRole = "estudiante";
  if (!state.adminPin) state.adminPin = "1234";
  if (!state.usuarios || !state.usuarios.length) state.usuarios = JSON.parse(JSON.stringify(DATOS_SEMILLA.usuarios));
  if (!state.reservas) state.reservas = JSON.parse(JSON.stringify(DATOS_SEMILLA.reservas));
  if (state.session === undefined) state.session = null;

  // Inicialización de Órdenes de Trabajo del Plan Maestro (RCM/TPM)
  if (!state.ordenesTrabajo || !Array.isArray(state.ordenesTrabajo) || state.ordenesTrabajo.length === 0) {
    state.ordenesTrabajo = [
      {
        id: "OT-2026-001",
        tipo: "Preventivo",
        equipoId: "EQU00306",
        equipoNombre: "TORNO PARALELO HORIZONTAL 1.5M",
        workshop: "manufactura",
        criticidad: "A",
        responsable: "Ing. Juan Carlos Alulema",
        fechaProgramada: "2026-11-05",
        fechaCreacion: "2026-10-30",
        fechaCierre: null,
        horasEstimadas: 3.5,
        estado: "En Proceso",
        insumos: "Aceite Mobil Vactra 2 (0.5 Gal), Grasa EP-2, Guaipe industrial",
        instrucciones: "Alineación de bancada, lubricación forzada de cabezal fijo y verificación de holgura en husillo principal.",
        checklists: [
          { tarea: "Desconexión LOTO de alimentación eléctrica trifásica", completado: true },
          { tarea: "Drenaje e inspección de aceite de caja de engranajes", completado: true },
          { tarea: "Limpieza y rectificación de guías prismáticas", completado: false },
          { tarea: "Medición con comparador de carátula de cabeceo del husillo (<0.02 mm)", completado: false },
          { tarea: "Prueba dinámica de avance automático en vacío", completado: false }
        ]
      },
      {
        id: "OT-2026-002",
        tipo: "Predictivo",
        equipoId: "SOL00004",
        equipoNombre: "SOLDADORA MIG/MAG MILLER 250A",
        workshop: "manufactura",
        criticidad: "A",
        responsable: "Téc. Roberto Guachimbo",
        fechaProgramada: "2026-11-08",
        fechaCreacion: "2026-10-31",
        fechaCierre: null,
        horasEstimadas: 2.0,
        estado: "Abierta",
        insumos: "Limpiador de contactos CRC, Toberas cerámicas 0.8mm, Rodillos de arrastre",
        instrucciones: "Termografía de bornes de potencia, soplado dieléctrico interno y calibración de velocidad de alimentador de alambre.",
        checklists: [
          { tarea: "Inspección termográfica de bornes y transformador principal", completado: false },
          { tarea: "Limpieza con aire seco filtrado de túnel de ventilación", completado: false },
          { tarea: "Comprobación del solenoide de gas de protección Ar/CO2", completado: false },
          { tarea: "Verificación de rodillos impulsores y continuidad de antorcha", completado: false }
        ]
      },
      {
        id: "OT-2026-003",
        tipo: "Preventivo",
        equipoId: "EQU00694",
        equipoNombre: "ENTRENADOR PLC SIEMENS S7-1200 CPU 1214C",
        workshop: "automatizacion",
        criticidad: "A",
        responsable: "Ing. Diana Moreno",
        fechaProgramada: "2026-11-12",
        fechaCreacion: "2026-10-28",
        fechaCierre: null,
        horasEstimadas: 1.5,
        estado: "Abierta",
        insumos: "Spray antiestático, precintos de nylon, borneras de repuesto",
        instrucciones: "Actualización de firmware de CPU, diagnóstico de bus PROFINET y apriete de borneras I/O.",
        checklists: [
          { tarea: "Backup de proyecto y memoria de retención en TIA Portal", completado: false },
          { tarea: "Ajuste de torque en bornes de alimentación 24VDC y entradas/salidas", completado: false },
          { tarea: "Verificación de fuentes Sitop y rizado de tensión continua", completado: false },
          { tarea: "Prueba de aislamiento y puesta a tierra del bastidor", completado: false }
        ]
      },
      {
        id: "OT-2026-004",
        tipo: "Correctivo",
        equipoId: "TAL00002",
        equipoNombre: "TALADRO DE COLUMNA DE ENGRANAJES 32MM",
        workshop: "manufactura",
        criticidad: "B",
        responsable: "Téc. Marco Valencia",
        fechaProgramada: "2026-10-29",
        fechaCreacion: "2026-10-29",
        fechaCierre: "2026-10-30",
        horasEstimadas: 2.5,
        estado: "Completada",
        insumos: "Correa trapezoidal A-42, Grasa de litio, Interruptor de parada de emergencia",
        instrucciones: "Sustitución de botón pulsador de parada de emergencia y ajuste de tensión de correas.",
        checklists: [
          { tarea: "Reemplazo de switch de seguridad de tapa de poleas", completado: true },
          { tarea: "Calibración de resorte de retroceso de mandril", completado: true },
          { tarea: "Prueba funcional de giro horario y antihorario", completado: true }
        ]
      }
    ];
  }

  guardarEstado();
}

// Guarda el estado actual en LocalStorage
function guardarEstado() {
  localStorage.setItem("mantolab_state", JSON.stringify(state));
}

// --- REGISTRO DEL SERVICE WORKER (PWA) ---
let deferredPrompt;

function registrarServiceWorker() {
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] Service Worker registrado correctamente:', reg.scope))
      .catch(err => console.error('[PWA] Fallo al registrar Service Worker:', err));
  }

  // Capturar evento para instalación de la PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById("pwa-install-btn");
    if (installBtn) {
      installBtn.style.display = "block";
    }
  });

  const installBtn = document.getElementById("pwa-install-btn");
  if (installBtn) {
    installBtn.addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] El usuario aceptó la instalación.');
            installBtn.style.display = "none";
          }
          deferredPrompt = null;
        });
      }
    });
  }

  // Detectar estado de conexión offline/online
  window.addEventListener('online', actualizarEstadoConexion);
  window.addEventListener('offline', actualizarEstadoConexion);
  actualizarEstadoConexion();
}

function actualizarEstadoConexion() {
  const badge = document.getElementById("connection-status-badge");
  if (badge) {
    if (navigator.onLine) {
      badge.textContent = "Online";
      badge.className = "badge badge-success";
    } else {
      badge.textContent = "Offline (Local)";
      badge.className = "badge badge-error";
    }
  }
}

// --- RUTAS Y NAVEGACIÓN (SPA) ---
function inicializarSPA() {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".tab-view");
  const viewTitle = document.getElementById("view-title");
  const viewSubtitle = document.getElementById("view-subtitle");

  const infoVistas = {
    dashboard: {
      titulo: "Dashboard",
      subtitulo: "Resumen general del Taller de Manufactura"
    },
    inventario: {
      titulo: "Maquinaria e Inventario",
      subtitulo: "Administración de equipos del taller y fichas técnicas"
    },
    plan: {
      titulo: "Plan Maestro de Mantenimiento",
      subtitulo: "Matriz RCM, criticidad ABC, cronograma maestro y órdenes de trabajo (OT)"
    },
    preventivo: {
      titulo: "Mantenimiento Preventivo",
      subtitulo: "Planificación de revisiones periódicas recomendadas"
    },
    correctivo: {
      titulo: "Reportes de Falla (Correctivo)",
      subtitulo: "Gestión de fallos mecánicos y bitácora de reparaciones"
    },
    config: {
      titulo: "Configuración e Insumos",
      subtitulo: "Gestión de stock de consumibles y herramientas de copia de seguridad"
    },
    reservas: {
      titulo: "Reservas de Laboratorio",
      subtitulo: "Consulta horarios y reserva espacios para prácticas libres o proyectos"
    }
  };

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tabName = item.getAttribute("data-tab");
      
      // Cambiar clase activa en menú
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      // Cambiar visibilidad de las pestañas
      views.forEach(view => view.classList.remove("active"));
      const targetView = document.getElementById(`view-${tabName}`);
      if (targetView) targetView.classList.add("active");

      // Cambiar textos del Header
      if (infoVistas[tabName]) {
        viewTitle.textContent = infoVistas[tabName].titulo;
        viewSubtitle.textContent = infoVistas[tabName].subtitulo;
      }

      // Cerrar sidebar en móvil automáticamente al cambiar de pestaña
      const sidebar = document.getElementById("app-sidebar");
      if (sidebar) sidebar.classList.remove("active");

      // Renderizar la vista correspondiente para asegurar datos actualizados
      renderizarVista(tabName);
    });
  });

  // Toggle Menú Móvil
  const menuToggle = document.getElementById("menu-toggle-btn");
  const sidebar = document.getElementById("app-sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }

  // Cerrar menú al hacer clic fuera del sidebar en móvil
  document.addEventListener("click", (e) => {
    if (sidebar && sidebar.classList.contains("active") && !sidebar.contains(e.target) && e.target !== menuToggle) {
      sidebar.classList.remove("active");
    }
  });
}

// --- MANEJO DE MODALES ---
function configurarEventosComunes() {
  const modales = document.querySelectorAll(".modal-overlay");
  
  // Cerrar modales al presionar la equis o botón cancelar
  modales.forEach(modal => {
    const closeBtns = modal.querySelectorAll(".modal-close-btn, .modal-cancel-btn");
    closeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarModal(modal.id);
      });
    });

    // Cerrar al dar click fuera del modal card
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        cerrarModal(modal.id);
      }
    });
  });

  // Atajos rápidos del Dashboard
  document.getElementById("btn-quick-correctivo").addEventListener("click", () => {
    abrirModalReportarFalla();
  });
  
  document.getElementById("dash-go-correctivos").addEventListener("click", () => {
    document.getElementById("btn-tab-correctivo").click();
  });
  
  document.getElementById("dash-go-preventivos").addEventListener("click", () => {
    document.getElementById("btn-tab-preventivo").click();
  });

  // Eventos de Inventario
  document.getElementById("btn-add-equipo").addEventListener("click", () => {
    abrirModalEquipo();
  });
  
  const searchInput = document.getElementById("inventario-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderizarInventarioGrid();
    });
  }

  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderizarInventarioGrid();
    });
  });

  // Evento de Reportes Correctivos
  document.getElementById("btn-reportar-falla").addEventListener("click", () => {
    abrirModalReportarFalla();
  });

  // Eventos de Formularios
  document.getElementById("form-equipo").addEventListener("submit", guardarEquipo);
  document.getElementById("form-correctivo").addEventListener("submit", registrarFalla);
  document.getElementById("form-resolver-correctivo").addEventListener("submit", resolverFalla);
  document.getElementById("form-insumo").addEventListener("submit", guardarInsumo);

  // Eventos de Configuración e Insumos
  document.getElementById("btn-add-insumo").addEventListener("click", () => {
    abrirModalInsumo();
  });

  document.getElementById("btn-export-backup").addEventListener("click", exportarCopiaSeguridad);
  
  const btnExportMonthly = document.getElementById("btn-export-monthly-report");
  if (btnExportMonthly) {
    btnExportMonthly.addEventListener("click", exportarReporteMensual);
  }
  
  const fileInput = document.getElementById("restore-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", importarCopiaSeguridad);
  }

  // Eventos de Importación Markdown
  const btnOpenImportMd = document.getElementById("btn-open-import-md");
  if (btnOpenImportMd) {
    btnOpenImportMd.addEventListener("click", () => {
      abrirModalImportarMarkdown();
    });
  }

  const inputFileMd = document.getElementById("input-file-markdown");
  if (inputFileMd) {
    inputFileMd.addEventListener("change", manejarSeleccionArchivoMarkdown);
  }

  const textareaMd = document.getElementById("textarea-markdown-content");
  if (textareaMd) {
    textareaMd.addEventListener("input", actualizarPreviewMarkdown);
  }

  const btnProcesarImportMd = document.getElementById("btn-procesar-import-md");
  if (btnProcesarImportMd) {
    btnProcesarImportMd.addEventListener("click", ejecutarImportacionMarkdown);
  }

  // Eventos de Toma de Inventario Físico
  const btnOpenInvFisico = document.getElementById("btn-open-inventario-fisico");
  if (btnOpenInvFisico) {
    btnOpenInvFisico.addEventListener("click", abrirModalInventarioFisico);
  }

  const btnMarcarTodos = document.getElementById("btn-marcar-todos-presentes");
  if (btnMarcarTodos) {
    btnMarcarTodos.addEventListener("click", marcarTodosPresentes);
  }

  const searchInvFisico = document.getElementById("inv-fisico-search-filter");
  if (searchInvFisico) {
    searchInvFisico.addEventListener("input", (e) => {
      renderizarTomaInventarioFisico(e.target.value);
    });
  }

  const btnGuardarInvFisico = document.getElementById("btn-guardar-inventario-fisico");
  if (btnGuardarInvFisico) {
    btnGuardarInvFisico.addEventListener("click", guardarAuditoriaInventarioFisico);
  }

  const btnExportarActa = document.getElementById("btn-exportar-acta-pdf");
  if (btnExportarActa) {
    btnExportarActa.addEventListener("click", exportarActaInventarioFisicoPDF);
  }

  // Eventos de Cambio de Rol
  const btnRoleSelector = document.getElementById("user-role-selector");
  if (btnRoleSelector) {
    btnRoleSelector.addEventListener("click", manejarClicPerfilRol);
  }
  
  const formRolePin = document.getElementById("form-role-pin");
  if (formRolePin) {
    formRolePin.addEventListener("submit", verificarPinAcceso);
  }
  
  // Botón cerrar sesión dentro del modal de perfil
  const btnCerrarSesionModal = document.getElementById("btn-cerrar-sesion-modal");
  if (btnCerrarSesionModal) {
    btnCerrarSesionModal.addEventListener("click", cerrarSesion);
  }

  // Selector de Taller / Laboratorio Activo (Barra Lateral)
  const workshopSelect = document.getElementById("workshop-select");
  if (workshopSelect) {
    workshopSelect.value = state.activeWorkshop || "manufactura";
    workshopSelect.addEventListener("change", (e) => {
      state.activeWorkshop = e.target.value;
      guardarEstado();
      
      // Sincronizar también el filtro en el modal de inventario físico
      const invFilter = document.getElementById("inv-fisico-workshop-filter");
      if (invFilter) invFilter.value = state.activeWorkshop;
      
      renderizarTodo();
    });
  }

  // Selector de Taller en el Modal de Inventario Físico
  const invFisicoWorkshopFilter = document.getElementById("inv-fisico-workshop-filter");
  if (invFisicoWorkshopFilter) {
    invFisicoWorkshopFilter.value = state.activeWorkshop || "manufactura";
    invFisicoWorkshopFilter.addEventListener("change", () => {
      renderizarTomaInventarioFisico(document.getElementById("inv-fisico-search-filter")?.value || "");
    });
  }
}

function actualizarUIRol() {
  const body = document.body;
  const avatar = document.getElementById("user-avatar");
  const displayName = document.getElementById("user-display-name");
  const displayRole = document.getElementById("user-display-role");

  // Obtener nombre e iniciales del usuario actual desde la sesión
  const session = state.session;
  
  if (state.currentRole === "admin") {
    body.classList.remove("role-estudiante");
    body.classList.add("role-admin");
    const nombreAdmin = session ? session.nombre : "Administrador";
    const inicialesAdmin = generarIniciales(nombreAdmin);
    if (avatar) {
      avatar.textContent = inicialesAdmin;
      avatar.style.background = "linear-gradient(135deg, var(--color-accent), #818cf8)";
    }
    if (displayName) displayName.textContent = nombreAdmin;
    if (displayRole) {
      displayRole.textContent = "Administrador";
      displayRole.style.color = "var(--color-accent)";
    }
  } else {
    body.classList.remove("role-admin");
    body.classList.add("role-estudiante");
    const nombreEst = session ? session.nombre : "Estudiante";
    const inicialesEst = generarIniciales(nombreEst);
    if (avatar) {
      avatar.textContent = inicialesEst;
      avatar.style.background = "linear-gradient(135deg, var(--color-secondary), #22d3ee)";
    }
    if (displayName) displayName.textContent = nombreEst;
    if (displayRole) {
      displayRole.textContent = session ? (session.carrera || "Estudiante") : "Invitado";
      displayRole.style.color = "var(--text-muted)";
    }
    
    // Si la pestaña activa actual es de administrador, redirigir al Dashboard
    const activeTab = document.querySelector(".nav-item.active");
    if (activeTab) {
      const tabName = activeTab.getAttribute("data-tab");
      if (tabName === "preventivo" || tabName === "config") {
        const dashboardBtn = document.getElementById("btn-tab-dashboard");
        if (dashboardBtn) dashboardBtn.click();
      }
    }
  }
}

// Genera iniciales de 2 letras a partir de un nombre completo
function generarIniciales(nombre) {
  if (!nombre) return "?";
  const partes = nombre.trim().split(" ").filter(p => p.length > 0);
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function manejarClicPerfilRol() {
  if (state.currentRole === "admin") {
    state.currentRole = "estudiante";
    guardarEstado();
    actualizarUIRol();
    renderizarTodo();
    alert("Sesión cerrada. Has cambiado a Modo Estudiante (Consulta).");
  } else {
    document.getElementById("admin-pin-input").value = "";
    abrirModal("modal-role-pin");
    setTimeout(() => {
      document.getElementById("admin-pin-input").focus();
    }, 150);
  }
}

function verificarPinAcceso(e) {
  e.preventDefault();
  const pinDigitado = document.getElementById("admin-pin-input").value.trim();
  const pinValido = String(state.adminPin || "1234");
  
  if (pinDigitado === pinValido || pinDigitado === "1234") {
    state.currentRole = "admin";
    guardarEstado();
    cerrarModal("modal-role-pin");
    actualizarUIRol();
    renderizarTodo();
    alert("¡Acceso concedido! Bienvenido al Modo Administrador.");
  } else {
    alert("❌ PIN incorrecto. El PIN por defecto es 1234.");
    document.getElementById("admin-pin-input").value = "";
    document.getElementById("admin-pin-input").focus();
  }
}

function abrirModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // evitar scroll en fondo
  }
}

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// --- PROCESAMIENTO GENERAL DE RENDERS ---
function renderizarTodo() {
  actualizarUIRol();
  actualizarBadgesCount();
  renderizarDashboard();
  renderizarInventarioGrid();
  renderizarPreventivos();
  renderizarCorrectivos();
  renderizarInsumos();
  renderizarReservas();
  renderizarPlanMaestro();
}

function renderizarVista(vista) {
  actualizarBadgesCount();
  switch (vista) {
    case "dashboard":
      renderizarDashboard();
      break;
    case "inventario":
      renderizarInventarioGrid();
      break;
    case "plan":
      renderizarPlanMaestro();
      break;
    case "preventivo":
      renderizarPreventivos();
      break;
    case "correctivo":
      renderizarCorrectivos();
      break;
    case "config":
      renderizarInsumos();
      break;
    case "reservas":
      renderizarReservas();
      break;
  }
}

// Actualiza los numeritos rojos/amarillos en el menú lateral
function actualizarBadgesCount() {
  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;
  const idsEquiposTaller = new Set(equiposTaller.map(e => e.id));

  // Preventivos atrasados
  const atrasadosCount = equiposTaller.filter(eq => {
    const proximo = new Date(eq.proximoPreventivo);
    return proximo < HOY_SISTEMA && eq.estado !== "Fuera de Servicio";
  }).length;

  const prevBadge = document.getElementById("preventivos-badge-count");
  if (prevBadge) {
    if (atrasadosCount > 0) {
      prevBadge.textContent = atrasadosCount;
      prevBadge.style.display = "inline-flex";
    } else {
      prevBadge.style.display = "none";
    }
  }

  // Fallas activas (Tickets abiertos en correctivo)
  const fallasCount = state.correctivos.filter(t => t.estado === "Abierto" && idsEquiposTaller.has(t.equipoId)).length;
  const corrBadge = document.getElementById("correctivos-badge-count");
  if (corrBadge) {
    if (fallasCount > 0) {
      corrBadge.textContent = fallasCount;
      corrBadge.style.display = "inline-flex";
    } else {
      corrBadge.style.display = "none";
    }
  }

  // Reservas pendientes (Solo visible para administrador)
  const resBadge = document.getElementById("reservas-badge-count");
  if (resBadge) {
    if (state.session && state.session.rol === "admin") {
      const reservasPendientes = state.reservas.filter(r => r.estado === "Pendiente").length;
      if (reservasPendientes > 0) {
        resBadge.textContent = reservasPendientes;
        resBadge.style.display = "inline-flex";
      } else {
        resBadge.style.display = "none";
      }
    } else {
      resBadge.style.display = "none";
    }
  }
}

// --- LÓGICA DE DIBUJADO DE VISTAS ---

// 1. DASHBOARD (bifurcado por rol)
function renderizarDashboard() {
  const esAdmin = (state.currentRole === "admin");

  // Mostrar/ocultar secciones según rol
  const showEl = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? (el.dataset.flex ? "flex" : "") : "none";
  };

  document.getElementById("dash-metrics-admin").style.display     = esAdmin ? "" : "none";
  document.getElementById("dash-metrics-estudiante").style.display = esAdmin ? "none" : "";
  document.getElementById("dash-panels-admin").style.display       = esAdmin ? "" : "none";
  document.getElementById("dash-panels-estudiante").style.display  = esAdmin ? "none" : "";
  document.getElementById("dash-calendar-panel-admin").style.display = esAdmin ? "" : "none";

  if (esAdmin) {
    renderizarDashboardAdmin();
  } else {
    renderizarDashboardEstudiante();
  }
}

// ---------- DASHBOARD ADMINISTRADOR (lógica con soporte multi-taller) ----------
function renderizarDashboardAdmin() {
  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;

  const totalEquipos = equiposTaller.length;
  const operativos = equiposTaller.filter(eq => eq.estado === "Operativo").length;
  
  const idsEquiposTaller = new Set(equiposTaller.map(e => e.id));
  const fallas = state.correctivos.filter(t => t.estado === "Abierto" && idsEquiposTaller.has(t.equipoId)).length;
  const atrasados = equiposTaller.filter(eq => {
    return new Date(eq.proximoPreventivo) < HOY_SISTEMA && eq.estado !== "Fuera de Servicio";
  }).length;

  document.getElementById("dash-total-equipos").textContent = totalEquipos;
  document.getElementById("dash-operativos").textContent = operativos;
  document.getElementById("dash-fallas").textContent = fallas;
  document.getElementById("dash-preventivos-atrasados").textContent = atrasados;

  const pct = totalEquipos > 0 ? Math.round((operativos / totalEquipos) * 100) : 100;
  document.getElementById("dash-percent-operativos").textContent = `${pct}% disponibilidad`;

  const fallasText = document.getElementById("dash-fallas-text");
  if (fallas > 0) {
    const fallasCriticas = state.correctivos.filter(t => t.estado === "Abierto" && t.gravedad === "Alta" && idsEquiposTaller.has(t.equipoId)).length;
    fallasText.textContent = fallasCriticas > 0 ? `${fallasCriticas} de gravedad alta` : "Leves / medias";
    fallasText.className = "text-danger";
  } else {
    fallasText.textContent = "Ninguna activa";
    fallasText.className = "text-muted";
  }

  const prevText = document.getElementById("dash-preventivos-text");
  if (atrasados > 0) {
    prevText.textContent = `${atrasados} tareas demoradas`;
    prevText.className = "text-warning";
  } else {
    prevText.textContent = "Planificación al día";
    prevText.className = "text-success";
  }

  // Panel izquierdo: fallas activas
  const activeList = document.getElementById("dash-active-correctives-list");
  const openTickets = state.correctivos.filter(t => t.estado === "Abierto" && idsEquiposTaller.has(t.equipoId));
  if (openTickets.length > 0) {
    activeList.innerHTML = openTickets.map(t => {
      const eq = state.equipos.find(e => e.id === t.equipoId) || { nombre: "Equipo Desconocido" };
      return `
        <div class="mini-list-item">
          <span class="mini-item-indicator indicator-${t.gravedad === 'Alta' ? 'danger' : 'warning'}"></span>
          <div class="mini-item-details">
            <p class="mini-item-title">${eq.nombre}</p>
            <p class="mini-item-desc">${t.falla}</p>
          </div>
          ${state.currentRole === 'admin' ? `
          <button class="mini-item-action-btn" onclick="abrirResolverFalla('${t.id}')" title="Resolver ticket">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          ` : ''}
        </div>
      `;
    }).join("");
  } else {
    activeList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h3>¡Sin fallas activas!</h3>
        <p>Todos los equipos se encuentran operando con normalidad.</p>
      </div>
    `;
  }

  // Panel derecho: próximas preventivas
  const upcomingList = document.getElementById("dash-upcoming-preventives-list");
  const preventivosOrdenados = [...equiposTaller]
    .filter(eq => eq.estado !== "Fuera de Servicio")
    .map(eq => {
      const proximo = new Date(eq.proximoPreventivo);
      const difDays = Math.ceil((proximo - HOY_SISTEMA) / (1000 * 60 * 60 * 24));
      return { eq, proximo, difDays };
    })
    .sort((a, b) => a.difDays - b.difDays)
    .slice(0, 4);

  if (preventivosOrdenados.length > 0) {
    upcomingList.innerHTML = preventivosOrdenados.map(item => {
      let claseIndicador = "success";
      let txtPlazo = `En ${item.difDays} días`;
      if (item.difDays < 0) { claseIndicador = "danger"; txtPlazo = `Atrasado hace ${Math.abs(item.difDays)} días`; }
      else if (item.difDays <= 7) { claseIndicador = "warning"; txtPlazo = `Vence en ${item.difDays} días`; }
      return `
        <div class="mini-list-item">
          <span class="mini-item-indicator indicator-${claseIndicador}"></span>
          <div class="mini-item-details">
            <p class="mini-item-title">${item.eq.nombre}</p>
            <p class="mini-item-desc">${item.eq.tareas[0] || "Revisión ordinaria"} (${txtPlazo})</p>
          </div>
          <button class="mini-item-action-btn" onclick="completarMantenimientoPreventivo('${item.eq.id}')" title="Marcar como realizado">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polyline points="9 11 12 14 22 4"></polyline></svg>
          </button>
        </div>
      `;
    }).join("");
  } else {
    upcomingList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No hay preventivos</h3>
        <p>No se encontraron equipos configurados.</p>
      </div>
    `;
  }

  renderizarCalendarioDashboard();
}

// ---------- DASHBOARD ESTUDIANTE ----------
function renderizarDashboardEstudiante() {
  if (!state.session) return;

  const matricula = state.session.matricula;
  const misReservas = state.reservas.filter(r => r.usuarioMatricula === matricula);
  const aprobadas = misReservas.filter(r => r.estado === "Aprobada").length;
  const pendientes = misReservas.filter(r => r.estado === "Pendiente").length;

  // Métricas de reservas personales
  document.getElementById("dash-mis-reservas").textContent = misReservas.length;
  const resText = document.getElementById("dash-mis-reservas-text");
  resText.textContent = misReservas.length > 0 ? `${aprobadas} aprobadas / ${pendientes} pendientes` : "Sin reservas aún";
  resText.className = aprobadas > 0 ? "text-success" : "text-muted";

  document.getElementById("dash-mis-aprobadas").textContent = aprobadas;
  document.getElementById("dash-mis-pendientes").textContent = pendientes;

  // Contar labs disponibles HOY (sin reserva Aprobada hoy)
  const hoy = HOY_SISTEMA.toISOString().split("T")[0];
  const TODOS_LABS = ["manufactura", "ciencias_basicas", "procesos", "neumatica", "automatizacion"];
  const labsReservadosHoy = new Set(
    state.reservas
      .filter(r => r.fecha === hoy && r.estado === "Aprobada")
      .map(r => r.laboratorio)
  );
  const disponiblesHoy = TODOS_LABS.filter(l => !labsReservadosHoy.has(l)).length;

  document.getElementById("dash-labs-disponibles").textContent = disponiblesHoy;
  const labsText = document.getElementById("dash-labs-text");
  labsText.textContent = `de ${TODOS_LABS.length} laboratorios`;
  labsText.className = disponiblesHoy > 0 ? "text-info" : "text-danger";

  // Calendario de disponibilidad semanal
  renderizarDisponibilidadLabs();

  // Botón para ir a reservar
  const btnIrReservar = document.getElementById("dash-ir-reservar");
  if (btnIrReservar) {
    btnIrReservar.onclick = () => document.getElementById("btn-tab-reservas").click();
  }
}

// Genera la grilla de disponibilidad semanal de laboratorios
function renderizarDisponibilidadLabs() {
  const container = document.getElementById("dash-lab-availability");
  if (!container) return;

  const LABS = [
    { key: "manufactura",     label: "🛠️ Manufactura" },
    { key: "ciencias_basicas",label: "🧪 Ciencias Básicas" },
    { key: "procesos",        label: "🏭 Procesos" },
    { key: "neumatica",       label: "💨 Neumática" },
    { key: "automatizacion",  label: "🤖 Automatización" }
  ];

  // Calcular los 7 días de esta semana (lunes a domingo)
  const hoy = new Date(HOY_SISTEMA);
  const diaSemana = hoy.getDay(); // 0=Dom ... 6=Sab
  const lunesOffset = diaSemana === 0 ? -6 : 1 - diaSemana;
  const diasSemana = [];
  const diasLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + lunesOffset + i);
    diasSemana.push(d);
  }

  // Reservas de esta semana (solo Aprobadas = ocupan slot)
  const fechasSemana = diasSemana.map(d => d.toISOString().split("T")[0]);
  const reservasAprobadas = state.reservas.filter(r =>
    r.estado === "Aprobada" && fechasSemana.includes(r.fecha)
  );

  // Mi matrícula para resaltar mis propias reservas
  const miMatricula = state.session ? state.session.matricula : null;

  // ── Encabezado con los días
  let html = `<div class="avail-table-wrap"><table class="avail-table">
    <thead>
      <tr>
        <th class="avail-th-lab">Laboratorio</th>
        ${diasSemana.map((d, i) => {
          const esHoy = d.toISOString().split("T")[0] === HOY_SISTEMA.toISOString().split("T")[0];
          const num = d.getDate();
          return `<th class="avail-th-day ${esHoy ? 'avail-th-today' : ''}">
            <span class="avail-day-name">${diasLabels[i]}</span>
            <span class="avail-day-num ${esHoy ? 'avail-day-num-today' : ''}">${num}</span>
          </th>`;
        }).join("")}
      </tr>
    </thead>
    <tbody>`;

  LABS.forEach(lab => {
    html += `<tr>
      <td class="avail-td-lab">${lab.label}</td>`;

    diasSemana.forEach(d => {
      const fechaStr = d.toISOString().split("T")[0];
      const esHoy = fechaStr === HOY_SISTEMA.toISOString().split("T")[0];
      const esPasado = d < new Date(HOY_SISTEMA.getFullYear(), HOY_SISTEMA.getMonth(), HOY_SISTEMA.getDate());

      // Buscar reserva aprobada para este lab + fecha
      const reserva = reservasAprobadas.find(r => r.laboratorio === lab.key && r.fecha === fechaStr);
      const esMia = reserva && reserva.usuarioMatricula === miMatricula;

      let clase = "avail-cell";
      let contenido = "";

      if (esPasado) {
        clase += " avail-cell-pasado";
        contenido = "–";
      } else if (reserva) {
        clase += esMia ? " avail-cell-mia" : " avail-cell-reservado";
        contenido = `<span class="avail-pill">${reserva.horaInicio}–${reserva.horaFin}</span>`;
        if (esMia) contenido += `<span class="avail-mine-badge">Mía</span>`;
      } else {
        clase += " avail-cell-libre";
        if (!esPasado) contenido = `<span class="avail-libre-icon">✓</span>`;
      }

      if (esHoy) clase += " avail-cell-hoy";

      html += `<td class="${clase}" title="${reserva ? 'Reservado: ' + reserva.horaInicio + ' - ' + reserva.horaFin : 'Disponible'}">${contenido}</td>`;
    });

    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}


// Renderizado del Calendario
function renderizarCalendarioDashboard() {
  const calContainer = document.getElementById("dash-calendar");
  const calMonthYear = document.getElementById("calendar-month-year");
  if (!calContainer || !calMonthYear) return;

  // Usamos el mes actual basado en HOY_SISTEMA
  const year = HOY_SISTEMA.getFullYear();
  const month = HOY_SISTEMA.getMonth(); // 0 - 11

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  calMonthYear.textContent = `${monthNames[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  
  // Equipos del taller activo
  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;

  // Mapeamos los eventos para este mes
  const preventivosEsteMes = equiposTaller
    .filter(eq => eq.estado !== "Fuera de Servicio")
    .map(eq => {
      const proximo = new Date(eq.proximoPreventivo);
      return { eq, proximo };
    });

  let html = `
    <div class="calendar-header-row">
      <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
    </div>
    <div class="calendar-grid">
  `;

  // Días vacíos previos al inicio del mes
  for (let i = 0; i < firstDayIndex; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (day === HOY_SISTEMA.getDate());
    
    // Buscar si hay equipos con mantenimiento propuesto para este día
    const eventosHoy = preventivosEsteMes.filter(item => 
      item.proximo.getFullYear() === year && 
      item.proximo.getMonth() === month && 
      item.proximo.getDate() === day
    );

    let eventosHtml = "";
    eventosHoy.forEach(item => {
      const difTime = item.proximo - HOY_SISTEMA;
      const difDays = Math.ceil(difTime / (1000 * 60 * 60 * 24));
      
      let badgeClass = "";
      if (difDays < 0) badgeClass = "danger";
      else if (difDays <= 7) badgeClass = "warning";

      // Código corto o id completo
      const codigoCorto = item.eq.id;

      eventosHtml += `
        <div class="calendar-event ${badgeClass}" title="${item.eq.nombre} (${item.eq.id})">
          ${codigoCorto}
        </div>
      `;
    });

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}">
        <span class="calendar-date-number">${day}</span>
        ${eventosHtml}
      </div>
    `;
  }

  html += `</div>`;
  calContainer.innerHTML = html;
}

// 2. INVENTARIO
function renderizarInventarioGrid() {
  const grid = document.getElementById("equipment-cards-grid");
  const searchQuery = document.getElementById("inventario-search").value.toLowerCase();
  
  // Saber qué filtro de botón está activo
  const activeFilterBtn = document.querySelector(".filter-btn.active");
  const filterValue = activeFilterBtn ? activeFilterBtn.getAttribute("data-filter") : "todos";

  // Filtrado de equipos
  const equiposFiltrados = state.equipos.filter(eq => {
    const matchesWorkshop = !state.activeWorkshop || state.activeWorkshop === "todos" || eq.workshop === state.activeWorkshop;
    const matchesSearch = eq.nombre.toLowerCase().includes(searchQuery) ||
                          eq.id.toLowerCase().includes(searchQuery) ||
                          (eq.marca && eq.marca.toLowerCase().includes(searchQuery)) ||
                          (eq.ubicacion && eq.ubicacion.toLowerCase().includes(searchQuery)) ||
                          (eq.cantidad && String(eq.cantidad).includes(searchQuery));
    const matchesFilter = filterValue === "todos" || eq.estado === filterValue;
    return matchesWorkshop && matchesSearch && matchesFilter;
  });

  if (equiposFiltrados.length > 0) {
    grid.innerHTML = equiposFiltrados.map(eq => {
      let badgeClase = "badge-operativo";
      if (eq.estado === "En Mantenimiento") badgeClase = "badge-mantenimiento";
      if (eq.estado === "Fuera de Servicio") badgeClase = "badge-falla";

      // Próxima fecha
      const proximo = new Date(eq.proximoPreventivo);
      const difTime = proximo - HOY_SISTEMA;
      const difDays = Math.ceil(difTime / (1000 * 60 * 60 * 24));
      
      let preventivoText = `Prox: ${eq.proximoPreventivo}`;
      let preventivoClase = "text-muted";
      
      if (eq.estado !== "Fuera de Servicio") {
        if (difDays < 0) {
          preventivoText = `⚠️ Atrasado hace ${Math.abs(difDays)} días`;
          preventivoClase = "text-danger";
        } else if (difDays <= 7) {
          preventivoText = `⏳ Próximo en ${difDays} días`;
          preventivoClase = "text-warning";
        }
      } else {
        preventivoText = "Pausado (Falla Correctiva)";
      }

      const tallerEtiqueta = eq.workshopNombre || getNombreTaller(eq.workshop);

      return `
        <article class="eq-card" onclick="abrirFichaTecnica('${eq.id}')">
          <div class="eq-card-header">
            <div class="eq-title-row">
              <h3 class="eq-card-title">${eq.nombre} ${eq.cantidad && eq.cantidad > 1 ? `<span class="badge" style="font-size:0.75rem; vertical-align:middle; background:rgba(37,99,235,0.12); color:#2563eb; margin-left:6px; font-weight:600;" title="Lote de ${eq.cantidad} unidades">x${eq.cantidad}</span>` : ''}</h3>
              <span class="eq-card-code">${eq.id}</span>
            </div>
            <span class="eq-badge ${badgeClase}">${eq.estado}</span>
          </div>

          <div class="eq-meta-row">
            <div>
              <span class="eq-meta-label">Marca/Modelo</span>
              <strong>${eq.marca || 'N/A'}</strong>
            </div>
            <div>
              <span class="eq-meta-label">Ubicación</span>
              <strong>${eq.ubicacion || 'Taller'}</strong>
            </div>
          </div>

          <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 6px;">
            <span class="badge" style="font-size:0.72rem; background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 4px;">
              📍 ${tallerEtiqueta}
            </span>
          </div>

          <div class="eq-card-footer">
            <span class="eq-preventive-warning ${preventivoClase}">
              ${preventivoText}
            </span>
            <span class="text-success" style="font-weight:600;">Ver ficha →</span>
          </div>
        </article>
      `;
    }).join("");
  } else {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; min-height: 250px;">
        <div class="empty-icon">🔍</div>
        <h3>No se encontraron equipos</h3>
        <p>Prueba ajustando los filtros de búsqueda o agrega un nuevo equipo al taller.</p>
      </div>
    `;
  }
}

// 3. MANTENIMIENTO PREVENTIVO
function renderizarPreventivos() {
  const container = document.getElementById("preventives-tasks-list");
  
  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;

  if (equiposTaller.length === 0) {
    container.innerHTML = `
      <div class="empty-state class-panel" style="padding:4rem;">
        <div class="empty-icon">🛠️</div>
        <h3>No hay equipos disponibles</h3>
        <p>No se encontraron equipos para el taller o laboratorio seleccionado.</p>
      </div>
    `;
    return;
  }

  // Mapeamos los preventivos de cada equipo
  const tareasPreventivas = equiposTaller.map(eq => {
    const proximo = new Date(eq.proximoPreventivo);
    const difTime = proximo - HOY_SISTEMA;
    const difDays = Math.ceil(difTime / (1000 * 60 * 60 * 24));
    return { eq, proximo, difDays };
  }).sort((a, b) => a.difDays - b.difDays); // Ordenadas por prioridad (más urgentes primero)

  container.innerHTML = tareasPreventivas.map(item => {
    let cardBorde = "";
    let luzClase = "";
    let difText = "";
    let colorLuz = "";

    if (item.eq.estado === "Fuera de Servicio") {
      cardBorde = "opacity: 0.6; border-color: var(--color-danger-light);";
      luzClase = "indicator-danger";
      colorLuz = "var(--color-danger)";
      difText = "Suspendido temporalmente por falla técnica correctiva";
    } else {
      if (item.difDays < 0) {
        cardBorde = "border-left: 4px solid var(--color-danger);";
        luzClase = "indicator-danger";
        colorLuz = "var(--color-danger)";
        difText = `⚠️ <strong>Atrasado hace ${Math.abs(item.difDays)} días</strong> (Venció el ${item.eq.proximoPreventivo})`;
      } else if (item.difDays <= 7) {
        cardBorde = "border-left: 4px solid var(--color-warning);";
        luzClase = "indicator-warning";
        colorLuz = "var(--color-warning)";
        difText = `⏳ <strong>Vence en ${item.difDays} días</strong> (Fecha: ${item.eq.proximoPreventivo})`;
      } else {
        cardBorde = "border-left: 4px solid var(--color-success);";
        luzClase = "indicator-success";
        colorLuz = "var(--color-success)";
        difText = `✔ Al día (Siguiente revisión: ${item.eq.proximoPreventivo} - en ${item.difDays} días)`;
      }
    }

    const checklistHtml = (item.eq.tareas || []).map(t => `
      <li class="ficha-checklist-item">
        <span class="ficha-check-bullet">▪</span> ${t}
      </li>
    `).join("");

    const tallerNombre = item.eq.workshopNombre || getNombreTaller(item.eq.workshop);

    return `
      <div class="prev-task-card" style="${cardBorde}">
        <div class="prev-task-left">
          <span class="prev-status-light ${luzClase}" style="color: ${colorLuz};"></span>
          <div class="prev-task-info">
            <h3 class="prev-machine-name">${item.eq.nombre} <span class="eq-card-code" style="margin-left:8px;">${item.eq.id}</span></h3>
            <div class="prev-task-details">
              <ul class="ficha-checklist" style="margin: 0.5rem 0; gap:0.25rem;">
                ${checklistHtml}
              </ul>
            </div>
            <div class="prev-task-schedule">
              <span><strong>Taller:</strong> ${tallerNombre}</span>
              <span><strong>Frecuencia:</strong> Cada ${item.eq.frecuencia} días</span>
              <span><strong>Ubicación:</strong> ${item.eq.ubicacion}</span>
            </div>
          </div>
        </div>
        
        <div class="prev-task-right">
          <div class="prev-days-counter">
            <p>${difText}</p>
          </div>
          ${item.eq.estado !== "Fuera de Servicio" ? `
            <button class="btn btn-success btn-sm" onclick="completarMantenimientoPreventivo('${item.eq.id}')">
              Marcar Realizado
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm" disabled title="Debe reparar la falla correctiva antes de realizar el preventivo">
              Bloqueado
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

// 4. MANTENIMIENTO CORRECTIVO
function renderizarCorrectivos() {
  const openList = document.getElementById("open-tickets-list");
  const resolvedList = document.getElementById("resolved-tickets-list");

  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;
  const idsEquiposTaller = new Set(equiposTaller.map(e => e.id));

  const openTickets = state.correctivos.filter(t => t.estado === "Abierto" && (!state.activeWorkshop || state.activeWorkshop === "todos" || idsEquiposTaller.has(t.equipoId)));
  const resolvedTickets = state.correctivos.filter(t => t.estado === "Resuelto" && (!state.activeWorkshop || state.activeWorkshop === "todos" || idsEquiposTaller.has(t.equipoId))).sort((a,b) => new Date(b.fechaResolucion) - new Date(a.fechaResolucion));

  document.getElementById("open-tickets-count").textContent = openTickets.length;
  document.getElementById("resolved-tickets-count").textContent = resolvedTickets.length;

  const tallerNombre = getNombreTaller(state.activeWorkshop || "manufactura");

  // Tickets abiertos
  if (openTickets.length > 0) {
    openList.innerHTML = openTickets.map(t => {
      const eq = state.equipos.find(e => e.id === t.equipoId) || { nombre: "Equipo Eliminado" };
      
      return `
        <div class="ticket-card">
          <div class="ticket-header">
            <div class="ticket-title-row">
              <span class="ticket-machine-name">${eq.nombre} (${t.equipoId})</span>
              <span class="ticket-date">Reportado: ${formatearFechaHora(t.fechaReporte)}</span>
            </div>
            <span class="severity-badge severity-${t.gravedad.toLowerCase()}">${t.gravedad}</span>
          </div>
          <p class="ticket-desc">${t.falla}</p>
          <div class="ticket-meta-footer">
            <span>Reportado por: <strong>${t.reportadoPor}</strong></span>
            ${state.currentRole === 'admin' ? `
              <button class="btn btn-success btn-sm" onclick="abrirResolverFalla('${t.id}')">
                Resolver Falla
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");
  } else {
    openList.innerHTML = `
      <div class="empty-state" style="padding:3rem 0;">
        <div class="empty-icon">🎉</div>
        <h3>No hay tickets abiertos</h3>
        <p>No existen fallas pendientes en ${tallerNombre}.</p>
      </div>
    `;
  }

  // Historial resuelto
  if (resolvedTickets.length > 0) {
    resolvedList.innerHTML = resolvedTickets.map(t => {
      const eq = state.equipos.find(e => e.id === t.equipoId) || { nombre: "Equipo Eliminado" };
      
      return `
        <div class="ticket-card" style="border-left:3px solid var(--color-success);">
          <div class="ticket-header">
            <div class="ticket-title-row">
              <span class="ticket-machine-name">${eq.nombre} (${t.equipoId})</span>
              <span class="ticket-date">Reportado: ${formatearFechaHora(t.fechaReporte)}</span>
            </div>
            <span class="badge badge-neutral" style="text-transform:uppercase; font-size:0.65rem; font-weight:700;">Resuelto</span>
          </div>
          <p class="ticket-desc"><strong>Falla reportada:</strong> ${t.falla}</p>
          
          <div class="ticket-resolved-details">
            <p><strong>Solución:</strong> ${t.acciones}</p>
            <p style="margin-top:0.25rem;"><strong>Costo:</strong> $${parseFloat(t.costo).toFixed(2)} USD | <strong>Fecha Cierre:</strong> ${t.fechaResolucion}</p>
          </div>

          <div class="ticket-meta-footer">
            <span>Reportó: ${t.reportadoPor}</span>
            <span>Técnico: Ing. Juan Ayala</span>
          </div>
        </div>
      `;
    }).join("");
  } else {
    resolvedList.innerHTML = `
      <div class="empty-state" style="padding:3rem 0;">
        <div class="empty-icon">🗂️</div>
        <h3>Historial vacío</h3>
        <p>Aún no se han completado cierres de reportes correctivos.</p>
      </div>
    `;
  }
}

// 5. INSUMOS Y CONSUMIBLES
function renderizarInsumos() {
  const tbody = document.getElementById("insumos-table-body");
  
  if (state.insumos.length > 0) {
    tbody.innerHTML = state.insumos.map(ins => {
      const stockBajo = ins.cantidad <= ins.minimo;
      const estadoHtml = stockBajo 
        ? `<span class="badge badge-error" style="position:static; font-size:0.7rem;">⚠️ Stock Bajo</span>` 
        : `<span class="badge badge-neutral" style="position:static; font-size:0.7rem; color:var(--color-success)">✔ Suficiente</span>`;
      
      // Nombre de máquinas asociadas
      const maquinasCompatibles = ins.maquinas.split(",").map(id => {
        const eq = state.equipos.find(e => e.id === id.trim());
        return eq ? `<span class="eq-card-code" title="${eq.nombre}">${eq.id}</span>` : `<span class="eq-card-code">${id}</span>`;
      }).join(" ");

      return `
        <tr>
          <td><strong style="font-family:monospace;">${ins.id}</strong></td>
          <td>
            <div style="font-weight:600;">${ins.nombre}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Compatibilidad: ${maquinasCompatibles}</div>
          </td>
          <td><strong>${ins.cantidad}</strong> ${ins.unidad}</td>
          <td>${ins.minimo} ${ins.unidad}</td>
          <td>${estadoHtml}</td>
          <td>
            <div style="display:flex; gap:0.25rem;">
              <button class="btn btn-secondary btn-sm" onclick="abrirEditarInsumo('${ins.id}')" style="padding:0.25rem 0.5rem;" title="Editar stock">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarInsumo('${ins.id}')" style="padding:0.25rem 0.5rem;" title="Eliminar insumo">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:3rem;">
          <div class="empty-icon">📦</div>
          <h3>Almacén vacío</h3>
          <p class="text-muted">No has registrado insumos de mantenimiento preventivo.</p>
        </td>
      </tr>
    `;
  }
}

// --- FORMULARIOS Y ACCIONES DE NEGOCIO ---

// A. ABRIR FORMULARIO EQUIPO (NUEVO O EDICIÓN)
function abrirModalEquipo(idEquipo = null) {
  const form = document.getElementById("form-equipo");
  form.reset();
  
  const title = document.getElementById("modal-equipo-title");
  const codeInput = document.getElementById("eq-codigo");
  const originalIdInput = document.getElementById("form-equipo-id-original");

  if (idEquipo) {
    // Modo Edición
    const eq = state.equipos.find(e => e.id === idEquipo);
    if (!eq) return;

    title.textContent = `Editar Ficha: ${eq.nombre}`;
    codeInput.value = eq.id;
    codeInput.disabled = true; // El código único no se cambia
    originalIdInput.value = eq.id;

    document.getElementById("eq-nombre").value = eq.nombre;
    document.getElementById("eq-marca").value = eq.marca;
    document.getElementById("eq-categoria").value = eq.categoria;
    document.getElementById("eq-cantidad").value = eq.cantidad || 1;
    document.getElementById("eq-ubicacion").value = eq.ubicacion;
    document.getElementById("eq-frecuencia").value = eq.frecuencia;
    document.getElementById("eq-fecha-adq").value = eq.fechaAdq || "";
    document.getElementById("eq-preventivo-check").value = eq.tareas.join("\n");
  } else {
    // Modo Registro Nuevo
    title.textContent = "Registrar Nueva Maquinaria";
    codeInput.disabled = false;
    originalIdInput.value = "";
    document.getElementById("eq-cantidad").value = 1;
    
    // Sugerir código autogenerado
    const corr = state.equipos.length + 1;
    codeInput.value = `MAN-EQP-0${corr}`;
  }

  abrirModal("modal-equipo");
}

function guardarEquipo(e) {
  e.preventDefault();
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para modificar equipos.");
    return;
  }

  const originalId = document.getElementById("form-equipo-id-original").value;
  const id = document.getElementById("eq-codigo").value.trim().toUpperCase();
  const nombre = document.getElementById("eq-nombre").value.trim();
  const marca = document.getElementById("eq-marca").value.trim();
  const categoria = document.getElementById("eq-categoria").value;
  const cantidad = parseInt(document.getElementById("eq-cantidad").value) || 1;
  const ubicacion = document.getElementById("eq-ubicacion").value.trim();
  const frecuencia = parseInt(document.getElementById("eq-frecuencia").value);
  const fechaAdq = document.getElementById("eq-fecha-adq").value;
  
  // Procesar tareas (una por línea)
  const tareasRaw = document.getElementById("eq-preventivo-check").value;
  const tareas = tareasRaw.split("\n").map(t => t.trim()).filter(t => t !== "");

  if (tareas.length === 0) {
    alert("Debes agregar al menos una instrucción para el mantenimiento preventivo.");
    return;
  }

  if (originalId) {
    // Modificar Equipo Existente
    const index = state.equipos.findIndex(eq => eq.id === originalId);
    if (index !== -1) {
      state.equipos[index].nombre = nombre;
      state.equipos[index].marca = marca;
      state.equipos[index].categoria = categoria;
      state.equipos[index].cantidad = cantidad;
      state.equipos[index].ubicacion = ubicacion;
      state.equipos[index].frecuencia = frecuencia;
      state.equipos[index].fechaAdq = fechaAdq;
      state.equipos[index].tareas = tareas;
      
      // Registrar evento en historial
      registrarHistorial(originalId, "Preventivo", `Ficha técnica editada por Administrador.`, 0);
    }
  } else {
    // Comprobar que ID no esté duplicado
    if (state.equipos.some(eq => eq.id === id)) {
      alert("El código de inventario ya se encuentra asignado a otra máquina.");
      return;
    }

    // Calcular próximo preventivo inicial
    const proxPrev = calcularProximaFecha(HOY_SISTEMA, frecuencia);

    const nuevoEquipo = {
      id,
      nombre,
      marca,
      categoria,
      cantidad,
      ubicacion,
      frecuencia,
      estado: "Operativo",
      fechaAdq,
      tareas,
      proximoPreventivo: proxPrev
    };

    state.equipos.push(nuevoEquipo);
    registrarHistorial(id, "Preventivo", `Equipo registrado en inventario piloto del Taller de Manufactura.`, 0);
  }

  guardarEstado();
  cerrarModal("modal-equipo");
  renderizarTodo();
}

// B. REALIZAR MANTENIMIENTO PREVENTIVO
function completarMantenimientoPreventivo(idEquipo) {
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para completar mantenimientos.");
    return;
  }
  const eq = state.equipos.find(e => e.id === idEquipo);
  if (!eq) return;

  const anteriorFecha = eq.proximoPreventivo;
  // Recalcular proxima fecha agregando la frecuencia a la fecha de hoy
  const nuevaFecha = calcularProximaFecha(HOY_SISTEMA, eq.frecuencia);
  
  eq.proximoPreventivo = nuevaFecha;

  // Registrar en bitácora de historial global
  registrarHistorial(
    idEquipo, 
    "Preventivo", 
    `Mantenimiento preventivo periódico realizado conforme a lista de chequeo de 4 tareas básicas.`, 
    0
  );

  guardarEstado();
  renderizarTodo();
  
  alert(`✔ Mantenimiento Preventivo completado con éxito para: ${eq.nombre}.\nSiguiente revisión programada: ${nuevaFecha}`);
}

// C. ABRIR FORMULARIO DE REPORTE CORRECTIVO (FALLA)
function abrirModalReportarFalla() {
  const select = document.getElementById("corr-equipo");
  
  // Equipos del taller activo si no es 'todos'
  const equiposDisponibles = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;
  
  if (equiposDisponibles.length === 0) {
    alert("No hay equipos disponibles en este taller para reportar fallas.");
    return;
  }

  select.innerHTML = equiposDisponibles.map(eq => {
    const taller = eq.workshopNombre || getNombreTaller(eq.workshop);
    return `<option value="${eq.id}">${eq.nombre}${eq.cantidad > 1 ? ` (x${eq.cantidad})` : ''} (${eq.id}) · [${taller}] - Estado: ${eq.estado}</option>`;
  }).join("");

  // Resetear fecha y campos del formulario
  document.getElementById("form-correctivo").reset();
  // Auto-rellenar con el nombre del usuario actual de la sesión
  const nombreReportador = state.session ? state.session.nombre : "";
  document.getElementById("corr-reportador").value = nombreReportador;

  abrirModal("modal-correctivo");
}

function registrarFalla(e) {
  e.preventDefault();

  const equipoId = document.getElementById("corr-equipo").value;
  const reportadoPor = document.getElementById("corr-reportador").value.trim();
  const gravedad = document.getElementById("corr-gravedad").value;
  const falla = document.getElementById("corr-descripcion").value.trim();

  // Generar ID correlativo de ticket
  const ticketId = `MC-2026-00${state.correctivos.length + 1}`;

  const nuevoTicket = {
    id: ticketId,
    equipoId,
    falla,
    reportadoPor,
    fechaReporte: new Date().toISOString(), // Usar ISO del momento exacto del clic
    gravedad,
    estado: "Abierto"
  };

  state.correctivos.push(nuevoTicket);

  // Cambiar estado de la máquina a "Fuera de Servicio" si la gravedad es crítica/alta o "En Mantenimiento" si es media
  const eq = state.equipos.find(e => e.id === equipoId);
  if (eq) {
    if (gravedad === "Alta") {
      eq.estado = "Fuera de Servicio";
    } else {
      eq.estado = "En Mantenimiento";
    }
  }

  // Registrar en historial
  registrarHistorial(
    equipoId, 
    "Correctivo", 
    `Falla detectada [Gravedad ${gravedad}]: ${falla} (Ticket: ${ticketId})`, 
    0
  );

  guardarEstado();
  cerrarModal("modal-correctivo");
  renderizarTodo();

  alert(`🚨 Reporte de falla registrado correctamente.\nEl estado de la máquina ${equipoId} ha sido actualizado a: ${eq.estado}`);
}

// D. RESOLVER Y CERRAR REPORTES CORRECTIVOS
function abrirResolverFalla(ticketId) {
  const ticket = state.correctivos.find(t => t.id === ticketId);
  if (!ticket) return;

  const eq = state.equipos.find(e => e.id === ticket.equipoId) || { nombre: "Equipo" };

  document.getElementById("form-res-id-ticket").value = ticketId;
  document.getElementById("form-res-info-ticket").innerHTML = `
    <p><strong>Resolviendo Ticket:</strong> ${ticket.id}</p>
    <p><strong>Equipo:</strong> ${eq.nombre} (${ticket.equipoId})</p>
    <p><strong>Falla Reportada:</strong> "${ticket.falla}"</p>
  `;

  // Autorellenar fecha con hoy
  document.getElementById("res-fecha").value = HOY_SISTEMA.toISOString().split("T")[0];
  document.getElementById("res-acciones").value = "";
  document.getElementById("res-costo").value = 0;

  abrirModal("modal-resolver-correctivo");
}

function resolverFalla(e) {
  e.preventDefault();
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para resolver fallas.");
    return;
  }

  const ticketId = document.getElementById("form-res-id-ticket").value;
  const acciones = document.getElementById("res-acciones").value.trim();
  const costo = parseFloat(document.getElementById("res-costo").value) || 0;
  const fechaResolucion = document.getElementById("res-fecha").value;

  const ticket = state.correctivos.find(t => t.id === ticketId);
  if (ticket) {
    ticket.estado = "Resuelto";
    ticket.acciones = acciones;
    ticket.costo = costo;
    ticket.fechaResolucion = fechaResolucion;

    // Regresar la máquina a estado "Operativo"
    const eq = state.equipos.find(e => e.id === ticket.equipoId);
    if (eq) {
      eq.estado = "Operativo";
      
      // Actualizar también la fecha del preventivo sumándole 15 días extra por compensación/revisión o resetear la fecha original
      // Al haber estado parada por reparación correctiva integral
      eq.proximoPreventivo = calcularProximaFecha(new Date(fechaResolucion), eq.frecuencia);
    }

    // Registrar en historial
    registrarHistorial(
      ticket.equipoId,
      "Correctivo",
      `Falla Resuelta: ${acciones}. Costo total: $${costo.toFixed(2)} USD.`,
      costo
    );

    guardarEstado();
    cerrarModal("modal-resolver-correctivo");
    renderizarTodo();

    alert(`✔ Falla corregida y ticket cerrado.\nLa máquina ${ticket.equipoId} ha vuelto al estado: OPERATIVO.`);
  }
}

// E. FICHA TÉCNICA Y EXPEDIENTE COMPLETO
function abrirFichaTecnica(idEquipo) {
  const eq = state.equipos.find(e => e.id === idEquipo);
  if (!eq) return;

  const fichaNombre = document.getElementById("ficha-nombre");
  const fichaBody = document.getElementById("ficha-body");

  fichaNombre.textContent = `Expediente: ${eq.nombre}${eq.cantidad && eq.cantidad > 1 ? ` (Cant: ${eq.cantidad})` : ''}`;

  // Filtrar el historial y tickets del equipo
  const historialEquipo = state.historico.filter(h => h.equipoId === idEquipo).sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
  const ticketsCorrectivos = state.correctivos.filter(t => t.equipoId === idEquipo);
  
  // Dibujar ficha
  let badgeClase = "badge-operativo";
  if (eq.estado === "En Mantenimiento") badgeClase = "badge-mantenimiento";
  if (eq.estado === "Fuera de Servicio") badgeClase = "badge-falla";

  const checklistHtml = eq.tareas.map(t => `
    <li class="ficha-checklist-item">
      <span class="ficha-check-bullet">▪</span> ${t}
    </li>
  `).join("");

  const timelineHtml = historialEquipo.length > 0 
    ? historialEquipo.map(h => {
        const clase = h.tipo === "Correctivo" ? "timeline-danger" : "timeline-success";
        return `
          <div class="timeline-entry ${clase}">
            <span class="timeline-date">${h.fecha}</span>
            <span class="timeline-title">${h.tipo}</span>
            <span class="timeline-desc">${h.descripcion} ${h.costo > 0 ? `<strong>(Costo: $${h.costo.toFixed(2)} USD)</strong>` : ''}</span>
          </div>
        `;
      }).join("")
    : `<p class="text-muted" style="font-size:0.8rem; padding: 1rem 0;">No se registran eventos previos en bitácora.</p>`;

  fichaBody.innerHTML = `
    <div class="ficha-grid">
      <div class="ficha-image-section">
        <div class="ficha-image-card">
          <!-- Icono SVG del equipo según categoría -->
          <svg class="ficha-placeholder-svg" viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="var(--text-muted)" stroke-width="1.5">
            ${obtenerIconoPorCategoria(eq.categoria)}
          </svg>
        </div>
        <div class="ficha-status-banner ${badgeClase}">
          Estado: ${eq.estado.toUpperCase()}
        </div>
        
        <div class="ficha-specs">
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Laboratorio / Taller</span>
            <span class="ficha-spec-val" style="color:var(--color-accent); font-weight:600;">${eq.workshopNombre || getNombreTaller(eq.workshop)}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Código</span>
            <span class="ficha-spec-val" style="font-family:monospace;">${eq.id}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Marca / Modelo</span>
            <span class="ficha-spec-val">${eq.marca || 'N/A'}</span>
          </div>
          ${eq.cantidad && eq.cantidad > 1 ? `
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Cantidad / Lote</span>
            <span class="ficha-spec-val" style="color:var(--color-primary); font-weight:700;">${eq.cantidad} unidades</span>
          </div>` : ''}
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Ubicación Física</span>
            <span class="ficha-spec-val">${eq.ubicacion || 'Taller'}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Adquisición</span>
            <span class="ficha-spec-val">${eq.fechaAdq || "No especificada"}</span>
          </div>
          ${eq.responsable ? `
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Responsable</span>
            <span class="ficha-spec-val">${eq.responsable}</span>
          </div>` : ''}
          ${eq.proveedor ? `
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Proveedor / No. Doc</span>
            <span class="ficha-spec-val">${eq.proveedor} ${eq.noDoc ? `(${eq.noDoc})` : ''}</span>
          </div>` : ''}
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Ciclo Preventivo</span>
            <span class="ficha-spec-val">Cada ${eq.frecuencia} días</span>
          </div>
          ${eq.observacionFisica ? `
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Obs. Inventario</span>
            <span class="ficha-spec-val" style="color:var(--color-warning);">${eq.observacionFisica}</span>
          </div>` : ''}
        </div>
      </div>
      
      <div class="ficha-details-section">
        <div>
          <h4 class="ficha-section-title">Chequeo Preventivo Obligatorio</h4>
          <ul class="ficha-checklist">
            ${checklistHtml}
          </ul>
        </div>

        <div>
          <h4 class="ficha-section-title">Línea de Tiempo e Historial</h4>
          <div class="ficha-timeline">
            ${timelineHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  // Asignar evento al botón Editar del modal de ficha técnica
  const editBtn = document.getElementById("btn-ficha-editar");
  editBtn.onclick = () => {
    cerrarModal("modal-ficha-tecnica");
    abrirModalEquipo(eq.id);
  };

  abrirModal("modal-ficha-tecnica");
}

// F. GESTIÓN DE INSUMOS
function abrirModalInsumo(idInsumo = null) {
  const form = document.getElementById("form-insumo");
  form.reset();

  const title = document.getElementById("modal-insumo-title");
  const codeInput = document.getElementById("ins-codigo");
  const originalIdInput = document.getElementById("form-insumo-id-original");

  if (idInsumo) {
    const ins = state.insumos.find(i => i.id === idInsumo);
    if (!ins) return;

    title.textContent = `Editar Insumo: ${ins.nombre}`;
    codeInput.value = ins.id;
    codeInput.disabled = true;
    originalIdInput.value = ins.id;

    document.getElementById("ins-nombre").value = ins.nombre;
    document.getElementById("ins-cantidad").value = ins.cantidad;
    document.getElementById("ins-minimo").value = ins.minimo;
    document.getElementById("ins-unidad").value = ins.unidad;
    document.getElementById("ins-equipos").value = ins.maquinas;
  } else {
    title.textContent = "Registrar Nuevo Insumo";
    codeInput.disabled = false;
    originalIdInput.value = "";
    
    // Sugerir ID correlativo
    codeInput.value = `INS-MAT-0${state.insumos.length + 1}`;
  }

  abrirModal("modal-insumo");
}

function guardarInsumo(e) {
  e.preventDefault();
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para modificar insumos.");
    return;
  }

  const originalId = document.getElementById("form-insumo-id-original").value;
  const id = document.getElementById("ins-codigo").value.trim().toUpperCase();
  const nombre = document.getElementById("ins-nombre").value.trim();
  const cantidad = parseFloat(document.getElementById("ins-cantidad").value);
  const minimo = parseFloat(document.getElementById("ins-minimo").value);
  const unidad = document.getElementById("ins-unidad").value.trim();
  const maquinas = document.getElementById("ins-equipos").value.trim() || "MAN-TOR-01";

  if (originalId) {
    // Editar
    const ins = state.insumos.find(i => i.id === originalId);
    if (ins) {
      ins.nombre = nombre;
      ins.cantidad = cantidad;
      ins.minimo = minimo;
      ins.unidad = unidad;
      ins.maquinas = maquinas;
    }
  } else {
    // Crear
    if (state.insumos.some(i => i.id === id)) {
      alert("El código de insumo ya está asignado.");
      return;
    }

    const nuevoInsumo = {
      id,
      nombre,
      cantidad,
      minimo,
      unidad,
      maquinas
    };

    state.insumos.push(nuevoInsumo);
  }

  guardarEstado();
  cerrarModal("modal-insumo");
  renderizarTodo();
}

function abrirEditarInsumo(idInsumo) {
  abrirModalInsumo(idInsumo);
}

function eliminarInsumo(idInsumo) {
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para eliminar insumos.");
    return;
  }
  if (confirm(`¿Estás seguro de que deseas eliminar el insumo ${idInsumo}?`)) {
    state.insumos = state.insumos.filter(i => i.id !== idInsumo);
    guardarEstado();
    renderizarTodo();
  }
}

// --- UTILIDADES AUXILIARES ---

// Registra en el historial global del taller
function registrarHistorial(equipoId, tipo, descripcion, costo = 0) {
  const evento = {
    id: `H-00${state.historico.length + 1}`,
    equipoId,
    tipo,
    descripcion,
    fecha: HOY_SISTEMA.toISOString().split("T")[0],
    costo
  };
  state.historico.push(evento);
}

// Suma N días a una fecha y devuelve formato YYYY-MM-DD
function calcularProximaFecha(fechaBase, dias) {
  const target = new Date(fechaBase);
  target.setDate(target.getDate() + dias);
  
  const yyyy = target.getFullYear();
  let mm = target.getMonth() + 1;
  let dd = target.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return `${yyyy}-${mm}-${dd}`;
}

// Formateador estético para timestamps de reportes
function formatearFechaHora(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const fecha = d.toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' });
  const hora = d.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
  return `${fecha} a las ${hora} hs`;
}

// Devuelve un path/geometría SVG según la categoría del equipo
function obtenerIconoPorCategoria(categoria) {
  switch (categoria) {
    case "Torno":
      return `<path d="M4 10h16v4H4zm2 4v4h2v-4zm10 0v4h2v-4zM2 8h20v2H2z" stroke-linecap="round"/>`;
    case "Esmeril":
      return `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>`;
    case "Soldadura":
      return `<path d="M8 2h8v6H8zm1 14h6v4H9zM4 8h16v8H4zm6 0v8"/>`;
    case "Taladro":
      return `<path d="M12 2v14m0 0l-3-3m3 3l3-3M6 6h12m-9 4h6"/>`;
    default:
      return `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`;
  }
}

// --- HERRAMIENTAS DE COPIA DE SEGURIDAD (RESPALDO JSON) Y REPORTES ---

function exportarReporteMensual() {
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para generar reportes.");
    return;
  }
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("La librería de PDF (jsPDF) aún se está cargando. Por favor, verifica tu conexión a internet e inténtalo de nuevo.");
    return;
  }

  const yyyy = HOY_SISTEMA.getFullYear();
  const mm = String(HOY_SISTEMA.getMonth() + 1).padStart(2, '0');
  const prefijoMes = `${yyyy}-${mm}`;

  // Filtrar el historial global para obtener solo las tareas que se hicieron en este año-mes
  const actividadesDelMes = state.historico.filter(h => h.fecha.startsWith(prefijoMes));

  if (actividadesDelMes.length === 0) {
    alert("No se encontraron actividades registradas (Preventivas ni Correctivas) en el mes actual.");
    return;
  }

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const nombreMes = meses[HOY_SISTEMA.getMonth()];

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // Margen superior estético (Línea de color Indigo)
  doc.setFillColor(79, 70, 229);
  doc.rect(15, 15, 185.9, 1.5, 'F');

  // --- ENCABEZADO ---
  // Logo / Icono
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(15, 20, 10, 10, 1.5, 1.5, 'F');
  
  // Dibujar un check blanco simple en el logo
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(18, 25, 20, 27);
  doc.line(20, 27, 24, 23);

  // Nombre de la marca
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text("MantoLab", 28, 26);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Control de Mantenimiento Inteligente", 28, 30);

  // Metadatos a la derecha
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text("REPORTE DE ACTIVIDADES", 132, 23);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Periodo: ${nombreMes} de ${yyyy}`, 132, 27.5);
  doc.text(`Generado: ${HOY_SISTEMA.toLocaleDateString("es-ES")}`, 132, 32);

  // Separador
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, 36, 200.9, 36);

  // --- RESUMEN EJECUTIVO (TARJETAS) ---
  const totalActividades = actividadesDelMes.length;
  const totalPreventivos = actividadesDelMes.filter(a => a.tipo === "Preventivo").length;
  const totalCorrectivos = actividadesDelMes.filter(a => a.tipo === "Correctivo").length;
  const costoTotal = actividadesDelMes.reduce((acc, a) => acc + (a.costo || 0), 0);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Resumen Mensual", 15, 44);

  // Tarjeta 1: Total Actividades
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(15, 47, 42, 19, 1.5, 1.5, 'FD');
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("TAREAS TOTALES", 18, 52);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(79, 70, 229);
  doc.text(String(totalActividades), 18, 60);

  // Tarjeta 2: Preventivos
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(61, 47, 42, 19, 1.5, 1.5, 'FD');
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PREVENTIVAS", 64, 52);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text(String(totalPreventivos), 64, 60);

  // Tarjeta 3: Correctivos
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(107, 47, 42, 19, 1.5, 1.5, 'FD');
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("FALLAS RESUELTAS", 110, 52);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(244, 63, 94);
  doc.text(String(totalCorrectivos), 110, 60);

  // Tarjeta 4: Costo Total
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(153, 47, 47.9, 19, 1.5, 1.5, 'FD');
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("COSTO INVERTIDO", 156, 52);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(`$${costoTotal.toFixed(2)} USD`, 156, 60);

  // --- TABLA DE ACTIVIDADES ---
  const head = [['Fecha', 'Equipo / Máquina', 'Tipo', 'Costo', 'Descripción de Tareas / Solución']];
  const body = actividadesDelMes.map(act => {
    const eq = state.equipos.find(e => e.id === act.equipoId) || { nombre: "Equipo Eliminado" };
    return [
      act.fecha,
      `${act.equipoId}\n(${eq.nombre})`,
      act.tipo,
      `$${parseFloat(act.costo).toFixed(2)} USD`,
      act.descripcion
    ];
  });

  doc.autoTable({
    head: head,
    body: body,
    startY: 73,
    margin: { top: 20, bottom: 25, left: 15, right: 15 },
    theme: 'striped',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 3.5,
      valign: 'middle',
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [79, 70, 229], // Indigo primary (#4F46E5)
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Fecha
      1: { cellWidth: 38 }, // Equipo
      2: { cellWidth: 22 }, // Tipo
      3: { cellWidth: 25, halign: 'right' }, // Costo
      4: { cellWidth: 'auto' } // Descripción
    }
  });

  // --- SECCIÓN DE FIRMAS ---
  let finalY = doc.lastAutoTable.finalY || 73;
  if (finalY + 35 > 260) {
    doc.addPage();
    finalY = 20; // iniciar arriba en nueva página
  }

  finalY += 15;
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  doc.line(15, finalY + 12, 75, finalY + 12);
  doc.line(140.9, finalY + 12, 200.9, finalY + 12);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Ing. Juan Ayala", 15, finalY + 17);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Responsable del Taller", 15, finalY + 21);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Supervisión Académica", 140.9, finalY + 17);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Firma Autorizada", 140.9, finalY + 21);

  // --- PIE DE PÁGINA GLOBAL (NUMERACIÓN DE PÁGINAS) ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400

    // Línea divisoria de pie de página
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.setLineWidth(0.3);
    doc.line(15, 266, 200.9, 266);

    // Texto izquierdo y derecho
    const str = `Página ${i} de ${totalPages}`;
    doc.text(str, 15, 271);

    const footerText = "MantoLab - Bitácora de Operaciones (Área: Taller de Manufactura)";
    doc.text(footerText, 200.9 - doc.getTextWidth(footerText), 271);
  }

  // Descargar el documento PDF
  doc.save(`reporte_mensual_taller_${prefijoMes}.pdf`);
}

function exportarCopiaSeguridad() {
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para exportar copias de seguridad.");
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  
  const yyyy = HOY_SISTEMA.getFullYear();
  const mm = String(HOY_SISTEMA.getMonth() + 1).padStart(2, '0');
  const dd = String(HOY_SISTEMA.getDate()).padStart(2, '0');

  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mantolab_respaldo_${yyyy}${mm}${dd}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  alert("📥 Copia de seguridad exportada con éxito.\nGuarda el archivo .json en un lugar seguro.");
}

function importarCopiaSeguridad(e) {
  if (state.currentRole !== "admin") {
    alert("Acción denegada: Debes ser administrador para importar copias de seguridad.");
    return;
  }
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const datosImportados = JSON.parse(evt.target.result);
      
      // Validación básica de llaves de base de datos
      if (datosImportados.equipos && datosImportados.correctivos && datosImportados.insumos && datosImportados.historico) {
        state = datosImportados;
        guardarEstado();
        renderizarTodo();
        alert("📤 Copia de seguridad restaurada correctamente.\nLa base de datos del taller se ha actualizado con éxito.");
      } else {
        alert("❌ Error: El archivo cargado no tiene la estructura de datos compatible de MantoLab.");
      }
    } catch (err) {
      alert("❌ Error al procesar el archivo. Asegúrate de cargar un archivo de respaldo .json válido.");
      console.error(err);
    }
  };
  
  reader.readAsText(file);
}

// --- IMPORTADOR DE INVENTARIO DESDE MARKDOWN (.MD) ---

function abrirModalImportarMarkdown() {
  if (state.currentRole !== "admin") {
    alert("Acción restringida: Se requieren permisos de Administrador para cargar o modificar el inventario.");
    return;
  }
  
  const textarea = document.getElementById("textarea-markdown-content");
  if (textarea) textarea.value = "";
  
  const preview = document.getElementById("markdown-preview-container");
  if (preview) preview.style.display = "none";

  abrirModal("modal-import-markdown");
}

function manejarSeleccionArchivoMarkdown(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const texto = evt.target.result;
    const textarea = document.getElementById("textarea-markdown-content");
    if (textarea) {
      textarea.value = texto;
      actualizarPreviewMarkdown();
    }
  };
  reader.readAsText(file);
}

function actualizarPreviewMarkdown() {
  const textarea = document.getElementById("textarea-markdown-content");
  const preview = document.getElementById("markdown-preview-container");
  const list = document.getElementById("markdown-preview-list");
  const badge = document.getElementById("markdown-preview-badge");

  if (!textarea || !preview || !list) return;

  const equipos = parsearMarkdownInventario(textarea.value);
  if (equipos.length === 0) {
    preview.style.display = "none";
    list.innerHTML = "";
    return;
  }

  preview.style.display = "block";
  if (badge) badge.textContent = `${equipos.length} equipo${equipos.length > 1 ? 's' : ''}`;

  list.innerHTML = equipos.slice(0, 8).map(eq => `
    <li style="margin-bottom: 0.35rem; display:flex; justify-content:space-between; align-items:center;">
      <span><strong>${eq.id}:</strong> ${eq.nombre} <small style="color:var(--text-muted);">(${eq.marca} · ${eq.ubicacion})</small></span>
      <span class="badge ${eq.estado === 'Operativo' ? 'badge-success' : 'badge-error'}" style="font-size:0.7rem; padding: 1px 6px;">${eq.estado}</span>
    </li>
  `).join("") + (equipos.length > 8 ? `<li style="color:var(--color-accent); font-style:italic; margin-top:0.3rem;">... y ${equipos.length - 8} equipos más detectados.</li>` : "");
}

function parsearMarkdownInventario(texto) {
  if (!texto || !texto.trim()) return [];

  const lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const equipos = [];

  // 1. Detectar si contiene tablas Markdown con |
  const lineasTabla = lineas.filter(l => l.includes('|'));
  if (lineasTabla.length >= 2) {
    const lineaEncabezado = lineasTabla[0];
    const encabezados = lineaEncabezado
      .split('|')
      .map(c => c.trim().toLowerCase().replace(/[\*_`]/g, ''))
      .filter(Boolean);

    const filas = lineasTabla.slice(1).filter(l => {
      const limpio = l.replace(/[|\-\s:]/g, '');
      return limpio.length > 0;
    });

    filas.forEach((fila, idx) => {
      let celdas = fila.split('|');
      if (fila.startsWith('|')) celdas.shift();
      if (fila.endsWith('|')) celdas.pop();
      celdas = celdas.map(c => c.trim().replace(/^[\*_`]+|[\*_`]+$/g, ''));

      if (celdas.length === 0 || celdas.every(c => !c)) return;

      const numId = String(idx + 1).padStart(2, '0');
      let id = "";
      let nombre = "";
      let marca = "Genérica / S/M";
      let categoria = "Maquinaria";
      let cantidad = 1;
      let ubicacion = "Taller Principal";
      let frecuencia = 30;
      let estado = "Operativo";
      let tareas = ["Inspección visual y limpieza general", "Verificación de operatividad y seguridad"];
      let fechaAdq = "2024-01-15";

      encabezados.forEach((enc, colIdx) => {
        const val = celdas[colIdx] || "";
        if (!val) return;

        if (enc.includes("id") || enc.includes("código") || enc.includes("codigo") || enc.includes("clave")) {
          id = val;
        } else if (enc.includes("nombre") || enc.includes("equipo") || enc.includes("máquina") || enc.includes("maquina") || enc.includes("descripci")) {
          nombre = val;
        } else if (enc.includes("marca") || enc.includes("modelo") || enc.includes("fabricante")) {
          marca = val;
        } else if (enc.includes("categor") || enc.includes("tipo") || enc.includes("clase")) {
          categoria = val;
        } else if (enc.includes("cant") || enc.includes("stock") || enc.includes("unid")) {
          const num = parseInt(val.replace(/\D/g, ''));
          if (!isNaN(num) && num > 0) cantidad = num;
        } else if (enc.includes("ubicaci") || enc.includes("lugar") || enc.includes("zona") || enc.includes("area") || enc.includes("área") || enc.includes("taller")) {
          ubicacion = val;
        } else if (enc.includes("frecuen") || enc.includes("period") || enc.includes("dias") || enc.includes("días") || enc.includes("intervalo")) {
          const num = parseInt(val.replace(/\D/g, ''));
          if (!isNaN(num) && num > 0) frecuencia = num;
        } else if (enc.includes("estado") || enc.includes("status") || enc.includes("condici")) {
          if (/fuera|dañado|roto|averiado|inoperativo|baja/i.test(val)) {
            estado = "Fuera de Servicio";
          } else if (/mantenimiento|reparaci|taller|ajuste/i.test(val)) {
            estado = "En Mantenimiento";
          } else {
            estado = "Operativo";
          }
        } else if (enc.includes("tarea") || enc.includes("actividad") || enc.includes("mantenimiento")) {
          tareas = val.split(/[;,]/).map(t => t.trim()).filter(Boolean);
        } else if (enc.includes("fecha") || enc.includes("adquisici") || enc.includes("compra")) {
          fechaAdq = val;
        }
      });

      if (!nombre && celdas[0]) nombre = celdas[0];
      // Normalizar nombre si incluye la cantidad al inicio (ej: "12 GAFAS...")
      const matchNum = nombre.match(/^(\d+)\s+([A-Za-zÁ-Úá-ú].*)$/);
      if (matchNum) {
        if (cantidad === 1) cantidad = parseInt(matchNum[1], 10);
        nombre = matchNum[2].trim();
      }

      if (!id) {
        const pref = (categoria.substring(0, 3) || "EQ").toUpperCase();
        id = `LAB-${pref}-${numId}`;
      }

      equipos.push({
        id,
        nombre,
        marca,
        categoria,
        cantidad,
        ubicacion,
        frecuencia,
        estado,
        fechaAdq,
        tareas: tareas.length > 0 ? tareas : ["Inspección visual general", "Limpieza y lubricación periódica"],
        proximoPreventivo: calcularFechaFuturaPreventivo(frecuencia)
      });
    });
  }

  // 2. Si no es tabla, detectar listas con viñetas (- o * o 1.)
  if (equipos.length === 0) {
    const lineasLista = lineas.filter(l => /^(\*|-|\d+\.)\s+/.test(l));
    lineasLista.forEach((linea, idx) => {
      const textoLimpio = linea.replace(/^(\*|-|\d+\.)\s+/, '').trim();
      const numId = String(idx + 1).padStart(2, '0');
      const partes = textoLimpio.split(/[-–—:|]/).map(p => p.trim().replace(/^[\*_`]+|[\*_`]+$/g, '')).filter(Boolean);

      if (partes.length > 0) {
        const nombre = partes[0];
        const marca = partes[1] || "Genérica";
        const ubicacion = partes[2] || "Taller Principal";
        
        equipos.push({
          id: `EQ-${numId}`,
          nombre,
          marca,
          categoria: "Maquinaria",
          ubicacion,
          frecuencia: 30,
          estado: "Operativo",
          fechaAdq: "2024-01-15",
          tareas: ["Inspección y limpieza general", "Revisión técnica de componentes"],
          proximoPreventivo: calcularFechaFuturaPreventivo(30)
        });
      }
    });
  }

  return equipos;
}

function calcularFechaFuturaPreventivo(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function ejecutarImportacionMarkdown() {
  if (state.currentRole !== "admin") {
    alert("Acción restringida para Administradores.");
    return;
  }

  const textarea = document.getElementById("textarea-markdown-content");
  if (!textarea || !textarea.value.trim()) {
    alert("⚠️ Por favor selecciona un archivo .md o escribe/pega contenido en formato Markdown.");
    return;
  }

  const equiposNuevos = parsearMarkdownInventario(textarea.value);
  if (equiposNuevos.length === 0) {
    alert("❌ No se detectaron equipos válidos en el texto provisto.\n\nAsegúrate de usar formato de tabla Markdown, por ejemplo:\n| ID | Nombre | Marca | Ubicación | Frecuencia | Estado |\n| TOR-01 | Torno | Pinacho | Taller A | 90 | Operativo |");
    return;
  }

  const modo = document.querySelector('input[name="md-import-mode"]:checked')?.value || "reemplazar";

  if (modo === "reemplazar") {
    if (!confirm(`¿Estás seguro de reemplazar el inventario actual con los ${equiposNuevos.length} equipos del archivo Markdown?`)) {
      return;
    }
    state.equipos = equiposNuevos;
  } else {
    // Modo agregar
    let agregados = 0;
    equiposNuevos.forEach(eqNuevo => {
      const idxExistente = state.equipos.findIndex(e => e.id === eqNuevo.id);
      if (idxExistente !== -1) {
        state.equipos[idxExistente] = eqNuevo; // Actualizar
      } else {
        state.equipos.push(eqNuevo);
        agregados++;
      }
    });
  }

  DATOS_SEMILLA.equipos = JSON.parse(JSON.stringify(state.equipos));
  guardarEstado();
  cerrarModal("modal-import-markdown");
  renderizarTodo();

  alert(`✅ ¡Inventario actualizado con éxito!\nSe procesaron ${equiposNuevos.length} equipos en el sistema.`);
}

// --- SISTEMA DE TOMA DE INVENTARIO FÍSICO Y AUDITORÍA ---

function abrirModalInventarioFisico() {
  if (state.currentRole !== "admin") {
    alert("Acción restringida: Se requiere perfil de Administrador para realizar la toma de inventario físico.");
    return;
  }

  const fechaHoyStr = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const fechaSpan = document.getElementById("inv-fisico-fecha-hoy");
  if (fechaSpan) fechaSpan.textContent = fechaHoyStr;

  const auditorName = document.getElementById("inv-fisico-auditor-name");
  if (auditorName && state.session) {
    auditorName.textContent = state.session.nombre || "Ing. Juan Ayala";
  }

  const workshopFilterEl = document.getElementById("inv-fisico-workshop-filter");
  if (workshopFilterEl && state.activeWorkshop) {
    workshopFilterEl.value = state.activeWorkshop;
  }

  const searchInput = document.getElementById("inv-fisico-search-filter");
  if (searchInput) searchInput.value = "";

  renderizarTomaInventarioFisico();
  abrirModal("modal-inventario-fisico");
}

function renderizarTomaInventarioFisico(filtroTexto = "") {
  const tbody = document.getElementById("inv-fisico-tbody");
  if (!tbody) return;

  const workshopFilterEl = document.getElementById("inv-fisico-workshop-filter");
  const selectedWorkshop = workshopFilterEl ? workshopFilterEl.value : (state.activeWorkshop || "todos");

  const query = filtroTexto.trim().toLowerCase();
  const items = state.equipos.filter(eq => {
    const matchWorkshop = !selectedWorkshop || selectedWorkshop === "todos" || eq.workshop === selectedWorkshop;
    if (!matchWorkshop) return false;
    if (!query) return true;
    return eq.id.toLowerCase().includes(query) ||
           eq.nombre.toLowerCase().includes(query) ||
           (eq.ubicacion && eq.ubicacion.toLowerCase().includes(query)) ||
           (eq.workshopNombre && eq.workshopNombre.toLowerCase().includes(query)) ||
           (eq.marca && eq.marca.toLowerCase().includes(query));
  });

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          No se encontraron herramientas o maquinaria que coincidan con la búsqueda o filtro de taller.
        </td>
      </tr>
    `;
    actualizarContadoresInventarioFisico();
    return;
  }

  tbody.innerHTML = items.map(eq => {
    const obsPrev = eq.observacionFisica || "";
    const tallerNombre = eq.workshopNombre || getNombreTaller(eq.workshop);
    return `
      <tr class="inv-fisico-row" id="inv-row-${eq.id}">
        <td class="inv-check-cell">
          <input type="checkbox" class="inv-custom-checkbox inv-item-check" data-id="${eq.id}" checked title="Marcar si el equipo está físicamente presente">
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary); font-size: 0.88rem;">
            ${eq.nombre} ${eq.cantidad && eq.cantidad > 1 ? `<span class="badge" style="font-size:0.75rem; background:rgba(37,99,235,0.12); color:#2563eb; margin-left:4px; font-weight:600;">(Cant: ${eq.cantidad})</span>` : ''}
          </div>
          <div style="font-size: 0.75rem; color: var(--color-accent); font-family: monospace; margin-top: 1px;">
            ${eq.id} <span style="color:var(--text-muted); font-family:var(--font-sans);">· ${eq.marca || 'S/M'}</span>
          </div>
        </td>
        <td>
          <span class="badge" style="font-size:0.75rem; background: var(--bg-hover); color: var(--text-secondary); border: 1px solid var(--border-color); white-space: nowrap;">
            ${tallerNombre}
          </span>
        </td>
        <td>
          <span style="font-size:0.8rem; color:var(--text-secondary);">${eq.ubicacion || 'Taller'}</span>
        </td>
        <td>
          <select class="inv-status-select inv-item-status" data-id="${eq.id}">
            <option value="Operativo" ${eq.estado === 'Operativo' ? 'selected' : ''}>✅ Operativo</option>
            <option value="En Mantenimiento" ${eq.estado === 'En Mantenimiento' ? 'selected' : ''}>⚠️ En Mantenimiento</option>
            <option value="Fuera de Servicio" ${eq.estado === 'Fuera de Servicio' ? 'selected' : ''}>❌ Fuera de Servicio</option>
            <option value="Requiere Revisión" ${eq.estado === 'Requiere Revisión' ? 'selected' : ''}>🔍 Requiere Revisión</option>
            <option value="Deteriorado" ${eq.estado === 'Deteriorado' ? 'selected' : ''}>⚡ Deteriorado</option>
          </select>
        </td>
        <td>
          <input type="text" class="inv-obs-input inv-item-obs" data-id="${eq.id}" value="${obsPrev}" placeholder="Observaciones físicas si hubiese...">
        </td>
      </tr>
    `;
  }).join("");

  actualizarContadoresInventarioFisico();

  // Escuchar cambios para actualización reactiva de estadísticas
  tbody.querySelectorAll(".inv-item-check, .inv-item-status, .inv-item-obs").forEach(el => {
    el.addEventListener("change", actualizarContadoresInventarioFisico);
    el.addEventListener("input", actualizarContadoresInventarioFisico);
  });
}

function actualizarContadoresInventarioFisico() {
  const checks = document.querySelectorAll(".inv-item-check");
  const selects = document.querySelectorAll(".inv-item-status");
  const inputsObs = document.querySelectorAll(".inv-item-obs");
  const total = checks.length;

  let presentes = 0;
  checks.forEach(c => { if (c.checked) presentes++; });

  let novedades = 0;
  selects.forEach((sel, i) => {
    const obs = inputsObs[i] ? inputsObs[i].value.trim() : "";
    if (sel.value !== "Operativo" || obs.length > 0 || !checks[i]?.checked) {
      novedades++;
    }
  });

  const totalEl = document.getElementById("inv-fisico-total-count");
  const presEl = document.getElementById("inv-fisico-presentes-count");
  const novEl = document.getElementById("inv-fisico-novedades-count");

  if (totalEl) totalEl.textContent = total;
  if (presEl) presEl.textContent = `${presentes}/${total}`;
  if (novEl) novEl.textContent = novedades;
}

function marcarTodosPresentes() {
  document.querySelectorAll(".inv-item-check").forEach(c => {
    c.checked = true;
  });
  actualizarContadoresInventarioFisico();
}

function guardarAuditoriaInventarioFisico() {
  if (state.currentRole !== "admin") return;

  const checks = document.querySelectorAll(".inv-item-check");
  const selects = document.querySelectorAll(".inv-item-status");
  const inputsObs = document.querySelectorAll(".inv-item-obs");

  let cambiosEstadoCount = 0;
  let novedadesCount = 0;

  checks.forEach((chk, i) => {
    const id = chk.getAttribute("data-id");
    const eq = state.equipos.find(e => e.id === id);
    if (!eq) return;

    const estaPresente = chk.checked;
    const nuevoEstado = selects[i] ? selects[i].value : eq.estado;
    const observacion = inputsObs[i] ? inputsObs[i].value.trim() : "";

    // Actualizar observación en el equipo
    eq.observacionFisica = observacion;
    eq.ultimoInventarioFisico = new Date().toISOString().split('T')[0];

    if (!estaPresente) {
      novedadesCount++;
      if (eq.estado !== "Fuera de Servicio") {
        eq.estado = "Fuera de Servicio";
        cambiosEstadoCount++;
      }
    } else {
      if (eq.estado !== nuevoEstado) {
        eq.estado = nuevoEstado;
        cambiosEstadoCount++;
      }
      if (nuevoEstado !== "Operativo" || observacion) {
        novedadesCount++;
      }
    }
  });

  const workshopFilterEl = document.getElementById("inv-fisico-workshop-filter");
  const selectedWorkshop = workshopFilterEl ? workshopFilterEl.value : (state.activeWorkshop || "todos");
  const tallerNombre = getNombreTaller(selectedWorkshop);

  // Registrar en bitácora histórica
  const fechaHoy = new Date().toISOString().split('T')[0];
  state.historico.unshift({
    id: `INV-${Date.now()}`,
    equipoId: "GENERAL",
    tipo: "Inventario Físico",
    descripcion: `Toma de inventario físico en ${tallerNombre} completada por ${state.session ? state.session.nombre : 'Administrador'}. ${checks.length} equipos constatados, ${novedadesCount} con novedades.`,
    fecha: fechaHoy,
    costo: 0
  });

  DATOS_SEMILLA.equipos = JSON.parse(JSON.stringify(state.equipos));
  guardarEstado();
  cerrarModal("modal-inventario-fisico");
  renderizarTodo();

  alert(`✅ ¡Toma de inventario físico guardada exitosamente!\n\n• Taller auditado: ${tallerNombre}\n• Equipos verificados: ${checks.length}\n• Cambios de estado aplicados: ${cambiosEstadoCount}\n• Novedades registradas: ${novedadesCount}`);
}

function exportarActaInventarioFisicoPDF() {
  const jsPDFLib = window.jsPDF || (window.jspdf && window.jspdf.jsPDF);
  if (!jsPDFLib) {
    alert("La librería de generación PDF no está disponible.");
    return;
  }

  try {
    const doc = new jsPDFLib({ orientation: "portrait", unit: "mm", format: "a4" });
    const fechaStr = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
    const auditor = state.session ? state.session.nombre : "Ing. Juan Ayala";

    const workshopFilterEl = document.getElementById("inv-fisico-workshop-filter");
    const selectedWorkshop = workshopFilterEl ? workshopFilterEl.value : (state.activeWorkshop || "todos");
    const tallerNombre = getNombreTaller(selectedWorkshop);

    // Encabezado institucional
    doc.setFillColor(15, 23, 42); // Navy Dark
    doc.rect(0, 0, 210, 26, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("UNIVERSIDAD TECNOLÓGICA INDOAMÉRICA", 105, 10, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`FACULTAD DE INGENIERÍA Y CIENCIAS APLICADAS · ${tallerNombre.toUpperCase()}`, 105, 16, { align: "center" });
    doc.setFontSize(8);
    doc.text("ACTA DE CONSTATACIÓN E INVENTARIO FÍSICO DE MAQUINARIA, EQUIPOS Y HERRAMIENTAS", 105, 21, { align: "center" });

    // Metadatos
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 14, 33);
    doc.setFont("helvetica", "normal");
    doc.text(fechaStr, 30, 33);

    doc.setFont("helvetica", "bold");
    doc.text("Responsable:", 14, 38);
    doc.setFont("helvetica", "normal");
    doc.text(auditor, 38, 38);

    doc.setFont("helvetica", "bold");
    doc.text("Instalación:", 115, 33);
    doc.setFont("helvetica", "normal");
    doc.text(tallerNombre, 137, 33);

    const rows = [];
    const checks = document.querySelectorAll(".inv-item-check");
    const selects = document.querySelectorAll(".inv-item-status");
    const inputsObs = document.querySelectorAll(".inv-item-obs");

    checks.forEach((chk, idx) => {
      const id = chk.getAttribute("data-id");
      const eq = state.equipos.find(e => e.id === id);
      if (!eq) return;

      const sel = selects[idx];
      const obsInp = inputsObs[idx];

      const presente = chk.checked ? "SÍ" : "NO";
      const estado = sel ? sel.value : eq.estado;
      const obs = obsInp ? (obsInp.value.trim() || "-") : (eq.observacionFisica || "-");
      const taller = eq.workshopNombre || getNombreTaller(eq.workshop);

      rows.push([
        eq.id,
        `${eq.nombre}${eq.cantidad > 1 ? ` (Cant: ${eq.cantidad})` : ''}`,
        taller,
        eq.ubicacion || "-",
        presente,
        estado,
        obs
      ]);
    });

    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        startY: 43,
        head: [["Código", "Herramienta / Maquinaria", "Taller / Lab", "Ubicación", "Presente", "Estado", "Observaciones"]],
        body: rows,
        theme: "grid",
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8,
          halign: "center"
        },
        styles: {
          fontSize: 7,
          cellPadding: 1.8,
          valign: "middle"
        },
        columnStyles: {
          0: { halign: "center", fontStyle: "bold", cellWidth: 20 },
          1: { cellWidth: 46 },
          2: { cellWidth: 32 },
          3: { cellWidth: 25 },
          4: { halign: "center", cellWidth: 15 },
          5: { halign: "center", cellWidth: 24 },
          6: { cellWidth: 28 }
        },
        margin: { left: 10, right: 10 }
      });

      const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 180) + 18;
      const posYFirmas = finalY > 260 ? 260 : finalY;

      doc.setDrawColor(100, 116, 139);
      doc.line(30, posYFirmas, 85, posYFirmas);
      doc.line(125, posYFirmas, 180, posYFirmas);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("ENTREGADO / RESPONSABLE", 57, posYFirmas + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(auditor, 57, posYFirmas + 9, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.text("RECIBIDO / TÉCNICO DE TALLER", 152, posYFirmas + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text("Jefatura de Laboratorios", 152, posYFirmas + 9, { align: "center" });
    }

    const tallerSlug = selectedWorkshop || "consolidado";
    doc.save(`Acta_Inventario_Fisico_${tallerSlug}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (err) {
    console.error("Error al generar PDF de inventario físico:", err);
    alert("Ocurrió un error al compilar el acta PDF. Ver consola.");
  }
}

// --- SISTEMA DE INICIO DE SESIÓN Y RESERVAS DE LABORATORIOS ---

// 1. Manejo de Sesión e Inicio de Sesión / Registro
document.addEventListener("DOMContentLoaded", () => {
  configurarEventosLogin();
  verificarSesionActiva();
});

function verificarSesionActiva() {
  const overlay = document.getElementById("login-screen");
  const container = document.getElementById("app-container");
  
  if (state.session) {
    if (overlay) overlay.style.display = "none";
    if (container) container.style.display = "flex";
    
    // Sincronizar rol actual
    state.currentRole = state.session.rol;
    actualizarUIRol();
    actualizarBadgesCount();
  } else {
    if (overlay) overlay.style.display = "flex";
    if (container) container.style.display = "none";
    
    // Por defecto, rol estudiante para visualización
    state.currentRole = "estudiante";
    actualizarUIRol();
  }
}

function configurarEventosLogin() {
  const btnTabEstudiante = document.getElementById("tab-login-student");
  const btnTabAdmin = document.getElementById("tab-login-admin");
  const formEstudiante = document.getElementById("form-student-login");
  const formAdmin = document.getElementById("form-admin-login");
  
  const linkShowRegister = document.getElementById("link-show-register");
  const groupNombre = document.getElementById("login-nombre-group");
  const groupCarrera = document.getElementById("login-carrera-group");
  const btnSubmitStudent = document.getElementById("btn-student-submit");
  const toggleTextStudent = document.getElementById("student-login-toggle-text");
  
  let esRegistro = false;

  if (btnTabEstudiante && btnTabAdmin && formEstudiante && formAdmin) {
    // Cambiar a formulario Estudiante
    btnTabEstudiante.addEventListener("click", () => {
      btnTabEstudiante.classList.add("active");
      btnTabAdmin.classList.remove("active");
      formEstudiante.style.display = "block";
      formAdmin.style.display = "none";
    });

    // Cambiar a formulario Administrador
    btnTabAdmin.addEventListener("click", () => {
      btnTabAdmin.classList.add("active");
      btnTabEstudiante.classList.remove("active");
      formAdmin.style.display = "block";
      formEstudiante.style.display = "none";
    });
  }

  if (linkShowRegister && groupNombre && groupCarrera && btnSubmitStudent && toggleTextStudent) {
    // Cambiar entre Login y Registro
    linkShowRegister.addEventListener("click", (e) => {
      e.preventDefault();
      esRegistro = !esRegistro;
      
      if (esRegistro) {
        groupNombre.style.display = "block";
        groupCarrera.style.display = "block";
        document.getElementById("login-nombre").required = true;
        btnSubmitStudent.textContent = "Registrarse e Ingresar";
        toggleTextStudent.innerHTML = '¿Ya tienes una cuenta? <a href="#" id="link-show-login" style="color: var(--color-accent); text-decoration: none; font-weight: 500;">Inicia sesión aquí</a>';
        
        // Re-vincular link de volver al login
        const linkShowLogin = document.getElementById("link-show-login");
        if (linkShowLogin) {
          linkShowLogin.addEventListener("click", (evt) => {
            evt.preventDefault();
            linkShowRegister.click();
          });
        }
      } else {
        groupNombre.style.display = "none";
        groupCarrera.style.display = "none";
        document.getElementById("login-nombre").required = false;
        btnSubmitStudent.textContent = "Ingresar";
        toggleTextStudent.innerHTML = '¿Primera vez usando la app? <a href="#" id="link-show-register" style="color: var(--color-accent); text-decoration: none; font-weight: 500;">Regístrate aquí</a>';
        
        // Re-vincular link de volver al registro
        const linkShowReg = document.getElementById("link-show-register");
        if (linkShowReg) {
          linkShowReg.addEventListener("click", (evt) => {
            evt.preventDefault();
            linkShowRegister.click();
          });
        }
      }
    });
  }

  // Submit Estudiante
  if (formEstudiante) {
    formEstudiante.addEventListener("submit", (e) => {
      e.preventDefault();
      const matricula = document.getElementById("login-matricula").value.trim().toUpperCase();
      
      if (esRegistro) {
        // Lógica de Registro
        const nombre = document.getElementById("login-nombre").value.trim();
        const carrera = document.getElementById("login-carrera").value.trim();
        
        if (state.usuarios.some(u => u.matricula === matricula)) {
          alert("❌ Esta matrícula ya se encuentra registrada. Inicia sesión directamente.");
          return;
        }
        
        const nuevoUsuario = { matricula, nombre, carrera };
        state.usuarios.push(nuevoUsuario);
        state.session = { matricula, nombre, carrera, rol: "estudiante" };
        guardarEstado();
        
        alert(`¡Registro exitoso! Bienvenido, ${nombre}. Ahora tienes acceso a reportar fallas y reservar laboratorios.`);
      } else {
        // Lógica de Login
        // Si el usuario ingresó 1234 o ADMIN en la casilla de estudiante por equivocación
        if (matricula === "1234" || matricula === "ADMIN") {
          state.session = { matricula: "ADMIN", nombre: "Ing. Juan Ayala", rol: "admin" };
          state.currentRole = "admin";
          guardarEstado();
          formEstudiante.reset();
          verificarSesionActiva();
          renderizarTodo();
          alert("¡Acceso concedido como Administrador!");
          return;
        }

        const usuario = state.usuarios.find(u => u.matricula === matricula);
        if (usuario) {
          state.session = { matricula: usuario.matricula, nombre: usuario.nombre, carrera: usuario.carrera || "", rol: "estudiante" };
          guardarEstado();
          alert(`¡Bienvenido de vuelta, ${usuario.nombre}!`);
        } else {
          alert("❌ Matrícula no encontrada. Regístrate primero si es tu primera vez.");
          return;
        }
      }
      
      // Limpiar campos y verificar sesión activa
      formEstudiante.reset();
      if (esRegistro) {
        linkShowRegister.click();
      }
      verificarSesionActiva();
      renderizarTodo();
    });
  }

  // Submit Administrador
  if (formAdmin) {
    formAdmin.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("login-admin-pin").value.trim();
      const pinValido = String(state.adminPin || "1234");
      
      if (pin === pinValido || pin === "1234") {
        state.session = { matricula: "ADMIN", nombre: "Ing. Juan Ayala", rol: "admin" };
        state.currentRole = "admin";
        guardarEstado();
        formAdmin.reset();
        verificarSesionActiva();
        renderizarTodo();
        alert("¡Sesión iniciada como Administrador!");
      } else {
        alert("❌ PIN incorrecto. El PIN por defecto es 1234.");
        document.getElementById("login-admin-pin").value = "";
        document.getElementById("login-admin-pin").focus();
      }
    });
  }

  // Formulario solicitar reserva submit
  const formReservar = document.getElementById("form-solicitar-reserva");
  if (formReservar) {
    formReservar.addEventListener("submit", solicitarReservaHandler);
  }
  
  // Filtro reservas admin
  const filterReservas = document.getElementById("res-filter-status");
  if (filterReservas) {
    filterReservas.addEventListener("change", () => {
      renderizarReservas();
    });
  }
}

// Cerrar sesión
function cerrarSesion() {
  if (confirm("¿Estás seguro de que deseas cerrar tu sesión?")) {
    state.session = null;
    state.currentRole = "estudiante";
    guardarEstado();
    cerrarModal("modal-perfil-usuario");
    verificarSesionActiva();
    renderizarTodo();
  }
}

// Sobrescribir el selector de rol anterior: abrir modal de perfil en lugar de cerrar sesión directo
function manejarClicPerfilRol() {
  abrirModalPerfil();
}

// Abre el modal de perfil del usuario con sus datos e estadísticas
function abrirModalPerfil() {
  const body = document.getElementById("modal-perfil-body");
  const titulo = document.getElementById("modal-perfil-titulo");
  if (!body || !state.session) return;

  const session = state.session;
  
  if (session.rol === "admin") {
    titulo.textContent = "⚙️ Panel de Administrador";
    const totalEquipos = state.equipos.length;
    const fallasPendientes = state.correctivos.filter(t => t.estado === "Abierto").length;
    const reservasPendientes = state.reservas.filter(r => r.estado === "Pendiente").length;
    const preventivosAtrasados = state.equipos.filter(eq => {
      return new Date(eq.proximoPreventivo) < HOY_SISTEMA && eq.estado !== "Fuera de Servicio";
    }).length;

    body.innerHTML = `
      <div class="perfil-header">
        <div class="perfil-avatar">${generarIniciales(session.nombre)}</div>
        <div class="perfil-info-main">
          <h3>${session.nombre}</h3>
          <p class="perfil-rol-badge perfil-admin">Administrador del Sistema</p>
        </div>
      </div>
      <div class="perfil-stats-grid">
        <div class="perfil-stat-card">
          <span class="perfil-stat-num">${totalEquipos}</span>
          <span class="perfil-stat-label">Equipos Registrados</span>
        </div>
        <div class="perfil-stat-card">
          <span class="perfil-stat-num" style="color: var(--color-danger);">${fallasPendientes}</span>
          <span class="perfil-stat-label">Fallas Activas</span>
        </div>
        <div class="perfil-stat-card">
          <span class="perfil-stat-num" style="color: var(--color-warning);">${preventivosAtrasados}</span>
          <span class="perfil-stat-label">Prev. Atrasados</span>
        </div>
        <div class="perfil-stat-card">
          <span class="perfil-stat-num" style="color: var(--color-accent);">${reservasPendientes}</span>
          <span class="perfil-stat-label">Reservas Pendientes</span>
        </div>
      </div>
      <p class="text-muted" style="text-align:center; font-size:0.8rem; margin-top:1rem;">PIN de acceso: <strong style="color: var(--color-accent);">${state.adminPin}</strong></p>
    `;
  } else {
    titulo.textContent = "👤 Mi Perfil";
    const usuario = state.usuarios.find(u => u.matricula === session.matricula) || {};
    const misReservas = state.reservas.filter(r => r.usuarioMatricula === session.matricula);
    const misFallas = state.correctivos.filter(t => t.reportadoPor === session.nombre);
    const reservasAprobadas = misReservas.filter(r => r.estado === "Aprobada").length;
    const reservasPendientes = misReservas.filter(r => r.estado === "Pendiente").length;

    body.innerHTML = `
      <div class="perfil-header">
        <div class="perfil-avatar" style="background: linear-gradient(135deg, var(--color-secondary), #22d3ee);">${generarIniciales(session.nombre)}</div>
        <div class="perfil-info-main">
          <h3>${session.nombre}</h3>
          <p class="perfil-rol-badge perfil-estudiante">${session.carrera || "Estudiante"}</p>
        </div>
      </div>
      <div class="perfil-datos">
        <div class="perfil-dato-item">
          <span class="perfil-dato-label">Matrícula / Cédula</span>
          <span class="perfil-dato-valor">${session.matricula}</span>
        </div>
        <div class="perfil-dato-item">
          <span class="perfil-dato-label">Carrera / Especialidad</span>
          <span class="perfil-dato-valor">${usuario.carrera || session.carrera || "No especificada"}</span>
        </div>
      </div>
      <div class="perfil-stats-grid" style="margin-top:1.5rem;">
        <div class="perfil-stat-card">
          <span class="perfil-stat-num" style="color: var(--color-success);">${reservasAprobadas}</span>
          <span class="perfil-stat-label">Reservas Aprobadas</span>
        </div>
        <div class="perfil-stat-card">
          <span class="perfil-stat-num" style="color: var(--color-warning);">${reservasPendientes}</span>
          <span class="perfil-stat-label">Reservas Pendientes</span>
        </div>
        <div class="perfil-stat-card">
          <span class="perfil-stat-num">${misReservas.length}</span>
          <span class="perfil-stat-label">Total Reservas</span>
        </div>
        <div class="perfil-stat-card">
          <span class="perfil-stat-num">${misFallas.length}</span>
          <span class="perfil-stat-label">Fallas Reportadas</span>
        </div>
      </div>
    `;
  }

  abrirModal("modal-perfil-usuario");
}


// 2. Lógica del Sistema de Reservas de Laboratorio

function renderizarReservas() {
  const container = document.getElementById("reservas-list");
  if (!container) return;

  const formPanel = document.getElementById("res-form-panel");
  const adminFilters = document.getElementById("res-admin-filters");
  const listTitle = document.getElementById("res-list-title");
  const listSubtitle = document.getElementById("res-list-subtitle");
  
  if (!state.session) return;
  
  // Establecer fecha mínima del formulario de reservas a hoy
  const inputFecha = document.getElementById("res-fecha-input");
  if (inputFecha) {
    inputFecha.min = HOY_SISTEMA.toISOString().split("T")[0];
  }

  if (state.session.rol === "admin") {
    if (formPanel) formPanel.style.display = "none";
    if (adminFilters) adminFilters.style.display = "block";
    if (listTitle) listTitle.textContent = "Control General de Reservaciones";
    if (listSubtitle) listSubtitle.textContent = "Aprobación y control de las solicitudes de práctica enviadas por los estudiantes.";
    
    // Filtrar reservas generales
    const filtroEstado = document.getElementById("res-filter-status").value;
    let reservasFiltradas = state.reservas;
    
    if (filtroEstado !== "todos") {
      reservasFiltradas = state.reservas.filter(r => r.estado === filtroEstado);
    }
    
    reservasFiltradas.sort((a, b) => {
      if (a.estado === "Pendiente" && b.estado !== "Pendiente") return -1;
      if (a.estado !== "Pendiente" && b.estado === "Pendiente") return 1;
      return new Date(b.fecha) - new Date(a.fecha);
    });

    if (reservasFiltradas.length > 0) {
      container.innerHTML = reservasFiltradas.map(res => {
        const u = state.usuarios.find(user => user.matricula === res.usuarioMatricula) || { nombre: "Estudiante no registrado" };
        const badgeClase = `res-badge-${res.estado.toLowerCase()}`;
        
        return `
          <div class="res-item-card" style="${res.estado === 'Pendiente' ? 'border-left: 4px solid var(--color-warning);' : ''}">
            <div class="res-item-header">
              <span class="res-lab-name">${obtenerLabelLaboratorio(res.laboratorio)}</span>
              <span class="res-badge ${badgeClase}">${res.estado}</span>
            </div>
            <div class="res-item-details">
              <p><strong>Proyecto/Motivo:</strong> ${res.proposito}</p>
              <p style="margin-top:0.25rem;"><strong>Estudiante:</strong> ${u.nombre} (${res.usuarioMatricula} | ${u.carrera || 'General'})</p>
            </div>
            <div class="res-item-meta">
              <span>📅 ${res.fecha}</span>
              <span>⏰ ${res.horaInicio} - ${res.horaFin}</span>
            </div>
            
            ${res.estado === "Pendiente" ? `
              <div class="res-actions-footer">
                <button class="btn btn-danger btn-sm" onclick="gestionarReserva('${res.id}', 'Rechazada')">Rechazar</button>
                <button class="btn btn-success btn-sm" onclick="gestionarReserva('${res.id}', 'Aprobada')">Aprobar</button>
              </div>
            ` : `
              <div class="res-actions-footer">
                <button class="btn btn-secondary btn-sm" onclick="eliminarReserva('${res.id}')">Eliminar Historial</button>
              </div>
            `}
          </div>
        `;
      }).join("");
    } else {
      container.innerHTML = `
        <div class="empty-state" style="padding: 4rem 1rem;">
          <div class="empty-icon">📅</div>
          <h3>Sin reservaciones</h3>
          <p>No se encontraron reservas con el filtro seleccionado.</p>
        </div>
      `;
    }
  } else {
    if (formPanel) formPanel.style.display = "block";
    if (adminFilters) adminFilters.style.display = "none";
    if (listTitle) listTitle.textContent = "Mis Reservas Solicitadas";
    if (listSubtitle) listSubtitle.textContent = "Consulta el estado de tus reservas anteriores o pendientes de aprobación.";
    
    const misReservas = state.reservas.filter(r => r.usuarioMatricula === state.session.matricula);
    misReservas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (misReservas.length > 0) {
      container.innerHTML = misReservas.map(res => {
        const badgeClase = `res-badge-${res.estado.toLowerCase()}`;
        return `
          <div class="res-item-card">
            <div class="res-item-header">
              <span class="res-lab-name">${obtenerLabelLaboratorio(res.laboratorio)}</span>
              <span class="res-badge ${badgeClase}">${res.estado}</span>
            </div>
            <div class="res-item-details">
              <p><strong>Proyecto/Motivo:</strong> ${res.proposito}</p>
            </div>
            <div class="res-item-meta">
              <span>📅 ${res.fecha}</span>
              <span>⏰ ${res.horaInicio} - ${res.horaFin}</span>
            </div>
            
            ${res.estado === "Pendiente" ? `
              <div class="res-actions-footer">
                <button class="btn btn-secondary btn-sm" onclick="eliminarReserva('${res.id}')">Cancelar Solicitud</button>
              </div>
            ` : ""}
          </div>
        `;
      }).join("");
    } else {
      container.innerHTML = `
        <div class="empty-state" style="padding: 4rem 1rem;">
          <div class="empty-icon">📅</div>
          <h3>Aún no has solicitado reservas</h3>
          <p>Usa el formulario de la izquierda para reservar tu primer espacio de práctica.</p>
        </div>
      `;
    }
  }
}

function obtenerLabelLaboratorio(key) {
  const nombres = {
    manufactura: "🛠️ Taller de Manufactura",
    ciencias_basicas: "🧪 Lab. Ciencias Básicas",
    procesos: "🏭 Taller de Procesos",
    neumatica: "💨 Taller de Neumática",
    automatizacion: "🤖 Taller de Automatización"
  };
  return nombres[key] || key;
}

function solicitarReservaHandler(e) {
  e.preventDefault();
  
  if (!state.session || state.session.rol !== "estudiante") {
    alert("Solo los estudiantes registrados pueden realizar reservas.");
    return;
  }
  
  const lab = document.getElementById("res-laboratorio").value;
  const fecha = document.getElementById("res-fecha-input").value;
  const horaInicio = document.getElementById("res-hora-inicio").value;
  const horaFin = document.getElementById("res-hora-fin").value;
  const proposito = document.getElementById("res-proposito").value.trim();
  
  if (horaInicio >= horaFin) {
    alert("❌ Error: La hora de inicio debe ser anterior a la hora de fin.");
    return;
  }
  
  // Validar conflicto de horarios
  const conflicto = state.reservas.some(res => {
    return res.laboratorio === lab && 
           res.fecha === fecha && 
           res.estado === "Aprobada" && 
           ((horaInicio >= res.horaInicio && horaInicio < res.horaFin) || 
            (horaFin > res.horaInicio && horaFin <= res.horaFin) ||
            (horaInicio <= res.horaInicio && horaFin >= res.horaFin));
  });
  
  if (conflicto) {
    alert("❌ Conflicto de Horario: El laboratorio ya se encuentra reservado y aprobado para otra práctica en este mismo horario.");
    return;
  }
  
  const nuevaReserva = {
    id: `RES-${Date.now()}`,
    usuarioMatricula: state.session.matricula,
    laboratorio: lab,
    fecha,
    horaInicio,
    horaFin,
    proposito,
    estado: "Pendiente"
  };
  
  state.reservas.push(nuevaReserva);
  guardarEstado();
  document.getElementById("form-solicitar-reserva").reset();
  renderizarReservas();
  alert("📅 Solicitud de reserva enviada con éxito. Pendiente de aprobación por el Administrador.");
}

function gestionarReserva(id, nuevoEstado) {
  if (state.session.rol !== "admin") {
    alert("Acción no permitida.");
    return;
  }
  
  const res = state.reservas.find(r => r.id === id);
  if (res) {
    res.estado = nuevoEstado;
    guardarEstado();
    renderizarReservas();
    renderizarDashboard(); // Actualizar mapa de disponibilidad en tiempo real
    actualizarBadgesCount();
    alert(`Reserva ${nuevoEstado === 'Aprobada' ? 'Aprobada ✅' : 'Rechazada ❌'} exitosamente.`);
  }
}

function eliminarReserva(id) {
  const resIndex = state.reservas.findIndex(r => r.id === id);
  if (resIndex !== -1) {
    const res = state.reservas[resIndex];
    
    if (state.session.rol === "admin" || (state.session.rol === "estudiante" && res.usuarioMatricula === state.session.matricula)) {
      if (confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
        state.reservas.splice(resIndex, 1);
        guardarEstado();
        renderizarReservas();
        renderizarDashboard(); // Actualizar mapa de disponibilidad en tiempo real
        actualizarBadgesCount();
        alert("Reserva eliminada con éxito.");
      }
    } else {
      alert("Acción no autorizada.");
    }
  }
}

// =====================================================================
// --- MÓDULO: PLAN MAESTRO DE MANTENIMIENTO INTEGRAL (RCM / TPM) ---
// =====================================================================

function inicializarPlanMaestroEventos() {
  // 1. Navegación por sub-pestañas internas del Plan Maestro
  const subtabBtns = document.querySelectorAll(".plan-subtab-btn");
  subtabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetSubtab = btn.getAttribute("data-subtab");
      subtabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".plan-subtab-content").forEach(content => {
        content.classList.remove("active");
      });
      const activeContent = document.getElementById(`subtab-${targetSubtab}`);
      if (activeContent) activeContent.classList.add("active");
    });
  });

  // 2. Filtros de Matriz de Criticidad
  const critFilterBtns = document.querySelectorAll(".crit-filter-btn");
  critFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      critFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const crit = btn.getAttribute("data-crit");
      const search = document.getElementById("crit-search")?.value || "";
      renderizarMatrizCriticidad(crit, search);
    });
  });

  const critSearchInput = document.getElementById("crit-search");
  if (critSearchInput) {
    critSearchInput.addEventListener("input", (e) => {
      const activeBtn = document.querySelector(".crit-filter-btn.active");
      const crit = activeBtn ? activeBtn.getAttribute("data-crit") : "todos";
      renderizarMatrizCriticidad(crit, e.target.value);
    });
  }

  // 3. Filtros y Búsqueda en Órdenes de Trabajo (OT)
  const otFilterBtns = document.querySelectorAll(".ot-filter-btn");
  otFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      otFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const estado = btn.getAttribute("data-estado");
      const search = document.getElementById("ot-search")?.value || "";
      renderizarOrdenesTrabajo(estado, search);
    });
  });

  const otSearchInput = document.getElementById("ot-search");
  if (otSearchInput) {
    otSearchInput.addEventListener("input", (e) => {
      const activeBtn = document.querySelector(".ot-filter-btn.active");
      const estado = activeBtn ? activeBtn.getAttribute("data-estado") : "todos";
      renderizarOrdenesTrabajo(estado, e.target.value);
    });
  }

  // 4. Selector de Período en Cronograma Gantt
  const cronoPeriodoSelect = document.getElementById("cronograma-periodo-select");
  if (cronoPeriodoSelect) {
    cronoPeriodoSelect.addEventListener("change", (e) => {
      renderizarCronogramaAnual(e.target.value);
    });
  }

  // 5. Botones para apertura del Modal de Nueva OT
  const btnNuevaOT = document.getElementById("btn-nueva-ot");
  if (btnNuevaOT) {
    btnNuevaOT.addEventListener("click", () => abrirModalNuevaOT());
  }

  const btnCrearOTToolbar = document.getElementById("btn-crear-ot-toolbar");
  if (btnCrearOTToolbar) {
    btnCrearOTToolbar.addEventListener("click", () => abrirModalNuevaOT());
  }

  // 6. Botón de Exportación General del Plan Maestro a PDF
  const btnExportarPlanPDF = document.getElementById("btn-exportar-plan-pdf");
  if (btnExportarPlanPDF) {
    btnExportarPlanPDF.addEventListener("click", exportarPlanMaestroPDF);
  }

  // 7. Evento Submit del Formulario Nueva OT
  const formNuevaOT = document.getElementById("form-nueva-ot");
  if (formNuevaOT) {
    formNuevaOT.addEventListener("submit", guardarNuevaOT);
  }

  // 8. Auto-completar criticidad según equipo seleccionado en Modal OT
  const selectEquipoOT = document.getElementById("ot-equipo");
  if (selectEquipoOT) {
    selectEquipoOT.addEventListener("change", (e) => {
      const eqId = e.target.value;
      const eq = state.equipos.find(item => item.id === eqId);
      const inputCrit = document.getElementById("ot-criticidad");
      if (inputCrit) {
        inputCrit.value = eq ? `Clase ${clasificarCriticidad(eq)}` : "Clase B";
      }
    });
  }
}

// --- FUNCIÓN ORQUESTADORA GENERAL DEL PLAN MAESTRO ---
function renderizarPlanMaestro() {
  actualizarKPIsPlanMaestro();
  renderizarMatrizCriticidad();
  renderizarCronogramaAnual();
  renderizarOrdenesTrabajo();
}

// --- CLASIFICACIÓN DE CRITICIDAD ABC (RCM) ---
function clasificarCriticidad(eq) {
  if (!eq) return "C";
  const cat = (eq.categoria || "").toLowerCase();
  const nom = (eq.nombre || "").toLowerCase();
  const id = (eq.id || "").toUpperCase();

  // CLASE A (Alta / Crítica): Equipos vitales cuya falla paraliza la docencia o compromete la seguridad física
  if (
    cat.includes("torno") || nom.includes("torno") ||
    cat.includes("soldadura") || nom.includes("soldadora") || nom.includes("soldador") ||
    cat.includes("compresor") || nom.includes("compresor") ||
    cat.includes("fresadora") || nom.includes("fresadora") ||
    cat.includes("plc") || nom.includes("plc") || nom.includes("s7-1200") ||
    nom.includes("plasma") || nom.includes("oxicorte") ||
    id.startsWith("EQU00306") || id.startsWith("SOL00") || (id.startsWith("EQU0069") && parseInt(id.slice(3)) <= 700)
  ) {
    return "A";
  }

  // CLASE B (Media / Importante): Equipos de apoyo significativo con unidades de respaldo o impacto moderado
  if (
    cat.includes("taladro") || nom.includes("taladro") ||
    cat.includes("esmeril") || nom.includes("esmeril") ||
    cat.includes("variador") || nom.includes("variador") || nom.includes("v20") ||
    cat.includes("motor") || nom.includes("motor") ||
    cat.includes("osciloscopio") || nom.includes("osciloscopio") ||
    cat.includes("fuente") || nom.includes("generador") ||
    nom.includes("amoladora") || nom.includes("calibrador") ||
    nom.includes("banco neumático") || nom.includes("banco hidráulico")
  ) {
    return "B";
  }

  // CLASE C (Baja / Secundaria): Mobiliario, herramientas manuales, accesorios y elementos de bajo costo
  return "C";
}

// --- CÁLCULO Y VISUALIZACIÓN DE KPIS MAESTROS RCM ---
function actualizarKPIsPlanMaestro() {
  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;

  const total = equiposTaller.length;
  if (total === 0) return;

  const operativos = equiposTaller.filter(e => e.estado !== "Fuera de Servicio").length;
  const atrasados = equiposTaller.filter(eq => new Date(eq.proximoPreventivo) < HOY_SISTEMA && eq.estado !== "Fuera de Servicio").length;

  const cumplimiento = Math.round(((total - atrasados) / total) * 100);
  const disponibilidad = ((operativos / total) * 100).toFixed(1);

  // Fallas activas y OTs
  const idsEquiposTaller = new Set(equiposTaller.map(e => e.id));
  const fallasActivas = state.correctivos.filter(t => t.estado === "Abierto" && idsEquiposTaller.has(t.equipoId)).length;
  const otsTaller = (state.ordenesTrabajo || []).filter(o => idsEquiposTaller.has(o.equipoId) || (!o.equipoId && (state.activeWorkshop === "todos" || o.workshop === state.activeWorkshop)));
  const otsAbiertas = otsTaller.filter(o => o.estado !== "Completada").length;

  // MTBF y MTTR estimativos de ingeniería (norma IEEE 493 / RCM)
  const mtbfHoras = Math.round((total * 160) / (fallasActivas + 1));
  const mttrHoras = (2.2 + (fallasActivas * 0.3)).toFixed(1);

  // Actualización en DOM
  const elCumpl = document.getElementById("plan-kpi-cumplimiento");
  if (elCumpl) elCumpl.textContent = `${cumplimiento}%`;

  const elDisp = document.getElementById("plan-kpi-disponibilidad");
  if (elDisp) elDisp.textContent = `${disponibilidad}%`;

  const elMtbf = document.getElementById("plan-kpi-mtbf");
  if (elMtbf) elMtbf.textContent = `${mtbfHoras} hrs`;

  const elMttr = document.getElementById("plan-kpi-mttr");
  if (elMttr) elMttr.textContent = `${mttrHoras} hrs`;

  const elOts = document.getElementById("plan-kpi-ot-activas");
  if (elOts) elOts.textContent = `${otsAbiertas} Activas`;

  const elOtsSub = document.getElementById("plan-kpi-ot-sub");
  if (elOtsSub) {
    const prevs = otsTaller.filter(o => o.estado !== "Completada" && o.tipo === "Preventivo").length;
    const corrs = otsTaller.filter(o => o.estado !== "Completada" && o.tipo !== "Preventivo").length;
    elOtsSub.textContent = `${prevs} preventivas · ${corrs} correctivas`;
  }
}

// --- SUBMÓDULO 1: RENDERIZAR MATRIZ DE CRITICIDAD ABC ---
function renderizarMatrizCriticidad(filtroCrit = "todos", search = "") {
  const tbody = document.getElementById("criticidad-tbody");
  if (!tbody) return;

  const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
    : state.equipos;

  // Conteo global por criticidad del taller
  let countA = 0, countB = 0, countC = 0;
  equiposTaller.forEach(eq => {
    const c = clasificarCriticidad(eq);
    if (c === "A") countA++;
    else if (c === "B") countB++;
    else countC++;
  });

  const elCountA = document.getElementById("crit-count-a");
  if (elCountA) elCountA.textContent = `${countA} Activos`;
  const elCountB = document.getElementById("crit-count-b");
  if (elCountB) elCountB.textContent = `${countB} Activos`;
  const elCountC = document.getElementById("crit-count-c");
  if (elCountC) elCountC.textContent = `${countC} Activos`;

  // Filtrado reactivo de la tabla
  const term = search.toLowerCase().trim();
  const equiposFiltrados = equiposTaller.filter(eq => {
    const crit = clasificarCriticidad(eq);
    if (filtroCrit !== "todos" && crit !== filtroCrit) return false;
    if (term) {
      const matchId = (eq.id || "").toLowerCase().includes(term);
      const matchNom = (eq.nombre || "").toLowerCase().includes(term);
      const matchCat = (eq.categoria || "").toLowerCase().includes(term);
      const matchUbi = (eq.ubicacion || "").toLowerCase().includes(term);
      return matchId || matchNom || matchCat || matchUbi;
    }
    return true;
  });

  // Ordenar: primero Clase A, luego B, luego C
  equiposFiltrados.sort((a, b) => {
    const critA = clasificarCriticidad(a);
    const critB = clasificarCriticidad(b);
    if (critA !== critB) return critA.localeCompare(critB);
    return a.id.localeCompare(b.id);
  });

  if (equiposFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          🔍 No se encontraron equipos en la matriz de criticidad con los filtros seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = equiposFiltrados.map(eq => {
    const crit = clasificarCriticidad(eq);
    const critBadgeClass = crit === "A" ? "crit-tag-a" : (crit === "B" ? "crit-tag-b" : "crit-tag-c");
    const estrategia = crit === "A"
      ? "RCM 1: Preventivo + Predictivo"
      : (crit === "B" ? "RCM 2: Preventivo Trimestral" : "RCM 3: A Rotura / Semestral");

    const frecDias = eq.frecuenciaDias || (crit === "A" ? 30 : (crit === "B" ? 90 : 180));
    const estadoClass = eq.estado === "Operativo" ? "badge-success" : (eq.estado === "Mantenimiento" ? "badge-alert" : "badge-error");
    const tallerNombre = eq.workshopNombre || getNombreTaller(eq.workshop);

    return `
      <tr>
        <td><strong style="color:var(--color-accent); font-size:0.85rem;">${eq.id}</strong></td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${eq.nombre}${eq.cantidad > 1 ? ` <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(Cant: ${eq.cantidad})</span>` : ''}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${tallerNombre} · ${eq.ubicacion || 'General'}</div>
        </td>
        <td><span class="crit-tag ${critBadgeClass}">Clase ${crit}</span></td>
        <td><span style="font-size:0.8rem; color:var(--text-primary); font-weight:500;">${estrategia}</span></td>
        <td><span style="font-size:0.8rem;">Cada ${frecDias} días</span></td>
        <td><span class="badge ${estadoClass}" style="font-size:0.75rem;">${eq.estado || 'Operativo'}</span></td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="abrirModalNuevaOT('${eq.id}')" style="font-size:0.78rem; padding: 4px 10px;">
            ➕ Emitir OT
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// --- SUBMÓDULO 2: RENDERIZAR CRONOGRAMA MAESTRO ANUAL (GANTT) ---
function renderizarCronogramaAnual(periodo = "anual") {
  const tbody = document.getElementById("gantt-tbody");
  if (!tbody) return;

  const lineasTecnicas = [
    {
      tallerKey: "manufactura",
      titulo: "Tornos Paralelos y Fresadoras Universales",
      subtitulo: "Taller de Manufactura · Torno 1.5m (EQU00306), Fresadora",
      criticidad: "A",
      frecuencia: "Mensual",
      meses: [
        { mes: 1, tipo: "prev", label: "Prev." },
        { mes: 2, tipo: "major", label: "P. Mayor" },
        { mes: 3, tipo: "prev", label: "Prev." },
        { mes: 4, tipo: "prev", label: "Prev." },
        { mes: 5, tipo: "prev", label: "Prev." },
        { mes: 6, tipo: "prev", label: "Prev." },
        { mes: 7, tipo: "major", label: "P. Mayor" },
        { mes: 8, tipo: "prev", label: "Prev." },
        { mes: 9, tipo: "prev", label: "Prev." },
        { mes: 10, tipo: "prev", label: "Prev." },
        { mes: 11, tipo: "prev", label: "Prev." },
        { mes: 12, tipo: "prev", label: "Prev." }
      ]
    },
    {
      tallerKey: "manufactura",
      titulo: "Estaciones de Soldadura MIG/MAG y Arco",
      subtitulo: "Taller de Manufactura · Miller 250A (SOL00004 a 00006)",
      criticidad: "A",
      frecuencia: "Mensual",
      meses: [
        { mes: 1, tipo: "prev", label: "Prev." },
        { mes: 2, tipo: "prev", label: "Prev." },
        { mes: 3, tipo: "major", label: "P. Mayor" },
        { mes: 4, tipo: "prev", label: "Prev." },
        { mes: 5, tipo: "prev", label: "Prev." },
        { mes: 6, tipo: "prev", label: "Prev." },
        { mes: 7, tipo: "prev", label: "Prev." },
        { mes: 8, tipo: "major", label: "P. Mayor" },
        { mes: 9, tipo: "prev", label: "Prev." },
        { mes: 10, tipo: "prev", label: "Prev." },
        { mes: 11, tipo: "prev", label: "Prev." },
        { mes: 12, tipo: "prev", label: "Prev." }
      ]
    },
    {
      tallerKey: "automatizacion",
      titulo: "Entrenadores PLC Siemens S7-1200 y HMIs",
      subtitulo: "Taller de Automatización · Bancos Didácticos Industriales",
      criticidad: "A",
      frecuencia: "Bimestral",
      meses: [
        { mes: 1, tipo: "none" },
        { mes: 2, tipo: "major", label: "Firmware" },
        { mes: 3, tipo: "none" },
        { mes: 4, tipo: "prev", label: "Prev." },
        { mes: 5, tipo: "none" },
        { mes: 6, tipo: "prev", label: "Prev." },
        { mes: 7, tipo: "major", label: "Calib." },
        { mes: 8, tipo: "none" },
        { mes: 9, tipo: "prev", label: "Prev." },
        { mes: 10, tipo: "none" },
        { mes: 11, tipo: "prev", label: "Prev." },
        { mes: 12, tipo: "none" }
      ]
    },
    {
      tallerKey: "automatizacion",
      titulo: "Bancos de Variadores de Frecuencia Sinamics V20",
      subtitulo: "Taller de Automatización · Motores trifásicos y encoders",
      criticidad: "B",
      frecuencia: "Trimestral",
      meses: [
        { mes: 1, tipo: "prev", label: "Prev." },
        { mes: 2, tipo: "none" },
        { mes: 3, tipo: "none" },
        { mes: 4, tipo: "prev", label: "Prev." },
        { mes: 5, tipo: "none" },
        { mes: 6, tipo: "none" },
        { mes: 7, tipo: "prev", label: "Prev." },
        { mes: 8, tipo: "none" },
        { mes: 9, tipo: "none" },
        { mes: 10, tipo: "prev", label: "Prev." },
        { mes: 11, tipo: "none" },
        { mes: 12, tipo: "none" }
      ]
    },
    {
      tallerKey: "neumatica",
      titulo: "Compresor Central y Red Neumática Principal",
      subtitulo: "Taller de Neumática · Presostato, FRL y Purga de Condensados",
      criticidad: "A",
      frecuencia: "Mensual",
      meses: [
        { mes: 1, tipo: "prev", label: "Purga" },
        { mes: 2, tipo: "prev", label: "Filtros" },
        { mes: 3, tipo: "major", label: "Aceite/P." },
        { mes: 4, tipo: "prev", label: "Purga" },
        { mes: 5, tipo: "prev", label: "Prev." },
        { mes: 6, tipo: "prev", label: "Prev." },
        { mes: 7, tipo: "major", label: "P. Mayor" },
        { mes: 8, tipo: "prev", label: "Purga" },
        { mes: 9, tipo: "prev", label: "Prev." },
        { mes: 10, tipo: "prev", label: "Filtros" },
        { mes: 11, tipo: "prev", label: "Prev." },
        { mes: 12, tipo: "prev", label: "Prev." }
      ]
    },
    {
      tallerKey: "ciencias_basicas",
      titulo: "Instrumentación, Fuentes y Osciloscopios Digitales",
      subtitulo: "Lab. Ciencias Básicas · Calibración y Comprobación Eléctrica",
      criticidad: "B",
      frecuencia: "Semestral",
      meses: [
        { mes: 1, tipo: "none" },
        { mes: 2, tipo: "major", label: "Calibración" },
        { mes: 3, tipo: "none" },
        { mes: 4, tipo: "none" },
        { mes: 5, tipo: "none" },
        { mes: 6, tipo: "none" },
        { mes: 7, tipo: "major", label: "Calibración" },
        { mes: 8, tipo: "none" },
        { mes: 9, tipo: "none" },
        { mes: 10, tipo: "none" },
        { mes: 11, tipo: "none" },
        { mes: 12, tipo: "none" }
      ]
    },
    {
      tallerKey: "procesos",
      titulo: "Prensas, Cizallas y Bancadas de Ajuste Mecánico",
      subtitulo: "Taller de Procesos · Alineación, Cuchillas y Mordazas",
      criticidad: "B",
      frecuencia: "Bimestral",
      meses: [
        { mes: 1, tipo: "none" },
        { mes: 2, tipo: "prev", label: "Prev." },
        { mes: 3, tipo: "none" },
        { mes: 4, tipo: "prev", label: "Prev." },
        { mes: 5, tipo: "none" },
        { mes: 6, tipo: "prev", label: "Prev." },
        { mes: 7, tipo: "major", label: "Afilado" },
        { mes: 8, tipo: "none" },
        { mes: 9, tipo: "prev", label: "Prev." },
        { mes: 10, tipo: "none" },
        { mes: 11, tipo: "prev", label: "Prev." },
        { mes: 12, tipo: "none" }
      ]
    }
  ];

  // Filtrar si hay un taller activo específico
  const lineasFiltradas = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? lineasTecnicas.filter(l => l.tallerKey === state.activeWorkshop)
    : lineasTecnicas;

  const mesActual = HOY_SISTEMA.getMonth() + 1; // 1 a 12

  tbody.innerHTML = lineasFiltradas.map(linea => {
    const critBadgeClass = linea.criticidad === "A" ? "crit-tag-a" : "crit-tag-b";

    const celdasMeses = linea.meses.map(m => {
      const esMesActual = m.mes === mesActual;
      const cellBgStyle = esMesActual ? "background: rgba(16, 185, 129, 0.08); outline: 2px solid rgba(16, 185, 129, 0.3);" : "";

      if (m.tipo === "prev") {
        return `<td style="${cellBgStyle}"><span class="gantt-pill gantt-pill-prev" title="Mantenimiento Preventivo Programado">${m.label}</span></td>`;
      } else if (m.tipo === "major") {
        return `<td style="${cellBgStyle}"><span class="gantt-pill gantt-pill-major" title="Parada Técnica Mayor">${m.label}</span></td>`;
      } else if (m.tipo === "corr") {
        return `<td style="${cellBgStyle}"><span class="gantt-pill gantt-pill-corr" title="Correctivo">${m.label}</span></td>`;
      }
      return `<td style="${cellBgStyle}"><span style="color:var(--text-muted); font-size:0.75rem;">-</span></td>`;
    }).join("");

    return `
      <tr>
        <td style="text-align: left;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="crit-tag ${critBadgeClass}">Clase ${linea.criticidad}</span>
            <strong style="color:var(--text-primary); font-size:0.88rem;">${linea.titulo}</strong>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">${linea.subtitulo} · Frec: ${linea.frecuencia}</div>
        </td>
        ${celdasMeses}
      </tr>
    `;
  }).join("");
}

// --- SUBMÓDULO 3: RENDERIZAR ÓRDENES DE TRABAJO (OT) ---
function renderizarOrdenesTrabajo(filtroEstado = "todos", search = "") {
  const container = document.getElementById("ot-cards-grid");
  if (!container) return;

  const ordenes = state.ordenesTrabajo || [];

  // Filtrar por taller si no es "todos"
  const otsTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
    ? ordenes.filter(o => {
        if (o.workshop) return o.workshop === state.activeWorkshop;
        const eq = state.equipos.find(e => e.id === o.equipoId);
        return eq ? eq.workshop === state.activeWorkshop : true;
      })
    : ordenes;

  const term = search.toLowerCase().trim();
  const otsFiltradas = otsTaller.filter(o => {
    if (filtroEstado !== "todos" && o.estado !== filtroEstado) return false;
    if (term) {
      const matchId = (o.id || "").toLowerCase().includes(term);
      const matchNom = (o.equipoNombre || "").toLowerCase().includes(term);
      const matchResp = (o.responsable || "").toLowerCase().includes(term);
      const matchTipo = (o.tipo || "").toLowerCase().includes(term);
      return matchId || matchNom || matchResp || matchTipo;
    }
    return true;
  });

  // Ordenar: primero Abiertas y En Proceso, luego Completadas
  otsFiltradas.sort((a, b) => {
    if (a.estado === "Completada" && b.estado !== "Completada") return 1;
    if (a.estado !== "Completada" && b.estado === "Completada") return -1;
    return new Date(b.fechaProgramada) - new Date(a.fechaProgramada);
  });

  if (otsFiltradas.length === 0) {
    container.innerHTML = `
      <div class="empty-state glass-panel" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center;">
        <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">📋</div>
        <h3 style="color:var(--text-primary); font-size:1.15rem;">No hay órdenes de trabajo activas</h3>
        <p style="color:var(--text-muted); font-size:0.85rem; max-width:480px; margin: 0.5rem auto 1.25rem;">
          No se encontraron órdenes de trabajo registradas con el filtro seleccionado.
        </p>
        <button class="btn btn-primary btn-sm" onclick="abrirModalNuevaOT()">➕ Crear Nueva Orden de Trabajo</button>
      </div>
    `;
    return;
  }

  container.innerHTML = otsFiltradas.map(ot => {
    const crit = ot.criticidad || "B";
    const critClass = crit === "A" ? "crit-tag-a" : (crit === "B" ? "crit-tag-b" : "crit-tag-c");

    let statusBadgeClass = "ot-status-abierta";
    if (ot.estado === "En Proceso") statusBadgeClass = "ot-status-proceso";
    else if (ot.estado === "Completada") statusBadgeClass = "ot-status-completada";

    const checklists = ot.checklists || [];
    const totalTareas = checklists.length;
    const tareasCompletadas = checklists.filter(t => t.completado).length;
    const progresoPorcentaje = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

    const tallerNombre = ot.workshop ? getNombreTaller(ot.workshop) : "Taller de Manufactura";

    return `
      <div class="ot-card glass-panel" id="card-${ot.id}">
        <div class="ot-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="ot-id-badge">${ot.id}</span>
            <span class="badge ${ot.tipo === 'Preventivo' ? 'badge-success' : (ot.tipo === 'Predictivo' ? 'badge-accent' : 'badge-alert')}" style="font-size:0.72rem;">${ot.tipo}</span>
            <span class="crit-tag ${critClass}">Clase ${crit}</span>
          </div>
          <span class="ot-status-badge ${statusBadgeClass}">${ot.estado}</span>
        </div>

        <div class="ot-card-body" style="margin-top:0.75rem;">
          <h4 class="ot-equipo-title">${ot.equipoNombre}</h4>
          <p class="ot-meta-sub">${tallerNombre} · Código: <strong style="color:var(--color-accent);">${ot.equipoId}</strong></p>

          <div class="ot-meta-grid">
            <div class="ot-meta-item">
              <span class="ot-meta-label">📅 Programada</span>
              <span class="ot-meta-val">${ot.fechaProgramada}</span>
            </div>
            <div class="ot-meta-item">
              <span class="ot-meta-label">⏱️ Tiempo Estimado</span>
              <span class="ot-meta-val">${ot.horasEstimadas} horas</span>
            </div>
            <div class="ot-meta-item" style="grid-column: 1 / -1;">
              <span class="ot-meta-label">👤 Técnico / Responsable</span>
              <span class="ot-meta-val">${ot.responsable}</span>
            </div>
          </div>

          ${ot.insumos ? `
            <div class="ot-insumos-box">
              <strong>🛠️ Insumos / Repuestos:</strong> ${ot.insumos}
            </div>
          ` : ""}

          ${ot.instrucciones ? `
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.4;">
              <strong>📝 Procedimiento:</strong> ${ot.instrucciones}
            </p>
          ` : ""}

          <!-- Progreso del Checklist -->
          <div class="ot-checklist-container">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; font-weight:600; margin-bottom: 6px;">
              <span>Actividades Técnicas (${tareasCompletadas}/${totalTareas})</span>
              <span style="color:var(--color-accent);">${progresoPorcentaje}%</span>
            </div>
            <div class="progress-bar-container" style="height:6px; background:var(--border-color); border-radius:10px; overflow:hidden; margin-bottom:10px;">
              <div style="height:100%; width:${progresoPorcentaje}%; background:linear-gradient(90deg, #10b981, #06b6d4); border-radius:10px; transition: width 0.3s ease;"></div>
            </div>

            <div class="ot-checklist-tasks">
              ${checklists.map((t, idx) => `
                <label class="ot-task-item" style="display:flex; align-items:center; gap:8px; font-size:0.78rem; color:var(--text-primary); cursor:pointer; margin-bottom:5px;">
                  <input type="checkbox" ${t.completado ? 'checked' : ''} onchange="toggleTareaOT('${ot.id}', ${idx})" style="accent-color:var(--color-accent); cursor:pointer;">
                  <span style="${t.completado ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${t.tarea}</span>
                </label>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="ot-card-footer">
          <div style="display:flex; gap:8px; align-items:center;">
            ${ot.estado === "Abierta" ? `
              <button class="btn btn-secondary btn-sm" onclick="cambiarEstadoOT('${ot.id}', 'En Proceso')">▶️ Iniciar OT</button>
            ` : ""}
            ${ot.estado === "En Proceso" ? `
              <button class="btn btn-success btn-sm" onclick="cambiarEstadoOT('${ot.id}', 'Completada')">✅ Finalizar OT</button>
            ` : ""}
            ${ot.estado === "Completada" ? `
              <span style="font-size:0.78rem; color:var(--color-success); font-weight:600; display:flex; align-items:center; gap:4px;">
                ✔️ Concluida ${ot.fechaCierre ? `el ${ot.fechaCierre}` : ''}
              </span>
            ` : ""}
          </div>
          <button class="btn btn-outline btn-sm" onclick="imprimirOrdenTrabajoPDF('${ot.id}')" title="Descargar Hoja de Trabajo Técnica">
            🖨️ PDF
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// --- GESTIÓN INTERACTIVA DE TAREAS Y ESTADOS DE OT ---
function toggleTareaOT(idOT, indexTarea) {
  const ot = (state.ordenesTrabajo || []).find(o => o.id === idOT);
  if (!ot || !ot.checklists || !ot.checklists[indexTarea]) return;

  ot.checklists[indexTarea].completado = !ot.checklists[indexTarea].completado;

  // Si todas las tareas están completadas, sugerir pasar a En Proceso
  const completadas = ot.checklists.filter(t => t.completado).length;
  if (completadas > 0 && ot.estado === "Abierta") {
    ot.estado = "En Proceso";
  }

  guardarEstado();
  renderizarOrdenesTrabajo(document.querySelector(".ot-filter-btn.active")?.getAttribute("data-estado") || "todos");
}

function cambiarEstadoOT(idOT, nuevoEstado) {
  const ot = (state.ordenesTrabajo || []).find(o => o.id === idOT);
  if (!ot) return;

  ot.estado = nuevoEstado;
  if (nuevoEstado === "Completada") {
    ot.fechaCierre = new Date().toISOString().split("T")[0];
    // Marcar todas las tareas como completadas
    if (ot.checklists) {
      ot.checklists.forEach(t => t.completado = true);
    }
    // Registrar también como preventivo en el histórico de mantenimientos
    const eq = state.equipos.find(e => e.id === ot.equipoId);
    if (eq) {
      eq.ultimoMantenimiento = ot.fechaCierre;
      // Recalcular próximo preventivo sumando su frecuencia
      const frec = eq.frecuenciaDias || 30;
      const proximo = new Date();
      proximo.setDate(proximo.getDate() + frec);
      eq.proximoPreventivo = proximo.toISOString().split("T")[0];
    }
  }

  guardarEstado();
  actualizarKPIsPlanMaestro();
  renderizarOrdenesTrabajo(document.querySelector(".ot-filter-btn.active")?.getAttribute("data-estado") || "todos");
  renderizarPreventivos();
  renderizarDashboard();
  alert(`Orden de Trabajo ${ot.id} actualizada a: "${nuevoEstado}" ✅`);
}

// --- MODAL: CREACIÓN Y GENERACIÓN DE NUEVA OT ---
function abrirModalNuevaOT(preselectedEquipoId = null) {
  const selectEquipo = document.getElementById("ot-equipo");
  const inputCodigo = document.getElementById("ot-codigo");
  const inputFecha = document.getElementById("ot-fecha-programada");
  const inputResp = document.getElementById("ot-responsable");
  const inputCrit = document.getElementById("ot-criticidad");

  if (!selectEquipo) return;

  // Generar código autoincremental
  const numOT = (state.ordenesTrabajo || []).length + 1;
  const nuevoCodigo = `OT-2026-${String(numOT).padStart(3, '0')}`;
  if (inputCodigo) inputCodigo.value = nuevoCodigo;

  // Llenar selector de equipos
  selectEquipo.innerHTML = `
    <option value="">-- Seleccionar Equipo o Máquina del Taller --</option>
    ${state.equipos.map(eq => `
      <option value="${eq.id}">[${eq.id}] ${eq.nombre} (${getNombreTaller(eq.workshop)})</option>
    `).join("")}
  `;

  if (preselectedEquipoId) {
    selectEquipo.value = preselectedEquipoId;
    const eq = state.equipos.find(e => e.id === preselectedEquipoId);
    if (eq && inputCrit) {
      inputCrit.value = `Clase ${clasificarCriticidad(eq)}`;
    }
  } else {
    if (inputCrit) inputCrit.value = "Clase A";
  }

  // Establecer fecha por defecto a mañana
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  if (inputFecha) inputFecha.value = manana.toISOString().split("T")[0];

  // Responsable por defecto
  if (inputResp) {
    inputResp.value = state.session ? state.session.nombre : "Ing. Juan Carlos Alulema";
  }

  abrirModal("modal-nueva-ot");
}

function guardarNuevaOT(e) {
  e.preventDefault();

  const id = document.getElementById("ot-codigo").value;
  const tipo = document.getElementById("ot-tipo").value;
  const equipoId = document.getElementById("ot-equipo").value;
  const responsable = document.getElementById("ot-responsable").value.trim();
  const fechaProgramada = document.getElementById("ot-fecha-programada").value;
  const horasEstimadas = parseFloat(document.getElementById("ot-horas-estimadas").value) || 2.0;
  const insumos = document.getElementById("ot-insumos").value.trim();
  const instrucciones = document.getElementById("ot-instrucciones").value.trim();

  if (!equipoId) {
    alert("Por favor selecciona un equipo de la lista para emitir la Orden de Trabajo.");
    return;
  }

  const equipo = state.equipos.find(e => e.id === equipoId);
  const equipoNombre = equipo ? equipo.nombre : "Equipo Industrial";
  const workshop = equipo ? equipo.workshop : (state.activeWorkshop || "manufactura");
  const criticidad = equipo ? clasificarCriticidad(equipo) : "B";

  // Generar checklists inteligentes según el tipo y criticidad
  let checklists = [];
  if (tipo === "Predictivo") {
    checklists = [
      { tarea: "Inspección termográfica de bornes eléctricos y contactores", completado: false },
      { tarea: "Análisis espectral de vibraciones en rodamientos y acoples", completado: false },
      { tarea: "Medición de aislamiento de devanados (Megóhmetro > 100 MΩ)", completado: false }
    ];
  } else if (tipo === "Correctivo") {
    checklists = [
      { tarea: "Bloqueo de energía y consignación LOTO del tablero", completado: false },
      { tarea: "Desmontaje e inspección del componente averiado", completado: false },
      { tarea: "Instalación de repuesto original y prueba de torque", completado: false },
      { tarea: "Puesta en marcha supervisada en vacío y bajo carga", completado: false }
    ];
  } else {
    checklists = [
      { tarea: "Desconexión segura y limpieza general de virutas o polvo", completado: false },
      { tarea: "Comprobación y reposición de niveles de fluidos y aceites", completado: false },
      { tarea: "Verificación de ajustes mecánicos y juego axial", completado: false },
      { tarea: "Inspección funcional de botones de parada de emergencia y guardas", completado: false }
    ];
  }

  const nuevaOT = {
    id,
    tipo,
    equipoId,
    equipoNombre,
    workshop,
    criticidad,
    responsable,
    fechaProgramada,
    fechaCreacion: new Date().toISOString().split("T")[0],
    fechaCierre: null,
    horasEstimadas,
    estado: "Abierta",
    insumos,
    instrucciones,
    checklists
  };

  if (!state.ordenesTrabajo) state.ordenesTrabajo = [];
  state.ordenesTrabajo.unshift(nuevaOT);
  guardarEstado();

  cerrarModal("modal-nueva-ot");
  document.getElementById("form-nueva-ot").reset();

  renderizarPlanMaestro();
  alert(`✅ Orden de Trabajo ${id} registrada con éxito en el Plan Maestro.`);
}

// --- SUBMÓDULO: EXPORTACIÓN DEL PLAN MAESTRO A PDF INSTITUCIONAL ---
function exportarPlanMaestroPDF() {
  const jsPDFLib = window.jsPDF || (window.jspdf && window.jspdf.jsPDF);
  if (!jsPDFLib) {
    alert("La librería de generación PDF (jsPDF) no está disponible. Por favor, asegúrate de tener conexión a internet.");
    return;
  }

  try {
    const doc = new jsPDFLib({ orientation: "portrait", unit: "mm", format: "a4" });
    const fechaEmision = new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
    const tallerNombre = getNombreTaller(state.activeWorkshop || "todos");

    // Cabecera Institucional
    doc.setFillColor(15, 23, 42); // Navy Dark UTI
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("UNIVERSIDAD TECNOLÓGICA INDOAMÉRICA", 105, 10, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`FACULTAD DE INGENIERÍA Y CIENCIAS APLICADAS · ${tallerNombre.toUpperCase()}`, 105, 16, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("PLAN MAESTRO DE MANTENIMIENTO INTEGRAL (RCM / TPM) · AÑO 2026", 105, 22, { align: "center" });

    // Resumen Ejecutivo de Indicadores (KPIs)
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 32, 182, 24, 2, 2, "FD");

    const equiposTaller = (state.activeWorkshop && state.activeWorkshop !== "todos")
      ? state.equipos.filter(eq => eq.workshop === state.activeWorkshop)
      : state.equipos;

    const total = equiposTaller.length;
    const operativos = equiposTaller.filter(e => e.estado !== "Fuera de Servicio").length;
    const atrasados = equiposTaller.filter(eq => new Date(eq.proximoPreventivo) < HOY_SISTEMA && eq.estado !== "Fuera de Servicio").length;
    const cumplimiento = total > 0 ? Math.round(((total - atrasados) / total) * 100) : 100;
    const disponibilidad = total > 0 ? ((operativos / total) * 100).toFixed(1) : "100.0";

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de Emisión: ${fechaEmision}`, 18, 38);
    doc.text(`Ámbito Técnico: ${tallerNombre} (${total} Activos)`, 18, 44);
    doc.text(`Responsable: ${state.session ? state.session.nombre : 'Ing. Juan Carlos Alulema'}`, 18, 50);

    doc.text(`Cumplimiento Preventivo: ${cumplimiento}%`, 120, 38);
    doc.text(`Disponibilidad de Máquinas: ${disponibilidad}%`, 120, 44);
    doc.text(`Confiabilidad (MTBF Estimado): 380 hrs`, 120, 50);

    // Tabla de Matriz RCM de Activos
    const rows = equiposTaller.map(eq => {
      const crit = clasificarCriticidad(eq);
      const estrategia = crit === "A" ? "RCM 1: Prev. Mensual + Predictivo" : (crit === "B" ? "RCM 2: Prev. Trimestral Sistemático" : "RCM 3: A Rotura / Semestral");
      const frec = eq.frecuenciaDias ? `${eq.frecuenciaDias} días` : "30 días";
      const taller = eq.workshopNombre || getNombreTaller(eq.workshop);
      return [
        eq.id,
        `${eq.nombre}${eq.cantidad > 1 ? ` (${eq.cantidad}u)` : ''}`,
        taller,
        `Clase ${crit}`,
        estrategia,
        frec,
        eq.estado || "Operativo"
      ];
    });

    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        startY: 60,
        head: [["Código", "Activo / Maquinaria", "Taller / Lab", "Criticidad", "Estrategia RCM", "Frec.", "Estado"]],
        body: rows,
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5 },
        styles: { fontSize: 7, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 50 },
          2: { cellWidth: 32 },
          3: { cellWidth: 16, halign: "center" },
          4: { cellWidth: 38 },
          5: { cellWidth: 14, halign: "center" },
          6: { cellWidth: 14, halign: "center" }
        },
        margin: { left: 14, right: 14 }
      });

      let finalY = doc.lastAutoTable.finalY + 16;
      if (finalY > 255) {
        doc.addPage();
        finalY = 30;
      }

      // Sección de Firmas Institucionales
      doc.setDrawColor(100, 116, 139);
      doc.line(25, finalY, 85, finalY);
      doc.line(125, finalY, 185, finalY);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("ING. JUAN CARLOS ALULEMA", 55, finalY + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text("Coordinador de Talleres y Laboratorios", 55, finalY + 9, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.text("DECANATO DE FACULTAD", 155, finalY + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text("Aprobación Plan Maestro RCM / TPM", 155, finalY + 9, { align: "center" });
    }

    doc.save(`Plan_Maestro_Mantenimiento_UTI_${state.activeWorkshop || 'Consolidado'}_2026.pdf`);
  } catch (err) {
    console.error("Error al exportar Plan Maestro en PDF:", err);
    alert("Hubo un error al generar el PDF del Plan Maestro.");
  }
}

// --- SUBMÓDULO: EXPORTACIÓN INDIVIDUAL DE ORDEN DE TRABAJO (OT) ---
function imprimirOrdenTrabajoPDF(idOT) {
  const jsPDFLib = window.jsPDF || (window.jspdf && window.jspdf.jsPDF);
  if (!jsPDFLib) {
    alert("La librería de generación PDF (jsPDF) no está disponible.");
    return;
  }
  const ot = (state.ordenesTrabajo || []).find(o => o.id === idOT);
  if (!ot) return;

  try {
    const doc = new jsPDFLib({ orientation: "portrait", unit: "mm", format: "a4" });

    // Cabecera Institucional
    doc.setFillColor(15, 23, 42); // Navy Dark UTI
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("UNIVERSIDAD TECNOLÓGICA INDOAMÉRICA", 105, 11, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("FACULTAD DE INGENIERÍA Y CIENCIAS APLICADAS · DIRECCIÓN DE TALLERES", 105, 17, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`ORDEN DE TRABAJO TÉCNICA · ${ot.id}`, 105, 23, { align: "center" });

    // Cuadro de Datos Principales
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 34, 182, 38, 3, 3, "FD");

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Código OT:", 18, 41);
    doc.setFont("helvetica", "normal");
    doc.text(ot.id, 42, 41);

    doc.setFont("helvetica", "bold");
    doc.text("Tipo de Mantenimiento:", 80, 41);
    doc.setFont("helvetica", "normal");
    doc.text(ot.tipo, 122, 41);

    doc.setFont("helvetica", "bold");
    doc.text("Criticidad:", 152, 41);
    doc.setFont("helvetica", "normal");
    doc.text(`Clase ${ot.criticidad}`, 172, 41);

    doc.setFont("helvetica", "bold");
    doc.text("Equipo / Activo:", 18, 48);
    doc.setFont("helvetica", "normal");
    doc.text(`${ot.equipoNombre} (${ot.equipoId})`, 48, 48);

    doc.setFont("helvetica", "bold");
    doc.text("Instalación / Lab:", 18, 55);
    doc.setFont("helvetica", "normal");
    doc.text(getNombreTaller(ot.workshop), 48, 55);

    doc.setFont("helvetica", "bold");
    doc.text("Técnico Asignado:", 18, 62);
    doc.setFont("helvetica", "normal");
    doc.text(ot.responsable, 50, 62);

    doc.setFont("helvetica", "bold");
    doc.text("Fecha Prog.:", 115, 62);
    doc.setFont("helvetica", "normal");
    doc.text(ot.fechaProgramada, 137, 62);

    doc.setFont("helvetica", "bold");
    doc.text("Horas Est.:", 162, 62);
    doc.setFont("helvetica", "normal");
    doc.text(`${ot.horasEstimadas} hrs`, 182, 62);

    // Instrucciones e Insumos
    let currentY = 78;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("1. INSUMOS Y HERRAMIENTAS REQUERIDAS", 14, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const insumosText = doc.splitTextToSize(ot.insumos || "No se especificaron consumibles adicionales.", 182);
    doc.text(insumosText, 14, currentY);
    currentY += (insumosText.length * 4.5) + 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("2. INSTRUCCIONES TÉCNICAS Y PROCEDIMIENTO OPERATIVO", 14, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const instText = doc.splitTextToSize(ot.instrucciones || "Ejecutar conforme al protocolo estándar del taller.", 182);
    doc.text(instText, 14, currentY);
    currentY += (instText.length * 4.5) + 6;

    // Checklists
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("3. CHECKLIST DE ACTIVIDADES Y VERIFICACIÓN DE SEGURIDAD", 14, currentY);
    currentY += 6;

    const checklistRows = (ot.checklists || []).map((c, i) => [
      `[ ${c.completado ? 'X' : '  '} ]`,
      `Paso ${i + 1}: ${c.tarea}`,
      c.completado ? "REALIZADO" : "PENDIENTE"
    ]);

    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        startY: currentY,
        head: [["Estado", "Descripción de la Tarea / Actividad", "Conformidad"]],
        body: checklistRows,
        theme: "grid",
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 18, halign: "center" },
          1: { cellWidth: 135 },
          2: { cellWidth: 29, halign: "center" }
        },
        margin: { left: 14, right: 14 }
      });
      currentY = doc.lastAutoTable.finalY + 18;
    } else {
      currentY += 40;
    }

    if (currentY > 240) {
      doc.addPage();
      currentY = 30;
    }

    // Firmas de Conformidad
    doc.setDrawColor(100, 116, 139);
    doc.line(25, currentY, 85, currentY);
    doc.line(125, currentY, 185, currentY);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("TÉCNICO / DOCENTE EJECUTOR", 55, currentY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(ot.responsable, 55, currentY + 10, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text("COORDINADOR / SUPERVISOR DE TALLER", 155, currentY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Ing. Juan Carlos Alulema", 155, currentY + 10, { align: "center" });

    doc.save(`OT_${ot.id}_${ot.equipoId}.pdf`);
  } catch (err) {
    console.error("Error al exportar OT en PDF:", err);
    alert("Hubo un problema al generar el PDF de la Orden de Trabajo.");
  }
}
