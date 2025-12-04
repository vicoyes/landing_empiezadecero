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
            
            bar.classList.remove('hidden');
            document.body.style.paddingTop = bar.offsetHeight + 'px';
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
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar Hello Bar
    iniciarHelloBar();
    
    // Iniciar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init(CONFIG.aos);
    }
    
    // Iniciar animación del timeline
    animateTimeline();
});

// Event Listeners
window.addEventListener('scroll', animateTimeline);
window.addEventListener('load', animateTimeline);
