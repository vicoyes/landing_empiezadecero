/* ============================================
   EMPIEZA DE CERO - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// HELLO BAR
// ============================================
function iniciarHelloBar() {
    if (CONFIG.helloBar.mostrar) {
        const bar = document.getElementById('helloBar');
        const mensaje = document.getElementById('helloBarMessage');
        const link = document.getElementById('helloBarLink');

        if (bar && mensaje && link) {
            mensaje.textContent = CONFIG.helloBar.mensaje;
            link.textContent = CONFIG.helloBar.textoBoton;
            link.href = CONFIG.helloBar.enlace;

            // Solo mostrar en desktop (md+), mantener hidden en móviles
            bar.classList.remove('hidden');
            bar.classList.add('hidden', 'md:block');

            // Ajustar padding solo en desktop
            if (window.innerWidth >= 768) {
                document.body.style.paddingTop = bar.offsetHeight + 'px';
            }
        }
    }
}

function cerrarHelloBar() {
    const bar = document.getElementById('helloBar');
    if (bar) {
        bar.style.transform = 'translateY(-100%)';
        bar.style.opacity = '0';
        setTimeout(() => {
            bar.classList.add('hidden');
            document.body.style.paddingTop = '0';
        }, 300);
    }
}

// ============================================
// TIMELINE ANIMACIÓN
// ============================================
function animateTimeline() {
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineSteps = document.querySelectorAll('.timeline-step');

    if (!timelineContainer || !timelineProgress) return;

    const containerRect = timelineContainer.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerHeight = containerRect.height;
    const windowHeight = window.innerHeight;

    // Calcular progreso de la línea vertical
    const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight * 0.5 - containerTop) / containerHeight
    ));

    timelineProgress.style.height = (scrollProgress * 100) + '%';

    // Animar cada paso
    timelineSteps.forEach((step, index) => {
        const stepRect = step.getBoundingClientRect();
        const stepCenter = stepRect.top + stepRect.height / 2;
        const triggerPoint = windowHeight * 0.6;

        const horizontalLine = step.querySelector('.timeline-horizontal');
        const dot = step.querySelector('.timeline-dot');

        if (stepCenter < triggerPoint) {
            if (dot) dot.classList.add('active');
            setTimeout(() => {
                if (horizontalLine) horizontalLine.classList.add('active');
            }, 200);
        }
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Función para inicializar AOS cuando esté disponible
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init(CONFIG.aos);
    } else {
        // Reintentar si AOS no está cargado aún
        setTimeout(initAOS, 100);
    }
}

// Función para inicializar Swiper cuando esté disponible
function initSwiper() {
    if (typeof Swiper !== 'undefined') {
        const testimoniosSwiper = new Swiper('.testimoniosSwiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 32,
                },
            },
        });
    } else {
        // Reintentar si Swiper no está cargado aún
        setTimeout(initSwiper, 100);
    }
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', function () {
    // Iniciar Hello Bar (no depende de librerías externas)
    iniciarHelloBar();

    // Iniciar animación del timeline
    animateTimeline();

    // Iniciar AOS (carga diferida)
    initAOS();

    // Iniciar Swiper (carga diferida)
    initSwiper();
});

// Event Listeners
window.addEventListener('scroll', animateTimeline);
window.addEventListener('load', animateTimeline);

// ============================================
// FAQ ACORDEÓN
// ============================================
function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const content = faqItem.querySelector('.faq-content');
    const icon = faqItem.querySelector('.faq-icon');

    // Cerrar otros items abiertos
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.querySelector('.faq-content').classList.add('hidden');
            item.querySelector('.faq-icon').classList.remove('rotate-180');
            item.classList.remove('faq-active');
        }
    });

    // Toggle el item actual
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
    faqItem.classList.toggle('faq-active');
}

// ============================================
// GENERACIÓN DE CÓDIGOS ÚNICOS
// ============================================

/**
 * Genera un código alfanumérico único
 * @param {string} prefix - Prefijo del código (ej: "CON-", "REF-")
 * @param {number} length - Longitud del código (sin contar el prefijo)
 * @returns {string} Código único generado
 */
function generarCodigoUnico(prefix, length = 6) {
    // Caracteres permitidos (sin I, O, 0, 1 para evitar confusión)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo = prefix;
    
    // Generar caracteres aleatorios
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        codigo += chars[randomIndex];
    }
    
    // Agregar timestamp para mayor unicidad (últimos 4 dígitos)
    const timestamp = Date.now().toString().slice(-4);
    codigo += timestamp;
    
    return codigo;
}

/**
 * Genera user_code único (CON-XXXXXX)
 * @returns {string} Código de usuario único
 */
function generarUserCode() {
    return generarCodigoUnico('CON-', 6);
}

/**
 * Genera referral_code único (REF-XXXXXX)
 * @returns {string} Código de referido único
 */
function generarReferralCode() {
    return generarCodigoUnico('REF-', 6);
}

// ============================================
// FUNCIÓN DE PRUEBA PARA CONSOLA
// ============================================
// Ejecuta en la consola: testSupabaseConnection()
async function testSupabaseConnection() {
    console.log('========================================');
    console.log('🧪 PRUEBA DE CONEXIÓN A SUPABASE');
    console.log('========================================');
    
    // Verificar configuración
    console.log('\n1️⃣ Verificando configuración...');
    if (!CONFIG.supabase.enabled) {
        console.error('❌ Supabase está deshabilitado en config.js');
        return;
    }
    
    if (!CONFIG.supabase.url || CONFIG.supabase.url === 'TU_SUPABASE_URL') {
        console.error('❌ URL de Supabase no configurada');
        return;
    }
    
    if (!CONFIG.supabase.anonKey || CONFIG.supabase.anonKey === 'TU_SUPABASE_ANON_KEY') {
        console.error('❌ Anon Key de Supabase no configurada');
        return;
    }
    
    console.log('✅ Configuración OK');
    console.log('   URL:', CONFIG.supabase.url);
    console.log('   Anon Key:', CONFIG.supabase.anonKey.substring(0, 20) + '...');
    
    // Verificar que Supabase esté cargado
    console.log('\n2️⃣ Verificando cliente de Supabase...');
    if (typeof supabase === 'undefined') {
        console.error('❌ Cliente de Supabase no está cargado');
        console.error('   Verifica que el script esté incluido en el HTML');
        return;
    }
    
    if (typeof supabase.createClient !== 'function') {
        console.error('❌ supabase.createClient no es una función');
        return;
    }
    
    console.log('✅ Cliente de Supabase disponible');
    
    // Crear cliente
    console.log('\n3️⃣ Creando cliente de Supabase...');
    try {
        const supabaseClient = supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
        console.log('✅ Cliente creado exitosamente');
        
        // Probar consulta simple
        console.log('\n4️⃣ Probando consulta a la tabla "users"...');
        const { data, error, count } = await supabaseClient
            .from('users')
            .select('id, email, user_code, referral_code', { count: 'exact' })
            .limit(5);
        
        if (error) {
            console.error('❌ Error al consultar:', error);
            console.error('   Código:', error.code);
            console.error('   Mensaje:', error.message);
            console.error('   Detalles:', error.details);
            return;
        }
        
        console.log('✅ Consulta exitosa');
        console.log('   Total de registros:', count || 0);
        console.log('   Primeros 5 registros:');
        if (data && data.length > 0) {
            data.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} - ${user.user_code} - ${user.referral_code}`);
            });
        } else {
            console.log('   (No hay registros aún)');
        }
        
        // Probar inserción de prueba (solo si hay menos de 10 registros)
        if (count < 10) {
            console.log('\n5️⃣ Probando inserción de prueba...');
            const testEmail = 'test_' + Date.now() + '@test.com';
            const testData = {
                nombre: 'Usuario de Prueba',
                email: testEmail,
                telefono: '+34600000000',
                form_id: crypto.randomUUID(),
                user_code: 'CON-TEST' + Date.now(),
                referral_code: 'REF-TEST' + Date.now(),
                privacidad: true,
                newsletter: false,
                status: 'pendiente'
            };
            
            const { data: insertData, error: insertError } = await supabaseClient
                .from('users')
                .insert([testData])
                .select()
                .single();
            
            if (insertError) {
                console.error('❌ Error al insertar:', insertError);
                console.error('   Código:', insertError.code);
                console.error('   Mensaje:', insertError.message);
                console.error('   Detalles:', insertError.details);
            } else {
                console.log('✅ Inserción exitosa');
                console.log('   ID:', insertData.id);
                console.log('   Email:', insertData.email);
                console.log('   User Code:', insertData.user_code);
                console.log('   Referral Code:', insertData.referral_code);
                
                // Eliminar el registro de prueba
                console.log('\n6️⃣ Eliminando registro de prueba...');
                const { error: deleteError } = await supabaseClient
                    .from('users')
                    .delete()
                    .eq('id', insertData.id);
                
                if (deleteError) {
                    console.warn('⚠️ No se pudo eliminar el registro de prueba:', deleteError);
                } else {
                    console.log('✅ Registro de prueba eliminado');
                }
            }
        } else {
            console.log('\n5️⃣ Saltando prueba de inserción (ya hay muchos registros)');
        }
        
        console.log('\n========================================');
        console.log('✅ TODAS LAS PRUEBAS COMPLETADAS');
        console.log('========================================');
        console.log('\n💡 La conexión a Supabase funciona correctamente');
        console.log('💡 Puedes usar esta función en cualquier momento ejecutando: testSupabaseConnection()');
        
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        console.error('   Stack:', error.stack);
    }
}

// Hacer la función disponible globalmente
window.testSupabaseConnection = testSupabaseConnection;

// ============================================
// VALIDACIÓN DE EMAIL EXISTENTE
// ============================================
async function verificarEmailExistente(email) {
    // Validar que el email no esté vacío
    if (!email || !email.trim() || !email.includes('@')) {
        console.log('Email no válido para verificación:', email);
        throw new Error('Email no válido');
    }

    // Verificar que el webhook esté configurado
    if (!CONFIG.n8n || !CONFIG.n8n.webhookForm) {
        console.error('Webhook de n8n no configurado');
        throw new Error('Webhook de n8n no configurado. Configura CONFIG.n8n.webhookForm en config.js');
    }

    try {
        console.log('Verificando email vía n8n (mismo webhook):', email);
        console.log('Webhook URL:', CONFIG.n8n.webhookForm);
        
        // Enviar email a n8n para verificación usando el mismo webhook
        // Agregamos action: "verify" para que n8n sepa que es solo verificación
        const response = await fetch(CONFIG.n8n.webhookForm, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'verify_email',  // Indicador para n8n de que es verificación
                email: email.toLowerCase().trim()
            })
        });

        console.log('Respuesta de n8n - Status:', response.status);

        if (!response.ok) {
            // Intentar leer el cuerpo de la respuesta para más detalles
            let errorDetails = '';
            try {
                const errorText = await response.text();
                errorDetails = errorText;
                console.error('Detalles del error 500:', errorText);
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
        console.log('Respuesta completa de n8n:', responseData);

        // La respuesta viene en formato: [{"sucess": {"state": false, "reason": "EMAIL_EXISTS", "message": "..."}}]
        // n8n puede devolver un array o un objeto directamente
        let result;
        if (Array.isArray(responseData) && responseData.length > 0) {
            result = responseData[0];
        } else if (responseData.sucess) {
            result = responseData;
        } else {
            // Si viene directamente el objeto sucess
            result = { sucess: responseData };
        }

        console.log('Resultado procesado:', result);

        // Verificar la estructura de la respuesta
        if (!result.sucess) {
            console.error('Respuesta de n8n no tiene el formato esperado:', result);
            throw new Error('Formato de respuesta de n8n inválido');
        }

        const successData = result.sucess;
        console.log('Datos de verificación:', successData);

        // Si state es false y reason es "EMAIL_EXISTS", el email existe
        if (successData.state === false && successData.reason === 'EMAIL_EXISTS') {
            console.log('=== RESULTADO DE VERIFICACIÓN ===');
            console.log('Email buscado:', email);
            console.log('✅ EMAIL EXISTE - El usuario ya está registrado');
            console.log('Mensaje:', successData.message);
            console.log('================================');
            return true; // Email existe
        }

        // Si state es true o reason es diferente, el email no existe
        console.log('=== RESULTADO DE VERIFICACIÓN ===');
        console.log('Email buscado:', email);
        console.log('✅ EMAIL NO EXISTE - El usuario puede continuar');
        console.log('Estado:', successData.state);
        console.log('Razón:', successData.reason);
        console.log('================================');
        return false; // Email no existe

    } catch (error) {
        console.error('Error al verificar email vía n8n:', error);
        console.error('Tipo de error:', error.name);
        console.error('Mensaje:', error.message);
        throw error; // Re-lanzar el error para que se maneje arriba
    }
}

// Función para mostrar mensaje de error de email
function mostrarErrorEmail(emailInput, mensaje) {
    // Remover mensaje anterior si existe
    const errorMsgAnterior = document.getElementById('email-error-msg');
    if (errorMsgAnterior) {
        errorMsgAnterior.remove();
    }

    // Crear mensaje de error
    const errorMsg = document.createElement('div');
    errorMsg.id = 'email-error-msg';
    errorMsg.className = 'mt-2 text-red-600 text-sm flex items-center gap-2 animate-fade-in';
    errorMsg.innerHTML = `<span class="material-icons text-base">error</span> <span>${mensaje}</span>`;
    
    // Insertar después del campo de email
    const emailContainer = emailInput.closest('div') || emailInput.parentElement;
    emailContainer.appendChild(errorMsg);
    
    // Resaltar el campo de email
    emailInput.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    
    // Scroll suave al campo con error
    emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    emailInput.focus();
}

// Función para remover error de email
function removerErrorEmail(emailInput) {
    const errorMsg = document.getElementById('email-error-msg');
    if (errorMsg) {
        errorMsg.remove();
    }
    emailInput.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
}

// ============================================
// WEBHOOK FORM SUBMISSION (n8n)
// ============================================
function initWebhookForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const emailInput = document.getElementById('email');
        const email = emailInput ? emailInput.value.trim() : '';

        // Validación de email: Solo cuando se presiona el botón del paso 2
        console.log('========================================');
        console.log('INICIANDO VALIDACIÓN DE FORMULARIO');
        console.log('========================================');
        console.log('Email a verificar:', email);
        
        // Estado de carga - Verificando email
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-icons animate-spin">sync</span> Verificando email...';

        // Validar si el email ya existe antes de enviar (validación OBLIGATORIA)
        console.log('Llamando a verificarEmailExistente...');
        
        let emailExiste;
        try {
            emailExiste = await verificarEmailExistente(email);
            console.log('Resultado de verificarEmailExistente:', emailExiste);
        } catch (error) {
            console.error('Error durante la verificación de email:', error);
            // Si hay error en la verificación, NO continuar por seguridad
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            alert('Error al verificar el email. Por favor, inténtalo de nuevo o contacta con soporte.');
            return; // NO continuar si hay error
        }
        
        // Verificar que emailExiste sea un booleano válido
        if (typeof emailExiste !== 'boolean') {
            console.error('Resultado de verificación no es booleano:', emailExiste);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            alert('Error en la verificación. Por favor, inténtalo de nuevo.');
            return; // NO continuar si el resultado no es válido
        }
        
        if (emailExiste === true) {
            // El email EXISTE en la base de datos - mostrar error y detener
            console.log('❌ EMAIL YA EXISTE - Deteniendo envío del formulario');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Mostrar mensaje de error al usuario
            if (emailInput) {
                mostrarErrorEmail(emailInput, 'Este email ya está registrado como conector. Por favor, usa otro email o contacta con soporte si ya tienes cuenta.');
            } else {
                alert('Este email ya está registrado como conector. Por favor, usa otro email.');
            }
            
            return; // NO continuar con el envío - BLOQUEAR completamente
        }

        // Si el email NO existe (emailExiste === false), remover cualquier error previo y continuar con el envío
        console.log('✅ EMAIL NO EXISTE - Continuando con envío del formulario');
        if (emailInput) {
            removerErrorEmail(emailInput);
        }
        submitBtn.innerHTML = '<span class="material-icons animate-spin">sync</span> Enviando...';

        // Obtener parámetro tag de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag') || 'NA';

        // Generar ID único para este formulario
        function generarIdUnico() {
            // Usar crypto.randomUUID() si está disponible, sino generar uno manualmente
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            // Generar UUID v4 manualmente
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        const formIdUnico = generarIdUnico();
        
        // Generar códigos únicos para el conector
        const userCode = generarUserCode();
        const referralCode = generarReferralCode();
        
        console.log('Códigos generados:');
        console.log('- User Code:', userCode);
        console.log('- Referral Code:', referralCode);
        console.log('- Form ID:', formIdUnico);

        // Obtener código de país y teléfono
        const codigoPais = document.getElementById('codigo_pais')?.value || '+34';
        const telefonoRaw = document.getElementById('telefono').value;
        
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

        // Recoger datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: telefonoCompleto, // Número completo con código de país (ej: +34612345678)
            provincia: document.getElementById('provincia').value,
            tiene_contacto: document.getElementById('tiene_contacto').value,
            autonomo_empresa: document.getElementById('autonomo_empresa').value,
            privacidad: document.getElementById('privacidad').checked,
            newsletter: document.getElementById('newsletter').checked,
            tag: tag,
            perfil: 'Conector', // Perfil fijo para este landing page
            form_id: formIdUnico, // ID único del formulario
            user_code: userCode, // Código único del usuario (para Supabase y HubSpot)
            referral_code: referralCode, // Código único de referido (para Supabase y HubSpot)
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            page_title: document.title,
            // Honeypot fields (para filtrado en n8n)
            hp_website: document.getElementById('hp_website')?.value || '',
            hp_confirm_email: document.getElementById('hp_confirm_email')?.value || ''
        };

        try {
            console.log('Preparando envío a n8n...', formData);

            const webhookUrl = CONFIG.n8n?.webhookForm || 'https://n8n.empiezadecero.cat/webhook/75123388-942d-4d53-be3a-b34a445d6d73';
            console.log('Enviando formulario a webhook:', webhookUrl);
            
            const response = await fetch(
                webhookUrl,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            console.log('Respuesta de n8n:', response.status, response.statusText);

            // Aceptar cualquier respuesta exitosa (200-299) o incluso sin respuesta
            if (response.ok || response.status === 0) {
                // Éxito - Redirigir a página de Calendly con el ID único
                console.log('Webhook enviado exitosamente, redirigiendo...');
                if (typeof redirigirACalendly === 'function') {
                    redirigirACalendly(formIdUnico);
                } else {
                    console.error('Función redirigirACalendly no está disponible');
                    alert('Formulario enviado exitosamente, pero hubo un error al redirigir.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } else {
                // Intentar leer el cuerpo de la respuesta para más detalles
                let errorText = '';
                try {
                    errorText = await response.text();
                    console.error('Cuerpo de respuesta de error:', errorText);
                } catch (e) {
                    console.error('No se pudo leer el cuerpo de la respuesta');
                }
                throw new Error(`Error en el envío: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error detallado al enviar webhook:', error);
            console.error('Tipo de error:', error.name);
            console.error('Mensaje de error:', error.message);

            // Si el error es de red pero los datos se enviaron, redirigir de todos modos
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
                console.log('Error de red/CORS detectado. Intentando redirigir de todos modos...');
                if (typeof redirigirACalendly === 'function') {
                    redirigirACalendly(formIdUnico);
                } else {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    alert('Hubo un problema de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
                }
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                alert('Hubo un error al enviar: ' + error.message + '. Por favor, inténtalo de nuevo.');
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initWebhookForm);