/*
 * EXIMIA CODE · Interacción exclusiva de la portada.
 * Se mantiene separado de main.js para respetar una única responsabilidad por archivo.
 */
document.addEventListener('DOMContentLoaded', function () {
  /* La demo ofrece feedback inmediato sin recargar la portada, mejorando la percepción de respuesta. */
  const button = document.querySelector('#route-demo');
  const output = document.querySelector('#route-status');
  if (!button || !output) return;

  /* Los mensajes son deterministas para que la demostración docente sea repetible. */
  const routes = [
    'Ruta A optimizada: 18% menos kilómetros simulados.',
    'Cadena de frío verificada: 3.8 °C.',
    'Última milla priorizada: 12 entregas en secuencia.'
  ];

  let current = -1;

  /* El operador módulo crea un ciclo: después del último resultado vuelve al primero. */
  button.addEventListener('click', function () {
    current = (current + 1) % routes.length;
    output.textContent = routes[current];
    button.textContent = 'Recalcular ruta';
  });
});
