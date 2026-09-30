/**
 * EXIMIA CODE · Interacción del perfil de Fiorella Alarcón
 * Demo propia del rol (Product & Frontend Engineer): cada clic muestra el siguiente mensaje.
 */
document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  const phrases = [
    "UI validada: contraste, foco de teclado y jerarquía revisados.",
    "Componente responsive probado en 400, 900 y 1200 px.",
    "Navegación accesible: etiquetas y estados ARIA verificados.",
    "Prototipo listo para iterar con feedback del equipo."
  ];

  let current = -1;

  /* Índice circular: tras la última frase vuelve a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
