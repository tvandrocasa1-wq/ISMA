==========================================================================
APLICACIÓN WEB: DIMENSIONAMIENTO DE CINTAS TRANSPORTADORAS
Norma DIN 22101 / UNE 58-504-98 / Metodología de la Asignatura
Asignatura: Transporte y Manutención Industrial
Máster Universitario en Ingeniería Industrial

==========================================================================

1. OBJETIVO DEL PROYECTO
-------------------------
El objetivo de este proyecto es desarrollar una aplicación web completa, rigurosa, interactiva y de fácil manejo que permita dimensionar completamente una instalación de cinta transportadora de acuerdo con los criterios y normas técnicas impartidos en la asignatura (DIN 22101, UNE 58-504-98, catálogo Rulmeca y apuntes del profesor).

La aplicación permite determinar:
  a) El ángulo de inclinación geométrico (delta) y el factor reductor de capacidad (k).
  b) La anchura mínima comercial normalizada de la banda (B) y la velocidad máxima permitida (v_max) según las características del material.
  c) La sección transversal del material en artesa (S = S1 + S2), el ancho útil (b), la longitud del rodillo central (l3) y el ancho superior del lecho de material (w).
  d) El caudal volumétrico a 1 m/s (I_VT).
  e) La velocidad teórica necesaria y su normalización a valores estándar según la norma DIN 22101.
  f) El caudal horario másico y volumétrico efectivo real transportado (Q).
  g) La masa lineal del material (q_G), las resistencias al avance (principales, secundarias y de elevación), y la fuerza tangencial necesaria en el tambor motriz (Fu).
  h) La potencia requerida en el tambor (Pa) y la potencia nominal del motor eléctrico (Pm) considerando el rendimiento del grupo motor-reductor (eta).
  i) Las tensiones en el tambor motriz (T1 y T2) mediante la formulación exponencial de Euler-Eytelwein (evitando el deslizamiento banda-tambor).
  j) La comprobación de la tensión específica de la banda (T1/B) frente a la resistencia admisible de una banda textil multicapa con factor de seguridad.


2. ARCHIVOS QUE COMPONEN LA APLICACIÓN
--------------------------------------
- index.html:
  Estructura semántica HTML5 de la aplicación. Contiene el panel de parámetros de entrada, el resumen de indicadores clave (KPIs), el elemento <canvas> para la representación gráfica en tiempo real y el desglose de la memoria de cálculo analítica paso a paso.

- styles.css:
  Hoja de estilos CSS3 moderna y adaptativa (responsive design). Organiza la información en tarjetas modulares, define la paleta cromática industrial, tipografías técnicas legibles, badges de validación/alerta y reglas de maquetación para impresión (@media print).

- materiales.json:
  Base de datos externa en formato JSON con las propiedades físicas de materiales industriales (densidad aparente, ángulo de talud dinámico, clase de abrasividad, granulometría), las anchuras normalizadas de banda, las velocidades estándar DIN 22101, las longitudes de rodillos centrales l3 según fabricante y las tablas de factores correctores (k y Cl).

- script.js:
  Motor de cálculo y controlador en JavaScript (ES6+). Implementa:
    * Carga asíncrona del archivo JSON con respaldo local automático (permite funcionamiento directo mediante file:// sin errores de CORS).
    * Mecanismo de carga de archivos JSON personalizados vía FileReader.
    * Funciones matemáticas analíticas para el cálculo de artesas y resistencias.
    * Algoritmo de normalización y verificación de condiciones límite.
    * Renderizado interactivo en HTML5 Canvas de la sección transversal del material en artesa con acotaciones dinámicas.

- abrir_con_servidor.bat:
  Script de acceso rápido para Windows que lanza automáticamente un servidor HTTP local en Python y abre la aplicación en el navegador predeterminado.

- Readme.txt:
  Este documento técnico de especificación, funcionamiento y resolución de ejemplos.


3. CÓMO EJECUTAR LA APLICACIÓN
------------------------------
OPCIÓN A (La más rápida y directa - Sin instalar nada):
1. Haz doble clic directamente sobre el archivo "index.html".
2. Se abrirá en tu navegador web habitual (Chrome, Edge, Firefox, Safari...).
3. La aplicación funcionará de inmediato con los datos integrados por defecto.
4. Si realizas cambios en "materiales.json", puedes pulsar el botón "📂 Cargar JSON" en la propia página para cargar tus modificaciones al instante.

OPCIÓN B (Con servidor web local):
- En Windows: Haz doble clic en el archivo "abrir_con_servidor.bat".
  (Iniciará un servidor en el puerto 8000 y abrirá http://localhost:8000 automáticamente).
- En terminal (Windows / macOS / Linux):
  Abre una terminal en esta carpeta y ejecuta:
    python -m http.server 8000
  Luego abre en tu navegador: http://localhost:8000


4. FORMULACIÓN Y FUNDAMENTOS MATEMÁTICOS
----------------------------------------
La metodología empleada sigue rigurosamente el procedimiento de los apuntes de la asignatura:

4.1. Inclinación y factor k
  delta = arcsin(H / L)
  El factor k se obtiene interpolando en la Tabla 2 de la norma DIN 22101 (2º -> 1.0; 10º -> 0.95; 20º -> 0.81).

4.2. Anchura y Sección Transversal (Método 1 - Analítico)
  - Ancho útil con material:
      b = 0.9 · B - 0.05  (con B y b en metros)
  - Reparto de longitud en artesa:
      L_artesa = (b - l3) / 2
      * Para 1 rodillo plano: l3 = 0, lambda = 0
      * Para 2 rodillos en V: l3 = 0
      * Para 3 rodillos en artesa: l3 se extrae de la tabla de rodillos del fabricante.
  - Ancho superior del material:
      w = l3 + 2 · L_artesa · cos(lambda)
  - Sección superior del montón (forma de sector/parábola):
      S1 = (w^2 · tan(beta)) / 6
  - Sección inferior trapezoidal:
      S2 = (l3 + L_artesa · cos(lambda)) · L_artesa · sen(lambda)
  - Sección transversal total:
      S = S1 + S2
  - Caudal volumétrico unitario a 1 m/s:
      I_VT = 3600 · S  (m^3/h a 1 m/s)

4.3. Velocidad de Avance
  - Velocidad teórica requerida:
      v_teorica = Q / (I_VT · rho · k)  (donde rho viene en T/m3)
  - Se selecciona la velocidad normalizada inmediatamente superior según DIN 22101:
      [0.66, 0.84, 1.05, 1.31, 1.68, 2.09, 2.62, 3.35, 4.19, 5.24] m/s.
  - Se comprueba que v_norm <= v_max según el tipo de material (Clase A, B, C o D). Si se supera, se debe aumentar la anchura B.
  - Caudal efectivo transportado:
      Q_efectivo = I_VT · v_norm · rho · k  (T/h) >= Q_pedido

4.4. Resistencias y Potencia del Motor (UNE 58-504-98 / L > 80 m)
  - Masa lineal del material transportado:
      q_G = Q_efectivo / (3.6 · v_norm)  (kg/m)
  - Masa lineal de rodillos en ramal superior:
      q_ro = masa_rodillo_sup / distancia_entre_rodillos_sup  (kg/m)
  - Masa lineal de rodillos en ramal inferior:
      q_ru = masa_rodillo_inf / distancia_entre_rodillos_inf  (kg/m)
  - Fuerza tangencial requerida en el tambor motriz:
      Fu = f · Cl · L · g · [q_ro + q_ru + (2·qb + q_G) · cos(delta)] + q_G · H · g  (N)
      (donde g = 9.81 m/s^2, f = coeficiente de rozamiento, Cl = factor de longitud ficticia).
  - Potencia en el tambor:
      Pa = Fu · v_norm  (W)
  - Potencia nominal del motor:
      Pm = Pa / eta  (kW)  (siendo eta el rendimiento del reductor).

4.5. Tensiones y Resistencia de la Banda (Ecuación de Euler-Eytelwein)
  - Condición límite contra el deslizamiento tambor-banda:
      T1 / T2 <= e^(mu · theta)  (theta en radianes)
      T2 = Fu / (e^(mu · theta) - 1)  [Ramal flojo]
      T1 = T2 + Fu                   [Ramal tenso]
  - Tensión específica máxima:
      T1_esp = T1 / B  (N/mm de anchura)
  - Resistencia admisible de la banda textil:
      R_adm = (num_capas · R_nominal_capa) / Coeficiente_seguridad (Cs)
  - Condición de seguridad:
      T1_esp <= R_adm  -->  Banda Adecuada.


5. RESOLUCIÓN DE UN EJEMPLO PASO A PASO
---------------------------------------
A continuación se recoge la resolución completa del ejemplo tipo de la asignatura (Ejemplo 3 de los apuntes / ejercicio del granito fino):

DATOS DEL ENUNCIADO:
- Material: Granito fino triturado, tamaño máximo 10 mm (uniforme).
- Densidad aparente: rho = 1500 kg/m^3 = 1.5 T/m^3.
- Grado de abrasividad: Abrasivo (Clase C).
- Ángulo de talud dinámico: beta = 15º.
- Caudal mínimo exigido: Q = 100 T/h.
- Longitud de la cinta: L = 100 m.
- Desnivel: H = 0 m (horizontal).
- Disposición de rodillos: Estación de 3 rodillos con ángulo de artesa lambda = 30º.
- Rendimiento motor-reductor: eta = 85% = 0.85.
- Coeficiente de fricción f: 0.02.
- Coeficiente de rozamiento tambor-banda: mu = 0.02 (según enunciado).
- Ángulo de arrollamiento: theta = 210º = 3.665 rad.
- Peso propio de la banda: qb = 3.8 kg/m.
- Masa rodillos superiores: 5.4 kg cada 1.2 m.
- Masa rodillos inferiores: 4.0 kg cada 2.4 m.
- Banda propuesta: Textil de 3 capas con 200 N/mm de resistencia nominal por capa.

RESOLUCIÓN ANALÍTICA:

Paso 1: Inclinación
  Como H = 0 m, la cinta es horizontal: delta = 0º.
  En la Tabla 2: k = 1.0.

Paso 2: Anchura mínima recomendada
  Para granito fino de 10 mm (uniforme), la Figura 2 indica que la anchura mínima normalizada es:
  B = 400 mm = 0.4 m.
  Para B = 400 mm y material de Clase C (1.5-2.0 T/m^3, abrasivo), la velocidad máxima admisible es:
  v_max = 2.09 m/s (aproximada como 2.0 m/s en notas).

Paso 3: Sección transversal de material
  - Ancho útil:
      b = 0.9 · 0.4 - 0.05 = 0.31 m.
  - Para 3 rodillos y B = 400 mm, la longitud del rodillo central según la Figura 6 es:
      l3 = 160 mm = 0.16 m.
  - Longitud en artesa:
      L_artesa = (b - l3) / 2 = (0.31 - 0.16) / 2 = 0.075 m.
  - Ancho superior:
      w = l3 + 2 · L_artesa · cos(30º) = 0.16 + 2 · 0.075 · 0.866 = 0.2899 m.
  - Sección superior:
      S1 = (0.2899^2 · tan(15º)) / 6 = 0.003753 m^2.
  - Sección inferior:
      S2 = (0.16 + 0.075 · cos(30º)) · 0.075 · sen(30º) = 0.008435 m^2.
  - Sección total:
      S = S1 + S2 = 0.003753 + 0.008435 = 0.012188 m^2.
  - Caudal volumétrico a 1 m/s:
      I_VT = 3600 · 0.012188 = 43.88 m^3/h.

Paso 4: Velocidad de la cinta
  - Velocidad teórica:
      v_teorica = 100 / (43.88 · 1.5 · 1.0) = 1.519 m/s.
  - Normalización DIN 22101:
      Se adopta la velocidad normalizada v = 1.68 m/s (en apuntes se evalúa con 1.52 m/s).
      Comprobación: 1.68 m/s <= v_max = 2.09 m/s. Cumple perfectamente.
  - Caudal real:
      Q_real = 43.88 · 1.68 · 1.5 · 1.0 = 110.58 T/h >= 100 T/h.

Paso 5: Potencia del motor (evaluado con v = 1.52 m/s según ejercicio)
  - Carga lineal del material:
      q_G = 100 / (3.6 · 1.52) = 18.27 kg/m.
  - Carga lineal rodillos superiores:
      q_ro = 5.4 / 1.2 = 4.50 kg/m.
  - Carga lineal rodillos inferiores:
      q_ru = 4.0 / 2.4 = 1.67 kg/m.
  - Coeficiente Cl para L = 100 m: Cl = 1.7.
  - Fuerza de accionamiento Fu:
      Fu = 0.02 · 1.7 · 100 · 9.81 · [4.50 + 1.67 + (2·3.8 + 18.27) · 1] + 0
      Fu = 3.3354 · [6.17 + 25.87] · 9.81 / 9.81...
      Fu = 1068.56 N.
  - Potencia requerida en tambor:
      Pa = Fu · v = 1068.56 · 1.52 = 1624.2 W = 1.62 kW.
  - Potencia del motor:
      Pm = Pa / eta = 1.62 kW / 0.85 = 1.91 kW.

Paso 6: Tensión y verificación de banda
  - Euler-Eytelwein:
      theta = 210º = 3.665 rad
      e^(mu · theta) = e^(0.02 · 3.665) = e^(0.0733) = 1.07606
      T2 = Fu / (1.07606 - 1) = 1068.56 / 0.07606 = 14048.9 N.
      T1 = T2 + Fu = 14048.9 + 1068.56 = 15117.5 N = 15.12 kN.
  - Tensión específica en la banda:
      T1 / B = 15117.5 N / 400 mm = 37.79 N/mm.
  - Resistencia admisible con 3 capas de 200 N/mm y factor de seguridad Cs = 10:
      R_adm = (3 · 200) / 10 = 60.0 N/mm.
  - Verificación:
      37.79 N/mm <= 60.0 N/mm  -->  ¡La banda textil es COMPLETAMENTE ADECUADA!


==========================================================================
