/**
 * Generador de Enlaces v2 para Afiliados
 * Consulta datos desde Supabase vía n8n y crea enlaces personalizados
 */

// URL base del formulario de activación
const BASE_URL = window.location.origin + window.location.pathname.replace('generar-enlace-2.html', 'activacion.html');

/**
 * Inicializar el generador cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  configurarFormulario();
  configurarBotones();
});

// Variable global para almacenar los datos del usuario encontrado
let usuarioEncontrado = null;

/**
 * Configurar el formulario de generación
 */
function configurarFormulario() {
  const form = document.getElementById('generadorForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await generarEnlace();
  });
}

/**
 * Configurar los botones de acción
 */
function configurarBotones() {
  // Botón buscar usuario
  const buscarBtn = document.getElementById('buscarBtn');
  if (buscarBtn) {
    buscarBtn.addEventListener('click', async function() {
      await buscarUsuario();
    });
  }

  // Permitir buscar con Enter en el campo email
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('keypress', async function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        await buscarUsuario();
      }
    });
  }

  // Botón copiar
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copiarEnlace);
  }

  // Botón generar otro
  const newLinkBtn = document.getElementById('newLinkBtn');
  if (newLinkBtn) {
    newLinkBtn.addEventListener('click', resetearFormulario);
  }
}

/**
 * Consultar usuario por email desde Supabase vía n8n
 * @param {string} email - Email del usuario a consultar
 * @returns {Promise<Object>} Datos del usuario
 */
async function consultarUsuarioPorEmail(email) {
  // Validar email
  if (!email || !email.trim() || !email.includes('@')) {
    throw new Error('Email no válido');
  }

  // Verificar que el webhook esté configurado
  if (!CONFIG || !CONFIG.n8n || !CONFIG.n8n.webhookGetUser) {
    throw new Error('Webhook de n8n no configurado. Configura CONFIG.n8n.webhookGetUser en config.js');
  }

  const emailNormalizado = email.toLowerCase().trim();
  const url = `${CONFIG.n8n.webhookGetUser}?email=${encodeURIComponent(emailNormalizado)}`;

  console.log('Consultando usuario por email:', emailNormalizado);
  console.log('URL del webhook:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Respuesta de n8n - Status:', response.status);

    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta para más detalles
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText;
        console.error('Detalles del error:', errorText);
      } catch (e) {
        console.error('No se pudo leer el cuerpo del error');
      }
      throw new Error(`Error en la respuesta de n8n: ${response.status} ${response.statusText}. ${errorDetails ? 'Detalles: ' + errorDetails : ''}`);
    }

    // Leer la respuesta
    let responseData;
    try {
      const responseText = await response.text();
      console.log('Respuesta raw de n8n:', responseText);
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON:', parseError);
      throw new Error('Respuesta de n8n no es JSON válido');
    }

    console.log('Datos del usuario obtenidos:', responseData);

    // La respuesta viene como array: [{...}]
    let usuario;
    if (Array.isArray(responseData)) {
      if (responseData.length === 0) {
        throw new Error('Usuario no encontrado');
      }
      usuario = responseData[0];
    } else if (responseData.error) {
      throw new Error(responseData.message || responseData.error || 'Usuario no encontrado');
    } else {
      usuario = responseData;
    }

    // Validar que tenga los campos necesarios
    if (!usuario.user_code || !usuario.email) {
      throw new Error('Datos incompletos del usuario en la respuesta');
    }

    // Normalizar campos (nombre vs name)
    if (usuario.nombre && !usuario.name) {
      usuario.name = usuario.nombre;
    }

    return usuario;

  } catch (error) {
    console.error('Error al consultar usuario por email:', error);
    throw error;
  }
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
  const errorDiv = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  
  if (errorDiv && errorText) {
    errorText.textContent = mensaje;
    errorDiv.classList.remove('hidden');
    
    // Scroll al error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    alert(mensaje);
  }
}

/**
 * Ocultar mensaje de error
 */
function ocultarError() {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

/**
 * Mostrar mensaje informativo
 */
function mostrarInfo(mensaje) {
  const infoDiv = document.getElementById('infoMessage');
  const infoText = document.getElementById('infoText');
  
  if (infoDiv && infoText) {
    infoText.textContent = mensaje;
    infoDiv.classList.remove('hidden');
    
    // Scroll al mensaje
    infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Ocultar mensaje informativo
 */
function ocultarInfo() {
  const infoDiv = document.getElementById('infoMessage');
  if (infoDiv) {
    infoDiv.classList.add('hidden');
  }
}

/**
 * Mostrar datos del usuario encontrado
 */
function mostrarDatosUsuario(usuario) {
  const datosDiv = document.getElementById('datosEncontrados');
  const datosNombre = document.getElementById('datosNombre');
  const datosType = document.getElementById('datosType');
  const datosUserCode = document.getElementById('datosUserCode');
  const datosEmail = document.getElementById('datosEmail');
  const datosTelefono = document.getElementById('datosTelefono');
  const datosPerfil = document.getElementById('datosPerfil');

  if (datosDiv && datosNombre && datosUserCode && datosEmail) {
    // Normalizar nombre (puede venir como 'nombre' o 'name')
    const nombre = usuario.nombre || usuario.name || 'N/A';
    
    // Mapear tipos a nombres legibles (si existe)
    const tiposNombres = {
      'comercial': 'Comercial',
      'conector': 'Conector',
      'conector_pro': 'Conector Pro'
    };
    const tipo = tiposNombres[usuario.type] || usuario.type || 'No especificado';

    datosNombre.textContent = nombre;
    if (datosType) {
      datosType.textContent = tipo;
    }
    datosUserCode.textContent = usuario.user_code || 'N/A';
    datosEmail.textContent = usuario.email || 'N/A';
    
    // Mostrar teléfono si existe
    if (datosTelefono) {
      datosTelefono.textContent = usuario.telefono || 'No disponible';
    }

    // Mostrar perfil si existe
    if (datosPerfil) {
      datosPerfil.textContent = usuario.perfil || 'No especificado';
    }

    datosDiv.classList.remove('hidden');
  }
}

/**
 * Ocultar datos del usuario
 */
function ocultarDatosUsuario() {
  const datosDiv = document.getElementById('datosEncontrados');
  if (datosDiv) {
    datosDiv.classList.add('hidden');
  }
}

/**
 * Habilitar botón de generar enlace
 */
function habilitarGenerarEnlace() {
  const submitBtn = document.getElementById('submitBtn');
  const submitIcon = document.getElementById('submitIcon');
  const submitText = document.getElementById('submitText');

  if (submitBtn && submitIcon && submitText) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
    submitBtn.classList.add('bg-primary', 'text-white', 'hover:bg-primary/90');
    submitIcon.textContent = 'auto_awesome';
    submitText.textContent = 'Generar Enlace';
  }
}

/**
 * Deshabilitar botón de generar enlace
 */
function deshabilitarGenerarEnlace() {
  const submitBtn = document.getElementById('submitBtn');
  const submitIcon = document.getElementById('submitIcon');
  const submitText = document.getElementById('submitText');

  if (submitBtn && submitIcon && submitText) {
    submitBtn.disabled = true;
    submitBtn.classList.remove('bg-primary', 'text-white', 'hover:bg-primary/90');
    submitBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
    submitIcon.textContent = 'lock';
    submitText.textContent = 'Busca un usuario primero para generar el enlace';
  }
}

/**
 * Mostrar estado de carga en botón buscar
 */
function mostrarCargaBuscar(mostrar = true) {
  const buscarBtn = document.getElementById('buscarBtn');
  const buscarIcon = document.getElementById('buscarIcon');
  const buscarText = document.getElementById('buscarText');

  if (buscarBtn && buscarIcon && buscarText) {
    if (mostrar) {
      buscarBtn.disabled = true;
      buscarIcon.innerHTML = '<div class="spinner"></div>';
      buscarText.textContent = 'Buscando...';
    } else {
      buscarBtn.disabled = false;
      buscarIcon.textContent = 'search';
      buscarText.textContent = 'Buscar';
    }
  }
}

/**
 * Mostrar estado de carga en botón generar
 */
function mostrarCargaGenerar(mostrar = true) {
  const submitBtn = document.getElementById('submitBtn');
  const submitIcon = document.getElementById('submitIcon');
  const submitText = document.getElementById('submitText');

  if (submitBtn && submitIcon && submitText) {
    if (mostrar) {
      submitBtn.disabled = true;
      submitIcon.innerHTML = '<div class="spinner"></div>';
      submitText.textContent = 'Generando...';
    } else {
      // Restaurar estado según si hay usuario encontrado
      if (usuarioEncontrado) {
        habilitarGenerarEnlace();
      } else {
        deshabilitarGenerarEnlace();
      }
    }
  }
}

/**
 * Buscar usuario por email
 */
async function buscarUsuario() {
  // Ocultar mensajes previos
  ocultarError();
  ocultarInfo();
  ocultarDatosUsuario();
  deshabilitarGenerarEnlace();
  usuarioEncontrado = null;

  // Obtener email
  const email = document.getElementById('email').value.trim();

  // Validar email
  if (!email) {
    mostrarError('Por favor ingresa un email');
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    mostrarError('Por favor ingresa un email válido');
    return;
  }

  // Mostrar estado de carga
  mostrarCargaBuscar(true);

  try {
    // Consultar usuario por email
    const usuario = await consultarUsuarioPorEmail(email);

    console.log('Usuario encontrado:', usuario);

    // Guardar usuario encontrado
    usuarioEncontrado = usuario;

    // Mostrar datos del usuario
    mostrarDatosUsuario(usuario);

    // Habilitar botón de generar enlace
    habilitarGenerarEnlace();

    // Mostrar mensaje de éxito
    mostrarInfo('Usuario encontrado. Verifica los datos y completa el asesor jurídico para generar el enlace.');

  } catch (error) {
    console.error('Error al buscar usuario:', error);
    
    // Determinar mensaje de error apropiado
    let mensajeError = 'Error al consultar los datos del usuario';
    
    if (error.message.includes('no encontrado') || error.message.includes('Usuario no encontrado')) {
      mensajeError = 'No se encontró ningún usuario con ese email en la base de datos. Verifica que el email esté correcto o usa la versión 1 del generador.';
    } else if (error.message.includes('Error en la respuesta de n8n')) {
      mensajeError = 'Error al comunicarse con el servidor. Por favor intenta nuevamente.';
    } else if (error.message.includes('no configurado')) {
      mensajeError = 'Error de configuración. Por favor contacta al administrador.';
    } else if (error.message) {
      mensajeError = error.message;
    }

    mostrarError(mensajeError);
    usuarioEncontrado = null;
    deshabilitarGenerarEnlace();

  } finally {
    // Ocultar estado de carga
    mostrarCargaBuscar(false);
  }
}

/**
 * Generar el enlace personalizado
 */
async function generarEnlace() {
  // Ocultar mensajes previos
  ocultarError();
  ocultarInfo();

  // Validar que se haya encontrado un usuario
  if (!usuarioEncontrado) {
    mostrarError('Por favor busca un usuario primero antes de generar el enlace');
    return;
  }

  // Obtener valores del formulario
  const asesor = document.getElementById('asesor').value.trim();

  // Validar campos básicos
  if (!asesor) {
    mostrarError('Por favor completa el nombre del asesor jurídico');
    return;
  }

  // Mostrar estado de carga
  mostrarCargaGenerar(true);

  try {
    // Normalizar nombre (puede venir como 'nombre' o 'name')
    const nombre = usuarioEncontrado.nombre || usuarioEncontrado.name || '';

    // Construir la URL con parámetros
    // Usar 'perfil' en lugar de 'type' para el parámetro type del enlace
    const params = new URLSearchParams({
      asesor: asesor,
      type: usuarioEncontrado.perfil || usuarioEncontrado.type || '',
      name: nombre,
      user_code: usuarioEncontrado.user_code || ''
    });

    const enlaceCompleto = `${BASE_URL}?${params.toString()}`;

    console.log('Enlace generado:', enlaceCompleto);

    // Usar 'perfil' en lugar de 'type' para mostrar
    const perfil = usuarioEncontrado.perfil || usuarioEncontrado.type || '';

    // Mostrar resultados (usando la variable 'nombre' ya declarada arriba)
    mostrarResultado(asesor, perfil, nombre, usuarioEncontrado.user_code, enlaceCompleto);

  } catch (error) {
    console.error('Error al generar enlace:', error);
    mostrarError('Error al generar el enlace. Por favor intenta nuevamente.');
  } finally {
    // Ocultar estado de carga
    mostrarCargaGenerar(false);
  }
}

/**
 * Mostrar el resultado con el enlace generado
 */
function mostrarResultado(asesor, type, name, userCode, enlace) {
  // Mapear tipos a nombres legibles
  const tiposNombres = {
    'comercial': 'Comercial',
    'conector': 'Conector',
    'conector_pro': 'Conector Pro'
  };

  // Actualizar información
  document.getElementById('resultAsesor').textContent = asesor;
  document.getElementById('resultType').textContent = tiposNombres[type] || type || 'N/A';
  document.getElementById('resultName').textContent = name || 'N/A';
  document.getElementById('resultUserCode').textContent = userCode || 'N/A';
  document.getElementById('generatedLink').value = enlace;

  // Ocultar formulario y mostrar resultado
  document.getElementById('generadorForm').parentElement.classList.add('hidden');
  document.getElementById('resultCard').classList.remove('hidden');

  // Scroll suave al resultado
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Copiar el enlace al portapapeles
 */
async function copiarEnlace() {
  const linkInput = document.getElementById('generatedLink');
  const copyBtn = document.getElementById('copyBtn');
  const originalText = copyBtn.innerHTML;

  try {
    // Seleccionar y copiar
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // Para móviles

    // Copiar usando la API moderna
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(linkInput.value);
    } else {
      // Fallback para navegadores antiguos
      document.execCommand('copy');
    }

    // Feedback visual
    copyBtn.innerHTML = '<span class="material-icons text-lg">check</span> ¡Copiado!';
    copyBtn.classList.add('bg-green-500');
    copyBtn.classList.remove('bg-primary');

    // Restaurar después de 2 segundos
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('bg-green-500');
      copyBtn.classList.add('bg-primary');
    }, 2000);

  } catch (error) {
    console.error('Error al copiar:', error);
    alert('No se pudo copiar el enlace. Por favor cópialo manualmente.');
  }
}

/**
 * Resetear el formulario para generar otro enlace
 */
function resetearFormulario() {
  // Limpiar formulario
  document.getElementById('generadorForm').reset();
  
  // Resetear variables
  usuarioEncontrado = null;

  // Ocultar mensajes y datos
  ocultarError();
  ocultarInfo();
  ocultarDatosUsuario();
  deshabilitarGenerarEnlace();

  // Mostrar formulario y ocultar resultado
  document.getElementById('generadorForm').parentElement.classList.remove('hidden');
  document.getElementById('resultCard').classList.add('hidden');

  // Scroll al formulario
  document.getElementById('generadorForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

