/**
 * ============================================================================
 * MOTOR DE CÁLCULO Y VISUALIZACIÓN INTERACTIVA
 * Dimensionamiento de Cintas Transportadoras (Norma DIN 22101 / UNE 58-504-98)
 * Asignatura: Transporte y Manutención Industrial
 * ============================================================================
 */

// Datos y tablas integradas por defecto (garantiza funcionamiento sin CORS en file://)
const DATOS_DEFECTO = {
  materiales: [
    {
      id: "granito",
      nombre: "Granito fino triturado",
      densidadKgM3: 1500,
      taludDinamicoGrados: 15,
      claseMaterial: "C",
      tamanoMaxMm: 10,
      granulometria: "uniforme",
      descripcion: "Pesado, abrasivo, 10 mm (Ejemplo del enunciado / apuntes)"
    },
    {
      id: "caliza",
      nombre: "Roca caliza",
      densidadKgM3: 1400,
      taludDinamicoGrados: 15,
      claseMaterial: "B",
      tamanoMaxMm: 250,
      granulometria: "mixto",
      descripcion: "No abrasivo, friable, 10% gruesos (Ejemplo 1 de las notas)"
    },
    {
      id: "arena_seca",
      nombre: "Arena seca",
      densidadKgM3: 1600,
      taludDinamicoGrados: 20,
      claseMaterial: "C",
      tamanoMaxMm: 5,
      granulometria: "uniforme",
      descripcion: "Abrasiva media, fluida"
    },
    {
      id: "arena_humeda",
      nombre: "Arena húmeda",
      densidadKgM3: 1900,
      taludDinamicoGrados: 25,
      claseMaterial: "C",
      tamanoMaxMm: 5,
      granulometria: "uniforme",
      descripcion: "Pesada, abrasiva media, cohesiva"
    },
    {
      id: "antracita",
      nombre: "Carbón / Antracita",
      densidadKgM3: 960,
      taludDinamicoGrados: 15,
      claseMaterial: "B",
      tamanoMaxMm: 50,
      granulometria: "mixto",
      descripcion: "Densidad ligera-media, poco abrasivo"
    },
    {
      id: "cemento",
      nombre: "Cemento en polvo",
      densidadKgM3: 1200,
      taludDinamicoGrados: 10,
      claseMaterial: "B",
      tamanoMaxMm: 1,
      granulometria: "uniforme",
      descripcion: "Material pulverulento"
    },
    {
      id: "clinker",
      nombre: "Clinker de cemento",
      densidadKgM3: 1500,
      taludDinamicoGrados: 20,
      claseMaterial: "C",
      tamanoMaxMm: 60,
      granulometria: "mixto",
      descripcion: "Muy abrasivo y caliente"
    },
    {
      id: "mineral_hierro",
      nombre: "Mineral de hierro / Pirita",
      densidadKgM3: 2200,
      taludDinamicoGrados: 20,
      claseMaterial: "D",
      tamanoMaxMm: 80,
      granulometria: "mixto",
      descripcion: "Muy pesado, cortante y abrasivo"
    },
    {
      id: "cereal",
      nombre: "Cereal / Trigo",
      densidadKgM3: 750,
      taludDinamicoGrados: 10,
      claseMaterial: "A",
      tamanoMaxMm: 8,
      granulometria: "uniforme",
      descripcion: "Ligero, no abrasivo, deslizable"
    },
    {
      id: "personalizado",
      nombre: "Personalizado (manual)",
      densidadKgM3: 1500,
      taludDinamicoGrados: 15,
      claseMaterial: "C",
      tamanoMaxMm: 20,
      granulometria: "uniforme",
      descripcion: "Introduce parámetros manualmente"
    }
  ],
  anchurasNormalizadasMm: [400, 500, 650, 800, 1000, 1200, 1400, 1600, 1800, 2000],
  velocidadesDIN22101: [0.66, 0.84, 1.05, 1.31, 1.68, 2.09, 2.62, 3.35, 4.19, 5.24],
  longitudRodilloCentralL3Mm: {
    "400": 160,
    "500": 200,
    "650": 250,
    "800": 315,
    "1000": 380,
    "1200": 465,
    "1400": 530,
    "1600": 600,
    "1800": 670,
    "2000": 750
  },
  velocidadesMaximas: {
    "400": { A: 2.62, B: 2.09, C: 2.09, D: 1.31 },
    "500": { A: 3.35, B: 2.62, C: 2.09, D: 1.68 },
    "650": { A: 3.35, B: 3.35, C: 2.62, D: 2.09 },
    "800": { A: 4.19, B: 3.35, C: 3.35, D: 2.62 },
    "1000": { A: 4.19, B: 4.19, C: 3.35, D: 2.62 },
    "1200": { A: 5.24, B: 4.19, C: 4.19, D: 3.35 },
    "1400": { A: 5.24, B: 5.24, C: 4.19, D: 3.35 },
    "1600": { A: 5.24, B: 5.24, C: 4.19, D: 3.35 },
    "1800": { A: 5.24, B: 5.24, C: 4.19, D: 3.35 },
    "2000": { A: 5.24, B: 5.24, C: 4.19, D: 3.35 }
  },
  factorInclinacionK: [
    { delta: 0, k: 1.0 },
    { delta: 2, k: 1.0 },
    { delta: 4, k: 0.99 },
    { delta: 6, k: 0.98 },
    { delta: 8, k: 0.97 },
    { delta: 10, k: 0.95 },
    { delta: 12, k: 0.93 },
    { delta: 14, k: 0.91 },
    { delta: 16, k: 0.89 },
    { delta: 18, k: 0.85 },
    { delta: 20, k: 0.81 }
  ],
  coeficienteClLongitud: [
    { L: 20, Cl: 3.1 },
    { L: 40, Cl: 2.4 },
    { L: 60, Cl: 2.0 },
    { L: 80, Cl: 1.8 },
    { L: 100, Cl: 1.7 },
    { L: 150, Cl: 1.5 },
    { L: 200, Cl: 1.4 },
    { L: 300, Cl: 1.3 },
    { L: 400, Cl: 1.25 },
    { L: 500, Cl: 1.2 },
    { L: 600, Cl: 1.18 },
    { L: 800, Cl: 1.15 },
    { L: 1000, Cl: 1.12 }
  ]
};

let baseDatos = DATOS_DEFECTO;

// Elementos del DOM
const selMaterial = document.getElementById("sel-material");
const inQ = document.getElementById("in-Q");
const inL = document.getElementById("in-L");
const inH = document.getElementById("in-H");
const inRho = document.getElementById("in-rho");
const inBeta = document.getElementById("in-beta");
const selRodillos = document.getElementById("sel-rodillos");
const inLambda = document.getElementById("in-lambda");
const selClase = document.getElementById("sel-clase");
const selAncho = document.getElementById("sel-ancho");
const selVelManual = document.getElementById("sel-vel-manual");
const inRendimiento = document.getElementById("in-rendimiento");
const inFriccion = document.getElementById("in-f");
const inMu = document.getElementById("in-mu");
const inTheta = document.getElementById("in-theta");
const inQb = document.getElementById("in-qb");
const inPesoSup = document.getElementById("in-peso-sup");
const inDistSup = document.getElementById("in-dist-sup");
const inPesoInf = document.getElementById("in-peso-inf");
const inDistInf = document.getElementById("in-dist-inf");
const inCapas = document.getElementById("in-capas");
const inRNominal = document.getElementById("in-r-nominal");
const inCs = document.getElementById("in-cs");

// Canvas
const canvas = document.getElementById("canvas-artesa");
const ctx = canvas.getContext("2d");

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  await cargarBaseDatos();
  poblarSelectores();
  vincularEventos();
  cargarPreset("granito");
});

// Carga asíncrona de materiales.json con respaldo local
async function cargarBaseDatos() {
  try {
    const res = await fetch("materiales.json");
    if (!res.ok) throw new Error("No se pudo cargar materiales.json");
    baseDatos = await res.json();
    console.log("materiales.json cargado exitosamente.");
  } catch (err) {
    console.info("Usando base de datos por defecto (apertura local directa).", err);
    baseDatos = DATOS_DEFECTO;
  }
}

// Carga de archivo JSON manual por el usuario
const inputArchivoJson = document.getElementById("input-archivo-json");
if (inputArchivoJson) {
  inputArchivoJson.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        baseDatos = json;
        poblarSelectores();
        calcular();
        alert("¡Archivo JSON cargado correctamente!");
      } catch (ex) {
        alert("Error al leer el archivo JSON: " + ex.message);
      }
    };
    reader.readAsText(file);
  });
}

// Población de selectores desplegables
function poblarSelectores() {
  // Materiales
  selMaterial.innerHTML = "";
  baseDatos.materiales.forEach(mat => {
    const opt = document.createElement("option");
    opt.value = mat.id;
    opt.textContent = `${mat.nombre} (${mat.densidadKgM3} kg/m³, Clase ${mat.claseMaterial})`;
    selMaterial.appendChild(opt);
  });

  // Anchuras
  selAncho.innerHTML = '<option value="auto">Auto (Mínima recomendada)</option>';
  baseDatos.anchurasNormalizadasMm.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = `${w} mm`;
    selAncho.appendChild(opt);
  });

  // Velocidades
  selVelManual.innerHTML = '<option value="auto">Auto (Normalizada según caudal)</option>';
  baseDatos.velocidadesDIN22101.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = `${v.toFixed(2)} m/s (DIN 22101)`;
    selVelManual.appendChild(opt);
  });
}

function vincularEventos() {
  // Cambios en inputs que disparan recálculo automático
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach(el => {
    el.addEventListener("input", () => {
      if (el === selMaterial) {
        aplicarMaterialSeleccionado();
      }
      calcular();
    });
  });

  // Botones de presets
  document.querySelectorAll(".btn-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      cargarPreset(btn.dataset.preset);
    });
  });

  // Acordeones de pasos
  document.querySelectorAll(".step-header").forEach(header => {
    header.addEventListener("click", () => {
      header.parentElement.classList.toggle("open");
    });
  });
}

function aplicarMaterialSeleccionado() {
  const matId = selMaterial.value;
  const mat = baseDatos.materiales.find(m => m.id === matId);
  if (!mat || mat.id === "personalizado") return;

  inRho.value = mat.densidadKgM3;
  inBeta.value = mat.taludDinamicoGrados;
  selClase.value = mat.claseMaterial;
}

// Carga de casos predefinidos
function cargarPreset(tipo) {
  if (tipo === "granito") {
    // Ejemplo 3 de las notas del profesor / Ejercicio del enunciado
    selMaterial.value = "granito";
    inRho.value = 1500;
    inBeta.value = 15;
    selClase.value = "C";
    inQ.value = 100;
    inL.value = 100;
    inH.value = 0;
    selRodillos.value = "3";
    inLambda.value = 30;
    selAncho.value = "400";
    selVelManual.value = "auto";
    inRendimiento.value = 85;
    inFriccion.value = 0.02;
    inMu.value = 0.02; // Coeficiente especificado en el ejemplo
    inTheta.value = 210;
    inQb.value = 3.8;
    inPesoSup.value = 5.4;
    inDistSup.value = 1.2;
    inPesoInf.value = 4.0;
    inDistInf.value = 2.4;
    inCapas.value = 3;
    inRNominal.value = 200;
    inCs.value = 10;
  } else if (tipo === "caliza") {
    // Ejemplo 1 de las notas del profesor
    selMaterial.value = "caliza";
    inRho.value = 1400;
    inBeta.value = 15;
    selClase.value = "B";
    inQ.value = 1500;
    inL.value = 805;
    inH.value = 150;
    selRodillos.value = "3";
    inLambda.value = 35;
    selAncho.value = "1000"; // Con 800 mm no llegaba; con 1000 mm sí
    selVelManual.value = "3.35";
    inRendimiento.value = 85;
    inFriccion.value = 0.02;
    inMu.value = 0.35;
    inTheta.value = 210;
    inQb.value = 12.0;
    inPesoSup.value = 14.0;
    inDistSup.value = 1.0;
    inPesoInf.value = 9.0;
    inDistInf.value = 2.0;
    inCapas.value = 4;
    inRNominal.value = 315;
    inCs.value = 10;
  } else if (tipo === "uned") {
    // Ejemplo 2 de las notas del profesor (UNED 1.1/1.2)
    selMaterial.value = "granito";
    inRho.value = 1500;
    inBeta.value = 15;
    selClase.value = "C";
    inQ.value = 200;
    inL.value = 100;
    inH.value = 0;
    selRodillos.value = "3";
    inLambda.value = 45;
    selAncho.value = "650";
    selVelManual.value = "auto";
  }
  calcular();
}

// ============================================================================
// FUNCIONES MATEMÁTICAS RIGUROSAS
// ============================================================================

// Interpolación lineal del factor k según inclinación delta (grados)
function obtenerFactorK(deltaGrados) {
  const tabla = baseDatos.factorInclinacionK;
  if (deltaGrados <= 0) return 1.0;
  if (deltaGrados >= tabla[tabla.length - 1].delta) return tabla[tabla.length - 1].k;

  for (let i = 0; i < tabla.length - 1; i++) {
    const p1 = tabla[i];
    const p2 = tabla[i + 1];
    if (deltaGrados >= p1.delta && deltaGrados <= p2.delta) {
      const fraccion = (deltaGrados - p1.delta) / (p2.delta - p1.delta);
      return p1.k + fraccion * (p2.k - p1.k);
    }
  }
  return 1.0;
}

// Interpolación lineal del factor Cl según longitud L (m)
function obtenerFactorCl(L) {
  const tabla = baseDatos.coeficienteClLongitud;
  if (L <= tabla[0].L) return tabla[0].Cl;
  if (L >= tabla[tabla.length - 1].L) return tabla[tabla.length - 1].Cl;

  for (let i = 0; i < tabla.length - 1; i++) {
    const p1 = tabla[i];
    const p2 = tabla[i + 1];
    if (L >= p1.L && L <= p2.L) {
      const fraccion = (L - p1.L) / (p2.L - p1.L);
      return p1.Cl + fraccion * (p2.Cl - p1.Cl);
    }
  }
  return 1.7;
}

// Obtener longitud del rodillo central l3 (m) para 3 rodillos
function obtenerL3(B_mm, numRodillos) {
  if (numRodillos < 3) return 0;
  const l3Map = baseDatos.longitudRodilloCentralL3Mm;
  const l3_mm = l3Map[String(B_mm)] || (B_mm * 0.38);
  return l3_mm / 1000; // a metros
}

// ============================================================================
// CÁLCULO COMPLETO DEL SISTEMA
// ============================================================================
function calcular() {
  // 1. Lectura de variables de entrada
  const Q_pedido = Math.max(0.1, Number(inQ.value) || 100);
  const L = Math.max(1, Number(inL.value) || 100);
  const H = Math.max(0, Number(inH.value) || 0);
  const rho_kg = Math.max(100, Number(inRho.value) || 1500);
  const rho_Tm3 = rho_kg / 1000; // t/m3
  const beta_deg = Math.max(0, Math.min(45, Number(inBeta.value) || 15));
  const beta_rad = (beta_deg * Math.PI) / 180;
  const numRodillos = Number(selRodillos.value);
  let lambda_deg = Math.max(0, Math.min(60, Number(inLambda.value) || 30));
  if (numRodillos === 1) lambda_deg = 0;
  const lambda_rad = (lambda_deg * Math.PI) / 180;
  const claseMaterial = selClase.value;

  // 2. Paso 1: Inclinación de la cinta delta y factor k
  let delta_rad = 0;
  if (H > 0 && L >= H) {
    delta_rad = Math.asin(H / L);
  }
  const delta_deg = (delta_rad * Math.PI) / 180;
  const factor_k = obtenerFactorK(delta_deg);

  // 3. Paso 2: Selección de la anchura B (mm)
  let B_mm = Number(selAncho.value);
  if (selAncho.value === "auto" || !B_mm) {
    // Estimación inicial por tamaño y caudal
    B_mm = 400;
    if (Q_pedido > 150) B_mm = 500;
    if (Q_pedido > 300) B_mm = 650;
    if (Q_pedido > 600) B_mm = 800;
    if (Q_pedido > 1200) B_mm = 1000;
    if (Q_pedido > 2000) B_mm = 1400;
  }
  const B_m = B_mm / 1000;

  // 4. Paso 3: Sección transversal analítica (Método 1)
  const b = 0.9 * B_m - 0.05; // Ancho útil cargado (m)
  const l3 = obtenerL3(B_mm, numRodillos); // Longitud rodillo central (m)

  let L_artesa = (b - l3) / 2;
  if (numRodillos === 1) {
    L_artesa = b / 2;
  }

  // Ancho superior del material w (m)
  const w = l3 + 2 * L_artesa * Math.cos(lambda_rad);

  // Sección superior del montón S1 (m2)
  const S1 = (Math.pow(w, 2) * Math.tan(beta_rad)) / 6;

  // Sección inferior del trapecio S2 (m2)
  let S2 = 0;
  if (numRodillos > 1) {
    S2 = (l3 + L_artesa * Math.cos(lambda_rad)) * L_artesa * Math.sin(lambda_rad);
  }

  // Sección total S (m2)
  const S_total = S1 + S2;

  // Caudal volumétrico horario a 1 m/s IVT (m3/h)
  const IVT = 3600 * S_total;

  // 5. Paso 4: Velocidad teórica necesaria
  const v_teorica = Q_pedido / (IVT * rho_Tm3 * factor_k);

  // 6. Paso 5: Normalización de la velocidad (DIN 22101)
  const velocidadesDIN = baseDatos.velocidadesDIN22101;
  let v_norm = velocidadesDIN[velocidadesDIN.length - 1];

  if (selVelManual.value !== "auto") {
    v_norm = Number(selVelManual.value);
  } else {
    for (let i = 0; i < velocidadesDIN.length; i++) {
      if (velocidadesDIN[i] >= v_teorica) {
        v_norm = velocidadesDIN[i];
        break;
      }
    }
  }

  // Velocidad máxima permitida por fabricante (v_max)
  const v_max_tabla = baseDatos.velocidadesMaximas[String(B_mm)] || { A: 4.19, B: 3.35, C: 3.35, D: 2.62 };
  const v_max = v_max_tabla[claseMaterial] || 2.09;

  // Caudal másico efectivo final (T/h)
  const Q_efectivo = IVT * v_norm * rho_Tm3 * factor_k;

  // 7. Paso 6: Potencia del motor
  const q_G = Q_efectivo / (3.6 * v_norm); // Carga lineal material (kg/m)
  const q_ro = Number(inPesoSup.value) / Math.max(0.1, Number(inDistSup.value));
  const q_ru = Number(inPesoInf.value) / Math.max(0.1, Number(inDistInf.value));
  const q_b = Number(inQb.value);
  const f = Number(inFriccion.value);
  const Cl = obtenerFactorCl(L);
  const g = 9.81;

  // Resistencia tangencial total Fu (N)
  const Fu = f * Cl * L * g * (q_ro + q_ru + (2 * q_b + q_G) * Math.cos(delta_rad)) + (q_G * H * g);

  // Potencia de accionamiento Pa (kW)
  const Pa_kW = (Fu * v_norm) / 1000;

  // Potencia del motor eléctrico Pm (kW)
  const rendimiento = Math.max(1, Number(inRendimiento.value)) / 100;
  const Pm_kW = Pa_kW / rendimiento;

  // 8. Paso 7: Tensión y verificación de la banda (Euler-Eytelwein)
  const mu = Number(inMu.value);
  const theta_deg = Number(inTheta.value);
  const theta_rad = (theta_deg * Math.PI) / 180;
  const e_mu_theta = Math.exp(mu * theta_rad);

  const T2 = Fu / Math.max(0.0001, (e_mu_theta - 1)); // Ramal flojo (N)
  const T1 = T2 + Fu;                                 // Ramal tenso (N)

  // Tensión unitaria máxima sobre la banda (N/mm)
  const T1_unitario = T1 / B_mm;

  // Resistencia admisible de la banda textil (N/mm)
  const numCapas = Number(inCapas.value);
  const rNominal = Number(inRNominal.value);
  const Cs = Number(inCs.value);
  const R_adm = (numCapas * rNominal) / Cs;
  const cumpleBanda = T1_unitario <= R_adm;

  // 9. Actualización de la Interfaz y KPIs
  actualizarUI({
    B_mm,
    b,
    l3,
    w,
    S1,
    S2,
    S_total,
    IVT,
    delta_deg,
    factor_k,
    v_teorica,
    v_norm,
    v_max,
    Q_pedido,
    Q_efectivo,
    q_G,
    q_ro,
    q_ru,
    q_b,
    Cl,
    Fu,
    Pa_kW,
    Pm_kW,
    T1,
    T2,
    e_mu_theta,
    T1_unitario,
    R_adm,
    cumpleBanda,
    numRodillos,
    lambda_deg,
    beta_deg
  });

  // 10. Dibujar sección transversal en Canvas
  dibujarArtesaCanvas({
    B_mm,
    b,
    l3,
    L_artesa,
    w,
    lambda_rad,
    beta_rad,
    numRodillos,
    S1,
    S2
  });
}

// Actualización de elementos visuales y panel de resultados
function actualizarUI(res) {
  // KPIs
  document.getElementById("kpi-ancho").textContent = res.B_mm;
  document.getElementById("kpi-vel").textContent = res.v_norm.toFixed(2);
  document.getElementById("kpi-caudal").textContent = res.Q_efectivo.toFixed(1);
  document.getElementById("kpi-seccion").textContent = (res.S_total * 10000).toFixed(1);
  document.getElementById("kpi-potencia").textContent = res.Pm_kW.toFixed(2);
  document.getElementById("kpi-t1").textContent = (res.T1 / 1000).toFixed(2);

  // Insignia de estado
  const badge = document.getElementById("status-badge");
  if (res.v_norm > res.v_max) {
    badge.className = "status-badge warning";
    badge.innerHTML = `⚠️ Velocidad (${res.v_norm} m/s) superior a v máx recomendada (${res.v_max} m/s). Conviene aumentar B.`;
  } else if (!res.cumpleBanda) {
    badge.className = "status-badge warning";
    badge.innerHTML = `⚠️ Tensión unitaria (${res.T1_unitario.toFixed(1)} N/mm) > Adm (${res.R_adm.toFixed(1)} N/mm). Aumenta capas o resistencia.`;
  } else {
    badge.className = "status-badge valid";
    badge.innerHTML = `✅ Dimensionamiento Válido y Óptimo (v = ${res.v_norm} m/s ≤ ${res.v_max} m/s | Q = ${res.Q_efectivo.toFixed(1)} T/h ≥ ${res.Q_pedido} T/h)`;
  }

  // Paso a paso detallado
  document.getElementById("calc-paso1").innerHTML = `
    <p><strong>Inclinación geométrica de la cinta:</strong></p>
    <div class="formula-box">δ = arcsin(H / L) = arcsin(${inH.value} / ${inL.value}) = <strong>${res.delta_deg.toFixed(2)}º</strong></div>
    <p>Factor reductor de inclinación (Tabla 2 interpolada): <strong>k = ${res.factor_k.toFixed(4)}</strong></p>
  `;

  document.getElementById("calc-paso2").innerHTML = `
    <p><strong>Anchura comercial seleccionada:</strong> B = <strong>${res.B_mm} mm</strong> (${(res.B_mm/1000).toFixed(2)} m)</p>
    <p>Velocidad máxima admisible (Figura 2, Clase ${selClase.value}): <strong>v_máx = ${res.v_max} m/s</strong></p>
  `;

  document.getElementById("calc-paso3").innerHTML = `
    <div class="formula-box">
      b = 0.9·B - 0.05 = 0.9·${(res.B_mm/1000).toFixed(2)} - 0.05 = <strong>${res.b.toFixed(4)} m</strong><br>
      l₃ = <strong>${(res.l3*1000).toFixed(0)} mm</strong> (${res.l3.toFixed(3)} m) | λ = <strong>${res.lambda_deg}º</strong> | β = <strong>${res.beta_deg}º</strong><br>
      w = l₃ + 2·L·cos(λ) = <strong>${res.w.toFixed(4)} m</strong><br>
      S₁ (móntón superior) = w²·tan(β) / 6 = <strong>${res.S1.toFixed(6)} m²</strong><br>
      S₂ (trapecio inferior) = (l₃ + L·cos(λ))·L·sen(λ) = <strong>${res.S2.toFixed(6)} m²</strong><br>
      S_total = S₁ + S₂ = <strong>${res.S_total.toFixed(6)} m²</strong> (${(res.S_total * 10000).toFixed(2)} cm²)<br>
      I_VT = 3600 · S = 3600 · ${res.S_total.toFixed(6)} = <strong>${res.IVT.toFixed(2)} m³/h</strong> (a 1 m/s)
    </div>
  `;

  document.getElementById("calc-paso4").innerHTML = `
    <div class="formula-box">
      v_teórica = Q / (I_VT · ρ · k) = ${res.Q_pedido} / (${res.IVT.toFixed(2)} · ${(Number(inRho.value)/1000).toFixed(2)} · ${res.factor_k.toFixed(3)}) = <strong>${res.v_teorica.toFixed(3)} m/s</strong><br>
      v normalizada (DIN 22101): <strong>${res.v_norm.toFixed(2)} m/s</strong> (Límite v_máx: ${res.v_max} m/s)<br>
      Q_efectivo = I_VT · v_norm · ρ · k = <strong>${res.Q_efectivo.toFixed(2)} T/h</strong> (≥ ${res.Q_pedido} T/h)
    </div>
  `;

  document.getElementById("calc-paso5").innerHTML = `
    <div class="formula-box">
      q_G (masa lineal) = Q / (3.6 · v) = ${res.Q_efectivo.toFixed(1)} / (3.6 · ${res.v_norm.toFixed(2)}) = <strong>${res.q_G.toFixed(2)} kg/m</strong><br>
      q_ro (rodillos sup.) = ${inPesoSup.value} / ${inDistSup.value} = <strong>${res.q_ro.toFixed(2)} kg/m</strong><br>
      q_ru (rodillos inf.) = ${inPesoInf.value} / ${inDistInf.value} = <strong>${res.q_ru.toFixed(2)} kg/m</strong><br>
      C_l (factor longitud L=${inL.value} m) = <strong>${res.Cl.toFixed(2)}</strong> | f = <strong>${inFriccion.value}</strong><br>
      F_u = f·C_l·L·g·[q_ro + q_ru + (2q_b + q_G)·cos(δ)] + q_G·H·g = <strong>${res.Fu.toFixed(2)} N</strong><br>
      P_a = F_u · v = ${res.Fu.toFixed(1)} · ${res.v_norm.toFixed(2)} = <strong>${res.Pa_kW.toFixed(2)} kW</strong><br>
      P_m (motor, η=${inRendimiento.value}%) = P_a / η = <strong>${res.Pm_kW.toFixed(2)} kW</strong>
    </div>
  `;

  document.getElementById("calc-paso6").innerHTML = `
    <div class="formula-box">
      θ = ${inTheta.value}º = ${(res.theta_deg * Math.PI / 180).toFixed(4)} rad | μ = ${inMu.value}<br>
      e^(μ·θ) = <strong>${res.e_mu_theta.toFixed(4)}</strong><br>
      T₂ (ramal flojo) = F_u / (e^(μ·θ) - 1) = <strong>${res.T2.toFixed(2)} N</strong> (${(res.T2/1000).toFixed(2)} kN)<br>
      T₁ (ramal tenso) = T₂ + F_u = <strong>${res.T1.toFixed(2)} N</strong> (${(res.T1/1000).toFixed(2)} kN)<br>
      T₁ / B = ${res.T1.toFixed(1)} N / ${res.B_mm} mm = <strong>${res.T1_unitario.toFixed(2)} N/mm</strong><br>
      Resistencia admisible banda = (${inCapas.value} capas · ${inRNominal.value} N/mm) / Cs(${inCs.value}) = <strong>${res.R_adm.toFixed(2)} N/mm</strong><br>
      Verificación: ${res.T1_unitario.toFixed(2)} N/mm ${res.cumpleBanda ? "≤" : ">"} ${res.R_adm.toFixed(2)} N/mm → <strong>${res.cumpleBanda ? "Banda Válida ✅" : "Banda Insuficiente ❌"}</strong>
    </div>
  `;
}

// ============================================================================
// DIBUJO EN CANVAS DE LA SECCIÓN TRANSVERSAL (ARTESA Y MATERIAL)
// ============================================================================
function dibujarArtesaCanvas(p) {
  const wCanvas = canvas.width;
  const hCanvas = canvas.height;
  ctx.clearRect(0, 0, wCanvas, hCanvas);

  const cx = wCanvas / 2;
  const cy = hCanvas - 110;

  // Escala píxeles por metro
  const escala = (wCanvas * 0.72) / (p.B_mm / 1000);

  const b_px = p.b * escala;
  const l3_px = p.l3 * escala;
  const L_artesa_px = p.L_artesa * escala;
  const lambda = p.lambda_rad;
  const beta = p.beta_rad;

  // Coordenadas de los puntos de la artesa cargada
  let p1, p2, p3, p4;

  if (p.numRodillos === 1) {
    p1 = { x: cx - b_px / 2, y: cy };
    p4 = { x: cx + b_px / 2, y: cy };
    p2 = p1;
    p3 = p4;
  } else if (p.numRodillos === 2) {
    p2 = { x: cx, y: cy };
    p3 = { x: cx, y: cy };
    p1 = { x: cx - L_artesa_px * Math.cos(lambda), y: cy - L_artesa_px * Math.sin(lambda) };
    p4 = { x: cx + L_artesa_px * Math.cos(lambda), y: cy - L_artesa_px * Math.sin(lambda) };
  } else {
    // 3 rodillos
    p2 = { x: cx - l3_px / 2, y: cy };
    p3 = { x: cx + l3_px / 2, y: cy };
    p1 = { x: p2.x - L_artesa_px * Math.cos(lambda), y: p2.y - L_artesa_px * Math.sin(lambda) };
    p4 = { x: p3.x + L_artesa_px * Math.cos(lambda), y: p3.y - L_artesa_px * Math.sin(lambda) };
  }

  // Altura del montículo superior con ángulo beta
  const ancho_w_px = p.w * escala;
  const h_monticulo = (ancho_w_px / 2) * Math.tan(beta);
  const pTop = { x: cx, y: p1.y - h_monticulo };

  // 1. Dibujar trapecio inferior (S2)
  if (p.numRodillos > 1) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fillStyle = "#86efac"; // Verde menta suave
    ctx.fill();
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 2. Dibujar montículo superior (S1)
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.quadraticCurveTo(pTop.x, pTop.y, p4.x, p4.y);
  ctx.closePath();
  ctx.fillStyle = "#fde047"; // Amarillo suave
  ctx.fill();
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Dibujar la banda transportadora (negro robusto)
  const margen_banda_px = ((p.B_mm / 1000 - p.b) / 2) * escala;
  const bExtIzq = {
    x: p1.x - margen_banda_px * Math.cos(lambda),
    y: p1.y - margen_banda_px * Math.sin(lambda)
  };
  const bExtDer = {
    x: p4.x + margen_banda_px * Math.cos(lambda),
    y: p4.y - margen_banda_px * Math.sin(lambda)
  };

  ctx.beginPath();
  ctx.moveTo(bExtIzq.x, bExtIzq.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.lineTo(bExtDer.x, bExtDer.y);
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // 4. Rodillos de apoyo esquemáticos
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 4;
  if (p.numRodillos === 3) {
    // Rodillo central
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y + 10);
    ctx.lineTo(p3.x, p3.y + 10);
    ctx.stroke();

    // Rodillo lateral izquierdo
    ctx.beginPath();
    ctx.moveTo(bExtIzq.x, bExtIzq.y + 10);
    ctx.lineTo(p2.x, p2.y + 10);
    ctx.stroke();

    // Rodillo lateral derecho
    ctx.beginPath();
    ctx.moveTo(bExtDer.x, bExtDer.y + 10);
    ctx.lineTo(p3.x, p3.y + 10);
    ctx.stroke();
  }

  // 5. Textos y cotas en el dibujo
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 13px system-ui";
  ctx.textAlign = "center";

  // Etiquetas S1 y S2
  ctx.fillText(`S₁ (Montículo) = ${(p.S1 * 10000).toFixed(1)} cm²`, cx, p1.y - h_monticulo / 2 + 5);
  if (p.numRodillos > 1) {
    ctx.fillText(`S₂ (Trapecio) = ${(p.S2 * 10000).toFixed(1)} cm²`, cx, cy - 14);
  }

  // Cota de ancho w
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#2563eb";
  ctx.fillText(`w = ${(p.w * 1000).toFixed(0)} mm`, cx, p1.y + 18);

  // Cota del rodillo central l3
  if (p.numRodillos === 3) {
    ctx.fillStyle = "#64748b";
    ctx.fillText(`l₃ = ${(p.l3 * 1000).toFixed(0)} mm`, cx, cy + 30);
  }

  // Indicador de ángulo de artesa lambda
  if (p.numRodillos > 1) {
    ctx.fillStyle = "#b91c1c";
    ctx.fillText(`λ = ${(lambda * 180 / Math.PI).toFixed(0)}º`, p3.x + 35, cy + 5);
  }

  // Indicador de talud dinámico beta
  ctx.fillStyle = "#d97706";
  ctx.fillText(`β = ${(beta * 180 / Math.PI).toFixed(0)}º`, p1.x + 25, p1.y - 12);
}
