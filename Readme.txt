DIMENSIONADO DE UNA CINTA TRANSPORTADORA: HTML + CSS + JSON + JavaScript + Canvas
================================================================================

Tarea 1: desarrollo de aplicación web
Transporte y Manutención Industrial. Máster Universitario en Ingeniería Industrial. USAL
Autor: Ismail El Asri Dahnoun


Objetivo
--------
Crear una página web que dimensione o compruebe una cinta transportadora siguiendo
los "Apuntes sobre cintas transportadoras" (v1) del profesor Raúl Muñoz. A partir de
los datos de la instalación calcula:

  1. La capacidad de transporte (banda y velocidad).
  2. Las resistencias al avance y la fuerza periférica Fu.
  3. La potencia, el par y la velocidad de giro del tambor.
  4. Las tensiones T1 y T2 y la comprobación de la adherencia.
  5. La flecha entre rodillos en los dos ramales.
  6. El número de capas de la banda.

Cada resultado aparece con su fórmula y sus valores sustituidos para poder repetirlo
a mano.


Archivos
--------
- index.html: estructura y contenidos de la página; incluye tres <canvas>.
- styles.css: formato y aspecto de la página.
- datos.json: materiales, tablas de los apuntes, tablas de Rulmeca, ejemplos y ejercicios.
- script.js: lee los datos, valida las entradas, calcula, resuelve los ejercicios y
  dibuja en Canvas.
- vista3d.js: anima la cinta en 3D con los datos del cálculo.
- three.min.js: biblioteca Three.js r160 (licencia MIT), usada por vista3d.js.
- Readme.txt: este archivo.
- abrir_con_servidor.bat: acceso directo para abrir con servidor local (opcional).


Cómo ejecutarlo
---------------
Opción A (la más rápida, sin instalar nada):
1. Haz doble clic en "index.html".
2. Se abrirá en tu navegador y funcionará de inmediato con los datos integrados.
3. Si modificas "datos.json", pulsa "Cargar archivo datos.json" en la propia página
   para cargar tus cambios sin necesidad de servidor.

Opción B (con servidor local):
- En Windows: haz doble clic en "abrir_con_servidor.bat".
  (O abre PowerShell en esta carpeta y ejecuta: python -m http.server 8000)
  Importante: el servidor debe arrancarse DENTRO de esta carpeta. Si se arranca en otra,
  el navegador muestra la lista de archivos de esa carpeta en lugar de la aplicación.
  Con el servidor, la página lee datos.json directamente. Para cerrarlo: Ctrl+C.
- En macOS/Linux: ejecuta python3 -m http.server 8000 y abre http://localhost:8000


Cómo se usa
-----------
1. Elige un ejemplo resuelto o escribe tus datos. Todo se recalcula al momento.
2. Elige el modo de trabajo:
   - Dimensionar: das Q y el material, y la app elige la banda y la velocidad. Si
     quieres, puedes fijar B, v o las dos en sus desplegables.
   - Comprobar: indicas B y v, y la app comprueba esa cinta. La carga puede ser la
     capacidad Q o directamente la masa lineal qg (como en el ejemplo de los apuntes).
3. Elige T2: automática (mínima con un margen) o adoptada por ti. Si la adoptas, un
   deslizador permite ver en directo cómo cambian la adherencia y la flecha.
4. Elige las tensiones locales para la flecha: calculadas o adoptadas por ti.
5. Lee el resultado: el mensaje general, las cifras principales, la lista de
   comprobaciones (✓ o ✗), los avisos, la sección a escala, las dos gráficas y la tabla
   paso a paso.
   Con 2 o 3 rodillos se admite λ = 0: rodillos alineados, banda plana y S2 = 0.
   Con 1 rodillo, la app fija λ = 0 (l3 = 0 y S2 = 0). Con 2 rodillos y las tablas de
   Rulmeca, fija λ = 20°. El desnivel H es de la instalación y no depende de los rodillos.
   La vista 3D se reconstruye con B, la estación, λ, θ, H, las separaciones y v. Se puede
   girar con el ratón, cambiar de vista y pausar. Si L > 24 m, dibuja un tramo de 24 m.
   Opciones de la vista 3D:
   - Mapa de tensiones: colorea la banda de azul a rojo. Reparto lineal de T2 a Tcola en
     el retorno y de Tcola a T1 en el portante, con Tcola calculada (apartado F).
   - Sección en corte: corta la cinta y muestra S1 y S2 en color, con la geometría real.
   - Fuerzas: T1, T2 y Fu con longitud proporcional, y el arco del ángulo abrazado.
     Si T1/T2 > e^(μφ), avisa, pone el tambor en rojo y anima el patinaje.
   - Flecha: dibuja h = q·g·cos δ·lR²/(8T) entre rodillos, real o exagerada × 5, × 20 o
     × 50. La exageración solo afecta al dibujo, nunca a los cálculos.
   - Pantalla completa, para la exposición.
   - Recorrido: vídeo de unos 2 min en un solo movimiento continuo de cámara, de las montañas a la descarga, con pausa,
     tramo anterior y siguiente, barra de posición, velocidad y zoom. En cada tramo
     muestra los resultados del cálculo actual. El paisaje es decorativo.
   - Material: lo quita o lo pone en el dibujo. Las cifras siguen siendo las de la cinta
     cargada; para calcular otra carga hay que cambiar Q o qg.
   - Cotas: dibuja L, H, δ, B, las separaciones de rodillos, v y Q como cotas de plano.
     Se pone y se quita con su botón.
   - Tambor de reenvío: al añadirlo, cambia φ en la calculadora y se recalcula todo; al
     quitarlo, vuelve a φ = 180° o al valor anterior. Una tabla en el 3D compara los
     resultados sin y con reenvío. Se dibuja siempre que φ > 180°.
   - Ver solución: aparece cuando algo falla. Muestra en el dibujo el arreglo, como el
     tambor de reenvío, y permite comparar con el fallo. No cambia el cálculo.
   - Capas de la banda: lupa con el número de capas z calculado, también en el recorrido.
   Las casillas con los datos del enunciado brillan en azul. Si el diseño no cumple, las
   que conviene cambiar brillan en rojo y "Cómo redimensionar" propone valores estimados,
   con un botón para aplicarlos. Tras aplicarlos se recalcula todo y puede aparecer otro
   consejo, porque unas magnitudes dependen de otras.
   El selector de ejemplos incluye cuatro "Casos que fallan" (patinaje, flecha, capacidad
   y velocidad). Los fallos también se ven en 3D: el tambor rojo que gira en falso, el
   ramal rojo hundido y el material que rebosa.
6. Abre un ejercicio de la sección 4 para ver su enunciado, su desarrollo y la
   comparación con el valor publicado. Al abrirlo, sus datos de partida se cargan en la
   calculadora. Los ejercicios parciales usan "Fu conocida" y "Tmáx conocida".
7. Con "Imprimir" puedes guardar la memoria de cálculo en PDF.

Si un dato no es válido, el campo se marca en rojo y la página explica el motivo.
Los campos que no intervienen en el caso elegido se ocultan.


Explicación del cálculo
-----------------------
La página de cada fórmula se refiere a los apuntes. g = 9,81 m/s².

A) Inclinación
   sen δ = H / L

B) Capacidad (solo si se trabaja con Q)
   K: Tabla 1.1 con interpolación lineal (pág. 54). Se usa |δ|.
   Anchura mínima por bulto: el mayor valor entre factor·tamaño (Tabla 1.2) y la fila
   de la Tabla 1.3 según el tamaño. Se sube a la anchura normalizada siguiente.

   Método de flujo másico (pág. 7):
     b = 0,9·B − 0,05 si B ≤ 2 m;  b = B − 0,2 si B > 2 m
     l3 = longitud del rodillo central (Figura 1.1); l3 = 0 con 1 o 2 rodillos
     S1 = (l3 + (b − l3)·cos λ)²·tg θ / 6
     S2 = (l3 + (b − l3)/2·cos λ)·((b − l3)/2·sen λ)
     Q = 3,6·S·v·ρ·K   [t/h, con ρ en kg/m³]

   Método de flujo volumétrico (págs. 9 y 11):
     Qv = caudal a 1 m/s de las tablas de Rulmeca, interpolando en θ
     Q = Qv·v·ρ·K   [t/h, con ρ en t/m³]

   En el modo Dimensionar se prueba cada banda de la Tabla 1.3, de menor a mayor, y
   cada velocidad normalizada que no supere la máxima de su categoría. Se adopta la
   primera combinación que da la capacidad: la banda más estrecha y, para ella, la
   velocidad más baja. Después: qg = Q / (3,6·v).

C) Resistencias al avance (págs. 14-17)
   Si L > 80 m (método simplificado):
     LC = C·L
     FH + FN = f·LC·g·[qR + (2qb + qg)·cos δ],  con qR = qRO + qRU
   Si L ≤ 80 m (método global):
     FH = f·L·g·[qR + (2qb + qg)·cos δ]
     FN = qg·v·(v − vent) + FN,tamb
   FSt = qg·g·H
   Fu = (FH + FN) + FS1 + FS2 + FSt

   C automático: tabla de las indicaciones de la asignatura con interpolación lineal.
   Se puede escribir otro valor (el ejemplo de los apuntes usa C = 1,45).

D) Potencia, par y giro (pág. 26)
   Pu = Fu·v;  Peje = Pu/η;  M = Fu·r;  ω = v/r;  n = 60·ω/(2π)

E) Adherencia (págs. 20 y 25)
   T2,adh = Fu / (e^(μφ) − 1)
   T1 = T2 + Fu
   Comprobación: T1/T2 ≤ e^(μφ)
   Fu,máx = T2·(e^(μφ) − 1);  Radh = Fu,máx/Fu − 1
   Si patina, la app indica la T2 necesaria y el ángulo mínimo:
   φmín = ln(Fu/T2 + 1) / μ

F) Flecha (págs. 21 y 41)
   h = q·g·cos δ·lR² / (8·T);  hrel = h / lR
   Tmín = q·g·cos δ·lR / (8·hrel,máx)
   q = qb + qg en el ramal portante;  q = qb en el retorno

   Tensiones locales "calculadas": los apuntes piden comprobar "donde la tensión sea
   mínima" (pág. 21) y aplicar T2,mín = máx(T2,adh; T2,flecha) teniendo en cuenta la
   distribución de tensiones (pág. 26). Con el tambor motriz en la descarga (hipótesis
   de la pág. 5), la banda sale con T2, recorre el retorno y llega a la cola con:
     ΔT = f·L·g·(qRU + qb·cos δ) − qb·g·H   (L = LC si L > 80 m)
     Tcola = T2 + ΔT
     T local del retorno = mín(T2; Tcola)
     T local del portante = mín(Tcola; T1)
     T2,flecha = máx(Tinf,mín; Tinf,mín − ΔT; Tsup,mín − ΔT; Tsup,mín − Fu)
   Las resistencias localizadas no se reparten en este tramo, lo que queda del lado de
   la seguridad cuando la cinta sube o es horizontal.

   Tensiones locales "adoptadas": se usan los valores escritos, como hacen los apuntes
   en su ejemplo.

G) Banda (págs. 23-24)
   Se prueba z desde el mínimo constructivo hasta que R·z·B/S ≥ T1, con S según z:
   S = 11 (hasta 5 capas), 12 (de 6 a 9), 13 (más de 9).
   Tadm = R·z·B / S


Resolución de un ejemplo
------------------------
Es el ejemplo "Apuntes, diseño preliminar" (págs. 39-44), el primero del selector.

Datos: L = 200 m, H = 10 m, v = 2 m/s, B = 800 mm, qb = 8 kg/m, qg = 25 kg/m,
qR = 10 kg/m, f = 0,02, C = 1,45, FS1 = 0, FS2 = 40 N, η = 0,90, r = 0,20 m,
μ = 0,30, φ = 180°, lR,sup = 1,20 m, lR,inf = 2,40 m, hrel,máx = 1 %, R = 160 N/mm.
Se adoptan T2 = 4000 N y tensiones locales de 6000 N y 4000 N.

1. Inclinación
   sen δ = 10 / 200 = 0,05  →  δ = 2,87°;  cos δ = 0,99875

2. Resistencias
   LC = 1,45 · 200 = 290 m  (L > 80 m)
   FH + FN = 0,02 · 290 · 9,81 · [10 + (2·8 + 25) · 0,99875] = 2898,88 N
   FSt = 25 · 9,81 · 10 = 2452,50 N
   Fu = 2898,88 + 0 + 40 + 2452,50 = 5391,38 N

3. Potencia, par y giro
   Pu = 5391,38 · 2 = 10 782,76 W = 10,78 kW
   Peje = 10,78276 / 0,90 = 11,98 kW
   M = 5391,38 · 0,20 = 1078,28 N·m
   ω = 2 / 0,20 = 10 rad/s  →  n = 60 · 10 / (2π) = 95,5 rpm

4. Adherencia
   e^(μφ) = e^(0,30·π) = 2,5663
   T2,adh = 5391,38 / (2,5663 − 1) = 3442,04 N
   Se adopta T2 = 4000 N (no sale de una fórmula: es un valor por encima del mínimo).
   T1 = 4000 + 5391,38 = 9391,38 N
   T1/T2 = 9391,38 / 4000 = 2,3478 < 2,5663  ✓
   Fu,máx = 4000 · (2,5663 − 1) = 6265,33 N
   Radh = 6265,33 / 5391,38 − 1 = 16,2 %

5. Flecha
   Portante: h = 33 · 9,81 · 0,99875 · 1,20² / (8 · 6000) = 9,70 mm
             hrel = 9,70 / 1200 = 0,81 % < 1 %  ✓
   Retorno:  h = 8 · 9,81 · 0,99875 · 2,40² / (8 · 4000) = 14,11 mm
             hrel = 14,11 / 2400 = 0,59 % < 1 %  ✓
   Tensiones mínimas: Tsup,mín = 33 · 9,81 · 0,99875 · 1,20 / (8 · 0,01) = 4849,88 N
                      Tinf,mín = 8 · 9,81 · 0,99875 · 2,40 / (8 · 0,01) = 2351,46 N

6. Banda
   z ≥ 11 · 9391,38 / (160 · 800) = 0,807  →  z = 3 capas (mínimo constructivo)
   Tadm = 160 · 3 · 800 / 11 = 34 909 N > 9391,38 N  ✓

Resultado: todas las comprobaciones se cumplen y coinciden con la tabla de la pág. 44.

Comparación con tensiones locales calculadas: en el mismo ejemplo, cambia "Tensiones
locales para la flecha" a "Calculadas". Con qRO = 7 y qRU = 3 kg/m:
   ΔT = 0,02 · 290 · 9,81 · (3 + 8 · 0,99875) − 8 · 9,81 · 10 = −159,49 N
   Tcola = 4000 − 159,49 = 3840,51 N
   hrel,portante = 33 · 9,81 · 0,99875 · 1,20 / (8 · 3840,51) = 1,26 % > 1 %  ✗
   T2 necesaria para cumplir: 4849,88 + 159,49 = 5009,37 N
El resultado depende del reparto de qR, que los apuntes no dan (solo qR = 10 kg/m).
Por eso los 6000 N del ejemplo son una tensión adoptada, no la mínima del ramal.


Validación de los cálculos
--------------------------
La sección 4 de la página resuelve 19 ejercicios con el mismo código de la calculadora
y compara cada resultado con el valor publicado:
  - Apuntes: ejemplos 1 a 10, diseño preliminar (págs. 39-44) y ejercicios 11 a 15.
  - Indicaciones: ejemplos 1, 2 y 3.
Todos coinciden salvo las diferencias siguientes, que la página marca como erratas.


Diferencias con las fuentes
---------------------------
La aplicación no copia estas erratas. Conviene comentarlas en la exposición:

1. Pág. 7, ecuación (1.1): S2 aparece con el factor 1/cos λ. Se usa cos λ, porque es
   el que da las secciones resueltas en las indicaciones (S2 = 0,03534 m² en su
   ejemplo 2; con 1/cos λ saldría 0,0455 m²) y el que corresponde a la geometría del
   trapecio.
2. Pág. 14, ecuación (2.2): cos δ aparece multiplicando también a qRO + qRU. Se usa
   qR + (2qb + qg)·cos δ, la forma de los ejemplos resueltos (págs. 35, 37 y 39).
3. Pág. 34, ejemplo 6: 160·2·800/11 = 23 273 N, no 32 000 N. La banda de 2 capas sigue
   cumpliendo con T = 18 000 N, pero la reserva es 1,29, no 1,78.
4. Pág. 54, ejercicio 13: 3,6·1,68·0,014·1500·0,81 = 102,9 t/h, no 103,1 t/h.
5. Indicaciones, ejemplo 3: redondean qg a 18,27 kg/m y obtienen Fu = 1068,56 N. Sin
   redondear, qg = 18,275 kg/m y Fu = 1068,71 N.
6. Tablas de Rulmeca: estos valores rompen la tendencia de su fila y parecen erratas
   del catálogo. Se mantienen tal cual para no alterar la fuente:
     - Plana, B = 800 mm, 30°: 198,3 m³/h
     - 2 rodillos, B = 1000 mm, 5°: 317,1 m³/h
     - 3 rodillos, λ = 25°, B = 400 mm, 10°: 29,2 m³/h
     - 3 rodillos, λ = 30°, B = 2800 mm, 30°: 5185,6 m³/h
   Las indicaciones usan K = 0,95 sin interpolar en su ejemplo 1; la app interpola como
   indica la pág. 54 y obtiene K = 0,943, sin que cambie la banda ni la velocidad.


Limitaciones
------------
- Diseño preliminar en régimen estacionario: no incluye arranque, frenado ni empalmes.
- Un único tambor motriz, situado en la descarga.
- Si Fu ≤ 0 (cinta descendente que arrastra), la app lo avisa y no continúa: haría
  falta un sistema de frenado.
- Granito y caliza son los datos de las indicaciones. Los materiales marcados como
  "orientativo" son valores habituales que no proceden de los apuntes: contrástalos con
  el documento 3.2 "Propiedades de materiales" de Studium antes de usarlos en un cálculo.
  Para otro material se elige "Otro material" o se añade a datos.json.


Actividades propuestas
----------------------
1. En el primer ejemplo, mueve T2 por debajo de 3442 N y observa cómo patina la banda.
2. Cambia las tensiones locales a "Calculadas": ¿qué T2 hace falta ahora?
3. Sube H a 20 m: ¿qué cambia en Fu, en la potencia y en T1?
4. Añade un material a datos.json y cárgalo con el botón.
5. Compara los dos métodos de capacidad en el ejemplo de la caliza.

NOTA: Canvas no es un archivo separado: es un elemento de HTML dibujado con JS.
