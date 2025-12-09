/**
 * Gestión de Formulario - Redirección a página de Calendly
 */

/**
 * Redirigir a la página de agendar cita con los datos del usuario
 */
function redirigirACalendly() {
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre')?.value || '';
    const email = document.getElementById('email')?.value || '';

    // Construir URL con parámetros
    const params = new URLSearchParams();
    if (nombre) params.append('nombre', nombre);
    if (email) params.append('email', email);

    // Redirigir a la página de agendar cita
    const redirectUrl = params.toString() ? `agendar-cita.html?${params.toString()}` : 'agendar-cita.html';
    window.location.href = redirectUrl;
}

/**
 * Se exporta para usar después del envío exitoso del formulario
 */
window.redirigirACalendly = redirigirACalendly;
