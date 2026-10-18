// Ejecutar: node tests/stats.test.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const S = createRequire(import.meta.url)("../stats.js");

let ok = 0;
function t(name, fn) { fn(); ok++; console.log("  ok  " + name); }
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ""} ${a} vs ${b}`);

console.log("Normal");
t("z 0,975 = 1,959963984540054 (<1e-9)", () => close(S.normInv(0.975), 1.959963984540054, 1e-9));
t("z 0,995 = 2,5758293035489 ; z 0,95 = 1,6448536269515 ; z 0,8 = 0,8416212335729", () => {
  close(S.normInv(0.995), 2.5758293035489004, 1e-9); close(S.normInv(0.95), 1.6448536269514722, 1e-9);
  close(S.normInv(0.8), 0.8416212335729143, 1e-9);
});
t("simetría normInv(p) = -normInv(1-p)", () => { for (const p of [1e-4, 0.001, 0.02, 0.1, 0.3, 0.49]) close(S.normInv(p), -S.normInv(1 - p), 1e-10); });
t("normCdf(normInv(p)) = p", () => { for (const p of [1e-9, 0.01, 0.2, 0.5, 0.9, 0.999]) close(S.normCdf(S.normInv(p)), p, 1e-12 + p * 1e-9); });
t("lgamma(10) = ln(9!)", () => close(S.lgamma(10), Math.log(362880), 1e-12));

console.log("1. Proporción");
t("95 %, e=5 %, p=50 % -> n0=384,15 -> 385", () => {
  const r = S.sampleProportion({ conf: 0.95, e: 0.05, p: 0.5 });
  close(r.n0, 384.1459, 1e-3); assert.equal(r.n, 385);
});
t("con N=1000 -> 278", () => assert.equal(S.sampleProportion({ conf: 0.95, e: 0.05, p: 0.5, N: 1000 }).n, 278));
t("simetría p <-> 1-p", () => assert.equal(S.sampleProportion({ conf: 0.95, e: 0.05, p: 0.2 }).n, S.sampleProportion({ conf: 0.95, e: 0.05, p: 0.8 }).n));
t("pérdidas 10 %: 385 -> 428", () => assert.equal(S.sampleProportion({ conf: 0.95, e: 0.05, p: 0.5, loss: 0.1 }).nFinal, 428));

console.log("2. Media");
t("σ=10, e=2, 95 % -> 97", () => assert.equal(S.sampleMean({ conf: 0.95, sigma: 10, e: 2 }).n, 97));
t("misma corrección finita", () => assert.equal(S.sampleMean({ conf: 0.95, sigma: 10, e: 2, N: 200 }).n, Math.ceil(96.0365 / (1 + 95.0365 / 200) - 1e-9)));

console.log("3. Dos proporciones");
t("0,40 vs 0,60, α=0,05, 80 % -> 97 por grupo", () => { const r = S.twoProportions({ p1: 0.4, p2: 0.6, alpha: 0.05, power: 0.8, k: 1 }); assert.equal(r.n1, 97); assert.equal(r.n2, 97); });
t("simetría p1<->p2 con k=1", () => assert.equal(S.twoProportions({ p1: 0.6, p2: 0.4, alpha: 0.05, power: 0.8 }).n1, 97));
t("Fleiss aumenta n", () => assert.ok(S.twoProportions({ p1: 0.4, p2: 0.6, alpha: 0.05, power: 0.8, fleiss: true }).n1 > 97));
t("unilateral < bilateral", () => assert.ok(S.twoProportions({ p1: 0.4, p2: 0.6, alpha: 0.05, power: 0.8, sides: 1 }).n1 < 97));
t("k=2: n2 = 2·n1", () => { const r = S.twoProportions({ p1: 0.4, p2: 0.6, alpha: 0.05, power: 0.8, k: 2 }); assert.ok(Math.abs(r.n2 - 2 * r.n1) <= 1); });

console.log("4. Dos medias");
t("σ=10, Δ=5, α=0,05, 80 % -> 63 por grupo", () => { const r = S.twoMeans({ sigma: 10, delta: 5, alpha: 0.05, power: 0.8, k: 1 }); assert.equal(r.n1, 63); assert.equal(r.n2, 63); });
t("Δ a la mitad -> ~x4", () => assert.ok(S.twoMeans({ sigma: 10, delta: 2.5, alpha: 0.05, power: 0.8 }).n1 >= 4 * 62.79 - 1));

console.log("5. LQAS");
const base = { pU: 0.8, pL: 0.5, alpha: 0.1, beta: 0.1 };
const bin = S.lqas(base);
console.log(`     binomial pU=80 %, pL=50 %, α=β=10 %: n=${bin.n}, d=${bin.d}, α real=${bin.alphaReal.toFixed(4)}, β real=${bin.betaReal.toFixed(4)}`);
t("binomial: n=19, d=13 (orden esperado 19–20, 13)", () => { assert.equal(bin.n, 19); assert.equal(bin.d, 13); });
t("binomial: α y β reales dentro de los límites", () => { assert.ok(bin.alphaReal <= 0.1 && bin.betaReal <= 0.1); });
t("binomial: minimalidad (n-1 no tiene regla válida)", () => assert.equal(S.lqasBestRule(bin.n - 1, base), null));
t("binomial: la regla coincide con cdf directa", () => {
  close(1 - S.binomCdf(bin.d - 1, bin.n, 0.5), bin.alphaReal, 1e-12);
  close(S.binomCdf(bin.d - 1, bin.n, 0.8), bin.betaReal, 1e-12);
});
const hyp = S.lqas({ ...base, N: 100 });
console.log(`     hipergeométrica N=100: n=${hyp.n}, d=${hyp.d}, α real=${hyp.alphaReal.toFixed(4)}, β real=${hyp.betaReal.toFixed(4)} (K=${hyp.KL}/${hyp.KU})`);
t("hipergeométrica N=100: n=16, d=11", () => { assert.equal(hyp.n, 16); assert.equal(hyp.d, 11); });
t("hipergeométrica N=30: n=13, d=9, α real 0,0697, β real 0,0397 (R: phyper)", () => {
  const h = S.lqas({ ...base, N: 30 });
  assert.equal(h.n, 13); assert.equal(h.d, 9);
  close(h.alphaReal, 0.0697, 5e-5); close(h.betaReal, 0.0397, 5e-5);
});
t("N pequeño: n hipergeométrico <= binomial", () => { for (const N of [30, 50, 100, 200]) assert.ok(S.lqas({ ...base, N }).n <= bin.n, "N=" + N); });
t("N enorme (1e6): hipergeométrica ~ binomial (mismo n y d)", () => {
  const h = S.lqas({ ...base, N: 1e6 });
  // límite de búsqueda de n = 1000; con N grande debe coincidir con la binomial
  assert.equal(h.n, bin.n); assert.equal(h.d, bin.d); close(h.alphaReal, bin.alphaReal, 1e-4); close(h.betaReal, bin.betaReal, 1e-4);
});
t("pmf hipergeométrica suma 1 y ~binomial", () => {
  let s = 0; for (let x = 0; x <= 20; x++) s += S.hyperPmf(x, 500, 200, 20); close(s, 1, 1e-12);
  close(S.hyperPmf(8, 1e7, 4e6, 20), S.binomPmf(8, 20, 0.4), 1e-5);
});
t("curva OC: monótona creciente y valores en pL/pU coherentes", () => {
  const oc = S.lqasOC(bin.n, bin.d, null, 100);
  for (let i = 1; i < oc.length; i++) assert.ok(oc[i].pa >= oc[i - 1].pa - 1e-12);
  close(oc[50].pa, bin.alphaReal, 1e-12); close(oc[80].pa, 1 - bin.betaReal, 1e-12);
});
t("sin solución (umbrales indistinguibles con N=10: K_L=K_U) -> found=false", () => assert.equal(S.lqas({ pU: 0.52, pL: 0.5, alpha: 0.05, beta: 0.05, N: 10 }).found, false));


console.log("\n6. Ejemplos del tema 4 del curso (convención de Saturno: α en el estándar, β en el umbral)");
// En Stats.lqas, alpha = riesgo en pL (aceptar un servicio malo) = β del curso; beta = α del curso.
const curso = (pU, pL, aC, bC, N = 0) => S.lqas({ pU, pL, alpha: bC, beta: aC, N });
t("dolor en triaje 85/60, α 5 %, β 20 %: n=22, c=16", () => { const r = curso(0.85, 0.60, 0.05, 0.20); assert.equal(r.n, 22); assert.equal(r.d, 16); });
t("dolor en triaje con lote N=150: n=18, c=13", () => { const r = curso(0.85, 0.60, 0.05, 0.20, 150); assert.equal(r.n, 18); assert.equal(r.d, 13); });
t("la regla de la tabla de Lemeshow 16/11 tiene un β real ≈ 33 % (no 20 %)", () => close(S.lqasPAccept(16, 11, 0, 0.60), 0.329, 1e-3));
t("tabla rápida del tema: N=200 y ±10 % → 66; N=50 y ±5 % → 45", () => {
  assert.equal(S.sampleProportion({ conf: 0.95, e: 0.10, p: 0.5, N: 200 }).n, 66);
  assert.equal(S.sampleProportion({ conf: 0.95, e: 0.05, p: 0.5, N: 50 }).n, 45);
});

console.log(`\n${ok} pruebas superadas.`);
