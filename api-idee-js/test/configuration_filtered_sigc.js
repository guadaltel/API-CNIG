const backgroundlayersIds = 'mapa,imagen,hibrido'.split(',');
const backgroundlayersTitles = 'Mapa,Imagen,Hibrido'.split(',');
const backgroundlayersLayers = 'QUICK*Base_IGNBaseTodo_TMS,QUICK*BASE_PNOA_MA_TMS,QUICK*BASE_PNOA_MA_TMS+QUICK*BASE_IGNBaseOrto_TMS'.split(',');
const backgroundlayersOpts = backgroundlayersIds.map((id, index) => {
  return {
    id,
    title: backgroundlayersTitles[index],
    layers: backgroundlayersLayers[index].split('+'),
  };
});

const config = (configKey, configValue) => {
  config[configKey] = configValue;
};

if (!window.M) {
  const M = {};
  window.M = M;
}
M.config = config;

function fun(M_) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M_.config('MOBILE_WIDTH', 768);

  /**
   * The IDEE URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('IDEE_URL', 'https://api-idee-sigc.desarrollo.guadaltel.es/api-idee/');

  /**
   * The path to the IDEE proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_URL', `${location.protocol}//api-idee-sigc.desarrollo.guadaltel.es/api-idee/api/proxy`);

  /**
   * The path to the IDEE proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_POST_URL', `${location.protocol}//api-idee-sigc.desarrollo.guadaltel.es/api-idee/proxyPost`);

  /**
   * The path to the IDEE templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('TEMPLATES_PATH', '/files/templates/');

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('predefinedWMC', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'urls': 'https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_callejero.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_hibrido.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_satelite.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejeroCache.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejero.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/callejero2011cache.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/ortofoto2011cache.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/hibrido2011cache.xml,https://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto.xml'.split(',').map((e) => e),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'predefinedNames': 'cdau,cdau_hibrido,cdau_satelite,callejerocacheado,callejero,callejero2011cache,ortofoto2011cache,hibrido2011cache,ortofoto'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'names': 'Callejero,Hibrido,Satelite,mapa callejero cache,mapa del callejero,Callejero,Ortofoto,HÃ­brido,mapa ortofoto'.split(','),
  });

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('DEFAULT_PROJ', 'EPSG:3857*m');

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('panels', {
    /**
     * TODO
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    TOOLS: 'measurebar,getfeatureinfo'.split(','),
  });

  /**
   * WMTS configuration
   *
   * @private
   * @type {object}
   */
  M_.config('baseLayer', 'QUICK*Base_IGNBaseTodo_TMS');

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M_.config('backgroundlayers', backgroundlayersOpts);

  /**
   * Attributions configuration
   *
   * @private
   * @type {object}
   */
  M_.config('attributions', {
    defaultAttribution: 'Instituto Geográfico Nacional',
    defaultURL: 'https://www.ign.es/',
    url: 'https://api-idee-sigc.desarrollo.guadaltel.es/api-idee/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    type: 'kml',
  });

  /**
   * Controls configuration
   *
   * @private
   * @type {object}
   */
  M_.config('controls', {
    default: '',
  });

  /**
   * URL of sql wasm file
   * @private
   * @type {String}
   */
  M_.config('SQL_WASM_URL', '../../../../node_modules/sql.js/dist/');

  /**
   * Mueve el mapa cuando se hace clic sobre un objeto
   * geográfico, (extract = true) o no (extract = false)
   *
   * @private
   * @type {object}
   */
  M_.config('MOVE_MAP_EXTRACT', false);

  /**
   * Hace el popup inteligente
   *
   * @private
   * @type {object}
   */
  M_.config('POPUP_INTELLIGENCE', {
    activate: true,
    sizes: {
      images: ['120px', '75px'],
      videos: ['500px', '300px'],
      documents: ['500px', '300px'],
      audios: ['250px', '40px'],
    },
  });

  /**
   * Hace el dialog inteligente
   *
   * @private
   * @type {object}
   */
  M.config('DIALOG_INTELLIGENCE', {
    activate: true,
    sizes: {
      images: ['120px', '75px'],
      videos: ['500px', '300px'],
      documents: ['500px', '300px'],
      audios: ['250px', '40px'],
    },
  });
}

fun(window.M);
