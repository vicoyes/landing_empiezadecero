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
    }
};


// Crea cuenta gratis: hubspot.com/products/crm
// Crea formulario: Marketing → Formularios → Crear formulario
// Campos necesarios: Nombre, Email, Teléfono, Estado/Provincia
// Obtén los IDs:
// Portal ID: En la URL app.hubspot.com/contacts/**12345678**/...
// Form GUID: Formulario → Acciones → Compartir → Ver GUID