/**
 * EXIMIA CODE · Interacción del perfil de Malena Jasque
 * Demo propia del rol (UX/UI & QA): cada clic muestra el siguiente mensaje.
 */
document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  const phrases = [
    "QA audit: 12 checks ejecutados · 0 bloqueantes.",
    "2 mejoras UX detectadas y priorizadas para revisión.",
    "Flujo de formulario validado con teclado y foco visible.",
    "Checklist de calidad completado para la entrega."
  ];

  let current = -1;

  /* Índice circular: tras la última frase vuelve a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
