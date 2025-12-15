/**
 * Gestión de Formulario - Redirección a página de Calendly
 */

/**
 * Redirigir a la página de agendar cita con los datos del usuario
 * @param {string} formIdUnico - ID único del formulario
 */
function redirigirACalendly(formIdUnico) {
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const codigoPais = document.getElementById('codigo_pais')?.value || '+34';
    const telefonoRaw = document.getElementById('telefono')?.value || '';
    
    // Normalizar teléfono: mantener el + si existe, eliminar todo lo demás excepto números
    let telefonoCompleto;
    if (telefonoRaw.trim().startsWith('+')) {
        // Si el teléfono ya tiene código de país con +, normalizar todo manteniendo el +
        telefonoCompleto = '+' + telefonoRaw.replace(/[^\d]/g, '');
    } else {
        // Si no tiene +, usar el código de país del selector y normalizar el número
        const telefonoNormalizado = telefonoRaw.replace(/\D/g, '');
        telefonoCompleto = codigoPais + telefonoNormalizado;
    }

    // Construir URL con parámetros
    const params = new URLSearchParams();
    if (nombre) params.append('nombre', nombre);
    if (email) params.append('email', email);
    if (telefonoCompleto) params.append('telefono', telefonoCompleto); // Enviar teléfono completo normalizado
    if (formIdUnico) params.append('form_id', formIdUnico); // ID único del formulario

    // Redirigir a la página de agendar cita
    const redirectUrl = params.toString() ? `agendar-cita.html?${params.toString()}` : 'agendar-cita.html';
    window.location.href = redirectUrl;
}

/**
 * Se exporta para usar después del envío exitoso del formulario
 */
window.redirigirACalendly = redirigirACalendly;
