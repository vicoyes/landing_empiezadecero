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
    
    // ============================================
    // N8N - WEBHOOKS
    // ============================================
    n8n: {
        webhookForm: "https://n8n.empiezadecero.cat/webhook/75123388-942d-4d53-be3a-b34a445d6d73",  // Webhook para formulario (también usado para verificación de email)
        webhookGetUser: "https://n8n.empiezadecero.cat/webhook/14e3ea06-6d70-491b-be82-d4f4ea1555fa",  // Webhook para consultar usuario por email (GET) - PRODUCCIÓN - Generador de enlaces v2
        webhookValidateUserCode: "https://n8n.empiezadecero.cat/webhook/c4e25823-be5b-4f0a-b139-a22a3194a701"  // Webhook para validar user_code en formulario de activación (GET)
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