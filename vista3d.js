// Vista 3D animada de la cinta con Three.js. Se reconstruye con los datos del cálculo.
// Banda en coordenadas locales: x a lo largo de la cinta, y normal a la banda, z lateral.

const Vista3D = (() => {
  const contenedor = document.getElementById("cinta3d");
  const rotulos = document.getElementById("cinta3d-rotulos");
  if (!contenedor) return { actualizar() {} };
  if (typeof THREE === "undefined") {
    contenedor.textContent = "No se ha podido cargar three.min.js.";
    return { actualizar() {} };
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch (error) {
    contenedor.textContent = "Este navegador no permite mostrar la vista 3D (WebGL desactivado).";
    return { actualizar() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  contenedor.prepend(renderer.domElement);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 2400);

  // Cielo en degradado.
  function texturaLienzo(ancho, alto, pintar) {
    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    pintar(lienzo.getContext("2d"), ancho, alto);
    const textura = new THREE.CanvasTexture(lienzo);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
    return textura;
  }
  escena.background = texturaLienzo(4, 256, (c, a, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#5f8fc9");
    g.addColorStop(0.55, "#b9d0e6");
    g.addColorStop(0.75, "#e4e6e2");
    c.fillStyle = g;
    c.fillRect(0, 0, a, h);
  });
  escena.fog = new THREE.Fog(0xcfdbe4, 160, 1000);

  const hemi = new THREE.HemisphereLight(0xcfe2ff, 0x6b6558, 1.5);
  escena.add(hemi);
  const sol = new THREE.DirectionalLight(0xfff1dc, 2.8);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  sol.shadow.bias = -0.0004;
  escena.add(sol);
  escena.add(sol.target);

  // Suelo de hormigón.
  const texturaSuelo = texturaLienzo(512, 512, (c, a, h) => {
    c.fillStyle = "#8f8d86";
    c.fillRect(0, 0, a, h);
    for (let i = 0; i < 14000; i++) {
      const v = 110 + Math.random() * 60;
      c.fillStyle = `rgba(${v},${v},${v - 6},0.25)`;
      c.fillRect(Math.random() * a, Math.random() * h, 1 + Math.random() * 2.5, 1 + Math.random() * 2.5);
    }
    c.strokeStyle = "rgba(60,60,58,0.5)";
    c.lineWidth = 2;
    c.strokeRect(0, 0, a, h);
  });
  texturaSuelo.repeat.set(9, 5);
  const losa = new THREE.Mesh(new THREE.PlaneGeometry(64, 36), new THREE.MeshStandardMaterial({ map: texturaSuelo, roughness: 0.95 }));
  losa.rotation.x = -Math.PI / 2;
  losa.position.set(12, 0.012, 0);
  losa.receiveShadow = true;
  escena.add(losa);

  // Paisaje procedural: relieve fractal, roca, nieve, bosque y nubes. Es decorativo y fijo.
  const hash2 = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const ruido = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const e = hash2(xi + 1, yi + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + e) * ux * uy;
  };
  const fractal = (x, y, octavas) => {
    let suma = 0;
    let amp = 0.5;
    for (let i = 0; i < octavas; i++) {
      suma += amp * ruido(x, y);
      x = x * 2.03 + 11.3;
      y = y * 2.03 + 7.1;
      amp *= 0.5;
    }
    return suma;
  };
  const crestas = (x, y) => {
    let suma = 0;
    let amp = 0.5;
    for (let i = 0; i < 6; i++) {
      suma += amp * (1 - Math.abs(2 * ruido(x, y) - 1)) ** 2;
      x = x * 2.1 + 3.7;
      y = y * 2.1 + 9.2;
      amp *= 0.5;
    }
    return suma;
  };
  const suave = (a, b, x) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const alturaTerreno = (x, z) => {
    const dist = Math.hypot(x - 12, z);
    const colinas = suave(45, 200, dist) * fractal(x * 0.012, z * 0.012, 5) * 42;
    const montes = suave(170, 480, dist) * crestas(x * 0.0042, z * 0.0042) * 300;
    return colinas + montes - 0.06;
  };

  const segmentos = 340;
  const terrenoG = new THREE.PlaneGeometry(2000, 2000, segmentos, segmentos);
  terrenoG.rotateX(-Math.PI / 2);
  terrenoG.translate(12, 0, 0);
  const posT = terrenoG.attributes.position;
  for (let i = 0; i < posT.count; i++) posT.setY(i, alturaTerreno(posT.getX(i), posT.getZ(i)));
  terrenoG.computeVertexNormals();
  const norT = terrenoG.attributes.normal;
  const colT = new Float32Array(posT.count * 3);
  const cTemp = new THREE.Color();
  const cHierba = new THREE.Color(0x56702f);
  const cHierba2 = new THREE.Color(0x7c8440);
  const cRoca = new THREE.Color(0x6a655c);
  const cRoca2 = new THREE.Color(0x8e887b);
  const cNieve = new THREE.Color(0xf4f6f8);
  for (let i = 0; i < posT.count; i++) {
    const x = posT.getX(i);
    const z = posT.getZ(i);
    const y = posT.getY(i);
    const pendiente = 1 - norT.getY(i);
    cTemp.copy(cHierba).lerp(cHierba2, fractal(x * 0.03, z * 0.03, 3) * 1.4);
    const roca = suave(0.1, 0.26, pendiente + (y - 90) * 0.0008);
    cTemp.lerp(new THREE.Color().copy(cRoca).lerp(cRoca2, ruido(x * 0.05, z * 0.05)), roca);
    const nieve = suave(120, 170, y + fractal(x * 0.02, z * 0.02, 3) * 30) * (1 - suave(0.28, 0.5, pendiente));
    cTemp.lerp(cNieve, nieve);
    colT.set([cTemp.r, cTemp.g, cTemp.b], i * 3);
  }
  terrenoG.setAttribute("color", new THREE.BufferAttribute(colT, 3));
  const texturaTerreno = texturaLienzo(512, 512, (c, a, h) => {
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, a, h);
    for (let i = 0; i < 30000; i++) {
      const g = 170 + Math.random() * 85;
      c.fillStyle = `rgba(${g},${g},${g},0.55)`;
      c.fillRect(Math.random() * a, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
  });
  texturaTerreno.repeat.set(170, 170);
  const suelo = new THREE.Mesh(terrenoG, new THREE.MeshStandardMaterial({ map: texturaTerreno, vertexColors: true, roughness: 1 }));
  suelo.receiveShadow = true;
  escena.add(suelo);

  // Cielo con nubes.
  const pasoCielo = 2;
  const cielo = new THREE.Mesh(new THREE.SphereGeometry(1000, 32, 20), new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    fog: false,
    map: texturaLienzo(1024 / pasoCielo, 512 / pasoCielo, (c, a, h) => {
      const img = c.createImageData(a, h);
      for (let y = 0; y < h; y++) {
        const alt = 1 - y / h;
        for (let x = 0; x < a; x++) {
          const t = suave(0.5, 0.82, alt);
          const r0 = 214 + (70 - 214) * t;
          const g0 = 226 + (122 - 226) * t;
          const b0 = 236 + (196 - 236) * t;
          const n = fractal(x / a * 18, y / h * 9, 5);
          const nube = suave(0.5, 0.72, n) * suave(0.5, 0.56, alt) * (1 - suave(0.92, 1, alt));
          const j = (y * a + x) * 4;
          img.data[j] = r0 + (255 - r0) * nube;
          img.data[j + 1] = g0 + (255 - g0) * nube;
          img.data[j + 2] = b0 + (255 - b0) * nube;
          img.data[j + 3] = 255;
        }
      }
      c.putImageData(img, 0, 0);
    }),
  }));
  cielo.position.set(12, 0, 0);
  escena.add(cielo);

  // Bosque: tres pisos de ramas y tronco, con color y tamaño variables.
  const NARB = 1100;
  const verdeRamas = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true });
  const ramas = [[2.6, 3.4, 2.2], [2.0, 3.0, 3.9], [1.25, 2.7, 5.5]].map(([radio, alto]) => {
    const g = new THREE.ConeGeometry(radio, alto, 9, 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      if (p.getY(i) < alto / 2 - 0.1) {
        const f = 0.82 + hash2(i, radio) * 0.36;
        p.setX(i, p.getX(i) * f);
        p.setZ(i, p.getZ(i) * f);
      }
    }
    g.computeVertexNormals();
    const m = new THREE.InstancedMesh(g, verdeRamas, NARB);
    m.castShadow = true;
    return m;
  });
  const alturasRama = [2.2, 3.9, 5.5];
  const troncos = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.3, 2.4, 7), new THREE.MeshStandardMaterial({ color: 0x3f2f22, roughness: 1 }), NARB);
  const arbol = new THREE.Object3D();
  const tono = new THREE.Color();
  let sem = 97;
  const azar = () => {
    sem = (sem * 16807) % 2147483647;
    return sem / 2147483647;
  };
  for (let i = 0; i < NARB; i++) {
    let x;
    let z;
    let y;
    let intentos = 0;
    do {
      x = 12 + (azar() - 0.5) * 760;
      z = (azar() - 0.5) * 760;
      y = alturaTerreno(x, z);
      intentos++;
      // Rodales: el bosque se agrupa, salvo en la losa y en las zonas altas.
    } while (intentos < 30 && ((Math.abs(x - 12) < 38 && Math.abs(z) < 24) || y > 95 || fractal(x * 0.018, z * 0.018, 3) < 0.46));
    const e = 0.75 + azar() * 1.05;
    const giro = azar() * 6.28;
    arbol.rotation.y = giro;
    arbol.scale.set(e, e * (0.9 + azar() * 0.35), e);
    arbol.position.set(x, y + 1.2 * e, z);
    arbol.updateMatrix();
    troncos.setMatrixAt(i, arbol.matrix);
    tono.setHSL(0.28 + azar() * 0.07, 0.3 + azar() * 0.15, 0.075 + azar() * 0.06);
    ramas.forEach((rama, k) => {
      arbol.position.y = y + alturasRama[k] * arbol.scale.y;
      arbol.updateMatrix();
      rama.setMatrixAt(i, arbol.matrix);
      rama.setColorAt(i, tono);
    });
  }
  ramas.forEach(rama => escena.add(rama));
  escena.add(troncos);

  // Materiales.
  const texturaBanda = texturaLienzo(512, 256, (c, a, h) => {
    c.fillStyle = "#17181a";
    c.fillRect(0, 0, a, h);
    for (let i = 0; i < 2600; i++) {
      const v = 20 + Math.random() * 28;
      c.fillStyle = `rgb(${v},${v},${v})`;
      c.fillRect(Math.random() * a, Math.random() * h, 1 + Math.random() * 14, 1);
    }
    c.fillStyle = "#3b3d41"; // Empalme: hace visible el avance de la banda.
    c.fillRect(a * 0.47, 0, 7, h);
  });
  const M = {
    banda: new THREE.MeshStandardMaterial({ map: texturaBanda, roughness: 0.8, side: THREE.DoubleSide }),
    rodillo: new THREE.MeshStandardMaterial({
      map: texturaLienzo(128, 64, (c, a, h) => {
        c.fillStyle = "#8c9096";
        c.fillRect(0, 0, a, h);
        c.fillStyle = "#585c62";
        c.fillRect(0, 0, 14, h);
        c.fillRect(a / 2, 0, 14, h);
      }),
      metalness: 0.55,
      roughness: 0.42,
    }),
    eje: new THREE.MeshStandardMaterial({ color: 0xb4b7bb, metalness: 0.9, roughness: 0.3 }),
    acero: new THREE.MeshStandardMaterial({ color: 0x24508f, metalness: 0.25, roughness: 0.55 }),
    guarda: new THREE.MeshStandardMaterial({ color: 0xd9951a, metalness: 0.15, roughness: 0.6, side: THREE.DoubleSide }),
    motor: new THREE.MeshStandardMaterial({ color: 0x2c5a55, metalness: 0.35, roughness: 0.45 }),
    lecho: new THREE.MeshStandardMaterial({ color: 0x77706a, roughness: 0.97, flatShading: true }),
    roca: new THREE.MeshStandardMaterial({ color: 0x8c8378, roughness: 0.95, flatShading: true }),
    mapa: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.65, side: THREE.DoubleSide }),
    tambor: new THREE.MeshStandardMaterial({
      map: texturaLienzo(256, 64, (c, a, h) => {
        c.fillStyle = "#17181a";
        c.fillRect(0, 0, a, h);
        c.fillStyle = "#c9ccd1";
        for (let i = 0; i < 6; i++) c.fillRect(i * a / 6, 0, 9, h);
      }),
      roughness: 0.7,
    }),
    fallo: new THREE.MeshStandardMaterial({ map: texturaBanda, roughness: 0.7, side: THREE.DoubleSide, emissive: 0xff1010, emissiveIntensity: 0.8 }),
  };

  // Color de cada material. El resto usa un gris de roca.
  const COLORES = { granito: 0x9a9690, caliza: 0xb7ae9c, arena_seca: 0xcdb68a, arena_humeda: 0x8e7650, antracita: 0x26262a, cemento: 0xb4b3ad, clinker: 0x4c4a48, mineral_hierro: 0x8a4a33, cereal: 0xd5ac55 };

  let grupo = new THREE.Group();     // Todo lo que depende de los datos.
  let banda = new THREE.Group();     // Lo que va inclinado con la cinta.
  let giratorios = [];               // Rodillos y tambores: { malla, omega }.
  let rocas = null;
  let caida = null;
  let param = null;
  let claveModelo = "";
  let anclas = {};
  const auxiliar = new THREE.Object3D();
  let mallaSup = null;
  let mallaRet = null;
  let mallaLecho = null;
  let corte = null;
  let fuerzas = null;
  let verFuerzas = true;
  let verMapa = false;
  let verMaterial = true;
  let monton = null;
  let exagerar = 1;
  let patina = false;
  let verCotas = false;
  let cotasTour = false;
  let verSolucion = false;
  let cotas3d = null;
  let solucion3d = null;
  let sobrecargaActual = 1;
  let derrame = null;
  let chispas = null;
  let humo = [];
  let tiempoPatina = 0;
  const exageracionBase = () => {
    const n = Number(document.getElementById("cinta3d-flecha").value);
    return n === 1 && tens && tens.falloFlecha ? 20 : n;
  };
  let tens = null;                   // Tensiones a lo largo de la banda y datos de la flecha.
  const planoCorte = new THREE.Plane();
  let pausado = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Ayudas de construcción ---
  function caja(padre, sx, sy, sz, x, y, z, material) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    padre.add(m);
    return m;
  }

  function cilindro(padre, a, b, radio, material, omega = 0, segmentos = 28) {
    const pa = new THREE.Vector3(...a);
    const pb = new THREE.Vector3(...b);
    const eje = pb.clone().sub(pa);
    const soporte = new THREE.Group();
    soporte.position.copy(pa.clone().add(pb).multiplyScalar(0.5));
    soporte.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), eje.clone().normalize());
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radio, radio, eje.length(), segmentos), material);
    m.castShadow = true;
    m.receiveShadow = true;
    soporte.add(m);
    padre.add(soporte);
    if (omega) giratorios.push({ malla: m, omega });
    return m;
  }

  function vaciar(objeto) {
    objeto.traverse(hijo => {
      if (hijo.geometry) hijo.geometry.dispose();
    });
    escena.remove(objeto);
  }

  const texturaHumo = texturaLienzo(64, 64, (c, a) => {
    const g = c.createRadialGradient(a / 2, a / 2, 2, a / 2, a / 2, a / 2);
    g.addColorStop(0, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, a, a);
  });

  // Efecto del patinaje: la banda y el tambor rozan por arriba y por abajo.
  function efectoPatina(dt, p) {
    const activo = patina && verMaterialEfecto();
    if (!chispas) return;
    chispas.visible = activo;
    humo.forEach(h => { h.s.visible = activo; });
    banda.position.y = p.base + (activo ? Math.sin(tiempoPatina * 53) * 0.0045 : 0);
    if (!activo) return;
    const nace = (o) => {
      o.arriba = Math.random() < 0.45;
      o.z = (Math.random() * 2 - 1) * p.B * 0.48;
    };
    chispas.datos.forEach((c, i) => {
      c.t += dt / c.dur;
      if (c.t >= 1) {
        c.t %= 1;
        nace(c);
        c.vx = c.arriba ? -0.6 - Math.random() * 1.8 : -1 - Math.random() * 2.4;
        c.vy = c.arriba ? 0.5 + Math.random() * 1.6 : -0.3 - Math.random() * 1.2;
        c.vz = (Math.random() - 0.5) * 1.1;
      }
      const t = c.t * c.dur;
      auxiliar.position.set(
        p.L - (c.arriba ? p.Rt * 0.25 : p.Rt * 0.15) + c.vx * t,
        (c.arriba ? 0 : -2 * p.Rt) + c.vy * t - 4.905 * t * t,
        c.z + c.vz * t
      );
      auxiliar.rotation.set(0, Math.atan2(c.vx, c.vz), 0);
      auxiliar.scale.setScalar(1 - c.t * 0.75);
      auxiliar.updateMatrix();
      chispas.setMatrixAt(i, auxiliar.matrix);
    });
    chispas.instanceMatrix.needsUpdate = true;
    humo.forEach(h => {
      h.t += dt / h.dur;
      if (h.t >= 1) {
        h.t %= 1;
        nace(h);
        h.deriva = (Math.random() - 0.5) * 0.7;
      }
      const t = h.t * h.dur;
      h.s.position.set(p.L - p.Rt * 0.2 - 0.25 * t, (h.arriba ? 0.02 : -2 * p.Rt) + 0.42 * t, h.z + h.deriva * t);
      const tam = 0.14 + h.t * 0.95;
      h.s.scale.set(tam, tam, 1);
      h.s.material.opacity = 0.55 * Math.sin(Math.PI * h.t);
    });
  }
  const verMaterialEfecto = () => !verMapa;

  // --- Geometría de la sección ---
  function factorArtesa(s, p) {
    const x = Math.min(s / p.transicion, (p.L - s) / p.transicion, 1);
    return Math.max(0, x) ** 2 * (3 - 2 * Math.max(0, x));
  }

  // Punto de la banda a una distancia d del centro, medida sobre la propia banda.
  function puntoBanda(d, lam, l3) {
    const abs = Math.abs(d);
    if (abs <= l3 / 2) return { z: d, y: 0 };
    return { z: Math.sign(d) * (l3 / 2 + (abs - l3 / 2) * Math.cos(lam)), y: (abs - l3 / 2) * Math.sin(lam) };
  }

  function fondoEn(z, lam, l3) {
    return Math.max(0, Math.abs(z) - l3 / 2) * Math.tan(lam);
  }

  function presenciaMaterial(s, p) {
    const x = Math.min((s - p.sCarga) / 0.7, (p.L + 0.05 - s) / 0.5, 1);
    return Math.max(0, x) ** 0.6;
  }

  // Altura del material en la abscisa s y la posición transversal u (de −1 a 1).
  function techoMaterial(s, u, p) {
    const lam = p.lam * factorArtesa(s, p);
    const w = p.l3 + (p.b - p.l3) * Math.cos(lam);
    const z = u * w / 2;
    const borde = fondoEn(w / 2, lam, p.l3);
    const h = w * Math.tan(p.talud) / 4 * (p.sobrecarga || 1);
    return { z, y: borde + presenciaMaterial(s, p) * h * (1 - u * u), fondo: fondoEn(z, lam, p.l3) };
  }

  // Flecha de la parábola h = q·g·cos δ·l²/(8T) en la abscisa s, entre dos apoyos.
  function flechaEntreApoyos(s, apoyos, q, T) {
    if (!tens || T <= 0) return 0;
    let i = 0;
    while (i < apoyos.length - 2 && s >= apoyos[i + 1]) i++;
    const l = apoyos[i + 1] - apoyos[i];
    const x = Math.max(0, Math.min(l, s - apoyos[i]));
    const h = q * tens.g * tens.cos * l * l / (8 * T);
    return Math.min(0.4, exagerar * 4 * h * x * (l - x) / (l * l));
  }
  const TPortante = s => (tens.Tsup !== null ? tens.Tsup : tens.Tcola + (tens.T1 - tens.Tcola) * s / param.L);
  const TRetorno = s => (tens.Tinf !== null ? tens.Tinf : tens.Tcola + (tens.T2 - tens.Tcola) * s / param.L);
  const flechaPortante = s => (tens ? flechaEntreApoyos(s, param.apoyosSup, tens.qSup, TPortante(s)) : 0);
  const flechaRetorno = s => (tens ? flechaEntreApoyos(s, param.apoyosInf, tens.qInf, TRetorno(s)) : 0);

  // Aplica la flecha a la banda y al lecho de material.
  function deformar() {
    if (!mallaSup) return;
    [mallaSup, mallaLecho].forEach(m => {
      const pos = m.geometry.attributes.position;
      const base = m.userData.baseY;
      for (let i = 0; i < pos.count; i++) pos.setY(i, base[i] - flechaPortante(pos.getX(i)));
      pos.needsUpdate = true;
      m.geometry.computeVertexNormals();
    });
    const pr = mallaRet.geometry.attributes.position;
    for (let i = 0; i < pr.count; i++) pr.setZ(i, flechaRetorno(pr.getX(i) + param.L / 2));
    pr.needsUpdate = true;
    mallaRet.geometry.computeVertexNormals();
    if (corte) corte.position.y = -flechaPortante(param.sCorte);
  }

  // Colorea la banda de azul (menor tensión) a rojo (mayor tensión).
  function pintarTensiones() {
    if (!mallaSup || !tens) return;
    const minT = Math.min(tens.T2, tens.Tcola, tens.T1);
    const maxT = Math.max(tens.T2, tens.Tcola, tens.T1);
    const color = new THREE.Color();
    const pintar = (malla, valor) => {
      const pos = malla.geometry.attributes.position;
      const col = malla.geometry.attributes.color;
      for (let i = 0; i < pos.count; i++) {
        const f = maxT > minT ? (valor(pos.getX(i)) - minT) / (maxT - minT) : 0;
        color.setHSL((1 - f) * 2 / 3, 0.85, 0.5);
        col.setXYZ(i, color.r, color.g, color.b);
      }
      col.needsUpdate = true;
    };
    pintar(mallaSup, x => tens.Tcola + (tens.T1 - tens.Tcola) * x / param.L);
    pintar(mallaRet, x => tens.Tcola + (tens.T2 - tens.Tcola) * (x + param.L / 2) / param.L);
    tens.minT = minT;
    tens.maxT = maxT;
  }

  function aplicarMapa() {
    if (!mallaSup) return;
    mallaSup.material = verMapa ? M.mapa : (tens && tens.falloSup ? M.fallo : M.banda);
    mallaRet.material = verMapa ? M.mapa : (tens && tens.falloInf ? M.fallo : M.banda);
    const conMaterial = !verMapa && verMaterial;
    mallaLecho.visible = conMaterial;
    rocas.visible = conMaterial;
    caida.visible = conMaterial;
    if (derrame) derrame.visible = conMaterial && !!tens && tens.derrama;
    if (monton) monton.visible = verMaterial;
  }

  function construirBanda(p) {
    const nS = Math.min(420, Math.ceil(p.L / p.lSup * 10));
    const nD = 24;
    const pos = [];
    const uv = [];
    const ind = [];
    for (let i = 0; i <= nS; i++) {
      const s = p.L * i / nS;
      const lam = p.lam * factorArtesa(s, p);
      for (let j = 0; j <= nD; j++) {
        const d = -p.B / 2 + p.B * j / nD;
        const q = puntoBanda(d, lam, p.l3);
        pos.push(s, q.y, q.z);
        uv.push(s / 4, j / nD);
      }
    }
    for (let i = 0; i < nS; i++) {
      for (let j = 0; j < nD; j++) {
        const a = i * (nD + 1) + j;
        ind.push(a, a + 1, a + nD + 1, a + 1, a + nD + 2, a + nD + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(ind);
    g.computeVertexNormals();
    g.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3));
    const m = new THREE.Mesh(g, M.banda);
    m.castShadow = true;
    m.receiveShadow = true;
    m.userData.baseY = Float32Array.from(g.attributes.position.array.filter((_, i) => i % 3 === 1));
    banda.add(m);
    mallaSup = m;

    // Ramal de retorno.
    const r = new THREE.PlaneGeometry(p.L, p.B, Math.min(300, Math.ceil(p.L / p.lInf * 10)), 1);
    r.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(r.attributes.position.count * 3), 3));
    const atr = r.attributes.uv;
    for (let i = 0; i < atr.count; i++) atr.setX(i, atr.getX(i) * p.L / 4);
    const ret = new THREE.Mesh(r, M.banda);
    ret.rotation.x = Math.PI / 2;
    ret.position.set(p.L / 2, -2 * p.Rt, 0);
    ret.castShadow = true;
    banda.add(ret);
    mallaRet = ret;
  }

  function construirLecho(p) {
    const nS = Math.min(420, Math.ceil((p.L - p.sCarga) / p.lSup * 10));
    const nU = 22;
    const pos = [];
    const ind = [];
    for (let i = 0; i <= nS; i++) {
      const s = p.sCarga + (p.L - p.sCarga) * i / nS;
      for (let j = 0; j <= nU; j++) {
        const q = techoMaterial(s, -1 + 2 * j / nU, p);
        pos.push(s, Math.max(q.y - 0.006, q.fondo + 0.002), q.z);
      }
    }
    for (let i = 0; i < nS; i++) {
      for (let j = 0; j < nU; j++) {
        const a = i * (nU + 1) + j;
        ind.push(a, a + 1, a + nU + 1, a + 1, a + nU + 2, a + nU + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(ind);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, M.lecho);
    m.material.side = THREE.DoubleSide;
    m.receiveShadow = true;
    m.userData.baseY = Float32Array.from(pos.filter((_, i) => i % 3 === 1));
    banda.add(m);
    mallaLecho = m;
  }

  // Tapa de color de la sección en corte: S₁ amarillo, S₂ verde y la banda en negro.
  function construirCorte(p) {
    corte = new THREE.Group();
    const lam = p.lam;
    const w = p.l3 + (p.b - p.l3) * Math.cos(lam);
    const borde = fondoEn(w / 2, lam, p.l3);
    const h = w * Math.tan(p.talud) / 4;
    const x = p.sCorte + 0.004;
    const poligono = (puntos, color, dx = 0) => {
      const pos = [];
      const c = puntos.reduce((a, q) => [a[0] + q[0] / puntos.length, a[1] + q[1] / puntos.length], [0, 0]);
      puntos.forEach((q, i) => {
        const n = puntos[(i + 1) % puntos.length];
        pos.push(x + dx, c[0], c[1], x + dx, q[0], q[1], x + dx, n[0], n[1]);
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      corte.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })));
    };
    const arco = [];
    for (let i = 0; i <= 32; i++) {
      const u = -1 + i / 16;
      arco.push([borde + h * (1 - u * u), u * w / 2]);
    }
    poligono(arco, 0xfacc15);
    if (lam > 0) poligono([[borde, -w / 2], [0, -p.l3 / 2], [0, p.l3 / 2], [borde, w / 2]], 0x4ade80);
    // Banda con espesor visible.
    const nD = 40;
    for (let j = 0; j < nD; j++) {
      const a = puntoBanda(-p.B / 2 + p.B * j / nD, lam, p.l3);
      const b = puntoBanda(-p.B / 2 + p.B * (j + 1) / nD, lam, p.l3);
      poligono([[a.y, a.z], [b.y, b.z], [b.y - 0.016, b.z], [a.y - 0.016, a.z]], 0x0b0c0e, 0.001);
    }
    corte.visible = false;
    banda.add(corte);
    p.bordeCorte = borde;
    p.hCorte = h;
  }

  function aplicarCorte() {
    if (!param) return;
    const activo = vistaCamara === "seccion";
    if (corte) corte.visible = activo;
    planoCorte.setFromNormalAndCoplanarPoint(new THREE.Vector3(param.cos, param.sen, 0), aMundo(param, param.sCorte, 0));
    Object.values(M).forEach(m => {
      m.clippingPlanes = activo ? [planoCorte] : [];
      m.clipShadows = true;
      m.needsUpdate = true;
    });
  }

  // Cotas de estilo CAD: línea, extremos con flecha y líneas de referencia.
  const MAT_COTA = new THREE.MeshBasicMaterial({ color: 0x0f4c5c, depthTest: false, transparent: true });
  const MAT_VELOC = new THREE.MeshBasicMaterial({ color: 0x15803d, depthTest: false, transparent: true });
  function trazo(padre, a, b, radio, material) {
    const eje = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radio, radio, eje.length(), 8), material);
    m.position.copy(a.clone().add(b).multiplyScalar(0.5));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), eje.normalize());
    m.renderOrder = 5;
    padre.add(m);
  }
  function punta(padre, en, dir, material, tam = 0.13) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(tam * 0.32, tam, 12), material);
    const d = dir.clone().normalize();
    m.position.copy(en.clone().addScaledVector(d, -tam / 2));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    m.renderOrder = 5;
    padre.add(m);
  }
  function cota(padre, a, b, refA, refB) {
    trazo(padre, a, b, 0.012, MAT_COTA);
    const d = b.clone().sub(a);
    punta(padre, b, d, MAT_COTA);
    punta(padre, a, d.clone().negate(), MAT_COTA);
    if (refA) trazo(padre, refA, a, 0.006, MAT_COTA);
    if (refB) trazo(padre, refB, b, 0.006, MAT_COTA);
  }

  function construirCotas(e, r) {
    if (cotas3d) {
      cotas3d.traverse(h => { if (h.geometry) h.geometry.dispose(); });
      grupo.remove(cotas3d);
    }
    cotas3d = new THREE.Group();
    const p = param;
    const W = (s, y, z = 0) => aMundo(p, s, y, z);
    const zL = -(p.B / 2 + 0.9);
    // L a lo largo de la cinta.
    cota(cotas3d, W(0, 0.25, zL), W(p.L, 0.25, zL), W(0, 0, -p.B / 2), W(p.L, 0, -p.B / 2));
    anclas.cotaL = W(p.L * 0.5, 0.45, zL);
    // H y δ: triángulo con la horizontal que pasa por la cola.
    if (Math.abs(e.H) > 0) {
      const inicio = W(0, 0.25, zL);
      const fin = W(p.L, 0.25, zL);
      const base = new THREE.Vector3(fin.x, inicio.y, zL);
      trazo(cotas3d, inicio, base, 0.006, MAT_COTA);
      cota(cotas3d, base, fin);
      anclas.cotaH = base.clone().lerp(fin, 0.5);
      anclas.cotaH.x += 0.9;
      const arcoR = Math.min(4, p.L * 0.3);
      const signo = Math.sign(e.H);
      const delta = Math.asin(p.sen);
      const pasos = 16;
      let previo = inicio.clone().add(new THREE.Vector3(arcoR, 0, 0));
      for (let i = 1; i <= pasos; i++) {
        const a = delta * i / pasos;
        const q = inicio.clone().add(new THREE.Vector3(Math.cos(a) * arcoR, Math.sin(a) * arcoR, 0));
        trazo(cotas3d, previo, q, 0.008, MAT_COTA);
        previo = q;
      }
      anclas.cotaDelta = inicio.clone().add(new THREE.Vector3(arcoR + 0.8, signo * 0.28, 0));
    }
    // B y b, sobre la sección.
    const sB = p.L * 0.42;
    const yB = 0.62;
    cota(cotas3d, W(sB, yB, -p.B / 2), W(sB, yB, p.B / 2), W(sB, 0.05, -p.B / 2), W(sB, 0.05, p.B / 2));
    anclas.cotaAncho = W(sB, yB + 0.24);
    // Separación entre rodillos en los dos ramales.
    const i = Math.max(1, Math.floor(p.apoyosSup.length * 0.3));
    const zR = p.B / 2 + 0.55;
    cota(cotas3d, W(p.apoyosSup[i], -0.08, zR), W(p.apoyosSup[i + 1], -0.08, zR), W(p.apoyosSup[i], -0.08, p.B / 2), W(p.apoyosSup[i + 1], -0.08, p.B / 2));
    anclas.cotaLsup = W((p.apoyosSup[i] + p.apoyosSup[i + 1]) / 2, 0.14, zR);
    const j = Math.max(1, Math.floor(p.apoyosInf.length * 0.5));
    const yI = -2 * p.Rt - 0.3;
    cota(cotas3d, W(p.apoyosInf[j], yI, zR), W(p.apoyosInf[j + 1], yI, zR), W(p.apoyosInf[j], yI, p.B / 2), W(p.apoyosInf[j + 1], yI, p.B / 2));
    anclas.cotaLinf = W((p.apoyosInf[j] + p.apoyosInf[j + 1]) / 2, yI - 0.2, zR);
    // Velocidad y caudal.
    const a = W(p.L * 0.14 + 1.6, 0.85);
    const b = W(p.L * 0.14 + 4.2, 0.85);
    trazo(cotas3d, a, b, 0.024, MAT_VELOC);
    punta(cotas3d, b.clone().add(b.clone().sub(a).normalize().multiplyScalar(0.25)), b.clone().sub(a), MAT_VELOC, 0.26);
    anclas.cotaV = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.26, 0));
    anclas.cotaQ = W(1.05, 1.5);
    cotas3d.visible = verCotas || cotasTour;
    grupo.add(cotas3d);
  }

  // Solución vista en el dibujo: lo que se añadiría, en verde. No cambia el cálculo.
  // Tambor de reenvío con su recorrido real de banda: abraza más el tambor motriz,
  // pasa por el reenvío y vuelve al ramal de retorno.
  function dibujarReenvio(p, grupoDestino, phi, material) {
    const alfa = Math.min(Math.max(phi, 195), 260) * Math.PI / 180 - Math.PI; // Exceso sobre 180°.
    const R = p.Rt + 0.004;
    const rp = Math.max(0.09, p.Rt * 0.45);
    const cx = p.L;
    const cy = -p.Rt;
    const puntos = [];
    for (let i = 0; i <= 18; i++) {
      const a = alfa * i / 18;
      puntos.push([cx - R * Math.sin(a), cy - R * Math.cos(a)]);
    }
    const P0 = puntos[puntos.length - 1];
    const dx = -Math.cos(alfa);
    const dy = Math.sin(alfa);
    const tramo = 0.16 + p.Rt * 0.25;
    const Q = [P0[0] + dx * tramo, P0[1] + dy * tramo];
    const c = [Q[0] - Math.sin(alfa) * rp, Q[1] - Math.cos(alfa) * rp];
    const sRetorno = p.L - 2.6;
    const fin = [sRetorno, -2 * p.Rt];
    let hFin = Math.atan2(fin[1] - c[1], fin[0] - c[0]);
    if (hFin < 0) hFin += 2 * Math.PI;
    const h0 = Math.PI - alfa;
    for (let i = 0; i <= 18; i++) {
      const h = h0 + (hFin - h0) * i / 18;
      puntos.push([c[0] + Math.sin(h) * rp, c[1] - Math.cos(h) * rp]);
    }
    puntos.push(fin);
    // Cinta como superficie.
    const pos = [];
    const uv = [];
    const ind = [];
    let largo = 0;
    puntos.forEach((q, i) => {
      if (i) largo += Math.hypot(q[0] - puntos[i - 1][0], q[1] - puntos[i - 1][1]);
      pos.push(q[0], q[1], -p.B / 2, q[0], q[1], p.B / 2);
      uv.push(largo / 4, 0, largo / 4, 1);
      if (i) {
        const k = i * 2;
        ind.push(k - 2, k - 1, k, k - 1, k + 1, k);
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(ind);
    geo.computeVertexNormals();
    const cinta = new THREE.Mesh(geo, M.banda);
    cinta.castShadow = true;
    grupoDestino.add(cinta);
    // Rodillo de reenvío y soportes.
    cilindro(grupoDestino, [c[0], c[1], -p.B / 2 - 0.03], [c[0], c[1], p.B / 2 + 0.03], rp - 0.012, material, 0, 32);
    cilindro(grupoDestino, [c[0], c[1], -p.B / 2 - 0.22], [c[0], c[1], p.B / 2 + 0.22], 0.03, M.eje, 0, 12);
    for (const sg of [-1, 1]) {
      caja(grupoDestino, 0.08, Math.abs(-0.24 - c[1]) + 0.06, 0.05, c[0], (c[1] - 0.24) / 2, sg * (p.B / 2 + 0.2), material);
    }
    // El ramal de retorno termina donde empieza este tramo.
    mallaRet.scale.x = sRetorno / p.L;
    mallaRet.position.x = sRetorno / 2;
  }

  function construirSolucion(e, r, phiReenvio, fallaFlecha) {
    if (solucion3d) {
      solucion3d.traverse(h => { if (h.geometry) h.geometry.dispose(); });
      banda.remove(solucion3d);
      solucion3d = null;
    }
    const p = param;
    mallaRet.scale.x = 1;
    mallaRet.position.x = p.L / 2;
    if (!verSolucion && !phiReenvio) return;
    solucion3d = new THREE.Group();
    const verde = new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.3, roughness: 0.4, emissive: 0x15803d, emissiveIntensity: 0.5 });
    if (phiReenvio) {
      dibujarReenvio(p, solucion3d, phiReenvio, verde);
      anclas.sol = aMundo(p, p.L - 0.35, -2 * p.Rt - 0.6, -p.B / 2);
    } else if (fallaFlecha) {
      anclas.sol = aMundo(p, p.sCorte, 0.65, p.B / 2);
    } else {
      anclas.sol = aMundo(p, p.L * 0.55, 0.7);
    }
    banda.add(solucion3d);
  }

  // Flechas de fuerza en el tambor motriz, con longitud proporcional a cada valor.
  function construirFuerzas(e, r) {
    if (fuerzas) {
      fuerzas.traverse(h => { if (h.geometry) h.geometry.dispose(); });
      banda.remove(fuerzas);
    }
    fuerzas = new THREE.Group();
    const p = param;
    const escala = 2 / Math.max(r.T1, r.T2, r.Fu);
    const z = p.B / 2 + 0.09;
    const flecha = (origen, dir, valor, color) => {
      const len = Math.max(0.18, valor * escala);
      const material = new THREE.MeshBasicMaterial({ color });
      const d = new THREE.Vector3(...dir).normalize();
      const o = new THREE.Vector3(...origen);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      const fuste = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, len, 12), material);
      fuste.position.copy(o.clone().add(d.clone().multiplyScalar(len / 2)));
      fuste.quaternion.copy(q);
      const punta = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 16), material);
      punta.position.copy(o.clone().add(d.clone().multiplyScalar(len + 0.08)));
      punta.quaternion.copy(q);
      fuerzas.add(fuste, punta);
    };
    flecha([p.L, 0.03, z], [-1, 0, 0], r.T1, 0xdc2626);
    flecha([p.L, -2 * p.Rt, z], [-1, 0, 0], r.T2, 0x2563eb);
    flecha([p.L + p.Rt + 0.1, -p.Rt + 0.2, z], [0, -1, 0], r.Fu, 0xf59e0b);
    // Arco del ángulo abrazado φ, desde la parte superior del tambor.
    const phi = Math.min(e.thetaDeg, 359) * Math.PI / 180;
    const arco = new THREE.Mesh(new THREE.TorusGeometry(p.Rt + 0.05, 0.012, 8, 64, phi), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    arco.position.set(p.L, -p.Rt, z);
    arco.rotation.z = Math.PI / 2 - phi;
    fuerzas.add(arco);
    fuerzas.visible = verFuerzas;
    banda.add(fuerzas);
    anclas.Fu = aMundo(p, p.L + p.Rt + 0.1, -p.Rt + 0.2 - Math.max(0.18, r.Fu * escala) / 2, z);
    anclas.Fu.x += 0.55;
  }

  function estacionPortante(s, p, omega) {
    const lam = p.lam * factorArtesa(s, p);
    const y0 = -0.012 - p.Rr;
    const altoTraviesa = -0.24;
    if (p.estacion === 1) {
      cilindro(banda, [s, y0, -p.B / 2 - 0.06], [s, y0, p.B / 2 + 0.06], p.Rr, M.rodillo, omega);
      for (const sg of [-1, 1]) caja(banda, 0.05, Math.abs(altoTraviesa - y0) + 0.05, 0.03, s, (altoTraviesa + y0) / 2, sg * (p.B / 2 + 0.09), M.acero);
    } else {
      if (p.estacion === 3) {
        cilindro(banda, [s, y0, -p.l3 / 2], [s, y0, p.l3 / 2], p.Rr, M.rodillo, omega);
        for (const sg of [-1, 1]) caja(banda, 0.04, Math.abs(altoTraviesa - y0), 0.03, s, (altoTraviesa + y0) / 2, sg * p.l3 / 2, M.acero);
      } else {
        caja(banda, 0.05, Math.abs(altoTraviesa - y0), 0.05, s, (altoTraviesa + y0) / 2, 0, M.acero);
      }
      const lado = (p.B - p.l3) / 2 + 0.04;
      for (const sg of [-1, 1]) {
        const nz = Math.sin(lam) * (p.Rr + 0.012);
        const ny = -Math.cos(lam) * (p.Rr + 0.012);
        const a = [s, ny, sg * (p.l3 / 2 + 0.012 + nz)];
        const b = [s, lado * Math.sin(lam) + ny, sg * (p.l3 / 2 + 0.012 + lado * Math.cos(lam) + nz)];
        cilindro(banda, a, b, p.Rr, M.rodillo, sg * omega);
        caja(banda, 0.05, b[1] - altoTraviesa + 0.04, 0.03, s, (b[1] + altoTraviesa) / 2, b[2] + sg * 0.03, M.acero);
      }
    }
    caja(banda, 0.08, 0.05, p.B + 0.46, s, altoTraviesa, 0, M.acero);
  }

  function tambor(p, x, omega, motriz) {
    const y = -p.Rt;
    const m = cilindro(banda, [x, y, -p.B / 2 - 0.03], [x, y, p.B / 2 + 0.03], p.Rt, motriz ? M.tambor : M.banda, omega, 48);
    giratorios[giratorios.length - 1].tambor = true;
    cilindro(banda, [x, y, -p.B / 2 - 0.3], [x, y, p.B / 2 + 0.3], 0.05, M.eje);
    for (const sg of [-1, 1]) {
      caja(banda, 0.32, 0.16, 0.1, x, y, sg * (p.B / 2 + 0.2), M.acero);
      cilindro(banda, [x, y, sg * (p.B / 2 + 0.145)], [x, y, sg * (p.B / 2 + 0.255)], 0.085, M.eje);
      // Pernos en la tapa: hacen visible el giro del tambor.
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        const perno = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, p.B + 0.08, 8), M.eje);
        perno.position.set(Math.cos(a) * p.Rt * 0.72, 0, Math.sin(a) * p.Rt * 0.72);
        m.add(perno);
      }
    }
    if (motriz) {
      const z0 = p.B / 2 + 0.55;
      caja(banda, 0.44, 0.5, 0.34, x, y, z0, M.motor);
      cilindro(banda, [x, y, p.B / 2 + 0.25], [x, y, z0 - 0.15], 0.05, M.eje);
      const xm = x - 0.62;
      cilindro(banda, [xm + 0.42, y - 0.08, z0], [xm - 0.2, y - 0.08, z0], 0.15, M.motor, 0, 32);
      for (let i = 0; i < 9; i++) {
        const xa = xm + 0.33 - i * 0.055;
        cilindro(banda, [xa, y - 0.08, z0], [xa - 0.012, y - 0.08, z0], 0.165, M.motor, 0, 24);
      }
      cilindro(banda, [xm - 0.2, y - 0.08, z0], [xm - 0.3, y - 0.08, z0], 0.12, M.guarda, omega * 8, 12);
      caja(banda, 1.15, 0.06, 0.44, xm + 0.15, y - 0.3, z0, M.acero);
    }
  }

  // Convierte un punto local de la cinta a coordenadas del mundo.
  function aMundo(p, x, y, z = 0) {
    return new THREE.Vector3(x * p.cos - y * p.sen, p.base + x * p.sen + y * p.cos, z);
  }

  function pata(p, s, z) {
    const a = aMundo(p, s, -0.3, z);
    if (a.y <= 0.05) return;
    caja(grupo, 0.1, a.y, 0.1, a.x, a.y / 2, a.z, M.acero);
    caja(grupo, 0.32, 0.024, 0.32, a.x, 0.012, a.z, M.eje);
  }

  function construir(e, r, clave) {
    vaciar(grupo);
    grupo = new THREE.Group();
    banda = new THREE.Group();
    giratorios = [];
    escena.add(grupo);
    grupo.add(banda);

    const seccion = r.seccion;
    const B = r.B / 1000;
    const b = seccion ? seccion.b : (B <= 2 ? 0.9 * B - 0.05 : B - 0.2);
    const estacion = Number(e.estacion);
    const delta = Math.asin(e.H / e.L);
    const L = Math.max(8, Math.min(e.L, 24));
    const Rt = Math.max(0.15, Math.min(e.r, 0.7));
    const p = {
      B, b, estacion, L, Rt,
      Rr: 0.0635 * Math.max(0.8, Math.min(B / 0.8, 1.6)),
      lam: estacion === 1 ? 0 : (e.lambda * Math.PI / 180 || 0),
      talud: (e.talud || 15) * Math.PI / 180,
      l3: estacion === 1 ? B : (estacion === 2 ? 0 : (seccion ? seccion.l3 : 0.39 * B)),
      sen: Math.sin(delta),
      cos: Math.cos(delta),
      transicion: 1.5,
      sCarga: 1.6,
      sobrecarga: sobrecargaActual,
      lSup: Math.max(0.5, e.lsup),
      lInf: Math.max(0.8, e.linf),
    };
    p.base = Math.max(1.35, 1.35 - L * p.sen) + 2 * Rt;
    p.apoyosSup = [0];
    for (let a = 1; a < L - 0.5; a += p.lSup) p.apoyosSup.push(a);
    p.apoyosSup.push(L);
    p.apoyosInf = [0];
    for (let a = 1.2; a < L - 0.6; a += p.lInf) p.apoyosInf.push(a);
    p.apoyosInf.push(L);
    const iCorte = Math.floor(p.apoyosSup.length * 0.55);
    p.sCorte = (p.apoyosSup[iCorte] + p.apoyosSup[iCorte + 1]) / 2;
    fuerzas = null;
    param = p;

    banda.position.set(0, p.base, 0);
    banda.rotation.z = delta;

    construirBanda(p);
    construirLecho(p);
    construirCorte(p);
    const omegaRodillo = 1 / p.Rr;

    let s = 1;
    while (s < L - 0.5) {
      estacionPortante(s, p, omegaRodillo);
      s += p.lSup;
    }
    s = 1.2;
    const yRet = -2 * Rt - 0.012 - p.Rr;
    while (s < L - 0.6) {
      cilindro(banda, [s, yRet, -B / 2 - 0.05], [s, yRet, B / 2 + 0.05], p.Rr * 0.85, M.rodillo, omegaRodillo);
      for (const sg of [-1, 1]) {
        const alto = Math.abs(yRet + 0.22) + 0.06;
        caja(banda, 0.05, alto, 0.03, s, (yRet - 0.22) / 2, sg * (B / 2 + 0.17), M.acero);
      }
      s += p.lInf;
    }
    for (const sg of [-1, 1]) caja(banda, L + 0.1, 0.14, 0.07, L / 2, -0.24, sg * (B / 2 + 0.23), M.acero);

    tambor(p, L, 1 / Rt, true);
    tambor(p, 0, 1 / Rt, false);

    const nPatas = Math.max(2, Math.round(L / 4));
    for (let i = 0; i <= nPatas; i++) {
      const x = L * i / nPatas;
      for (const sg of [-1, 1]) pata(p, x, sg * (B / 2 + 0.23));
      const a = aMundo(p, x, -0.3);
      if (a.y > 1.1) caja(grupo, 0.06, 0.06, B + 0.5, a.x, a.y * 0.5, 0, M.acero);
    }

    // Tolva de carga.
    const xT = 1.05;
    for (const sg of [-1, 1]) caja(banda, 1.2, 0.5, 0.025, xT, 0.42, sg * (b / 2 + 0.02), M.guarda);
    caja(banda, 0.025, 0.55, b + 0.06, xT - 0.6, 0.42, 0, M.guarda);
    const forma = new THREE.CylinderGeometry(0.85, 0.42, 0.55, 4, 1, true);
    forma.rotateY(Math.PI / 4);
    const boca = new THREE.Mesh(forma, M.guarda);
    boca.scale.set(1, 1, Math.max(0.8, B / 0.8));
    boca.position.set(xT, 0.95, 0);
    boca.castShadow = true;
    banda.add(boca);

    // Montón de descarga.
    const cab = aMundo(p, L + Rt, -Rt);
    const altoMonton = Math.min(cab.y * 0.72, 3.2);
    const conoG = new THREE.ConeGeometry(altoMonton * 1.5, altoMonton, 48, 14);
    const vert = conoG.attributes.position;
    for (let i = 0; i < vert.count; i++) {
      const f = 1 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.035;
      vert.setXYZ(i, vert.getX(i) * f, vert.getY(i), vert.getZ(i) * f);
    }
    conoG.computeVertexNormals();
    const cono = new THREE.Mesh(conoG, M.lecho);
    cono.position.set(cab.x + 0.75, altoMonton / 2, 0);
    cono.castShadow = true;
    cono.receiveShadow = true;
    grupo.add(cono);
    monton = cono;
    p.cimaMonton = altoMonton;
    p.xMonton = cab.x + 0.75;

    // Piedras que viajan sobre la banda y piedras que caen al montón.
    const tam = Math.max(0.012, Math.min((e.tamano || 40) / 1000, 0.06));
    const rocaG = new THREE.IcosahedronGeometry(1, 0);
    rocas = new THREE.InstancedMesh(rocaG, M.roca, 2600);
    rocas.castShadow = true;
    rocas.frustumCulled = false;
    rocas.datos = Array.from({ length: rocas.count }, () => ({
      s: p.sCarga + Math.random() * (L - p.sCarga),
      u: (Math.random() * 2 - 1) * 0.96,
      t: tam * (0.45 + Math.random() * 0.9),
      rx: Math.random() * 6.28,
      ry: Math.random() * 6.28,
    }));
    banda.add(rocas);

    caida = new THREE.InstancedMesh(rocaG, M.roca, 220);
    caida.castShadow = true;
    caida.frustumCulled = false;
    caida.datos = Array.from({ length: caida.count }, () => ({
      t: Math.random(),
      z: (Math.random() * 2 - 1) * b * 0.38,
      e: tam * (0.45 + Math.random() * 0.9),
    }));
    grupo.add(caida);

    // Material que se sale de la banda cuando falta capacidad o la velocidad es excesiva.
    derrame = new THREE.InstancedMesh(rocaG, M.roca, 170);
    derrame.castShadow = true;
    derrame.frustumCulled = false;
    derrame.visible = false;
    derrame.datos = Array.from({ length: derrame.count }, () => ({
      s: p.sCarga + Math.random() * (L - p.sCarga - 0.3),
      lado: Math.random() < 0.5 ? -1 : 1,
      t: Math.random(),
      e: Math.max(tam, 0.03) * (0.6 + Math.random() * 0.9),
    }));
    banda.add(derrame);

    // Chispas y humo del patinaje, donde la banda roza el tambor motriz.
    const chispaG = new THREE.BoxGeometry(0.014, 0.014, 0.05);
    chispas = new THREE.InstancedMesh(chispaG, new THREE.MeshBasicMaterial({ color: 0xffc14d }), 90);
    chispas.frustumCulled = false;
    chispas.visible = false;
    chispas.datos = Array.from({ length: chispas.count }, () => ({ t: Math.random(), dur: 0.25 + Math.random() * 0.4, z: 0, vx: 0, vy: 0, vz: 0, arriba: false }));
    banda.add(chispas);
    humo = Array.from({ length: 22 }, () => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaHumo, transparent: true, depthWrite: false, opacity: 0, color: 0x8d8d8d }));
      s.visible = false;
      banda.add(s);
      return { s, t: Math.random(), dur: 1.3 + Math.random() * 1.2, z: 0, deriva: 0, arriba: false };
    });

    anclas = {
      T1: aMundo(p, L * 0.5, 0.75),
      T2: aMundo(p, L * 0.5, -2 * Rt - 0.75, B / 2),
      motor: aMundo(p, L - 1.4, -Rt - 1.45, B / 2 + 0.55),
      v: aMundo(p, L * 0.2, 0.95),
      phi: aMundo(p, L + Rt + 0.32, -Rt + 0.15, B / 2 + 0.09),
      S1: aMundo(p, p.sCorte, p.bordeCorte + p.hCorte + 0.12),
      S2: aMundo(p, p.sCorte, p.bordeCorte * 0.5, -(B / 2 + 0.2)),
      cotaB: aMundo(p, p.sCorte, -0.32),
      flecha: aMundo(p, (p.apoyosSup[iCorte] + p.apoyosSup[iCorte + 1]) / 2, 0.42, B / 2),
    };

    // Sol y sombras ajustados a la longitud representada.
    const sombra = sol.shadow.camera;
    sombra.left = sombra.bottom = -L * 0.9 - 4;
    sombra.right = sombra.top = L * 0.9 + 4;
    sombra.far = L * 4 + 60;
    pararRecorrido();
    sombra.updateProjectionMatrix();
    sol.position.set(L * 0.5 - 12, 24, -16);
    sol.target.position.set(L * 0.5, 0, 0);

    claveModelo = clave;
    aplicarCamara(true);
    aplicarCorte();
  }

  // --- Cámara ---
  const camaraDeseada = { obj: new THREE.Vector3(), radio: 20, azimut: -1.1, elevacion: 0.28 };
  const camaraActual = { obj: new THREE.Vector3(), radio: 20, azimut: -1.1, elevacion: 0.28 };
  let vistaCamara = "general";

  function aplicarCamara(instantanea) {
    if (!param) return;
    const p = param;
    if (vistaCamara === "general") {
      camaraDeseada.obj.copy(aMundo(p, p.L * 0.52, -0.8));
      camaraDeseada.radio = p.L * 1.05 + 2;
      camaraDeseada.azimut = -0.7;
      camaraDeseada.elevacion = 0.2;
    } else if (vistaCamara === "tambor") {
      camaraDeseada.obj.copy(aMundo(p, p.L - 0.55, -p.Rt, 0.25));
      camaraDeseada.radio = 4.6 + p.B;
      camaraDeseada.azimut = 0.72;
      camaraDeseada.elevacion = 0.3;
    } else {
      camaraDeseada.obj.copy(aMundo(p, p.L * 0.62, -0.05));
      camaraDeseada.radio = 3.2 + p.B * 1.2;
      camaraDeseada.azimut = -1.15;
      camaraDeseada.elevacion = 0.3;
    }
    if (vistaCamara === "seccion") {
      camaraDeseada.obj.copy(aMundo(p, p.sCorte, 0.05));
      camaraDeseada.radio = 0.7 + p.B * 1.6;
      camaraDeseada.azimut = -1.42;
      camaraDeseada.elevacion = 0.1;
    } else if (vistaCamara === "flecha") {
      camaraDeseada.obj.copy(aMundo(p, p.sCorte, -0.12, p.B / 2));
      camaraDeseada.radio = 3 + p.lSup;
      camaraDeseada.azimut = 0;
      camaraDeseada.elevacion = 0.04;
    }
    if (instantanea) {
      camaraActual.obj.copy(camaraDeseada.obj);
      camaraActual.radio = camaraDeseada.radio;
      camaraActual.azimut = camaraDeseada.azimut;
      camaraActual.elevacion = camaraDeseada.elevacion;
    }
  }

  document.querySelectorAll("[data-camara]").forEach(boton => boton.addEventListener("click", () => {
    document.querySelectorAll("[data-camara]").forEach(item => item.classList.toggle("activa", item === boton));
    vistaCamara = boton.dataset.camara;
    aplicarCamara(false);
    aplicarCorte();
    if (vistaCamara === "flecha" && exagerar === 1) {
      selectorFlecha.value = "20";
      cambiarFlecha();
    }
  }));
  const botonPausa = document.getElementById("cinta3d-pausa");
  function pintarPausa() {
    botonPausa.textContent = pausado ? "▶ Reanudar" : "⏸ Pausar";
  }
  botonPausa.addEventListener("click", () => {
    pausado = !pausado;
    pintarPausa();
  });
  pintarPausa();
  document.getElementById("cinta3d-acercar").addEventListener("click", () => { camaraDeseada.radio = Math.max(1.5, camaraDeseada.radio * 0.82); });
  document.getElementById("cinta3d-alejar").addEventListener("click", () => { camaraDeseada.radio = Math.min(90, camaraDeseada.radio / 0.82); });

  const selectorFlecha = document.getElementById("cinta3d-flecha");
  function cambiarFlecha() {
    exagerar = exageracionBase();
    deformar();
    pintarRotulosTexto();
    if (pausado && rocas) moverPiedras(0);
  }
  selectorFlecha.addEventListener("change", cambiarFlecha);

  const botonMapa = document.getElementById("cinta3d-mapa");
  botonMapa.addEventListener("click", () => {
    verMapa = !verMapa;
    botonMapa.classList.toggle("activa", verMapa);
    aplicarMapa();
    pintarLeyenda();
  });
  const botonMaterial = document.getElementById("cinta3d-material");
  botonMaterial.addEventListener("click", () => {
    verMaterial = !verMaterial;
    botonMaterial.classList.toggle("activa", verMaterial);
    botonMaterial.textContent = verMaterial ? "Material" : "Sin material";
    aplicarMapa();
    pintarPie();
  });

  // Lupa circular: dibuja las capas calculadas de la banda.
  const lente = document.getElementById("lente-capas");
  const botonCapas = document.getElementById("cinta3d-capas");
  let verCapas = false;
  function dibujarLente() {
    const r = datosTexto.r;
    if (!r) return;
    const c = document.getElementById("lente-lienzo").getContext("2d");
    const lado = 440;
    c.clearRect(0, 0, lado, lado);
    c.fillStyle = "#dfe7ee";
    c.fillRect(0, 0, lado, lado);
    const arriba = 105;
    const abajo = 345;
    const cubierta = 26;
    const z = r.z;
    c.fillStyle = "#17181a";
    c.fillRect(0, arriba, lado, abajo - arriba);
    const alto = (abajo - arriba - 2 * cubierta) / z;
    const pasoHilo = Math.max(7, Math.min(20, alto * 0.7));
    for (let i = 0; i < z; i++) {
      const y = arriba + cubierta + i * alto;
      const margen = Math.min(3, alto * 0.14);
      c.fillStyle = i % 2 ? "#c9a24f" : "#e0bd6b";
      c.fillRect(0, y + margen, lado, alto - 2 * margen);
      if (alto > 7) {
        c.fillStyle = "#8d6d2c";
        for (let x = (i % 2) * pasoHilo / 2; x < lado; x += pasoHilo) {
          c.beginPath();
          c.ellipse(x, y + alto / 2, pasoHilo * 0.26, Math.max(1.2, (alto - 2 * margen) * 0.28), 0, 0, 7);
          c.fill();
        }
      }
      if (alto >= 20) {
        c.fillStyle = "#1f2937";
        c.font = "bold 15px Arial";
        c.textAlign = "center";
        c.fillText(`Capa ${i + 1}`, lado / 2, y + alto / 2 + 5);
      }
    }
    c.fillStyle = "#cbd5e1";
    c.font = "12px Arial";
    c.textAlign = "center";
    c.fillText("Cubierta superior de caucho", lado / 2, arriba + 17);
    c.fillText("Cubierta inferior de caucho", lado / 2, abajo - 9);
    c.fillStyle = "#0f172a";
    c.font = "bold 25px Arial";
    c.fillText(`z = ${z} ${z === 1 ? "capa" : "capas"}`, lado / 2, 68);
    c.font = "bold 14px Arial";
    c.fillText(`R = ${datosTexto.formato(datosTexto.e.R, 0)} N/mm · S = ${r.S}`, lado / 2, 90);
    c.fillText(`T adm. = ${datosTexto.formato(r.Tadm, 0)} N`, lado / 2, 372);
    c.font = "12px Arial";
    c.fillText("Corte transversal, sin escala", lado / 2, 392);
  }
  function aplicarLente(forzada = false) {
    const visible = verCapas || forzada;
    if (visible && lente.classList.contains("oculto")) dibujarLente();
    lente.classList.toggle("oculto", !visible);
  }
  botonCapas.addEventListener("click", () => {
    verCapas = !verCapas;
    botonCapas.classList.toggle("activa", verCapas);
    aplicarLente();
  });

  const botonCotas = document.getElementById("cinta3d-cotas");
  botonCotas.addEventListener("click", () => {
    verCotas = !verCotas;
    botonCotas.classList.toggle("activa", verCotas);
    if (cotas3d) cotas3d.visible = verCotas || cotasTour;
    if (vistaCamara === "general") {
      aplicarCamara(false);
      if (verCotas) {
        camaraDeseada.radio = param.L * 0.82 + 2;
        camaraDeseada.azimut = -0.12;
        camaraDeseada.elevacion = 0.1;
      }
    }
  });
  const botonSolucion = document.getElementById("cinta3d-solucion");
  botonSolucion.addEventListener("click", () => {
    verSolucion = !verSolucion;
    actualizar(datosTexto.e, datosTexto.r, datosTexto.formato);
  });

  const botonReenvio = document.getElementById("cinta3d-reenvio");
  let phiPrevio = 180;
  botonReenvio.addEventListener("click", () => {
    const { e, r } = datosTexto;
    if (!e) return;
    const campo = document.getElementById("thetaDeg");
    const poner = e.thetaDeg <= 180;
    if (poner) {
      phiPrevio = e.thetaDeg;
      campo.value = r.relacion > r.kEuler ? Math.min(355, Math.ceil(r.thetaMinDeg / 5) * 5) : 240;
    } else {
      campo.value = phiPrevio <= 180 ? phiPrevio : 180;
    }
    // Pasa por la calculadora: se recalculan todos los resultados.
    campo.dispatchEvent(new Event("input"));
    if (poner) {
      // Se mira desde el lado libre, donde no estorba el motor.
      vistaCamara = "tambor";
      document.querySelectorAll("[data-camara]").forEach(item => item.classList.toggle("activa", item.dataset.camara === "tambor"));
      aplicarCamara(false);
      aplicarCorte();
      camaraDeseada.obj.copy(aMundo(param, param.L - 0.35, -param.Rt - 0.12, -param.B / 2));
      camaraDeseada.radio = 2.2 + param.Rt * 2;
      camaraDeseada.azimut = Math.PI - 0.1;
      camaraDeseada.elevacion = 0.04;
    }
  });

  // Antes y después del reenvío, con el mismo código de la calculadora.
  function pintarPanelReenvio(e, r, formato) {
    const panel = document.getElementById("cinta3d-panel");
    const activo = e.thetaDeg > 180 && !recorrido3d;
    panel.classList.toggle("oculto", !activo);
    if (!activo || typeof calcular === "undefined") return;
    const sin = calcular({ ...e, thetaDeg: 180 }, datos);
    if (sin.error) {
      panel.classList.add("oculto");
      return;
    }
    const f = (x, n) => formato(x, n);
    const ok = c => (c ? '<span class="ok">✓ cumple</span>' : '<span class="no">✗ patina</span>');
    const fila = (nombre, a, b) => `<tr><td>${nombre}</td><td>${a}</td><td>${b}</td></tr>`;
    const zSin = sin.z;
    panel.innerHTML = `<h4>Efecto del tambor de reenvío</h4><table><thead><tr><th></th><th>Sin</th><th>Con</th></tr></thead><tbody>
      ${fila("φ", "180°", `${f(e.thetaDeg, 0)}°`)}
      ${fila("e^μφ", f(sin.kEuler, 3), f(r.kEuler, 3))}
      ${fila("T₂ mínima", `${f(sin.T2adh, 0)} N`, `${f(r.T2adh, 0)} N`)}
      ${fila("T₂", `${f(sin.T2, 0)} N`, `${f(r.T2, 0)} N`)}
      ${fila("T₁", `${f(sin.T1, 0)} N`, `${f(r.T1, 0)} N`)}
      ${fila("T₁/T₂", f(sin.relacion, 3), f(r.relacion, 3))}
      ${fila("Adherencia", ok(sin.relacion <= sin.kEuler), ok(r.relacion <= r.kEuler))}
      ${fila("Reserva", `${f(sin.reserva * 100, 1)} %`, `${f(r.reserva * 100, 1)} %`)}
      ${fila("F<sub>u</sub>", `${f(sin.Fu, 0)} N`, `${f(r.Fu, 0)} N`)}
      ${fila("Capas z", zSin, r.z)}
    </tbody></table><p>F<sub>u</sub> no cambia: φ no interviene en las resistencias, solo en la adherencia.</p>`;
  }

  const botonFuerzas = document.getElementById("cinta3d-fuerzas");
  botonFuerzas.addEventListener("click", () => {
    verFuerzas = !verFuerzas;
    botonFuerzas.classList.toggle("activa", verFuerzas);
    if (fuerzas) fuerzas.visible = verFuerzas;
  });

  const marco = document.getElementById("cinta3d-marco");
  const botonCompleta = document.getElementById("cinta3d-completa");
  if (!marco.requestFullscreen) botonCompleta.classList.add("oculto");
  botonCompleta.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else marco.requestFullscreen();
  });
  document.addEventListener("fullscreenchange", () => {
    botonCompleta.textContent = document.fullscreenElement ? "✕ Salir" : "⛶ Pantalla completa";
    ajustarTamano();
  });

  // Arrastrar con el ratón o el dedo para girar.
  const lienzo = renderer.domElement;
  lienzo.style.touchAction = "pan-y";
  let arrastre = null;
  lienzo.addEventListener("pointerdown", ev => {
    arrastre = { x: ev.clientX, y: ev.clientY };
    lienzo.setPointerCapture(ev.pointerId);
    lienzo.style.cursor = "grabbing";
  });
  lienzo.addEventListener("pointermove", ev => {
    if (!arrastre) return;
    camaraDeseada.azimut -= (ev.clientX - arrastre.x) * 0.008;
    camaraDeseada.elevacion = Math.max(0.03, Math.min(1.35, camaraDeseada.elevacion + (ev.clientY - arrastre.y) * 0.006));
    arrastre = { x: ev.clientX, y: ev.clientY };
  });
  const soltar = () => {
    arrastre = null;
    lienzo.style.cursor = "grab";
  };
  lienzo.addEventListener("pointerup", soltar);
  lienzo.addEventListener("pointercancel", soltar);
  lienzo.style.cursor = "grab";

  function ajustarTamano() {
    const ancho = contenedor.clientWidth;
    const barra = marco.querySelector(".controles-3d").offsetHeight + 30;
    const alto = document.fullscreenElement ? window.innerHeight - barra : Math.round(ancho * 9 / 16);
    if (!ancho) return;
    renderer.setSize(ancho, alto);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }
  window.addEventListener("resize", ajustarTamano);
  ajustarTamano();

  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entradas => { visible = entradas[0].isIntersecting; }).observe(contenedor);
  }

  // --- Animación ---
  let velocidad = 0;
  let recorrido = 0;
  let ultimoTiempo = 0;
  let textosRotulos = {};

  function moverPiedras(dt) {
    const p = param;
    // Si patina, la banda casi se para y el tambor gira en falso.
    // Patinaje: el tambor gira en falso y la banda avanza a tirones (adhesión y deslizamiento).
    tiempoPatina += dt;
    const vBanda = patina ? velocidad * (0.03 + 0.34 * Math.max(0, Math.sin(tiempoPatina * 2.3)) ** 6) : velocidad;
    efectoPatina(dt, p);
    recorrido += vBanda * dt;
    texturaBanda.offset.x = -recorrido / 4;
    giratorios.forEach(g => { g.malla.rotation.y += g.omega * dt * (g.tambor ? velocidad * (patina ? 2.2 : 1) : vBanda); });

    rocas.datos.forEach((d, i) => {
      d.s += vBanda * dt;
      if (d.s > p.L) d.s = p.sCarga + (d.s - p.L);
      const q = techoMaterial(d.s, d.u, p);
      auxiliar.position.set(d.s, q.y + d.t * 0.2 - flechaPortante(d.s), q.z);
      auxiliar.rotation.set(d.rx, d.ry, 0);
      auxiliar.scale.setScalar(d.t);
      auxiliar.updateMatrix();
      rocas.setMatrixAt(i, auxiliar.matrix);
    });
    rocas.instanceMatrix.needsUpdate = true;

    const salida = aMundo(p, p.L + p.Rt * 0.35, 0.02);
    const tiempoCaida = Math.sqrt(2 * Math.max(0.3, salida.y - p.cimaMonton * 0.55) / 9.81);
    caida.datos.forEach((d, i) => {
      d.t += dt / tiempoCaida;
      if (d.t > 1) d.t -= 1;
      const t = d.t * tiempoCaida;
      auxiliar.position.set(salida.x + vBanda * p.cos * t, salida.y + vBanda * p.sen * t - 4.905 * t * t, d.z);
      auxiliar.rotation.set(d.t * 9, d.t * 7, 0);
      auxiliar.scale.setScalar(d.e);
      auxiliar.updateMatrix();
      if (patina && i / caida.count > 0.12 + vBanda / velocidad) {
        auxiliar.scale.setScalar(0);
        auxiliar.updateMatrix();
      }
      caida.setMatrixAt(i, auxiliar.matrix);
    });
    caida.instanceMatrix.needsUpdate = true;

    if (derrame && derrame.visible) {
      const tiempo = 0.75;
      derrame.datos.forEach((d, i) => {
        d.t += dt / tiempo;
        if (d.t > 1) {
          d.t -= 1;
          d.s = p.sCarga + Math.random() * (p.L - p.sCarga - 0.3);
        }
        const t = d.t * tiempo;
        const q = techoMaterial(d.s, d.lado * 0.96, p);
        auxiliar.position.set(d.s + vBanda * t, q.y + 0.03 - 4.905 * t * t, d.lado * (p.B / 2 + 0.03 + 0.5 * t));
        auxiliar.rotation.set(d.t * 9, d.t * 7, 0);
        auxiliar.scale.setScalar(d.e);
        auxiliar.updateMatrix();
        derrame.setMatrixAt(i, auxiliar.matrix);
      });
      derrame.instanceMatrix.needsUpdate = true;
    }
  }

  function pintarRotulos() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    Object.entries(textosRotulos).forEach(([clave, nodo]) => {
      const punto = anclas[clave].clone().project(camara);
      const vistaRotulo = nodo.dataset.vista;
      const fuera = vistaRotulo === "cotas"
        ? (!(verCotas || cotasTour) || vistaCamara === "seccion" || vistaCamara === "flecha")
        : vistaCamara === "soloCotas"
          ? true
          : vistaRotulo === "tamborGeneral"
        ? (!verFuerzas || vistaCamara === "seccion" || vistaCamara === "flecha")
        : (vistaRotulo ? vistaRotulo !== vistaCamara : (vistaCamara === "seccion" || vistaCamara === "flecha"));
      // Con las cotas activas, la vista general solo las muestra a ellas para que no se solapen.
      const tapada = verCotas && vistaCamara === "general" && vistaRotulo !== "cotas";
      const oculto = fuera || tapada || punto.z > 1 || Math.abs(punto.x) > 0.95 || Math.abs(punto.y) > 0.95;
      nodo.style.display = oculto ? "none" : "block";
      nodo.style.left = `${(punto.x + 1) / 2 * ancho}px`;
      nodo.style.top = `${(1 - punto.y) / 2 * alto}px`;
    });
  }

  const p3dLongitud = () => param.L;

  function pintarLeyenda() {
    const leyenda = document.getElementById("cinta3d-leyenda");
    leyenda.classList.toggle("oculto", !verMapa || !tens);
    if (!verMapa || !tens) return;
    const adoptadas = tens.Tsup !== null
      ? `<br>Reparto calculado a lo largo de la banda. No coincide con las tensiones locales adoptadas (${datosTexto.formato(tens.Tsup, 0)} y ${datosTexto.formato(tens.Tinf, 0)} N).`
      : "<br>Reparto lineal entre T₂, T cola y T₁.";
    leyenda.innerHTML = `<strong>Tensión en la banda</strong><div class="degradado"></div><div class="extremos-ley"><span>${datosTexto.formato(tens.minT, 0)} N</span><span>${datosTexto.formato(tens.maxT, 0)} N</span></div>${adoptadas}`;
  }

  const datosTexto = { formato: null, e: null, r: null };
  function pintarRotulosTexto() {
    const n = textosRotulos.flecha;
    if (n && datosTexto.r) {
      const { r, formato } = datosTexto;
      n.innerHTML = r.relSup !== undefined
        ? `Portante: ${formato(r.relSup * 100, 2)} % · retorno: ${formato(r.relInf * 100, 2)} % · dibujo × ${exagerar}`
        : `Dibujo × ${exagerar}`;
    }
  }

  // --- Recorrido cinematográfico, con los resultados del cálculo actual ---
  let recorrido3d = null;
  const cineCapa = document.getElementById("cinta3d-cine");
  const cineTarjeta = document.getElementById("cine-tarjeta");
  const cineBarra = document.getElementById("cine-barra");

  // Águila procedural: cuerpo, cabeza blanca, pico, cola en abanico y alas con plumas.
  function crearAguila() {
    const g = new THREE.Group();
    const opc = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, side: THREE.DoubleSide });
    const oscuro = opc(0x2e2115);
    const medio = opc(0x4d3620);
    const claro = opc(0x6b4d2e);
    const blanco = opc(0xeee9dc);
    const pico = opc(0xdba21f);
    const pluma = (largo, ancho, material) => {
      const f = new THREE.Shape();
      f.moveTo(0, -ancho * 0.25);
      f.quadraticCurveTo(largo * 0.55, -ancho * 0.75, largo, 0);
      f.quadraticCurveTo(largo * 0.55, ancho * 0.75, 0, ancho * 0.25);
      f.closePath();
      const geo = new THREE.ShapeGeometry(f, 6);
      geo.rotateX(-Math.PI / 2);
      return new THREE.Mesh(geo, material);
    };
    const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), medio);
    cuerpo.scale.set(0.82, 0.74, 2.3);
    g.add(cuerpo);
    const pecho = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), oscuro);
    pecho.scale.set(0.9, 0.7, 1.8);
    pecho.position.set(0, -0.06, 0.08);
    g.add(pecho);
    const cuello = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), blanco);
    cuello.scale.set(0.9, 0.9, 1.5);
    cuello.position.set(0, 0.05, 0.46);
    g.add(cuello);
    const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.115, 18, 14), blanco);
    cabeza.scale.set(0.9, 0.95, 1.2);
    cabeza.position.set(0, 0.08, 0.62);
    g.add(cabeza);
    const conoPico = new THREE.ConeGeometry(0.042, 0.15, 12);
    conoPico.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(conoPico, pico);
    m.position.set(0, 0.055, 0.78);
    m.rotation.x = 0.28;
    g.add(m);
    for (const sg of [-1, 1]) {
      const ojo = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }));
      ojo.position.set(sg * 0.082, 0.115, 0.68);
      g.add(ojo);
    }
    // Cola en abanico.
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.085;
      const p = pluma(0.62, 0.13, blanco);
      p.position.set(0, 0, -0.38);
      p.rotation.y = -a + Math.PI;
      p.rotation.y = Math.PI / 2 + (i - 4) * 0.085;
      g.add(p);
    }
    // Alas: el brazo lleva coberteras y secundarias; la mano, las primarias separadas.
    const alas = [];
    for (const sg of [-1, 1]) {
      const hombro = new THREE.Group();
      hombro.position.set(sg * 0.13, 0.07, 0.06);
      const espejo = new THREE.Group();
      espejo.scale.x = sg;
      hombro.add(espejo);
      for (let i = 0; i < 8; i++) {
        const sec = pluma(0.46, 0.17, i % 2 ? oscuro : medio);
        sec.position.set(0.08 + i * 0.1, 0, -0.1);
        sec.rotation.y = Math.PI / 2 - 0.1;
        espejo.add(sec);
      }
      for (let i = 0; i < 7; i++) {
        const cob = pluma(0.3, 0.14, claro);
        cob.position.set(0.05 + i * 0.11, 0.012, 0.11);
        cob.rotation.y = Math.PI / 2 - 0.15;
        espejo.add(cob);
      }
      const brazo = pluma(0.86, 0.34, medio);
      brazo.position.set(0, 0.018, 0.1);
      espejo.add(brazo);
      const mano = new THREE.Group();
      mano.position.set(0.82, 0, 0.02);
      espejo.add(mano);
      for (let i = 0; i < 8; i++) {
        const pri = pluma(0.82 - i * 0.03, 0.12, oscuro);
        pri.position.set(0.02, -i * 0.002, 0.08 - i * 0.03);
        pri.rotation.y = 0.32 - i * 0.2;
        mano.add(pri);
      }
      const cubre = pluma(0.46, 0.28, medio);
      cubre.position.set(0, 0.012, 0.03);
      mano.add(cubre);
      g.add(hombro);
      alas.push({ hombro, mano, sg });
    }
    g.userData.alas = alas;
    g.visible = false;
    g.scale.setScalar(1.25);
    escena.add(g);
    return g;
  }
  const aguila = crearAguila();

  // El águila abre el recorrido: va delante de la cámara y la guía hasta la cinta.
  function moverAguila(rc, pos, mira) {
    const FIN = 25;
    if (rc.t > FIN + 6) {
      aguila.visible = false;
      return;
    }
    aguila.visible = true;
    const adelante = mira.clone().sub(pos).normalize();
    const derecha = adelante.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
    const arriba = derecha.clone().cross(adelante).normalize();
    const salida = Math.max(0, rc.t - FIN);
    const dist = 9.5 + salida * salida * 2.2;
    const lado = Math.sin(rc.t * 0.42) * 2.2 + 1.2;
    const alto = Math.sin(rc.t * 0.6) * 0.5 - 0.9 + salida * salida * 0.5;
    aguila.position.copy(pos).addScaledVector(adelante, dist).addScaledVector(derecha, lado).addScaledVector(arriba, alto);
    aguila.up.set(0, 1, 0);
    aguila.lookAt(aguila.position.clone().add(adelante));
    aguila.rotateZ(Math.cos(rc.t * 0.42) * 0.42);
    aguila.rotateX(-0.08);
    // Planea y, de vez en cuando, bate las alas con el brazo y la mano desfasados.
    const bate = Math.max(0, Math.sin(rc.t * 0.55)) ** 2;
    const fase = rc.t * 6.5;
    aguila.userData.alas.forEach(a => {
      a.hombro.rotation.z = a.sg * (0.1 + bate * 0.5 * Math.sin(fase));
      a.mano.rotation.z = 0.05 + bate * 0.42 * Math.sin(fase - 0.9);
    });
  }

  // Guion del recorrido: cada escena tiene su propio movimiento de cámara y su objetivo.
  function tramosRecorrido() {
    const p = param;
    const { r, formato: f, e } = datosTexto;
    const W = (s, y, z = 0) => aMundo(p, s, y, z);
    const M3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const L = p.L;
    const B = p.B;
    const Rt = p.Rt;
    const sec = r.seccion;
    const hMax = r.flechaMaxima || 0;
    const ok = c => (c ? '<span class="ok">✓</span>' : '<span class="no">✗</span>');
    const todo = r.checks.every(c => c.ok);
    const tieneFlecha = r.relSup !== undefined;
    return [
      { // Sobrevuelo de la cordillera, con el título.
        camA: M3(-430, 300, 520), camB: M3(-250, 210, 300), objA: M3(320, 190, -620), objB: M3(180, 120, -520), fovA: 34, fovB: 38, dur: 9, luz: "alba",
        titular: `CINTA TRANSPORTADORA<small>L = ${f(e.L, 0)} m · Q = ${f(r.Q, 0)} t/h · B = ${f(r.B, 0)} mm</small>`, titulo: "", lineas: [] },
      { // Vuelo rasante sobre el valle hacia la instalación.
        camA: M3(-190, 72, 210), camB: M3(-74, 24, 92), objA: M3(60, 12, -80), objB: W(L * 0.4, 0), fovA: 42, fovB: 36, dur: 8, luz: "alba", titulo: "", lineas: [] },
      { // Entrada entre los árboles: la cinta aparece poco a poco.
        camA: M3(-44, 2.3, 42), camB: M3(-24, 2.8, 25), objA: W(L * 0.25, 1), objB: W(L * 0.45, 0.5), fovA: 30, fovB: 34, dur: 8, titulo: "", lineas: [],
        titular: `<small>Una instalación calculada de principio a fin</small>` },
      { // Travelling lateral con la cordillera detrás.
        camA: W(L * 0.1, 3.2, 24), camB: W(L * 0.85, 4.6, 22), objA: W(L * 0.35, 1), objB: W(L * 0.65, 1), fovA: 34, fovB: 34, dur: 8, conCotas: true, titulo: "La instalación",
        lineas: [`L = ${f(e.L, 1)} m · H = ${f(e.H, 1)} m · δ = ${f(r.deltaDeg, 2)}°`, `Banda B = ${f(r.B, 0)} mm · v = ${f(r.v, 2)} m/s`, `Caudal Q = ${f(r.Q, 1)} t/h`] },
      { // Grúa ascendente sobre la tolva.
        camA: W(-3.6, -0.6, 4.2), camB: W(-1.4, 2.6, 2.6), objA: W(1, 0.5), objB: W(2.4, 0.2), fovA: 38, fovB: 44, dur: 8, titulo: "Tolva: capacidad de transporte",
        lineas: [r.Qcap !== undefined ? `Capacidad = ${f(r.Qcap, 1)} t/h ${ok(r.Qcap >= r.Q)}` : "q<sub>g</sub> es dato del enunciado", `Masa lineal q<sub>g</sub> = Q/(3,6·v) = ${f(r.qg, 2)} kg/m`, r.K !== undefined ? `Factor de inclinación K = ${f(r.K, 3)}` : `Inclinación δ = ${f(r.deltaDeg, 2)}°`] },
      { // Cámara subjetiva: viaja sobre el material.
        camA: W(2.1, 0.62), camB: W(L * 0.55, 0.62), objA: W(7, 0.2), objB: W(L * 0.55 + 5, 0.2), fovA: 52, fovB: 52, dur: 9, titulo: "Sobre la banda: sección de material",
        lineas: sec ? [`S₁ = ${f(sec.S1 * 10000, 1)} cm² · S₂ = ${f(sec.S2 * 10000, 1)} cm²`, `S = ${f(sec.S * 10000, 1)} cm²`, `b = ${f(sec.b * 1000, 0)} mm · l₃ = ${f(sec.l3 * 1000, 0)} mm`] : ["Sin sección calculada: q<sub>g</sub> es dato"] },
      { // Contrapicado a ras de los rodillos.
        camA: W(L * 0.22, -0.95, B / 2 + 0.95), camB: W(L * 0.42, -0.95, B / 2 + 0.95), objA: W(L * 0.22 + 1.6, -0.1), objB: W(L * 0.42 + 1.6, -0.1), fovA: 46, fovB: 46, dur: 8, titulo: "Rodillos: resistencias al avance",
        lineas: [`F<sub>H</sub> + F<sub>N</sub> = ${f(r.FHN, 2)} N`, `F<sub>St</sub> = q<sub>g</sub>·g·H = ${f(r.FSt, 2)} N`, `F<sub>u</sub> = ${f(r.Fu, 2)} N`] },
      { // Perfil con teleobjetivo para ver la flecha.
        camA: W(L * 0.46 - 1, -0.05, B / 2 + 4.2), camB: W(L * 0.46 + 1, -0.05, B / 2 + 4.2), objA: W(L * 0.46 - 1, -0.1, B / 2), objB: W(L * 0.46 + 1, -0.1, B / 2), fovA: 26, fovB: 26, dur: 8, exag: 20, titulo: "Flecha entre rodillos (dibujo × 20)",
        lineas: tieneFlecha ? [`Portante: ${f(r.relSup * 100, 2)} % ${ok(r.relSup <= hMax)}`, `Retorno: ${f(r.relInf * 100, 2)} % ${ok(r.relInf <= hMax)}`, `T mín.: ${f(r.TsupMin, 0)} N y ${f(r.TinfMin, 0)} N`] : ["La tensión local se anula: hay que aumentar T₂"] },
      { // Dron sobre la banda coloreada.
        camA: W(L * 0.3, 8, -8), camB: W(L * 0.82, 3.4, -3.4), objA: W(L * 0.55, -0.3), objB: W(L * 0.9, -0.3), fovA: 40, fovB: 40, dur: 8, mapa: true, titulo: "Mapa de tensiones en la banda",
        lineas: [`T₁ = ${f(r.T1, 0)} N · T₂ = ${f(r.T2, 0)} N`, `T₁/T₂ = ${f(r.relacion, 3)}, límite e^μφ = ${f(r.kEuler, 3)} ${ok(r.relacion <= r.kEuler)}`, `Reserva de adherencia = ${f(r.reserva * 100, 1)} %`] },
      { // Órbita alrededor del tambor motriz.
        camA: W(L + 3, 0.4, B / 2 + 1.2), camB: W(L - 0.4, 0.9, B / 2 + 3.6), objA: W(L - 0.1, -Rt, 0.2), objB: W(L - 0.3, -Rt, 0.2), fovA: 38, fovB: 38, dur: 8, rotulos: true, titulo: "Tambor motriz: potencia y par",
        lineas: [`F<sub>u</sub> = T₁ − T₂ = ${f(r.Fu, 2)} N`, `P<sub>u</sub> = ${f(r.Pu / 1000, 2)} kW · P<sub>eje</sub> = ${f(r.Peje / 1000, 2)} kW`, `M = ${f(r.M, 1)} N·m · n = ${f(r.n, 1)} rpm`] },
      // Si la banda patina, la cámara se acerca al tambor desde el lado libre.
      ...(r.relacion > r.kEuler ? [{
        camA: W(L + 2.4, 0.5, -(B / 2 + 2.6)), camB: W(L + 0.5, -0.05, -(B / 2 + 1.25)), objA: W(L - 0.1, -Rt, -B / 4), objB: W(L, -Rt * 0.9, -B / 4), fovA: 40, fovB: 34, dur: 12,
        titulo: "¡La banda patina!",
        lineas: [`T₁/T₂ = ${f(r.relacion, 3)} > e^μφ = ${f(r.kEuler, 3)} <span class="no">✗</span>`, `T₂ = ${f(r.T2, 0)} N, y hacen falta ${f(r.T2adh, 0)} N`, `Se transmiten ${f(r.FuMax, 0)} N de los ${f(r.Fu, 0)} N necesarios`, "El tambor gira en falso y la banda avanza a tirones"] },
      ] : []),
      { // Contrapicado heroico desde el suelo, con las montañas detrás.
        camA: M3(L * 0.62, 0.55, 9), camB: M3(L * 0.36, 0.7, 7.5), objA: W(L * 0.95, 1.2), objB: W(L * 0.95, 1.8), fovA: 44, fovB: 38, dur: 7, titulo: "Fuerza periférica",
        lineas: [`F<sub>u</sub> = ${f(r.Fu, 2)} N`, `T₁/T₂ = ${f(r.relacion, 3)}`] },
      { // Primer plano del borde de la banda, con la lupa de capas.
        camA: W(L * 0.6 - 1, 0.32, B / 2 + 1), camB: W(L * 0.6 + 0.6, 0.22, B / 2 + 0.7), objA: W(L * 0.6, 0.02, B / 2), objB: W(L * 0.6 + 0.8, 0.02, B / 2), fovA: 40, fovB: 34, dur: 8, lente: true, titulo: "La banda: número de capas",
        lineas: [`Tensión máxima = ${f(r.T1, 0)} N`, `z = ${r.z} capas · S = ${r.S}`, `T<sub>adm</sub> = ${f(r.Tadm, 0)} N ${ok(r.T1 <= r.Tadm)}`] },
      { // Contrapicado de la descarga, con las montañas al fondo.
        camA: aMundo(p, L + 6, -Rt - 0.9, -6), camB: aMundo(p, L + 3.6, -Rt - 1.05, -3.4), objA: aMundo(p, L + 0.8, -Rt - 0.2), objB: aMundo(p, L + 0.8, -Rt - 0.6), fovA: 36, fovB: 42, dur: 7, titulo: "Descarga",
        lineas: [`Caudal Q = ${f(r.Q, 1)} t/h a v = ${f(r.v, 2)} m/s`, `Potencia en el eje = ${f(r.Peje / 1000, 2)} kW`] },
      { // Órbita completa alrededor de la cinta, al atardecer.
        orbita: { c: W(L * 0.5, 0), r: L * 0.75 + 9, y: 5.5, a0: 0.2, a1: 2.6 }, camA: W(0, 0), camB: W(0, 0), objA: W(L * 0.5, 0), objB: W(L * 0.5, 0), fovA: 40, fovB: 40, dur: 12, luz: "ocaso", titulo: "Resumen del diseño",
        lineas: [`B = ${f(r.B, 0)} mm · v = ${f(r.v, 2)} m/s · z = ${r.z} capas`, `F<sub>u</sub> = ${f(r.Fu, 0)} N · P<sub>eje</sub> = ${f(r.Peje / 1000, 2)} kW`, `T₁ = ${f(r.T1, 0)} N · T₂ = ${f(r.T2, 0)} N`] },
      { // Plano final: la cámara se aleja hasta ver cinta y cordillera.
        luz: "ocaso", camA: W(L * 0.5, 3, 18), camB: M3(L / 2 - 14, 62, 240), objA: W(L * 0.5, 0.6), objB: M3(70, 222, -520), fovA: 40, fovB: 50, dur: 16, titulo: todo ? "Resultado: el diseño cumple" : "Resultado: el diseño no cumple",
        lineas: [`B = ${f(r.B, 0)} mm · v = ${f(r.v, 2)} m/s · z = ${r.z} capas`, `F<sub>u</sub> = ${f(r.Fu, 0)} N · P<sub>eje</sub> = ${f(r.Peje / 1000, 2)} kW`, `T₁ = ${f(r.T1, 0)} N · T₂ = ${f(r.T2, 0)} N`, ...r.checks.map(c => `${ok(c.ok)} ${c.texto.split(":")[0]}`)] },
    ];
  }

  // Luz de cada escena: alba, ocaso o mediodía.
  const luzObjetivo = { color: new THREE.Color(0xfff1dc), intensidad: 2.8, exposicion: 1.05, cielo: new THREE.Color(0xffffff), niebla: new THREE.Color(0xcfdbe4), hemi: 1.5, brillo: 0 };

  // Disco solar del atardecer: las montañas lo tapan al pasar por delante.
  const discoSolar = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texturaLienzo(256, 256, (c, a) => {
      const g = c.createRadialGradient(a / 2, a / 2, 0, a / 2, a / 2, a / 2);
      g.addColorStop(0, "rgba(255,246,214,1)");
      g.addColorStop(0.2, "rgba(255,214,130,1)");
      g.addColorStop(0.32, "rgba(255,150,70,0.65)");
      g.addColorStop(1, "rgba(255,120,50,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, a, a);
    }),
    fog: false,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  discoSolar.scale.set(300, 300, 1);
  discoSolar.position.set(430, 400, -770);
  escena.add(discoSolar);

  // Bandada lejana cerca de las cimas, en formación en V.
  const bandada = new THREE.Group();
  const matPajaro = new THREE.MeshBasicMaterial({ color: 0x1a120c, side: THREE.DoubleSide, fog: false });
  const pajaros = [];
  for (let i = 0; i < 17; i++) {
    const fila = Math.ceil(i / 2);
    const lado = i % 2 ? 1 : -1;
    const ave = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.42, 6, 4), matPajaro);
    cuerpo.scale.set(0.7, 0.5, 2.4);
    ave.add(cuerpo);
    const alas = [-1, 1].map(s => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0.5, 0, 0, -0.6, s * 3.6, 0, -0.5], 3));
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, matPajaro);
      ave.add(m);
      return { m, s };
    });
    ave.position.set(-fila * 8.5, (i % 3) * 1.2, lado * fila * 9);
    ave.rotation.y = Math.PI / 2;
    pajaros.push({ ave, alas, fase: i * 0.7 });
    bandada.add(ave);
  }
  bandada.visible = false;
  bandada.scale.setScalar(1.7);
  escena.add(bandada);
  function moverBandada(t) {
    bandada.visible = true;
    const x = -420 + ((t * 13) % 950);
    bandada.position.set(x, 262 + Math.sin(t * 0.25) * 8, -560);
    pajaros.forEach(p => {
      const a = Math.sin(t * 5.2 + p.fase) * 0.55;
      p.alas.forEach(w => { w.m.rotation.z = w.s * a; });
    });
  }
  function aplicarLuz(tipo, inmediata = true) {
    const ajustes = {
      alba: [0xffd9b0, 2.1, 0.95, 0xfff0e0, 0xe6dcd2, 1.3],
      ocaso: [0xff8a3c, 2.5, 0.82, 0xff9d62, 0xe89a68, 0.8],
    };
    const [color, intensidad, exposicion, tintaCielo, niebla, luzHemi] = ajustes[tipo] || [0xfff1dc, 2.8, 1.05, 0xffffff, 0xcfdbe4, 1.5];
    luzObjetivo.color.setHex(color);
    luzObjetivo.intensidad = intensidad;
    luzObjetivo.exposicion = exposicion;
    luzObjetivo.cielo.setHex(tintaCielo);
    luzObjetivo.niebla.setHex(niebla);
    luzObjetivo.hemi = luzHemi;
    luzObjetivo.brillo = tipo === "ocaso" ? 1 : 0;
    if (inmediata) {
      sol.color.copy(luzObjetivo.color);
      sol.intensity = intensidad;
      renderer.toneMappingExposure = exposicion;
      cielo.material.color.copy(luzObjetivo.cielo);
      escena.fog.color.copy(luzObjetivo.niebla);
      hemi.intensity = luzHemi;
      discoSolar.material.opacity = luzObjetivo.brillo;
    }
  }

  function aplicarTramo(tramo) {
    recorrido3d.exagObjetivo = tramo.exag || exageracionBase();
    verMapa = !!tramo.mapa || botonMapa.classList.contains("activa");
    aplicarLente(!!tramo.lente);
    aplicarLuz(tramo.luz, recorrido3d.indice === 0 && recorrido3d.t < 0.2);
    cotasTour = !!tramo.conCotas;
    if (cotas3d) cotas3d.visible = verCotas || cotasTour;
    rotulos.classList.toggle("oculto", !tramo.rotulos && !tramo.conCotas);
    vistaCamara = tramo.conCotas ? "soloCotas" : (tramo.rotulos ? "tambor" : "general");
    deformar();
    aplicarMapa();
    pintarLeyenda();
    cineTarjeta.style.opacity = 0;
    setTimeout(() => {
      cineTarjeta.innerHTML = `<h4>${tramo.titulo}</h4>${tramo.lineas.join("<br>")}`;
      cineTarjeta.style.opacity = tramo.titulo ? 1 : 0;
      document.getElementById("cine-titular").innerHTML = tramo.titular || "";
    }, 300);
  }

  function iniciarRecorrido() {
    if (!param || !datosTexto.r) return;
    const tramos = tramosRecorrido();
    let acumulado = 0;
    tramos.forEach(t => {
      t.inicio = acumulado;
      acumulado += t.dur;
    });
    recorrido3d = {
      tramos,
      total: acumulado,
      t: 0,
      indice: -1,
      pausa: false,
      transicion: 3.5,
      exagObjetivo: exagerar,
      velocidad: Number(document.getElementById("cine-velocidad").value),
      zoom: 1,
      fuerzasAntes: verFuerzas,
    };
    verFuerzas = true;
    if (fuerzas) fuerzas.visible = true;
    vistaCamara = "general";
    document.querySelectorAll("[data-camara]").forEach(item => item.classList.toggle("activa", item.dataset.camara === "general"));
    aplicarCorte();
    cineCapa.classList.remove("oculto");
    rotulos.classList.add("oculto");
    botonRecorrido.textContent = "■ Parar recorrido";
    document.getElementById("cine-pausa").textContent = "⏸";
  }

  function pararRecorrido() {
    if (!recorrido3d) return;
    verFuerzas = recorrido3d.fuerzasAntes;
    if (fuerzas) fuerzas.visible = verFuerzas;
    recorrido3d = null;
    cotasTour = false;
    if (cotas3d) cotas3d.visible = verCotas;
    aguila.visible = false;
    bandada.visible = false;
    camara.fov = 38;
    camara.updateProjectionMatrix();
    aplicarLuz();
    document.getElementById("cine-fundido").style.opacity = 0;
    document.getElementById("cine-titular").innerHTML = "";
    aplicarLente();
    vistaCamara = "general";
    exagerar = exageracionBase();
    verMapa = botonMapa.classList.contains("activa");
    deformar();
    aplicarMapa();
    pintarLeyenda();
    cineCapa.classList.add("oculto");
    rotulos.classList.remove("oculto");
    botonRecorrido.textContent = "🎬 Recorrido";
    // La cámara vuelve con suavidad a la vista general.
    const objetivo = new THREE.Vector3();
    camara.getWorldDirection(objetivo);
    camaraActual.obj.copy(camara.position).addScaledVector(objetivo, camaraActual.radio);
    aplicarCamara(false);
  }

  const botonRecorrido = document.getElementById("cinta3d-recorrido");
  botonRecorrido.addEventListener("click", () => (recorrido3d ? pararRecorrido() : iniciarRecorrido()));
  document.getElementById("cine-parar").addEventListener("click", pararRecorrido);
  document.getElementById("cine-pausa").addEventListener("click", ev => {
    if (!recorrido3d) return;
    recorrido3d.pausa = !recorrido3d.pausa;
    ev.currentTarget.textContent = recorrido3d.pausa ? "▶" : "⏸";
  });
  document.getElementById("cine-velocidad").addEventListener("change", ev => {
    if (recorrido3d) recorrido3d.velocidad = Number(ev.target.value);
  });
  document.getElementById("cine-acercar").addEventListener("click", () => { if (recorrido3d) recorrido3d.zoom = Math.max(0.3, recorrido3d.zoom * 0.8); });
  document.getElementById("cine-alejar").addEventListener("click", () => { if (recorrido3d) recorrido3d.zoom = Math.min(3, recorrido3d.zoom / 0.8); });
  const saltarTramo = paso => {
    if (!recorrido3d) return;
    const rc = recorrido3d;
    const destino = Math.max(0, Math.min(rc.tramos.length - 1, Math.max(rc.indice, 0) + paso));
    rc.t = rc.tramos[destino].inicio + 0.01;
  };
  document.getElementById("cine-atras").addEventListener("click", () => saltarTramo(-1));
  document.getElementById("cine-adelante").addEventListener("click", () => saltarTramo(1));
  document.getElementById("cine-barra").addEventListener("input", ev => {
    if (recorrido3d) recorrido3d.t = Math.min(recorrido3d.total - 0.05, ev.target.value / 1000 * recorrido3d.total);
  });

  // Posición de la cámara en una escena, con x de 0 a 1.
  function poseEscena(tr, x) {
    const u = Math.max(0, Math.min(1, x));
    const s = u * u * (3 - 2 * u);
    const suave = 0.35 * u + 0.65 * s; // No llega a detenerse del todo en los extremos.
    const mira = tr.objA.clone().lerp(tr.objB, suave);
    let pos;
    if (tr.orbita) {
      const o = tr.orbita;
      const a = o.a0 + (o.a1 - o.a0) * suave;
      pos = new THREE.Vector3(o.c.x + Math.sin(a) * o.r, o.y, o.c.z + Math.cos(a) * o.r);
    } else {
      pos = tr.camA.clone().lerp(tr.camB, suave);
    }
    return { pos, mira, fov: tr.fovA + (tr.fovB - tr.fovA) * suave };
  }

  function avanzarRecorrido(dt) {
    const rc = recorrido3d;
    if (!rc.pausa) rc.t += dt * rc.velocidad;
    if (rc.t >= rc.total) {
      pararRecorrido();
      return false;
    }
    let i = rc.tramos.length - 1;
    while (i > 0 && rc.t < rc.tramos[i].inicio) i--;
    if (i !== rc.indice) {
      rc.indice = i;
      aplicarTramo(rc.tramos[i]);
    }
    const tr = rc.tramos[i];
    const seg = rc.t - tr.inicio;
    const actual = poseEscena(tr, seg / tr.dur);
    let pos = actual.pos;
    let mira = actual.mira;
    let fov = actual.fov;
    // Paso continuo: la cámara sale del final de la escena anterior y se funde con esta,
    // sin cortes ni negro. El arco evita atravesar la instalación en los traslados largos.
    if (i > 0 && seg < rc.transicion) {
      const previa = poseEscena(rc.tramos[i - 1], 1);
      const b = seg / rc.transicion;
      const m = b * b * b * (b * (6 * b - 15) + 10);
      const distancia = previa.pos.distanceTo(actual.pos);
      pos = previa.pos.clone().lerp(actual.pos, m);
      pos.y += Math.sin(Math.PI * m) * Math.min(distancia * 0.18, 7);
      mira = previa.mira.clone().lerp(actual.mira, m);
      fov = previa.fov + (actual.fov - previa.fov) * m;
    }
    camara.position.copy(pos).sub(mira).multiplyScalar(rc.zoom).add(mira);
    camara.position.y = Math.max(alturaTerreno(camara.position.x, camara.position.z) + 0.5, camara.position.y);
    camara.fov = fov;
    camara.updateProjectionMatrix();
    camara.lookAt(mira);
    moverAguila(rc, camara.position.clone(), mira);
    // Luz y flecha cambian poco a poco.
    const k = 1 - Math.exp(-dt * 1.3);
    sol.color.lerp(luzObjetivo.color, k);
    sol.intensity += (luzObjetivo.intensidad - sol.intensity) * k;
    renderer.toneMappingExposure += (luzObjetivo.exposicion - renderer.toneMappingExposure) * k;
    cielo.material.color.lerp(luzObjetivo.cielo, k);
    escena.fog.color.lerp(luzObjetivo.niebla, k);
    hemi.intensity += (luzObjetivo.hemi - hemi.intensity) * k;
    discoSolar.material.opacity += (luzObjetivo.brillo - discoSolar.material.opacity) * k;
    if (tr.luz === "ocaso") moverBandada(rc.t);
    else bandada.visible = false;
    if (Math.abs(exagerar - rc.exagObjetivo) > 0.05) {
      exagerar += (rc.exagObjetivo - exagerar) * (1 - Math.exp(-dt * 1.8));
      deformar();
    }
    if (document.activeElement !== cineBarra) cineBarra.value = rc.t / rc.total * 1000;
    const segTotal = Math.floor(rc.t);
    document.getElementById("cine-tiempo").textContent = `${Math.floor(segTotal / 60)}:${String(segTotal % 60).padStart(2, "0")} / ${Math.floor(rc.total / 60)}:${String(Math.floor(rc.total) % 60).padStart(2, "0")}`;
    return true;
  }

  function dibujar(dtReal = 0.016) {
    if (!param) return;
    if (recorrido3d && avanzarRecorrido(Math.min(dtReal, 0.2))) {
      renderer.render(escena, camara);
      const tramoActual = recorrido3d.tramos[recorrido3d.indice];
      if (tramoActual.rotulos || tramoActual.conCotas) pintarRotulos();
      return;
    }
    const f = 1 - Math.exp(-dtReal * 4.5); // Mismo tiempo de transición a cualquier velocidad de imagen.
    camaraActual.obj.lerp(camaraDeseada.obj, f);
    camaraActual.radio += (camaraDeseada.radio - camaraActual.radio) * f;
    camaraActual.azimut += (camaraDeseada.azimut - camaraActual.azimut) * f;
    camaraActual.elevacion += (camaraDeseada.elevacion - camaraActual.elevacion) * f;
    const c = camaraActual;
    camara.position.set(
      c.obj.x + c.radio * Math.cos(c.elevacion) * Math.sin(c.azimut),
      Math.max(0.25, c.obj.y + c.radio * Math.sin(c.elevacion)),
      c.obj.z + c.radio * Math.cos(c.elevacion) * Math.cos(c.azimut)
    );
    camara.lookAt(c.obj);
    renderer.render(escena, camara);
    pintarRotulos();
  }

  function bucle(tiempo) {
    requestAnimationFrame(bucle);
    const dtReal = (tiempo - ultimoTiempo) / 1000;
    const dt = Math.min(dtReal, 0.05);
    ultimoTiempo = tiempo;
    if (!visible || !param) return;
    M.fallo.emissiveIntensity = 0.55 + 0.45 * Math.sin(tiempo * 0.006);
    if (recorrido3d ? !recorrido3d.pausa : !pausado) moverPiedras(dt * (recorrido3d ? Math.min(recorrido3d.velocidad, 2) : 1));
    dibujar(dtReal);
  }
  requestAnimationFrame(bucle);

  function actualizar(e, r, formato, datosColor) {
    const fallaAlgo = r.checks.some(c => !c.ok);
    if (!fallaAlgo) verSolucion = false;
    sobrecargaActual = !verSolucion && r.Qcap !== undefined && r.Qcap < r.Q ? Math.min(r.Q / r.Qcap, 2.2) : 1;
    const clave = JSON.stringify([r.B, e.estacion, e.lambda, e.talud, e.H, e.L, e.r, e.lsup, e.linf, e.tamano, sobrecargaActual.toFixed(2)]);
    if (clave !== claveModelo) construir(e, r, clave);
    velocidad = r.v;
    tens = {
      g: 9.81, cos: r.cosDelta, qSup: e.qb + r.qg, qInf: e.qb,
      T1: r.T1, T2: r.T2, Tcola: r.TcolaCalculada,
      Tsup: e.modoLocal === "manual" ? e.Tsup : null,
      Tinf: e.modoLocal === "manual" ? e.Tinf : null,
    };
    const falla = prefijo => r.checks.some(c => c.texto.startsWith(prefijo) && !c.ok);
    const patinaba = r.relacion > r.kEuler;
    const flechaSupFalla = falla("Flecha del portante") || falla("Flecha:");
    const flechaInfFalla = falla("Flecha del retorno") || falla("Flecha:");
    patina = patinaba && !verSolucion;
    tens.falloSup = flechaSupFalla && !verSolucion;
    tens.falloInf = flechaInfFalla && !verSolucion;
    if (verSolucion && flechaSupFalla) tens.Tsup = r.TsupMin;
    if (verSolucion && flechaInfFalla) tens.Tinf = r.TinfMin;
    tens.falloFlecha = tens.falloSup || tens.falloInf;
    tens.derrama = !verSolucion && (falla("Capacidad") || falla("Velocidad"));
    if (!recorrido3d) exagerar = exageracionBase();
    M.tambor.emissive.setHex(patina ? 0xb91c1c : 0x000000);
    M.tambor.emissiveIntensity = patina ? 0.4 : 0;
    const avisoFallos = document.getElementById("cinta3d-aviso");
    const mensajes = [];
    if (patina) mensajes.push(`¡La banda patina! T₁/T₂ = ${formato(r.relacion, 3)} > e^μφ = ${formato(r.kEuler, 3)}. Mira «Tambor motriz».`);
    if (tens.falloFlecha) mensajes.push("Flecha excesiva: el ramal en rojo se hunde demasiado (dibujo × 20). Mira «Flecha».");
    if (!verSolucion && falla("Capacidad")) mensajes.push(`Falta capacidad: ${formato(r.Qcap, 1)} t/h de ${formato(r.Q, 1)} t/h. El material rebosa.`);
    if (!verSolucion && falla("Velocidad")) mensajes.push("Velocidad excesiva: el material se derrama.");
    if (falla("Tamaño de bulto")) mensajes.push("Bultos demasiado grandes para esta banda.");
    botonSolucion.classList.toggle("oculto", !fallaAlgo);
    botonSolucion.classList.toggle("activa", verSolucion);
    botonSolucion.textContent = verSolucion ? "🔧 Quitar solución" : "🔧 Ver solución";
    avisoFallos.classList.toggle("oculto", mensajes.length === 0);
    avisoFallos.innerHTML = mensajes.join("<br>");
    datosTexto.formato = formato;
    datosTexto.r = r;
    datosTexto.e = e;
    r.flechaMaxima = e.hmax / 100;
    deformar();
    pintarTensiones();
    aplicarMapa();
    // Si φ > 180°, el tambor de reenvío forma parte de la instalación calculada.
    const reenvioActivo = e.thetaDeg > 180 || (verSolucion && patinaba);
    const phiSolucion = e.thetaDeg > 180 ? e.thetaDeg : (reenvioActivo ? Math.ceil(r.thetaMinDeg / 5) * 5 : null);
    const botonR = document.getElementById("cinta3d-reenvio");
    botonR.classList.toggle("activa", e.thetaDeg > 180);
    botonR.textContent = e.thetaDeg > 180 ? "⚙ Quitar tambor de reenvío" : "⚙ Añadir tambor de reenvío";
    pintarPanelReenvio(e, r, formato);
    construirFuerzas(phiSolucion ? { ...e, thetaDeg: Math.min(phiSolucion, 359) } : e, r);
    construirSolucion(e, r, phiSolucion, flechaSupFalla || flechaInfFalla);
    construirCotas(e, r);
    const color = COLORES[e.material] !== undefined ? COLORES[e.material] : 0x8c8378;
    M.roca.color.setHex(color);
    M.lecho.color.setHex(color).multiplyScalar(0.72);

    rotulos.innerHTML = "";
    textosRotulos = {};
    const anadir = (clave2, texto, clase, vista = "") => {
      const nodo = document.createElement("span");
      nodo.className = `rotulo ${clase}`;
      nodo.dataset.vista = vista;
      nodo.innerHTML = texto;
      rotulos.appendChild(nodo);
      textosRotulos[clave2] = nodo;
    };
    anadir("T1", `T₁ = ${formato(r.T1, 0)} N`, "tenso");
    anadir("T2", `T₂ = ${formato(r.T2, 0)} N`, "flojo");
    anadir("motor", `P = ${formato(r.Peje / 1000, 2)} kW · M = ${formato(r.M, 0)} N·m · n = ${formato(r.n, 1)} rpm`, "");
    anadir("Fu", `F<sub>u</sub> = ${formato(r.Fu, 0)} N`, "fu", "tamborGeneral");
    anadir("v", `v = ${formato(r.v, 2)} m/s · q<sub>g</sub> = ${formato(r.qg, 1)} kg/m`, "");
    const phiTexto = phiSolucion ? `φ = ${formato(phiSolucion, 0)}° con reenvío` : `φ = ${formato(e.thetaDeg, 0)}° · e^μφ = ${formato(r.kEuler, 3)}`;
    anadir("phi", phiTexto, phiSolucion ? "solucion" : "", "tambor");
    anadir("cotaL", e.L > p3dLongitud() ? `L = ${formato(e.L, 1)} m (tramo de ${formato(p3dLongitud(), 0)} m)` : `L = ${formato(e.L, 1)} m`, "cota", "cotas");
    if (e.H) {
      anadir("cotaH", `H = ${formato(e.H, 1)} m`, "cota", "cotas");
      anadir("cotaDelta", `δ = ${formato(r.deltaDeg, 2)}°`, "cota", "cotas");
    }
    anadir("cotaAncho", `B = ${formato(r.B, 0)} mm`, "cota", "cotas");
    anadir("cotaLsup", `l portante = ${formato(e.lsup, 2)} m`, "cota", "cotas");
    anadir("cotaLinf", `l retorno = ${formato(e.linf, 2)} m`, "cota", "cotas");
    anadir("cotaV", `v = ${formato(r.v, 2)} m/s`, "solucion", "cotas");
    anadir("cotaQ", `Q = ${formato(r.Q, 1)} t/h`, "cota", "cotas");
    if (verSolucion) {
      const textos = [];
      if (reenvioActivo) {
        const kNuevo = Math.exp(e.mu * Math.min(phiSolucion, 359) * Math.PI / 180);
        textos.push(`Tambor de reenvío: φ = ${formato(phiSolucion, 0)}° · e^μφ = ${formato(kNuevo, 3)} · T₁/T₂ = ${formato(r.relacion, 3)}${r.relacion <= kNuevo ? " ✓" : " ✗"}${phiSolucion > 260 ? " (dibujo limitado a 260°)" : ""}`);
      }
      if (flechaSupFalla) textos.push(`Portante: T ≥ ${formato(r.TsupMin, 0)} N`);
      if (flechaInfFalla) textos.push(`Retorno: T ≥ ${formato(r.TinfMin, 0)} N`);
      if (falla("Capacidad") || falla("Velocidad") || falla("Tamaño de bulto")) textos.push("Banda y velocidad según «Cómo redimensionar»");
      anadir("sol", `Solución en el dibujo: ${textos.join(" · ")}`, "solucion");
    }
    if (r.seccion) {
      anadir("S1", `S₁ = ${formato(r.seccion.S1 * 10000, 1)} cm²`, "", "seccion");
      if (r.seccion.S2 > 0) anadir("S2", `S₂ = ${formato(r.seccion.S2 * 10000, 1)} cm²`, "", "seccion");
      anadir("cotaB", `S = ${formato(r.seccion.S * 10000, 1)} cm² · B = ${formato(r.B, 0)} mm · b = ${formato(r.seccion.b * 1000, 0)} mm · λ = ${formato(Number(e.estacion) === 1 ? 0 : e.lambda, 0)}° · θ = ${formato(e.talud, 0)}°`, "", "seccion");
    } else {
      anadir("cotaB", "Con q<sub>g</sub> como dato no hay sección calculada", "", "seccion");
    }
    anadir("flecha", "", "", "flecha");
    pintarRotulosTexto();
    pintarLeyenda();
    moverPiedras(0); // Coloca las piedras aunque la página aún no haya dibujado ningún fotograma.
    if (!lente.classList.contains("oculto")) dibujarLente();
    pintarPie();
  }

  function pintarPie() {
    const e = datosTexto.e;
    const formato = datosTexto.formato;
    if (!e) return;
    const aviso = document.getElementById("cinta3d-pie");
    aviso.textContent = e.L > 24
      ? `Se dibujan 24 m de los ${formato(e.L, 0)} m de la cinta. La anchura, los rodillos, los ángulos, la inclinación y la velocidad son los del cálculo.`
      : e.L < 8
        ? `Se dibujan 8 m para que se vea la instalación (L = ${formato(e.L, 0)} m). La anchura, los rodillos, los ángulos, la inclinación y la velocidad son los del cálculo.`
        : "La anchura, los rodillos, los ángulos, la inclinación, la separación entre rodillos y la velocidad son los del cálculo.";
    if (e.thetaDeg > 180) aviso.textContent += " El tambor de reenvío está en el cálculo: φ se ha cambiado en la calculadora.";
    if (e.thetaDeg > 260) aviso.textContent += " El dibujo del reenvío llega como máximo a 260°.";
    if (verSolucion) aviso.textContent += " Solución solo en el dibujo: para calcularla, pulsa «Aplicar» en «Cómo redimensionar».";
    if (!verMaterial) aviso.textContent += " Sin material en el dibujo: las cifras siguen siendo las de la cinta cargada.";
    if (pausado) dibujar();
  }

  function aviso(texto) {
    const nodo = document.getElementById("cinta3d-aviso");
    nodo.textContent = texto;
    nodo.classList.remove("oculto");
  }

  return { paso(dt) { moverPiedras(dt); }, bandada, discoSolar, camara, actualizar, dibujar, renderer, aviso, irARecorrido(t) { if (recorrido3d) recorrido3d.t = t; } };
})();
