/**
 * EXIMIA CODE · Interacción del perfil de Axel Alva
 * Demo propia del rol (Backend Developer): cada clic muestra el siguiente mensaje.
 */
document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  const phrases = [
    "API health: 200 OK · latencia simulada 84 ms.",
    "MongoDB conectado · consulta de prueba completada.",
    "Endpoint /orders validado con respuesta JSON.",
    "Backend listo para integrar el siguiente servicio."
  ];

  let current = -1;

  /* Índice circular: tras la última frase vuelve a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
