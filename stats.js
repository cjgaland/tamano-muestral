// ============================================================
//  stats.js — Funciones estadísticas puras (sin DOM) · Tamaño Muestral
//  Usable en navegador (window.Stats) y en Node (module.exports / ESM por import por defecto).
// ============================================================
(function (root) {
  "use strict";

  // ---------- Utilidades numéricas ----------
  // ceil tolerante a ruido de coma flotante (p. ej. 97.00000000001 -> 97)
  function ceilN(x) { return Math.ceil(x - 1e-9); }

  // erfc de alta precisión: serie de Taylor de erf (|x|<2.5) y fracción continua para la cola
  function erfc(x) {
    if (x < 0) return 2 - erfc(-x);
    if (x < 2.5) {
      let term = x, sum = x, n = 0;
      while (Math.abs(term) > 1e-17 * Math.abs(sum)) {
        n++;
        term *= -x * x / n;
        sum += term / (2 * n + 1);
        if (n > 200) break;
      }
      return 1 - (2 / Math.sqrt(Math.PI)) * sum;
    }
    // fracción continua (Lentz modificado) para erfc(x), x >= 2.5
    let f = 0;
    for (let k = 60; k >= 1; k--) f = (k / 2) / (x + f);
    return Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + f);
  }

  function normCdf(x) { return 0.5 * erfc(-x / Math.SQRT2); }

  // Inversa de la normal: algoritmo de Acklam + un paso de refinamiento de Halley (precisión ~1e-15)
  function normInv(p) {
    if (!(p > 0 && p < 1)) {
      if (p === 0) return -Infinity;
      if (p === 1) return Infinity;
      return NaN;
    }
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425;
    let x;
    if (p < pl) {
      const q = Math.sqrt(-2 * Math.log(p));
      x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 1 - pl) {
      const q = p - 0.5, r = q * q;
      x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
          (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    // Refinamiento de Halley
    const e = normCdf(x) - p;
    const u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
    x = x - u / (1 + x * u / 2);
    return x;
  }

  // z bilateral (1-α/2) o unilateral (1-α) a partir de α
  function zAlpha(alpha, sides) { return normInv(sides === 1 ? 1 - alpha : 1 - alpha / 2); }

  // ---------- Log-gamma (Lanczos, g=7, n=9) y combinatoria ----------
  const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1;
    let a = LANCZOS[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function logChoose(n, k) {
    if (k < 0 || k > n) return -Infinity;
    return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
  }

  // ---------- Distribuciones discretas ----------
  function binomPmf(x, n, p) {
    if (x < 0 || x > n) return 0;
    if (p <= 0) return x === 0 ? 1 : 0;
    if (p >= 1) return x === n ? 1 : 0;
    return Math.exp(logChoose(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p));
  }
  // X ~ Hipergeométrica(N población, K éxitos en la población, n muestra)
  function hyperPmf(x, N, K, n) {
    if (x < Math.max(0, n - (N - K)) || x > Math.min(n, K)) return 0;
    return Math.exp(logChoose(K, x) + logChoose(N - K, n - x) - logChoose(N, n));
  }
  function pmfArray(n, p, N) {
    const arr = new Array(n + 1);
    if (N) {
      const K = Math.round(p * N);
      for (let x = 0; x <= n; x++) arr[x] = hyperPmf(x, N, K, n);
    } else {
      for (let x = 0; x <= n; x++) arr[x] = binomPmf(x, n, p);
    }
    return arr;
  }
  function binomCdf(x, n, p) { let s = 0; for (let i = 0; i <= Math.min(x, n); i++) s += binomPmf(i, n, p); return Math.min(1, s); }
  function hyperCdf(x, N, K, n) { let s = 0; for (let i = 0; i <= Math.min(x, n); i++) s += hyperPmf(i, N, K, n); return Math.min(1, s); }

  // ---------- Correcciones y pérdidas ----------
  function finiteCorrection(n0, N) { return n0 / (1 + (n0 - 1) / N); }
  function withLoss(n, L) { return L > 0 ? ceilN(n / (1 - L)) : n; }

  // ---------- 1. Una proporción ----------
  function sampleProportion(o) {
    const z = zAlpha(1 - o.conf, 2);
    const n0 = z * z * o.p * (1 - o.p) / (o.e * o.e);
    const n0c = ceilN(n0);
    let nCorr = null, n = n0c;
    if (o.N) { nCorr = finiteCorrection(n0, o.N); n = ceilN(nCorr); }
    return { z, n0, n0c, nCorr, n, nFinal: withLoss(n, o.loss || 0) };
  }

  // ---------- 2. Una media ----------
  function sampleMean(o) {
    const z = zAlpha(1 - o.conf, 2);
    const n0 = z * z * o.sigma * o.sigma / (o.e * o.e);
    const n0c = ceilN(n0);
    let nCorr = null, n = n0c;
    if (o.N) { nCorr = finiteCorrection(n0, o.N); n = ceilN(nCorr); }
    return { z, n0, n0c, nCorr, n, nFinal: withLoss(n, o.loss || 0) };
  }

  // ---------- 3. Dos proporciones ----------
  function twoProportions(o) {
    const k = o.k || 1, sides = o.sides === 1 ? 1 : 2;
    const za = zAlpha(o.alpha, sides), zb = normInv(o.power);
    const pbar = (o.p1 + k * o.p2) / (1 + k), qbar = 1 - pbar;
    const diff = o.p1 - o.p2;
    const termA = za * Math.sqrt((1 + 1 / k) * pbar * qbar);
    const termB = zb * Math.sqrt(o.p1 * (1 - o.p1) + o.p2 * (1 - o.p2) / k);
    const n1raw = Math.pow(termA + termB, 2) / (diff * diff);
    let n1c = null, n1use = n1raw;
    if (o.fleiss) {
      n1c = (n1raw / 4) * Math.pow(1 + Math.sqrt(1 + 2 * (k + 1) / (k * n1raw * Math.abs(diff))), 2);
      n1use = n1c;
    }
    const n1 = ceilN(n1use), n2 = ceilN(k * n1use);
    const L = o.loss || 0;
    return { za, zb, pbar, qbar, diff, termA, termB, n1raw, n1c, n1, n2, n1Final: withLoss(n1, L), n2Final: withLoss(n2, L) };
  }

  // ---------- 4. Dos medias ----------
  function twoMeans(o) {
    const k = o.k || 1, sides = o.sides === 1 ? 1 : 2;
    const za = zAlpha(o.alpha, sides), zb = normInv(o.power);
    const n1raw = (1 + 1 / k) * o.sigma * o.sigma * Math.pow(za + zb, 2) / (o.delta * o.delta);
    const n1 = ceilN(n1raw), n2 = ceilN(k * n1raw);
    const L = o.loss || 0;
    return { za, zb, n1raw, n1, n2, n1Final: withLoss(n1, L), n2Final: withLoss(n2, L) };
  }

  // ---------- 5. LQAS ----------
  // Para un n dado devuelve la mejor regla d (o null) con P(X>=d|pL)<=alpha y P(X<d|pU)<=beta
  function lqasBestRule(n, o) {
    const tol = 1e-12;
    const pmfL = pmfArray(n, o.pL, o.N), pmfU = pmfArray(n, o.pU, o.N);
    // sfL[d] = P(X>=d | pL), cdfU[d] = P(X<d | pU)
    const sfL = new Array(n + 2).fill(0), cdfU = new Array(n + 2).fill(0);
    for (let d = n; d >= 0; d--) sfL[d] = sfL[d + 1] + pmfL[d];
    for (let d = 1; d <= n + 1; d++) cdfU[d] = cdfU[d - 1] + pmfU[d - 1];
    let best = null;
    for (let d = 0; d <= n + 1; d++) {
      const a = Math.min(1, sfL[d]), b = Math.min(1, cdfU[d]);
      if (a <= o.alpha + tol && b <= o.beta + tol) {
        const m = Math.max(a, b);
        if (!best || m < best.m - 1e-15) best = { d, alphaReal: a, betaReal: b, m };
      }
    }
    return best;
  }

  function lqasSearch(o) {
    const nMax = o.N ? Math.min(o.N, 1000) : 1000;
    for (let n = 1; n <= nMax; n++) {
      const r = lqasBestRule(n, o);
      if (r) return { n, d: r.d, alphaReal: r.alphaReal, betaReal: r.betaReal, method: o.N ? "hypergeometric" : "binomial" };
    }
    return null;
  }

  function lqas(o) {
    const L = o.loss || 0;
    const main = lqasSearch(o);
    if (!main) return { found: false, nMax: o.N ? Math.min(o.N, 1000) : 1000 };
    const res = Object.assign({ found: true }, main);
    res.nFinal = o.N ? Math.min(withLoss(main.n, L), o.N) : withLoss(main.n, L);
    if (o.N) {
      const bin = lqasSearch({ pL: o.pL, pU: o.pU, alpha: o.alpha, beta: o.beta });
      res.binomial = bin; // n (y d) que saldría ignorando el tamaño de la población
      res.KL = Math.round(o.pL * o.N); res.KU = Math.round(o.pU * o.N);
    }
    return res;
  }

  // Curva característica operativa: P(clasificar ADECUADA | cumplimiento real p) = P(X >= d)
  function lqasOC(n, d, N, points) {
    const out = [];
    if (N) {
      const step = Math.max(1, Math.floor(N / (points || 100)));
      const Ks = []; for (let K = 0; K <= N; K += step) Ks.push(K);
      if (Ks[Ks.length - 1] !== N) Ks.push(N);
      for (const K of Ks) {
        let s = 0; for (let x = d; x <= n; x++) s += hyperPmf(x, N, K, n);
        out.push({ p: K / N, pa: Math.min(1, s) });
      }
    } else {
      const m = points || 100;
      for (let i = 0; i <= m; i++) {
        const p = i / m; let s = 0;
        for (let x = d; x <= n; x++) s += binomPmf(x, n, p);
        out.push({ p, pa: Math.min(1, s) });
      }
    }
    return out;
  }
  // P(clasificar ADECUADA | p) en un punto
  function lqasPAccept(n, d, N, p) {
    let s = 0;
    for (let x = d; x <= n; x++) s += N ? hyperPmf(x, N, Math.round(p * N), n) : binomPmf(x, n, p);
    return Math.min(1, s);
  }

  // Indicador compuesto de porcentaje simple (Saturno, UT19): Σ cumplimientos ÷ Σ oportunidades.
  // rows = [{ c, o }] con 0 ≤ c ≤ o y o ≥ 1. Devuelve también la media de los porcentajes y el peso de cada criterio.
  function composite(rows) {
    const sc = rows.reduce((a, r) => a + r.c, 0), so = rows.reduce((a, r) => a + r.o, 0);
    return { sc, so, comp: sc / so, mean: rows.reduce((a, r) => a + r.c / r.o, 0) / rows.length, weights: rows.map(r => r.o / so) };
  }

  // Intervalo de confianza de Wilson para una proporción (x de n), sin corrección de continuidad.
  // Más fiable que el de Wald (p ± z·√(p(1−p)/n)) con muestras pequeñas o proporciones extremas.
  function wilson(x, n, conf) {
    const z = normInv(1 - (1 - conf) / 2), p = x / n, z2 = z * z, den = 1 + z2 / n;
    const centro = (p + z2 / (2 * n)) / den, semi = z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n)) / den;
    return { p, lo: x === 0 ? 0 : Math.max(0, centro - semi), hi: x === n ? 1 : Math.min(1, centro + semi), z };
  }

  // Kappa de Cohen para dos observadores y dos categorías (tabla 2×2).
  // a = ambos «cumple»; b = A cumple y B no; c = A no y B cumple; d = ambos «no cumple».
  // ee = error estándar aproximado de muestra grande (Cohen): √(po(1−po) / (n(1−pe)²)).
  // PABAK = kappa ajustado por prevalencia y sesgo = 2·po − 1.
  function kappa(a, b, c, d, conf) {
    const n = a + b + c + d, po = (a + d) / n;
    const pA = (a + b) / n, pB = (a + c) / n, pe = pA * pB + (1 - pA) * (1 - pB);
    const k = pe < 1 ? (po - pe) / (1 - pe) : NaN;
    const ee = pe < 1 ? Math.sqrt(po * (1 - po) / (n * (1 - pe) * (1 - pe))) : NaN;
    const z = normInv(1 - (1 - (conf || 0.95)) / 2);
    return { n, po, pe, k, ee, lo: Math.max(-1, k - z * ee), hi: Math.min(1, k + z * ee), pabak: 2 * po - 1, pA, pB };
  }

  // Reparto de n entre estratos de tamaños Ns. modo "prop" (proporcional al tamaño) o "igual".
  // Redondeo por restos mayores para que la suma sea exactamente n, sin superar el tamaño de ningún estrato.
  function allocate(n, Ns, modo) {
    const N = Ns.reduce((x, y) => x + y, 0);
    n = Math.min(n, N);
    const ideal = Ns.map(Nh => modo === "igual" ? n / Ns.length : n * Nh / N);
    const out = ideal.map((v, i) => Math.min(Math.floor(v + 1e-9), Ns[i]));
    let falta = n - out.reduce((x, y) => x + y, 0);
    while (falta > 0) {
      // siguiente estrato con mayor resto que todavía tenga casos disponibles
      let best = -1, br = -Infinity;
      ideal.forEach((v, i) => { const r = v - out[i]; if (out[i] < Ns[i] && r > br) { br = r; best = i; } });
      if (best < 0) break;
      out[best]++; falta--;
    }
    return out;
  }

  // Muestreo por conglomerados (plantas, consultas…): efecto de diseño DEFF = 1 + (m − 1)·ICC (Kish).
  // n = tamaño calculado como si fuera muestreo aleatorio simple; m = casos por conglomerado.
  function clusterSample(n, m, icc) {
    const deff = 1 + (m - 1) * icc, nAdj = ceilN(n * deff), k = ceilN(nAdj / m);
    return { deff, nAdj, k, total: k * m };
  }

  // Proporción del grupo 2 a partir de p1 y de un riesgo relativo (RR) o una odds ratio (OR).
  function p2DesdeRR(p1, rr) { return rr * p1; }
  function p2DesdeOR(p1, or) { return or * p1 / (1 - p1 + or * p1); }

  const api = { ceilN, erfc, normCdf, normInv, zAlpha, lgamma, logChoose, binomPmf, hyperPmf, binomCdf, hyperCdf,
    finiteCorrection, withLoss, sampleProportion, sampleMean, twoProportions, twoMeans,
    lqas, lqasBestRule, lqasOC, lqasPAccept, composite, wilson, kappa, allocate, clusterSample, p2DesdeRR, p2DesdeOR };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Stats = api;
})(typeof window !== "undefined" ? window : globalThis);
