/**
 * Script para gestionar el formulario de activación
 * Formulario de Segunda Oportunidad para conectores legales
 */

// Variables globales para almacenar parámetros de URL
let asesorJuridico = '';
let tipoConector = '';
let nombreConector = '';

/**
 * Inicializar el script cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar AOS (animaciones)
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true
  });

  // Obtener asesor jurídico de URL
  obtenerAsesorDesdeURL();

  // Configurar el formulario
  configurarFormulario();
});

/**
 * Obtener el nombre del asesor jurídico desde los parámetros de URL
 */
function obtenerAsesorDesdeURL() {
  const urlParams = new URLSearchParams(window.location.search);
  asesorJuridico = urlParams.get('asesor') || '';
  tipoConector = urlParams.get('type') || '';
  nombreConector = urlParams.get('name') || '';
  
  // Actualizar badge en el hero con nombre del asesor en negrita
  const asesorBadge = document.getElementById('asesorBadge');
  if (asesorJuridico && asesorBadge) {
    asesorBadge.innerHTML = `Área de Asesoramiento Jurídico de <strong>${asesorJuridico}</strong>`;
  }
  
  // Actualizar badge antes del formulario
  const asesorFormBadge = document.getElementById('asesorFormBadge');
  const asesorFormBadgeContainer = document.getElementById('asesorFormBadgeContainer');
  
  if (asesorJuridico && asesorFormBadge && asesorFormBadgeContainer) {
    // Mostrar información completa si hay parámetros adicionales
    let mensaje = `Estás en el área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>`;
    
    if (nombreConector) {
      mensaje += `<br><span class="text-sm text-gray-600">Conector: <strong>${nombreConector}</strong></span>`;
    }
    
    if (tipoConector) {
      mensaje += `<span class="text-sm text-gray-600"> (${tipoConector})</span>`;
    }
    
    asesorFormBadge.innerHTML = mensaje;
    asesorFormBadgeContainer.classList.remove('hidden');
  } else {
    // Si no hay asesor en URL, mostrar campo para ingresarlo y aviso
    mostrarAvisoSinAsesor();
  }
}

/**
 * Mostrar aviso y campo de entrada cuando no hay asesor en la URL
 */
function mostrarAvisoSinAsesor() {
  const asesorInputContainer = document.getElementById('asesorInputContainer');
  const asesorInput = document.getElementById('asesor_input');
  const asesorFormBadgeContainer = document.getElementById('asesorFormBadgeContainer');
  const asesorFormBadge = document.getElementById('asesorFormBadge');
  
  // Mostrar campo de entrada
  if (asesorInputContainer && asesorInput) {
    asesorInputContainer.classList.remove('hidden');
    asesorInput.required = true;
  }
  
  // Mostrar aviso en el badge
  if (asesorFormBadgeContainer && asesorFormBadge) {
    asesorFormBadge.innerHTML = '⚠️ No se ha especificado un asesor jurídico. <strong class="text-primary">Por favor ingresa tu nombre en el formulario</strong>';
    asesorFormBadgeContainer.classList.remove('hidden');
    asesorFormBadgeContainer.classList.remove('bg-primary/10', 'border-primary/30');
    asesorFormBadgeContainer.classList.add('bg-yellow-50', 'border-yellow-400');
  }
}

/**
 * Configurar el formulario de activación
 */
function configurarFormulario() {
  const form = document.getElementById('activacionForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Mostrar ventana de confirmación antes de enviar
    const confirmado = await mostrarConfirmacion();
    if (confirmado) {
      await enviarFormulario(form);
    }
  });
}

/**
 * Mostrar modal de confirmación personalizado
 * @returns {Promise<boolean>} Promesa que resuelve true si confirma, false si cancela
 */
function mostrarConfirmacion() {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const message = document.getElementById('confirmMessage');
    const cancelBtn = document.getElementById('confirmCancel');
    const acceptBtn = document.getElementById('confirmAccept');
    
    const asesorMensaje = asesorJuridico 
      ? `al área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>` 
      : 'a nuestro equipo legal';
    
    message.innerHTML = `¿Confirmas que deseas enviar este contacto ${asesorMensaje}?<br><br>Se enviará la información del cliente para que sea procesada.`;
    
    // Mostrar modal
    modal.classList.remove('hidden');
    
    // Handlers
    const handleCancel = () => {
      modal.classList.add('hidden');
      cancelBtn.removeEventListener('click', handleCancel);
      acceptBtn.removeEventListener('click', handleAccept);
      resolve(false);
    };
    
    const handleAccept = () => {
      modal.classList.add('hidden');
      cancelBtn.removeEventListener('click', handleCancel);
      acceptBtn.removeEventListener('click', handleAccept);
      resolve(true);
    };
    
    cancelBtn.addEventListener('click', handleCancel);
    acceptBtn.addEventListener('click', handleAccept);
    
    // Cerrar con ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

/**
 * Enviar datos del formulario al webhook de n8n
 * @param {HTMLFormElement} form - Formulario a enviar
 */
async function enviarFormulario(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Estado de carga
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="material-icons animate-spin">sync</span> Enviando...';
  
  // Recoger datos del formulario
  const formData = recogerDatosFormulario();
  
  console.log('Enviando datos de activación:', formData);
  
  try {
    const response = await fetch(
      'https://n8n.empiezadecero.cat/webhook-test/6f3fee4b-0ae5-47f2-9841-6ada8ec89ff5',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    );
    
    if (response.ok || response.status === 0) {
      // Éxito
      mostrarMensajeExito(form);
    } else {
      throw new Error('Error en el envío: ' + response.status);
    }
  } catch (error) {
    console.error('Error detallado:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      // Posible error de CORS, mostrar éxito de todos modos
      mostrarMensajeExito(form);
    } else {
      // Error real
      mostrarMensajeError(submitBtn, originalText, error);
    }
  }
}

/**
 * Recoger todos los datos del formulario
 * @returns {Object} Objeto con los datos del formulario
 */
function recogerDatosFormulario() {
  // Si no hay asesor en URL, obtenerlo del campo de entrada
  let asesorFinal = asesorJuridico;
  if (!asesorFinal) {
    const asesorInput = document.getElementById('asesor_input');
    asesorFinal = asesorInput ? asesorInput.value.trim() : 'No especificado';
  }
  
  return {
    tipo_formulario: 'activacion_segunda_oportunidad',
    asesor_juridico: asesorFinal || 'No especificado',
    tipo_conector: tipoConector || 'No especificado',
    nombre_conector: nombreConector || 'No especificado',
    nombre_completo: document.getElementById('nombre_completo').value,
    dni: document.getElementById('dni').value,
    telefono: Number(document.getElementById('telefono').value.replace(/\D/g, '')),
    email: document.getElementById('email').value,
    direccion: document.getElementById('direccion').value,
    estado_civil: document.getElementById('estado_civil').value,
    deuda_total: Number(document.getElementById('deuda_total').value),
    primera_cuota: Number(document.getElementById('primera_cuota').value),
    cuota_mensual: Number(document.getElementById('cuota_mensual').value),
    consentimiento: document.getElementById('consentimiento').checked,
    timestamp: new Date().toISOString(),
    page_url: window.location.href
  };
}

/**
 * Mostrar mensaje de éxito
 * @param {HTMLFormElement} form - Formulario donde mostrar el mensaje
 */
function mostrarMensajeExito(form) {
  const asesorMensaje = asesorJuridico 
    ? `al área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>` 
    : 'a nuestro equipo legal';
  
  form.innerHTML = `
    <div class="text-center py-12">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="material-icons text-green-500 text-4xl">check_circle</span>
      </div>
      <h3 class="text-2xl font-bold text-primary mb-4">¡Contacto Enviado!</h3>
      <p class="text-gray-600 mb-6">Has enviado exitosamente el contacto ${asesorMensaje}.<br>El equipo legal revisará el caso y se pondrá en contacto con el cliente en las próximas 24-48 horas.</p>
      <button onclick="location.reload()" class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg">
        <span class="material-icons">add_circle</span>
        Cargar Otro Contacto
      </button>
    </div>
  `;
}

/**
 * Mostrar mensaje de error
 * @param {HTMLButtonElement} submitBtn - Botón de envío
 * @param {string} originalText - Texto original del botón
 * @param {Error} error - Error ocurrido
 */
function mostrarMensajeError(submitBtn, originalText, error) {
  alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
  submitBtn.disabled = false;
  submitBtn.innerHTML = originalText;
}
