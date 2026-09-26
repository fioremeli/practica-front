/*
 * EXIMIA CODE · Interacción del perfil de Malena.
 * Cada perfil tiene una demo relacionada con su rol profesional.
 */
document.addEventListener('DOMContentLoaded', function () {
  /* Buscamos controles existentes para evitar errores si el script se reutiliza en otra página. */
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  /* Varias frases hacen visible el comportamiento dinámico exigido en cada perfil. */
  const phrases = [
    "QA audit: 12 checks ejecutados · 0 bloqueantes.",
    "2 mejoras UX detectadas y priorizadas para revisión.",
    "Flujo de formulario validado con teclado y foco visible.",
    "Checklist de calidad completado para la entrega."
  ];

  let current = -1;

  /* El índice circular garantiza que el siguiente clic después de la última frase vuelva a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
