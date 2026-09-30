/**
 * EXIMIA CODE · Interacción del perfil de Javier Churquina
 * Demo propia del rol (Data & Routing): cada clic muestra el siguiente mensaje.
 */
document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  const phrases = [
    "Ruta A optimizada: 18% menos kilómetros simulados.",
    "3 vehículos agrupados por zona y ventana horaria.",
    "Cadena de frío monitorizada cada 5 minutos.",
    "Matriz de costos preparada para comparar alternativas."
  ];

  let current = -1;

  /* Índice circular: tras la última frase vuelve a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
