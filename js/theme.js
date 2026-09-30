/**
 * EXIMIA CODE · Tema claro / oscuro
 * Prioridad: 1) elección guardada, 2) preferencia del sistema, 3) claro.
 * El script inline del <head> aplica el tema antes de pintar (evita el parpadeo).
 */
(function () {
  'use strict';

  const root = document.documentElement;
  const button = document.querySelector('[data-theme-toggle]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* localStorage puede fallar (modo privado o bloqueo): se envuelve en try/catch. */
  function read() { try { return localStorage.getItem('eximia-theme'); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem('eximia-theme', v); } catch (e) { /* sin persistencia */ } }

  function current() {
    return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  }

  function paint() {
    if (!button) return;
    const isDark = current() === 'dark';
    /* La etiqueta describe la acción y contiene el texto visible ("Modo claro" / "Modo oscuro").
       No se usa aria-pressed: combinarlo con una etiqueta cambiante se anuncia dos veces. */
    button.removeAttribute('aria-pressed');
    button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    const icon = button.querySelector('.theme-icon');
    const label = button.querySelector('.theme-label');
    if (icon) icon.textContent = isDark ? '☀' : '☾';
    if (label) label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }

  const saved = read();
  if (saved === 'light' || saved === 'dark') {
    root.dataset.theme = saved;
  } else if (systemDark.matches) {
    root.dataset.theme = 'dark'; // <--- Forzamos el atributo si el sistema es oscuro y no hay guardado previo
  }
  paint();

  button?.addEventListener('click', function () {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    write(next);
    paint();
  });

  /* Si el sistema cambia de tema y no hay elección manual, el botón se actualiza. */
  systemDark.addEventListener?.('change', paint);
})();
