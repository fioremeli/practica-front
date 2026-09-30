/**
 * EXIMIA CODE · Interacción del perfil de Selene Pais
 * Demo propia del rol (DevOps & Docs): cada clic muestra el siguiente mensaje.
 */
document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  const phrases = [
    "Pipeline simulado: lint → test → build → deploy.",
    "Documentación técnica preparada para el equipo.",
    "Build verificado: artefactos listos para publicación.",
    "Pipeline estable: siguiente ejecución preparada."
  ];

  let current = -1;

  /* Índice circular: tras la última frase vuelve a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
