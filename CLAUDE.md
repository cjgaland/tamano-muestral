# CLAUDE.md — Tamaño Muestral

Guía de referencia para el desarrollo asistido por IA. Léela antes de proponer cambios.

## 1. Descripción
PWA estática (sin build, sin dependencias, sin CDN) de cálculo de tamaño muestral para calidad y seguridad del paciente. Herramienta docente y de apoyo; no sustituye el criterio profesional. Autores: Carlos J. Galán Doval (Médico de Familia, Técnico en Calidad y Seguridad del Paciente, Hospital de Montilla) y Rafael J. Romero de Castilla Gil (Médico de Familia; autor de la unidad temática de muestreo, LQAS e indicadores en la que se basa el contenido didáctico). La autoría aparece igual en el pie, el informe impreso, «Acerca de» y el README. Hermana de DosisPed (mismos tokens CSS, modal de bienvenida, Acerca de, SW network-first, iconos).

## 2. Arquitectura
- `index.html` — esqueleto, header, nav, modales (bienvenida y Acerca de). Script inline en `<head>` que fija `data-tema` (claro/oscuro) antes de pintar.
- `styles.css` — tokens (claro por defecto; `html[data-tema="oscuro"]`), móvil primero (360 px), layout 2 columnas >= 900 px, bloque `@media print` para el informe.
- `stats.js` — funciones PURAS (sin DOM). `window.Stats` en navegador y `module.exports` en Node.
- `app.js` — definición declarativa de calculadoras (`CALCS`: campos, ayudas, ejemplo, `compute(v)` que devuelve resultado, avisos y pasos), render, eventos, enrutado por hash (`#/proporcion`, `#/media`, `#/dos-proporciones`, `#/dos-medias`, `#/lqas`, `#/compuesto`), tema, modales. Todo cálculo se delega en `Stats`.
- `sw.js` — network-first con caché de respaldo. Subir `CACHE_NAME` al cambiar archivos. Aviso de actualización (ver §6).
- `tests/stats.test.mjs` — `node tests/stats.test.mjs`.

## 3. Fórmulas
z = cuantil normal (Acklam + un paso de Halley, error < 1e-9; erfc propia). Siempre `ceil` (con tolerancia 1e-9 al ruido de coma flotante). Pérdidas: n_final = ceil(n/(1−L)).
1. Proporción: n0 = z²p(1−p)/e², z bilateral; con N: n = n0/(1+(n0−1)/N). (Cochran)
2. Media: n0 = z²σ²/e²; misma corrección finita.
3. Dos proporciones (Fleiss, Levin y Paik): p̄=(p1+k p2)/(1+k); n1=[zα√((1+1/k)p̄q̄)+zβ√(p1q1+p2q2/k)]²/(p1−p2)²; n2=k·n1. Corrección de continuidad opcional: n1'=(n1/4)(1+√(1+2(k+1)/(k n1 |p1−p2|)))².
4. Dos medias: n1=(1+1/k)σ²(zα+zβ)²/Δ²; n2=k·n1.
5. LQAS (Lemeshow y Taber 1991; Robertson y Valadez 2006; Saturno, UT 20, 1999): menor n (1..min(N,1000)) con algún c tal que P(X<c|pᵤ)≤α y P(X≥c|pₗ)≤β; entre varios c, el que minimiza max(α real, β real).
   **Convención de la interfaz = la del curso (Saturno, tema 4):** α = falsa alarma (rechazar un servicio que cumple el estándar, en pᵤ); β = fuego sin alarma (aceptar uno en el umbral o peor, en pₗ). Por defecto α 5 %, β 20 %. `Stats.lqas` conserva la convención inversa (su `alpha` es el riesgo en pₗ y devuelve `d` = c), y `app.js` las cruza al llamarla; no cambiar una sin la otra. X~Binomial(n,p), o Hipergeométrica(N,K=round(pN),n) si N conocido. pmf con log-gamma (Lanczos g=7). Curva OC = P(X≥d|p).

6. Indicador compuesto de porcentaje simple (Saturno, UT19): Σ cumplimientos ÷ Σ oportunidades (`Stats.composite`). Se muestra también la media de porcentajes solo para compararla (no es el compuesto). No es un tamaño muestral: analiza resultados.

## 4. Decisiones
- Los porcentajes se introducen en % y se convierten a proporciones en `compute`; los textos de desarrollo muestran las proporciones sustituidas.
- LQAS con N: la regla (d) se aplica a n casos evaluables; las pérdidas solo aumentan los casos a seleccionar (limitado a N). Con N conocido se avisa de la n binomial equivalente. Si K_L = K_U tras redondear, se pide separar umbrales.
- Un censo (n = N) siempre es una solución válida con N conocido, por lo que LQAS hipergeométrico siempre encuentra solución si K_L < K_U.
- Supone muestreo aleatorio simple (se avisa en Acerca de).
- Las tablas de Lemeshow/Saturno del tema 4 son aproximadas (p. ej. 85/60, α 5 %, β 20 %: tabla 16/11 con β real 33 %; app exacta 22/16). La app no las usa; lo explica en una nota y hay test.
- Cada calculadora tiene `idea` (caja siempre visible) y `facil` (HTML en `<details>`, plegado por defecto, se recuerda en `tammuestral-facil-abierto`). Contenido adaptado del tema 4 del curso de Auditorías (Rafa): sopa, báscula/arco, semáforo, galletas, falsa alarma/fuego sin alarma. Cifras de los ejemplos comprobadas con la app y R.
- `tablaRapida()` calcula la tabla N × margen con `Stats` (no copiada de un libro).
- Calculadora `compuesto` es `custom: true`: filas dinámicas (`formHtml`, estado `{ pac, rows: [{nom, cum, opo}] }`, `defaults` y `example` se clonan con JSON). Ejemplo = infarto de la parte teórica; NO usar los datos de los ejercicios de la parte práctica (estropearían el solucionario). El quiz del inicio (`QUIZ`) adapta la autoevaluación de la parte teórica; la pregunta 4 usa el plan exacto (40/33) en vez del de la tabla (33/26).
- Fuentes del contenido didáctico: tema 4 del curso (PDF) y la unidad temática de Rafa (parte teórica y práctica, .docx). Revisadas: cifras correctas; la «regla del 10 %» solo aplica a las tablas binomiales (con N la app usa la hipergeométrica).
- index.html carga `styles.css`, `stats.js` y `app.js` con `?v=<APP_VERSION>`: al publicar, actualizar también esos tres `?v=` (evita que el navegador mezcle archivos de dos versiones). El SW busca en caché con `ignoreSearch`.
- Tabla de consulta exacta en LQAS (`pageHtml` + `tablaExactaHtml`): rejilla umbral 10–85 × estándar 50–95 como las A1/A2 de Lemeshow, binomial, α 5 % y β 20/10 %. Se calcula al abrir el `<details>` (≈0,3 s por tabla) y se cachea; tocar una casilla carga el plan. Test: las 248 casillas cumplen α y β exactos. Con N grande el n apenas cambia (se estabiliza en el binomial): es correcto y se explica en la ayuda de N.
- Sorteo de casos (`sorteoHtml`/`sortear`) en proporción, media y LQAS cuando se conoce N: aleatorio simple o sistemático (k = N/n, arranque al azar). Usa Math.random (suficiente para elegir historias).
- `compute` devuelve `warns` (⚠ ámbar: algo dudoso en los datos) y `notes` (ℹ verde azulado: información, p. ej. n binomial equivalente, redondeo de K, zona gris, z frente a t). No mezclar.
- Dos medias usa z (63 por grupo en el caso de referencia); `power.t.test` de R, con t, da 64. Se explica en una nota.
- Layout: las rejillas usan `minmax(0, 1fr)` y `min-width: 0` para que las fórmulas largas no ensanchen la página en móvil. Las fórmulas usan `pre-wrap`.
- Curva OC: etiquetas de pₗ y pᵤ arriba a la izquierda de su punto (la curva es creciente, así nunca la pisan).
- «Cargar ejemplo» solo desplaza hacia el resultado en móvil (< 900 px).
- Pendiente: probar instalación como PWA y modo sin conexión en un navegador real (el navegador integrado de Claude Code no admite service workers).

## 5. Entorno
Node v26 (Homebrew). Si `node` fallara por una dylib de Homebrew (`libsimdjson`), ejecutar `brew upgrade node` o `brew reinstall node`. R 4.6.1 disponible (`Rscript`) para verificar cálculos.

## 6. Versiones y actualización
- `APP_VERSION` y `NOVEDADES` al principio de `app.js` (formato AAAA.NN, la más reciente arriba). Al publicar: nueva entrada al principio, actualizar `APP_VERSION` y subir `CACHE_NAME` en `sw.js`.
- El historial completo se muestra en «Acerca de»; tras actualizar, un usuario que ya conocía la app ve el modal «se ha actualizado» con lo nuevo desde su última versión vista (`tammuestral-version-vista`).
- `sw.js` ya NO hace `skipWaiting` al instalar: la versión nueva espera y la app muestra el aviso «Nueva versión disponible · Actualizar» (mensaje `SKIP_WAITING`, recarga en `controllerchange`). Mismo patrón que DosisPed.

## 7. Copias de seguridad locales
Sistema de respaldo local con rotación (carpeta `Backup/`, ignorada en git):
- Cada copia es una carpeta `Backup/Copia_Seguridad_TamanoMuestral_DD_MM_YYYY-HH_MM` con el proyecto completo (rsync -a), excluyendo `Backup`, `.git`, dependencias/caché si existen y datos personales/secretos (`*.csv`, `.env*`).
- Se conservan solo las **5 copias más recientes**; al crear una nueva se borra la más antigua.
- Disparadores: "Haz una copia" / "Copia de seguridad", o antes de publicar.
- Script: skill personal `app-copia_seguridad` (`bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "<carpeta>" --name TamanoMuestral`).

## 8. Publicación
- Repositorio público `cjgaland/tamano-muestral`; GitHub Pages desde `main` (raíz): https://cjgaland.github.io/tamano-muestral/
- Pasos para publicar una versión: (1) copia de seguridad; (2) nueva entrada en `NOVEDADES` + `APP_VERSION`; (3) mismos `?v=` en index.html; (4) subir `CACHE_NAME` en sw.js; (5) `node tests/stats.test.mjs`; (6) commit y `git push`. Pages tarda ~1 min. Los usuarios con la app abierta verán «Nueva versión disponible».
- Comprobado en la web real (v2026.05): el SW cachea los 15 archivos y el aviso de actualización recarga a la versión nueva al pulsar «Actualizar». Solo se recarga si el usuario lo pide (no en la primera instalación).
