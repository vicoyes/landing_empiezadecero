/**
 * Generador de Enlaces para Afiliados
 * Crea enlaces personalizados para el formulario de activación
 */

// URL base del formulario de activación
const BASE_URL = window.location.origin + window.location.pathname.replace('generar-enlace.html', 'activacion.html');

/**
 * Inicializar el generador cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  configurarFormulario();
  configurarBotones();
});

/**
 * Configurar el formulario de generación
 */
function configurarFormulario() {
  const form = document.getElementById('generadorForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    generarEnlace();
  });
}

/**
 * Configurar los botones de acción
 */
function configurarBotones() {
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
 * Generar el enlace personalizado
 */
function generarEnlace() {
  // Obtener valores del formulario
  const asesor = document.getElementById('asesor').value.trim();
  const type = document.getElementById('type').value;
  const name = document.getElementById('name').value.trim();

  // Validar que todos los campos estén completos
  if (!asesor || !type || !name) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Construir la URL con parámetros
  const params = new URLSearchParams({
    asesor: asesor,
    type: type,
    name: name
  });

  const enlaceCompleto = `${BASE_URL}?${params.toString()}`;

  // Mostrar resultados
  mostrarResultado(asesor, type, name, enlaceCompleto);
}

/**
 * Mostrar el resultado con el enlace generado
 */
function mostrarResultado(asesor, type, name, enlace) {
  // Mapear tipos a nombres legibles
  const tiposNombres = {
    'comercial': 'Comercial',
    'conector': 'Conector',
    'conector_pro': 'Conector Pro'
  };

  // Actualizar información
  document.getElementById('resultAsesor').textContent = asesor;
  document.getElementById('resultType').textContent = tiposNombres[type] || type;
  document.getElementById('resultName').textContent = name;
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

  // Mostrar formulario y ocultar resultado
  document.getElementById('generadorForm').parentElement.classList.remove('hidden');
  document.getElementById('resultCard').classList.add('hidden');

  // Scroll al formulario
  document.getElementById('generadorForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
