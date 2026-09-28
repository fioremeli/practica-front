/*
 * EXIMIA CODE · Interacción del perfil de Axel.
 * Cada perfil tiene una demo relacionada con su rol profesional.
 */
document.addEventListener('DOMContentLoaded', function () {
  /* Buscamos controles existentes para evitar errores si el script se reutiliza en otra página. */
  const button = document.querySelector('#role-demo');
  const output = document.querySelector('#dynamic-result');
  if (!button || !output) return;

  /* Varias frases hacen visible el comportamiento dinámico exigido en cada perfil. */
  const phrases = [
    "API health: 200 OK · latencia simulada 84 ms.",
    "MongoDB conectado · consulta de prueba completada.",
    "Endpoint /orders validado con respuesta JSON.",
    "Backend listo para integrar el siguiente servicio."
  ];

  let current = -1;

  /* El índice circular garantiza que el siguiente clic después de la última frase vuelva a la primera. */
  button.addEventListener('click', function () {
    current = (current + 1) % phrases.length;
    output.textContent = phrases[current];
  });
});
