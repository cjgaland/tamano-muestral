// ============================================================
//  app.js — UI y estado · Tamaño Muestral
//  Las fórmulas viven en stats.js (funciones puras). Aquí solo: definición
//  de calculadoras (campos, ayudas, ejemplos, desarrollo paso a paso), render y eventos.
// ============================================================
(function () {
  "use strict";
  const S = window.Stats;

  // ---------- Versión y novedades ----------
  // Al publicar cambios: añadir una entrada AL PRINCIPIO de NOVEDADES, poner su versión en los ?v= de index.html, en
  // APP_VERSION y subir CACHE_NAME en sw.js. Formato de versión: AAAA.NN.
  const APP_VERSION = "2026.22";
  const NOVEDADES = [
    { version: "2026.22", fecha: "Octubre 2026", titulo: "Nueva app hermana: Lectura Crítica", cambios: [
      "Enlace a la nueva app hermana Lectura Crítica en la portada y en «Acerca de»: lee críticamente un artículo paso a paso (plantillas de CASPe con preguntas propias, calculadoras y un veredicto con semáforo) antes de cambiar la práctica."] },
    { version: "2026.21", fecha: "Octubre 2026", titulo: "Nueva herramienta de apoyo: Legibilidad", cambios: [
      "En «Acerca de», el grupo «Herramientas de apoyo» suma Legibilidad: mide con el índice de Flesch-Szigriszt y la escala INFLESZ si un texto para pacientes se entiende y te dice qué cambiar."] },
    { version: "2026.20", fecha: "Octubre 2026", titulo: "La copia sin conexión de las otras apps ya no se borra", cambios: [
      "Arreglado un fallo: al actualizarse esta app se borraba la copia sin conexión de las demás apps del ecosistema (y al revés). Ahora cada app solo limpia la suya, así que todas siguen funcionando sin conexión."] },
    { version: "2026.19", fecha: "Octubre 2026", titulo: "Herramientas de apoyo y portal de las apps", cambios: [
      "En «Acerca de», nuevo grupo «Herramientas de apoyo»: el Anonimizador RGPD (seudonimiza o anonimiza una hoja de cálculo sin que los datos salgan de tu navegador) y el Normalizador Bibliográfico (pon tus referencias en Vancouver, APA y otros estilos).",
      "Y un enlace al portal cjgaland.github.io, la página que reúne todas las apps y explica cómo encajan."] },
    { version: "2026.18", fecha: "Octubre 2026", titulo: "Nueva app hermana: Rondas de Seguridad", cambios: [
      "Nuevo acceso a la app hermana «Rondas de Seguridad», en la portada y en «Acerca de»: programa y haz las rondas de seguridad de una unidad, a pie de cama, y descubre lo que falla una y otra vez."] },
    { version: "2026.17", fecha: "Octubre 2026", titulo: "Nueva app hermana: Mapa de Riesgos", cambios: [
      "Nuevo acceso a la app hermana «Mapa de Riesgos», en la portada y en «Acerca de»: elabora paso a paso el mapa de riesgos de un proceso, del flujograma y el AMFE al mapa con los riesgos coloreados por su IPR y el documento final."] },
    { version: "2026.16", fecha: "Octubre 2026", titulo: "Nuevas apps hermanas: Flujograma y DAFO · CAME", cambios: [
      "Nuevos accesos a las apps hermanas «Flujograma» (escribe los pasos de un proceso y la app dibuja el diagrama) y «DAFO · CAME» (análisis DAFO de una unidad y plan de acción), en la portada y en «Acerca de»."] },
    { version: "2026.15", fecha: "Octubre 2026", titulo: "Nueva app hermana: AMFE", cambios: [
      "Nuevo acceso a la app hermana «AMFE» (Análisis Modal de Fallos y Efectos), en la portada y en «Acerca de»: para analizar los fallos de un proceso paso a paso, puntuarlos con G·O·D e IPR y decidir cuáles atajar primero."] },
    { version: "2026.14", fecha: "Octubre 2026", titulo: "Nueva app hermana: Auditorías", cambios: [
      "Nuevo acceso a la app hermana «Auditorías» (en la portada y en «Acerca de»): para planificar, realizar, informar y hacer el seguimiento de una auditoría completa, con el cálculo de la muestra y el LQAS integrados en su diseño."] },
    { version: "2026.13", fecha: "Octubre 2026", titulo: "Enlace a la app Indicadores", cambios: [
      "Nuevo acceso a la app hermana «Indicadores» (en la portada y en «Acerca de»): para crear, definir y comprobar indicadores de calidad paso a paso. Desde ella se abre esta app con los datos del indicador ya puestos."] },
    { version: "2026.12", fecha: "Octubre 2026", titulo: "Glosario, conglomerados y RR/OR", cambios: [
      "Glosario con 50 términos explicados en lenguaje llano, con buscador y enlaces a cada calculadora (en el menú y en la portada).",
      "Nueva calculadora de muestreo por conglomerados: cuánta muestra más hace falta al sortear plantas o centros y revisar varias historias en cada uno (efecto de diseño), y cuántos sortear.",
      "«2 porcentajes»: el efecto esperado se puede dar también como riesgo relativo (RR) u odds ratio (OR), y siempre se muestra su equivalencia."] },
    { version: "2026.11", fecha: "Octubre 2026", titulo: "Analizar resultados, kappa y estratos", cambios: [
      "«Ya tengo los resultados»: en LQAS escribe cuántas historias cumplen y la app te da el semáforo verde o rojo, la frase para el informe y lo que no debes escribir. Si los resultados ya deciden antes de terminar, te avisa de que puedes parar.",
      "En «Un porcentaje», el resultado con su horquilla de error (método de Wilson) y, si quieres, la comparación con un estándar.",
      "Nueva calculadora de concordancia entre auditores (kappa de Cohen) para pilotar indicadores, con la paradoja del kappa explicada.",
      "Nueva calculadora para repartir la muestra por estratos (turnos, unidades…) y sortear los casos dentro de cada uno.",
      "«Compartir enlace»: crea un enlace que abre la calculadora con los mismos datos (ideal para enviar ejercicios a los alumnos).",
      "Instrucciones para instalar la app en el móvil o el ordenador, en «Acerca de»."] },
    { version: "2026.10", fecha: "Octubre 2026", titulo: "Ajuste en la autoría", cambios: [
      "La autoría muestra solo el área común (Área de Gestión Sanitaria Sur de Córdoba), sin centro de trabajo. Los autores aparecen por orden alfabético."] },
    { version: "2026.09", fecha: "Octubre 2026", titulo: "Autoría", cambios: [
      "Autoría completa en el pie, en «Acerca de» y en el informe: Carlos J. Galán Doval (Médico de Familia, Técnico en Calidad y Seguridad del Paciente) y Rafael J. Romero de Castilla Gil (Médico de Familia, Responsable del Área de Calidad y Seguridad del Paciente), del Área de Gestión Sanitaria Sur de Córdoba."] },
    { version: "2026.08", fecha: "Octubre 2026", titulo: "Ver informe y guardar en el iPhone", cambios: [
      "Nuevo botón «Ver informe»: muestra en pantalla el informe tal y como saldrá impreso.",
      "«Guardar / imprimir» funciona ahora en el iPhone y el iPad: crea un PDF y abre el menú Compartir (Imprimir, Guardar en Archivos, Mail, WhatsApp…).",
      "En el ordenador y en Android, «Guardar / imprimir» abre la ventana de impresión como antes (desde ahí también se guarda en PDF)."] },
    { version: "2026.07", fecha: "Octubre 2026", titulo: "Coautoría", cambios: [
      "Rafael J. Romero de Castilla Gil, Médico de Familia, figura como coautor de la aplicación."] },
    { version: "2026.06", fecha: "Octubre 2026", titulo: "Tabla de consulta exacta para LQAS", cambios: [
      "En LQAS, nueva «Tabla de consulta exacta»: la misma forma que las tablas de Lemeshow del curso (fila = umbral, columna = estándar, n / c), pero con planes que garantizan de verdad α = 5 % y β = 20 % o 10 %.",
      "Toca una casilla y el plan se carga en la calculadora.",
      "El campo N se llama ahora «Tamaño del lote (población)», y su ayuda explica por qué un lote grande apenas cambia el número de historias."] },
    { version: "2026.05", fecha: "Octubre 2026", titulo: "Publicación en la web", cambios: [
      "Disponible en https://cjgaland.github.io/tamano-muestral/ e instalable en el móvil como aplicación.",
      "Corregida una recarga inesperada de la página en la primera visita."] },
    { version: "2026.04", fecha: "Octubre 2026", titulo: "Indicador compuesto y «Ponte a prueba»", cambios: [
      "Nueva calculadora: indicador compuesto de porcentaje simple (Σ cumplimientos ÷ Σ oportunidades), con desglose por criterio y avisos cuando el titular esconde una mala noticia.",
      "En el inicio: los siete tipos de indicadores, qué hace bueno a un indicador y cuatro preguntas para ponerte a prueba.",
      "LQAS: «la idea en una imagen», tabla de los planes de Lemeshow frente al cálculo exacto y explicación de la regla del 10 %.",
      "Una media: por qué la media puede maquillar.",
      "Contenidos adaptados de la unidad temática de muestreo, LQAS e indicadores del curso de Auditorías."] },
    { version: "2026.03", fecha: "Octubre 2026", titulo: "Explicado fácil", cambios: [
      "Cada calculadora tiene una «Idea clave» y un apartado «Explicado fácil» con analogías y un ejemplo resuelto, en la línea del tema 4 del curso de Auditorías.",
      "LQAS habla el mismo idioma que el curso: estándar, umbral, número de decisión c, α = falsa alarma y β = fuego sin alarma (convención de Saturno).",
      "LQAS muestra un semáforo con la regla (verde / rojo) y explica cómo leer la «puerta de aceptación».",
      "Nota sobre por qué los resultados no coinciden con las tablas de Lemeshow (son aproximadas).",
      "Nuevo: sortear qué casos revisar (aleatorio simple o sistemático) cuando conoces N.",
      "En el inicio: la cucharada de sopa, ¿estimar o decidir? y cómo elegir los casos al azar."] },
    { version: "2026.02", fecha: "Octubre 2026", titulo: "Mejor en el móvil", cambios: [
      "La página ya no se sale por la derecha en pantallas pequeñas y las fórmulas se ajustan al ancho.",
      "Curva característica operativa más legible: etiquetas sin solapes y tamaño adecuado en el ordenador.",
      "Avisos (⚠) separados de las notas informativas (ℹ).",
      "Dos medias: nota sobre por qué R (power.t.test) da uno o dos casos más.",
      "Historial de versiones y aviso de «Nueva versión disponible»."] },
    { version: "2026.01", fecha: "Octubre 2026", titulo: "Primera versión", cambios: [
      "Cinco calculadoras: una proporción, una media, dos proporciones, dos medias y LQAS.",
      "Guía «¿Qué calculadora necesito?», ayudas en cada parámetro, ejemplos, desarrollo paso a paso e informe imprimible.",
      "LQAS con población conocida (hipergeométrica) y curva característica operativa."] }
  ];

  // ---------- Utilidades de formato ----------
  const nf = (x, d = 2) => Number.isFinite(x) ? x.toLocaleString("es-ES", { maximumFractionDigits: d, minimumFractionDigits: 0 }) : "—";
  const nfix = (x, d) => Number.isFinite(x) ? x.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
  const pc = (x, d = 2) => nf(x * 100, d) + "\u00a0%";               // proporción -> "50 %"
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function parseNum(str) {
    if (str === undefined || str === null) return null;
    const t = String(str).trim().replace(",", ".");
    if (t === "") return null;
    return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : NaN;
  }

  // ---------- Validación ----------
  // Rango numérico obligatorio: lo/hi con extremos incluidos o no
  function R(E, v, id, label, lo, hi, loInc, hiInc) {
    const x = v[id];
    if (x === null) { E.push({ f: id, m: `Falta «${label}».`, missing: true }); return false; }
    if (Number.isNaN(x)) { E.push({ f: id, m: `«${label}» no es un número válido.` }); return false; }
    const okLo = loInc ? x >= lo : x > lo, okHi = hiInc ? x <= hi : x < hi;
    if (!okLo || !okHi) { E.push({ f: id, m: `«${label}» debe ser ${loInc ? "≥" : ">"} ${nf(lo)} y ${hiInc ? "≤" : "<"} ${nf(hi)}.` }); return false; }
    return true;
  }
  // Población N opcional: entero >= min
  function Npop(E, v, min) {
    const x = v.N;
    if (x === null) return;
    if (Number.isNaN(x) || x < min || !Number.isInteger(x)) E.push({ f: "N", m: `El tamaño de la población N debe ser un entero ≥ ${min} (o déjalo vacío si no lo conoces).` });
  }

  // ---------- Campos comunes ----------
  const F_LOSS = { id: "loss", label: "Pérdidas / no respuesta previstas", unit: "%", def: "0", quick: [0, 10, 15, 20], opt: true,
    help: "Porcentaje de casos que prevés perder (historia ilegible o no localizable, paciente que no responde, dato ausente…). El tamaño se aumenta para compensarlo: n_final = n / (1 − pérdidas), redondeado hacia arriba. Si no esperas pérdidas, deja 0." };
  const F_ALPHA = { id: "alpha", label: "Nivel de significación α", unit: "%", def: "5", quick: [1, 5, 10],
    help: "Riesgo de falsa alarma: probabilidad máxima que aceptas de dar por «diferente» algo que en realidad es igual (falso positivo, error tipo I). Lo habitual es 5 %." };
  const F_SIDES = { id: "sides", label: "Contraste", type: "seg", def: "2", options: [["2", "Bilateral"], ["1", "Unilateral"]],
    help: "Bilateral: te interesa detectar diferencias en cualquier sentido (lo habitual y lo más prudente). Unilateral: solo te interesa un sentido (p. ej. solo mejora), y debe estar justificado de antemano; necesita menos muestra." };
  const F_POWER = { id: "power", label: "Potencia (1 − β)", unit: "%", def: "80", quick: [80, 90, 95],
    help: "Probabilidad de darte cuenta de la diferencia si de verdad existe (1 menos el error tipo II). Con 80 %, de cada 5 diferencias reales detectarías 4. 80 % es el mínimo habitual; 90 % si quieres más seguridad." };
  const F_K = { id: "k", label: "Razón de tamaños k = n₂ / n₁", def: "1", quick: [1, 2, 3],
    help: "1 si los dos grupos tienen el mismo tamaño (lo más eficiente). Si el grupo 2 es el doble que el 1, k = 2." };
  const F_NPOP = { id: "N", label: "Tamaño de la población N", unit: "casos", opt: true, def: "", ph: "opcional",
    help: "Número total de unidades de las que extraerás la muestra (p. ej. historias del periodo). Si lo conoces y la muestra es una fracción apreciable (> 5 %), se aplica la corrección por población finita y necesitas menos casos. Si no lo conoces o es muy grande, déjalo vacío." };
  const F_CONF = { id: "conf", label: "Nivel de confianza (1 − α)", unit: "%", def: "95", quick: [90, 95, 99],
    help: "Seguridad con la que quieres que el intervalo calculado contenga el valor real. 95 % es el estándar; 99 % exige más muestra." };

  // Tabla de casos según N y el margen (95 %, p = 50 %), calculada con Stats (no copiada de un libro)
  function tablaRapida() {
    const Ns = [50, 100, 200, 300, 500, 1000, 2000, 5000, 0], es = [0.05, 0.10, 0.15, 0.20];
    const rows = Ns.map(N => `<tr><td>${N ? nf(N, 0) : "Más de 10.000"}</td>${es.map(e => `<td>${S.sampleProportion({ conf: 0.95, e, p: 0.5, N }).n}</td>`).join("")}</tr>`).join("");
    return `<div class="table-wrap"><table class="mini"><thead><tr><th>Universo (N)</th>${es.map(e => `<th>± ${nf(e * 100, 0)} %</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div><p class="step-note">Casos a revisar para estimar un porcentaje, ya redondeados hacia arriba.</p>`;
  }

  // Planes de las tablas de Lemeshow del curso frente al plan exacto (convención del curso: α en el estándar)
  function tablaLemeshow() {
    const planes = [[85, 60, 20, 16, 11], [85, 60, 10, 24, 17], [90, 75, 20, 33, 26], [90, 75, 10, 49, 40], [95, 80, 20, 22, 19], [95, 80, 10, 34, 30]];
    const rows = planes.map(([U, L, b, n, c]) => {
      const bReal = S.lqasPAccept(n, c, 0, L / 100);
      const r = S.lqas({ pU: U / 100, pL: L / 100, alpha: b / 100, beta: 0.05, N: 0 });
      return `<tr><td>${U} % / ${L} %</td><td>${b} %</td><td>${n} / ${c}</td><td><b>${nf(bReal * 100, 0)} %</b></td><td>${r.n} / ${r.d}</td></tr>`;
    }).join("");
    return `<div class="table-wrap"><table class="mini"><thead><tr><th>Estándar / umbral</th><th>β pedido</th><th>Tabla n / c</th><th>β real de la tabla</th><th>App n / c</th></tr></thead><tbody>${rows}</tbody></table></div><p class="step-note">Todas con α = 5 %. β real calculado de forma exacta (binomial).</p>`;
  }

  // Tabla de consulta exacta con la forma de las de Lemeshow (α 5 %, β 20 % o 10 %, binomial).
  // Se calcula al abrirla (unos cientos de ms) y se guarda en memoria.
  const tablaExactaCache = {};
  const UMBRALES = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85], ESTANDARES = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  function tablaExactaHtml(b, selU, selL) {
    if (!tablaExactaCache[b]) {
      tablaExactaCache[b] = {};
      UMBRALES.forEach(L => ESTANDARES.forEach(U => {
        if (L >= U) return;
        // Convención del curso: α (5 %) en el estándar → beta de Stats; β en el umbral → alpha de Stats
        const r = S.lqas({ pU: U / 100, pL: L / 100, alpha: b / 100, beta: 0.05, N: 0 });
        tablaExactaCache[b][L + "-" + U] = r.found ? [r.n, r.d] : null;
      }));
    }
    const T = tablaExactaCache[b];
    const head = `<tr><th class="te-esq">Umbral ↓ / Estándar →</th>${ESTANDARES.map(U => `<th>${U} %</th>`).join("")}</tr>`;
    const body = UMBRALES.map(L => `<tr><th>${L} %</th>${ESTANDARES.map(U => {
      if (L >= U) return `<td class="te-vacia">—</td>`;
      const v = T[L + "-" + U];
      if (!v) return `<td class="te-vacia">&gt; 1000</td>`;
      const sel = U === selU && L === selL ? " te-sel" : "";
      return `<td class="${sel.trim()}"><button type="button" class="te-celda" data-act="tabla-celda" data-u="${U}" data-l="${L}" data-b="${b}" aria-label="Estándar ${U} %, umbral ${L} %: revisar ${v[0]}, c = ${v[1]}">${v[0]} / ${v[1]}</button></td>`;
    }).join("")}</tr>`).join("");
    return `<div class="table-wrap"><table class="mini tabla-te"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }
  let tablaBeta = 20;
  function pintarTablaExacta() {
    const out = $("#tabla-exacta-out"); if (!out || !current || current.id !== "lqas") return;
    $$("[data-act='tabla-beta']").forEach(x => x.classList.toggle("active", Number(x.dataset.b) === tablaBeta));
    const st = state.lqas, U = parseNum(st.pU), L = parseNum(st.pL);
    const marcar = parseNum(st.alpha) === 5 && parseNum(st.beta) === tablaBeta;
    const pinta = () => { out.innerHTML = tablaExactaHtml(tablaBeta, marcar ? U : null, marcar ? L : null); };
    if (tablaExactaCache[tablaBeta]) pinta();
    else { out.innerHTML = `<p class="step-note">Calculando…</p>`; setTimeout(pinta, 30); }
  }

  // ---------- «Ya tengo los resultados»: analizar la muestra ya revisada ----------
  // Cada calculadora con `analisis` declara sus campos y una función que devuelve el HTML del análisis
  // a partir del estado y del último resultado calculado (`c.ultimo`, con el plan n, c…).
  function analisisHtml(c) {
    const st = state[c.id], A = c.analisis;
    return `<section class="card analisis" id="analisis" aria-label="Analizar los resultados de la auditoría">
      <h2 class="an-titulo">Ya tengo los resultados</h2>
      <p class="an-intro no-print">${A.intro}</p>
      <div class="an-campos no-print">${A.campos.map(f => `<label class="an-campo"><span>${f.l}</span><input class="an-in" data-k="${f.k}" type="text" inputmode="numeric" autocomplete="off" placeholder="${esc(f.ph || "")}" value="${esc(st["an_" + f.k] || "")}" /></label>`).join("")}</div>
      <div id="analisis-out" aria-live="polite"></div></section>`;
  }
  function pintarAnalisis() {
    const c = current, out = $("#analisis-out"); if (!c || !c.analisis || !out) return;
    const st = state[c.id], r = c.analisis.calcula(st, c.ultimo);
    out.innerHTML = r.html;
    $("#analisis").classList.toggle("an-vacio", !r.lleno);
    (c.analisis.campos || []).forEach(f => { if (f.phDe) { const i = $(`.an-in[data-k="${f.k}"]`); if (i) i.placeholder = f.phDe(c.ultimo); } });
  }
  const anNum = s => { const x = parseNum(s); return x === null ? null : x; };
  const anEntero = x => x !== null && Number.isInteger(x) && x >= 0;
  const anFrase = t => `<div class="an-frase"><span class="box-tag">Qué puedes escribir en el informe</span><p>«${t}»</p></div>`;

  const ANALISIS_LQAS = {
    intro: "Cuando hayas revisado las historias sorteadas, escribe cuántas cumplen el criterio. La app aplica la regla y te dice qué puedes (y qué no) escribir en el informe.",
    campos: [
      { k: "rev", l: "Historias revisadas", phDe: u => u && u.plan ? String(u.plan.n) : "" },
      { k: "cum", l: "Cuántas cumplen", ph: "p. ej. 18" }
    ],
    calcula(st, u) {
      if (!u || !u.plan) return { html: `<p class="step-note">Primero completa los parámetros de arriba para tener el plan (n y c).</p>`, lleno: false };
      const { n, c } = u.plan, cum = anNum(st.an_cum), rev = anNum(st.an_rev) === null ? n : anNum(st.an_rev);
      if (cum === null) return { html: `<p class="step-note">Plan: revisar <b>${n}</b> historias; verde si cumplen <b>${c}</b> o más.</p>`, lleno: false };
      if (!anEntero(cum) || !anEntero(rev) || rev === 0) return { html: `<div class="error-box">Escribe números enteros (0, 1, 2…).</div>`, lleno: false };
      if (cum > rev) return { html: `<div class="error-box">No pueden cumplir más historias (${cum}) de las revisadas (${rev}).</div>`, lleno: false };
      const fallos = rev - cum;
      let verde = null, aviso = "";
      if (rev === n) verde = cum >= c;
      else if (rev < n) {
        if (cum >= c) { verde = true; aviso = `Aún faltan ${n - rev} historias, pero ya hay ${cum} que cumplen (la regla pide ${c}): pase lo que pase con las restantes, el resultado será verde. Puedes parar aquí.`; }
        else if (fallos > n - c) { verde = false; aviso = `Aún faltan ${n - rev} historias, pero ya hay ${fallos} que no cumplen (como mucho se toleran ${n - c}): aunque todas las restantes cumplieran, el resultado sería rojo. Puedes parar aquí.`; }
        else return { html: `<div class="warn">⚠ Faltan <b>${n - rev}</b> historias por revisar. La regla (c = ${c}) solo vale con las ${n} del plan: termina la revisión antes de decidir.</div>`, lleno: true };
      } else return { html: `<div class="warn">⚠ El plan es revisar <b>${n}</b> historias y has escrito ${rev}. Aplica la regla solo a las ${n} primeras del sorteo (las demás pueden servir de reserva por si alguna no es válida).</div>`, lleno: true };
      const pU = nf(anNum(st.pU)), w = S.wilson(cum, rev, 0.95);
      const sem = verde
        ? `<div class="an-sem an-sem--verde"><span class="sem-luz" aria-hidden="true"></span><div><b>VERDE · sin evidencia de problema</b><span>${cum} de ${rev} cumplen; la regla pide al menos ${c} de ${n}.</span></div></div>`
        : `<div class="an-sem an-sem--rojo"><span class="sem-luz" aria-hidden="true"></span><div><b>ROJO · hay que investigar</b><span>${cum} de ${rev} cumplen; la regla pide al menos ${c} de ${n}.</span></div></div>`;
      const frase = verde
        ? `Con una muestra aleatoria de ${n} historias (LQAS, α ${nf(anNum(st.alpha))} %, β ${nf(anNum(st.beta))} %), no hay evidencia de que el cumplimiento esté por debajo del estándar del ${pU} %.`
        : `Con una muestra aleatoria de ${n} historias (LQAS, α ${nf(anNum(st.alpha))} %, β ${nf(anNum(st.beta))} %), el cumplimiento podría estar por debajo del estándar del ${pU} %: se recomienda investigar las causas y planificar mejoras.`;
      return { lleno: true, html: sem + (aviso ? `<div class="note">ℹ ${aviso}</div>` : "") + anFrase(frase) +
        `<div class="box box--trampa"><span class="box-tag">Lo que no debes escribir</span><p>«El cumplimiento es del ${nf(cum / rev * 100, 0)} %». Es solo el dato de la muestra: con ${rev} historias, el cumplimiento real podría estar entre el ${nf(w.lo * 100, 0)} % y el ${nf(w.hi * 100, 0)} %. LQAS decide; no mide.</p></div>` +
        (verde ? "" : `<p class="step-note">Rojo no es una sentencia: es un aviso para analizar qué está fallando (formación, circuito, registro…) y volver a auditar tras las mejoras.</p>`) };
    }
  };

  const ANALISIS_PROP = {
    intro: "Cuando hayas revisado la muestra, escribe cuántos casos has podido evaluar y cuántos cumplen. La app calcula el porcentaje con su horquilla de error y, si quieres, lo compara con un estándar.",
    campos: [
      { k: "rev", l: "Casos evaluados", phDe: u => u && u.plan ? String(u.plan.n) : "" },
      { k: "cum", l: "Cuántos cumplen", ph: "p. ej. 64" },
      { k: "est", l: "Estándar a comparar (%)", ph: "opcional" }
    ],
    calcula(st, u) {
      const cum = anNum(st.an_cum), rev = anNum(st.an_rev) === null ? (u && u.plan ? u.plan.n : null) : anNum(st.an_rev), est = anNum(st.an_est);
      const conf = anNum(st.conf);
      if (cum === null) return { html: `<p class="step-note">Escribe cuántos casos cumplen el criterio para ver el resultado con su horquilla.</p>`, lleno: false };
      if (rev === null) return { html: `<p class="step-note">Escribe cuántos casos has evaluado.</p>`, lleno: false };
      if (!anEntero(cum) || !anEntero(rev) || rev === 0) return { html: `<div class="error-box">Escribe números enteros (0, 1, 2…).</div>`, lleno: false };
      if (cum > rev) return { html: `<div class="error-box">No pueden cumplir más casos (${cum}) de los evaluados (${rev}).</div>`, lleno: false };
      if (est !== null && (Number.isNaN(est) || est <= 0 || est >= 100)) return { html: `<div class="error-box">El estándar debe estar entre 0 y 100 %.</div>`, lleno: false };
      const cf = conf !== null && conf > 50 && conf < 100 ? conf / 100 : 0.95;
      const w = S.wilson(cum, rev, cf), p1 = x => nf(x * 100, 1) + " %";
      let html = `<div class="an-res"><div class="an-res-big">${p1(w.p)}</div><div>cumplen <b>${cum}</b> de <b>${rev}</b></div><div class="an-ic">IC ${nf(cf * 100)} %: <b>${p1(w.lo)} – ${p1(w.hi)}</b></div></div>`;
      html += `<p>Con un ${nf(cf * 100)} % de confianza, el cumplimiento real está entre el <b>${p1(w.lo)}</b> y el <b>${p1(w.hi)}</b> (método de Wilson). Es una horquilla de ±${nf((w.hi - w.lo) / 2 * 100, 1)} puntos${u && u.plan && u.plan.e ? `; habías planificado ±${nf(u.plan.e)}` : ""}.</p>`;
      if (u && u.plan && rev < u.plan.n) html += `<div class="note">ℹ Has evaluado menos casos de los previstos (${u.plan.n}): la horquilla es más ancha de lo planificado.</div>`;
      if (rev < 30) html += `<div class="warn">⚠ Con menos de 30 casos la horquilla es muy ancha: no informes el porcentaje como si fuera exacto. Para decidir si se alcanza un estándar, usa <a href="#/lqas">LQAS</a>.</div>`;
      if (est !== null) {
        const e = est / 100;
        html += e > w.hi ? `<div class="an-sem an-sem--rojo"><span class="sem-luz" aria-hidden="true"></span><div><b>Por debajo del estándar del ${nf(est)} %</b><span>El estándar queda por encima de toda la horquilla.</span></div></div>`
          : e < w.lo ? `<div class="an-sem an-sem--verde"><span class="sem-luz" aria-hidden="true"></span><div><b>Por encima del estándar del ${nf(est)} %</b><span>Toda la horquilla queda por encima del estándar.</span></div></div>`
          : `<div class="an-sem an-sem--gris"><span class="sem-luz" aria-hidden="true"></span><div><b>No se puede asegurar si se alcanza el estándar del ${nf(est)} %</b><span>La horquilla incluye el estándar: haría falta más muestra (o decidir con LQAS).</span></div></div>`;
      }
      html += anFrase(`Cumplimiento del ${p1(w.p)} (IC ${nf(cf * 100)} %: ${p1(w.lo)} – ${p1(w.hi)}), en una muestra aleatoria de ${rev} casos.`);
      return { html, lleno: true };
    }
  };

  // ---------- Definición de calculadoras ----------
  const CALCS = [
    // ===================== 1. UNA PROPORCIÓN =====================
    {
      id: "proporcion", short: "Un porcentaje", title: "Estimar una proporción (porcentaje)",
      q: "¿Quieres estimar un porcentaje (p. ej. el % de historias con el consentimiento firmado)?",
      a: "Calculadora de <b>una proporción</b>",
      what: "Calcula cuántos casos debes revisar para estimar un porcentaje de la población (cumplimiento, prevalencia, satisfacción…) con un margen de error y una confianza fijados de antemano.",
      when: "Úsala cuando el objetivo es <b>medir</b> «¿qué porcentaje es…?» con un intervalo de confianza estrecho. Si solo necesitas decidir si una unidad alcanza un estándar (sí/no), con menos casos basta LQAS.",
      idea: "Para saber si la sopa está salada no hace falta tomarse la olla entera: basta una cucharada, <b>después de removerla bien</b>. Remover es el azar. Revisar una parte de las historias, <b>elegidas al azar</b>, permite saber qué porcentaje cumple en todas, con una horquilla de error.",
      facil: `
        <h3>Los tres datos, explicados sin estadística</h3>
        <ul>
          <li><b>Confianza (95 %)</b>: si hiciéramos esta misma auditoría 100 veces, en 95 la horquilla contendría el valor real. Es lo habitual.</li>
          <li><b>Margen de error (±)</b>: lo ancha que es la horquilla. Con ±10 y un resultado del 80 %, el valor real estaría entre el 70 % y el 90 %.</li>
          <li><b>Porcentaje esperado</b>: lo que crees que vas a encontrar. Si no tienes ni idea, pon <b>50 %</b>: es el caso que más casos pide, así vas sobrado sea cual sea el resultado.</li>
        </ul>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto</span>
          <p>Se quiere conocer el porcentaje de historias con el consentimiento informado firmado, sin idea previa (50 %). Confianza 95 % y margen ±10 %:</p>
          <p class="formula">n = 1,96² × 0,5 × 0,5 ÷ 0,10² = 96,04 → 97 historias</p>
          <p>(siempre se redondea hacia arriba). Si en esas 97 historias el 80 % tiene el consentimiento, el valor real estará, con un 95 % de confianza, <b>entre el 70 % y el 90 %</b>.</p>
          <p>Con ±5 %: <b>385 historias</b>. <b>Doble de precisión, cuatro veces más trabajo.</b></p>
          <p>Si solo hay 200 historias en total (N = 200), con ±10 % bastan <b>66</b> en vez de 97: cuando el universo es pequeño, hacen falta menos.</p></div>
        <h3>Tabla rápida (confianza 95 %, porcentaje esperado 50 %)</h3>
        ${tablaRapida()}
        <div class="box box--practica"><span class="box-tag">En la práctica</span>
          <p><b>La regla práctica.</b> Para evaluaciones internas de calidad es habitual revisar unas <b>50 historias al azar (como mínimo 30)</b>, sin cálculo formal. Pero una muestra pequeña solo detecta cambios grandes.</p>
          <p><b>Cuidado al informar porcentajes de muestras pequeñas.</b> Si en 20 historias cumplen 16, el 80 % observado tiene un margen de unos ±18 puntos: el valor real podría estar entre el 62 % y el 98 %. Con pocas historias, lo correcto es <b>decidir con LQAS</b> o ampliar la muestra.</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p><b>La muestra de conveniencia no vale.</b> Revisar «las 20 historias que están sobre la mesa» o «las últimas que se cerraron» suele dar un resultado mejor que la realidad, porque lo más reciente y lo más a mano suele estar mejor cumplimentado.</p></div>`,
      fields: [
        F_CONF,
        { id: "e", label: "Precisión absoluta e (± puntos porcentuales)", unit: "puntos %", def: "5", quick: [3, 5, 10],
          help: "Margen de error que toleras a cada lado. Con e = 5 y un resultado del 80 %, el valor real estaría entre 75 % y 85 %. Cuanto menor e, mucha más muestra." },
        { id: "p", label: "Proporción esperada p", unit: "%", def: "50", quick: [{ v: 50, l: "No lo sé → 50 %", accent: true }, 20, 80, 90],
          help: "Porcentaje que crees que encontrarás (por un estudio previo o un piloto). Si no tienes ni idea, usa 50 %: es el caso más conservador porque p(1−p) es máximo, y garantiza una muestra suficiente sea cual sea el valor real." },
        F_NPOP, F_LOSS
      ],
      analisis: ANALISIS_PROP,
      example: { conf: "95", e: "5", p: "80", N: "1200", loss: "10" },
      exampleText: "Ejemplo: en un hospital con 1200 ingresos al año se quiere estimar el % de historias con el registro de alergias completo. Se espera un 80 %, con precisión de ±5 puntos, confianza del 95 % y un 10 % de historias inutilizables.",
      compute(v) {
        const E = [];
        R(E, v, "conf", "Confianza", 50, 100, true, false);
        R(E, v, "e", "Precisión e", 0, 50, false, true);
        R(E, v, "p", "Proporción esperada", 0, 100, false, false);
        Npop(E, v, 2);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (E.length) return { errors: E };
        const conf = v.conf / 100, e = v.e / 100, p = v.p / 100, L = v.loss / 100, N = v.N || 0;
        const r = S.sampleProportion({ conf, e, p, N, loss: L });
        const steps = [];
        steps.push({ t: "Valor crítico z", f: [`α = 1 − ${nf(conf, 4)} = ${nf(1 - conf, 4)}`, `z = z(1 − α/2) = z(${nf(1 - (1 - conf) / 2, 4)}) = ${nfix(r.z, 4)}`], note: "z es el cuantil de la distribución normal estándar para la confianza elegida." });
        steps.push({ t: "Tamaño para población infinita", f: ["n₀ = z² · p · (1 − p) / e²", `n₀ = ${nfix(r.z, 4)}² · ${nf(p, 4)} · ${nf(1 - p, 4)} / ${nf(e, 4)}² = ${nfix(r.n0, 2)}`], note: N ? "" : `Se redondea siempre hacia arriba: n = ${r.n0c}.` });
        if (N) steps.push({ t: "Corrección por población finita", f: ["n = n₀ / (1 + (n₀ − 1) / N)", `n = ${nfix(r.n0, 2)} / (1 + (${nfix(r.n0, 2)} − 1) / ${nf(N, 0)}) = ${nfix(r.nCorr, 2)}`], note: `Redondeado hacia arriba: n = ${r.n}.` });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n_final = ${r.n} / (1 − ${nf(L, 4)}) = ${nfix(r.n / (1 - L), 2)}`], note: `Redondeado hacia arriba: n_final = ${r.nFinal}.` });
        const warns = [];
        if (e >= p || e >= 1 - p) warns.push("La precisión es igual o mayor que la distancia entre la proporción esperada y 0 % o 100 %: el intervalo llegaría a valores imposibles. Reduce e o revisa p.");
        if (p < 0.1 || p > 0.9) warns.push("Con proporciones muy cercanas a 0 % o 100 % la aproximación normal pierde exactitud; considera métodos exactos (Clopper-Pearson) o consulta a un estadístico.");
        if (v.e > 10) warns.push("Una precisión mayor de ±10 puntos da estimaciones poco informativas.");
        if (v.conf < 90) warns.push("Una confianza inferior al 90 % es poco habitual.");
        if (N && r.n >= 0.8 * N) warns.push("La muestra supone casi toda la población: puede ser más sencillo revisarla entera (censo).");
        if (N && r.nFinal > N) warns.push("Con las pérdidas previstas, n_final supera a la población N: revisa toda la población disponible.");
        const lo = (p - e) * 100, hi = (p + e) * 100;
        return {
          big: { label: "Tamaño de muestra necesario", value: nf(r.nFinal, 0), sub: "casos (historias, pacientes, registros…)" + (L > 0 ? " · ya incluye pérdidas" : "") },
          extras: [["n sin pérdidas", nf(r.n, 0)], N ? ["n₀ sin corrección", nf(r.n0c, 0)] : null].filter(Boolean),
          interp: `Si analizas <b>${nf(r.nFinal, 0)}</b> casos, podrás estimar el porcentaje con un margen de error de <b>±${nf(v.e)} puntos</b> y una confianza del <b>${nf(v.conf)} %</b>. Por ejemplo, si en la muestra obtienes un ${nf(v.p)} %, el valor real de la población estaría entre ${nf(lo)} % y ${nf(hi)} %.`,
          plan: { n: r.n, e: v.e }, warns, steps, mini: nf(r.nFinal, 0), extraHtml: sorteoHtml(r.nFinal, N)
        };
      }
    },

    // ===================== 2. UNA MEDIA =====================
    {
      id: "media", short: "Una media", title: "Estimar una media",
      q: "¿Quieres estimar un valor medio (tiempo de espera, estancia, edad, cifra de laboratorio…)?",
      a: "Calculadora de <b>una media</b>",
      what: "Calcula cuántos casos necesitas para estimar la media de una variable numérica con un margen de error (en sus mismas unidades) y una confianza fijados.",
      when: "Úsala para medir <b>«¿cuánto vale de media…?»</b>: demora, estancia, puntuación de una escala… Necesitas una idea de la dispersión (desviación típica) de la variable.",
      idea: "Si todos los pacientes esperasen lo mismo, bastaría con mirar uno. Cuanto <b>más distintos</b> son unos de otros (más dispersión, σ), más casos hacen falta para que la media de la muestra se parezca a la real.",
      facil: `
        <h3>Los datos, explicados sin estadística</h3>
        <ul>
          <li><b>Desviación típica (σ)</b>: cuánto se separan los valores de la media, «por término medio». <b>Truco</b> si no la conoces: σ ≈ (valor alto habitual − valor bajo habitual) ÷ 4. Si casi todas las esperas van de 10 a 110 minutos, σ ≈ 100 ÷ 4 = 25 minutos.</li>
          <li><b>Margen de error (±)</b>: la horquilla que aceptas, en las mismas unidades. ±5 minutos: si la media de la muestra sale 40, la real estará entre 35 y 45.</li>
          <li><b>Confianza (95 %)</b>: de cada 100 estudios hechos así, en 95 la horquilla acertaría.</li>
        </ul>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto</span>
          <p>Tiempo medio de espera en Urgencias: σ ≈ 25 minutos, margen ±5 minutos, confianza 95 %:</p>
          <p class="formula">n = 1,96² × 25² ÷ 5² = 96,04 → 97 pacientes</p>
          <p>Con ±10 minutos bastan <b>25</b>. Otra vez: doble de precisión, cuatro veces más trabajo.</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa: la media puede maquillar</span><p>Una espera media de 20 minutos parece buenísima… pero puede haber pacientes esperando tres horas compensados por otros atendidos al instante. Muchas veces es mejor convertir la media en un porcentaje: «% de pacientes que esperan más de 30 minutos». Así sabes cuántos se quedan fuera del límite aceptable (y lo calculas con <a href="#/proporcion">Un porcentaje</a> o con <a href="#/lqas">LQAS</a>).</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p><b>σ y el margen tienen que ir en las mismas unidades</b> (minutos con minutos, días con días). Y si unos pocos casos son larguísimos (esperas de 8 horas), la media engaña: haz antes un pequeño piloto o consulta a un estadístico.</p></div>`,
      fields: [
        F_CONF,
        { id: "sigma", label: "Desviación típica σ", unit: "unidades", def: "", ph: "p. ej. 25",
          help: "Dispersión de la variable, en sus mismas unidades. Sácala de un estudio previo, de un piloto con unos 20–30 casos, o estímala como (rango plausible)/4. Si dudas, sé prudente y usa un valor algo mayor." },
        { id: "e", label: "Precisión absoluta e (±)", unit: "unidades", def: "", ph: "p. ej. 5",
          help: "Margen de error que toleras a cada lado de la media, en las mismas unidades que σ. Con e = 5 minutos y una media de 40, la media real estaría entre 35 y 45." },
        F_NPOP, F_LOSS
      ],
      example: { conf: "95", sigma: "25", e: "5", N: "3000", loss: "10" },
      exampleText: "Ejemplo: estimar el tiempo medio de espera en Urgencias. Desviación típica estimada de 25 minutos, precisión de ±5 minutos, confianza del 95 %, 3000 atenciones al mes y un 10 % de registros sin hora válida.",
      compute(v) {
        const E = [];
        R(E, v, "conf", "Confianza", 50, 100, true, false);
        R(E, v, "sigma", "Desviación típica σ", 0, 1e9, false, false);
        R(E, v, "e", "Precisión e", 0, 1e9, false, false);
        Npop(E, v, 2);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (E.length) return { errors: E };
        const conf = v.conf / 100, L = v.loss / 100, N = v.N || 0;
        const r = S.sampleMean({ conf, sigma: v.sigma, e: v.e, N, loss: L });
        const steps = [];
        steps.push({ t: "Valor crítico z", f: [`α = ${nf(1 - conf, 4)}`, `z = z(1 − α/2) = z(${nf(1 - (1 - conf) / 2, 4)}) = ${nfix(r.z, 4)}`] });
        steps.push({ t: "Tamaño para población infinita", f: ["n₀ = z² · σ² / e²", `n₀ = ${nfix(r.z, 4)}² · ${nf(v.sigma, 4)}² / ${nf(v.e, 4)}² = ${nfix(r.n0, 2)}`], note: N ? "" : `Se redondea siempre hacia arriba: n = ${r.n0c}.` });
        if (N) steps.push({ t: "Corrección por población finita", f: ["n = n₀ / (1 + (n₀ − 1) / N)", `n = ${nfix(r.n0, 2)} / (1 + (${nfix(r.n0, 2)} − 1) / ${nf(N, 0)}) = ${nfix(r.nCorr, 2)}`], note: `Redondeado hacia arriba: n = ${r.n}.` });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n_final = ${r.n} / (1 − ${nf(L, 4)}) = ${nfix(r.n / (1 - L), 2)}`], note: `Redondeado hacia arriba: n_final = ${r.nFinal}.` });
        const warns = [];
        if (v.e >= v.sigma) warns.push("La precisión es igual o mayor que la desviación típica: el intervalo sería tan ancho que apenas informa. ¿Seguro que las unidades de σ y e coinciden?");
        if (N && r.n >= 0.8 * N) warns.push("La muestra supone casi toda la población: considera revisarla entera (censo).");
        if (N && r.nFinal > N) warns.push("Con las pérdidas previstas, n_final supera a la población N: revisa toda la población disponible.");
        if (r.n0c < 30) warns.push("Con menos de unos 30 casos la aproximación normal es dudosa (la t de Student sería más adecuada).");
        return {
          big: { label: "Tamaño de muestra necesario", value: nf(r.nFinal, 0), sub: "casos" + (L > 0 ? " · ya incluye pérdidas" : "") },
          extras: [["n sin pérdidas", nf(r.n, 0)], N ? ["n₀ sin corrección", nf(r.n0c, 0)] : null].filter(Boolean),
          interp: `Con <b>${nf(r.nFinal, 0)}</b> casos podrás estimar la media con un error máximo de <b>±${nf(v.e)}</b> unidades y una confianza del <b>${nf(v.conf)} %</b>, suponiendo que la desviación típica real ronde ${nf(v.sigma)}.`,
          warns, steps, mini: nf(r.nFinal, 0), extraHtml: sorteoHtml(r.nFinal, N)
        };
      }
    },

    // ===================== 3. DOS PROPORCIONES =====================
    {
      id: "dos-proporciones", short: "2 porcentajes", title: "Comparar dos proporciones",
      q: "¿Quieres comparar el porcentaje entre dos grupos (antes/después, servicio A/B)?",
      a: "Calculadora de <b>dos proporciones</b>",
      what: "Calcula cuántos casos necesitas <b>en cada grupo</b> para detectar, con la potencia deseada, una diferencia entre dos porcentajes (por ejemplo, el cumplimiento antes y después de una intervención de mejora).",
      when: "Úsala para evaluar si una intervención o un servicio <b>cambia</b> un indicador de proceso o resultado expresado en porcentaje, y quieres tener muestra suficiente para que la diferencia no pase desapercibida.",
      idea: "Si lanzas una moneda 10 veces y salen 6 caras, eso no demuestra que esté trucada. Si la lanzas 1.000 veces y salen 600, sí. Para saber si una <b>mejora es real y no casualidad</b>, hacen falta suficientes casos en cada grupo.",
      facil: `
        <h3>Los datos, explicados sin estadística</h3>
        <ul>
          <li><b>p₁ y p₂</b>: el porcentaje de antes (o del servicio A) y el que esperas conseguir (o la mejora más pequeña que te importaría).</li>
          <li><b>α (5 %)</b>: riesgo de <b>falsa alarma</b>: concluir que ha mejorado cuando en realidad no.</li>
          <li><b>Potencia (80 %)</b>: probabilidad de <b>darte cuenta</b> si de verdad mejoró. Con 80 %, de cada 5 mejoras reales detectarías 4.</li>
        </ul>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto</span>
          <p>Una campaña de higiene de manos quiere subir la adherencia del 40 % al 60 %. Con α = 5 % y potencia 80 % hacen falta <b>97 observaciones antes y 97 después</b>.</p>
          <p>Para demostrar una subida del 40 % al 50 % harían falta <b>388 por grupo</b>, y del 40 % al 45 %, <b>1.534 por grupo</b>. Cuanto más pequeña es la mejora que quieres demostrar, muchísimos más casos.</p></div>
        <h3>¿Y si el efecto viene como riesgo relativo u odds ratio?</h3>
        <p>Muchos artículos dan el efecto como <b>riesgo relativo (RR)</b> («la intervención reduce las infecciones a la mitad»: RR = 0,5) o como <b>odds ratio (OR)</b>. Elige esa opción en «Cómo expresas el efecto» y escribe el valor: la app calcula el porcentaje del grupo 2 a partir del grupo 1. Por ejemplo, con un 40 % de partida, una OR de 2,25 equivale a pasar al 60 % (97 por grupo, igual que antes).</p>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p><b>«No hemos demostrado mejora» no es lo mismo que «no hay mejora».</b> Con 30 casos por grupo solo se ven cambios enormes: la campaña pudo funcionar y la muestra ser demasiado pequeña para notarlo.</p></div>`,
      fields: [
        { id: "p1", label: "Proporción esperada en el grupo 1 (p₁)", unit: "%", def: "", ph: "p. ej. 40", help: "Porcentaje esperado en el grupo de referencia (p. ej. cumplimiento actual o «antes»), según datos previos o un piloto." },
        { id: "efecto", label: "Cómo expresas el efecto esperado", type: "seg", def: "p2", options: [["p2", "% del grupo 2"], ["rr", "Riesgo relativo"], ["or", "Odds ratio"]],
          help: "Lo habitual en auditoría es dar el porcentaje esperado en el grupo 2. Si el efecto lo tienes de un artículo como riesgo relativo (RR) u odds ratio (OR), elige esa opción y la app calcula p₂ a partir de p₁." },
        { id: "efv", label: "Valor del RR u OR esperado", def: "", ph: "p. ej. 0,5", quick: [0.5, 0.75, 1.5, 2], showIf: st => st.efecto === "rr" || st.efecto === "or",
          help: "Riesgo relativo (RR) = p₂ ÷ p₁: con RR = 0,5 el riesgo se reduce a la mitad; con RR = 2 se duplica. Odds ratio (OR) = (p₂/(1−p₂)) ÷ (p₁/(1−p₁)): es la medida de muchos estudios de casos y controles; se parece al RR solo cuando los porcentajes son pequeños. 1 = sin efecto." },
        { id: "p2", showIf: st => !st.efecto || st.efecto === "p2", label: "Proporción esperada en el grupo 2 (p₂)", unit: "%", def: "", ph: "p. ej. 60", help: "Porcentaje que esperas lograr (o la menor diferencia que sería relevante). Cuanto más cerca de p₁, mucha más muestra." },
        F_ALPHA, F_SIDES, F_POWER, F_K,
        { id: "fleiss", label: "Corrección de continuidad (Fleiss)", type: "check", def: false,
          help: "Aumenta algo el tamaño y es más prudente si vas a analizar con el test χ² con corrección de continuidad o con el test exacto de Fisher. No es necesaria en el resto de casos." },
        F_LOSS
      ],
      example: { p1: "40", p2: "60", alpha: "5", sides: "2", power: "80", k: "1", fleiss: false, loss: "10" },
      exampleText: "Ejemplo: una campaña de higiene de manos pretende subir la adherencia del 40 % al 60 %. Contraste bilateral, α = 5 %, potencia del 80 %, grupos iguales y un 10 % de pérdidas de observaciones.",
      compute(v) {
        const E = [];
        R(E, v, "p1", "p₁", 0, 100, false, false);
        const modo = v.efecto || "p2";
        if (modo === "p2") {
          R(E, v, "p2", "p₂", 0, 100, false, false);
          if (!E.length && v.p1 === v.p2) E.push({ f: "p2", m: "p₁ y p₂ no pueden ser iguales: no habría diferencia que detectar." });
        } else {
          R(E, v, "efv", modo === "rr" ? "Riesgo relativo" : "Odds ratio", 0, 1e4, false, false);
          if (!E.length && v.efv === 1) E.push({ f: "efv", m: "Un valor de 1 significa «sin efecto»: no habría diferencia que detectar." });
          if (!E.length) {
            const q = modo === "rr" ? S.p2DesdeRR(v.p1 / 100, v.efv) : S.p2DesdeOR(v.p1 / 100, v.efv);
            if (!(q > 0 && q < 1)) E.push({ f: "efv", m: `Con p₁ = ${nf(v.p1)} %, un riesgo relativo de ${nf(v.efv)} daría un p₂ igual o mayor que 100 %: no es posible.` });
            else v.p2 = q * 100;
          }
        }
        R(E, v, "alpha", "α", 0, 50, false, false);
        R(E, v, "power", "Potencia", 50, 100, false, false);
        R(E, v, "k", "Razón k", 0.1, 10, true, true);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (E.length) return { errors: E };
        const p1 = v.p1 / 100, p2 = v.p2 / 100, alpha = v.alpha / 100, power = v.power / 100, L = v.loss / 100, k = v.k, sides = v.sides === "1" ? 1 : 2;
        const r = S.twoProportions({ p1, p2, alpha, power, k, sides, fleiss: !!v.fleiss, loss: L });
        const steps = [];
        if (modo === "rr") steps.push({ t: "De riesgo relativo a p₂", f: ["p₂ = RR × p₁", `p₂ = ${nf(v.efv, 4)} × ${nf(p1, 4)} = ${nfix(p2, 4)}`] });
        if (modo === "or") steps.push({ t: "De odds ratio a p₂", f: ["p₂ = OR·p₁ / (1 − p₁ + OR·p₁)", `p₂ = ${nf(v.efv, 4)}·${nf(p1, 4)} / (1 − ${nf(p1, 4)} + ${nf(v.efv, 4)}·${nf(p1, 4)}) = ${nfix(p2, 4)}`] });
        steps.push({ t: "Proporción media ponderada", f: ["p̄ = (p₁ + k·p₂) / (1 + k)", `p̄ = (${nf(p1, 4)} + ${nf(k, 4)}·${nf(p2, 4)}) / (1 + ${nf(k, 4)}) = ${nfix(r.pbar, 4)}`, `q̄ = 1 − p̄ = ${nfix(r.qbar, 4)}`] });
        steps.push({ t: "Valores críticos", f: [sides === 1 ? `z_α = z(1 − α) = z(${nf(1 - alpha, 4)}) = ${nfix(r.za, 4)}   (unilateral)` : `z_α = z(1 − α/2) = z(${nf(1 - alpha / 2, 4)}) = ${nfix(r.za, 4)}   (bilateral)`, `z_β = z(potencia) = z(${nf(power, 4)}) = ${nfix(r.zb, 4)}`] });
        steps.push({ t: "Tamaño del grupo 1", f: [
          "n₁ = [ z_α·√((1 + 1/k)·p̄·q̄) + z_β·√(p₁(1−p₁) + p₂(1−p₂)/k) ]² / (p₁ − p₂)²",
          `n₁ = [ ${nfix(r.za, 4)}·√((1 + 1/${nf(k, 4)})·${nfix(r.pbar, 4)}·${nfix(r.qbar, 4)}) + ${nfix(r.zb, 4)}·√(${nf(p1, 4)}·${nf(1 - p1, 4)} + ${nf(p2, 4)}·${nf(1 - p2, 4)}/${nf(k, 4)}) ]² / (${nf(p1, 4)} − ${nf(p2, 4)})²`,
          `n₁ = [ ${nfix(r.termA, 4)} + ${nfix(r.termB, 4)} ]² / ${nfix(r.diff * r.diff, 4)} = ${nfix(r.n1raw, 2)}`] });
        if (v.fleiss) steps.push({ t: "Corrección de continuidad (Fleiss)", f: ["n₁' = (n₁/4)·(1 + √(1 + 2(k+1) / (k·n₁·|p₁−p₂|)))²", `n₁' = (${nfix(r.n1raw, 2)}/4)·(1 + √(1 + 2·${nf(k + 1, 4)} / (${nf(k, 4)}·${nfix(r.n1raw, 2)}·${nf(Math.abs(r.diff), 4)})))² = ${nfix(r.n1c, 2)}`] });
        steps.push({ t: "Redondeo hacia arriba y tamaño del grupo 2", f: [`n₁ = ${r.n1}`, `n₂ = k · n₁ = ${nf(k, 4)} · ${nfix(v.fleiss ? r.n1c : r.n1raw, 2)} → ${r.n2}`] });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n₁ final = ${r.n1} / (1 − ${nf(L, 4)}) → ${r.n1Final}`, `n₂ final = ${r.n2} / (1 − ${nf(L, 4)}) → ${r.n2Final}`] });
        const warns = [], notes = [];
        const rrEq = p2 / p1, orEq = (p2 / (1 - p2)) / (p1 / (1 - p1));
        notes.push(`Este efecto equivale a un riesgo relativo de <b>${nfix(rrEq, 2)}</b> y a una odds ratio de <b>${nfix(orEq, 2)}</b> (p₁ = ${nf(p1 * 100, 1)} %, p₂ = ${nf(p2 * 100, 1)} %).`);
        if (Math.abs(r.diff) < 0.05) warns.push("La diferencia a detectar es menor de 5 puntos: el tamaño necesario será muy grande. Valora si una diferencia tan pequeña es clínicamente relevante.");
        if (p1 < 0.05 || p1 > 0.95 || p2 < 0.05 || p2 > 0.95) warns.push("Con proporciones muy cercanas a 0 % o 100 % la aproximación normal es poco fiable; considera métodos exactos.");
        if (sides === 1) warns.push("Contraste unilateral: solo es defendible si se decidió antes del estudio y una diferencia en el sentido contrario carece de interés.");
        if (v.power < 80) warns.push("Una potencia inferior al 80 % es poco habitual: aumentas el riesgo de no detectar una diferencia real.");
        if (v.alpha > 10) warns.push("Un α superior al 10 % es poco habitual.");
        const tot = r.n1Final + r.n2Final;
        const grupos = k === 1;
        return {
          big: { label: grupos ? "Casos necesarios por grupo" : "Casos necesarios en el grupo 1", value: nf(r.n1Final, 0), sub: grupos ? `Total: ${nf(tot, 0)} casos (2 grupos)` : `Grupo 2: ${nf(r.n2Final, 0)} · Total: ${nf(tot, 0)}` },
          extras: [["Grupo 1", nf(r.n1Final, 0)], ["Grupo 2", nf(r.n2Final, 0)], ["Total", nf(tot, 0)], L > 0 ? ["Sin pérdidas (total)", nf(r.n1 + r.n2, 0)] : null].filter(Boolean),
          interp: `Con <b>${nf(r.n1Final, 0)}</b> casos en el grupo 1 y <b>${nf(r.n2Final, 0)}</b> en el grupo 2, tendrás una probabilidad del <b>${nf(v.power)} %</b> de detectar como significativa (α = ${nf(v.alpha)} %, ${sides === 1 ? "unilateral" : "bilateral"}) una diferencia real entre ${nf(v.p1)} % y ${nf(v.p2)} %. Si el efecto real es menor, la potencia será menor.`,
          warns, notes, steps, mini: nf(r.n1Final, 0) + " + " + nf(r.n2Final, 0)
        };
      }
    },

    // ===================== 4. DOS MEDIAS =====================
    {
      id: "dos-medias", short: "2 medias", title: "Comparar dos medias",
      q: "¿Quieres comparar el valor medio entre dos grupos (antes/después, servicio A/B)?",
      a: "Calculadora de <b>dos medias</b>",
      what: "Calcula cuántos casos necesitas <b>en cada grupo</b> para detectar una diferencia mínima relevante entre las medias de una variable numérica.",
      when: "Úsala para comparar una variable cuantitativa (demora, estancia, puntuación…) entre dos grupos independientes, suponiendo una desviación típica similar en ambos.",
      idea: "Piensa en <b>señal y ruido</b>: la diferencia que buscas (Δ) es la señal; lo distintos que son los pacientes entre sí (σ) es el ruido. Si la señal es pequeña comparada con el ruido, hacen falta muchos casos para oírla.",
      facil: `
        <h3>Los datos, explicados sin estadística</h3>
        <ul>
          <li><b>σ</b>: cuánto varía la medida de un paciente a otro (truco: valor alto habitual − valor bajo habitual, dividido entre 4).</li>
          <li><b>Δ</b>: la diferencia más pequeña que <b>merecería la pena</b> detectar. No es la que esperas, sino la mínima que importaría.</li>
          <li><b>α (5 %)</b>: riesgo de falsa alarma. <b>Potencia (80 %)</b>: probabilidad de notar la diferencia si existe.</li>
        </ul>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto</span>
          <p>¿Reduce un nuevo circuito la espera en Urgencias? σ = 30 minutos. Para detectar <b>10 minutos</b> menos hacen falta <b>142 pacientes por grupo</b>; para detectar <b>20 minutos</b>, solo <b>36</b>.</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p>Si eliges una Δ enorme para que salgan pocos casos, el estudio solo podrá ver diferencias enormes. Elige la Δ por su relevancia clínica, no por comodidad.</p></div>`,
      fields: [
        { id: "sigma", label: "Desviación típica común σ", unit: "unidades", def: "", ph: "p. ej. 30", help: "Dispersión de la variable (se supone igual en los dos grupos), en sus mismas unidades. Sácala de datos previos o un piloto." },
        { id: "delta", label: "Diferencia mínima relevante Δ", unit: "unidades", def: "", ph: "p. ej. 10", help: "La diferencia entre medias más pequeña que te interesaría detectar por su relevancia clínica o de gestión, en las mismas unidades que σ. No es la diferencia que «esperas», sino la mínima que importaría." },
        F_ALPHA, F_SIDES, F_POWER, F_K, F_LOSS
      ],
      example: { sigma: "30", delta: "10", alpha: "5", sides: "2", power: "80", k: "1", loss: "10" },
      exampleText: "Ejemplo: ¿reduce un nuevo circuito el tiempo de espera en Urgencias? Desviación típica de 30 minutos, diferencia mínima relevante de 10 minutos, α = 5 % bilateral, potencia del 80 % y un 10 % de pérdidas.",
      compute(v) {
        const E = [];
        R(E, v, "sigma", "Desviación típica σ", 0, 1e9, false, false);
        R(E, v, "delta", "Diferencia Δ", 0, 1e9, false, false);
        R(E, v, "alpha", "α", 0, 50, false, false);
        R(E, v, "power", "Potencia", 50, 100, false, false);
        R(E, v, "k", "Razón k", 0.1, 10, true, true);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (E.length) return { errors: E };
        const alpha = v.alpha / 100, power = v.power / 100, L = v.loss / 100, k = v.k, sides = v.sides === "1" ? 1 : 2;
        const r = S.twoMeans({ sigma: v.sigma, delta: v.delta, alpha, power, k, sides, loss: L });
        const steps = [];
        steps.push({ t: "Valores críticos", f: [sides === 1 ? `z_α = z(1 − α) = z(${nf(1 - alpha, 4)}) = ${nfix(r.za, 4)}   (unilateral)` : `z_α = z(1 − α/2) = z(${nf(1 - alpha / 2, 4)}) = ${nfix(r.za, 4)}   (bilateral)`, `z_β = z(potencia) = z(${nf(power, 4)}) = ${nfix(r.zb, 4)}`] });
        steps.push({ t: "Tamaño del grupo 1", f: ["n₁ = (1 + 1/k) · σ² · (z_α + z_β)² / Δ²", `n₁ = (1 + 1/${nf(k, 4)}) · ${nf(v.sigma, 4)}² · (${nfix(r.za, 4)} + ${nfix(r.zb, 4)})² / ${nf(v.delta, 4)}² = ${nfix(r.n1raw, 2)}`] });
        steps.push({ t: "Redondeo hacia arriba y tamaño del grupo 2", f: [`n₁ = ${r.n1}`, `n₂ = k · n₁ = ${nf(k, 4)} · ${nfix(r.n1raw, 2)} → ${r.n2}`] });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n₁ final = ${r.n1} / (1 − ${nf(L, 4)}) → ${r.n1Final}`, `n₂ final = ${r.n2} / (1 − ${nf(L, 4)}) → ${r.n2Final}`] });
        const warns = [];
        const d = v.delta / v.sigma;
        if (d < 0.2) warns.push(`La diferencia es solo ${nf(d)} desviaciones típicas (efecto pequeño): el tamaño necesario será muy grande. Valora si es relevante detectar algo tan pequeño.`);
        if (d > 1.5) warns.push("Una diferencia mayor de 1,5 desviaciones típicas es un efecto muy grande y poco habitual: comprueba que σ y Δ están en las mismas unidades.");
        if (sides === 1) warns.push("Contraste unilateral: solo es defendible si se decidió antes del estudio y una diferencia en el sentido contrario carece de interés.");
        if (v.power < 80) warns.push("Una potencia inferior al 80 % es poco habitual.");
        const notes = ["Esta fórmula usa la distribución normal (z), la habitual en los textos de referencia. Si el análisis se hará con la t de Student, el cálculo exacto con t (p. ej. <code>power.t.test</code> en R) suele pedir 1 o 2 casos más por grupo; la diferencia solo importa con muestras pequeñas. Ejemplo: σ = 10, Δ = 5, α = 5 % bilateral y potencia 80 % dan 63 por grupo con z y 64 con t."];
        const tot = r.n1Final + r.n2Final;
        const grupos = k === 1;
        return {
          big: { label: grupos ? "Casos necesarios por grupo" : "Casos necesarios en el grupo 1", value: nf(r.n1Final, 0), sub: grupos ? `Total: ${nf(tot, 0)} casos (2 grupos)` : `Grupo 2: ${nf(r.n2Final, 0)} · Total: ${nf(tot, 0)}` },
          extras: [["Grupo 1", nf(r.n1Final, 0)], ["Grupo 2", nf(r.n2Final, 0)], ["Total", nf(tot, 0)], L > 0 ? ["Sin pérdidas (total)", nf(r.n1 + r.n2, 0)] : null].filter(Boolean),
          interp: `Con <b>${nf(r.n1Final, 0)}</b> casos en el grupo 1 y <b>${nf(r.n2Final, 0)}</b> en el grupo 2, tendrás un <b>${nf(v.power)} %</b> de probabilidad de detectar como significativa (α = ${nf(v.alpha)} %) una diferencia real de al menos <b>${nf(v.delta)}</b> unidades entre las medias, si la desviación típica es ${nf(v.sigma)}.`,
          warns, notes, steps, mini: nf(r.n1Final, 0) + " + " + nf(r.n2Final, 0)
        };
      }
    },

    // ===================== 5. LQAS =====================
    // Convención del curso (Saturno, tema 4): α = rechazar un servicio que cumple el estándar
    // (falsa alarma, en pᵤ); β = aceptar un servicio en el umbral o peor (fuego sin alarma, en pₗ).
    // Stats.lqas usa la convención inversa (su alpha es el riesgo en pₗ), por eso se cruzan al llamarla.
    {
      id: "lqas", short: "LQAS (auditoría)", title: "LQAS · ¿Alcanza el estándar? (semáforo)",
      q: "¿Quieres decidir si una unidad o servicio alcanza un estándar (sí / no) en una auditoría?",
      a: "Calculadora <b>LQAS</b> (muestreo para la aceptación de lotes)",
      what: "LQAS (<i>Lot Quality Assurance Sampling</i>, muestreo para la aceptación de lotes) calcula cuántos casos revisar (<b>n</b>) y cuántos tienen que cumplir como mínimo (<b>c</b>, el número de decisión) para decidir si un servicio <b>alcanza el estándar</b> o <b>hay que investigar</b>, con errores controlados.",
      when: "Úsala en <b>auditorías</b> cuando no necesitas la cifra exacta de cumplimiento, sino una decisión: verde o rojo. A diferencia de «estimar un porcentaje» (que necesita cientos de casos), LQAS suele bastar con 15–35. Si sabes cuántos casos tiene el lote (N), la muestra se reduce.",
      idea: "LQAS funciona como un <b>semáforo, no como una báscula</b>. No dice cuánto se cumple: con pocos casos dice <b>«verde: sin evidencia de problema»</b> o <b>«rojo: hay que investigar»</b>. Es como el arco del aeropuerto: no dice cuánto metal llevas, solo pita o no pita.",
      facil: `
        <h3>Vocabulario, con una caja de galletas</h3>
        <div class="table-wrap"><table class="mini facil-tabla"><thead><tr><th>Término</th><th>Qué significa</th><th>Dicho de otro modo</th></tr></thead><tbody>
          <tr><td><b>Lote</b></td><td>El conjunto de casos que se quiere juzgar</td><td>La caja de galletas</td></tr>
          <tr><td><b>Estándar</b></td><td>Cumplimiento que queremos tener</td><td>Lo que nos comprometemos a hacer</td></tr>
          <tr><td><b>Umbral</b></td><td>Cumplimiento por debajo del cual la situación es claramente mala</td><td>La línea roja que no queremos cruzar</td></tr>
          <tr><td><b>n</b></td><td>Casos que hay que revisar</td><td>Cuántas galletas pruebo</td></tr>
          <tr><td><b>c</b></td><td>Mínimo de cumplimientos en la muestra para aceptar</td><td>La nota mínima para aprobar</td></tr>
          <tr><td><b>Error α</b></td><td>Sale rojo un servicio que sí cumple el estándar</td><td>Falsa alarma: suena el detector y no hay fuego</td></tr>
          <tr><td><b>Error β</b></td><td>Sale verde un servicio que está en el umbral o peor</td><td>Fuego sin alarma</td></tr>
          <tr><td><b>Poder (1 − β)</b></td><td>Capacidad de detectar un problema cuando existe</td><td>Lo bueno que es el detector</td></tr>
        </tbody></table></div>
        <p>Lo habitual es <b>α = 5 %</b> y <b>β = 20 % o 10 %</b>. Una falsa alarma hace perder tiempo investigando algo que no falla; un fuego sin alarma deja pasar un problema real. Cuanto más pequeños los errores que aceptas, más casos hay que revisar.</p>
        <h3>La idea en una imagen</h3>
        <p>Imagina que el estándar es que fallen como máximo el 15 % de las historias. Si revisamos 15 al azar y de verdad solo falla el 15 %, lo normal es encontrar entre 0 y 5 fallos; encontrar 6 o más ocurriría solo en el 1,7 % de las ocasiones. Así que, si encontramos 6 o más, lo razonable es pensar que el estándar no se cumple. Esa es toda la idea: <b>fijar de antemano una línea (c) y mirar a qué lado cae la muestra</b>.</p>
        <h3>Cómo se hace, en cinco pasos</h3>
        <ol>
          <li><b>Define el lote</b>: por ejemplo, los pacientes atendidos en triaje el último mes.</li>
          <li><b>Fija el estándar y el umbral</b> del indicador (por ejemplo, 85 % y 60 %).</li>
          <li><b>Elige α y β</b> (lo habitual: 5 % y 20 %).</li>
          <li>Esta calculadora te da <b>n</b> y <b>c</b>.</li>
          <li><b>Sortea n casos</b> del lote y cuenta cuántos cumplen: si cumplen <b>c o más → verde</b>; si cumplen menos → <b>rojo, hay que investigar</b>.</li>
        </ol>
        <p>Una vez conocidos n y c no hace falta ningún cálculo más: cualquier persona del equipo puede aplicarlo sin saber estadística.</p>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto: registro del dolor en Urgencias</span>
          <p>Se quiere vigilar el porcentaje de pacientes con el dolor registrado en el triaje. <b>Estándar 85 %</b>, <b>umbral 60 %</b>, α = 5 %, β = 20 %.</p>
          <p>Resultado: revisar <b>22 historias</b> elegidas al azar, con <b>c = 16</b>. Si 18 tienen el dolor registrado: 18 ≥ 16 → <b>verde</b>, sin evidencia de problema. Si solo 14: 14 &lt; 16 → <b>rojo</b>, hay que investigar.</p>
          <p>Si sabemos que el lote son 150 pacientes, basta con <b>18 historias y c = 13</b>.</p></div>
        <h3>Lo que LQAS dice y lo que no</h3>
        <ul>
          <li><b>No mide el cumplimiento.</b> Si 18 de 22 cumplen, no se puede escribir «el cumplimiento es del 82 %». Solo: «no hay evidencia de que el estándar del 85 % esté en peligro».</li>
          <li><b>Verde no es «excelente» y rojo no es una sentencia</b>: es un aviso para mirar más a fondo qué está fallando.</li>
          <li><b>Si un solo caso ya es grave, no se usa LQAS.</b> En los indicadores centinela (por ejemplo, cirugía en el lado equivocado) hay que revisar todos los casos.</li>
        </ul>
        <h3>Condiciones para aplicarlo</h3>
        <ul>
          <li>Lo que se evalúa tiene solo dos valores: <b>cumple / no cumple</b>.</li>
          <li>Cada caso es <b>independiente</b> de los demás (casi siempre ocurre con historias clínicas).</li>
          <li>El lote es <b>homogéneo</b>: el mismo criterio durante todo el periodo y el mismo tipo de casos.</li>
          <li>Los casos se eligen <b>al azar</b>.</li>
        </ul>
        <h3>¿Por qué la app pide más casos que las tablas de Lemeshow?</h3>
        <p>Las tablas clásicas (adaptadas por Saturno) usan una aproximación. Con muestras pequeñas, el error β real (fuego sin alarma) queda bastante por encima del que anuncian. Esta app hace el cálculo exacto con la distribución binomial, así que cumple el β que pides, a cambio de unos pocos casos más:</p>
        ${tablaLemeshow()}
        <p>Las tablas sirven como <b>cribado</b> (semáforo). Si el riesgo para el paciente es alto, usa el plan exacto, una muestra mayor o revisa todos los casos.</p>
        <h3>¿Y la «regla del 10 %»?</h3>
        <p>Las tablas suponen un lote grande; por eso se pide que la muestra no pase del 10 % del lote. Si escribes el <b>tamaño del lote (N)</b>, la app usa la distribución hipergeométrica, que es exacta también para lotes pequeños, y esa regla deja de ser necesaria. Ejemplo: con un lote de 150 episodios, estándar 85 %, umbral 65 %, α 5 % y β 20 %, basta revisar <b>24 historias con c = 18</b>; no hace falta revisar los 150.</p>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p><b>No mezcles el sentido.</b> c cuenta <b>cumplimientos</b>: si hay menos de c, sale rojo. Si prefieres contar incumplimientos, sale rojo cuando hay más de n − c. Cuenta siempre en el mismo sentido que el estándar.</p></div>`,
      fields: [
        { id: "pU", label: "Estándar (lo que queremos tener)", unit: "%", def: "85", quick: [80, 85, 90, 95],
          help: "Nivel de cumplimiento que nos comprometemos a mantener (en inglés AQL). Por ejemplo: el 85 % de los pacientes con el dolor registrado en el triaje. Un servicio que lo cumple debería salir VERDE." },
        { id: "pL", label: "Umbral (la línea roja que no toleramos)", unit: "%", def: "60", quick: [50, 60, 70, 75],
          help: "Cumplimiento por debajo del cual la situación es claramente mala (en inglés LQL). Un servicio en el umbral o peor debería salir ROJO. Entre el umbral y el estándar hay una «zona gris» en la que puede salir cualquier color. Cuanto más separados estén, menos casos hacen falta." },
        { id: "alpha", label: "Error α · falsa alarma", unit: "%", def: "5", quick: [5, 10],
          help: "Probabilidad de que salga ROJO un servicio que en realidad cumple el estándar: suena el detector y no hay fuego. Hace perder tiempo investigando algo que no falla. Lo habitual: 5 %." },
        { id: "beta", label: "Error β · fuego sin alarma", unit: "%", def: "20", quick: [10, 20],
          help: "Probabilidad de que salga VERDE un servicio que en realidad está en el umbral o peor: hay fuego y no suena la alarma. Deja pasar un problema real. Lo habitual: 20 %, o 10 % si quieres más seguridad (a cambio de más casos)." },
        { id: "N", label: "Tamaño del lote (población) N", unit: "casos", opt: true, def: "", ph: "opcional",
          help: "Número total de casos del lote (la «caja de galletas», es decir, la población que quieres juzgar): por ejemplo, todas las historias del periodo. No es la muestra: la muestra (n) es lo que calcula la app. Si conoces N, se usa la distribución HIPERGEOMÉTRICA y, si el lote es pequeño (unos cientos de casos o menos), hacen falta menos historias. Si el lote es grande, N apenas cambia el resultado (como la cucharada de sopa: sirve igual para una olla que para un caldero) y puedes dejarlo vacío." },
        F_LOSS
      ],
      analisis: ANALISIS_LQAS,
      example: { pU: "85", pL: "60", alpha: "5", beta: "20", N: "", loss: "0" },
      pageHtml() {
        return `<details class="facil tabla-exacta no-print" id="tabla-exacta"><summary>Tabla de consulta exacta (como las de Lemeshow)</summary><div class="facil-body">
          <p>Misma forma que las tablas de Lemeshow del curso: <b>fila = umbral</b>, <b>columna = estándar</b>, y en cada casilla <b>n / c</b> (historias a revisar / mínimo de cumplimientos para que salga verde). La diferencia es que aquí cada plan está calculado de forma <b>exacta</b> (distribución binomial), así que garantiza de verdad α = 5 % y el β elegido.</p>
          <div class="seg seg--tabla" role="group" aria-label="Error β de la tabla"><button type="button" data-act="tabla-beta" data-b="20">α 5 % · β 20 % (como la A1)</button><button type="button" data-act="tabla-beta" data-b="10">α 5 % · β 10 % (como la A2)</button></div>
          <div id="tabla-exacta-out" class="tabla-exacta-out"><p class="step-note">Calculando…</p></div>
          <p class="step-note">Toca una casilla para llevar ese plan a la calculadora de arriba (con tu N, si lo has escrito). La tabla supone un lote grande o de tamaño desconocido; si el lote es pequeño, escribe N arriba y la app te dará un plan con menos historias. Una raya (—) indica que el umbral no es menor que el estándar.</p>
        </div></details>`;
      },
      exampleText: "Ejemplo (tema 4 del curso): vigilar el registro del dolor en el triaje de Urgencias. Estándar 85 %, umbral 60 %, α = 5 % (falsa alarma) y β = 20 % (fuego sin alarma).",
      compute(v) {
        const E = [];
        R(E, v, "pU", "Estándar", 0, 100, false, false);
        R(E, v, "pL", "Umbral", 0, 100, false, false);
        if (!E.length && v.pL >= v.pU) E.push({ f: "pL", m: "El umbral (línea roja) debe ser menor que el estándar." });
        R(E, v, "alpha", "Error α", 0, 50, false, false);
        R(E, v, "beta", "Error β", 0, 50, false, false);
        Npop(E, v, 2);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (!E.length && v.N && Math.round(v.pL / 100 * v.N) >= Math.round(v.pU / 100 * v.N)) E.push({ f: "N", m: "Con ese tamaño de lote, el umbral y el estándar corresponden al mismo número de casos que cumplen; sepáralos más o aumenta N." });
        if (E.length) return { errors: E };
        const pL = v.pL / 100, pU = v.pU / 100, alpha = v.alpha / 100, beta = v.beta / 100, L = v.loss / 100, N = v.N || 0;
        // Cruce de convenciones (ver comentario de cabecera)
        const r = S.lqas({ pL, pU, alpha: beta, beta: alpha, N, loss: L });
        if (!r.found) return { errors: [], warnOnly: [`No existe ninguna regla con n ≤ ${nf(r.nMax, 0)} que cumpla los errores pedidos. Separa más el umbral del estándar o acepta errores α y β mayores.`] };
        const n = r.n, c = r.d, hyp = r.method === "hypergeometric";
        const aR = r.betaReal, bR = r.alphaReal;   // α real (rojo en el estándar) y β real (verde en el umbral)
        const pAcc = S.lqasPAccept;                // P(X ≥ c | p): probabilidad de salir verde
        const steps = [];
        steps.push({ t: "Modelo de la muestra", f: hyp
          ? [`Se revisan n casos de un lote de N = ${nf(N, 0)}. X = nº de casos que cumplen.`, `X ~ Hipergeométrica(N, K, n), con K = round(p·N)`, `K en el umbral = ${nf(r.KL, 0)} de ${nf(N, 0)}   ·   K en el estándar = ${nf(r.KU, 0)} de ${nf(N, 0)}`]
          : ["Se revisan n casos. X = nº de casos que cumplen.", "X ~ Binomial(n, p)  (lote grande o de tamaño desconocido)"],
          note: "Regla: si X ≥ c → verde (se acepta); si X < c → rojo (hay que investigar)." });
        steps.push({ t: "Condiciones que debe cumplir la regla (n, c)", f: [
          `α (falsa alarma):     P(X < c | p = estándar = ${nf(pU, 4)}) ≤ ${nf(alpha, 4)}`,
          `β (fuego sin alarma): P(X ≥ c | p = umbral = ${nf(pL, 4)}) ≤ ${nf(beta, 4)}`], note: "Se busca el menor n (1, 2, 3…) para el que existe algún c que cumple las dos condiciones; si valen varios c, se elige el que deja el mayor de los dos errores reales más bajo." });
        const rows = [c - 1, c, c + 1].filter(x => x >= 0 && x <= n).map(x => ({ c: x, a: 1 - pAcc(n, x, N, pU), b: pAcc(n, x, N, pL) }));
        const tbl = `<div class="table-wrap"><table class="mini"><thead><tr><th>c (con n = ${n})</th><th>α real</th><th>β real</th><th>¿Cumple?</th></tr></thead><tbody>` +
          rows.map(x => `<tr class="${x.c === c ? "sel" : ""}"><td>${x.c}</td><td>${pc(x.a, 2)}</td><td>${pc(x.b, 2)}</td><td>${x.a <= alpha + 1e-12 && x.b <= beta + 1e-12 ? "sí" : "no"}</td></tr>`).join("") + "</tbody></table></div>";
        steps.push({ t: "Resultado de la búsqueda", f: [`n = ${n}   ·   c = ${c}`, `α real = P(X < ${c} | estándar) = ${pc(aR, 3)}`, `β real = P(X ≥ ${c} | umbral) = ${pc(bR, 3)}`], html: tbl, note: n > 1 ? `Con n = ${n - 1} no existe ningún c que cumpla las dos condiciones.` : "" });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n_final = ${n} / (1 − ${nf(L, 4)}) → ${r.nFinal}`], note: `La regla (c = ${c}) se aplica a ${n} casos evaluables: si algún caso no sirve, sigue hasta reunir ${n}.` });
        const warns = [];
        if (pU - pL < 0.15) warns.push("El umbral y el estándar están muy próximos (menos de 15 puntos): LQAS necesitará muchos casos. Valora separarlos.");
        if (n >= N && N) warns.push("Hay que revisar TODO el lote (n = N): con esos valores no se puede ahorrar muestra.");
        if (v.beta > 20) warns.push("Un error β (fuego sin alarma) mayor del 20 % es poco habitual: dejarías pasar demasiados servicios que están mal.");
        const notes = [];
        if (hyp && r.binomial) notes.push(`Con un lote de N = ${nf(N, 0)} basta revisar <b>${n}</b> casos (hipergeométrica); si no se conociera el tamaño del lote (binomial) harían falta ${r.binomial.n} (c = ${r.binomial.d}).`);
        if (hyp) notes.push("Con N conocido, el estándar y el umbral se redondean al número entero de casos que cumplen más cercano (K = round(p·N)). La hipergeométrica sigue siendo válida aunque la muestra sea más del 10 % del lote.");
        notes.push("Entre el umbral y el estándar (zona gris) puede salir verde o rojo; LQAS no estima el cumplimiento real.");
        notes.push("¿Por qué no coincide con las tablas de Lemeshow? Las tablas clásicas son aproximadas y, con muestras pequeñas, el error β real puede ser mucho mayor que el anunciado. Por ejemplo, para estándar 85 %, umbral 60 %, α 5 % y β 20 % la tabla da n = 16 y c = 11, pero esa regla tiene en realidad un β del 33 %. Esta calculadora hace el cálculo exacto, así que garantiza los errores que pides, a veces a cambio de algunos casos más (aquí, 22 y 16).");
        const sem = `<div class="semaforo"><div class="sem sem--verde"><span class="sem-luz" aria-hidden="true"></span><div><b>${c} o más cumplen</b><span>Verde: sin evidencia de problema</span></div></div><div class="sem sem--rojo"><span class="sem-luz" aria-hidden="true"></span><div><b>${c - 1} o menos cumplen</b><span>Rojo: hay que investigar</span></div></div></div>`;
        return {
          big: { label: "Historias a revisar (n)", value: nf(r.nFinal, 0), sub: `Número de decisión c = ${c} cumplimientos` + (L > 0 ? ` · n evaluables = ${n}` : "") },
          extras: [["n", nf(n, 0)], ["c", nf(c, 0)], ["α real", pc(aR, 1)], ["β real", pc(bR, 1)], ["Modelo", hyp ? "Hipergeométrica" : "Binomial"]],
          interp: `Revisa <b>${n}</b> historias elegidas al azar. Si al menos <b>${c}</b> cumplen → <b>verde</b>: no hay evidencia de que se incumpla el estándar del ${nf(v.pU)} %. Si cumplen ${c - 1} o menos → <b>rojo</b>: hay que investigar. Si el servicio cumple de verdad el estándar, solo saldrá rojo por mala suerte el ${pc(aR, 1)} de las veces (falsa alarma); si está en el umbral del ${nf(v.pL)} % o peor, saldrá verde por error como mucho el ${pc(bR, 1)} de las veces (fuego sin alarma).`,
          warns, notes, steps, mini: `n = ${nf(r.nFinal, 0)} · c = ${c}`,
          plan: { n, c }, sem, extraHtml: ocChart(n, c, N, pL, pU, aR, bR) + sorteoHtml(r.nFinal, N)
        };
      }
    },

    // ===================== REPARTO POR ESTRATOS =====================
    {
      id: "estratos", short: "Reparto por estratos", title: "Repartir la muestra por estratos",
      q: "¿Tu población tiene grupos distintos (turnos, unidades, consultas) y quieres que todos estén representados?",
      a: "Calculadora de <b>reparto por estratos</b> (muestreo estratificado)",
      what: "Reparte el tamaño de muestra que ya has calculado entre los grupos (estratos) de la población, y sortea los casos dentro de cada grupo.",
      when: "Úsala cuando la población tiene subgrupos que pueden comportarse distinto (mañana, tarde y noche; varias plantas o consultas) y quieres que la muestra los refleje a todos. Primero calcula cuántos casos necesitas con <a href=\"#/proporcion\">Un porcentaje</a> u otra calculadora.",
      idea: "Si en una caja de bombones hay tres sabores y quieres opinar de la caja entera, coges de cada sabor <b>en proporción</b> a cuántos hay: más de los que abundan y menos de los raros. Así ningún sabor queda fuera por mala suerte.",
      facil: `
        <h3>Dos formas de repartir</h3>
        <ul>
          <li><b>Proporcional</b> (la habitual): cada estrato aporta casos según su tamaño. Con 300 historias de mañana, 200 de tarde y 100 de noche, y una muestra de 60: <b>30, 20 y 10</b>. El porcentaje global se calcula directamente con todos los casos juntos.</li>
          <li><b>Igual en cada estrato</b>: el mismo número en todos. Sirve para <b>comparar</b> estratos entre sí, pero para dar un porcentaje global hay que <b>ponderar</b> cada estrato por su tamaño.</li>
        </ul>
        <div class="box box--practica"><span class="box-tag">En la práctica</span><p>Si lo que quieres es una <b>decisión para cada unidad</b> (por ejemplo, «¿alcanza el estándar cada planta?»), no repartas una muestra: haz un <a href="#/lqas">LQAS</a> por unidad, con su propio n.</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p>Estratificar no arregla una muestra de conveniencia: dentro de cada estrato los casos se tienen que <b>sortear</b>. La app lo hace por ti si indicas el tamaño de cada estrato.</p></div>`,
      fields: [],
      custom: true,
      newRow: { nom: "", N: "" },
      defaults: { n: "", modo: "prop", rows: [{ nom: "", N: "" }, { nom: "", N: "" }, { nom: "", N: "" }] },
      example: { n: "60", modo: "prop", rows: [{ nom: "Turno de mañana", N: "300" }, { nom: "Turno de tarde", N: "200" }, { nom: "Turno de noche", N: "100" }] },
      exampleText: "Ejemplo: se van a auditar 60 historias de un periodo con 300 ingresos de mañana, 200 de tarde y 100 de noche.",
      formHtml() {
        const st = state[this.id];
        const rows = st.rows.map((r, i) => `<div class="cmp-row" data-row="${i}">
          <div class="cmp-row-head"><span class="cmp-num">${i + 1}</span><input class="cmp-in cmp-nom" data-row="${i}" data-k="nom" type="text" autocomplete="off" placeholder="Estrato ${i + 1} (p. ej. turno de noche)" aria-label="Nombre del estrato ${i + 1}" value="${esc(r.nom)}" />${st.rows.length > 1 ? `<button type="button" class="icon-btn cmp-del" data-act="cmp-del" data-row="${i}" aria-label="Quitar el estrato ${i + 1}">✕</button>` : ""}</div>
          <div class="cmp-nums cmp-nums--1"><label><span>Casos en el estrato (N)</span><input class="cmp-in" data-row="${i}" data-k="N" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.N)}" /></label></div></div>`).join("");
        return `<div class="field"><div class="field-head"><span class="field-label">Tamaño de muestra total (n)</span><button type="button" class="info-btn" data-info="est-n" aria-expanded="false" aria-label="Ayuda: tamaño de muestra">i</button></div>
          <p class="help" id="help-est-n" hidden>El número de casos que ya has calculado con otra calculadora (por ejemplo, con Un porcentaje), incluidas las pérdidas.</p>
          <div class="input-wrap"><input class="cmp-in" data-k="n" type="text" inputmode="numeric" autocomplete="off" placeholder="p. ej. 60" aria-label="Tamaño de muestra total" value="${esc(st.n)}" /><span class="input-unit">casos</span></div></div>
          <div class="field"><div class="field-head"><span class="field-label">Forma de repartir</span></div>
          <div class="seg" data-seg="modo"><button type="button" data-v="prop" class="${st.modo === "prop" ? "active" : ""}">Proporcional</button><button type="button" data-v="igual" class="${st.modo === "igual" ? "active" : ""}">Igual en cada estrato</button></div></div>
          <div class="field"><div class="field-head"><span class="field-label">Estratos</span></div>
          <div id="cmp-rows">${rows}</div>
          <button type="button" class="btn cmp-add" data-act="cmp-add">+ Añadir estrato</button></div>`;
      },
      compute() {
        const st = state[this.id], E = [], ok = [];
        const n = parseNum(st.n);
        if (n === null) E.push({ m: "Falta el tamaño de muestra total (n).", missing: true });
        else if (!Number.isInteger(n) || n < 1) E.push({ m: "El tamaño de muestra debe ser un número entero mayor que 0." });
        st.rows.forEach((r, i) => {
          const N = parseNum(r.N), nom = r.nom.trim() || `Estrato ${i + 1}`;
          if (N === null) return;
          if (!Number.isInteger(N) || N < 1) { E.push({ m: `«${nom}»: el número de casos debe ser un entero mayor que 0.` }); return; }
          ok.push({ nom, N });
        });
        if (!E.length && ok.length < 2) E.push({ m: "Indica al menos dos estratos con su número de casos.", missing: true });
        if (E.length) return { errors: E };
        const Ntot = ok.reduce((a, r) => a + r.N, 0), nh = S.allocate(n, ok.map(r => r.N), st.modo), nUsado = nh.reduce((a, b) => a + b, 0);
        const pc1 = x => nf(x * 100, 1) + " %";
        const filas = ok.map((r, i) => `<tr><td>${esc(r.nom)}</td><td>${nf(r.N, 0)}</td><td>${pc1(r.N / Ntot)}</td><td><b>${nh[i]}</b></td><td>${pc1(nh[i] / r.N)}</td></tr>`).join("");
        const tabla = `<div class="chart-card"><h3>Reparto de la muestra</h3><div class="table-wrap"><table class="mini"><thead><tr><th>Estrato</th><th>N</th><th>% de la población</th><th>Casos a revisar</th><th>Fracción</th></tr></thead><tbody>${filas}<tr class="sel"><td>Total</td><td>${nf(Ntot, 0)}</td><td>100 %</td><td>${nUsado}</td><td>${pc1(nUsado / Ntot)}</td></tr></tbody></table></div></div>`;
        const sorteo = `<div class="chart-card sorteo no-print"><h3>Sortear los casos de cada estrato</h3><p>Numera los casos de cada estrato desde el 1 y pulsa el botón: saldrá una lista de números distintos para cada uno.</p><div class="toolbar"><button class="btn btn--primary" type="button" data-act="sortear-estratos">Sortear en cada estrato</button></div><div class="sorteo-out" aria-live="polite"></div></div>`;
        const warns = [], notes = [];
        if (n > Ntot) warns.push(`La muestra pedida (${n}) es mayor que la población total (${nf(Ntot, 0)}): se revisan todos los casos.`);
        if (nh.some(x => x === 0)) warns.push("Algún estrato se queda sin casos: aumenta n o usa el reparto igual si necesitas que todos aparezcan.");
        if (st.modo === "igual") notes.push("Con reparto igual, para dar un porcentaje global hay que ponderar cada estrato por su tamaño (N del estrato ÷ N total); no vale juntar todos los casos sin más.");
        else notes.push("Con reparto proporcional, el porcentaje global se calcula juntando todos los casos revisados.");
        notes.push("Si quieres una decisión para cada estrato por separado (por ejemplo, cada planta), haz un LQAS por estrato en lugar de repartir una sola muestra.");
        const steps = [
          { t: "Tamaño total de la población", f: [`N = ${ok.map(r => r.N).join(" + ")} = ${Ntot}`] },
          st.modo === "igual"
            ? { t: "Reparto igual", f: [`n por estrato = n ÷ nº de estratos = ${n} ÷ ${ok.length} = ${nfix(n / ok.length, 2)}`], note: "Se redondea de forma que la suma sea exactamente n (método de los restos mayores), sin superar el tamaño de ningún estrato." }
            : { t: "Reparto proporcional", f: ["n del estrato = n × N del estrato ÷ N", ...ok.map((r, i) => `${r.nom}: ${n} × ${r.N} ÷ ${Ntot} = ${nfix(n * r.N / Ntot, 2)} → ${nh[i]}`)], note: "Se redondea de forma que la suma sea exactamente n (método de los restos mayores)." }
        ];
        this.sorteoDatos = ok.map((r, i) => ({ nom: r.nom, n: nh[i], N: r.N }));
        return {
          big: { label: "Casos a revisar en total", value: nf(nUsado, 0), sub: `repartidos en ${ok.length} estratos (${st.modo === "igual" ? "igual en cada uno" : "proporcional"})` },
          extras: ok.map((r, i) => [r.nom, nf(nh[i], 0)]),
          interp: `Revisa ${(l => l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l[0])(ok.map((r, i) => `<b>${nh[i]}</b> de «${esc(r.nom)}»`))}, elegidos al azar dentro de cada estrato.`,
          warns, notes, steps, mini: nf(nUsado, 0), extraHtml: tabla + sorteo
        };
      }
    },

    // ===================== MUESTREO POR CONGLOMERADOS (EFECTO DE DISEÑO) =====================
    {
      id: "conglomerados", short: "Conglomerados", title: "Muestreo por conglomerados (efecto de diseño)",
      q: "¿Vas a sortear plantas, centros o consultas y revisar varias historias en cada uno?",
      a: "Calculadora de <b>muestreo por conglomerados</b> (efecto de diseño)",
      what: "Ajusta el tamaño de muestra cuando no sorteas historias sueltas, sino <b>grupos</b> (plantas, centros de salud, consultas, días) y revisas varias historias dentro de cada grupo. Te dice cuántas historias más necesitas y cuántos grupos sortear.",
      when: "Úsala cuando revisar historias sueltas de todo el área no es práctico y prefieres ir a unos pocos sitios y revisar varias en cada uno. Primero calcula n con <a href=\"#/proporcion\">Un porcentaje</a> (como si fuera un sorteo de historias sueltas) y luego ajústalo aquí.",
      idea: "Diez historias de la <b>misma planta</b> se parecen entre sí (mismo equipo, mismas costumbres, mismos impresos): aportan menos información que diez historias de diez plantas distintas. Es como preguntar la opinión a diez personas de la misma familia: no equivale a preguntar a diez familias.",
      facil: `
        <h3>Los datos, explicados sin estadística</h3>
        <ul>
          <li><b>n</b>: el tamaño que te ha dado otra calculadora, como si sortearas historias sueltas (con las pérdidas ya incluidas).</li>
          <li><b>m</b>: cuántas historias vas a revisar en cada conglomerado (planta, centro, consulta…).</li>
          <li><b>ICC</b> (correlación intraclase): cuánto se parecen entre sí los casos de un mismo conglomerado, de 0 (nada) a 1 (son idénticos). En indicadores de proceso entre unidades o centros suele estar entre <b>0,01 y 0,15</b>. Si no lo conoces, prueba con 0,05 y con 0,10 para ver cuánto cambia.</li>
        </ul>
        <p class="formula">Efecto de diseño = 1 + (m − 1) × ICC        n ajustado = n × efecto de diseño</p>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto</span>
          <p>Para estimar un porcentaje con ±10 % hacían falta <b>97 historias</b> sueltas. Si en lugar de eso sorteamos plantas y revisamos <b>10 historias en cada una</b>, con un ICC de 0,05:</p>
          <p class="formula">Efecto de diseño = 1 + 9 × 0,05 = 1,45        97 × 1,45 = 140,65 → 141 historias</p>
          <p>141 ÷ 10 = 14,1 → hay que sortear <b>15 plantas</b> y revisar 10 historias en cada una (150 en total).</p></div>
        <div class="box box--practica"><span class="box-tag">En la práctica</span><p>Mejor <b>muchos conglomerados con pocas historias</b> cada uno que pocos con muchas: con m = 5 el efecto de diseño es menor que con m = 20. Y los conglomerados también se tienen que <b>sortear</b>.</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa</span><p>Si quieres una <b>decisión para cada planta</b> («¿alcanza el estándar esta unidad?»), esto no es lo tuyo: haz un <a href="#/lqas">LQAS</a> por unidad. Los conglomerados sirven para una cifra global del área o del hospital.</p></div>`,
      fields: [
        { id: "n", label: "Tamaño de muestra sin conglomerados (n)", unit: "casos", def: "", ph: "p. ej. 97",
          help: "El número de casos que te ha dado otra calculadora (por ejemplo, Un porcentaje) suponiendo que sorteas historias sueltas. Si ya incluye pérdidas, no hace falta volver a sumarlas." },
        { id: "m", label: "Casos a revisar en cada conglomerado (m)", unit: "casos", def: "10", quick: [5, 10, 20],
          help: "Cuántas historias revisarás en cada planta, centro o consulta sorteada. Cuantas menos por conglomerado (y más conglomerados), menor es la penalización." },
        { id: "icc", label: "Correlación intraclase (ICC)", def: "0,05", quick: [0.01, 0.05, 0.1, 0.15],
          help: "Cuánto se parecen entre sí los casos de un mismo conglomerado, de 0 a 1. En indicadores de proceso entre unidades o centros suele estar entre 0,01 y 0,15. Si no lo conoces, prueba 0,05 y 0,10. Puedes estimarlo con datos de una auditoría anterior." },
        { id: "M", label: "Conglomerados disponibles", unit: "conglomerados", opt: true, def: "", ph: "opcional",
          help: "Cuántas plantas, centros o consultas hay en total para sortear. Si lo indicas, la app comprueba que hay suficientes y puede sortear cuáles visitar." }
      ],
      example: { n: "97", m: "10", icc: "0,05", M: "24" },
      exampleText: "Ejemplo: se querían 97 historias para estimar un porcentaje con ±10 %. En vez de sortear historias sueltas de todo el hospital, se sortean plantas (hay 24) y se revisan 10 historias en cada una.",
      compute(v) {
        const E = [];
        R(E, v, "n", "Tamaño de muestra n", 1, 1e7, true, true);
        if (!E.length && !Number.isInteger(v.n)) E.push({ f: "n", m: "El tamaño de muestra debe ser un número entero." });
        R(E, v, "m", "Casos por conglomerado m", 1, 1e5, true, true);
        if (!E.some(e => e.f === "m") && !Number.isInteger(v.m)) E.push({ f: "m", m: "Los casos por conglomerado deben ser un número entero." });
        R(E, v, "icc", "ICC", 0, 1, true, true);
        if (v.M !== null && (Number.isNaN(v.M) || v.M < 1 || !Number.isInteger(v.M))) E.push({ f: "M", m: "Los conglomerados disponibles deben ser un número entero (o déjalo vacío)." });
        if (E.length) return { errors: E };
        const r = S.clusterSample(v.n, v.m, v.icc), M = v.M || 0;
        const steps = [
          { t: "Efecto de diseño (DEFF)", f: ["DEFF = 1 + (m − 1) × ICC", `DEFF = 1 + (${nf(v.m, 0)} − 1) × ${nf(v.icc, 4)} = ${nfix(r.deff, 3)}`], note: "Cuánto «vale menos» cada historia por estar agrupada con otras parecidas. Con DEFF = 1,5 hacen falta un 50 % más de historias." },
          { t: "Tamaño ajustado", f: ["n ajustado = n × DEFF", `n ajustado = ${nf(v.n, 0)} × ${nfix(r.deff, 3)} = ${nfix(v.n * r.deff, 2)} → ${r.nAdj}`] },
          { t: "Número de conglomerados", f: ["k = n ajustado ÷ m", `k = ${r.nAdj} ÷ ${nf(v.m, 0)} = ${nfix(r.nAdj / v.m, 2)} → ${r.k}`, `Total a revisar = k × m = ${r.k} × ${nf(v.m, 0)} = ${r.total}`], note: "Se redondea hacia arriba para no quedarse corto." }
        ];
        const warns = [], notes = [];
        if (M && r.k > M) warns.push(`Harían falta ${r.k} conglomerados y solo hay ${M}: revisa más historias en cada uno (sube m) o considera revisar todos los conglomerados.`);
        if (r.k < 5) warns.push("Con menos de 5 conglomerados el resultado depende demasiado de qué sitios salgan en el sorteo: mejor más conglomerados con menos historias cada uno.");
        if (v.icc > 0.3) warns.push("Un ICC mayor de 0,3 es muy alto: los casos de un mismo sitio serían casi iguales. Comprueba el valor.");
        if (v.m >= 20 && v.icc >= 0.05) notes.push(`Con ${nf(v.m, 0)} historias por conglomerado la penalización es grande. Prueba con m = 5: el efecto de diseño bajaría a ${nfix(1 + 4 * v.icc, 2)}.`);
        notes.push("El ICC casi nunca se conoce con exactitud: compara el resultado con un ICC algo mayor para ver si el plan sigue siendo viable.");
        return {
          big: { label: "Conglomerados a sortear", value: nf(r.k, 0), sub: `con ${nf(v.m, 0)} casos en cada uno · ${nf(r.total, 0)} casos en total` },
          extras: [["Efecto de diseño", nfix(r.deff, 2)], ["n ajustado", nf(r.nAdj, 0)], ["n sin conglomerados", nf(v.n, 0)]],
          interp: `Como las historias de un mismo sitio se parecen entre sí, en lugar de ${nf(v.n, 0)} historias sueltas necesitas <b>${nf(r.nAdj, 0)}</b> (un ${nf((r.deff - 1) * 100, 0)} % más). Sortea <b>${nf(r.k, 0)} conglomerados</b> y revisa <b>${nf(v.m, 0)}</b> historias elegidas al azar en cada uno.`,
          warns, notes, steps, mini: `${nf(r.k, 0)} × ${nf(v.m, 0)}`, extraHtml: M ? sorteoHtml(Math.min(r.k, M), M, "conglomerados") : ""
        };
      }
    },

    // ===================== 6. INDICADOR COMPUESTO =====================
    // No calcula un tamaño de muestra: resume los resultados de una auditoría con varios criterios.
    // Porcentaje simple (Saturno, UT19): Σ cumplimientos ÷ Σ oportunidades.
    {
      id: "compuesto", short: "Indicador compuesto", title: "Indicador compuesto (porcentaje simple)",
      q: "¿Has auditado varios criterios y quieres resumirlos en un solo número?",
      a: "Calculadora del <b>indicador compuesto</b> (porcentaje simple)",
      what: "Resume en un solo porcentaje varios criterios auditados a la vez (por ejemplo, todo el paquete de valoración al ingreso), y muestra el desglose de cada uno. No calcula cuántos casos revisar: sirve para <b>analizar los resultados</b> de la auditoría.",
      when: "Úsala cuando cada paciente tiene varios criterios que cumplir y quieres responder a «¿con qué frecuencia recibieron los pacientes una atención de calidad?». Cada criterio se cuenta solo en los casos en los que se aplica.",
      idea: "El compuesto es como la <b>nota final de la asignatura</b>, hecha con las notas de varios exámenes. Pero ojo: <b>el compuesto es el titular; el desglose, la noticia</b>. Nunca presentes uno sin el otro.",
      facil: `
        <h3>El truco: contar oportunidades</h3>
        <p>No todos los criterios se aplican a todos los pacientes: el consejo antitabaco solo tiene sentido en fumadores. Por eso cada criterio tiene su propio denominador, el número de casos en los que se <b>podía</b> haber actuado bien. Cada una de esas ocasiones es una <b>oportunidad</b>.</p>
        <p class="formula">Compuesto (%) = Σ cumplimientos de todos los criterios ÷ Σ oportunidades × 100</p>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto: atención al infarto (15 pacientes)</span>
          <p>Se auditan 15 pacientes y seis criterios (aspirina y β-bloqueantes en las primeras 24 h y al alta, consejo antitabaco y trombolíticos en 30 minutos). Cada criterio se evaluó en un número distinto de pacientes.</p>
          <p>Solo hemos revisado 15 pacientes, pero hemos contado <b>40 oportunidades</b> de actuar bien, y en <b>28</b> se actuó bien: 28 ÷ 40 = <b>70 %</b>. Pulsa <b>Cargar ejemplo</b> para verlo con el desglose.</p></div>
        <h3>Para qué sirve</h3>
        <ul>
          <li>Da un número fácil de entender y de comparar entre unidades, centros o periodos.</li>
          <li>Cada paciente aporta varias oportunidades, así que responde a la pregunta general con menos pacientes.</li>
          <li>El desglose por criterios sigue ahí para saber dónde está el problema.</li>
        </ul>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampas</span>
          <p><b>1. Pesan más los criterios que más se evalúan.</b> En el ejemplo, la aspirina inicial aporta 12 de las 40 oportunidades; el consejo antitabaco, solo 3. No siempre es malo, pero hay que saberlo.</p>
          <p><b>2. Un buen titular puede esconder una mala noticia.</b> El compuesto dice 70 %, pero el consejo antitabaco está en el 33 %. Enseña siempre el desglose.</p>
          <p><b>3. No todos los «compuestos» son iguales.</b> La media de los porcentajes (aquí 63,9 %) o el porcentaje de pacientes con todo correcto dan cifras distintas con los mismos datos. Di siempre qué método has usado.</p>
          <p><b>4. Cuarenta oportunidades no son cuarenta pacientes.</b> Las de un mismo paciente se parecen entre sí: el compuesto gana precisión, pero no tanta como si fueran 40 pacientes distintos.</p></div>`,
      fields: [],
      custom: true,
      newRow: { nom: "", cum: "", opo: "" },
      defaults: { pac: "", rows: [{ nom: "", cum: "", opo: "" }, { nom: "", cum: "", opo: "" }, { nom: "", cum: "", opo: "" }] },
      example: { pac: "15", rows: [
        { nom: "Aspirina en las primeras 24 h", cum: "10", opo: "12" },
        { nom: "β-bloqueantes en las primeras 24 h", cum: "4", opo: "6" },
        { nom: "Aspirina al alta", cum: "4", opo: "5" },
        { nom: "β-bloqueantes al alta", cum: "2", opo: "4" },
        { nom: "Consejo antitabaco", cum: "1", opo: "3" },
        { nom: "Trombolíticos en los primeros 30 minutos", cum: "7", opo: "10" }] },
      exampleText: "Ejemplo (adaptado de Courtney y cols., citado por Saturno, UT19): atención al infarto de miocardio en 15 pacientes, con seis criterios.",
      formHtml() {
        const st = state[this.id];
        const rows = st.rows.map((r, i) => `<div class="cmp-row" data-row="${i}">
          <div class="cmp-row-head"><span class="cmp-num">${i + 1}</span><input class="cmp-in cmp-nom" data-row="${i}" data-k="nom" type="text" autocomplete="off" placeholder="Criterio ${i + 1} (p. ej. escala de caídas)" aria-label="Nombre del criterio ${i + 1}" value="${esc(r.nom)}" />${st.rows.length > 1 ? `<button type="button" class="icon-btn cmp-del" data-act="cmp-del" data-row="${i}" aria-label="Quitar el criterio ${i + 1}">✕</button>` : ""}</div>
          <div class="cmp-nums"><label><span>Cumplen</span><input class="cmp-in" data-row="${i}" data-k="cum" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.cum)}" /></label><label><span>Oportunidades</span><input class="cmp-in" data-row="${i}" data-k="opo" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.opo)}" /></label></div></div>`).join("");
        return `<div class="field"><div class="field-head"><span class="field-label">Criterios auditados</span><button type="button" class="info-btn" data-info="cmp" aria-expanded="false" aria-label="Ayuda: criterios">i</button></div>
          <p class="help" id="help-cmp" hidden>Para cada criterio escribe cuántos casos lo cumplen y en cuántos se podía aplicar (oportunidades). Si un criterio no se aplica a un paciente (el consejo antitabaco en un no fumador), ese paciente no cuenta en sus oportunidades.</p>
          <div id="cmp-rows">${rows}</div>
          <button type="button" class="btn cmp-add" data-act="cmp-add">+ Añadir criterio</button></div>
          <div class="field"><div class="field-head"><span class="field-label">Pacientes o casos auditados</span><span class="field-opt">(opcional)</span></div>
          <div class="input-wrap"><input class="cmp-in" data-k="pac" type="text" inputmode="numeric" autocomplete="off" placeholder="opcional" aria-label="Pacientes auditados" value="${esc(st.pac)}" /><span class="input-unit">casos</span></div></div>`;
      },
      compute() {
        const st = state[this.id], E = [], ok = [];
        const isInt = x => x !== null && Number.isInteger(x) && x >= 0;
        st.rows.forEach((r, i) => {
          const c = parseNum(r.cum), o = parseNum(r.opo), nom = r.nom.trim() || `Criterio ${i + 1}`;
          if (c === null && o === null) return;
          if (!isInt(c) || !isInt(o)) { E.push({ m: `«${nom}»: cumplen y oportunidades deben ser números enteros (0, 1, 2…).` }); return; }
          if (o === 0) { E.push({ m: `«${nom}»: las oportunidades deben ser al menos 1.` }); return; }
          if (c > o) { E.push({ m: `«${nom}»: no puede haber más cumplimientos (${c}) que oportunidades (${o}).` }); return; }
          ok.push({ nom, c, o, p: c / o });
        });
        if (E.length) return { errors: E };
        if (!ok.length) return { errors: [{ m: "Rellena al menos un criterio con sus cumplimientos y oportunidades.", missing: true }] };
        const { sc, so, comp, mean: media } = S.composite(ok);
        const pac = parseNum(st.pac);
        const peso = r => r.o / so;
        const pc1 = x => nfix(x * 100, 1) + " %";
        const lista = a => a.length > 1 ? a.slice(0, -1).join(", ") + " y " + a[a.length - 1] : a[0];
        const steps = [
          { t: "Suma de cumplimientos", f: [`Σ cumplimientos = ${ok.map(r => r.c).join(" + ")} = ${sc}`] },
          { t: "Suma de oportunidades", f: [`Σ oportunidades = ${ok.map(r => r.o).join(" + ")} = ${so}`] },
          { t: "Indicador compuesto (porcentaje simple)", f: ["Compuesto = Σ cumplimientos ÷ Σ oportunidades × 100", `Compuesto = ${sc} ÷ ${so} × 100 = ${nfix(comp * 100, 1)} %`] },
          { t: "Para comparar: media de los porcentajes (otro método)", f: [`(${ok.map(r => nfix(r.p * 100, 1)).join(" + ")}) ÷ ${ok.length} = ${nfix(media * 100, 1)} %`], note: "No es el compuesto: da el mismo peso a un criterio con 3 oportunidades que a uno con 12. Por eso las dos cifras no coinciden." }
        ];
        const ordenados = ok.slice().sort((a, b) => a.p - b.p);
        const flojos = ordenados.filter(r => r.p < comp - 0.15);
        const masPeso = ok.slice().sort((a, b) => b.o - a.o)[0];
        const warns = [];
        if (flojos.length) warns.push(`El titular esconde una mala noticia: ${lista(flojos.map(r => `<b>${esc(r.nom)}</b> (${pc1(r.p)})`))} ${flojos.length > 1 ? "están" : "está"} más de 15 puntos por debajo del compuesto. Enséñalo en el desglose.`);
        if (pac !== null && Number.isFinite(pac) && pac > 0 && ok.some(r => r.o > pac)) warns.push("Algún criterio tiene más oportunidades que pacientes auditados. ¿Se ha contado alguno dos veces?");
        const notes = [`Pesa más el criterio que más se evalúa: <b>${esc(masPeso.nom)}</b> aporta ${masPeso.o} de las ${so} oportunidades (${pc1(peso(masPeso))} del compuesto).`];
        if (pac !== null && Number.isFinite(pac) && pac > 0) notes.push(`Con ${nf(pac, 0)} pacientes se han contado ${so} oportunidades. Ojo: ${so} oportunidades no equivalen a ${so} pacientes distintos, porque las de un mismo paciente se parecen entre sí.`);
        notes.push("Al presentar el resultado, di qué método has usado (porcentaje simple) y acompáñalo siempre del desglose.");
        const bars = `<div class="chart-card"><h3>Desglose por criterio</h3><div class="cmp-bars">${ok.map(r => `<div class="cmp-bar${r.p < comp - 0.15 ? " cmp-bar--flojo" : ""}"><div class="cmp-bar-top"><span>${esc(r.nom)}</span><b>${pc1(r.p)}</b></div><div class="cmp-track"><div class="cmp-fill" style="width:${(r.p * 100).toFixed(1)}%"></div><div class="cmp-mark" style="left:${(comp * 100).toFixed(1)}%"></div></div><div class="cmp-bar-sub">${r.c} de ${r.o} · peso ${pc1(peso(r))}</div></div>`).join("")}</div><p>La línea vertical marca el compuesto (${pc1(comp)}). En ámbar, los criterios que quedan muy por debajo.</p></div>`;
        const peor = ordenados[0];
        return {
          big: { label: "Indicador compuesto", value: nfix(comp * 100, 1) + " %", sub: `${sc} cumplimientos de ${so} oportunidades` + (pac ? ` · ${nf(pac, 0)} pacientes` : "") },
          extras: [["Criterios", nf(ok.length, 0)], ["Media de porcentajes", pc1(media)], ["Peor criterio", pc1(peor.p)]],
          interp: `De cada 100 oportunidades de actuar bien, en <b>${nf(comp * 100, 0)}</b> se actuó bien. Ese es el titular. La noticia está en el desglose: lo más flojo es <b>${esc(peor.nom)}</b> (${pc1(peor.p)})${ordenados[1] ? ` y <b>${esc(ordenados[1].nom)}</b> (${pc1(ordenados[1].p)})` : ""}.`,
          warns, notes, steps, mini: nfix(comp * 100, 1) + " %", extraHtml: bars
        };
      }
    },

    // ===================== CONCORDANCIA ENTRE AUDITORES (KAPPA) =====================
    {
      id: "concordancia", short: "Concordancia (kappa)", title: "Concordancia entre auditores (kappa)",
      q: "¿Quieres comprobar si dos auditoras aplican el criterio igual (pilotar un indicador)?",
      a: "Calculadora de <b>concordancia</b> (kappa de Cohen)",
      what: "Mide hasta qué punto dos personas que revisan las <b>mismas historias</b> coinciden al marcar «cumple / no cumple», descontando las coincidencias que se darían por puro azar.",
      when: "Úsala para <b>pilotar un indicador</b> antes de la auditoría: si dos auditoras no coinciden, el problema suele estar en la definición del indicador, no en las historias. También sirve para formar auditores nuevos.",
      idea: "Dos profesores corrigen el mismo examen. Si coinciden en casi todo, el criterio de corrección está claro. Pero si casi todos los alumnos aprueban, coincidirían mucho <b>aunque corrigieran a ciegas</b>: el kappa descuenta ese acuerdo «regalado» por el azar.",
      facil: `
        <h3>Cómo se hace un pilotaje</h3>
        <ol>
          <li>Elige al azar unas <b>30–50 historias</b>, que incluyan casos que cumplen y que no.</li>
          <li>Dos auditoras las revisan <b>por separado</b>, sin comentarlas.</li>
          <li>Se cuenta en cuántas coinciden y en cuántas no, y se rellena la tabla de arriba.</li>
          <li>Si el kappa es bajo, se revisan juntas las discrepancias, se <b>aclara la definición</b> del indicador y se repite con otras historias.</li>
        </ol>
        <h3>Cómo leer el kappa</h3>
        <div class="table-wrap"><table class="mini facil-tabla"><thead><tr><th>Kappa</th><th>Concordancia</th><th>¿Qué hacer?</th></tr></thead><tbody>
          <tr><td>&lt; 0,20</td><td>Pobre o leve</td><td>Redefinir el indicador</td></tr>
          <tr><td>0,21 – 0,40</td><td>Aceptable (débil)</td><td>Aclarar términos y repetir</td></tr>
          <tr><td>0,41 – 0,60</td><td>Moderada</td><td>Aclarar las discrepancias</td></tr>
          <tr><td>0,61 – 0,80</td><td>Buena (considerable)</td><td>Suficiente para auditar</td></tr>
          <tr><td>0,81 – 1</td><td>Muy buena (casi perfecta)</td><td>Ideal</td></tr>
        </tbody></table></div>
        <p class="step-note">Escala de Landis y Koch (1977). En auditoría se suele pedir al menos 0,60.</p>
        <div class="box box--ejemplo"><span class="box-tag">Ejemplo resuelto</span><p>Dos auditoras revisan las mismas 30 historias buscando la escala de caídas registrada. Coinciden en 25 (20 «cumple» y 5 «no cumple»): un 83 % de acuerdo, que parece mucho. Pero, como la mayoría cumple, por azar ya coincidirían en un 62 %. El kappa es <b>0,56</b>: concordancia moderada. Toca aclarar qué cuenta como «escala registrada» antes de auditar.</p></div>
        <div class="box box--trampa"><span class="box-tag">Ojo, trampa: la paradoja del kappa</span><p>Si casi todas las historias cumplen (o casi ninguna), el kappa puede salir bajo aunque las auditoras coincidan en el 90 % de los casos. Por eso la app muestra también el <b>acuerdo observado</b> y el <b>PABAK</b> (kappa ajustado por prevalencia). Para pilotar, procura que la muestra tenga historias que cumplen y que no.</p></div>`,
      fields: [
        { id: "a", label: "Las dos marcan «cumple»", unit: "historias", def: "", ph: "p. ej. 20", help: "Historias en las que ambas auditoras han marcado que el criterio se cumple." },
        { id: "b", label: "A «cumple» · B «no cumple»", unit: "historias", def: "", ph: "p. ej. 2", help: "Historias en las que la auditora A ha marcado «cumple» y la B «no cumple»." },
        { id: "c", label: "A «no cumple» · B «cumple»", unit: "historias", def: "", ph: "p. ej. 3", help: "Historias en las que la auditora A ha marcado «no cumple» y la B «cumple»." },
        { id: "d", label: "Las dos marcan «no cumple»", unit: "historias", def: "", ph: "p. ej. 5", help: "Historias en las que ambas auditoras han marcado que el criterio no se cumple." }
      ],
      example: { a: "20", b: "2", c: "3", d: "5" },
      exampleText: "Ejemplo: dos auditoras revisan por separado las mismas 30 historias para comprobar si consta la escala de riesgo de caídas.",
      compute(v) {
        const E = [];
        ["a", "b", "c", "d"].forEach(k => {
          const x = v[k], lbl = this.fields.find(f => f.id === k).label;
          if (x === null) E.push({ f: k, m: `Falta «${lbl}».`, missing: true });
          else if (Number.isNaN(x) || !Number.isInteger(x) || x < 0) E.push({ f: k, m: `«${lbl}» debe ser un número entero (0, 1, 2…).` });
        });
        if (E.length) return { errors: E };
        const n = v.a + v.b + v.c + v.d;
        if (n < 2) return { errors: [{ f: "a", m: "Hacen falta al menos 2 historias revisadas por las dos auditoras." }] };
        const r = S.kappa(v.a, v.b, v.c, v.d, 0.95);
        if (!Number.isFinite(r.k)) return { errors: [], warnOnly: ["Las dos auditoras han marcado todas las historias en la misma categoría: el kappa no se puede calcular. Para pilotar un indicador hacen falta historias que cumplan y que no cumplan."] };
        const k2 = x => nfix(x, 2), p1 = x => nf(x * 100, 1) + " %";
        const nivel = r.k < 0 ? ["Peor que el azar", "Las auditoras discrepan más de lo esperable por azar: revisad juntas el criterio."]
          : r.k <= 0.20 ? ["Pobre o leve", "La definición del indicador no funciona: hay que redefinirla."]
          : r.k <= 0.40 ? ["Aceptable (débil)", "Hay que aclarar los términos del indicador y repetir el pilotaje."]
          : r.k <= 0.60 ? ["Moderada", "Conviene revisar juntas las discrepancias y aclarar la definición antes de auditar."]
          : r.k <= 0.80 ? ["Buena (considerable)", "El indicador está suficientemente claro para auditar."]
          : ["Muy buena (casi perfecta)", "El indicador está muy bien definido."];
        const tabla = `<div class="chart-card"><h3>Tabla de coincidencias</h3><div class="table-wrap"><table class="mini kappa-tabla"><thead><tr><th></th><th>B: cumple</th><th>B: no cumple</th><th>Total A</th></tr></thead><tbody>
          <tr><th>A: cumple</th><td class="kap-si">${v.a}</td><td class="kap-no">${v.b}</td><td>${v.a + v.b}</td></tr>
          <tr><th>A: no cumple</th><td class="kap-no">${v.c}</td><td class="kap-si">${v.d}</td><td>${v.c + v.d}</td></tr>
          <tr><th>Total B</th><td>${v.a + v.c}</td><td>${v.b + v.d}</td><td><b>${n}</b></td></tr></tbody></table></div><p>En verde, las coincidencias; en ámbar, las discrepancias (${v.b + v.c}), que son las que hay que revisar juntas.</p></div>`;
        const steps = [
          { t: "Acuerdo observado (po)", f: ["po = (a + d) ÷ n", `po = (${v.a} + ${v.d}) ÷ ${n} = ${nfix(r.po, 4)}`] },
          { t: "Acuerdo esperado por azar (pe)", f: ["pe = pA·pB + (1 − pA)·(1 − pB)", `pA = ${v.a + v.b} ÷ ${n} = ${nfix(r.pA, 4)} · pB = ${v.a + v.c} ÷ ${n} = ${nfix(r.pB, 4)}`, `pe = ${nfix(r.pA, 4)}·${nfix(r.pB, 4)} + ${nfix(1 - r.pA, 4)}·${nfix(1 - r.pB, 4)} = ${nfix(r.pe, 4)}`], note: "pA y pB son la proporción de «cumple» que marca cada auditora." },
          { t: "Kappa de Cohen", f: ["κ = (po − pe) ÷ (1 − pe)", `κ = (${nfix(r.po, 4)} − ${nfix(r.pe, 4)}) ÷ (1 − ${nfix(r.pe, 4)}) = ${nfix(r.k, 4)}`] },
          { t: "Intervalo de confianza al 95 % (aproximado)", f: ["ee = √( po·(1 − po) ÷ (n·(1 − pe)²) )", `ee = ${nfix(r.ee, 4)}  →  IC 95 % = κ ± 1,96·ee = ${k2(r.lo)} a ${k2(r.hi)}`], note: "Aproximación de muestra grande; con pocas historias es orientativa." },
          { t: "PABAK (ajustado por prevalencia y sesgo)", f: ["PABAK = 2·po − 1", `PABAK = 2·${nfix(r.po, 4)} − 1 = ${nfix(r.pabak, 4)}`] }
        ];
        const warns = [], notes = [];
        if (n < 30) warns.push(`Con ${n} historias el kappa es poco estable (mira lo ancho del intervalo: ${k2(r.lo)} a ${k2(r.hi)}). Para pilotar se recomiendan al menos 30.`);
        const prevAlta = Math.max(r.pA, r.pB) >= 0.85 || Math.min(r.pA, r.pB) <= 0.15;
        if (prevAlta && r.po >= 0.8 && r.k < 0.6) warns.push(`Paradoja del kappa: las auditoras coinciden en el ${p1(r.po)} de las historias, pero como casi todas están en la misma categoría, el azar explica gran parte del acuerdo. Mira también el PABAK (${k2(r.pabak)}) y, si puedes, pilota con historias más variadas.`);
        if (Math.abs((v.b) - (v.c)) >= Math.max(3, 0.2 * (v.b + v.c + 1)) && v.b + v.c >= 4) notes.push(`Las discrepancias van sobre todo en un sentido (${v.b > v.c ? "A marca «cumple» más que B" : "B marca «cumple» más que A"}): una de las auditoras es más «generosa». Revisad juntas qué exige el criterio.`);
        notes.push("Escala de interpretación de Landis y Koch (1977). En auditoría se suele pedir κ ≥ 0,60 antes de empezar.");
        return {
          big: { label: "Kappa de Cohen", value: k2(r.k), sub: `Concordancia ${nivel[0].toLowerCase()}` },
          extras: [["Acuerdo observado", p1(r.po)], ["Acuerdo por azar", p1(r.pe)], ["IC 95 %", `${k2(r.lo)} a ${k2(r.hi)}`], ["PABAK", k2(r.pabak)], ["Historias", nf(n, 0)]],
          interp: `Las dos auditoras coinciden en <b>${v.a + v.d} de ${n}</b> historias (${p1(r.po)}). Descontando lo que coincidirían por azar (${p1(r.pe)}), el kappa es <b>${k2(r.k)}</b>: concordancia <b>${nivel[0].toLowerCase()}</b>. ${nivel[1]}`,
          warns, notes, steps, mini: "κ = " + k2(r.k), extraHtml: tabla
        };
      }
    }
  ];

  // ---------- Curva característica operativa (SVG propio) ----------
  function ocChart(n, c, N, pL, pU, aR, bR) {
    const W = 360, H = 266, l = 40, r = 14, t = 30, b = 40, iw = W - l - r, ih = H - t - b;
    const X = p => l + p * iw, Y = q => t + (1 - q) * ih;
    const pts = S.lqasOC(n, c, N, 100).map(o => `${X(o.p).toFixed(1)},${Y(o.pa).toFixed(1)}`).join(" ");
    let g = "";
    for (let i = 0; i <= 4; i++) {
      const f = i / 4;
      g += `<line class="grid" x1="${l}" y1="${Y(f)}" x2="${W - r}" y2="${Y(f)}"/><text class="axis-t" x="${l - 5}" y="${Y(f) + 4}" text-anchor="end">${f * 100}</text>`;
      g += `<line class="grid" x1="${X(f)}" y1="${t}" x2="${X(f)}" y2="${t + ih}"/><text class="axis-t" x="${X(f)}" y="${t + ih + 15}" text-anchor="middle">${f * 100}</text>`;
    }
    const paL = bR, paU = 1 - aR;     // probabilidad de salir verde en el umbral y en el estándar
    const xl = X(pL), xu = X(pU);
    // Etiquetas arriba a la izquierda de cada punto: como la curva es creciente, a la izquierda
    // queda por debajo del punto y no se solapan con ella ni con la línea discontinua.
    const lbl = (cls, x, y, a, b2) => { const xx = Math.max(x - 7, l + 58); return `<text class="${cls}" x="${xx}" y="${y - 22}" text-anchor="end">${a}</text><text class="${cls}" x="${xx}" y="${y - 8}" text-anchor="end">${b2}</text>`; };
    return `<div class="chart-card"><h3>La «puerta de aceptación» (curva característica operativa)</h3>
<svg class="oc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Probabilidad de que salga verde según el cumplimiento real del servicio">
${g}
<line class="mark-l" x1="${xl}" y1="${t}" x2="${xl}" y2="${t + ih}"/><line class="mark-u" x1="${xu}" y1="${t}" x2="${xu}" y2="${t + ih}"/>
<polyline class="curve" points="${pts}"/>
<circle class="pt-l" cx="${xl}" cy="${Y(paL)}" r="5"/><circle class="pt-u" cx="${xu}" cy="${Y(paU)}" r="5"/>
${lbl("lbl-l", xl, Y(paL), `Umbral ${nf(pL * 100, 1)} %`, `β: ${nf(paL * 100, 1)} %`)}
${lbl("lbl-u", xu, Y(paU), `Estándar ${nf(pU * 100, 1)} %`, `verde: ${nf(paU * 100, 1)} %`)}
<text class="axis-t" x="${l + iw / 2}" y="${H - 5}" text-anchor="middle">Cumplimiento REAL del servicio (%) · lo que no vemos</text>
<text class="axis-t" transform="translate(11 ${t + ih / 2}) rotate(-90)" text-anchor="middle">Prob. de que salga VERDE (%)</text>
</svg>
<p>Cómo leerla: en horizontal, el cumplimiento real del servicio (que no conocemos); en vertical, la probabilidad de que la muestra salga <b>verde</b> con la regla n = ${n}, c = ${c}. Un servicio en el <b>umbral (${nf(pL * 100, 1)} %)</b> sale verde por error el ${nf(paL * 100, 1)} % de las veces (error β, fuego sin alarma). Uno que cumple el <b>estándar (${nf(pU * 100, 1)} %)</b> sale verde el ${nf(paU * 100, 1)} % de las veces; el ${nf(aR * 100, 1)} % restante es el error α (falsa alarma). Cuanto más empinada la curva entre las dos líneas, mejor separa los servicios buenos de los malos.</p></div>`;
  }

  // ---------- Sorteo de casos (muestreo aleatorio simple o sistemático) ----------
  function sorteoHtml(n, N, unidad = "casos") {
    if (!N) return `<div class="chart-card sorteo no-print"><h3>¿Cómo elijo los casos al azar?</h3><p>Si indicas el tamaño de la población o del lote (N), la app puede sortear por ti qué casos revisar. Si no, numera el listado y sortea con la función ALEATORIO.ENTRE de una hoja de cálculo.</p></div>`;
    const m = Math.min(n, N);
    return `<div class="chart-card sorteo no-print"><h3>Sortear qué casos revisar</h3><p>Numera el listado del 1 al ${nf(N, 0)} (por ejemplo, por orden de fecha) y pulsa un botón. Sale una lista de ${nf(m, 0)} números distintos: esos son los ${unidad} a revisar. Es la «cucharada bien removida».</p>
<div class="toolbar"><button class="btn btn--primary" type="button" data-act="sortear" data-tipo="simple" data-n="${m}" data-pop="${N}">Sorteo aleatorio simple</button><button class="btn" type="button" data-act="sortear" data-tipo="sist" data-n="${m}" data-pop="${N}">Muestreo sistemático</button></div>
<div class="sorteo-out" aria-live="polite"></div></div>`;
  }
  function sortear(tipo, n, N) {
    const rnd = k => Math.floor(Math.random() * k);   // entero 0..k-1
    let nums, txt;
    if (tipo === "sist") {
      const k = N / n, start = Math.random() * k;
      nums = Array.from({ length: n }, (_, i) => Math.floor(start + i * k) + 1);
      txt = `Salto k = N ÷ n = ${nf(N, 0)} ÷ ${nf(n, 0)} = ${nf(k, 2)}; arranque al azar en el ${nums[0]}. <b>Ojo:</b> si el listado tiene un patrón que se repite (por ejemplo, el mismo día de la semana cada cierto número de casos), el salto puede dejar fuera siempre lo mismo; compruébalo antes.`;
    } else {
      const set = new Set(); while (set.size < n) set.add(rnd(N) + 1);
      nums = [...set].sort((a, b) => a - b);
      txt = "Todos los casos tenían la misma probabilidad de salir. Si un caso no sirve (historia no localizable…), sustitúyelo por el siguiente de un sorteo nuevo, no por el que tengas más a mano.";
    }
    return `<p class="sorteo-nums">${nums.join(", ")}</p><p class="step-note">${txt}</p>`;
  }

  // ---------- Estado ----------
  const state = {};            // id calculadora -> {campo: valor}
  let current = null;          // calculadora activa

  function initState(c) {
    if (state[c.id]) return;
    if (c.custom) { state[c.id] = JSON.parse(JSON.stringify(c.defaults)); return; }
    const s = {}; c.fields.forEach(f => { s[f.id] = f.def; }); state[c.id] = s;
  }
  function readValues(c) {
    const v = {};
    c.fields.forEach(f => {
      const raw = state[c.id][f.id];
      v[f.id] = (f.type === "seg" || f.type === "check") ? raw : parseNum(raw);
    });
    return v;
  }

  // ---------- Render ----------
  const view = $("#view");

  function chipLabel(q, f) { return typeof q === "object" ? q.l : nf(q) + (f.unit === "%" ? " %" : ""); }

  function fieldHtml(f) {
    const hdr = `<div class="field-head"><span class="field-label">${esc(f.label)}</span>${f.opt ? '<span class="field-opt">(opcional)</span>' : ""}<button type="button" class="info-btn" data-info="${f.id}" aria-expanded="false" aria-label="Ayuda: ${esc(f.label)}">i</button></div><p class="help" id="help-${f.id}" hidden>${esc(f.help)}</p>`;
    let body = "";
    if (f.type === "seg") {
      body = `<div class="seg" data-seg="${f.id}">${f.options.map(o => `<button type="button" data-v="${o[0]}">${o[1]}</button>`).join("")}</div>`;
      return `<div class="field" data-field="${f.id}">${hdr}${body}</div>`;
    }
    if (f.type === "check") {
      return `<div class="field" data-field="${f.id}"><div class="field-head"><label class="check"><input type="checkbox" data-chk="${f.id}" /> ${esc(f.label)}</label><button type="button" class="info-btn" data-info="${f.id}" aria-expanded="false" aria-label="Ayuda">i</button></div><p class="help" id="help-${f.id}" hidden>${esc(f.help)}</p></div>`;
    }
    body = `<div class="input-wrap" data-wrap="${f.id}"><input class="fld-input" data-id="${f.id}" type="text" inputmode="decimal" autocomplete="off" placeholder="${esc(f.ph || "")}" aria-label="${esc(f.label)}" />${f.unit ? `<span class="input-unit">${esc(f.unit)}</span>` : ""}</div>`;
    if (f.quick) body += `<div class="quick">${f.quick.map(q => { const val = typeof q === "object" ? q.v : q; return `<button type="button" class="chip${typeof q === "object" && q.accent ? " chip--accent" : ""}" data-q="${f.id}" data-v="${val}">${esc(chipLabel(q, f))}</button>`; }).join("")}</div>`;
    return `<div class="field" data-field="${f.id}">${hdr}${body}</div>`;
  }

  const KEY_FACIL = "tammuestral-facil-abierto";
  function facilAbierto() { try { return localStorage.getItem(KEY_FACIL) === "1"; } catch (e) { return false; } }
  view.addEventListener("toggle", e => { if (e.target.id === "tabla-exacta" && e.target.open) pintarTablaExacta(); }, true);
  view.addEventListener("toggle", e => { if (e.target.matches && e.target.matches("details.facil")) { try { localStorage.setItem(KEY_FACIL, e.target.open ? "1" : "0"); } catch (er) { /* */ } } }, true);

  function renderCalc(c) {
    current = c; initState(c);
    document.title = "Tamaño muestral · " + c.short;
    view.innerHTML = `
      <div class="informe-bar informe-only"><button type="button" class="btn" data-act="volver">← Volver</button><button type="button" class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></div>
      <div class="print-only print-head"><h1>Informe de tamaño muestral</h1><p>${esc(c.title)} · ${new Date().toLocaleDateString("es-ES")}</p></div>
      <h1 class="page-title">${esc(c.title)}</h1>
      <div class="intro"><p><b>¿Qué es?</b> ${c.what}</p><p><b>¿Cuándo usarla?</b> ${c.when}</p></div>
      <div class="box box--idea no-print"><span class="box-tag">Idea clave</span><p>${c.idea}</p></div>
      <details class="facil no-print"${facilAbierto() ? " open" : ""}><summary>Explicado fácil, con un ejemplo resuelto</summary><div class="facil-body">${c.facil}</div></details>
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="ejemplo">Cargar ejemplo</button>
        <button class="btn" data-act="limpiar">Restablecer</button>
        <button class="btn" data-act="informe">Ver informe</button>
        <button class="btn" data-act="imprimir">Guardar / imprimir</button>
        <button class="btn" data-act="enlace" title="Crea un enlace que abre esta calculadora con los mismos datos">Compartir enlace</button>
      </div>
      <p class="page-lead no-print" id="example-text" hidden></p>
      <div class="calc-grid">
        <section class="card field-form" aria-label="Parámetros">
          ${c.formHtml ? c.formHtml() : c.fields.map(fieldHtml).join("")}
          <button type="button" class="minibar" id="minibar" data-act="ver"><span>Resultado</span><span class="mb-val" id="mini-val">—</span></button>
        </section>
        <section class="calc-result-col" id="res" aria-live="polite" aria-label="Resultado"></section>
      </div>
      ${c.analisis ? analisisHtml(c) : ""}
      ${c.pageHtml ? c.pageHtml() : ""}
      <div class="print-only print-foot"><span class="autor-titulo">Aplicación desarrollada por</span><span class="autor"><b>Carlos J. Galán Doval</b> · Médico de Familia · Técnico en Calidad y Seguridad del Paciente</span><span class="autor"><b>Rafael J. Romero de Castilla Gil</b> · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente</span><span class="autor-area">Área de Gestión Sanitaria Sur de Córdoba · Andalucía</span><span class="autor-uso">De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.</span></div>`;
    syncInputs(); update();
  }

  function syncInputs() {
    const c = current, st = state[c.id];
    c.fields.forEach(f => {
      if (f.type === "seg") $$(`[data-seg="${f.id}"] button`).forEach(b => b.classList.toggle("active", b.dataset.v === st[f.id]));
      else if (f.type === "check") $(`[data-chk="${f.id}"]`).checked = !!st[f.id];
      else { const i = $(`.fld-input[data-id="${f.id}"]`); if (i && document.activeElement !== i) i.value = st[f.id]; }
    });
    syncChips();
    c.fields.forEach(f => { if (f.showIf) { const el = $(`.field[data-field="${f.id}"]`); if (el) el.hidden = !f.showIf(st); } });
  }
  function syncChips() {
    const st = state[current.id];
    $$(".chip").forEach(b => { const x = parseNum(st[b.dataset.q]); b.classList.toggle("active", x !== null && x === Number(b.dataset.v)); });
  }

  function paramsTable(c) {
    const st = state[c.id];
    const rows = c.fields.filter(f => !f.showIf || f.showIf(st)).map(f => {
      let val;
      if (f.type === "seg") val = (f.options.find(o => o[0] === st[f.id]) || [])[1];
      else if (f.type === "check") val = st[f.id] ? "Sí" : "No";
      else { const x = parseNum(st[f.id]); val = x === null ? "No indicada" : nf(x, 4) + (f.unit ? " " + f.unit : ""); }
      return `<tr><td>${esc(f.label)}</td><td>${esc(val)}</td></tr>`;
    }).join("");
    return `<div class="print-only"><h3>Parámetros introducidos</h3><table class="params">${rows}</table></div>`;
  }

  function update() {
    const c = current, out = $("#res"); if (!c || !out) return;
    const res = c.compute(readValues(c));
    c.ultimo = res.errors || res.warnOnly ? null : res;
    pintarAnalisis();
    $$(".input-wrap").forEach(w => w.classList.remove("invalid"));
    const mini = $("#mini-val");
    if (res.errors && res.errors.length) {
      res.errors.forEach(e => { const w = $(`[data-wrap="${e.f}"]`); if (w && !e.missing) w.classList.add("invalid"); });
      const onlyMissing = res.errors.every(e => e.missing);
      out.innerHTML = onlyMissing
        ? `<div class="placeholder-box">Rellena los parámetros (o pulsa <b>Cargar ejemplo</b>) para ver el resultado.<ul style="text-align:left;margin:10px auto 0;max-width:340px">${res.errors.map(e => `<li>${esc(e.m)}</li>`).join("")}</ul></div>`
        : `<div class="error-box"><b>Revisa los datos</b><ul>${res.errors.map(e => `<li>${esc(e.m)}</li>`).join("")}</ul></div>`;
      mini.textContent = "—"; return;
    }
    if (res.warnOnly) { out.innerHTML = res.warnOnly.map(w => `<div class="warn">${esc(w)}</div>`).join(""); mini.textContent = "—"; return; }
    const stepsHtml = res.steps.map(s => `<li><div class="step-t">${esc(s.t)}</div>${s.f.map(x => `<div class="formula">${esc(x)}</div>`).join("")}${s.html || ""}${s.note ? `<div class="step-note">${esc(s.note)}</div>` : ""}</li>`).join("");
    const wasOpen = $("details.steps", out) ? $("details.steps", out).open : true;
    out.innerHTML = `
      <div class="result-card"><div class="res-label">${esc(res.big.label)}</div><div class="res-big">${esc(res.big.value)}</div><div class="res-sub">${esc(res.big.sub)}</div>
        <div class="extras">${res.extras.map(e => `<span class="extra">${esc(e[0])}: <b>${esc(e[1])}</b></span>`).join("")}</div></div>
      ${res.sem || ""}
      <div class="interp"><b>En lenguaje llano.</b> ${res.interp}</div>
      ${res.warns.map(w => `<div class="warn">⚠ ${w}</div>`).join("")}
      ${(res.notes || []).map(w => `<div class="note">ℹ ${w}</div>`).join("")}
      ${res.extraHtml || ""}
      <details class="steps"${wasOpen ? " open" : ""}><summary>Desarrollo paso a paso</summary><div class="steps-body"><ol>${stepsHtml}</ol></div></details>
      ${c.custom ? "" : paramsTable(c)}
      <div class="toolbar no-print"><button class="btn" data-act="informe">Ver informe</button><button class="btn" data-act="imprimir">Guardar / imprimir</button></div>`;
    mini.textContent = res.mini;
    const te = $("#tabla-exacta"); if (te && te.open && tablaExactaCache[tablaBeta]) pintarTablaExacta();
  }

  function renderHome() {
    current = null; document.title = "Tamaño Muestral · Calidad asistencial";
    view.innerHTML = `
      <h1 class="page-title">¿Qué calculadora necesito?</h1>
      <p class="page-lead">Elige según lo que quieras hacer. Cada calculadora explica qué es, ayuda a rellenar cada parámetro y muestra el desarrollo paso a paso.</p>
      <div class="antes">
        <div class="box box--idea"><span class="box-tag">Idea clave: la cucharada de sopa</span><p>Para saber si la sopa está salada no hace falta tomarse la olla entera: basta una cucharada, <b>después de removerla bien</b>. Remover es el azar: sin remover, la cucharada puede salir del fondo, donde está toda la sal. Una <b>muestra aleatoria</b> es una cucharada bien removida.</p></div>
        <div class="box box--practica"><span class="box-tag">La pregunta que lo cambia todo: ¿estimar o decidir?</span><p><b>Estimar</b> es pesar el paquete en una báscula de precisión: tarda más y da un número («el 78 % cumple, ±10 %»). <b>Decidir</b> es pasar por el arco del aeropuerto: no dice cuánto metal llevas, solo pita o no pita («alcanza el estándar / hay que investigar»). Para muchas auditorías, con el arco basta: es <b>LQAS</b>, y necesita muchos menos casos.</p></div>
      </div>
      <div class="guide">${CALCS.map((c, i) => `<a class="guide-card" href="#/${c.id}"><span class="guide-num">${i + 1}</span><span><div class="guide-q">${esc(c.q)}</div><div class="guide-a">→ ${c.a}</div></span><span class="guide-go">›</span></a>`).join("")}</div>
      <a class="glos-portada" href="#/glosario"><span><b>Glosario</b> · ${GLOSARIO.length} términos explicados en lenguaje llano, con buscador</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/indicadores-calidad/" target="_blank" rel="noopener"><span><b>Indicadores ↗</b> · la app hermana: crea, define y comprueba tus indicadores de calidad paso a paso, y vuelve aquí para calcular la muestra</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/auditorias/" target="_blank" rel="noopener"><span><b>Auditorías ↗</b> · la app hermana: planifica, realiza e informa una auditoría completa, del Mapa de Riesgos al plan de mejora, con la muestra y el LQAS integrados</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/amfe/" target="_blank" rel="noopener"><span><b>AMFE ↗</b> · la app hermana: analiza los fallos de un proceso paso a paso, con G·O·D, IPR y priorización de los fallos que hay que atajar primero</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/flujograma/" target="_blank" rel="noopener"><span><b>Flujograma ↗</b> · la app hermana: escribe los pasos de un proceso y la app dibuja su flujograma, con los puntos críticos donde conviene medir</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/dafo/" target="_blank" rel="noopener"><span><b>DAFO · CAME ↗</b> · la app hermana: analiza debilidades, amenazas, fortalezas y oportunidades de tu unidad y conviértelas en un plan de acción con indicadores</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/mapa-riesgos/" target="_blank" rel="noopener"><span><b>Mapa de Riesgos ↗</b> · la app hermana: elabora paso a paso el mapa de riesgos de un proceso: subprocesos, flujograma, puntos críticos, AMFE, acciones y el mapa con los riesgos coloreados por su IPR, con el documento final</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/rondas-seguridad/" target="_blank" rel="noopener"><span><b>Rondas de Seguridad ↗</b> · la app hermana: programa y haz las rondas de seguridad de una unidad, a pie de cama, y descubre lo que falla una y otra vez</span><span class="guide-go">›</span></a>
      <a class="glos-portada" href="https://cjgaland.github.io/lectura-critica/" target="_blank" rel="noopener"><span><b>Lectura Crítica ↗</b> · la app hermana: lee críticamente un artículo con las plantillas de CASPe; sus calculadoras te traen aquí cuando el intervalo de confianza es demasiado ancho</span><span class="guide-go">›</span></a>
      <div class="glossary"><details class="gloss"><summary>Conceptos clave en 1 minuto</summary><dl class="gloss-body">
        <dt>Confianza (1 − α)</dt><dd>Seguridad con que el intervalo contiene el valor real. 95 % es lo habitual.</dd>
        <dt>Precisión (e)</dt><dd>Mitad de la anchura del intervalo: el «±» que toleras.</dd>
        <dt>Potencia (1 − β)</dt><dd>Probabilidad de detectar una diferencia real. Mínimo recomendable: 80 %.</dd>
        <dt>Pérdidas</dt><dd>Casos que no podrás analizar; se compensan aumentando la muestra.</dd>
        <dt>Población finita (N)</dt><dd>Si la muestra es una fracción importante de la población, se necesitan menos casos.</dd>
        <dt>Error α y error β en LQAS</dt><dd>α = falsa alarma (sale rojo un servicio que cumple). β = fuego sin alarma (sale verde un servicio que está mal). Lo habitual: α 5 %, β 20 % o 10 %.</dd>
        <dt>Concordancia (kappa)</dt><dd>Hasta qué punto dos auditoras coinciden al revisar las mismas historias, descontando el acuerdo por azar. Se usa para pilotar un indicador.</dd>
        <dt>Estimar frente a clasificar</dt><dd>Estimar da una cifra con su intervalo (muestras grandes); clasificar (LQAS) solo decide «alcanza / no alcanza» con muestras pequeñas.</dd>
        <dt>Muestreo aleatorio</dt><dd>Todas las fórmulas suponen que los casos se eligen al azar. Si no es así, los resultados pueden no ser válidos.</dd>
      </dl></details>
      <details class="gloss"><summary>Del criterio al indicador: los siete tipos</summary><div class="gloss-body">
        <p>Cuando auditamos comprobamos si se ha hecho lo que debería haberse hecho: esa regla de buena práctica es el <b>criterio</b> («se registra la valoración del riesgo de úlceras en las primeras 24 horas»). Si lo convertimos en algo que se puede contar, tenemos un <b>indicador</b> («% de pacientes con la valoración registrada en 24 horas»). Un indicador es como un termómetro: no cura la fiebre, pero dice si hay que preocuparse.</p>
        <div class="table-wrap"><table class="mini facil-tabla"><thead><tr><th>Tipo</th><th>Qué mide</th><th>Ejemplo</th><th>¿Con muestra?</th></tr></thead><tbody>
          <tr><td><b>Centinela</b></td><td>Un solo caso ya es un problema</td><td>Cirugía en lugar equivocado</td><td>No: se vigilan todos</td></tr>
          <tr><td><b>Número absoluto</b></td><td>Cuántos eventos, sin denominador</td><td>Caídas con daño al mes</td><td>Normalmente no</td></tr>
          <tr><td><b>Porcentaje</b></td><td>Casos que cumplen entre los evaluados</td><td>% con pulsera identificativa</td><td>Sí → <a href="#/proporcion">Un porcentaje</a> o <a href="#/lqas">LQAS</a></td></tr>
          <tr><td><b>Tasa</b></td><td>Porcentaje referido a un periodo</td><td>Úlceras adquiridas al año</td><td>Sí</td></tr>
          <tr><td><b>Media</b></td><td>Promedio de una medición</td><td>Tiempo medio de espera</td><td>Sí → <a href="#/media">Una media</a></td></tr>
          <tr><td><b>Ratio</b></td><td>Promedio de cumplimientos o defectos por caso</td><td>Campos sin rellenar por informe</td><td>Sí</td></tr>
          <tr><td><b>Compuesto</b></td><td>Resume varios indicadores en uno</td><td>Paquete de valoración al ingreso</td><td>Sí → <a href="#/compuesto">Indicador compuesto</a></td></tr>
        </tbody></table></div>
        <p><b>Un buen indicador es:</b> <b>válido</b> (mide de verdad lo que dice medir), <b>fiable</b> (dos auditoras que revisan la misma historia llegan a la misma conclusión) y <b>útil</b> (quien recibe el resultado puede hacer algo para mejorarlo).</p>
        <p><b>Ojo, trampa:</b> si una auditora marca «cumple» y otra «no cumple» en la misma historia, el problema no está en la historia, sino en el indicador, que estaba mal definido. Pruébalo con unas pocas historias antes de lanzar la auditoría.</p>
      </div></details>
      <details class="gloss"><summary>Cómo elegir los casos al azar</summary><div class="gloss-body">
        <div class="table-wrap"><table class="mini facil-tabla"><thead><tr><th>Método</th><th>Cómo se hace</th><th>Cuándo conviene</th></tr></thead><tbody>
          <tr><td><b>Aleatorio simple</b></td><td>Se numera el listado y se sortean números (la app lo hace por ti si indicas N, o con ALEATORIO.ENTRE en una hoja de cálculo).</td><td>Listado completo y casos parecidos entre sí.</td></tr>
          <tr><td><b>Sistemático</b></td><td>Se calcula un salto k = N ÷ n, se arranca al azar y se toma un caso cada k. Ej.: N = 600, n = 50, k = 12; arranque en el 7: casos 7, 19, 31, 43…</td><td>Listado ordenado sin patrones; es el más cómodo.</td></tr>
          <tr><td><b>Estratificado</b></td><td>Se divide en grupos (turnos, unidades, consultas) y se sortea dentro de cada uno.</td><td>Hay subgrupos distintos y todos deben estar representados.</td></tr>
          <tr><td><b>De conveniencia</b></td><td>Se coge lo que está a mano.</td><td><b>No es recomendable para auditar.</b></td></tr>
        </tbody></table></div>
        <p><b>Ojo, trampa:</b> en el sistemático, si el listado tiene un patrón (por ejemplo, cada 12.º caso coincide siempre con el mismo día de la semana), el salto puede dejar fuera siempre lo mismo. Compruébalo antes de empezar.</p>
      </div></details>
      <details class="gloss"><summary>Ponte a prueba: cuatro preguntas</summary><div class="gloss-body quiz">${QUIZ.map((q, i) => `<div class="quiz-q" data-quiz="${i}"><p><b>${i + 1}.</b> ${q.q}</p>${q.o.map((o, j) => `<button type="button" class="quiz-o" data-quiz="${i}" data-o="${j}">${o}</button>`).join("")}<p class="quiz-fb" hidden></p></div>`).join("")}</div></details></div>`;
  }

  // Autoevaluación (adaptada de la parte teórica del curso; la 4 usa el plan exacto de la app)
  const QUIZ = [
    { q: "El indicador «cirugía en lugar equivocado» es de tipo…", o: ["Media", "Centinela", "Ratio"], ok: 1,
      e: "Un solo caso ya es un problema grave: es un indicador centinela y se vigilan todos los casos, sin muestra." },
    { q: "Ana revisa 15 historias y 10 cumplen el criterio. Escribe: «el cumplimiento del servicio es del 67 %». ¿Es correcto?", o: ["Sí", "No: con 15 historias solo se puede decidir si se alcanza un estándar, no estimar el nivel real", "Sí, con un margen de ±1 %"], ok: 1,
      e: "Con tan pocas historias el margen de error es enorme (más de ±20 puntos). Con muestras pequeñas se decide (LQAS), no se estima." },
    { q: "En un indicador compuesto de porcentaje simple, el denominador es…", o: ["El número de pacientes auditados", "La suma de las oportunidades de actuar bien de todos los criterios", "El número de criterios"], ok: 1,
      e: "Se suman las oportunidades: los casos en los que se podía aplicar cada criterio (en el ejemplo del infarto, 40, no 15 pacientes)." },
    { q: "Estándar 90 %, umbral 75 %, α = 5 %, β = 20 %. La app da n = 40 y c = 33. Se revisan 40 historias y cumplen 32. ¿Qué decides?", o: ["Verde: aceptar", "Rojo: hay que investigar", "Ampliar la muestra hasta tener 33"], ok: 1,
      e: "32 < 33 → rojo: hay que investigar qué está pasando. La regla se fija antes y no se cambia sobre la marcha." }
  ];

  // ---------- Informe en PDF (iPhone / iPad) ----------
  // En iOS, window.print() no hace nada cuando la app está instalada en la pantalla de inicio.
  // Solución sin librerías: se maqueta el informe a ancho de A4, se dibuja en un canvas palabra a
  // palabra en las posiciones que calcula el propio navegador, cada página se guarda como JPEG y se
  // empaqueta en un PDF mínimo que se ofrece en el menú Compartir de iOS (Imprimir, Guardar en Archivos…).
  function esIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }

  function toast(msg, ms) {
    let t = $("#toast");
    if (!msg) { if (t) t.hidden = true; return; }
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toast.h);
    if (ms) toast.h = setTimeout(() => { t.hidden = true; }, ms);
  }

  // PDF 1.4 con una imagen JPEG a página completa por página. paginas: [{ bytes, w, h }]
  function pdfDesdeJPEGs(paginas, wPt, hPt) {
    const enc = new TextEncoder(), partes = [], offs = []; let pos = 0;
    const push = x => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); pos += b.length; };
    const obj = (n, cuerpo) => { offs[n] = pos; push(`${n} 0 obj\n`); cuerpo(); push("\nendobj\n"); };
    push("%PDF-1.4\n"); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
    const n = paginas.length;
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push(`<< /Type /Pages /Kids [${paginas.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${n} >>`));
    paginas.forEach((p, i) => {
      const pg = 3 + i * 3, cont = pg + 1, img = pg + 2, flujo = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im${i} Do Q`;
      obj(pg, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im${i} ${img} 0 R >> >> /Contents ${cont} 0 R >>`));
      obj(cont, () => { push(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`); });
      obj(img, () => { push(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`); push(p.bytes); push("\nendstream"); });
    });
    const total = 3 + n * 3, xref = pos;
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let k = 1; k < total; k++) x += String(offs[k]).padStart(10, "0") + " 00000 n \n";
    push(x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: "application/pdf" });
  }

  async function generarPDF() {
    const ANCHO = 720, K = 2;                               // ancho de maquetación (px CSS) y resolución
    const A4W = 595.28, A4H = 841.89, MARGEN_PT = 34;      // A4 en puntos
    const PX = (A4W - 2 * MARGEN_PT) / ANCHO;              // puntos por px CSS
    const PW = A4W / PX, PH = A4H / PX, M = MARGEN_PT / PX, ALTO_UTIL = PH - 2 * M;
    const hoja = document.createElement("div");
    hoja.className = "view";
    hoja.style.cssText = `position:absolute;left:-20000px;top:0;width:${ANCHO}px;max-width:none;margin:0;padding:0;box-shadow:none;`;
    hoja.innerHTML = $("#view").innerHTML;
    $$(".informe-bar, [id]", hoja).forEach(el => { if (el.classList.contains("informe-bar")) el.remove(); else el.removeAttribute("id"); });
    $$("details", hoja).forEach(d => { d.open = true; });
    document.body.appendChild(hoja);
    try {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const R0 = hoja.getBoundingClientRect();
      const ops = [], cortes = [0], bloques = [];
      const SIN_CORTE = ".print-head, .result-card, .interp, .warn, .note, .sem, .chart-card, .steps-body li, tr, .formula, .box, .print-foot, h1, h3, .step-t";
      const rel = r => ({ x: r.left - R0.left, y: r.top - R0.top, w: r.width, h: r.height });
      const hayColor = c => !!c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
      const LADOS = ["Top", "Right", "Bottom", "Left"];
      const texto = (n, cs) => {
        const t = n.textContent, re = /\S+/g, rg = document.createRange(); let m;
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        while ((m = re.exec(t))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const rs = rg.getClientRects(); if (!rs.length) continue;
          ops.push({ t: "txt", s: cs.textTransform === "uppercase" ? m[0].toUpperCase() : m[0], r: rel(rs[0]), font, col: cs.color, ls: cs.letterSpacing });
        }
      };
      const recorre = el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const r = rel(el.getBoundingClientRect());
        if (r.h > 0) cortes.push(r.y + r.h);
        if (el.matches(SIN_CORTE)) bloques.push([r.y, r.y + r.h]);
        if (el instanceof SVGSVGElement) { ops.push({ t: "svg", el, r }); return; }
        const bordes = LADOS.map(l => [parseFloat(cs[`border${l}Width`]) || 0, cs[`border${l}Color`]]);
        if (hayColor(cs.backgroundColor) || bordes.some(b => b[0] > 0 && hayColor(b[1]))) ops.push({ t: "caja", r, bg: cs.backgroundColor, rad: parseFloat(cs.borderTopLeftRadius) || 0, bordes });
        if (el.tagName === "LI") {   // los números y viñetas de las listas son pseudoelementos: se dibujan aparte
          const ol = el.parentElement.tagName === "OL", idx = Array.prototype.indexOf.call(el.parentElement.children, el) + 1;
          ops.push({ t: "txt", s: ol ? idx + "." : "•", r: { x: r.x - (ol ? 20 : 14), y: r.y, w: 16, h: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 }, font: `normal 700 ${cs.fontSize} ${cs.fontFamily}`, col: ol ? "#0b6f66" : cs.color, ls: "normal" });
        }
        for (const n of el.childNodes) {
          if (n.nodeType === 1) recorre(n);
          else if (n.nodeType === 3 && n.textContent.trim()) texto(n, cs);
        }
      };
      recorre(hoja);
      // Gráficos SVG → imagen (con los estilos calculados copiados en línea)
      for (const op of ops.filter(o => o.t === "svg")) {
        const cl = op.el.cloneNode(true), orig = [op.el, ...op.el.querySelectorAll("*")], copia = [cl, ...cl.querySelectorAll("*")];
        orig.forEach((o, i) => { const cs = getComputedStyle(o); copia[i].setAttribute("style", ["fill", "stroke", "stroke-width", "stroke-dasharray", "font-family", "font-size", "font-weight"].map(p => `${p}:${cs.getPropertyValue(p)}`).join(";")); });
        cl.setAttribute("xmlns", "http://www.w3.org/2000/svg"); cl.setAttribute("width", op.r.w); cl.setAttribute("height", op.r.h);
        op.img = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(cl)); });
      }
      // Saltos de página: en el borde inferior de un bloque, sin partir cajas, filas ni fórmulas
      const alto = Math.ceil(R0.height);
      const parte = y => bloques.some(([a, b]) => a < y - 0.5 && y + 0.5 < b && b - a < ALTO_UTIL);
      const cands = [...new Set(cortes.map(c => Math.ceil(c)))].sort((a, b) => a - b);
      const pags = []; let y0 = 0;
      while (y0 < alto - 1) {
        const lim = y0 + ALTO_UTIL;
        if (lim >= alto) { pags.push([y0, alto]); break; }
        const y = cands.filter(c => c > y0 + 80 && c <= lim && !parte(c)).pop() || Math.floor(lim);
        pags.push([y0, y]); y0 = y;
      }
      const ponFuente = (ctx, f) => { ctx.font = "10px serif"; ctx.font = f; if (ctx.font === "10px serif") ctx.font = f.replace(/^(.*?\d+(\.\d+)?px).*$/, "$1 sans-serif"); };
      const caja = (ctx, op) => {
        const { x, y, w, h } = op.r, rad = Math.min(op.rad, w / 2, h / 2);
        const camino = () => { ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h); };
        if (hayColor(op.bg)) { ctx.fillStyle = op.bg; camino(); ctx.fill(); }
        const [t, d, b, l] = op.bordes;
        if (op.bordes.every(z => z[0] === t[0] && z[1] === t[1]) && t[0] > 0 && hayColor(t[1])) { ctx.strokeStyle = t[1]; ctx.lineWidth = t[0]; ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0], Math.max(0, rad - t[0] / 2)); else ctx.rect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0]); ctx.stroke(); return; }
        const lado = (z, rx, ry, rw, rh) => { if (z[0] > 0 && hayColor(z[1])) { ctx.fillStyle = z[1]; ctx.fillRect(rx, ry, rw, rh); } };
        lado(t, x, y, w, t[0]); lado(b, x, y + h - b[0], w, b[0]); lado(l, x, y, l[0], h); lado(d, x + w - d[0], y, d[0], h);
      };
      const dibujaPaginas = conSVG => pags.map(([a, b]) => {
        const cv = document.createElement("canvas"); cv.width = Math.round(PW * K); cv.height = Math.round(PH * K);
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.scale(K, K); ctx.translate(M, M - a);
        ctx.beginPath(); ctx.rect(-2, a, ANCHO + 4, b - a); ctx.clip();
        for (const op of ops) {
          if (op.r.y >= b || op.r.y + op.r.h <= a) continue;
          if (op.t === "caja") caja(ctx, op);
          else if (op.t === "svg") { if (conSVG && op.img) ctx.drawImage(op.img, op.r.x, op.r.y, op.r.w, op.r.h); }
          else {
            ponFuente(ctx, op.font); ctx.fillStyle = op.col; ctx.textBaseline = "alphabetic";
            if ("letterSpacing" in ctx) ctx.letterSpacing = op.ls && op.ls !== "normal" ? op.ls : "0px";
            const mt = ctx.measureText(op.s), asc = mt.fontBoundingBoxAscent || mt.actualBoundingBoxAscent || op.r.h * 0.8, desc = mt.fontBoundingBoxDescent || mt.actualBoundingBoxDescent || op.r.h * 0.2;
            ctx.fillText(op.s, op.r.x, op.r.y + (op.r.h - (asc + desc)) / 2 + asc);
          }
        }
        const url = cv.toDataURL("image/jpeg", 0.9), bin = atob(url.slice(url.indexOf(",") + 1)), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return { bytes, w: cv.width, h: cv.height };
      });
      let paginas;
      try { paginas = dibujaPaginas(true); } catch (e) { paginas = dibujaPaginas(false); }   // si el SVG «ensucia» el canvas, sin gráfico
      return pdfDesdeJPEGs(paginas, A4W, A4H);
    } finally { hoja.remove(); }
  }

  // El PDF se prepara al abrir «Ver informe» en iOS, para que «Guardar / imprimir» pueda abrir el menú
  // Compartir al instante (Safari solo lo permite justo después de que el usuario pulse).
  let pdfListo = null;
  function nombrePDF() { return `Informe ${current.short} ${new Date().toLocaleDateString("es-ES").replace(/\//g, "-")}.pdf`; }
  function prepararPDF() {
    pdfListo = null; const id = current.id;
    setTimeout(() => { if (current && current.id === id && document.body.classList.contains("ver-informe")) generarPDF().then(b => { pdfListo = { id, blob: b }; }).catch(() => {}); }, 300);
  }
  async function guardarPDF() {
    if (!document.body.classList.contains("ver-informe")) { location.hash = `#/${current.id}?informe=1`; toast("Preparando el PDF… pulsa de nuevo «Guardar / imprimir» en un momento.", 4000); return; }
    let blob = pdfListo && pdfListo.id === current.id ? pdfListo.blob : null;
    if (!blob) { toast("Preparando el PDF…"); try { blob = await generarPDF(); pdfListo = { id: current.id, blob }; } catch (e) { toast("No se ha podido crear el PDF.", 4000); return; } }
    const file = new File([blob], nombrePDF(), { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: file.name }); toast(""); }
      catch (e) {
        if (e && e.name === "AbortError") { toast(""); return; }
        toast("PDF listo: pulsa otra vez «Guardar / imprimir».", 4000);   // el permiso para compartir caducó mientras se generaba
      }
      return;
    }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove(); toast("PDF descargado.", 3000);
  }

  // ---------- Glosario ----------
  // [término, definición en lenguaje llano, calculadora relacionada (id) o ""]
  const GLOSARIO = [
    ["Aleatorio (muestreo)", "Forma de elegir los casos en la que todos tienen la misma probabilidad de salir, como en un sorteo. Es la «cucharada bien removida»: sin azar, la muestra puede no parecerse a la realidad.", ""],
    ["Bilateral / unilateral (contraste)", "Bilateral: te interesa detectar una diferencia en cualquier sentido (lo habitual y más prudente). Unilateral: solo en un sentido (por ejemplo, solo mejora); debe decidirse antes del estudio y pide menos muestra.", "dos-proporciones"],
    ["Binomial (distribución)", "Modelo que describe cuántos casos «cumplen» en una muestra cuando la población es muy grande o de tamaño desconocido. Lo usa LQAS cuando no indicas N.", "lqas"],
    ["Censo", "Revisar todos los casos de la población, sin muestra. Es lo indicado para los indicadores centinela o cuando la población es muy pequeña.", ""],
    ["Concordancia", "Grado en que dos auditoras que revisan las mismas historias llegan a la misma conclusión. Se mide con el kappa.", "concordancia"],
    ["Confianza (nivel de)", "Seguridad con la que la horquilla calculada contiene el valor real. Con un 95 %, de cada 100 estudios hechos igual, en 95 acertaríamos.", "proporcion"],
    ["Conglomerado", "Grupo natural de casos (una planta, un centro de salud, una consulta, un día) que se sortea entero para revisar varias historias dentro de él.", "conglomerados"],
    ["Conveniencia (muestra de)", "Revisar lo que está a mano («las historias de encima de la mesa»). No vale para auditar: suele dar resultados más favorables que la realidad.", ""],
    ["Correlación intraclase (ICC)", "Cuánto se parecen entre sí los casos de un mismo conglomerado, de 0 (nada) a 1 (idénticos). Cuanto mayor, más muestra hace falta al muestrear por conglomerados.", "conglomerados"],
    ["Criterio", "Regla de buena práctica que debería cumplirse en cada caso (por ejemplo, «consta la valoración del riesgo de caídas en las primeras 24 horas»).", ""],
    ["Curva característica operativa (curva OC)", "Gráfico de LQAS que muestra, para cada cumplimiento real posible, la probabilidad de que la muestra salga verde. Cuanto más empinada entre el umbral y el estándar, mejor separa los servicios buenos de los malos.", "lqas"],
    ["Desviación típica (σ)", "Cuánto se separan los valores de su media, «por término medio». Si no la conoces: (valor alto habitual − valor bajo habitual) ÷ 4.", "media"],
    ["Diferencia mínima relevante (Δ)", "La diferencia más pequeña entre dos grupos que merecería la pena detectar por su importancia clínica o de gestión. No es la que esperas, sino la mínima que importaría.", "dos-medias"],
    ["Efecto de diseño (DEFF)", "Cuántas veces más muestra hace falta por revisar casos agrupados en conglomerados en lugar de sueltos. DEFF = 1 + (m − 1) × ICC.", "conglomerados"],
    ["Error α (en LQAS)", "Falsa alarma: probabilidad de que salga rojo un servicio que en realidad cumple el estándar. Lo habitual es 5 %.", "lqas"],
    ["Error α (en comparaciones)", "Probabilidad de dar por real una diferencia que no existe (falso positivo, error tipo I). Lo habitual es 5 %.", "dos-proporciones"],
    ["Error β (en LQAS)", "Fuego sin alarma: probabilidad de que salga verde un servicio que está en el umbral o peor. Lo habitual es 20 % o 10 %.", "lqas"],
    ["Error β (en comparaciones)", "Probabilidad de no detectar una diferencia que sí existe (falso negativo, error tipo II). Potencia = 1 − β.", "dos-proporciones"],
    ["Estándar (AQL)", "En LQAS, el cumplimiento que queremos tener. Un servicio que lo alcanza debería salir verde.", "lqas"],
    ["Estimar frente a decidir", "Estimar es dar una cifra con su horquilla (la báscula: muchos casos). Decidir es saber si se alcanza un estándar (el arco del aeropuerto: pocos casos, con LQAS).", ""],
    ["Estrato", "Subgrupo de la población que puede comportarse distinto (turno de mañana, tarde y noche; distintas unidades). En el muestreo estratificado se sortean casos dentro de cada uno.", "estratos"],
    ["Hipergeométrica (distribución)", "Modelo para contar cuántos casos cumplen cuando se sortea sin reposición de un lote de tamaño conocido. Lo usa LQAS cuando indicas N; con lotes pequeños pide menos casos que la binomial.", "lqas"],
    ["Indicador", "Criterio convertido en algo que se puede contar (por ejemplo, «% de pacientes con la valoración de caídas registrada»). Es como un termómetro: no cura, pero dice si hay que preocuparse.", ""],
    ["Indicador centinela", "Indicador en el que un solo caso ya es un problema grave (cirugía en lugar equivocado). No se muestrea: se vigilan todos los casos.", ""],
    ["Indicador compuesto", "Resume varios criterios en un solo número. El de porcentaje simple suma cumplimientos y oportunidades de todos los criterios. Se presenta siempre con su desglose.", "compuesto"],
    ["Intervalo de confianza (horquilla)", "Rango de valores entre los que, con la confianza elegida, está el valor real. Cuanto más pequeña la muestra, más ancho.", "proporcion"],
    ["Kappa de Cohen (κ)", "Medida de concordancia entre dos observadores que descuenta el acuerdo debido al azar. Va de −1 a 1; en auditoría se suele pedir al menos 0,60.", "concordancia"],
    ["Lote", "En LQAS, el conjunto de casos que se quiere juzgar (la «caja de galletas»): por ejemplo, los ingresos de una unidad en un semestre.", "lqas"],
    ["LQAS", "Muestreo para la aceptación de lotes: con pocos casos decide si un servicio alcanza un estándar (verde) o hay que investigar (rojo). Es un semáforo, no una báscula.", "lqas"],
    ["Margen de error (precisión, e)", "La mitad de la anchura de la horquilla: el «±» que aceptas. Doble de precisión cuesta cuatro veces más casos.", "proporcion"],
    ["Media", "Promedio de una medición numérica (tiempo de espera, estancia…). Puede maquillar: a veces es mejor un porcentaje («% que esperan más de 30 minutos»).", "media"],
    ["Muestra", "Los casos que realmente se revisan, elegidos entre todos los posibles (el universo).", ""],
    ["Número de decisión (c)", "En LQAS, el mínimo de casos que deben cumplir en la muestra para que salga verde. La «nota mínima para aprobar».", "lqas"],
    ["Odds ratio (OR)", "Medida de efecto: (p₂ / (1 − p₂)) ÷ (p₁ / (1 − p₁)). Es habitual en artículos; solo se parece al riesgo relativo cuando los porcentajes son pequeños.", "dos-proporciones"],
    ["Oportunidad", "En un indicador compuesto, cada ocasión en la que se podía haber actuado bien (un criterio aplicable a un paciente). Es el denominador del compuesto.", "compuesto"],
    ["PABAK", "Kappa ajustado por prevalencia y sesgo (2 × acuerdo observado − 1). Ayuda a interpretar el kappa cuando casi todos los casos están en la misma categoría.", "concordancia"],
    ["Pérdidas", "Casos que no se podrán analizar (historia no localizable, dato ausente). Se compensan aumentando la muestra: n ÷ (1 − pérdidas).", ""],
    ["Pilotaje", "Probar un indicador con unas pocas historias (30–50) revisadas por dos personas antes de auditar, para aclarar términos ambiguos.", "concordancia"],
    ["Población finita (corrección)", "Si la muestra es una parte importante de la población, hacen falta menos casos. Se aplica al indicar N.", "proporcion"],
    ["Potencia (1 − β)", "Probabilidad de detectar una diferencia que de verdad existe. Lo mínimo habitual es 80 %: de cada 5 diferencias reales detectarías 4.", "dos-proporciones"],
    ["Proporción (porcentaje)", "Casos que cumplen entre los evaluados. Es el indicador más usado en auditoría de historias (cumple / no cumple).", "proporcion"],
    ["Riesgo relativo (RR)", "Cociente entre el riesgo de un grupo y el de otro (p₂ ÷ p₁). RR = 0,5: el riesgo se reduce a la mitad; RR = 1: sin efecto.", "dos-proporciones"],
    ["Sistemático (muestreo)", "Se calcula un salto k = N ÷ n, se arranca al azar y se toma un caso cada k. Cómodo, pero cuidado si el listado tiene un patrón que se repite.", ""],
    ["Tamaño de muestra (n)", "Número de casos que hay que revisar para responder a la pregunta con la precisión o los errores elegidos. Siempre se redondea hacia arriba.", ""],
    ["Umbral (LQL)", "En LQAS, el cumplimiento por debajo del cual la situación es claramente mala: la línea roja. Un servicio en el umbral debería salir rojo.", "lqas"],
    ["Unidad de estudio", "Lo que se mira en cada caso: una historia clínica, un episodio de urgencias, una intervención.", ""],
    ["Universo (marco muestral)", "Todos los casos entre los que se puede elegir: por ejemplo, las historias de pacientes con EPOC del centro en un año. Su tamaño es N.", ""],
    ["Valor z", "Número que corresponde al nivel de confianza en la distribución normal: 1,96 para el 95 %, 2,58 para el 99 %. Aparece en todas las fórmulas.", ""],
    ["Wilson (intervalo de)", "Forma de calcular la horquilla de un porcentaje que funciona bien también con muestras pequeñas o porcentajes extremos. La usa «Ya tengo los resultados».", "proporcion"],
    ["Zona gris", "En LQAS, cumplimientos entre el umbral y el estándar: la muestra puede salir verde o roja. LQAS no garantiza la clasificación ahí.", "lqas"]
  ];
  const sinAcentos = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function renderGlosario() {
    current = null; document.title = "Tamaño Muestral · Glosario";
    view.innerHTML = `
      <h1 class="page-title">Glosario</h1>
      <p class="page-lead">Los términos que usa la aplicación, explicados en lenguaje llano. Toca el enlace de cada término para ir a la calculadora donde se usa.</p>
      <div class="input-wrap glos-buscar"><input id="glos-q" type="search" autocomplete="off" placeholder="Buscar un término (p. ej. kappa, potencia, lote)…" aria-label="Buscar en el glosario" /></div>
      <p class="step-note" id="glos-n"></p>
      <dl class="glos-lista" id="glos-lista">${GLOSARIO.map(([t, d, id]) => {
        const c = id && CALCS.find(x => x.id === id);
        return `<div class="glos-item" data-t="${esc(sinAcentos(t + " " + d))}"><dt>${esc(t)}</dt><dd>${esc(d)}${c ? ` <a class="glos-link" href="#/${c.id}">→ ${esc(c.short)}</a>` : ""}</dd></div>`;
      }).join("")}</dl>`;
    const q = $("#glos-q"), n = $("#glos-n");
    const filtra = () => { const s = sinAcentos(q.value.trim()); let k = 0; $$(".glos-item").forEach(it => { const v = !s || it.dataset.t.includes(s); it.hidden = !v; if (v) k++; }); n.textContent = s ? `${k} de ${GLOSARIO.length} términos` : `${GLOSARIO.length} términos`; };
    q.addEventListener("input", filtra); filtra();
  }

  // ---------- Enlaces con los datos ya puestos ----------
  // El estado de la calculadora viaja en el propio enlace (#/id?d=<JSON>). Solo son números y textos
  // que escribe el usuario (sin datos de pacientes). Al abrirlo se valida y se limpia la dirección.
  function enlaceActual() {
    const c = current, st = state[c.id], d = {};
    Object.keys(st).forEach(k => { const v = st[k]; if (v !== "" && v !== undefined && v !== null && !(Array.isArray(v) && !v.length)) d[k] = v; });
    return `${location.origin}${location.pathname}#/${c.id}?d=${encodeURIComponent(JSON.stringify(d))}`;
  }
  function cargarDesdeEnlace(c, crudo) {
    let obj; try { obj = JSON.parse(decodeURIComponent(crudo)); } catch (e) { return false; }
    if (!obj || typeof obj !== "object") return false;
    initState(c); const st = state[c.id];
    const permitidas = new Set([...Object.keys(st), ...c.fields.map(f => f.id), ...(c.analisis ? c.analisis.campos.map(f => "an_" + f.k) : [])]);
    const texto = v => String(v).slice(0, 200);
    Object.keys(obj).forEach(k => {
      if (!permitidas.has(k)) return;
      const v = obj[k], f = c.fields.find(x => x.id === k);
      if (k === "rows" && Array.isArray(v)) st.rows = v.slice(0, 50).map(r => { const o = JSON.parse(JSON.stringify(c.newRow || {})); Object.keys(o).forEach(kk => { if (r && r[kk] !== undefined) o[kk] = texto(r[kk]); }); return o; });
      else if (f && f.type === "check") st[k] = v === true;
      else if (["string", "number"].includes(typeof v)) st[k] = texto(v);
    });
    return true;
  }
  async function compartirEnlace() {
    const url = enlaceActual(), movil = esIOS() || /Android/i.test(navigator.userAgent);
    if (movil && navigator.share) { try { await navigator.share({ title: "Tamaño Muestral · " + current.short, url }); } catch (e) { /* cancelado */ } return; }
    try { await navigator.clipboard.writeText(url); toast("Enlace copiado: pégalo en un correo, un mensaje o la plataforma del curso.", 4000); }
    catch (e) { window.prompt("Copia este enlace:", url); }
  }

  // ---------- Enrutado ----------
  function buildNav() {
    $("#calc-nav").innerHTML = `<a href="#/" data-r="">Inicio</a>` + CALCS.map(c => `<a href="#/${c.id}" data-r="${c.id}">${esc(c.short)}</a>`).join("") + `<a href="#/glosario" data-r="glosario">Glosario</a>`;
  }
  function route() {
    const [id, qs] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const c = CALCS.find(x => x.id === id);
    const md = /(?:^|&)d=([^&]*)/.exec(qs || "");
    if (c && md) {
      const ok = cargarDesdeEnlace(c, md[1]);
      history.replaceState(null, "", `#/${c.id}`);
      if (ok) setTimeout(() => toast("Datos cargados desde el enlace.", 3000), 50);
    }
    const informe = !!c && /(^|&)informe=1(&|$)/.test(qs || "");
    document.body.classList.toggle("ver-informe", informe);
    if (c) renderCalc(c); else if (id === "glosario") renderGlosario(); else renderHome();
    if (informe) { $$("details.steps").forEach(d => { d.open = true; }); if (esIOS()) prepararPDF(); }
    $$("#calc-nav a").forEach(a => a.classList.toggle("active", a.dataset.r === (c ? c.id : id === "glosario" ? "glosario" : "")));
    const act = $("#calc-nav a.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    window.scrollTo(0, 0);
  }

  // ---------- Eventos ----------
  view.addEventListener("input", e => {
    const ai = e.target.closest(".an-in");
    if (ai) { state[current.id]["an_" + ai.dataset.k] = ai.value; pintarAnalisis(); return; }
    const ci = e.target.closest(".cmp-in");
    if (ci) { const st = state[current.id]; if (ci.dataset.row === undefined) st[ci.dataset.k] = ci.value; else st.rows[Number(ci.dataset.row)][ci.dataset.k] = ci.value; update(); return; }
    const i = e.target.closest(".fld-input"); if (!i) return;
    state[current.id][i.dataset.id] = i.value; syncChips(); update();
  });
  view.addEventListener("change", e => {
    const k = e.target.closest("[data-chk]"); if (!k) return;
    state[current.id][k.dataset.chk] = k.checked; update();
  });
  view.addEventListener("click", e => {
    const t = e.target;
    let b;
    if ((b = t.closest(".info-btn"))) {
      const h = $("#help-" + b.dataset.info), open = h.hidden;
      h.hidden = !open; b.setAttribute("aria-expanded", String(open)); return;
    }
    if ((b = t.closest(".quiz-o"))) {
      const q = QUIZ[Number(b.dataset.quiz)], box = b.closest(".quiz-q"), j = Number(b.dataset.o), fb = $(".quiz-fb", box);
      $$(".quiz-o", box).forEach(x => x.classList.remove("quiz-o--ok", "quiz-o--mal"));
      b.classList.add(j === q.ok ? "quiz-o--ok" : "quiz-o--mal");
      fb.innerHTML = (j === q.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> ") + q.e; fb.hidden = false; return;
    }
    if ((b = t.closest("[data-q]"))) { state[current.id][b.dataset.q] = b.dataset.v; syncInputs(); update(); return; }
    if ((b = t.closest("[data-seg] button"))) { state[current.id][b.parentNode.dataset.seg] = b.dataset.v; $$("button", b.parentNode).forEach(x => x.classList.toggle("active", x === b)); syncInputs(); update(); return; }
    if ((b = t.closest("[data-act]"))) {
      const a = b.dataset.act;
      if (a === "tabla-beta") { tablaBeta = Number(b.dataset.b); pintarTablaExacta(); return; }
      if (a === "tabla-celda") {
        Object.assign(state.lqas, { pU: b.dataset.u, pL: b.dataset.l, alpha: "5", beta: b.dataset.b });
        syncInputs(); update(); pintarTablaExacta();
        $("#res").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (a === "cmp-add" || a === "cmp-del") {
        const st = state[current.id];
        if (a === "cmp-add") st.rows.push(JSON.parse(JSON.stringify(current.newRow))); else st.rows.splice(Number(b.dataset.row), 1);
        const keep = $("#example-text").hidden; renderCalc(current); $("#example-text").hidden = keep; $("#example-text").textContent = current.exampleText;
        if (a === "cmp-add") { const ins = $$(".cmp-nom"); ins[ins.length - 1].focus(); }
        return;
      }
      if (a === "ejemplo") {
        if (current.custom) { state[current.id] = JSON.parse(JSON.stringify(current.example)); renderCalc(current); }
        else { Object.assign(state[current.id], current.example); syncInputs(); update(); }
        const et = $("#example-text"); et.textContent = current.exampleText; et.hidden = false;
        if (!matchMedia("(min-width: 900px)").matches) $("#res").scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (a === "limpiar") {
        delete state[current.id]; initState(current); if (current.custom) renderCalc(current); else { syncInputs(); update(); } $("#example-text").hidden = true;
      } else if (a === "informe") location.hash = `#/${current.id}?informe=1`;
      else if (a === "volver") location.hash = `#/${current.id}`;
      else if (a === "imprimir") { if (esIOS()) guardarPDF(); else window.print(); }
      else if (a === "enlace") compartirEnlace();
      else if (a === "ver") $("#res").scrollIntoView({ behavior: "smooth", block: "start" });
      else if (a === "sortear-estratos") {
        const o = b.closest(".sorteo").querySelector(".sorteo-out");
        o.innerHTML = (current.sorteoDatos || []).filter(x => x.n > 0).map(x => `<h4 class="sorteo-estrato">${esc(x.nom)} · ${x.n} de ${nf(x.N, 0)}</h4>` + sortear("simple", x.n, x.N)).join("");
      }
      else if (a === "sortear") { const o = b.closest(".sorteo").querySelector(".sorteo-out"); o.innerHTML = sortear(b.dataset.tipo, Number(b.dataset.n), Number(b.dataset.pop)); }
    }
  });

  // Imprimir: abrir los desplegables y restaurarlos después
  let cerrados = [];
  window.addEventListener("beforeprint", () => { cerrados = $$("details").filter(d => !d.open); cerrados.forEach(d => { d.open = true; }); });
  window.addEventListener("afterprint", () => { cerrados.forEach(d => { d.open = false; }); cerrados = []; });

  // ---------- Tema ----------
  function setTema(t) {
    document.documentElement.setAttribute("data-tema", t);
    const m = $("#meta-theme-color"); if (m) m.content = t === "claro" ? "#f0f7fb" : "#0d1b2a";
  }
  setTema(document.documentElement.getAttribute("data-tema") || "claro");
  $("#btn-tema").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
    setTema(t); try { localStorage.setItem("tammuestral-tema", t); } catch (e) { /* sin almacenamiento */ }
  });
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => {
    let guardado = null; try { guardado = localStorage.getItem("tammuestral-tema"); } catch (e) { /* */ }
    if (!guardado) setTema(ev.matches ? "oscuro" : "claro");
  });

  // ---------- Modales ----------
  const KEY_BIENV = "tammuestral-bienvenida-vista";
  const mb = $("#modal-bienvenida"), ma = $("#modal-acerca");
  let vista = null; try { vista = localStorage.getItem(KEY_BIENV); } catch (e) { /* */ }
  if (!vista) mb.hidden = false;
  $("#btn-bienv-ok").addEventListener("click", () => {
    if ($("#modal-no-repetir").checked) { try { localStorage.setItem(KEY_BIENV, "1"); } catch (e) { /* */ } }
    mb.hidden = true;
  });
  $("#btn-acerca").addEventListener("click", () => { ma.hidden = false; });
  $("#btn-acerca-cerrar").addEventListener("click", () => { ma.hidden = true; });
  ma.addEventListener("click", e => { if (e.target === ma) ma.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { ma.hidden = true; } });

  // ---------- Versiones y novedades ----------
  const KEY_VERSION = "tammuestral-version-vista";
  const listaCambios = n => `<div class="version-item"><div class="version-cab"><b>${esc(n.titulo)}</b><span class="version-tag">v${esc(n.version)} · ${esc(n.fecha)}</span></div><ul>${n.cambios.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  $("#historial-versiones").innerHTML = NOVEDADES.map(listaCambios).join("");
  $("#about-version").textContent = $("#footer-version").textContent = `Versión ${APP_VERSION}`;
  const mn = $("#modal-novedades");
  $("#btn-novedades-ok").addEventListener("click", () => { mn.hidden = true; try { localStorage.setItem(KEY_VERSION, APP_VERSION); } catch (e) { /* */ } });
  (function gestionarNovedades() {
    let vistaV = null; try { vistaV = localStorage.getItem(KEY_VERSION); } catch (e) { return; }
    if (vistaV === APP_VERSION) return;
    // Usuario nuevo (nunca vio la bienvenida ni una versión): no se le enseñan novedades
    if (!vistaV && !vista) { try { localStorage.setItem(KEY_VERSION, APP_VERSION); } catch (e) { /* */ } return; }
    const idx = NOVEDADES.findIndex(n => n.version === vistaV);
    const nuevas = idx > 0 ? NOVEDADES.slice(0, idx) : [NOVEDADES[0]];
    $("#novedades-sub").textContent = nuevas.length > 1 ? "Esto es lo nuevo desde tu última visita" : "Gracias por mantener la app al día";
    $("#novedades-body").innerHTML = nuevas.map(listaCambios).join("");
    if (mb.hidden) mn.hidden = false;
  })();

  // ---------- Service worker y aviso de nueva versión ----------
  // Solo se recarga cuando el usuario pulsa «Actualizar»: en la primera instalación el SW
  // también toma el control (clients.claim) y no debe provocar una recarga inesperada.
  let actualizando = false;
  function avisoActualizacion(reg) {
    if ($("#update-banner")) return;
    const b = document.createElement("div");
    b.id = "update-banner"; b.className = "update-banner no-print"; b.setAttribute("role", "status");
    b.innerHTML = "<span>Nueva versión disponible</span><button type=\"button\">Actualizar</button>";
    b.querySelector("button").addEventListener("click", () => { actualizando = true; if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); b.remove(); });
    document.body.appendChild(b);
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(reg => {
      // Una versión que ya esperaba de una visita anterior
      if (reg.waiting && navigator.serviceWorker.controller) avisoActualizacion(reg);
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => {
          // Solo si ya había una versión activa (no en la primera instalación)
          if (nw.state === "installed" && navigator.serviceWorker.controller) avisoActualizacion(reg);
        });
      });
    }).catch(() => {});
    let recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (recargando || !actualizando) return; recargando = true; location.reload(); });
  }

  window.TamanoMuestral = { generarPDF, enlaceActual };   // solo para pruebas desde la consola

  // ---------- Instalar como aplicación ----------
  let avisoInstalar = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); avisoInstalar = e; const b = $("#btn-instalar"); if (b) b.hidden = false; });
  $("#btn-instalar").addEventListener("click", async () => { if (!avisoInstalar) return; avisoInstalar.prompt(); try { await avisoInstalar.userChoice; } catch (e) { /* */ } avisoInstalar = null; $("#btn-instalar").hidden = true; });
  window.addEventListener("appinstalled", () => { const b = $("#btn-instalar"); if (b) b.hidden = true; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) { const i = $("#instalar-bloque"); if (i) i.classList.add("instalada"); }

  // ---------- Arranque ----------
  buildNav();
  window.addEventListener("hashchange", route);
  route();
})();
