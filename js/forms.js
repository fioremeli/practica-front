/**
 * EXIMIA CODE · Formularios de contacto
 * Validación accesible y envío AJAX con FormSubmit sin abandonar la página.
 */
(function () {
  'use strict';

  /* FORMULARIOS: el endpoint AJAX mantiene al usuario en la misma página y permite anunciar el resultado. */
  document.querySelectorAll('form[data-contact-form]').forEach(function (form) {
    const status = form.querySelector('[data-form-status]');
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent.trim() || 'Enviar mensaje';
    const successMessage = form.dataset.successMessage ||
      'Mensaje enviado correctamente. ¡Gracias por contactarnos!';
    const ajaxAction = form.dataset.ajaxAction;

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
      /* event.preventDefault() evita la redirección; el envío se realiza contra el endpoint AJAX de FormSubmit. */
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

      if (!ajaxAction) {
        if (status) {
          status.className = 'form-status error';
          status.setAttribute('role', 'alert');
          status.textContent = 'El formulario no tiene configurado el envío AJAX.';
          status.focus({ preventScroll: false });
        }
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
        /* FormSubmit documenta este endpoint con JSON y Accept: application/json para envíos AJAX. */
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(ajaxAction, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(function () { return null; });
        if (!response.ok || !data || data.success !== true) {
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
          status.focus({ preventScroll: false });
        }
      } catch (error) {
        /* Si falla la red o el servicio, se informa el error sin fingir un envío exitoso. */
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
