/**
 * EXIMIA CODE · Saltos de contenido
 * Skip-link y "Volver arriba" con foco visible; respeta prefers-reduced-motion.
 */
(function () {
  'use strict';

  /* NAVEGACIÓN ACCESIBLE: el skip-link enfoca el H1 para entrar al contenido sin alterar el orden natural de Tab; "Volver arriba" lleva al inicio real del documento. */
    document.querySelectorAll('.skip-link').forEach(function (link) {
      link.addEventListener('click', function (event) {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.focus({ preventScroll: true });
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });

    document.querySelectorAll('.footer-skip').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

        /* El foco queda en la marca del encabezado, un control interactivo y visible en el inicio. */
        const brandLink = document.querySelector('.brand-link');
        if (brandLink) {
          window.setTimeout(function () {
            brandLink.focus({ preventScroll: true });
          }, reduceMotion ? 0 : 250);
        }
      });
    });

})();
