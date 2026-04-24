/**
 * Script para gestionar el formulario de activación
 * Formulario de Segunda Oportunidad para conectores legales
 */

const MUNICIPIOS_ES = {
  'Álava': ['Vitoria-Gasteiz','Llodio','Amurrio','Laudio','Salvatierra-Agurain'],
  'Albacete': ['Albacete','Hellín','Almansa','Villarrobledo','La Roda','Caudete','Tobarra'],
  'Alicante': ['Alicante','Elche','Torrevieja','Orihuela','Benidorm','Alcoy','Villena','Elda','Petrer','Dénia','Calpe','Santa Pola','Guardamar del Segura'],
  'Almería': ['Almería','Roquetas de Mar','El Ejido','Vícar','Adra','Vera','Berja','Huércal-Overa','Carboneras'],
  'Asturias': ['Oviedo','Gijón','Avilés','Siero','Langreo','Mieres','Castrillón','Carreño','Cangas del Narcea','Grado'],
  'Ávila': ['Ávila','Arenas de San Pedro','Arévalo','Sotillo de la Adrada','Las Navas del Marqués'],
  'Badajoz': ['Badajoz','Mérida','Don Benito','Villanueva de la Serena','Almendralejo','Zafra','Plasencia'],
  'Illes Balears': ['Palma','Calvià','Manacor','Llucmajor','Marratxí','Inca','Ibiza','Maó','Ciutadella de Menorca'],
  'Barcelona': ['Barcelona','Badalona','Hospitalet de Llobregat','Terrassa','Sabadell','Mataró','Santa Coloma de Gramenet','Cornellà de Llobregat','Rubí','Manresa','Vilanova i la Geltrú','Viladecans','Granollers','Cerdanyola del Vallès','Gavà','Castelldefels','Sant Cugat del Vallès','Mollet del Vallès','Igualada','El Prat de Llobregat','Martorell','Vic'],
  'Burgos': ['Burgos','Miranda de Ebro','Aranda de Duero','Briviesca','Medina de Pomar'],
  'Cáceres': ['Cáceres','Plasencia','Trujillo','Navalmoral de la Mata','Moraleja'],
  'Cádiz': ['Cádiz','Jerez de la Frontera','Algeciras','La Línea de la Concepción','San Fernando','El Puerto de Santa María','Chiclana de la Frontera','Sanlúcar de Barrameda','Rota','Barbate','Los Barrios'],
  'Cantabria': ['Santander','Torrelavega','Castro-Urdiales','Camargo','El Astillero','Piélagos','Santoña','Laredo'],
  'Castellón': ['Castellón de la Plana','Vila-real','Burriana','Benicàssim','Peñíscola','Vinaròs','Onda','Almassora','Nules'],
  'Ceuta': ['Ceuta'],
  'Ciudad Real': ['Ciudad Real','Puertollano','Valdepeñas','Alcázar de San Juan','Manzanares','Tomelloso','Miguelturra','Daimiel'],
  'Córdoba': ['Córdoba','Lucena','Montilla','Puente Genil','Cabra','Priego de Córdoba','Pozoblanco','Palma del Río'],
  'La Coruña': ['La Coruña','Santiago de Compostela','Ferrol','Narón','Oleiros','Arteixo','Culleredo','Carballo','Cambre'],
  'Cuenca': ['Cuenca','Tarancón','Motilla del Palancar','Quintanar del Rey'],
  'Girona': ['Girona','Figueres','Blanes','Salt','Lloret de Mar','Roses','Olot','Platja d\'Aro','Palamós','Palafrugell'],
  'Granada': ['Granada','Motril','Armilla','Almuñécar','Maracena','Loja','Guadix','Baza','Las Gabias'],
  'Guadalajara': ['Guadalajara','Azuqueca de Henares','Alovera','Cabanillas del Campo','Marchamalo'],
  'Gipuzkoa': ['San Sebastián','Irún','Eibar','Errenteria','Zarautz','Arrasate-Mondragón','Tolosa','Hernani'],
  'Huelva': ['Huelva','Lepe','Almonte','Moguer','Ayamonte','Isla Cristina','Bollullos Par del Condado'],
  'Huesca': ['Huesca','Jaca','Barbastro','Monzón','Fraga','Sabiñánigo'],
  'Jaén': ['Jaén','Linares','Úbeda','Baeza','Andújar','Martos','Alcalá la Real','Bailén'],
  'La Rioja': ['Logroño','Calahorra','Arnedo','Alfaro','Haro','Nájera'],
  'Las Palmas': ['Las Palmas de Gran Canaria','Telde','Santa Lucía de Tirajana','San Bartolomé de Tirajana','Arrecife','Puerto del Rosario','La Oliva','Arucas'],
  'León': ['León','Ponferrada','San Andrés del Rabanedo','Villaquilambre','Astorga','La Bañeza'],
  'Lleida': ['Lleida','Mollerussa','Tàrrega','La Seu d\'Urgell','Balaguer','Cervera'],
  'Lugo': ['Lugo','Monforte de Lemos','Viveiro','Vilalba','Sarria','Burela'],
  'Madrid': ['Madrid','Móstoles','Alcalá de Henares','Fuenlabrada','Leganés','Getafe','Alcorcón','Torrejón de Ardoz','Parla','Alcobendas','Las Rozas de Madrid','Pozuelo de Alarcón','Rivas-Vaciamadrid','Valdemoro','Collado Villalba','Coslada','Arganda del Rey','San Sebastián de los Reyes','Majadahonda','Boadilla del Monte','Pinto','Tres Cantos'],
  'Málaga': ['Málaga','Marbella','Vélez-Málaga','Mijas','Fuengirola','Torremolinos','Benalmádena','Estepona','Ronda','Antequera','Nerja','Coín'],
  'Melilla': ['Melilla'],
  'Murcia': ['Murcia','Cartagena','Lorca','Molina de Segura','Alcantarilla','Mazarrón','San Javier','Torre-Pacheco','Yecla','Cieza','Águilas'],
  'Navarra': ['Pamplona','Tudela','Barañáin','Burlada','Estella-Lizarra','Tafalla','Zizur Mayor','Noáin'],
  'Ourense': ['Ourense','Xinzo de Limia','O Barco de Valdeorras','Verín','O Carballiño'],
  'Palencia': ['Palencia','Aguilar de Campoo','Guardo','Venta de Baños'],
  'Pontevedra': ['Vigo','Pontevedra','Vilagarcía de Arousa','Redondela','Moaña','Cangas','Marín','O Porriño','Sanxenxo'],
  'Salamanca': ['Salamanca','Béjar','Ciudad Rodrigo','Santa Marta de Tormes','Carbajosa de la Sagrada'],
  'Santa Cruz de Tenerife': ['Santa Cruz de Tenerife','San Cristóbal de La Laguna','Arona','Adeje','Granadilla de Abona','Puerto de la Cruz','Los Llanos de Aridane','San Miguel de Abona'],
  'Segovia': ['Segovia','Cuéllar','El Espinar','Palazuelos de Eresma','La Granja de San Ildefonso'],
  'Sevilla': ['Sevilla','Dos Hermanas','Alcalá de Guadaíra','Utrera','Camas','Mairena del Aljarafe','La Rinconada','Écija','Morón de la Frontera','Tomares','Bormujos'],
  'Soria': ['Soria','El Burgo de Osma-Ciudad de Osma','Almazán'],
  'Tarragona': ['Tarragona','Reus','Salou','Torredembarra','Cambrils','Vila-seca','Tortosa','Valls','Calafell'],
  'Teruel': ['Teruel','Alcañiz','Andorra','Utrillas'],
  'Toledo': ['Toledo','Talavera de la Reina','Illescas','Seseña','Fuensalida','Madridejos','Sonseca'],
  'Valencia': ['Valencia','Torrent','Gandía','Paterna','Sagunto','Alzira','Burjassot','Mislata','Xirivella','Manises','Ontinyent','Sueca','Catarroja','Quart de Poblet','Paiporta'],
  'Valladolid': ['Valladolid','Laguna de Duero','Arroyo de la Encomienda','Medina del Campo','Tordesillas'],
  'Bizkaia': ['Bilbao','Barakaldo','Getxo','Basauri','Leioa','Portugalete','Sestao','Santurtzi','Durango','Ermua'],
  'Zamora': ['Zamora','Benavente','Toro','Puebla de Sanabria'],
  'Zaragoza': ['Zaragoza','Calatayud','Utebo','Cuarte de Huerva','Ejea de los Caballeros','Tarazona','Borja']
};

const PROVINCIAS_IDS = {
  'Almería': '1',
  'Cádiz': '2',
  'Córdoba': '3',
  'Granada': '4',
  'Huelva': '5',
  'Jaén': '6',
  'Málaga': '7',
  'Sevilla': '8',
  'Huesca': '9',
  'Teruel': '10',
  'Zaragoza': '11',
  'Asturias': '12',
  'Illes Balears': '13',
  'Las Palmas': '14',
  'Santa Cruz de Tenerife': '15',
  'Cantabria': '16',
  'Ávila': '17',
  'Burgos': '18',
  'León': '19',
  'Palencia': '20',
  'Salamanca': '21',
  'Segovia': '22',
  'Soria': '23',
  'Valladolid': '24',
  'Zamora': '25',
  'Albacete': '26',
  'Ciudad Real': '27',
  'Cuenca': '28',
  'Guadalajara': '29',
  'Toledo': '30',
  'Barcelona': '31',
  'Girona': '32',
  'Lleida': '33',
  'Tarragona': '34',
  'Alicante': '35',
  'Castellón': '36',
  'Valencia': '37',
  'Badajoz': '38',
  'Cáceres': '39',
  'La Coruña': '40',
  'Lugo': '41',
  'Ourense': '42',
  'Pontevedra': '43',
  'Madrid': '44',
  'Murcia': '45',
  'Navarra': '46',
  'Álava': '47',
  'Bizkaia': '48',
  'Gipuzkoa': '49',
  'La Rioja': '50',
  'Ceuta': '51',
  'Melilla': '52'
};

// Variables globales para almacenar parámetros de URL
let asesorJuridico = '';
let tipoConector = '';
let nombreConector = '';
let userCode = '';
let idProcesoRegistro = '';
let usuarioValidado = null; // Usuario validado desde la BD

function getPasoStorageKey(stepName, processId) {
  return 'edc_' + stepName + '_' + processId;
}

function marcarPasoCompletado(stepName, processId) {
  if (!processId) return;
  try {
    sessionStorage.setItem(getPasoStorageKey(stepName, processId), 'true');
  } catch (error) {
    console.warn('No se pudo guardar el estado del paso en sessionStorage:', error);
  }
}

function generarIdProcesoRegistro() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Inicializar el script cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', async function() {
  // Inicializar AOS (animaciones)
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true
  });

  // Validar user_code ANTES de continuar (si existe en la URL)
  const esValido = await validarUserCode();
  if (!esValido) {
    return; // Detener si la validación falla
  }

  // Obtener parámetros de URL (incluyendo user_code para enviarlo en el webhook)
  obtenerAsesorDesdeURL();

  // Seguimiento: registrar que se abrió este enlace (fire-and-forget)
  registrarAperturaEnlace();

  // Configurar el formulario
  configurarFormulario();
});

/**
 * Validar usuario por user_code
 * Si no hay user_code en la URL, muestra error directamente
 * @returns {Promise<boolean>} true si es válido, false si no
 */
async function validarUserCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const userCodeParam = urlParams.get('user_code');
  
  // Si no hay user_code, mostrar error directamente
  if (!userCodeParam || !userCodeParam.trim()) {
    console.error('❌ No hay user_code en la URL');
    mostrarErrorValidacion(
      'URL No Válida',
      'El enlace no contiene el código del conector (user_code). Por favor, verifica que estés usando el enlace correcto proporcionado por tu conector.'
    );
    return false;
  }
  
  // Validar por user_code
  return await validarPorUserCode(userCodeParam);
}

/**
 * Validar usuario por user_code
 * @param {string} userCodeParam - Código del usuario a validar
 * @returns {Promise<boolean>} true si es válido, false si no
 */
async function validarPorUserCode(userCodeParam) {
  // Verificar que el webhook esté configurado
  if (!CONFIG || !CONFIG.n8n || !CONFIG.n8n.webhookValidateUserCode) {
    console.warn('Webhook de validación por user_code no configurado, continuando sin validación');
    return true;
  }
  
  try {
    console.log('Validando por user_code:', userCodeParam);
    
    const response = await fetch(
      `${CONFIG.n8n.webhookValidateUserCode}?user_code=${encodeURIComponent(userCodeParam)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error en la validación: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta de validación por user_code:', responseData);
    
    const usuario = procesarRespuestaUsuario(responseData);
    
    // Guardar usuario validado y actualizar variables globales
    actualizarVariablesUsuario(usuario);
    
    console.log('✅ Validación por user_code exitosa:', usuario);
    return true;
    
  } catch (error) {
    console.error('❌ Error en validación por user_code:', error);
    
    // Mensaje amigable según el tipo de error
    let mensaje = 'El código del conector no es válido o no existe en la base de datos.';
    let titulo = 'URL No Válida';
    
    if (error.message === 'USUARIO_NO_ENCONTRADO') {
      titulo = 'Usuario No Encontrado';
      mensaje = 'El código del conector no existe en nuestra base de datos. Esto puede ocurrir si el enlace es antiguo o ha sido modificado.';
    }
    
    mostrarErrorValidacion(titulo, mensaje);
    return false;
  }
}

/**
 * Procesar respuesta del webhook (array o objeto)
 * Detecta respuestas vacías: [], [{}], o objetos sin propiedades válidas
 * @param {Object|Array} responseData - Respuesta del webhook
 * @returns {Object} Objeto usuario procesado
 * @throws {Error} Si el usuario no existe o los datos son inválidos
 */
function procesarRespuestaUsuario(responseData) {
  let usuario;
  
  if (Array.isArray(responseData)) {
    // Array vacío: []
    if (responseData.length === 0) {
      throw new Error('USUARIO_NO_ENCONTRADO');
    }
    
    // Array con objeto vacío: [{}]
    usuario = responseData[0];
    if (!usuario || Object.keys(usuario).length === 0) {
      throw new Error('USUARIO_NO_ENCONTRADO');
    }
  } else if (responseData.error) {
    throw new Error(responseData.message || responseData.error);
  } else {
    usuario = responseData;
  }
  
  // Verificar que el usuario existe y tiene user_code
  // Si el objeto está vacío o no tiene user_code, no existe en la BD
  if (!usuario || Object.keys(usuario).length === 0 || !usuario.user_code) {
    throw new Error('USUARIO_NO_ENCONTRADO');
  }
  
  return usuario;
}

/**
 * Actualizar variables globales con datos del usuario validado
 * @param {Object} usuario - Datos del usuario validado
 */
function actualizarVariablesUsuario(usuario) {
  // Guardar usuario validado
  usuarioValidado = usuario;
  userCode = usuario.user_code;
  
  // Actualizar variables globales con datos reales de la BD
  if (usuario.perfil) {
    tipoConector = usuario.perfil;
  } else if (usuario.type) {
    tipoConector = usuario.type;
  }
  
  if (usuario.nombre) {
    nombreConector = usuario.nombre;
  } else if (usuario.name) {
    nombreConector = usuario.name;
  }
}

/**
 * Mostrar error de validación
 * @param {string} titulo - Título del error (opcional, por defecto "URL No Válida")
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorValidacion(titulo = 'URL No Válida', mensaje = 'El enlace proporcionado no es válido.') {
  // Si solo se pasa un parámetro, asumir que es el mensaje (compatibilidad hacia atrás)
  if (arguments.length === 1) {
    mensaje = titulo;
    titulo = 'URL No Válida';
  }
  
  // Ocultar formulario
  const form = document.getElementById('activacionForm');
  const formContainer = form?.closest('.bg-white');
  const sectionContainer = document.querySelector('.max-w-3xl');
  
  if (sectionContainer) {
    sectionContainer.innerHTML = `
      <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-red-500 text-4xl">error</span>
        </div>
        <h3 class="text-2xl font-bold text-red-800 mb-4">${titulo}</h3>
        <p class="text-gray-700 mb-4 text-lg">${mensaje}</p>
        <p class="text-sm text-gray-600 mb-6">Por favor, verifica que estés usando el enlace correcto proporcionado por la persona que te compartió este formulario.</p>
        <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <p class="text-sm text-gray-700 mb-3 leading-relaxed">
            👉 Puedes contactar al conector que te facilitó el enlace o escribirnos directamente a nuestra empresa por WhatsApp:
          </p>
          <a href="https://wa.me/34685555362" target="_blank" 
             class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>📲 +34 685 55 53 62</span>
          </a>
        </div>
        <a href="index.html" 
           class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors mt-4 shadow-lg">
          <span class="material-icons">home</span>
          Volver al Inicio
        </a>
      </div>
    `;
  } else {
    alert(`${titulo}\n\n${mensaje}\n\n👉 Puedes contactar al conector que te facilitó el enlace o escribirnos directamente a nuestra empresa por WhatsApp:\n\n📲 +34 685 55 53 62`);
    window.location.href = 'index.html';
  }
}

/**
 * Registrar en el backend que se abrió un enlace de activación (seguimiento).
 * Envía POST al webhook si está configurado. No bloquea la UI.
 */
function registrarAperturaEnlace() {
  const url = typeof CONFIG !== 'undefined' && CONFIG.n8n && CONFIG.n8n.webhookLogLinkOpen
    ? CONFIG.n8n.webhookLogLinkOpen
    : '';
  if (!url || !userCode) return;

  const payload = {
    event: 'link_opened',
    user_code: userCode,
    page_url: window.location.href || '',
    opened_at: new Date().toISOString()
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(function (err) {
    console.warn('Seguimiento (apertura enlace):', err);
  });
}

/**
 * Obtener el nombre del asesor jurídico desde los parámetros de URL
 */
function obtenerAsesorDesdeURL() {
  const urlParams = new URLSearchParams(window.location.search);
  asesorJuridico = urlParams.get('asesor') || '';
  idProcesoRegistro = urlParams.get('id_proceso_registro') || generarIdProcesoRegistro();
  
  // Si ya validamos el usuario, usar los datos de la BD
  // Si no, usar los parámetros de la URL (incluyendo user_code y email)
  if (!usuarioValidado) {
    tipoConector = urlParams.get('type') || '';
    nombreConector = urlParams.get('name') || '';
    userCode = urlParams.get('user_code') || ''; // IMPORTANTE: Se envía en el webhook aunque la validación esté desactivada
    // Nota: El email también puede venir en la URL pero no se usa aquí, solo se envía user_code
  }
  
  // Actualizar badge en el hero con nombre del asesor en negrita
  const asesorBadge = document.getElementById('asesorBadge');
  if (asesorJuridico && asesorBadge) {
    asesorBadge.innerHTML = `Área de Asesoramiento Jurídico de <strong>${asesorJuridico}</strong>`;
  }
  
  // Actualizar badge antes del formulario
  const asesorFormBadge = document.getElementById('asesorFormBadge');
  const asesorFormBadgeContainer = document.getElementById('asesorFormBadgeContainer');
  
  if (asesorJuridico && asesorFormBadge && asesorFormBadgeContainer) {
    // Mostrar información completa si hay parámetros adicionales
    let mensaje = `Estás en el área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>`;
    
    if (nombreConector) {
      mensaje += `<br><span class="text-sm text-gray-600">Conector: <strong>${nombreConector}</strong></span>`;
    }
    
    if (tipoConector) {
      mensaje += `<span class="text-sm text-gray-600"> (${tipoConector})</span>`;
    }
    
    asesorFormBadge.innerHTML = mensaje;
    asesorFormBadgeContainer.classList.remove('hidden');
  } else {
    // Si no hay asesor en URL, mostrar campo para ingresarlo y aviso
    mostrarAvisoSinAsesor();
  }
}

/**
 * Mostrar aviso y campo de entrada cuando no hay asesor en la URL
 */
function mostrarAvisoSinAsesor() {
  const asesorInputContainer = document.getElementById('asesorInputContainer');
  const asesorInput = document.getElementById('asesor_input');
  const asesorFormBadgeContainer = document.getElementById('asesorFormBadgeContainer');
  const asesorFormBadge = document.getElementById('asesorFormBadge');
  
  // Mostrar campo de entrada
  if (asesorInputContainer && asesorInput) {
    asesorInputContainer.classList.remove('hidden');
    asesorInput.required = true;
  }
  
  // Mostrar aviso en el badge
  if (asesorFormBadgeContainer && asesorFormBadge) {
    asesorFormBadge.innerHTML = '⚠️ No se ha especificado un asesor jurídico. <strong class="text-primary">Por favor ingresa tu nombre en el formulario</strong>';
    asesorFormBadgeContainer.classList.remove('hidden');
    asesorFormBadgeContainer.classList.remove('bg-primary/10', 'border-primary/30');
    asesorFormBadgeContainer.classList.add('bg-yellow-50', 'border-yellow-400');
  }
}

/**
 * Inicializa Tom Select en los campos provincia y ciudad.
 * Al elegir provincia se filtran los municipios correspondientes.
 */
function configurarDireccion() {
  const selProv = document.getElementById('dir_provincia');
  const selCiudad = document.getElementById('dir_ciudad');
  if (!selProv || !selCiudad || typeof TomSelect === 'undefined') return;

  // Poblar opciones de provincia ordenadas
  Object.keys(MUNICIPIOS_ES).sort(function(a, b) {
    return a.localeCompare(b, 'es');
  }).forEach(function(prov) {
    const opt = document.createElement('option');
    opt.value = PROVINCIAS_IDS[prov] || prov;
    opt.textContent = prov;
    opt.dataset.nombre = prov;
    selProv.appendChild(opt);
  });

  const tsProv = new TomSelect('#dir_provincia', {
    placeholder: 'Busca una provincia…',
    allowEmptyOption: true,
    sortField: { field: 'text', direction: 'asc' },
  });

  const tsCiudad = new TomSelect('#dir_ciudad', {
    placeholder: 'Elige primero una provincia…',
    allowEmptyOption: true,
    create: false,
  });
  tsCiudad.disable();

  tsProv.on('change', function(provId) {
    tsCiudad.clear(true);
    tsCiudad.clearOptions();
    tsCiudad.addOption({ value: '', text: 'Selecciona una ciudad…' });

    const selectedProv = selProv.options[selProv.selectedIndex];
    const provNombre = selectedProv?.dataset.nombre || selectedProv?.textContent || '';

    if (provId && MUNICIPIOS_ES[provNombre]) {
      MUNICIPIOS_ES[provNombre].slice().sort(function(a, b) {
        return a.localeCompare(b, 'es');
      }).forEach(function(ciudad) {
        tsCiudad.addOption({ value: ciudad, text: ciudad });
      });
      tsCiudad.enable();
      tsCiudad.settings.placeholder = 'Busca una ciudad o municipio…';
      document.getElementById('dir_ciudad_hint') && document.getElementById('dir_ciudad_hint').classList.add('hidden');
    } else {
      tsCiudad.disable();
      tsCiudad.settings.placeholder = 'Elige primero una provincia…';
      document.getElementById('dir_ciudad_hint') && document.getElementById('dir_ciudad_hint').classList.remove('hidden');
    }
    tsCiudad.setValue('', true);
    tsCiudad.refreshOptions(false);
  });
}

/**
 * Configurar el formulario de activación
 */
function configurarFormulario() {
  const form = document.getElementById('activacionForm');
  if (!form) return;

  configurarDireccion();

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validar ciudad manualmente (puede estar deshabilitada y escapar la validación HTML5)
    const ciudadVal = (document.getElementById('dir_ciudad')?.value || '').trim();
    if (!ciudadVal) {
      alert('Por favor selecciona una ciudad o municipio para continuar.');
      return;
    }

    // Mostrar ventana de confirmación antes de enviar
    const confirmado = await mostrarConfirmacion();
    if (confirmado) {
      await enviarFormulario(form);
    }
  });
}

/**
 * Mostrar modal de confirmación personalizado
 * @returns {Promise<boolean>} Promesa que resuelve true si confirma, false si cancela
 */
function mostrarConfirmacion() {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const message = document.getElementById('confirmMessage');
    const cancelBtn = document.getElementById('confirmCancel');
    const acceptBtn = document.getElementById('confirmAccept');
    
    const asesorMensaje = asesorJuridico 
      ? `al área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>` 
      : 'a nuestro equipo legal';
    
    message.innerHTML = `¿Confirmas que deseas enviar este contacto ${asesorMensaje}?<br><br>Se enviará la información del cliente para que sea procesada.`;
    
    // Mostrar modal
    modal.classList.remove('hidden');
    
    // Handlers
    const handleCancel = () => {
      modal.classList.add('hidden');
      cancelBtn.removeEventListener('click', handleCancel);
      acceptBtn.removeEventListener('click', handleAccept);
      resolve(false);
    };
    
    const handleAccept = () => {
      modal.classList.add('hidden');
      cancelBtn.removeEventListener('click', handleCancel);
      acceptBtn.removeEventListener('click', handleAccept);
      resolve(true);
    };
    
    cancelBtn.addEventListener('click', handleCancel);
    acceptBtn.addEventListener('click', handleAccept);
    
    // Cerrar con ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

/**
 * Enviar datos del formulario al webhook de n8n
 * @param {HTMLFormElement} form - Formulario a enviar
 */
async function enviarFormulario(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Estado de carga
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="material-icons animate-spin">sync</span> Enviando...';
  
  // Recoger datos del formulario
  const formData = recogerDatosFormulario();
  
  console.log('Enviando datos de activación:', formData);
  
  try {
    const webhookUrl = typeof CONFIG !== 'undefined' && CONFIG.n8n && CONFIG.n8n.webhookActivacionPaso1
      ? CONFIG.n8n.webhookActivacionPaso1
      : 'https://n8n.empiezadecero.cat/webhook/594a5ce9-4be9-446b-a8a9-9d44ba773ac3';

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
    
    // Leer la respuesta del webhook
    let responseData = null;
    try {
      const responseText = await response.text();
      if (responseText) {
        responseData = JSON.parse(responseText);
        console.log('Respuesta del webhook:', responseData);
      }
    } catch (parseError) {
      console.warn('No se pudo parsear la respuesta como JSON:', parseError);
    }
    
    // Verificar que la respuesta sea exitosa
    if (!response.ok && response.status !== 0) {
      throw new Error(`Error en el envío: ${response.status} ${response.statusText}`);
    }
    
    // Procesar la respuesta del webhook
    const resultado = procesarRespuestaWebhook(responseData);
    
    if (resultado.exito) {
      // Registro creado correctamente (confirmado con create_row: true)
      if (resultado.notaEncargoId) {
        formData.nota_encargo_id = resultado.notaEncargoId;
      }
      marcarPasoCompletado('paso1', formData.id_proceso_registro);
      registrarProgresoProceso(formData);
      mostrarMensajeExito(form, resultado.notaEncargoId);
    } else if (resultado.error) {
      // Hay un error en la respuesta (ej: duplicado)
      mostrarMensajeErrorDuplicado(form, submitBtn, originalText, resultado);
    } else {
      // No hay confirmación de éxito (no hay create_row: true)
      throw new Error('No se recibió confirmación de que el registro se creó correctamente. Por favor, verifica que el webhook esté activo.');
    }
  } catch (error) {
    console.error('Error detallado:', error);
    
    // Mostrar error real - no asumir éxito
    mostrarMensajeErrorEnvio(form, submitBtn, originalText, error);
  }
}

/**
 * Registra el avance del proceso en n8n/Supabase.
 * No bloquea el registro principal del cliente.
 * @param {Object} formData
 */
async function registrarProgresoProceso(formData) {
  const url = typeof CONFIG !== 'undefined' && CONFIG.n8n && CONFIG.n8n.webhookRegistrationProcess
    ? CONFIG.n8n.webhookRegistrationProcess
    : '';

  if (!url || !formData.id_proceso_registro) return;

  const payload = {
    tipo_formulario: 'registration_process_progress',
    event: 'paso_1_completado',
    id_proceso_registro: formData.id_proceso_registro,
    user_code: formData.user_code || '',
    status: 'paso_1_completado',
    current_step: 'paso-intermedio-nep',
    last_completed_step: 'activacion',
    progress_percent: 35,
    activacion_data: formData,
    nombre: formData.nombre_completo || formData.nombre || '',
    email: formData.email || '',
    telefono: formData.telefono ? String(formData.telefono) : '',
    dni: formData.dni || '',
    asesor: formData.asesor_juridico || '',
    deuda_total_aproximada: formData.deuda_total_aproximada || null,
    page_url: formData.page_url || window.location.href,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok && response.status !== 0) {
      console.warn('No se pudo registrar el progreso del proceso:', response.status, response.statusText);
    }
  } catch (error) {
    console.warn('No se pudo registrar el progreso del proceso:', error);
  }
}

/**
 * Recoger todos los datos del formulario
 * @returns {Object} Objeto con los datos del formulario
 */
function recogerDatosFormulario() {
  // Si no hay asesor en URL, obtenerlo del campo de entrada
  let asesorFinal = asesorJuridico;
  if (!asesorFinal) {
    const asesorInput = document.getElementById('asesor_input');
    asesorFinal = asesorInput ? asesorInput.value.trim() : 'No especificado';
  }
  
  const nombre = (document.getElementById('nombre')?.value || '').trim();
  const apellido = (document.getElementById('apellido')?.value || '').trim();
  const nombreCompleto = [nombre, apellido].filter(Boolean).join(' ').trim();
  const sexoSeleccionado = document.getElementById('sexo').value;
  const sexoPayload = sexoSeleccionado === 'hombre' ? 'H' : sexoSeleccionado === 'mujer' ? 'M' : '';
  const provinciaSelect = document.getElementById('dir_provincia');
  const provinciaNombre = provinciaSelect?.options[provinciaSelect.selectedIndex]?.textContent || '';

  // Mantener el campo legacy para integraciones existentes del webhook.
  const nombreCompletoInput = document.getElementById('nombre_completo');
  if (nombreCompletoInput) {
    nombreCompletoInput.value = nombreCompleto;
  }

  return {
    tipo_formulario: 'activacion_segunda_oportunidad',
    asesor_juridico: asesorFinal || 'No especificado',
    tipo_conector: tipoConector || 'No especificado',
    nombre_conector: nombreConector || 'No especificado',
    user_code: userCode || '', // Código del conector obtenido de la URL o validación
    id_unico_conector: userCode || '',
    id_proceso_registro: idProcesoRegistro,
    nombre_completo: nombreCompleto,
    nombre: nombre,
    apellido: apellido,
    sexo: sexoPayload,
    dni: document.getElementById('dni').value,
    telefono: Number(document.getElementById('telefono').value.replace(/\D/g, '')),
    email: document.getElementById('email').value,
    dir_provincia: (document.getElementById('dir_provincia')?.value || '').trim(),
    dir_ciudad: (document.getElementById('dir_ciudad')?.value || '').trim(),
    dir_codigo_postal: (document.getElementById('dir_cp')?.value || '').trim(),
    dir_calle: (document.getElementById('dir_calle')?.value || '').trim(),
    direccion: [
      (document.getElementById('dir_calle')?.value || '').trim(),
      (document.getElementById('dir_cp')?.value || '').trim(),
      (document.getElementById('dir_ciudad')?.value || '').trim(),
      provinciaNombre.trim()
    ].filter(Boolean).join(', '),
    estado_civil: document.getElementById('estado_civil').value,
    deuda_total_aproximada: Number(document.getElementById('deuda_total_aproximada').value) || null,
    datos_veracidad: document.getElementById('datos_veracidad')?.checked ?? false,
    consentimiento: document.getElementById('consentimiento').checked,
    timestamp: new Date().toISOString(),
    page_url: window.location.href
  };
}

/**
 * Procesar respuesta del webhook para detectar errores o éxito
 * @param {Object|Array|null} responseData - Respuesta del webhook
 * @returns {Object} {exito: boolean, error: string|null, mensaje: string|null}
 */
function procesarRespuestaWebhook(responseData) {
  // Si no hay respuesta, NO asumir éxito - requerir confirmación explícita
  if (!responseData) {
    console.warn('⚠️ No se recibió respuesta del webhook');
    return { exito: false, error: null, mensaje: null };
  }
  
  // Normalizar a array si es necesario
  let datos = Array.isArray(responseData) ? responseData : [responseData];
  
  // Buscar si hay create_row: true (éxito confirmado)
  const registroCreado = datos.find(item => item && item.create_row === true);
  if (registroCreado) {
    const notaEncargoId = registroCreado.id?.['Nota de encargo'] || registroCreado.nota_encargo_id || '';
    console.log('✅ Registro creado correctamente (create_row: true)');
    return { exito: true, error: null, mensaje: null, notaEncargoId };
  }
  
  // Buscar si hay error en algún objeto
  for (const item of datos) {
    if (item && item.error) {
      const errorMessage = item.error;
      console.error('❌ Error en respuesta del webhook:', errorMessage);
      
      // Detectar error de duplicado
      if (errorMessage.includes('duplicate key value violates unique constraint')) {
        if (errorMessage.includes('ux_referrals_cliente_dni_norm')) {
          return { 
            exito: false, 
            error: 'DUPLICADO_DNI',
            mensaje: 'Ya existe un registro con este DNI/NIE en nuestra base de datos. Por favor, verifica que no hayas enviado este contacto anteriormente.'
          };
        } else {
          return { 
            exito: false, 
            error: 'DUPLICADO',
            mensaje: 'Este registro ya existe en nuestra base de datos. Por favor, verifica que no hayas enviado este contacto anteriormente.'
          };
        }
      }
      
      // Otro tipo de error
      return { 
        exito: false, 
        error: 'OTRO_ERROR',
        mensaje: 'Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo o contacta con soporte.'
      };
    }
  }
  
  // Si no hay create_row ni error, NO asumir éxito - requerir confirmación explícita
  console.warn('⚠️ Respuesta recibida pero sin create_row: true ni error');
  return { exito: false, error: null, mensaje: null };
}

/**
 * Mostrar mensaje de éxito y redirigir al paso siguiente (paso-intermedio-nep.html)
 * @param {HTMLFormElement} form - Formulario donde mostrar el mensaje
 */
function mostrarMensajeExito(form, notaEncargoId) {
  const nombre = (document.getElementById('nombre')?.value || '').trim();

  // Animar la línea conectora del stepper
  const connector = document.getElementById('stepConnector');
  if (connector) {
    connector.style.transition = 'width 1s ease';
    connector.style.width = '100%';
  }

  form.innerHTML = `
    <div class="text-center py-10">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <span class="material-icons text-green-500 text-4xl">check_circle</span>
      </div>
      <h3 class="text-2xl font-bold text-primary mb-2">¡Paso 1 completado!</h3>
      <p class="text-gray-600 mb-1 text-base">Los datos de <strong>${nombre || 'el cliente'}</strong> han sido enviados correctamente.</p>
      <p class="text-gray-400 text-sm mb-8">Preparando el paso financiero…</p>
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-2.5 h-2.5 rounded-full bg-primary" style="animation:bounce 0.9s infinite ease-in-out;animation-delay:0s"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-primary" style="animation:bounce 0.9s infinite ease-in-out;animation-delay:.2s"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-primary" style="animation:bounce 0.9s infinite ease-in-out;animation-delay:.4s"></div>
      </div>
      <style>@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}</style>
      <button onclick="location.reload()"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm">
        <span class="material-icons text-base">add_circle_outline</span>
        Cargar otro contacto
      </button>
    </div>
  `;

  // Redirigir al paso 2 financiero tras 2.5 s
  setTimeout(function () {
    const params = new URLSearchParams(window.location.search);
    if (nombre) params.set('nombre', nombre);
    if (idProcesoRegistro) params.set('id_proceso_registro', idProcesoRegistro);
    if (notaEncargoId) params.set('nota_encargo_id', notaEncargoId);
    const telefono = document.getElementById('telefono')?.value || '';
    if (telefono) params.set('telefono', telefono);
    const deuda = document.getElementById('deuda_total_aproximada')?.value;
    if (deuda) params.set('deuda_total_aproximada', deuda);
    window.location.href = 'paso-intermedio-nep.html?' + params.toString();
  }, 2500);
}

/**
 * Mostrar mensaje de error por duplicado
 * @param {HTMLFormElement} form - Formulario donde mostrar el mensaje
 * @param {HTMLButtonElement} submitBtn - Botón de envío
 * @param {string} originalText - Texto original del botón
 * @param {Object} errorInfo - Información del error {error: string, mensaje: string}
 */
function mostrarMensajeErrorDuplicado(form, submitBtn, originalText, errorInfo) {
  const asesorMensaje = asesorJuridico 
    ? `del área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>` 
    : 'de nuestro equipo legal';
  
  form.innerHTML = `
    <div class="text-center py-12">
      <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="material-icons text-yellow-600 text-4xl">warning</span>
      </div>
      <h3 class="text-2xl font-bold text-yellow-800 mb-4">Registro Duplicado</h3>
      <p class="text-gray-700 mb-4 text-lg">${errorInfo.mensaje || 'Este registro ya existe en nuestra base de datos.'}</p>
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p class="text-sm text-gray-700 mb-3">
          <strong>¿Qué significa esto?</strong><br>
          El cliente que intentas registrar ya está en nuestro sistema. Esto puede ocurrir si:
        </p>
        <ul class="text-sm text-gray-600 text-left max-w-md mx-auto space-y-2">
          <li>• Ya enviaste este contacto anteriormente</li>
          <li>• Otro conector ya registró a este cliente</li>
          <li>• El cliente se registró directamente en nuestro sistema</li>
        </ul>
      </div>
      <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <p class="text-sm text-gray-700 mb-3">
          Si crees que esto es un error o necesitas ayuda, puedes contactarnos:
        </p>
        <a href="https://wa.me/34685555362" target="_blank" 
           class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg mb-4">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>📲 Contactar por WhatsApp</span>
        </a>
      </div>
      <div class="flex gap-4 justify-center">
        <button onclick="location.reload()" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg">
          <span class="material-icons">refresh</span>
          Intentar de Nuevo
        </button>
        <a href="index.html" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
          <span class="material-icons">home</span>
          Volver al Inicio
        </a>
      </div>
    </div>
  `;
}

/**
 * Mostrar mensaje de error al enviar el formulario
 * @param {HTMLFormElement} form - Formulario donde mostrar el mensaje
 * @param {HTMLButtonElement} submitBtn - Botón de envío
 * @param {string} originalText - Texto original del botón
 * @param {Error} error - Error ocurrido
 */
function mostrarMensajeErrorEnvio(form, submitBtn, originalText, error) {
  const asesorMensaje = asesorJuridico 
    ? `del área de asesoramiento jurídico de <strong class="text-primary">${asesorJuridico}</strong>` 
    : 'de nuestro equipo legal';
  
  // Determinar el mensaje según el tipo de error
  let titulo = 'Error al Enviar el Formulario';
  let mensaje = 'No se pudo enviar el formulario. Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
  
  if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    titulo = 'Error de Conexión';
    mensaje = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
  } else if (error.message.includes('webhook esté activo')) {
    titulo = 'Servicio Temporalmente No Disponible';
    mensaje = 'El servicio de registro no está disponible en este momento. Por favor, inténtalo más tarde o contacta con soporte.';
  } else if (error.message.includes('Error en el envío:')) {
    titulo = 'Error del Servidor';
    mensaje = `El servidor respondió con un error (${error.message}). Por favor, inténtalo de nuevo o contacta con soporte.`;
  }
  
  form.innerHTML = `
    <div class="text-center py-12">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="material-icons text-red-500 text-4xl">error</span>
      </div>
      <h3 class="text-2xl font-bold text-red-800 mb-4">${titulo}</h3>
      <p class="text-gray-700 mb-4 text-lg">${mensaje}</p>
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p class="text-sm text-gray-700 mb-3">
          <strong>Detalles técnicos:</strong><br>
          <code class="text-xs text-gray-600">${error.message}</code>
        </p>
      </div>
      <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <p class="text-sm text-gray-700 mb-3">
          Si el problema persiste, puedes contactarnos:
        </p>
        <a href="https://wa.me/34685555362" target="_blank" 
           class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg mb-4">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>📲 Contactar por WhatsApp</span>
        </a>
      </div>
      <div class="flex gap-4 justify-center">
        <button onclick="location.reload()" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg">
          <span class="material-icons">refresh</span>
          Intentar de Nuevo
        </button>
        <a href="index.html" class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
          <span class="material-icons">home</span>
          Volver al Inicio
        </a>
      </div>
    </div>
  `;
}
