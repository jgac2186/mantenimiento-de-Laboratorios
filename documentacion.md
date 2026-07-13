# Documentación del Proyecto: MantoLab PWA
*Sistema Integral de Control de Mantenimiento y Reservas para Laboratorios*

---

## 1. Objetivo del Proyecto
El objetivo principal de **MantoLab** es digitalizar, centralizar y automatizar el registro y la planificación del mantenimiento (preventivo y correctivo), además de proveer un canal de control para el agendamiento y la **reserva de laboratorios** (Taller de Manufactura, Lab. Ciencias Básicas, Taller de Procesos, Neumática y Automatización).

El sistema busca **eliminar por completo el uso de papel u hojas de cálculo propensas a errores**, reducir el tiempo de inactividad de las máquinas por fallas (downtime), y facilitar a los estudiantes un canal directo para reservar el espacio de trabajo de manera ordenada, evitando conflictos de horarios.

---

## 2. Roles y Acceso al Sistema

MantoLab implementa una división clara de funciones basada en perfiles individuales con almacenamiento offline:

* **Estudiantes (Modo Consulta y Reservas)**:
  * Registran su perfil la primera vez utilizando su **Matrícula / Cédula** y **Nombre Completo**.
  * Pueden consultar la disponibilidad y el estado de la maquinaria en tiempo real (Operativo / Fuera de Servicio).
  * Pueden **Reportar Fallas** encontradas durante las clases o prácticas.
  * Tienen acceso al panel de **Reservas de Laboratorio** para solicitar bloques horarios para prácticas libres o desarrollo de proyectos.
* **Administradores y Técnicos (Control Total)**:
  * Acceso protegido por un **PIN de seguridad de 4 dígitos** (por defecto `1234`).
  * Supervisión de la operatividad global del taller, métricas de fallas y tareas periódicas.
  * Control del inventario de maquinaria y stock mínimo de insumos/consumibles.
  * **Aprobación o rechazo de solicitudes de reservas** enviadas por los estudiantes.
  * Descarga de reportes mensuales de actividades en formato **PDF** y exportación/importación de copias de seguridad en formato **JSON**.

---

## 3. Arquitectura Técnica (Offline-First)

MantoLab es una **PWA (Progressive Web App)** estructurada como una *Single Page Application (SPA)* que funciona bajo un modelo **"Offline-First"**:

* **Almacenamiento Local (LocalStorage):** La base de datos, cuentas de usuarios registrados, historial de mantenimientos y bitácora de reservas se guardan en la memoria local del navegador del dispositivo. No requiere un servidor de base de datos en la nube constante.
* **Service Worker (PWA):** Los recursos estáticos de la interfaz (.html, .css, .js, imágenes y librerías externas de PDF) se descargan y almacenan en caché. Esto permite utilizar la aplicación, reportar fallas y consultar reservas en el taller, incluso en zonas sin señal de internet o Wi-Fi.
* **Control de Conflictos de Reservas:** El sistema valida de manera automatizada en el cliente que no existan reservas aprobadas que se solapen en fecha, hora y laboratorio.

---

## 4. Escenarios y Casos de Uso Comunes

### Escenario A: Registro e Ingreso de un Estudiante
1. **Primer Acceso**: Un estudiante abre MantoLab en su celular por primera vez. Se le presenta la pantalla de inicio de sesión.
2. **Registro**: Hace clic en "Regístrate aquí", ingresa su Matrícula y Nombre completo, y presiona "Registrarse e Ingresar".
3. **Inicio Directo**: En adelante, solo necesitará escribir su matrícula para ingresar a su panel individual.

### Escenario B: Solicitud de Reserva por un Estudiante
1. **Navegación**: El estudiante ingresa a la pestaña "Reservas de Laboratorio".
2. **Formulación**: Llena los datos solicitados: selecciona "Taller de Manufactura", la fecha, la hora de inicio y fin, y escribe el motivo (ej. "Práctica en Torno para proyecto de robótica").
3. **Envío**: Al enviar, la reserva se registra con estado **Pendiente** y se muestra en su listado individual.

### Escenario C: Gestión de Reservas y Mantenimiento (Administrador)
1. **Ingreso**: El administrador inicia sesión ingresando el PIN administrador.
2. **Alertas en Menú**: El menú lateral muestra notificaciones dinámicas (ej: badge rojo de preventivos vencidos o solicitudes de reserva pendientes de aprobación).
3. **Aprobación de Reserva**: Va a "Reservas de Laboratorio", evalúa la solicitud de práctica y presiona "Aprobar". El estado de la reserva cambia a **Aprobada** y ese bloque queda bloqueado para otros estudiantes.
4. **Resolución de Falla**: Si un estudiante reportó un equipo dañado, el administrador repara la máquina, abre el ticket y presiona "Resolver Falla" para devolver el equipo al estado **Operativo**.
