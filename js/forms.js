/**
 * EXIMIA CODE · Formularios de contacto
 * Validación por campo, mensajes ARIA y envío con fetch (sin redirección).
 */
(function () {
  'use strict';

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


})();
