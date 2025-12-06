/**
 * Gestión de Formulario de 2 Pasos con Calendly
 */

/**
 * Mostrar el Paso 2 (Calendly)
 */
function mostrarPaso2() {
    const step1 = document.getElementById('formStep1');
    const step2 = document.getElementById('formStep2');
    const progressBar = document.getElementById('progressBar');
    const stepDescription = document.getElementById('stepDescription');
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');
    
    // Obtener datos del formulario para pre-rellenar Calendly
    const nombre = document.getElementById('nombre')?.value || '';
    const email = document.getElementById('email')?.value || '';
    
    // Construir URL de Calendly con parámetros pre-rellenados
    const calendlyBaseUrl = 'https://calendly.com/conectores-empiezadecero/30min';
    const params = new URLSearchParams();
    
    if (nombre) params.append('name', nombre);
    if (email) params.append('email', email);
    
    const calendlyUrl = params.toString() ? `${calendlyBaseUrl}?${params.toString()}` : calendlyBaseUrl;
    
    // Actualizar el data-url del widget de Calendly
    const calendlyWidget = document.querySelector('.calendly-inline-widget');
    if (calendlyWidget) {
        calendlyWidget.setAttribute('data-url', calendlyUrl);
    }
    
    // Ocultar paso 1, mostrar paso 2
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    
    // Actualizar indicadores
    progressBar.style.width = '100%';
    stepDescription.textContent = 'Agenda tu llamada de bienvenida';
    
    // Actualizar estilos de los indicadores - Paso 1 completado
    const step1Circle = step1Indicator.querySelector('div');
    const step1Text = step1Indicator.querySelector('span');
    step1Circle.classList.remove('bg-primary', 'text-white');
    step1Circle.classList.add('bg-green-500', 'text-white');
    step1Text.classList.remove('text-primary');
    step1Text.classList.add('text-green-600');
    
    // Actualizar estilos de los indicadores - Paso 2 activo
    const step2Circle = step2Indicator.querySelector('div');
    const step2Text = step2Indicator.querySelector('span');
    step2Circle.classList.remove('bg-gray-300', 'text-gray-500');
    step2Circle.classList.add('bg-primary', 'text-white');
    step2Text.classList.remove('text-gray-500');
    step2Text.classList.add('text-primary');
    
    // Scroll suave al paso 2
    setTimeout(() => {
        step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Cargar script de Calendly si no está cargado
    if (!document.querySelector('script[src*="calendly"]')) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);
    } else {
        // Si ya está cargado, forzar recarga del widget con la nueva URL
        if (window.Calendly) {
            window.Calendly.initInlineWidget({
                url: calendlyUrl,
                parentElement: calendlyWidget
            });
        }
    }
}

/**
 * Volver al Paso 1
 */
function mostrarPaso1() {
    const step1 = document.getElementById('formStep1');
    const step2 = document.getElementById('formStep2');
    const progressBar = document.getElementById('progressBar');
    const stepDescription = document.getElementById('stepDescription');
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    
    // Mostrar paso 1, ocultar paso 2
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    
    // Actualizar indicadores
    progressBar.style.width = '0%';
    stepDescription.textContent = 'Completa tus datos para continuar';
    
    // Restaurar estilos de los indicadores - Paso 1
    const step1Circle = step1Indicator.querySelector('div');
    const step1Text = step1Indicator.querySelector('span');
    step1Circle.classList.remove('bg-green-500');
    step1Circle.classList.add('bg-primary', 'text-white');
    step1Text.classList.remove('text-green-600');
    step1Text.classList.add('text-primary');
    
    // Restaurar estilos de los indicadores - Paso 2
    const step2Circle = step2Indicator.querySelector('div');
    const step2Text = step2Indicator.querySelector('span');
    step2Circle.classList.remove('bg-primary', 'text-white');
    step2Circle.classList.add('bg-gray-300', 'text-gray-500');
    step2Text.classList.remove('text-primary');
    step2Text.classList.add('text-gray-500');
    
    // Restaurar botón
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>CONTINUAR AL PASO 2</span><span class="material-icons">arrow_forward</span>';
    }
    
    // Scroll suave al paso 1
    setTimeout(() => {
        step1.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Inicializar botón de volver
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backToStep1');
    if (backBtn) {
        backBtn.addEventListener('click', mostrarPaso1);
    }
});
