# TALLER DE PROCESOS DE MANUFACTURA INDUSTRIAL

---

## SECCIÓN 1: SELECCIÓN DE MATERIALES

### 1. Clasificación de Materiales
Complete la tabla indicando el tipo de material (metálico, cerámico, polimérico o compuesto), sus propiedades principales y dos aplicaciones industriales.

| Material | Tipo de material | Propiedades principales | Aplicaciones industriales |
| :--- | :--- | :--- | :--- |
| Acero inoxidable | | | |
| Polietileno | | | |
| Alúmina ($Al_2O_3$) | | | |
| Fibra de carbono | | | |

---

### 2. Relación Estructura - Propiedades - Procesamiento
**Contexto:** Una empresa fabrica ejes para transmisión mecánica.

**Preguntas:**
1. ¿Qué tipo de material recomendaría?
2. ¿Qué propiedades mecánicas son críticas?
3. ¿Qué proceso de manufactura usaría para fabricarlo?
4. ¿Cómo influye el tratamiento térmico en sus propiedades?

---

### 3. Caso Práctico de Selección de Materiales
Una empresa desea fabricar envases para alimentos calientes que sean:
* Económicos
* Ligeros
* Resistentes al calor
* Reciclables

**Actividades:**
1. Proponga dos materiales posibles.
2. Compare sus ventajas y desventajas.
3. Seleccione el material más adecuado y justifique su decisión.

| Material propuesto | Ventajas | Desventajas | Selección final (Justificación) |
| :--- | :--- | :--- | :--- |
| **Material 1:** | | | |
| **Material 2:** | | | |

---

### 4. Identificación de Procesos de Manufactura
Relacione el producto con el proceso de manufactura más adecuado:

* **Productos:**
  * Engranaje metálico
  * Botella plástica
  * Bloque de motor
  * Lámina de aluminio
* **Procesos disponibles:** Fundición, Extrusión / Soplado, Forja / Mecanizado, Laminado.

| Producto | Proceso de manufactura | Justificación |
| :--- | :--- | :--- |
| Engranaje metálico | | |
| Botella plástica | | |
| Bloque de motor | | |
| Lámina de aluminio | | |

---

### 5. Pregunta de Análisis Ingenieril
Explique con sus palabras:
* ¿Por qué un ingeniero industrial debe conocer las propiedades de los materiales antes de diseñar o mejorar un proceso productivo?

---
---

## SECCIÓN 2: METROLOGÍA Y AJUSTES

### Conceptos Clave y Fórmulas

#### 1. ¿Qué es la Metrología?
La metrología es la ciencia de las mediciones y sus aplicaciones. Incluye todos los aspectos teóricos y prácticos relacionados con las mediciones, cualquiera que sea su incertidumbre y en cualquier campo de la ciencia y la tecnología.

#### 2. Ejemplos de Instrumentos
* **Básicos:** Regla graduada, cinta métrica, calibrador (vernier o pie de rey).
* **De mayor precisión:** Micrómetro, reloj comparador, máquina de medición por coordenadas (CMM), rugosímetro, proyector de perfiles.

#### 3. Sistemas de Unidades
* **Sistema Internacional (SI):** Metro ($\text{m}$), milímetro ($\text{mm}$), micrómetro ($\mu\text{m}$).
* **Sistema Inglés (Imperial):** Pulgada ($\text{in}$), pie ($\text{ft}$), milésima de pulgada ($\text{mil}$).

#### 4. Conceptos de Medición
* **Exactitud:** Cercanía de una medición al valor real o verdadero.
* **Precisión:** Grado de repetibilidad o concordancia entre varias mediciones sucesivas del mismo objeto.
* **Error de medición:** Diferencia entre el valor medido y el valor real de la pieza.
* **Tolerancia dimensional:** Variación total permisible en la dimensión de una pieza (diferencia entre el límite superior y el límite inferior).

#### 5. Ajustes y Tolerancias (Sistema ISO)
* **Tipos de ajuste:**
  * **Juego (Holgura):** Siempre existe un espacio libre entre el eje y el agujero ($D_{\text{agujero}} > d_{\text{eje}}$). Permite movimiento relativo.
  * **Interferencia (Apriete):** El eje es más grande que el agujero antes del ensamble ($d_{\text{eje}} > D_{\text{agujero}}$). Requiere fuerza o cambio de temperatura para ensamblar.
  * **Transición (Indeterminado):** Puede resultar en un ajuste con juego pequeño o interferencia pequeña dependiendo de las medidas reales dentro de las tolerancias.
* **Nomenclatura ISO:**
  * **Letras mayúsculas (ej. H):** Representan la posición de la tolerancia para el **agujero**.
  * **Letras minúsculas (ej. f, g, k, p):** Representan la posición de la tolerancia para el **eje**.
  * **Números (ej. 6, 7, 8):** Representan el grado de calidad o magnitud de la tolerancia (Índice de Tolerancia Internacional - IT). A menor número, mayor precisión (menor tolerancia).
  * **Sistema Agujero Base (H):** Es el sistema más usado en la industria donde el agujero tiene desviación inferior nula (su dimensión mínima es igual al diámetro nominal) y se varía el diámetro del eje para obtener el ajuste deseado (ej. H7/g6 para juego, H7/p6 para apriete).

#### 6. Fórmulas de Tolerancias y Ajustes
* **Dimensiones Límite:**
  $$D_{\max} = D_{\text{nominal}} + ES \quad \text{(Agujero)}$$
  $$D_{\min} = D_{\text{nominal}} + EI \quad \text{(Agujero)}$$
  $$d_{\max} = d_{\text{nominal}} + es \quad \text{(Eje)}$$
  $$d_{\min} = d_{\text{nominal}} + ei \quad \text{(Eje)}$$

* **Tolerancia ($T$):**
  $$T = \text{Dimensión Máxima} - \text{Dimensión Mínima} = ES - EI$$

* **Cálculo de Juego (cuando $D > d$):**
  $$\text{Juego Máximo } (J_{\max}) = D_{\max} - d_{\min}$$
  $$\text{Juego Mínimo } (J_{\min}) = D_{\min} - d_{\max}$$

* **Cálculo de Interferencia / Apriete (cuando $d > D$):**
  $$\text{Interferencia Máxima } (I_{\max}) = d_{\max} - D_{\min}$$
  $$\text{Interferencia Mínima } (I_{\min}) = d_{\min} - D_{\max}$$

---

### Ejercicios Prácticos: Metrología

#### Ejercicio 1: Cálculo de Tolerancia y Límites
Un eje debe fabricarse con la siguiente especificación: $\varnothing 50 \pm 0.05\text{ mm}$.
1. Determine la dimensión máxima ($d_{\max}$).
2. Determine la dimensión mínima ($d_{\min}$).
3. Calcule la tolerancia total ($T$).
4. Si se mide una pieza y da $50.06\text{ mm}$, ¿es aceptada o rechazada? Justifique.

#### Ejercicio 2: Análisis de Ajuste (Agujero - Eje)
Se tiene un ensamble con las siguientes dimensiones:
* **Agujero:** $\varnothing 40^{+0.025}_{0.000}\text{ mm}$
* **Eje:** $\varnothing 40^{-0.009}_{-0.025}\text{ mm}$

1. Calcule las dimensiones máxima y mínima del agujero ($D_{\max}, D_{\min}$).
2. Calcule las dimensiones máxima y mínima del eje ($d_{\max}, d_{\min}$).
3. Determine el juego máximo ($J_{\max}$) y el juego mínimo ($J_{\min}$).
4. ¿Qué tipo de ajuste es (juego, interferencia o transición)?

#### Ejercicio 3: Precisión vs. Exactitud
Un operario mide 5 veces un bloque patrón cuyo valor real es exactamente $25.00\text{ mm}$, obteniendo los siguientes resultados con un micrómetro:
* Medición 1: $25.12\text{ mm}$
* Medición 2: $25.11\text{ mm}$
* Medición 3: $25.12\text{ mm}$
* Medición 4: $25.13\text{ mm}$
* Medición 5: $25.12\text{ mm}$

**Preguntas:**
1. ¿El proceso de medición es preciso? ¿Por qué?
2. ¿El proceso de medición es exacto? ¿Por qué?
3. ¿Qué acción correctiva recomendaría sobre el instrumento de medición?

---
---

## SECCIÓN 3: PROCESOS DE FUNDICIÓN

### Conceptos Clave y Fórmulas

#### 1. ¿Qué es la Fundición?
Proceso de manufactura en el cual un metal se derrite (estado líquido) y se vierte por gravedad o presión en la cavidad de un molde que tiene la forma deseada, dejándolo solidificar.

#### 2. Tipos de Moldes
* **Moldes desechables (no permanentes):** Hechos de arena, yeso o cerámica. Se destruyen para sacar la pieza (ej. fundición en arena, moldeo a la cera perdida).
* **Moldes permanentes:** Hechos de metal (acero o hierro fundido). Se reutilizan miles de veces (ej. fundición a presión / *die casting*, fundición centrífuga).

#### 3. Elementos de un Molde de Arena
* **Caja superior (*Cope*) y Caja inferior (*Drag*):** Estructuras que contienen la arena.
* **Bebedero (*Sprue*):** Conducto vertical por donde entra el metal líquido.
* **Pozo y Canales de alimentación (*Runners*):** Distribuyen el metal hacia la cavidad.
* **Cavidad del molde:** Espacio con la forma de la pieza (creado con un modelo).
* **Corazón o Macho (*Core*):** Inserto de arena para generar huecos o geometrías internas en la pieza.
* **Mazarota (*Riser*):** Depósito adicional de metal líquido que compensa la contracción durante la solidificación.

#### 4. Defectos Comunes en Fundición
* **Rechupe (Contracción):** Cavidades por falta de alimentación de metal al contraerse.
* **Porosidad gaseosa:** Burbujas atrapadas dentro de la pieza.
* **Llenado incompleto (*Misrun*):** El metal solidifica antes de llenar toda la cavidad.
* **Junta fría (*Cold shut*):** Dos frentes de metal líquido se encuentran pero no se fusionan por baja temperatura.
* **Inclusiones de arena/escoria:** Impurezas atrapadas en el metal.

#### 5. Fórmulas de Fundición

* **Regla de Chvorinov (Tiempo de solidificación):**
  $$t_s = C \cdot \left(\frac{V}{A}\right)^n$$
  Donde:
  * $t_s$: Tiempo total de solidificación ($\text{s}$ o $\text{min}$).
  * $V$: Volumen de la pieza o mazarota ($\text{cm}^3$ o $\text{mm}^3$).
  * $A$: Área superficial que disipa calor ($\text{cm}^2$ o $\text{mm}^2$).
  * $M = \frac{V}{A}$: Módulo de enfriamiento.
  * $C$: Constante del molde y material (ej. $\text{min/cm}^2$).
  * $n$: Exponente (generalmente $n = 2$).

* **Velocidad del metal (Teorema de Torricelli):**
  $$v = \sqrt{2 \cdot g \cdot h}$$
  Donde:
  * $v$: Velocidad del metal en la base del bebedero ($\text{cm/s}$ o $\text{m/s}$).
  * $g$: Aceleración de la gravedad ($9.81\text{ m/s}^2$ o $981\text{ cm/s}^2$).
  * $h$: Altura del bebedero ($\text{m}$ o $\text{cm}$).

* **Caudal Volumétrico ($Q$):**
  $$Q = A \cdot v$$
  Donde:
  * $Q$: Caudal ($\text{cm}^3/\text{s}$).
  * $A$: Área de la sección transversal en la base del bebedero ($\text{cm}^2$).

* **Tiempo de llenado del molde ($t_f$):**
  $$t_f = \frac{V_{\text{molde}}}{Q}$$

---

### Ejercicios Prácticos: Fundición

#### Ejercicio 1: Regla de Chvorinov (Comparación de Formas)
Se desean fundir dos piezas de acero de igual volumen ($V = 1000\text{ cm}^3$) en moldes de arena idénticos ($n = 2$):
* **Pieza A:** Un cubo de lado $L = 10\text{ cm}$.
* **Pieza B:** Una placa plana de dimensiones $20\text{ cm} \times 25\text{ cm} \times 2\text{ cm}$.

1. Calcule el área superficial ($A$) de cada pieza.
2. Calcule el módulo de enfriamiento ($V/A$) de cada pieza.
3. ¿Cuál de las dos piezas tardará más tiempo en solidificar? ¿En qué proporción?
4. ¿Cuál de las dos geometrías serviría mejor como mazarota? Justifique.

#### Ejercicio 2: Diseño de Mazarota Cilíndrica
Se va a fundir una pieza cuyo módulo de enfriamiento es $(V/A)_{\text{pieza}} = 1.5\text{ cm}$. Para evitar rechupes, el tiempo de solidificación de la mazarota debe ser un $25\%$ mayor que el de la pieza ($t_{\text{mazarota}} = 1.25 \cdot t_{\text{pieza}}$).
Si se diseña una mazarota cilíndrica donde la altura es igual al diámetro ($H = D$) y se asume que disipa calor por todas sus caras ($n = 2$):
1. Exprese el volumen ($V$) y el área ($A$) del cilindro en función de $D$.
2. Calcule el diámetro ($D$) necesario para la mazarota.

#### Ejercicio 3: Tiempo de Llenado del Molde
Un molde tiene una cavidad con un volumen de $2500\text{ cm}^3$. El bebedero de colada tiene una altura $h = 20\text{ cm}$ y el área de la sección transversal en su base es de $2.5\text{ cm}^2$. Considere $g = 981\text{ cm/s}^2$.
1. Calcule la velocidad del metal líquido en la base del bebedero ($v$).
2. Calcule el caudal volumétrico ($Q$).
3. Determine el tiempo teórico necesario para llenar el molde ($t_f$).

---
---

## SECCIÓN 4: CONFORMADO Y DEFORMACIÓN PLÁSTICA

### Conceptos Clave y Fórmulas

#### 1. Deformación Elástica vs. Plástica
* **Deformación Elástica:** Temporal; el material recupera su forma y dimensiones originales al retirar la carga (región lineal gobernada por la Ley de Hooke).
* **Deformación Plástica:** Permanente; ocurre cuando el esfuerzo supera el límite de fluencia del material, provocando movimiento de dislocaciones.

#### 2. Trabajo en Frío vs. Trabajo en Caliente
* **Trabajo en Frío (bajo temperatura de recristalización):**
  * *Ventajas:* Mejor acabado superficial, mayor precisión dimensional, aumenta la resistencia y dureza por endurecimiento por deformación (acritud).
  * *Desventajas:* Requiere mayores fuerzas/potencia, disminuye la ductilidad.
* **Trabajo en Caliente (sobre temperatura de recristalización):**
  * *Ventajas:* Permite grandes deformaciones con menores fuerzas, no hay endurecimiento por deformación, refina la estructura de grano.
  * *Desventajas:* Menor precisión dimensional, oxidación superficial (cascarilla), mayor consumo de energía térmica.

#### 3. Procesos Principales de Conformado Volumétrico y de Lámina
* **Laminado (*Rolling*):** Reducción del espesor de una placa o lámina pasándola entre dos rodillos giratorios.
* **Forjado (*Forging*):** Deformación por compresión usando impacto o presión gradual entre dados o matrices.
* **Extrusión (*Extrusion*):** Se fuerza al material a fluir a través de la abertura de un dado para obtener perfiles de sección transversal constante.
* **Trefilado / Estirado (*Drawing*):** Se jala una barra o alambre a través de un dado para reducir su diámetro.
* **Troquelado / Punzonado / Doblado:** Procesos de corte y conformado de chapa metálica.

#### 4. Fórmulas de Conformado Mecánico

* **Esfuerzo y Deformación Ingenieril:**
  $$\sigma = \frac{F}{A_0} \quad ; \quad e = \frac{L_f - L_0}{L_0} = \frac{\Delta L}{L_0}$$

* **Esfuerzo y Deformación Real (Verdadera):**
  $$\sigma_v = \frac{F}{A_i} \quad ; \quad \varepsilon = \ln\left(\frac{L_f}{L_0}\right) = \ln\left(\frac{A_0}{A_f}\right) = \ln\left(\frac{h_0}{h_f}\right)$$

* **Curva de Fluencia (Ley de Hollomon en región plástica):**
  $$\sigma_f = K \cdot \varepsilon^n$$
  Donde $K$ es el coeficiente de resistencia y $n$ el exponente de endurecimiento por deformación.

* **Fórmulas de Laminado Plano:**
  * **Reducción de espesor (*Draft* - $d$):**
    $$d = h_0 - h_f$$
  * **Reducción máxima posible ($d_{\max}$):**
    $$d_{\max} = \mu^2 \cdot R$$
    (Donde $\mu$ es el coeficiente de fricción y $R$ el radio del rodillo).
  * **Longitud de contacto ($L$):**
    $$L = \sqrt{R \cdot (h_0 - h_f)}$$
  * **Deformación real en laminado:**
    $$\varepsilon = \ln\left(\frac{h_0}{h_f}\right)$$
  * **Esfuerzo de fluencia promedio ($\bar{Y}_f$):**
    $$\bar{Y}_f = \frac{K \cdot \varepsilon^n}{1 + n}$$
  * **Fuerza de laminado ($F$):**
    $$F = \bar{Y}_f \cdot w \cdot L$$
    (Donde $w$ es el ancho de la lámina).
  * **Potencia de laminado ($P$ para dos rodillos):**
    $$P = 2 \cdot \pi \cdot N \cdot F \cdot L$$
    (Donde $N$ es la velocidad de giro en $\text{rev/s}$ o $\text{RPM}/60$).

* **Fórmulas de Corte de Chapa (Punzonado / Troquelado):**
  * **Fuerza de corte ($F_c$):**
    $$F_c = 0.7 \cdot TS \cdot t \cdot L_c \quad \text{o} \quad F_c = \tau \cdot t \cdot L_c$$
    Donde:
    * $TS$: Resistencia última a la tracción ($\text{MPa}$).
    * $\tau$: Resistencia al corte del material ($\text{MPa}$).
    * $t$: Espesor de la lámina ($\text{mm}$).
    * $L_c$: Perímetro de corte ($\text{mm}$). Para un agujero circular: $L_c = \pi \cdot D$.

---

### Ejercicios Prácticos: Conformado

#### Ejercicio 1: Laminado Plano
Una placa de aluminio de ancho $w = 250\text{ mm}$ y espesor inicial $h_0 = 25\text{ mm}$ se va a reducir en un solo paso de laminado en frío a un espesor final $h_f = 20\text{ mm}$. Los rodillos tienen un radio $R = 300\text{ mm}$ y giran a $N = 50\text{ RPM}$. El coeficiente de fricción entre los rodillos y el material es $\mu = 0.15$. El material tiene un esfuerzo de fluencia promedio $\bar{Y}_f = 180\text{ MPa}$.
1. Calcule la reducción de espesor ($d$) y verifique si es factible realizarla comparándola con la reducción máxima ($d_{\max}$).
2. Calcule la longitud de contacto ($L$).
3. Determine la fuerza de laminado ($F$) requerida en $\text{N}$ y $\text{kN}$.
4. Calcule la potencia ($P$) necesaria en $\text{kW}$ para accionar los rodillos.

#### Ejercicio 2: Punzonado de Chapa Metálica
Se desea perforar un agujero circular de diámetro $D = 30\text{ mm}$ en una lámina de acero al carbono de espesor $t = 4\text{ mm}$. El acero tiene una resistencia al corte $\tau = 350\text{ MPa}$.
1. Calcule el perímetro de corte ($L_c$).
2. Determine el área sometida a corte ($A_c = t \cdot L_c$).
3. Calcule la fuerza de punzonado ($F_c$) necesaria en $\text{kN}$ y en toneladas fuerza ($\text{tonf}$).

#### Ejercicio 3: Deformación Real y Endurecimiento
Una barra cilíndrica de cobre recocido ($K = 315\text{ MPa}$, $n = 0.54$) tiene una longitud inicial $L_0 = 100\text{ mm}$ y se estira plásticamente hasta alcanzar una longitud final $L_f = 135\text{ mm}$ (conservando su volumen constante).
1. Calcule la deformación ingenieril ($e$).
2. Calcule la deformación real ($\varepsilon$).
3. Determine el esfuerzo de fluencia real ($\sigma_f$) del material al final de la deformación.

---
---

## SECCIÓN 5: PROCESOS DE MECANIZADO (ARRANQUE DE VIRUTA)

### Conceptos Clave y Fórmulas

#### 1. ¿Qué es el Mecanizado?
Conjunto de procesos de manufactura por remoción de material en los cuales una herramienta de corte afilada elimina el exceso de material en forma de viruta para lograr la geometría, tolerancias y acabado superficial deseados.

#### 2. Procesos Convencionales Principales
* **Torneado (*Turning*):** La pieza de trabajo gira mientras una herramienta de corte de una sola punta se desplaza linealmente (genera piezas cilíndricas o de revolución).
* **Fresado (*Milling*):** La herramienta de corte (fresa) de múltiples filos gira mientras la pieza de trabajo avanza hacia ella (genera superficies planas, ranuras, cavidades).
* **Taladrado (*Drilling*):** Una herramienta giratoria con dos o más filos en su extremo (broca) avanza axialmente para crear o agrandar agujeros redondos.

#### 3. Parámetros de Corte
* **Velocidad de corte ($V_c$):** Velocidad tangencial relativa entre la herramienta y la superficie de la pieza ($\text{m/min}$).
* **Velocidad de giro ($N$):** Velocidad rotacional del husillo (pieza en torno o herramienta en fresa/taladro) medida en $\text{RPM}$ ($\text{rev/min}$).
* **Avance ($f$ o $f_z$):** Distancia que avanza la herramienta por cada revolución ($\text{mm/rev}$ en torneado/taladrado) o por cada diente ($\text{mm/diente}$ en fresado).
* **Velocidad de avance ($v_f$ o $f_r$):** Velocidad lineal con la que se desplaza la herramienta ($\text{mm/min}$).
* **Profundidad de corte ($d$ o $a_p$):** Espesor de la capa de material que se remueve en una pasada ($\text{mm}$).

#### 4. Fórmulas de Mecanizado

##### A. Torneado:
* **Velocidad de giro ($N$):**
  $$N = \frac{1000 \cdot V_c}{\pi \cdot D_0}$$
  (Donde $D_0$ es el diámetro en $\text{mm}$ y $V_c$ en $\text{m/min}$).
* **Velocidad de avance ($v_f$):**
  $$v_f = f \cdot N \quad (\text{mm/min})$$
* **Tiempo de mecanizado ($T_m$):**
  $$T_m = \frac{L}{v_f} = \frac{L}{f \cdot N} \quad (\text{min})$$
  (Donde $L$ es la longitud a mecanizar más las distancias de entrada/salida).
* **Tasa de remoción de material ($MRR$ o $Q$):**
  $$MRR = 1000 \cdot V_c \cdot f \cdot d \quad (\text{mm}^3/\text{min})$$
  *(Aproximadamente igual a $\pi \cdot D_{\text{prom}} \cdot d \cdot f \cdot N$)*.

##### B. Taladrado:
* **Velocidad de giro ($N$):**
  $$N = \frac{1000 \cdot V_c}{\pi \cdot D}$$
  (Donde $D$ es el diámetro de la broca en $\text{mm}$).
* **Velocidad de avance ($v_f$):**
  $$v_f = f \cdot N \quad (\text{mm/min})$$
* **Longitud de aproximación por punta de broca ($A$):**
  $$A = 0.5 \cdot D \cdot \tan\left(90^\circ - \frac{\theta}{2}\right)$$
  (Para ángulo de punta estándar $\theta = 118^\circ$, $A \approx 0.3 \cdot D$).
* **Tiempo de taladrado ($T_m$):**
  $$T_m = \frac{t + A}{v_f}$$
  (Para agujero pasante de espesor $t$).
* **Tasa de remoción de material ($MRR$):**
  $$MRR = \frac{\pi \cdot D^2}{4} \cdot v_f \quad (\text{mm}^3/\text{min})$$

##### C. Fresado:
* **Velocidad de giro ($N$):**
  $$N = \frac{1000 \cdot V_c}{\pi \cdot D}$$
  (Donde $D$ es el diámetro de la fresa en $\text{mm}$).
* **Velocidad de avance de la mesa ($v_f$):**
  $$v_f = f_z \cdot z \cdot N \quad (\text{mm/min})$$
  (Donde $f_z$ es el avance por diente en $\text{mm/diente}$ y $z$ es el número de dientes de la fresa).
* **Tasa de remoción de material ($MRR$):**
  $$MRR = w \cdot d \cdot v_f \quad (\text{mm}^3/\text{min})$$
  (Donde $w$ es el ancho de corte y $d$ la profundidad de corte).

##### D. Vida de la Herramienta (Ecuación de Taylor):
$$V_c \cdot T^n = C$$
Donde:
* $V_c$: Velocidad de corte ($\text{m/min}$).
* $T$: Tiempo de vida útil de la herramienta ($\text{min}$).
* $n$ y $C$: Constantes empíricas que dependen del material de la herramienta, la pieza y las condiciones de corte.

---

### Ejercicios Prácticos: Mecanizado

#### Ejercicio 1: Cilindrado en Torno
Una barra cilíndrica de acero de diámetro inicial $D_0 = 80\text{ mm}$ y longitud $L = 300\text{ mm}$ se va a cilindrar en una sola pasada hasta un diámetro final $D_f = 76\text{ mm}$. Las condiciones recomendadas para la herramienta de carburo son: velocidad de corte $V_c = 150\text{ m/min}$ y avance $f = 0.25\text{ mm/rev}$.
1. Determine la profundidad de corte ($d$).
2. Calcule las revoluciones por minuto ($N$) a las que debe girar el plato del torno.
3. Calcule la velocidad de avance ($v_f$) en $\text{mm/min}$.
4. Determine el tiempo de corte ($T_m$) para completar la pasada.
5. Calcule la tasa de remoción de material ($MRR$) en $\text{cm}^3/\text{min}$.

#### Ejercicio 2: Operación de Fresado Frontal
Se utiliza una fresa frontal de diámetro $D = 100\text{ mm}$ con $z = 8\text{ dientes}$ para mecanizar la superficie completa de un bloque rectangular de fundición gris de ancho $w = 60\text{ mm}$ y longitud $L = 400\text{ mm}$. La velocidad de corte es $V_c = 90\text{ m/min}$, el avance por diente es $f_z = 0.12\text{ mm/diente}$ y la profundidad de corte es $d = 3\text{ mm}$.
1. Calcule la velocidad de rotación del husillo ($N$) en $\text{RPM}$.
2. Determine la velocidad de avance de la mesa ($v_f$) en $\text{mm/min}$.
3. Calcule la tasa de remoción de material ($MRR$) en $\text{mm}^3/\text{min}$ y $\text{cm}^3/\text{min}$.
4. Si se considera una distancia adicional de entrada y salida total de $A = 100\text{ mm}$, ¿cuál es el tiempo total de mecanizado ($T_m$)?

#### Ejercicio 3: Taladrado y Ecuación de Taylor
1. **Parte A (Taladrado):** Se debe perforar un agujero pasante con una broca de diámetro $D = 20\text{ mm}$ en una placa de acero de espesor $t = 35\text{ mm}$ (asuma longitud de punta $A = 0.3 \cdot D$). Si se usa $V_c = 30\text{ m/min}$ y $f = 0.20\text{ mm/rev}$, calcule las $\text{RPM}$ ($N$), la velocidad de avance ($v_f$) y el tiempo que toma perforar un agujero ($T_m$).
2. **Parte B (Vida de herramienta de Taylor):** En un ensayo de torneado se rige por la ecuación de Taylor $V_c \cdot T^{0.25} = 300$. Calcule cuántos minutos durará el filo de la herramienta ($T$) si se trabaja a una velocidad de corte $V_c = 120\text{ m/min}$.