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
// WEBHOOK FORM SUBMISSION (n8n)
// ============================================
function initWebhookForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-icons animate-spin">sync</span> Enviando...';

        // Recoger datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: Number(document.getElementById('telefono').value.replace(/\D/g, '')), // Elimina espacios/símbolos y convierte a número
            provincia: document.getElementById('provincia').value,
            tiene_contacto: document.getElementById('tiene_contacto').value,
            autonomo_empresa: document.getElementById('autonomo_empresa').value,
            privacidad: document.getElementById('privacidad').checked,
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            page_title: document.title,
            // Honeypot fields (para filtrado en n8n)
            hp_website: document.getElementById('hp_website')?.value || '',
            hp_confirm_email: document.getElementById('hp_confirm_email')?.value || ''
        };

        try {
            console.log('Enviando datos a n8n (Test Mode)...', formData);

            const response = await fetch(
                'https://n8n.empiezadecero.cat/webhook/75123388-942d-4d53-be3a-b34a445d6d73',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            // Aceptar cualquier respuesta exitosa (200-299) o incluso sin respuesta
            if (response.ok || response.status === 0) {
                // Éxito - Pasar al Paso 2 (Calendly)
                if (typeof mostrarPaso2 === 'function') {
                    mostrarPaso2();
                }
                console.log('Formulario enviado exitosamente:', formData);
            } else {
                console.error('Respuesta del servidor:', response.status, response.statusText);
                throw new Error('Error en el envío: ' + response.status);
            }
        } catch (error) {
            console.error('Error detallado:', error);

            // Si el error es de red pero los datos se enviaron, mostrar paso 2 de todos modos
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                console.log('Posible error de CORS, pero datos enviados. Mostrando paso 2.');
                if (typeof mostrarPaso2 === 'function') {
                    mostrarPaso2();
                }
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                alert('Hubo un error al enviar. Por favor, inténtalo de nuevo.');
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initWebhookForm);