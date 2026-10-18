// ============================================================
//  app.js — UI y estado · Tamaño Muestral
//  Las fórmulas viven en stats.js (funciones puras). Aquí solo: definición
//  de calculadoras (campos, ayudas, ejemplos, desarrollo paso a paso), render y eventos.
// ============================================================
(function () {
  "use strict";
  const S = window.Stats;

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
    help: "Probabilidad máxima que aceptas de dar por «diferente» algo que en realidad es igual (falso positivo, error tipo I). Lo habitual es 5 %." };
  const F_SIDES = { id: "sides", label: "Contraste", type: "seg", def: "2", options: [["2", "Bilateral"], ["1", "Unilateral"]],
    help: "Bilateral: te interesa detectar diferencias en cualquier sentido (lo habitual y lo más prudente). Unilateral: solo te interesa un sentido (p. ej. solo mejora), y debe estar justificado de antemano; necesita menos muestra." };
  const F_POWER = { id: "power", label: "Potencia (1 − β)", unit: "%", def: "80", quick: [80, 90, 95],
    help: "Probabilidad de detectar la diferencia si de verdad existe (1 menos el error tipo II). 80 % es el mínimo habitual; 90 % si quieres más seguridad." };
  const F_K = { id: "k", label: "Razón de tamaños k = n₂ / n₁", def: "1", quick: [1, 2, 3],
    help: "1 si los dos grupos tienen el mismo tamaño (lo más eficiente). Si el grupo 2 es el doble que el 1, k = 2." };
  const F_NPOP = { id: "N", label: "Tamaño de la población N", unit: "casos", opt: true, def: "", ph: "opcional",
    help: "Número total de unidades de las que extraerás la muestra (p. ej. historias del periodo). Si lo conoces y la muestra es una fracción apreciable (> 5 %), se aplica la corrección por población finita y necesitas menos casos. Si no lo conoces o es muy grande, déjalo vacío." };
  const F_CONF = { id: "conf", label: "Nivel de confianza (1 − α)", unit: "%", def: "95", quick: [90, 95, 99],
    help: "Seguridad con la que quieres que el intervalo calculado contenga el valor real. 95 % es el estándar; 99 % exige más muestra." };

  // ---------- Definición de calculadoras ----------
  const CALCS = [
    // ===================== 1. UNA PROPORCIÓN =====================
    {
      id: "proporcion", short: "Un porcentaje", title: "Estimar una proporción (porcentaje)",
      q: "¿Quieres estimar un porcentaje (p. ej. el % de historias con el consentimiento firmado)?",
      a: "Calculadora de <b>una proporción</b>",
      what: "Calcula cuántos casos debes revisar para estimar un porcentaje de la población (cumplimiento, prevalencia, satisfacción…) con un margen de error y una confianza fijados de antemano.",
      when: "Úsala cuando el objetivo es <b>medir</b> «¿qué porcentaje es…?» con un intervalo de confianza estrecho. Si solo necesitas decidir si una unidad alcanza un estándar (sí/no), con menos casos basta LQAS.",
      fields: [
        F_CONF,
        { id: "e", label: "Precisión absoluta e (± puntos porcentuales)", unit: "puntos %", def: "5", quick: [3, 5, 10],
          help: "Margen de error que toleras a cada lado. Con e = 5 y un resultado del 80 %, el valor real estaría entre 75 % y 85 %. Cuanto menor e, mucha más muestra." },
        { id: "p", label: "Proporción esperada p", unit: "%", def: "50", quick: [{ v: 50, l: "No lo sé → 50 %", accent: true }, 20, 80, 90],
          help: "Porcentaje que crees que encontrarás (por un estudio previo o un piloto). Si no tienes ni idea, usa 50 %: es el caso más conservador porque p(1−p) es máximo, y garantiza una muestra suficiente sea cual sea el valor real." },
        F_NPOP, F_LOSS
      ],
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
          warns, steps, mini: nf(r.nFinal, 0)
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
          warns, steps, mini: nf(r.nFinal, 0)
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
      fields: [
        { id: "p1", label: "Proporción esperada en el grupo 1 (p₁)", unit: "%", def: "", ph: "p. ej. 40", help: "Porcentaje esperado en el grupo de referencia (p. ej. cumplimiento actual o «antes»), según datos previos o un piloto." },
        { id: "p2", label: "Proporción esperada en el grupo 2 (p₂)", unit: "%", def: "", ph: "p. ej. 60", help: "Porcentaje que esperas lograr (o la menor diferencia que sería relevante). Cuanto más cerca de p₁, mucha más muestra." },
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
        R(E, v, "p2", "p₂", 0, 100, false, false);
        if (!E.length && v.p1 === v.p2) E.push({ f: "p2", m: "p₁ y p₂ no pueden ser iguales: no habría diferencia que detectar." });
        R(E, v, "alpha", "α", 0, 50, false, false);
        R(E, v, "power", "Potencia", 50, 100, false, false);
        R(E, v, "k", "Razón k", 0.1, 10, true, true);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (E.length) return { errors: E };
        const p1 = v.p1 / 100, p2 = v.p2 / 100, alpha = v.alpha / 100, power = v.power / 100, L = v.loss / 100, k = v.k, sides = v.sides === "1" ? 1 : 2;
        const r = S.twoProportions({ p1, p2, alpha, power, k, sides, fleiss: !!v.fleiss, loss: L });
        const steps = [];
        steps.push({ t: "Proporción media ponderada", f: ["p̄ = (p₁ + k·p₂) / (1 + k)", `p̄ = (${nf(p1, 4)} + ${nf(k, 4)}·${nf(p2, 4)}) / (1 + ${nf(k, 4)}) = ${nfix(r.pbar, 4)}`, `q̄ = 1 − p̄ = ${nfix(r.qbar, 4)}`] });
        steps.push({ t: "Valores críticos", f: [sides === 1 ? `z_α = z(1 − α) = z(${nf(1 - alpha, 4)}) = ${nfix(r.za, 4)}   (unilateral)` : `z_α = z(1 − α/2) = z(${nf(1 - alpha / 2, 4)}) = ${nfix(r.za, 4)}   (bilateral)`, `z_β = z(potencia) = z(${nf(power, 4)}) = ${nfix(r.zb, 4)}`] });
        steps.push({ t: "Tamaño del grupo 1", f: [
          "n₁ = [ z_α·√((1 + 1/k)·p̄·q̄) + z_β·√(p₁(1−p₁) + p₂(1−p₂)/k) ]² / (p₁ − p₂)²",
          `n₁ = [ ${nfix(r.za, 4)}·√((1 + 1/${nf(k, 4)})·${nfix(r.pbar, 4)}·${nfix(r.qbar, 4)}) + ${nfix(r.zb, 4)}·√(${nf(p1, 4)}·${nf(1 - p1, 4)} + ${nf(p2, 4)}·${nf(1 - p2, 4)}/${nf(k, 4)}) ]² / (${nf(p1, 4)} − ${nf(p2, 4)})²`,
          `n₁ = [ ${nfix(r.termA, 4)} + ${nfix(r.termB, 4)} ]² / ${nfix(r.diff * r.diff, 4)} = ${nfix(r.n1raw, 2)}`] });
        if (v.fleiss) steps.push({ t: "Corrección de continuidad (Fleiss)", f: ["n₁' = (n₁/4)·(1 + √(1 + 2(k+1) / (k·n₁·|p₁−p₂|)))²", `n₁' = (${nfix(r.n1raw, 2)}/4)·(1 + √(1 + 2·${nf(k + 1, 4)} / (${nf(k, 4)}·${nfix(r.n1raw, 2)}·${nf(Math.abs(r.diff), 4)})))² = ${nfix(r.n1c, 2)}`] });
        steps.push({ t: "Redondeo hacia arriba y tamaño del grupo 2", f: [`n₁ = ${r.n1}`, `n₂ = k · n₁ = ${nf(k, 4)} · ${nfix(v.fleiss ? r.n1c : r.n1raw, 2)} → ${r.n2}`] });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n₁ final = ${r.n1} / (1 − ${nf(L, 4)}) → ${r.n1Final}`, `n₂ final = ${r.n2} / (1 − ${nf(L, 4)}) → ${r.n2Final}`] });
        const warns = [];
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
          warns, steps, mini: nf(r.n1Final, 0) + " + " + nf(r.n2Final, 0)
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
    {
      id: "lqas", short: "LQAS (auditoría)", title: "LQAS · Clasificar una unidad en una auditoría",
      q: "¿Quieres decidir si una unidad o servicio alcanza un estándar (sí / no) en una auditoría?",
      a: "Calculadora <b>LQAS</b> (muestreo para aseguramiento de la calidad por lotes)",
      what: "LQAS (<i>Lot Quality Assurance Sampling</i>) calcula cuántos casos revisar (n) y cuántos deben cumplir (d) para <b>clasificar</b> una unidad como «alcanza el estándar» o «no lo alcanza», con riesgos de error controlados.",
      when: "Úsala en <b>auditorías</b> cuando no necesitas la cifra exacta de cumplimiento sino una decisión. A diferencia de «estimar una proporción» (que da un intervalo de confianza y requiere muestras grandes), LQAS suele necesitar solo 15–30 casos por unidad. Si conoces cuántos casos hay en total (N), usa la distribución hipergeométrica y la muestra se reduce.",
      fields: [
        { id: "pU", label: "Umbral superior pᵤ (cumplimiento adecuado)", unit: "%", def: "80", quick: [80, 90, 95],
          help: "Cumplimiento a partir del cual consideras que la unidad es ADECUADA (el estándar). Una unidad con cumplimiento real ≥ pᵤ debería clasificarse como adecuada." },
        { id: "pL", label: "Umbral inferior pₗ (cumplimiento inaceptable)", unit: "%", def: "50", quick: [50, 60, 70],
          help: "Cumplimiento por debajo del cual la situación es INACEPTABLE. Entre pₗ y pᵤ hay una «zona gris» en la que el método no garantiza la clasificación. Cuanto más separados estén los umbrales, menos casos hacen falta." },
        { id: "alpha", label: "Riesgo α (clasificar como adecuada una unidad inaceptable)", unit: "%", def: "10", quick: [5, 10, 20],
          help: "Probabilidad máxima de dar por ADECUADA una unidad cuyo cumplimiento real es ≤ pₗ (falso aprobado). Es el error que más preocupa en seguridad del paciente." },
        { id: "beta", label: "Riesgo β (clasificar como no adecuada una unidad adecuada)", unit: "%", def: "10", quick: [5, 10, 20],
          help: "Probabilidad máxima de dar por NO ADECUADA una unidad cuyo cumplimiento real es ≥ pᵤ (falso suspenso)." },
        { id: "N", label: "Tamaño de la población N", unit: "casos", opt: true, def: "", ph: "opcional",
          help: "Número total de casos auditables en la unidad (p. ej. historias del periodo). Si lo conoces se usa la distribución HIPERGEOMÉTRICA (muestreo sin reposición), que requiere menos casos, sobre todo si N es pequeño. Si no, se usa la BINOMIAL (población grande o desconocida)." },
        F_LOSS
      ],
      example: { pU: "80", pL: "50", alpha: "10", beta: "10", N: "100", loss: "0" },
      exampleText: "Ejemplo: auditoría de la valoración del riesgo de caídas en una unidad de Medicina Interna con 100 historias en el periodo. Estándar: 80 %; inaceptable: 50 %; α = β = 10 %.",
      compute(v) {
        const E = [];
        R(E, v, "pU", "Umbral superior", 0, 100, false, false);
        R(E, v, "pL", "Umbral inferior", 0, 100, false, false);
        if (!E.length && v.pL >= v.pU) E.push({ f: "pL", m: "El umbral inferior debe ser menor que el superior." });
        R(E, v, "alpha", "Riesgo α", 0, 50, false, false);
        R(E, v, "beta", "Riesgo β", 0, 50, false, false);
        Npop(E, v, 2);
        R(E, v, "loss", "Pérdidas", 0, 90, true, false);
        if (!E.length && v.N && Math.round(v.pL / 100 * v.N) >= Math.round(v.pU / 100 * v.N)) E.push({ f: "N", m: "Con ese N los umbrales corresponden al mismo número de casos conformes (K); sepáralos más o aumenta N." });
        if (E.length) return { errors: E };
        const pL = v.pL / 100, pU = v.pU / 100, alpha = v.alpha / 100, beta = v.beta / 100, L = v.loss / 100, N = v.N || 0;
        const r = S.lqas({ pL, pU, alpha, beta, N, loss: L });
        if (!r.found) return { errors: [], warnOnly: [`No existe ninguna regla con n ≤ ${nf(r.nMax, 0)} que cumpla los riesgos pedidos. Separa más los umbrales o acepta riesgos α y β mayores.`] };
        const n = r.n, d = r.d, hyp = r.method === "hypergeometric";
        const sdev = S.lqasPAccept;
        const steps = [];
        steps.push({ t: "Modelo de la muestra", f: hyp
          ? [`Se revisan n casos de una población de N = ${nf(N, 0)}. X = nº de casos conformes.`, `X ~ Hipergeométrica(N, K, n) con K = round(p·N)`, `K en pₗ = ${nf(r.KL, 0)} de ${nf(N, 0)}   ·   K en pᵤ = ${nf(r.KU, 0)} de ${nf(N, 0)}`]
          : ["Se revisan n casos. X = nº de casos conformes.", "X ~ Binomial(n, p)  (población grande o desconocida)"],
          note: "Regla: la unidad se clasifica como ADECUADA si X ≥ d." });
        steps.push({ t: "Condiciones que debe cumplir la regla (n, d)", f: [
          `α:  P(X ≥ d | p = pₗ = ${nf(pL, 4)}) ≤ ${nf(alpha, 4)}`,
          `β:  P(X < d | p = pᵤ = ${nf(pU, 4)}) ≤ ${nf(beta, 4)}`], note: "Se busca el menor n (1, 2, 3…) para el que existe algún d que cumple las dos condiciones; si hay varios d, se elige el que minimiza el mayor de los dos riesgos reales." });
        const rows = [d - 1, d, d + 1].filter(x => x >= 0 && x <= n).map(x => ({ d: x, a: sdev(n, x, N, pL), b: 1 - sdev(n, x, N, pU) }));
        const tbl = `<div class="table-wrap"><table class="mini"><thead><tr><th>d (con n = ${n})</th><th>α real</th><th>β real</th><th>¿Cumple?</th></tr></thead><tbody>` +
          rows.map(x => `<tr class="${x.d === d ? "sel" : ""}"><td>${x.d}</td><td>${pc(x.a, 2)}</td><td>${pc(x.b, 2)}</td><td>${x.a <= alpha + 1e-12 && x.b <= beta + 1e-12 ? "sí" : "no"}</td></tr>`).join("") + "</tbody></table></div>";
        steps.push({ t: "Resultado de la búsqueda", f: [`n = ${n}   ·   d = ${d}`, `α real = P(X ≥ ${d} | pₗ) = ${pc(r.alphaReal, 3)}`, `β real = P(X < ${d} | pᵤ) = ${pc(r.betaReal, 3)}`], html: tbl, note: n > 1 ? `Con n = ${n - 1} no existe ningún d que cumpla ambas condiciones.` : "" });
        if (L > 0) steps.push({ t: "Ajuste por pérdidas", f: ["n_final = n / (1 − pérdidas)", `n_final = ${n} / (1 − ${nf(L, 4)}) → ${r.nFinal}`], note: `La regla de decisión (d = ${d}) se aplica a ${n} casos evaluables: si algún caso no es utilizable, sigue hasta reunir ${n}.` });
        const warns = [];
        if (pU - pL < 0.15) warns.push("Los umbrales están muy próximos (menos de 15 puntos): LQAS necesitará muchos casos. Valora separarlos.");
        if (n >= N && N) warns.push("Debes revisar TODA la población (n = N): con esos umbrales y riesgos no se puede ahorrar muestra.");
        const notes = [];
        if (hyp && r.binomial) notes.push(`Con N = ${nf(N, 0)} basta revisar <b>${n}</b> casos (hipergeométrica); si se ignorase el tamaño de la población (binomial) se necesitarían ${r.binomial.n} (d = ${r.binomial.d}).`);
        if (hyp) notes.push("Con N conocido, K = round(p·N): los umbrales se redondean al número entero de casos conformes más cercano.");
        notes.push("Entre pₗ y pᵤ (zona gris) el resultado puede ser cualquiera de las dos clasificaciones; LQAS no estima el cumplimiento real.");
        const rule = `Revise <b>${n}</b> historias; si al menos <b>${d}</b> cumplen, la unidad <b>alcanza el estándar</b>; si cumplen ${d - 1} o menos, <b>no lo alcanza</b>.`;
        return {
          big: { label: "Casos a revisar (n)", value: nf(r.nFinal, 0), sub: `Regla de decisión: d = ${d} conformes` + (L > 0 ? ` · n evaluables = ${n}` : "") },
          extras: [["n", nf(n, 0)], ["d", nf(d, 0)], ["α real", pc(r.alphaReal, 1)], ["β real", pc(r.betaReal, 1)], ["Modelo", hyp ? "Hipergeométrica" : "Binomial"]],
          interp: rule + ` Si la unidad cumple de verdad un ${nf(v.pU)} % o más, la clasificará bien en el ${pc(1 - r.betaReal, 1)} de los casos; si cumple un ${nf(v.pL)} % o menos, solo la dará por adecuada por error el ${pc(r.alphaReal, 1)} de las veces.`,
          warns, notes, steps, mini: `n = ${nf(r.nFinal, 0)} · d = ${d}`,
          extraHtml: ocChart(n, d, N, pL, pU, r.alphaReal, r.betaReal)
        };
      }
    }
  ];

  // ---------- Curva característica operativa (SVG propio) ----------
  function ocChart(n, d, N, pL, pU, aReal, bReal) {
    const W = 360, H = 266, l = 40, r = 14, t = 30, b = 40, iw = W - l - r, ih = H - t - b;
    const X = p => l + p * iw, Y = q => t + (1 - q) * ih;
    const pts = S.lqasOC(n, d, N, 100).map(o => `${X(o.p).toFixed(1)},${Y(o.pa).toFixed(1)}`).join(" ");
    let g = "";
    for (let i = 0; i <= 4; i++) {
      const f = i / 4;
      g += `<line class="grid" x1="${l}" y1="${Y(f)}" x2="${W - r}" y2="${Y(f)}"/><text class="axis-t" x="${l - 5}" y="${Y(f) + 4}" text-anchor="end">${f * 100}</text>`;
      g += `<line class="grid" x1="${X(f)}" y1="${t}" x2="${X(f)}" y2="${t + ih}"/><text class="axis-t" x="${X(f)}" y="${t + ih + 15}" text-anchor="middle">${f * 100}</text>`;
    }
    const paL = aReal, paU = 1 - bReal;     // prob. de clasificar como adecuada en pL y en pU
    const xl = X(pL), xu = X(pU);
    // Etiquetas arriba a la izquierda de cada punto: como la curva es creciente, a la izquierda
    // queda por debajo del punto y no se solapan con ella ni con la línea discontinua.
    const lbl = (cls, x, y, a, b2) => { const xx = Math.max(x - 7, l + 58); return `<text class="${cls}" x="${xx}" y="${y - 22}" text-anchor="end">${a}</text><text class="${cls}" x="${xx}" y="${y - 8}" text-anchor="end">${b2}</text>`; };
    return `<div class="chart-card"><h3>Curva característica operativa</h3>
<svg class="oc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Probabilidad de clasificar la unidad como adecuada según su cumplimiento real">
${g}
<line class="mark-l" x1="${xl}" y1="${t}" x2="${xl}" y2="${t + ih}"/><line class="mark-u" x1="${xu}" y1="${t}" x2="${xu}" y2="${t + ih}"/>
<polyline class="curve" points="${pts}"/>
<circle class="pt-l" cx="${xl}" cy="${Y(paL)}" r="5"/><circle class="pt-u" cx="${xu}" cy="${Y(paU)}" r="5"/>
${lbl("lbl-l", xl, Y(paL), `pₗ = ${nf(pL * 100, 1)} %`, `→ ${nf(paL * 100, 1)} %`)}
${lbl("lbl-u", xu, Y(paU), `pᵤ = ${nf(pU * 100, 1)} %`, `→ ${nf(paU * 100, 1)} %`)}
<text class="axis-t" x="${l + iw / 2}" y="${H - 5}" text-anchor="middle">Cumplimiento real de la unidad (%)</text>
<text class="axis-t" transform="translate(11 ${t + ih / 2}) rotate(-90)" text-anchor="middle">Prob. de clasificar ADECUADA (%)</text>
</svg>
<p>Con la regla n = ${n}, d = ${d}: una unidad con cumplimiento real <b>${nf(pL * 100, 1)} %</b> se clasifica como adecuada el ${nf(paL * 100, 1)} % de las veces (error α); una con <b>${nf(pU * 100, 1)} %</b> se clasifica como adecuada el ${nf(paU * 100, 1)} % de las veces (1 − β). La curva sube de forma abrupta entre ambos umbrales.</p></div>`;
  }

  // ---------- Estado ----------
  const state = {};            // id calculadora -> {campo: valor}
  let current = null;          // calculadora activa

  function initState(c) {
    if (state[c.id]) return;
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
      return `<div class="field">${hdr}${body}</div>`;
    }
    if (f.type === "check") {
      return `<div class="field"><div class="field-head"><label class="check"><input type="checkbox" data-chk="${f.id}" /> ${esc(f.label)}</label><button type="button" class="info-btn" data-info="${f.id}" aria-expanded="false" aria-label="Ayuda">i</button></div><p class="help" id="help-${f.id}" hidden>${esc(f.help)}</p></div>`;
    }
    body = `<div class="input-wrap" data-wrap="${f.id}"><input class="fld-input" data-id="${f.id}" type="text" inputmode="decimal" autocomplete="off" placeholder="${esc(f.ph || "")}" aria-label="${esc(f.label)}" />${f.unit ? `<span class="input-unit">${esc(f.unit)}</span>` : ""}</div>`;
    if (f.quick) body += `<div class="quick">${f.quick.map(q => { const val = typeof q === "object" ? q.v : q; return `<button type="button" class="chip${typeof q === "object" && q.accent ? " chip--accent" : ""}" data-q="${f.id}" data-v="${val}">${esc(chipLabel(q, f))}</button>`; }).join("")}</div>`;
    return `<div class="field">${hdr}${body}</div>`;
  }

  function renderCalc(c) {
    current = c; initState(c);
    document.title = "Tamaño muestral · " + c.short;
    view.innerHTML = `
      <div class="print-only print-head"><h1>Informe de tamaño muestral</h1><p>${esc(c.title)} · ${new Date().toLocaleDateString("es-ES")}</p></div>
      <h1 class="page-title">${esc(c.title)}</h1>
      <div class="intro"><p><b>¿Qué es?</b> ${c.what}</p><p><b>¿Cuándo usarla?</b> ${c.when}</p></div>
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="ejemplo">Cargar ejemplo</button>
        <button class="btn" data-act="limpiar">Restablecer</button>
        <button class="btn" data-act="imprimir">Imprimir / Guardar PDF</button>
      </div>
      <p class="page-lead no-print" id="example-text" hidden></p>
      <div class="calc-grid">
        <section class="card field-form" aria-label="Parámetros">
          ${c.fields.map(fieldHtml).join("")}
          <button type="button" class="minibar" id="minibar" data-act="ver"><span>Resultado</span><span class="mb-val" id="mini-val">—</span></button>
        </section>
        <section class="calc-result-col" id="res" aria-live="polite" aria-label="Resultado"></section>
      </div>
      <div class="print-only print-foot">Aplicación desarrollada por Carlos J. Galán Doval · Médico de Familia · Técnico en Calidad y Seguridad del Paciente · Hospital de Montilla · Córdoba · Andalucía. De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.</div>`;
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
  }
  function syncChips() {
    const st = state[current.id];
    $$(".chip").forEach(b => { const x = parseNum(st[b.dataset.q]); b.classList.toggle("active", x !== null && x === Number(b.dataset.v)); });
  }

  function paramsTable(c) {
    const st = state[c.id];
    const rows = c.fields.map(f => {
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
      <div class="interp"><b>En lenguaje llano.</b> ${res.interp}</div>
      ${res.warns.map(w => `<div class="warn">⚠ ${w}</div>`).join("")}
      ${(res.notes || []).map(w => `<div class="note">ℹ ${w}</div>`).join("")}
      ${res.extraHtml || ""}
      <details class="steps"${wasOpen ? " open" : ""}><summary>Desarrollo paso a paso</summary><div class="steps-body"><ol>${stepsHtml}</ol></div></details>
      ${paramsTable(c)}
      <div class="toolbar no-print"><button class="btn" data-act="imprimir">Imprimir / Guardar PDF</button></div>`;
    mini.textContent = res.mini;
  }

  function renderHome() {
    current = null; document.title = "Tamaño Muestral · Calidad asistencial";
    view.innerHTML = `
      <h1 class="page-title">¿Qué calculadora necesito?</h1>
      <p class="page-lead">Elige según lo que quieras hacer. Cada calculadora explica qué es, ayuda a rellenar cada parámetro y muestra el desarrollo paso a paso.</p>
      <div class="guide">${CALCS.map((c, i) => `<a class="guide-card" href="#/${c.id}"><span class="guide-num">${i + 1}</span><span><div class="guide-q">${esc(c.q)}</div><div class="guide-a">→ ${c.a}</div></span><span class="guide-go">›</span></a>`).join("")}</div>
      <div class="glossary"><details class="gloss"><summary>Conceptos clave en 1 minuto</summary><dl class="gloss-body">
        <dt>Confianza (1 − α)</dt><dd>Seguridad con que el intervalo contiene el valor real. 95 % es lo habitual.</dd>
        <dt>Precisión (e)</dt><dd>Mitad de la anchura del intervalo: el «±» que toleras.</dd>
        <dt>Potencia (1 − β)</dt><dd>Probabilidad de detectar una diferencia real. Mínimo recomendable: 80 %.</dd>
        <dt>Pérdidas</dt><dd>Casos que no podrás analizar; se compensan aumentando la muestra.</dd>
        <dt>Población finita (N)</dt><dd>Si la muestra es una fracción importante de la población, se necesitan menos casos.</dd>
        <dt>Estimar frente a clasificar</dt><dd>Estimar da una cifra con su intervalo (muestras grandes); clasificar (LQAS) solo decide «alcanza / no alcanza» con muestras pequeñas.</dd>
        <dt>Muestreo aleatorio</dt><dd>Todas las fórmulas suponen que los casos se eligen al azar. Si no es así, los resultados pueden no ser válidos.</dd>
      </dl></details></div>`;
  }

  // ---------- Enrutado ----------
  function buildNav() {
    $("#calc-nav").innerHTML = `<a href="#/" data-r="">Inicio</a>` + CALCS.map(c => `<a href="#/${c.id}" data-r="${c.id}">${esc(c.short)}</a>`).join("");
  }
  function route() {
    const id = (location.hash.replace(/^#\/?/, "") || "");
    const c = CALCS.find(x => x.id === id);
    if (c) renderCalc(c); else renderHome();
    $$("#calc-nav a").forEach(a => a.classList.toggle("active", a.dataset.r === (c ? c.id : "")));
    const act = $("#calc-nav a.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    window.scrollTo(0, 0);
  }

  // ---------- Eventos ----------
  view.addEventListener("input", e => {
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
    if ((b = t.closest("[data-q]"))) { state[current.id][b.dataset.q] = b.dataset.v; syncInputs(); update(); return; }
    if ((b = t.closest("[data-seg] button"))) { state[current.id][b.parentNode.dataset.seg] = b.dataset.v; syncInputs(); update(); return; }
    if ((b = t.closest("[data-act]"))) {
      const a = b.dataset.act;
      if (a === "ejemplo") {
        Object.assign(state[current.id], current.example); syncInputs(); update();
        const et = $("#example-text"); et.textContent = current.exampleText; et.hidden = false;
        if (!matchMedia("(min-width: 900px)").matches) $("#res").scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (a === "limpiar") {
        delete state[current.id]; initState(current); syncInputs(); update(); $("#example-text").hidden = true;
      } else if (a === "imprimir") window.print();
      else if (a === "ver") $("#res").scrollIntoView({ behavior: "smooth", block: "start" });
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

  // ---------- Arranque ----------
  buildNav();
  window.addEventListener("hashchange", route);
  route();
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
