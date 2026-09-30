/**
 * EXIMIA CODE · Formularios de contacto
 * Validación accesible y envío AJAX con FormSubmit sin abandonar la página.
 */
(function () {
  'use strict';

  /* FORMULARIOS: se localizan por data-contact-form para compartir la misma lógica en portada y perfiles. */
  document.querySelectorAll('form[data-contact-form]').forEach(function (form) {
    const status = form.querySelector('[data-form-status]');
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent.trim() || 'Enviar mensaje';
    const successMessage = form.dataset.successMessage ||
      'Mensaje enviado correctamente. ¡Gracias por contactarnos!';

    /* FormSubmit usa /ajax/ para el flujo sin redirección; action queda como respaldo HTML sin JavaScript. */
    const ajaxAction = form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

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
      /* event.preventDefault() evita la redirección y permite anunciar el resultado dentro del sitio. */
      event.preventDefault();

      const isValid = fields.map(validateField).every(Boolean);
      if (!isValid) {
        if (status) {
          status.className = 'form-status error';
          status.setAttribute('role', 'alert');
          status.textContent = 'Revisá los campos indicados antes de enviar.';
          status.focus({ preventScroll: false });
        }
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = 'Enviando…';
      }
      if (status) {
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        status.textContent = 'Enviando mensaje…';
      }

      try {
        /* FormSubmit documenta JSON + Accept: application/json para su endpoint AJAX. */
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(ajaxAction, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        let data = null;
        try {
          data = await response.json();
        } catch (parseError) {
          /* Un error HTTP ya es suficiente para rechazar; el parseo sólo aporta información extra. */
        }

        if (!response.ok || (data && data.success === false)) {
          throw new Error('El servicio de envío respondió con error.');
        }

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
          /* El foco queda en la confirmación para que el resultado sea perceptible con teclado y lector de pantalla. */
          status.focus({ preventScroll: false });
        }
      } catch (error) {
        /* Si falla la red o FormSubmit, se informa el problema sin fingir un envío exitoso. */
        if (status) {
          status.className = 'form-status error';
          status.setAttribute('role', 'alert');
          status.textContent = 'No pudimos enviar el mensaje. Verificá tu conexión e intentá nuevamente.';
          status.focus({ preventScroll: false });
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });
})();
