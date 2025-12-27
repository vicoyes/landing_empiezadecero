/**
 * Script para gestionar el formulario de activación
 * Formulario de Segunda Oportunidad para conectores legales
 */

// Variables globales para almacenar parámetros de URL
let asesorJuridico = '';
let tipoConector = '';
let nombreConector = '';
let userCode = '';
let usuarioValidado = null; // Usuario validado desde la BD

/**
 * Inicializar el script cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', async function() {
  // Inicializar AOS (animaciones)
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true
  });

  // Validar user_code ANTES de continuar (si existe en la URL)
  const esValido = await validarUserCode();
  if (!esValido) {
    return; // Detener si la validación falla
  }

  // Obtener parámetros de URL (incluyendo user_code para enviarlo en el webhook)
  obtenerAsesorDesdeURL();

  // Configurar el formulario
  configurarFormulario();
});

/**
 * Validar usuario por user_code
 * Si no hay user_code en la URL, muestra error directamente
 * @returns {Promise<boolean>} true si es válido, false si no
 */
async function validarUserCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const userCodeParam = urlParams.get('user_code');
  
  // Si no hay user_code, mostrar error directamente
  if (!userCodeParam || !userCodeParam.trim()) {
    console.error('❌ No hay user_code en la URL');
    mostrarErrorValidacion(
      'URL No Válida',
      'El enlace no contiene el código del conector (user_code). Por favor, verifica que estés usando el enlace correcto proporcionado por tu conector.'
    );
    return false;
  }
  
  // Validar por user_code
  return await validarPorUserCode(userCodeParam);
}

/**
 * Validar usuario por user_code
 * @param {string} userCodeParam - Código del usuario a validar
 * @returns {Promise<boolean>} true si es válido, false si no
 */
async function validarPorUserCode(userCodeParam) {
  // Verificar que el webhook esté configurado
  if (!CONFIG || !CONFIG.n8n || !CONFIG.n8n.webhookValidateUserCode) {
    console.warn('Webhook de validación por user_code no configurado, continuando sin validación');
    return true;
  }
  
  try {
    console.log('Validando por user_code:', userCodeParam);
    
    const response = await fetch(
      `${CONFIG.n8n.webhookValidateUserCode}?user_code=${encodeURIComponent(userCodeParam)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error en la validación: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta de validación por user_code:', responseData);
    
    const usuario = procesarRespuestaUsuario(responseData);
    
    // Guardar usuario validado y actualizar variables globales
    actualizarVariablesUsuario(usuario);
    
    console.log('✅ Validación por user_code exitosa:', usuario);
    return true;
    
  } catch (error) {
    console.error('❌ Error en validación por user_code:', error);
    
    // Mensaje amigable según el tipo de error
    let mensaje = 'El código del conector no es válido o no existe en la base de datos.';
    let titulo = 'URL No Válida';
    
    if (error.message === 'USUARIO_NO_ENCONTRADO') {
      titulo = 'Usuario No Encontrado';
      mensaje = 'El código del conector no existe en nuestra base de datos. Esto puede ocurrir si el enlace es antiguo o ha sido modificado.';
    }
    
    mostrarErrorValidacion(titulo, mensaje);
    return false;
  }
}

/**
 * Procesar respuesta del webhook (array o objeto)
 * Detecta respuestas vacías: [], [{}], o objetos sin propiedades válidas
 * @param {Object|Array} responseData - Respuesta del webhook
 * @returns {Object} Objeto usuario procesado
 * @throws {Error} Si el usuario no existe o los datos son inválidos
 */
function procesarRespuestaUsuario(responseData) {
  let usuario;
  
  if (Array.isArray(responseData)) {
    // Array vacío: []
    if (responseData.length === 0) {
      throw new Error('USUARIO_NO_ENCONTRADO');
    }
    
    // Array con objeto vacío: [{}]
    usuario = responseData[0];
    if (!usuario || Object.keys(usuario).length === 0) {
      throw new Error('USUARIO_NO_ENCONTRADO');
    }
  } else if (responseData.error) {
    throw new Error(responseData.message || responseData.error);
  } else {
    usuario = responseData;
  }
  
  // Verificar que el usuario existe y tiene user_code
  // Si el objeto está vacío o no tiene user_code, no existe en la BD
  if (!usuario || Object.keys(usuario).length === 0 || !usuario.user_code) {
    throw new Error('USUARIO_NO_ENCONTRADO');
  }
  
  return usuario;
}

/**
 * Actualizar variables globales con datos del usuario validado
 * @param {Object} usuario - Datos del usuario validado
 */
function actualizarVariablesUsuario(usuario) {
  // Guardar usuario validado
  usuarioValidado = usuario;
  userCode = usuario.user_code;
  
  // Actualizar variables globales con datos reales de la BD
  if (usuario.perfil) {
    tipoConector = usuario.perfil;
  } else if (usuario.type) {
    tipoConector = usuario.type;
  }
  
  if (usuario.nombre) {
    nombreConector = usuario.nombre;
  } else if (usuario.name) {
    nombreConector = usuario.name;
  }
}

/**
 * Mostrar error de validación
 * @param {string} titulo - Título del error (opcional, por defecto "URL No Válida")
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorValidacion(titulo = 'URL No Válida', mensaje = 'El enlace proporcionado no es válido.') {
  // Si solo se pasa un parámetro, asumir que es el mensaje (compatibilidad hacia atrás)
  if (arguments.length === 1) {
    mensaje = titulo;
    titulo = 'URL No Válida';
  }
  
  // Ocultar formulario
  const form = document.getElementById('activacionForm');
  const formContainer = form?.closest('.bg-white');
  const sectionContainer = document.querySelector('.max-w-3xl');
  
  if (sectionContainer) {
    sectionContainer.innerHTML = `
      <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-red-500 text-4xl">error</span>
        </div>
        <h3 class="text-2xl font-bold text-red-800 mb-4">${titulo}</h3>
        <p class="text-gray-700 mb-4 text-lg">${mensaje}</p>
        <p class="text-sm text-gray-600 mb-6">Por favor, verifica que estés usando el enlace correcto proporcionado por la persona que te compartió este formulario.</p>
        <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <p class="text-sm text-gray-700 mb-3 leading-relaxed">
            👉 Puedes contactar al conector que te facilitó el enlace o escribirnos directamente a nuestra empresa por WhatsApp:
          </p>
          <a href="https://wa.me/34685555362" target="_blank" 
             class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>📲 +34 685 55 53 62</span>
          </a>
        </div>
        <a href="index.html" 
           class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors mt-4 shadow-lg">
          <span class="material-icons">home</span>
          Volver al Inicio
        </a>
      </div>
    `;
  } else {
    alert(`${titulo}\n\n${mensaje}\n\n👉 Puedes contactar al conector que te facilitó el enlace o escribirnos directamente a nuestra empresa por WhatsApp:\n\n📲 +34 685 55 53 62`);
    window.location.href = 'index.html';
  }
}

/**
 * Obtener el nombre del asesor jurídico desde los parámetros de URL
 */
function obtenerAsesorDesdeURL() {
  const urlParams = new URLSearchParams(window.location.search);
  asesorJuridico = urlParams.get('asesor') || '';
  
  // Si ya validamos el usuario, usar los datos de la BD
  // Si no, usar los parámetros de la URL (incluyendo user_code y email)
  if (!usuarioValidado) {
    tipoConector = urlParams.get('type') || '';
    nombreConector = urlParams.get('name') || '';
    userCode = urlParams.get('user_code') || ''; // IMPORTANTE: Se envía en el webhook aunque la validación esté desactivada
    // Nota: El email también puede venir en la URL pero no se usa aquí, solo se envía user_code
  }
  
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
      'https://n8n.empiezadecero.cat/webhook/6f3fee4b-0ae5-47f2-9841-6ada8ec89ff5',
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
    user_code: userCode || '', // Código del conector obtenido de la URL o validación
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
