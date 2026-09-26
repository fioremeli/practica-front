/*
 * EXIMIA CODE · JavaScript global
 * Este archivo se comparte entre portada, perfiles y bitácora para evitar
 * duplicar lógica. Centralizamos tema, menú, formularios y reproducción ligera.
 */
(function () {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('eximia-theme');

  /* TEMA: guardar la preferencia mejora la continuidad de UX entre páginas. */
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  }

  function updateThemeControl() {
    if (!themeButton) return;
    const isDark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute(
      'aria-label',
      isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );

    const icon = themeButton.querySelector('.theme-icon');
    const label = themeButton.querySelector('.theme-label');
    if (icon) icon.textContent = isDark ? '☀' : '☾';
    if (label) label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }

  updateThemeControl();

  themeButton?.addEventListener('click', function () {
    /* Un único control permite alternar el tema sin recargar la página. */
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('eximia-theme', nextTheme);
    updateThemeControl();
  });

  /* MENÚ RESPONSIVE: en móvil el botón controla la visibilidad del menú semántico. */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  navToggle?.addEventListener('click', function () {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  navList?.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navList.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Abrir menú');
    });
  });

  /* FORMULARIOS: validamos sin permitir el POST tradicional que produciría una redirección. */
  document.querySelectorAll('form[data-contact-form]').forEach(function (form) {
    const status = form.querySelector('[data-form-status]');
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Enviar mensaje';
    const successMessage = form.dataset.successMessage ||
      'Mensaje enviado correctamente. ¡Gracias por contactarnos!';

    function setError(field, message) {
      const error = form.querySelector('#' + field.id + '-error');
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) error.textContent = message;
    }

    function validateField(field) {
      const value = field.value.trim();
      let message = '';

      if (!value) {
        message = 'Este campo es obligatorio.';
      } else if (field.type === 'email' && !field.validity.valid) {
        message = 'Ingresá un correo electrónico válido.';
      } else if (field.minLength > 0 && value.length < field.minLength) {
        message = 'Ingresá al menos ' + field.minLength + ' caracteres.';
      }

      setError(field, message);
      return message === '';
    }

    /* La validación al salir del campo ofrece feedback temprano sin interrumpir la escritura. */
    fields.forEach(function (field) {
      field.setAttribute('aria-invalid', 'false');
      field.addEventListener('blur', function () {
        validateField(field);
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', async function (event) {
      /* event.preventDefault() evita la página fantasma y mantiene al usuario en el mismo contexto. */
      event.preventDefault();

      const isValid = fields.map(validateField).every(Boolean);
      if (!isValid) {
        if (status) {
          status.className = 'form-status error';
          status.setAttribute('role', 'alert');
          status.textContent = 'Revisá los campos indicados antes de enviar.';
        }
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando…';
      }
      if (status) {
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        status.textContent = 'Enviando mensaje…';
      }

      try {
        /* FormSubmit recibe el envío mediante fetch y devuelve JSON; no se abre otra página. */
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });

        if (!response.ok) throw new Error('El servicio de envío respondió con error.');

        form.reset();
        fields.forEach(function (field) {
          field.setAttribute('aria-invalid', 'false');
        });
        form.querySelectorAll('.form-error').forEach(function (error) {
          error.textContent = '';
        });

        if (status) {
          status.className = 'form-status success';
          status.setAttribute('role', 'status');
          status.textContent = successMessage;
          /* El foco queda en la confirmación para que Tab continúe desde un punto predecible. */
          status.focus({ preventScroll: false });
        }
      } catch (error) {
        /* Si no hay conexión o FormSubmit falla, informamos el problema sin fingir éxito. */
        if (status) {
          status.className = 'form-status error';
          status.setAttribute('role', 'alert');
          status.textContent = 'No pudimos enviar el mensaje. Verificá tu conexión e intentá nuevamente.';
          status.focus({ preventScroll: false });
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });

  /* MULTIMEDIA: el iframe de Spotify sólo se crea al solicitarlo, reduciendo carga inicial. */
  document.querySelectorAll('.spotify-facade').forEach(function (card) {
    const button = card.querySelector('.play-btn');

    button?.addEventListener('click', function () {
      const spotifyId = card.dataset.spotifyId;
      const media = card.querySelector('.album-media');
      if (!media) return;

      if (!spotifyId) {
        const query = encodeURIComponent(
          card.dataset.spotifyQuery || card.querySelector('.album-title')?.textContent || 'Spotify'
        );
        window.open('https://open.spotify.com/search/' + query, '_blank', 'noopener');
        return;
      }

      if (media.querySelector('iframe')) return;

      const iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.title = 'Reproductor de Spotify';
      iframe.src = 'https://open.spotify.com/embed/album/' + spotifyId + '?utm_source=generator';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      media.replaceChildren(iframe);
    });
  });
})();
