/**
 * EXIMIA CODE · Interacción de la portada
 * Demo "Optimizar ruta": cicla mensajes sin recargar la página.
 * (Se eliminó la captura de Tab del último enlace: era una trampa de teclado, WCAG 2.1.2.)
 */
document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#route-demo');
  const output = document.querySelector('#route-status');
  if (!button || !output) return;

  /* Mensajes deterministas: la demostración es repetible. */
  const routes = [
    'Ruta A optimizada: 18% menos kilómetros simulados.',
    'Cadena de frío verificada: 3.8 °C.',
    'Última milla priorizada: 12 entregas en secuencia.'
  ];

  let current = -1;

  /* El módulo (%) vuelve al primer mensaje después del último. */
  button.addEventListener('click', function () {
    current = (current + 1) % routes.length;
    output.textContent = routes[current];
    button.textContent = 'Recalcular ruta';
  });
});
