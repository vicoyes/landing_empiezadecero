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
document.addEventListener('DOMContentLoaded', function() {
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
// HUBSPOT FORM SUBMISSION
// ============================================
function initHubSpotForm() {
    const form = document.getElementById('contactForm');
    if (!form || !CONFIG.hubspot.enabled) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-icons animate-spin">sync</span> Enviando...';
        
        // Recoger datos del formulario
        const formData = {
            fields: [
                { name: "firstname", value: document.getElementById('nombre').value },
                { name: "email", value: document.getElementById('email').value },
                { name: "phone", value: document.getElementById('telefono').value },
                { name: "state", value: document.getElementById('provincia').value }
            ],
            context: {
                pageUri: window.location.href,
                pageName: document.title
            },
            legalConsentOptions: {
                consent: {
                    consentToProcess: true,
                    text: "Acepto la política de privacidad",
                    communications: [
                        {
                            value: document.getElementById('newsletter').checked,
                            subscriptionTypeId: 999,
                            text: "Acepto recibir comunicaciones"
                        }
                    ]
                }
            }
        };
        
        try {
            const response = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${CONFIG.hubspot.portalId}/${CONFIG.hubspot.formGuid}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );
            
            if (response.ok) {
                // Éxito
                form.innerHTML = `
                    <div class="text-center py-12">
                        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="material-icons text-green-500 text-4xl">check_circle</span>
                        </div>
                        <h3 class="text-2xl font-bold text-primary mb-4">¡Gracias por tu interés!</h3>
                        <p class="text-gray-600">Nos pondremos en contacto contigo muy pronto.</p>
                    </div>
                `;
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            alert('Hubo un error al enviar. Por favor, inténtalo de nuevo.');
        }
    });
}

// Añadir al DOMContentLoaded existente o llamar directamente
document.addEventListener('DOMContentLoaded', initHubSpotForm);