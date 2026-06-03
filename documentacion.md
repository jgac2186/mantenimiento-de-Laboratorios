# Documentación del Proyecto: MantoLab PWA
*Sistema Integral de Control de Mantenimiento para Laboratorios y Talleres*

---

## 1. Objetivo del Proyecto
El objetivo principal de **MantoLab** es digitalizar, centralizar y automatizar el registro y la planificación del mantenimiento (preventivo y correctivo) de los 4 talleres (Manufactura, Procesos, Neumática, Automatización) y el Laboratorio de Ciencias Básicas. 

Busca **eliminar el uso de papel o hojas de cálculo propensas a errores**, reducir el tiempo de inactividad de las máquinas por fallas (downtime), y asegurar que las herramientas y equipos costosos extiendan su vida útil mediante un seguimiento riguroso y automatizado de su mantenimiento periódico.

## 2. ¿A quién va dirigido? (Público Objetivo)
El sistema está diseñado específicamente para entornos técnicos educativos o industriales. Sus usuarios principales son:

* **Administradores / Coordinadores de Taller:** Quienes supervisan la operatividad de todos los laboratorios, planifican las compras de insumos y revisan las métricas globales de funcionamiento de la maquinaria.
* **Técnicos de Mantenimiento:** El personal encargado de ejecutar las órdenes de lubricación, calibración, reemplazo de piezas o reparación física de las máquinas.
* **Docentes y Ayudantes de Práctica:** Personal que utiliza los equipos diariamente y que necesita una forma rápida de reportar anomalías o fallas encontradas durante el desarrollo de una clase práctica.

## 3. ¿Cómo Funciona MantoLab? (Arquitectura Técnica)
MantoLab es una **PWA (Progressive Web App)** estructurada como una *Single Page Application (SPA)*. Funciona bajo un modelo técnico **"Offline-First"**:

* **Almacenamiento Local Seguro (LocalStorage):** La aplicación no requiere de un servidor externo de base de datos en la nube ni de una conexión a internet constante. Toda la información de equipos, fechas, fallas e historial se guarda directamente en la memoria del navegador del dispositivo de forma segura.
* **Sistema Reactivo y Automatizado:** El sistema de calendario calcula las fechas en tiempo real. Por ejemplo, si un torno requiere mantenimiento cada 90 días, al marcar la tarea como "Completada", el sistema calcula la siguiente fecha automáticamente y organiza la agenda mediante un semáforo visual (verde para al día, amarillo para alerta de vencimiento y rojo para tareas atrasadas).
* **Portabilidad y Uso en Taller (Service Worker):** A través del uso de un `Service Worker`, los recursos estáticos de la interfaz gráfica se descargan y almacenan en el caché del celular o la computadora. Esto permite que el usuario pueda abrir la aplicación e interactuar con ella incluso en zonas del taller (como sótanos o bóvedas) donde no haya señal celular ni Wi-Fi.
* **Copias de Seguridad (JSON Backups):** Para evitar la pérdida de información ante limpiezas de caché del navegador, el sistema cuenta con un motor de importación y exportación de bases de datos en formato `.json` puro.

## 4. ¿Cómo lo utilizarían las personas encargadas? (Casos de Uso)

### Escenario A: El trabajo del Coordinador / Administrador
1. **Inicio de jornada:** El administrador abre la aplicación en su computadora de escritorio o celular e ingresa a la pestaña **Dashboard**.
2. **Revisión rápida:** Revisa el tablero general de métricas; nota inmediatamente que hay `1 preventivo atrasado` y `0 fallas activas` que requieran su atención urgente.
3. **Control de Insumos:** Entra a la pestaña "Configuración e Insumos" y nota una alerta roja indicando que los "Discos Abrasivos de 7 pulgadas" están por debajo del stock mínimo. Procede a generar una orden de compra antes de que se agoten por completo.
4. **Respaldo Semanal:** Al terminar la semana, presiona el botón "Exportar Respaldo JSON" y guarda el archivo generado en su correo o en un pendrive para mantener un historial físico inmutable.

### Escenario B: Reporte de Fallas (Docentes o Técnicos)
1. **Detección durante la práctica:** Un profesor está impartiendo clase utilizando el *Taladro de Pedestal* y nota un ruido extraño seguido del atasco del mandril.
2. **Levantamiento del reporte:** El profesor saca su celular personal, abre la app de MantoLab instalada, se dirige a "Reportar Falla", selecciona el Taladro, asigna una gravedad "Alta" y describe detalladamente el problema detectado.
3. **Alerta del sistema:** Tras guardar el reporte, el sistema emite una alerta, bloquea los mantenimientos preventivos del taladro y cambia automáticamente el estado general de la máquina a **Fuera de Servicio**, indicando visualmente en el sistema que nadie más debe utilizarlo.

### Escenario C: Ejecución de Mantenimiento Correctivo (Técnico Encargado)
1. **Gestión de tickets:** El técnico encargado ingresa a la pestaña de "Mantenimiento Correctivo" y revisa los tickets abiertos, encontrando el reporte del Taladro de Pedestal.
2. **Intervención:** El técnico procede a desarmar el mandril, engrasarlo y reparar la pieza atascada físicamente en el taller.
3. **Cierre de orden:** Una vez reparado, el técnico abre la app, busca el ticket y pulsa en "Resolver Falla". Registra las refacciones utilizadas y el costo de mano de obra (ej. $15 USD). Al guardar, el ticket pasa al historial histórico y el sistema devuelve el Taladro de forma automática a su estado **Operativo**.
