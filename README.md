# Tamaño Muestral

PWA estática (HTML/CSS/JS puro, sin dependencias ni CDN, funciona offline) con calculadoras de tamaño muestral para auditorías y estudios en calidad asistencial. En español, con enfoque docente: guía "¿Qué calculadora necesito?", ayudas ⓘ, ejemplos, desarrollo paso a paso e informe imprimible.

Calculadoras: una proporción, una media, dos proporciones, dos medias y LQAS (binomial / hipergeométrica con curva característica operativa).

## Uso
Servir la carpeta y abrir `index.html`:

    python3 -m http.server 8000

Tests de las funciones estadísticas:

    node tests/stats.test.mjs

Documentación técnica y fórmulas: ver `CLAUDE.md`.

Aplicación desarrollada por Carlos J. Galán Doval · Médico de Familia · Técnico en Calidad y Seguridad del Paciente · Hospital de Montilla · Córdoba · Andalucía. De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.
