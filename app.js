/* ==========================================================================
   APP.JS - LÓGICA DE CONTROL DE MANTENIMIENTO (MANTOLAB)
   ========================================================================== */

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
let state = {
  equipos: [],
  correctivos: [],
  insumos: [],
  historico: []
};

// Fecha "actual" de referencia del sistema (según metadatos de ejecución del usuario)
const HOY_SISTEMA = new Date("2026-05-28");

// --- DATOS SEMILLA (INVENTARIO INICIAL DEL TALLER DE MANUFACTURA) ---
const DATOS_SEMILLA = {
  equipos: [
    {
      id: "MAN-TOR-01",
      nombre: "Torno de Banco de 1.50mt",
      marca: "Pinacho / S-90",
      categoria: "Torno",
      ubicacion: "Zona A - Torneado Convencional",
      frecuencia: 90, // cada 90 días
      estado: "Operativo",
      fechaAdq: "2018-03-15",
      tareas: [
        "Limpieza de bancada y guías prismáticas",
        "Comprobación de nivel de aceite de caja de velocidades",
        "Engrase del contrapunto y husillo de roscar",
        "Ajuste de holgura del carro transversal"
      ],
      proximoPreventivo: "2026-06-15" // A tiempo
    },
    {
      id: "MAN-ESM-01",
      nombre: "Esmeril de Banco",
      marca: "Dewalt / DW758",
      categoria: "Esmeril",
      ubicacion: "Zona B - Banco de Ajuste",
      frecuencia: 30, // cada 30 días
      estado: "Operativo",
      fechaAdq: "2020-11-05",
      tareas: [
        "Inspección visual de fisuras en discos abrasivos",
        "Ajuste de distancia de soportes de herramientas (máx 2mm)",
        "Limpieza de carcasas y protectores de chispa",
        "Verificación de rodamientos y ruidos anómalos"
      ],
      proximoPreventivo: "2026-06-03" // Próximo (6 días)
    },
    {
      id: "MAN-SMI-01",
      nombre: "Suelda MIG",
      marca: "Miller / Millermatic 252",
      categoria: "Soldadura",
      ubicacion: "Zona C - Área de Soldadura",
      frecuencia: 30,
      estado: "Operativo",
      fechaAdq: "2019-06-20",
      tareas: [
        "Limpieza de boquilla de gas y difusor",
        "Revisión de rodillos de arrastre del alambre",
        "Aplicación de spray antiadherente en boquilla",
        "Inspección de cable de antorcha y pinza de masa"
      ],
      proximoPreventivo: "2026-06-10" // A tiempo
    },
    {
      id: "MAN-SMA-01",
      nombre: "Suelda Eléctrica MMA (1)",
      marca: "Lincoln / Idealarc 250",
      categoria: "Soldadura",
      ubicacion: "Zona C - Área de Soldadura",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2017-02-10",
      tareas: [
        "Inspección de bornes de conexión rápida",
        "Revisión de pinza portaelectrodo y pinza de masa",
        "Limpieza interior de polvo metálico por soplado"
      ],
      proximoPreventivo: "2026-05-24" // ¡ATRASADO! (Hace 4 días)
    },
    {
      id: "MAN-SMA-02",
      nombre: "Suelda Eléctrica MMA (2)",
      marca: "Lincoln / Idealarc 250",
      categoria: "Soldadura",
      ubicacion: "Zona C - Área de Soldadura",
      frecuencia: 90,
      estado: "Operativo",
      fechaAdq: "2017-02-10",
      tareas: [
        "Inspección de bornes de conexión rápida",
        "Revisión de pinza portaelectrodo y pinza de masa",
        "Limpieza interior de polvo metálico por soplado"
      ],
      proximoPreventivo: "2026-06-25" // A tiempo
    },
    {
      id: "MAN-TAL-01",
      nombre: "Taladro de Pedestal",
      marca: "Knuth / KSB 25",
      categoria: "Taladro",
      ubicacion: "Zona D - Taladrado",
      frecuencia: 60,
      estado: "Operativo",
      fechaAdq: "2021-05-18",
      tareas: [
        "Lubricación de columna y cremallera de elevación",
        "Verificación de mandril porta-brocas y holgura del husillo",
        "Comprobación de tensión de bandas del motor",
        "Inspección de interruptor de parada de emergencia"
      ],
      proximoPreventivo: "2026-07-20" // A tiempo
    }
  ],
  correctivos: [
    {
      id: "MC-2026-001",
      equipoId: "MAN-TOR-01",
      falla: "Bancada atascada en el tramo final del recorrido.",
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
      id: "INS-ACE-68",
      nombre: "Aceite para Bancadas ISO VG 68",
      cantidad: 12,
      minimo: 5,
      unidad: "Litros",
      maquinas: "MAN-TOR-01"
    },
    {
      id: "INS-DIS-07",
      nombre: "Discos Abrasivos 7'' para Metal",
      cantidad: 4, // Alerta stock bajo
      minimo: 5,
      unidad: "Unidades",
      maquinas: "MAN-ESM-01"
    },
    {
      id: "INS-ALA-09",
      nombre: "Alambre MIG ER70S-6 0.9mm (Carrete)",
      cantidad: 3,
      minimo: 2,
      unidad: "Carretes",
      maquinas: "MAN-SMI-01"
    },
    {
      id: "INS-ELE-7018",
      nombre: "Electrodos Lincoln E7018 1/8''",
      cantidad: 25,
      minimo: 10,
      unidad: "Kilos",
      maquinas: "MAN-SMA-01, MAN-SMA-02"
    }
  ],
  historico: [
    {
      id: "H-001",
      equipoId: "MAN-TOR-01",
      tipo: "Preventivo",
      descripcion: "Limpieza y lubricación de bancadas completada.",
      fecha: "2026-03-17",
      costo: 0
    },
    {
      id: "H-002",
      equipoId: "MAN-TOR-01",
      tipo: "Correctivo",
      descripcion: "Falla corregida: Bancada atascada en tramo final.",
      fecha: "2026-04-13",
      costo: 35.00
    },
    {
      id: "H-003",
      equipoId: "MAN-ESM-01",
      tipo: "Preventivo",
      descripcion: "Inspección de discos abrasivos realizada sin anomalías.",
      fecha: "2026-05-04",
      costo: 0
    }
  ]
};

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
  cargarEstado();
  registrarServiceWorker();
  configurarEventosComunes();
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
      guardarEstado();
    }
  } else {
    // Si no hay datos, pre-cargamos el inventario semilla del taller de manufactura
    state = JSON.parse(JSON.stringify(DATOS_SEMILLA));
    guardarEstado();
  }
}

// Guarda el estado actual en LocalStorage
function guardarEstado() {
  localStorage.setItem("mantolab_state", JSON.stringify(state));
}

// --- REGISTRO DEL SERVICE WORKER (PWA) ---
let deferredPrompt;

function registrarServiceWorker() {
  if ('serviceWorker' in navigator) {
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
  actualizarBadgesCount();
  renderizarDashboard();
  renderizarInventarioGrid();
  renderizarPreventivos();
  renderizarCorrectivos();
  renderizarInsumos();
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
    case "preventivo":
      renderizarPreventivos();
      break;
    case "correctivo":
      renderizarCorrectivos();
      break;
    case "config":
      renderizarInsumos();
      break;
  }
}

// Actualiza los numeritos rojos/amarillos en el menú lateral
function actualizarBadgesCount() {
  // Preventivos atrasados
  const atrasadosCount = state.equipos.filter(eq => {
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
  const fallasCount = state.correctivos.filter(t => t.estado === "Abierto").length;
  const corrBadge = document.getElementById("correctivos-badge-count");
  if (corrBadge) {
    if (fallasCount > 0) {
      corrBadge.textContent = fallasCount;
      corrBadge.style.display = "inline-flex";
    } else {
      corrBadge.style.display = "none";
    }
  }
}

// --- LÓGICA DE DIBUJADO DE VISTAS ---

// 1. DASHBOARD
function renderizarDashboard() {
  const totalEquipos = state.equipos.length;
  const operativos = state.equipos.filter(eq => eq.estado === "Operativo").length;
  const fallas = state.correctivos.filter(t => t.estado === "Abierto").length;
  
  const atrasados = state.equipos.filter(eq => {
    const proximo = new Date(eq.proximoPreventivo);
    return proximo < HOY_SISTEMA && eq.estado !== "Fuera de Servicio";
  }).length;

  // Actualizar indicadores numéricos
  document.getElementById("dash-total-equipos").textContent = totalEquipos;
  document.getElementById("dash-operativos").textContent = operativos;
  document.getElementById("dash-fallas").textContent = fallas;
  document.getElementById("dash-preventivos-atrasados").textContent = atrasados;

  // Mensaje operativo porcentual
  const pct = totalEquipos > 0 ? Math.round((operativos / totalEquipos) * 100) : 100;
  document.getElementById("dash-percent-operativos").textContent = `${pct}% disponibilidad`;

  const fallasText = document.getElementById("dash-fallas-text");
  if (fallas > 0) {
    const fallasCriticas = state.correctivos.filter(t => t.estado === "Abierto" && t.gravedad === "Alta").length;
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

  // Dibujar panel izquierdo: Lista de fallas activas
  const activeList = document.getElementById("dash-active-correctives-list");
  const openTickets = state.correctivos.filter(t => t.estado === "Abierto");
  
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
          <button class="mini-item-action-btn" onclick="abrirResolverFalla('${t.id}')" title="Resolver ticket">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
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

  // Dibujar panel derecho: Próximas tareas preventivas
  const upcomingList = document.getElementById("dash-upcoming-preventives-list");
  
  // Ordenar preventivos por proximidad de fecha
  const preventivosOrdenados = [...state.equipos]
    .filter(eq => eq.estado !== "Fuera de Servicio")
    .map(eq => {
      const proximo = new Date(eq.proximoPreventivo);
      const difTime = proximo - HOY_SISTEMA;
      const difDays = Math.ceil(difTime / (1000 * 60 * 60 * 24));
      return { eq, proximo, difDays };
    })
    .sort((a, b) => a.difDays - b.difDays)
    .slice(0, 4); // Top 4

  if (preventivosOrdenados.length > 0) {
    upcomingList.innerHTML = preventivosOrdenados.map(item => {
      let claseIndicador = "success";
      let txtPlazo = `En ${item.difDays} días`;
      
      if (item.difDays < 0) {
        claseIndicador = "danger";
        txtPlazo = `Atrasado hace ${Math.abs(item.difDays)} días`;
      } else if (item.difDays <= 7) {
        claseIndicador = "warning";
        txtPlazo = `Vence en ${item.difDays} días`;
      }

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
        <p>No se encontraron equipos configurados en el taller piloto.</p>
      </div>
    `;
  }
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
    const matchesSearch = eq.nombre.toLowerCase().includes(searchQuery) || eq.id.toLowerCase().includes(searchQuery) || eq.marca.toLowerCase().includes(searchQuery);
    const matchesFilter = filterValue === "todos" || eq.estado === filterValue;
    return matchesSearch && matchesFilter;
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

      return `
        <article class="eq-card" onclick="abrirFichaTecnica('${eq.id}')">
          <div class="eq-card-header">
            <div class="eq-title-row">
              <h3 class="eq-card-title">${eq.nombre}</h3>
              <span class="eq-card-code">${eq.id}</span>
            </div>
            <span class="eq-badge ${badgeClase}">${eq.estado}</span>
          </div>

          <div class="eq-meta-row">
            <div>
              <span class="eq-meta-label">Marca/Modelo</span>
              <strong>${eq.marca}</strong>
            </div>
            <div>
              <span class="eq-meta-label">Ubicación</span>
              <strong>${eq.ubicacion}</strong>
            </div>
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
  
  if (state.equipos.length === 0) {
    container.innerHTML = `
      <div class="empty-state class-panel" style="padding:4rem;">
        <div class="empty-icon">🛠️</div>
        <h3>No hay equipos disponibles</h3>
        <p>Agrega equipos en la sección de inventario para poder programar mantenimientos.</p>
      </div>
    `;
    return;
  }

  // Mapeamos los preventivos de cada equipo
  const tareasPreventivas = state.equipos.map(eq => {
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

    const checklistHtml = item.eq.tareas.map(t => `
      <li class="ficha-checklist-item">
        <span class="ficha-check-bullet">▪</span> ${t}
      </li>
    `).join("");

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

  const openTickets = state.correctivos.filter(t => t.estado === "Abierto");
  const resolvedTickets = state.correctivos.filter(t => t.estado === "Resuelto").sort((a,b) => new Date(b.fechaResolucion) - new Date(a.fechaResolucion));

  document.getElementById("open-tickets-count").textContent = openTickets.length;
  document.getElementById("resolved-tickets-count").textContent = resolvedTickets.length;

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
            <button class="btn btn-success btn-sm" onclick="abrirResolverFalla('${t.id}')">
              Resolver Falla
            </button>
          </div>
        </div>
      `;
    }).join("");
  } else {
    openList.innerHTML = `
      <div class="empty-state" style="padding:3rem 0;">
        <div class="empty-icon">🎉</div>
        <h3>No hay tickets abiertos</h3>
        <p>No existen fallas pendientes en el Taller de Manufactura.</p>
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
    document.getElementById("eq-ubicacion").value = eq.ubicacion;
    document.getElementById("eq-frecuencia").value = eq.frecuencia;
    document.getElementById("eq-fecha-adq").value = eq.fechaAdq || "";
    document.getElementById("eq-preventivo-check").value = eq.tareas.join("\n");
  } else {
    // Modo Registro Nuevo
    title.textContent = "Registrar Nueva Maquinaria";
    codeInput.disabled = false;
    originalIdInput.value = "";
    
    // Sugerir código autogenerado
    const corr = state.equipos.length + 1;
    codeInput.value = `MAN-EQP-0${corr}`;
  }

  abrirModal("modal-equipo");
}

function guardarEquipo(e) {
  e.preventDefault();

  const originalId = document.getElementById("form-equipo-id-original").value;
  const id = document.getElementById("eq-codigo").value.trim().toUpperCase();
  const nombre = document.getElementById("eq-nombre").value.trim();
  const marca = document.getElementById("eq-marca").value.trim();
  const categoria = document.getElementById("eq-categoria").value;
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
  
  // Rellenar dropdown con equipos que no estén ya en Falla crítica
  const equiposDisponibles = state.equipos;
  
  if (equiposDisponibles.length === 0) {
    alert("No hay equipos en inventario para reportar fallas.");
    return;
  }

  select.innerHTML = equiposDisponibles.map(eq => `
    <option value="${eq.id}">${eq.nombre} (${eq.id}) - Estado: ${eq.estado}</option>
  `).join("");

  // Resetear fecha y campos del formulario
  document.getElementById("form-correctivo").reset();
  document.getElementById("corr-reportador").value = "Ing. Juan Ayala";

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

  fichaNombre.textContent = `Expediente: ${eq.nombre}`;

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
            <span class="ficha-spec-label">Código</span>
            <span class="ficha-spec-val" style="font-family:monospace;">${eq.id}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Marca / Modelo</span>
            <span class="ficha-spec-val">${eq.marca}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Ubicación Física</span>
            <span class="ficha-spec-val">${eq.ubicacion}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Adquisición</span>
            <span class="ficha-spec-val">${eq.fechaAdq || "No especificada"}</span>
          </div>
          <div class="ficha-spec-item">
            <span class="ficha-spec-label">Ciclo Preventivo</span>
            <span class="ficha-spec-val">Cada ${eq.frecuencia} días</span>
          </div>
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
  const yyyy = HOY_SISTEMA.getFullYear();
  const mm = String(HOY_SISTEMA.getMonth() + 1).padStart(2, '0');
  const prefijoMes = `${yyyy}-${mm}`;

  // Filtrar el historial global para obtener solo las tareas que se hicieron en este año-mes
  const actividadesDelMes = state.historico.filter(h => h.fecha.startsWith(prefijoMes));

  if (actividadesDelMes.length === 0) {
    alert("No se encontraron actividades registradas (Preventivas ni Correctivas) en el mes actual.");
    return;
  }

  // Construir el archivo CSV
  let csvContent = "Fecha,Codigo Equipo,Nombre Maquina,Tipo de Mantenimiento,Costo (USD),Descripcion de Tareas\n";
  
  actividadesDelMes.forEach(act => {
    // Buscar el nombre del equipo
    const eq = state.equipos.find(e => e.id === act.equipoId) || { nombre: "Equipo Eliminado/Desconocido" };
    
    // Limpiar comas y comillas en la descripción para que no rompa el CSV
    const desc = act.descripcion.replace(/"/g, '""').replace(/,/g, ' ');
    
    csvContent += `${act.fecha},${act.equipoId},"${eq.nombre}",${act.tipo},${act.costo},"${desc}"\n`;
  });

  // Generar y descargar el Blob
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
  const url = URL.createObjectURL(blob);
  
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `reporte_mensual_taller_${prefijoMes}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  // Liberar memoria
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function exportarCopiaSeguridad() {
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
