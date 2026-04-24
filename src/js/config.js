/* ============================================
   CONFIGURACIÓN - EDITA AQUÍ TUS VARIABLES
   ============================================ */

const CONFIG = {
    // Hello Bar
    helloBar: {
        mensaje: "Únete ahora y gana 300€ por cada referido. Programa limitado por zonas.",
        mostrar: true,
        enlace: "#registro",
        textoBoton: "Más info"
    },
    
    // Video de Vimeo
    vimeoVideoId: "VIDEO_ID",
    
    // ============================================
    // HUBSPOT - CONFIGURACIÓN DEL FORMULARIO
    // ============================================
    hubspot: {
        enabled: true,                    // true para activar, false para desactivar
        portalId: "TU_PORTAL_ID",         // ← CAMBIAR: Tu Portal ID (número)
        formGuid: "TU_FORM_GUID",         // ← CAMBIAR: Tu Form GUID
        region: "eu1"                     // eu1 para Europa, na1 para USA
    },
    
    // Animaciones AOS
    aos: {
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 0
    },
    
    // ============================================
    // SUPABASE - CONFIGURACIÓN DE BASE DE DATOS
    // ============================================
    supabase: {
        enabled: true,                    // true para activar, false para desactivar
        url: "http://supabasekong-wo8ws00kcscw880k44gwc0go.5.189.140.120.sslip.io",           // URL interna de Supabase (Kong)
        anonKey: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2Njc2OTQ4MCwiZXhwIjo0OTIyNDQzMDgwLCJyb2xlIjoiYW5vbiJ9.RmRHum6IRnIsdmHn4veDmAw2zngZR07onJpUO4sIRBw"   // Clave anónima pública de Supabase
    },
    
    // Correo sintético (formulario interno sin email del cliente): dominio y prefijo del local-part
    syntheticEmailDomain: 'sintetico.empiezadecero.cat',
    syntheticEmailLocalPrefix: 'w',

    // ============================================
    // N8N - WEBHOOKS
    // ============================================
    n8n: {
        webhookForm: "https://n8n.empiezadecero.cat/webhook/75123388-942d-4d53-be3a-b34a445d6d73",  // Webhook para formulario (también usado para verificación de email)
        webhookGetUser: "https://n8n.empiezadecero.cat/webhook/14e3ea06-6d70-491b-be82-d4f4ea1555fa",  // Webhook para consultar usuario por email (GET) - PRODUCCIÓN - Generador de enlaces v2
        webhookValidateUserCode: "https://n8n.empiezadecero.cat/webhook/c4e25823-be5b-4f0a-b139-a22a3194a701",  // Webhook para validar user_code en formulario de activación (GET)
        // Seguimiento de enlaces: crea el webhook en n8n y pega aquí la URL
        webhookLogLinkGeneration: "https://n8n.empiezadecero.cat/webhook/7e9ec4a4-421d-47d8-a9eb-4a5af88c8123",  // POST: registra en link_generations cuando se genera un enlace - PRODUCCIÓN
        webhookLogLinkOpen: "https://n8n.empiezadecero.cat/webhook-test/7e9ec4a4-421d-47d8-a9eb-4a5af88c8123",  // POST: registra cuándo alguien abre activacion.html (enlaces compartidos) - TEST
        webhookGetLinkGenerationCount: "https://n8n.empiezadecero.cat/webhook/9543c53c-ba51-4eb7-9227-63a2a4527a5c",  // GET ?user_code=XXX - cantidad_registros
        webhookActivacionPaso1: "https://n8n.empiezadecero.cat/webhook/594a5ce9-4be9-446b-a8a9-9d44ba773ac3",  // POST: paso 1 portal de activación - PRODUCCIÓN
        webhookPasoIntermedioTest: "https://n8n.empiezadecero.cat/webhook-test/9d2c62c9-6e62-4e2c-b16e-9bccee4bc0b9",  // POST: decisión del paso intermedio (NEP) - TEST
        webhookPasoIntermedio: "https://n8n.empiezadecero.cat/webhook/9d2c62c9-6e62-4e2c-b16e-9bccee4bc0b9",           // POST: decisión del paso intermedio (NEP) - PRODUCCIÓN
        webhookEncuestaPaso3: "https://n8n.empiezadecero.cat/webhook-test/472c31ed-8721-4286-870d-4fa4a6ae037c",      // POST: encuesta final paso 3 - TEST
        webhookRegistrationProcess: "https://n8n.empiezadecero.cat/webhook/fe8cdd3a-6122-480a-a3ae-8085206d6639"      // POST: upsert en registration_processes
    }
};

// Verificación de carga (para debugging)
if (typeof CONFIG !== 'undefined' && CONFIG.n8n) {
    console.log('✅ CONFIG cargado correctamente');
    console.log('✅ webhookGetUser:', CONFIG.n8n.webhookGetUser);
} else {
    console.error('❌ CONFIG no se cargó correctamente');
}


// Crea cuenta gratis: hubspot.com/products/crm
// Crea formulario: Marketing → Formularios → Crear formulario
// Campos necesarios: Nombre, Email, Teléfono, Estado/Provincia
// Obtén los IDs:
// Portal ID: En la URL app.hubspot.com/contacts/**12345678**/...
// Form GUID: Formulario → Acciones → Compartir → Ver GUID
