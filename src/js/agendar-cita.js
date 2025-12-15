/**
 * Gestión de la página de agendación de cita con Calendly
 * Incluye: configuración de Calendly, pre-llenado de campos y detección de eventos
 */

// ============================================
// CONFIGURACIÓN DE CALENDLY Y PRE-LLENADO
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    // Decodificar el nombre: convertir los + en espacios
    let nombre = urlParams.get('nombre');
    if (nombre) {
        // Reemplazar + por espacios (URLSearchParams puede dejar + en lugar de espacios)
        nombre = nombre.replace(/\+/g, ' ');
        // Decodificar cualquier carácter codificado (como %40 para @)
        try {
            nombre = decodeURIComponent(nombre);
        } catch (e) {
            // Si falla la decodificación, usar el nombre tal cual
            console.log('No se pudo decodificar el nombre:', e);
        }
        console.log('Nombre decodificado:', nombre);
    }
    const email = urlParams.get('email');
    const telefonoValue = urlParams.get('telefono'); // Variable para el teléfono
    const formId = urlParams.get('form_id'); // ID único del formulario - SOLO para URL

    // Validar que tenemos el teléfono correcto
    console.log('Teléfono obtenido de URL:', telefonoValue);
    console.log('Form ID obtenido de URL:', formId);

    // Personalizar el mensaje de bienvenida
    if (nombre) {
        const nombreElement = document.getElementById('nombreUsuario');
        if (nombreElement) {
            // Obtener solo el primer nombre
            const primerNombre = nombre.split(' ')[0];
            nombreElement.textContent = primerNombre;
        }
    }

    // Configurar Calendly con los datos pre-rellenados
    const calendlyWidget = document.querySelector('.calendly-inline-widget');
    if (calendlyWidget) {
        let calendlyUrl = 'https://calendly.com/conectores-empiezadecero/30min';
        const params = new URLSearchParams();

        // Pasar nombre, email y teléfono a Calendly
        // Calendly usa parámetros a1, a2, etc. para campos personalizados
        // El teléfono se pasa como a1 para que Calendly lo pre-llene automáticamente
        if (nombre) params.append('name', nombre);
        if (email) params.append('email', email);
        if (telefonoValue) params.append('a1', telefonoValue); // Pasar teléfono como parámetro personalizado
        // NO pasar formId en la URL de Calendly - solo mantenerlo en la URL de esta página

        if (params.toString()) {
            calendlyUrl += '?' + params.toString();
        }

        calendlyWidget.setAttribute('data-url', calendlyUrl);
        
        // Guardar form_id en el almacenamiento local para referencia (pero NO en URL de Calendly)
        if (formId) {
            sessionStorage.setItem('calendly_form_id', formId);
            console.log('Form ID guardado en sessionStorage:', formId);
        }
        
        console.log('URL de Calendly con parámetros:', calendlyUrl);
        console.log('Teléfono pasado como a1:', telefonoValue);

        // Pre-llenar el campo de teléfono cuando el widget esté listo
        // IMPORTANTE: Usar telefonoValue (el teléfono real), NO formId
        if (telefonoValue) {
            let telefonoPrellenado = false;
            
            // Función para intentar pre-llenar el teléfono
            function prellenarTelefono() {
                if (telefonoPrellenado) return true;
                
                try {
                    const iframe = calendlyWidget.querySelector('iframe');
                    if (!iframe || !iframe.contentWindow) {
                        console.log('Iframe no disponible aún');
                        return false;
                    }
                    
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!iframeDoc || !iframeDoc.body) {
                        console.log('Documento del iframe no disponible aún');
                        return false;
                    }
                    
                    console.log('Buscando campo de teléfono...');
                    console.log('Teléfono a usar:', telefonoValue);
                    
                    // Buscar el campo de teléfono de múltiples formas
                    let telefonoInput = null;
                    
                    // 1. Buscar por name="question_0" (más confiable)
                    telefonoInput = iframeDoc.querySelector('input[name="question_0"]');
                    if (telefonoInput) {
                        console.log('Campo encontrado por name="question_0"');
                    }
                    
                    // 2. Si no se encuentra, buscar por label "Teléfono"
                    if (!telefonoInput) {
                        const labels = iframeDoc.querySelectorAll('label');
                        for (let label of labels) {
                            const labelText = label.textContent || label.innerText;
                            if (labelText.includes('Teléfono') || labelText.includes('teléfono')) {
                                console.log('Label de Teléfono encontrado:', labelText);
                                const inputId = label.getAttribute('for');
                                if (inputId) {
                                    telefonoInput = iframeDoc.getElementById(inputId);
                                    if (telefonoInput) {
                                        console.log('Campo encontrado por ID del label:', inputId);
                                    }
                                }
                                if (!telefonoInput) {
                                    const inputContainer = label.closest('[data-component="question"]');
                                    if (inputContainer) {
                                        telefonoInput = inputContainer.querySelector('input[type="text"]');
                                        if (telefonoInput) {
                                            console.log('Campo encontrado en contenedor de pregunta');
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    
                    // 3. Buscar en el fieldset que contiene "Teléfono"
                    if (!telefonoInput) {
                        const fieldsets = iframeDoc.querySelectorAll('fieldset');
                        for (let fieldset of fieldsets) {
                            const fieldsetText = fieldset.textContent || fieldset.innerText;
                            if (fieldsetText.includes('Teléfono') || fieldsetText.includes('teléfono')) {
                                telefonoInput = fieldset.querySelector('input[type="text"][name="question_0"]') ||
                                               fieldset.querySelector('input[type="text"]');
                                if (telefonoInput) {
                                    console.log('Campo encontrado en fieldset');
                                    break;
                                }
                            }
                        }
                    }
                    
                    // 4. Buscar todos los inputs de texto y verificar cuál es el de teléfono
                    if (!telefonoInput) {
                        const allInputs = iframeDoc.querySelectorAll('input[type="text"]');
                        console.log('Total de inputs de texto encontrados:', allInputs.length);
                        for (let input of allInputs) {
                            // Buscar el input que está cerca de un label con "Teléfono"
                            const parent = input.closest('fieldset, [data-component="question"]');
                            if (parent) {
                                const parentText = parent.textContent || parent.innerText;
                                if (parentText.includes('Teléfono') || parentText.includes('teléfono')) {
                                    telefonoInput = input;
                                    console.log('Campo encontrado por búsqueda exhaustiva');
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (telefonoInput && telefonoInput.tagName === 'INPUT') {
                        console.log('Campo de teléfono encontrado, pre-llenando con:', telefonoValue);
                        console.log('Valor actual del campo (antes):', telefonoInput.value);
                        
                        // Limpiar cualquier valor previo (por si Calendly lo pre-llenó con formId)
                        telefonoInput.value = '';
                        
                        // Pre-llenar el campo con el teléfono REAL (telefonoValue), NO con formId
                        telefonoInput.focus();
                        telefonoInput.value = telefonoValue; // Usar telefonoValue, no formId
                        
                        // Disparar eventos para que Calendly detecte el cambio
                        telefonoInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        telefonoInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                        telefonoInput.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
                        
                        // También intentar con eventos nativos
                        if (telefonoInput.dispatchEvent) {
                            const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
                            telefonoInput.dispatchEvent(inputEvent);
                        }
                        
                        // Verificar que se guardó correctamente
                        setTimeout(function() {
                            console.log('Valor del campo después de pre-llenar:', telefonoInput.value);
                            if (telefonoInput.value !== telefonoValue) {
                                console.warn('El valor no se guardó correctamente, reintentando...');
                                telefonoInput.value = telefonoValue;
                                telefonoInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                                telefonoInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                            }
                        }, 500);
                        
                        telefonoPrellenado = true;
                        console.log('✓ Teléfono pre-llenado correctamente:', telefonoValue);
                        console.log('Form ID (solo en sessionStorage, NO en campo):', formId);
                        return true;
                    } else {
                        console.log('Campo de teléfono no encontrado aún');
                    }
                } catch (error) {
                    // CORS puede bloquear el acceso directo al iframe
                    if (error.name !== 'SecurityError') {
                        console.error('Error al pre-llenar teléfono:', error);
                    } else {
                        console.log('Acceso bloqueado por CORS (normal en iframes)');
                    }
                }
                return false;
            }

            // Usar MutationObserver para detectar cuando el campo se carga
            function observarIframe() {
                try {
                    const iframe = calendlyWidget.querySelector('iframe');
                    if (!iframe) {
                        setTimeout(observarIframe, 500);
                        return;
                    }
                    
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!iframeDoc || !iframeDoc.body) {
                        setTimeout(observarIframe, 500);
                        return;
                    }
                    
                    // Crear observer para detectar cuando se agregan elementos
                    const observer = new MutationObserver(function(mutations) {
                        if (!telefonoPrellenado) {
                            if (prellenarTelefono()) {
                                observer.disconnect();
                            }
                        }
                    });
                    
                    observer.observe(iframeDoc.body, {
                        childList: true,
                        subtree: true,
                        attributes: false
                    });
                    
                    // Intentar pre-llenar inmediatamente
                    prellenarTelefono();
                    
                    // Desconectar después de 30 segundos
                    setTimeout(function() {
                        observer.disconnect();
                    }, 30000);
                    
                } catch (error) {
                    // Si hay error de CORS, intentar con delays
                    console.log('No se pudo observar el iframe, usando método alternativo');
                }
            }

            // Escuchar eventos de Calendly
            window.addEventListener('message', function(e) {
                if (e.data.event && e.data.event.indexOf('calendly') === 0) {
                    if (e.data.event === 'calendly.event_type_viewed' || 
                        e.data.event === 'calendly.page_height') {
                        setTimeout(observarIframe, 1000);
                    }
                }
            });

            // Iniciar observación después de un delay inicial
            setTimeout(observarIframe, 2000);
            
            // Intentar múltiples veces con diferentes delays como respaldo
            const intervals = [3000, 5000, 7000, 10000, 15000];
            intervals.forEach(function(delay) {
                setTimeout(function() {
                    if (!telefonoPrellenado) {
                        prellenarTelefono();
                    }
                }, delay);
            });
        }
    }
});

// ============================================
// DETECCIÓN DE EVENTOS DE CALENDLY Y WEBHOOK
// ============================================
(function() {
    // Obtener parámetros de la URL
    const qs = new URLSearchParams(window.location.search);
    const email = qs.get("email");
    const form_id = qs.get("form_id");
    const telefono = qs.get("telefono");
    const nombre = qs.get("nombre");

    console.log('Inicializando listener de eventos de Calendly');
    console.log('Email:', email);
    console.log('Form ID:', form_id);

    // Variable para evitar envíos duplicados
    let webhookEnviado = false;

    // Escuchar eventos de Calendly
    window.addEventListener("message", function (e) {
        // Verificar que el evento sea de Calendly
        if (e.data?.event === "calendly.event_scheduled") {
            console.log('Evento de Calendly detectado: event_scheduled', e.data);
            
            // Evitar envíos duplicados
            if (webhookEnviado) {
                console.log('Webhook ya enviado, ignorando evento duplicado');
                return;
            }

            webhookEnviado = true;

            // Preparar datos para enviar a n8n
            const webhookData = {
                email: email,
                form_id: form_id,
                telefono: telefono,
                nombre: nombre,
                calendly_event: e.data,
                timestamp: new Date().toISOString(),
                page_url: window.location.href
            };

            console.log('Enviando webhook a n8n con datos:', webhookData);

            // Enviar webhook a n8n
            fetch("https://n8n.empiezadecero.cat/webhook/9c2b6dc5-8043-46e7-bba2-61a90083d3cc", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(webhookData)
            })
            .then(response => {
                if (response.ok || response.status === 0) {
                    console.log('✓ Webhook enviado exitosamente a n8n');
                } else {
                    console.error('Error al enviar webhook:', response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error('Error al enviar webhook:', error);
                // No mostrar error al usuario, solo loguear
            });
        }
    });

    // También escuchar otros eventos relevantes de Calendly por si acaso
    window.addEventListener("message", function (e) {
        if (e.data?.event && e.data.event.indexOf('calendly') === 0) {
            console.log('Evento de Calendly detectado:', e.data.event, e.data);
        }
    });
})();

