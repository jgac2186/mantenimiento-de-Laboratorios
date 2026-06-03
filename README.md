# MantoLab PWA 🛠️🧪

> **Sistema Integral de Control de Mantenimiento para Laboratorios y Talleres**  
> Una Progressive Web App (PWA) de alto rendimiento, diseñada con arquitectura *Offline-First* y reactividad en tiempo real para la gestión digital de maquinaria, mantenimientos preventivos/correctivos e insumos en entornos educativos e industriales.

---

## 🌟 Características Principales

*   **Offline-First & PWA:** Totalmente funcional sin conexión a internet. Registra datos desde cualquier sótano o bóveda de taller gracias al uso de *Service Workers* y almacenamiento en caché.
*   **Gestión de Maquinaria e Inventario:** Catálogo digitalizado para agregar, editar y visualizar la ficha técnica de cada equipo.
*   **Planificación Preventiva Automatizada:** Calendario y agenda inteligente con semáforo visual de alertas (verde: al día, amarillo: próximo a vencer, rojo: atrasado). Calcula automáticamente el próximo mantenimiento al completar una tarea.
*   **Bitácora de Mantenimiento Correctivo:** Reporte dinámico de fallas por parte de docentes o personal técnico. Bloqueo inmediato del equipo en estado *"Fuera de Servicio"* ante fallas críticas y flujo para registro de solución y costos de reparación.
*   **Control de Insumos y Stock Mínimo:** Tabla de consumibles y repuestos con indicadores de stock crítico para evitar desabastecimientos.
*   **Copias de Seguridad e Importación:** Respaldo completo de la base de datos local en archivos `.json` e importación directa para sincronización entre dispositivos. Exportación de reportes mensuales de actividades en formato `.csv`.

---

## 🛠️ Stack Tecnológico

*   **Frontend Core:** HTML5 semántico y CSS3 moderno (interfaz premium con efectos *glassmorphism*, variables CSS, animaciones fluidas y diseño adaptativo a móviles y tabletas).
*   **Lógica de Negocio:** JavaScript (ES6+) con arquitectura SPA (Single Page Application) basada en cambio reactivo de pestañas sin recarga.
*   **Base de Datos y Persistencia:** LocalStorage del navegador web.
*   **Instalabilidad y Portabilidad:** Service Worker nativo y `manifest.json`.

---

## 📁 Estructura del Proyecto

```bash
├── index.html          # Interfaz de usuario estructurada en secciones (SPA)
├── style.css           # Sistema de diseño con variables, temas, y estilos responsivos
├── app.js              # Lógica de la aplicación, control de estado y persistencia de LocalStorage
├── sw.js               # Service Worker para almacenamiento en caché y soporte offline
├── manifest.json       # Configuración para la instalación como PWA en dispositivos móviles/escritorio
├── icon.svg            # Logotipo vectorial del sistema
└── documentacion.md    # Documentación detallada del proyecto y escenarios de uso
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Ejecución en el Navegador
Para ejecutar el proyecto de forma local, simplemente abre el archivo `index.html` en tu navegador, o utiliza un servidor local para habilitar las características de Service Worker por completo:

```bash
# Si tienes Node.js instalado, puedes usar http-server o live-server
npx http-server
```

### Instalación como Aplicación Móvil o de Escritorio
1. Abre la aplicación en tu navegador (a través de `localhost` o la URL de despliegue HTTPS).
2. Haz clic en el botón **"📲 Instalar en Celular"** en la barra lateral, o utiliza la opción nativa de instalación del navegador (icono de descarga en la barra de direcciones).
3. ¡Listo! Ya puedes acceder a MantoLab desde tu pantalla de inicio con su propia ventana dedicada y soporte offline.

---

## 📂 Casos de Uso y Flujo de Trabajo

### A. Coordinación y Supervisión
El administrador del laboratorio revisa el tablero general de métricas en el **Dashboard** al inicio del día para identificar equipos fuera de servicio, preventivos atrasados y niveles de stock de insumos críticos.

### B. Reporte de Fallas (Correctivo)
Cuando un equipo experimenta una anomalía (ej. mandril de taladro atascado):
1. El docente o técnico escanea el código o selecciona el equipo en **Reportar Falla**.
2. Al registrar el reporte con gravedad *Alta*, el sistema actualiza el estado del equipo a *"Fuera de Servicio"* y bloquea temporalmente sus tareas preventivas.

### C. Resolución por Personal Técnico
El técnico de mantenimiento:
1. Revisa los tickets abiertos en la bitácora correctiva.
2. Realiza la reparación física en el taller.
3. Cierra el ticket en la aplicación registrando la solución, el costo y la fecha. El equipo vuelve automáticamente a estado *"Operativo"*.

---

## 🛡️ Licencia y Créditos
Este proyecto ha sido desarrollado para digitalizar la gestión técnica de talleres. Todos los derechos reservados a los autores del proyecto.
