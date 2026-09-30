/**
 * EXIMIA CODE · Menú responsive
 * Menú hamburguesa accesible (aria-expanded, aria-controls) y cierre con Escape.
 */
(function () {
  'use strict';

  /* MENÚ RESPONSIVE: en móvil el botón controla la visibilidad del menú semántico. */
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    navToggle?.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    /* ESC cierra el menú y devuelve el foco al botón: patrón esperado con teclado. */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navList?.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
        navToggle?.setAttribute('aria-label', 'Abrir menú');
        navToggle?.focus();
      }
    });

    navList?.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
        navToggle?.setAttribute('aria-label', 'Abrir menú');
      });
    });


})();
