/**
 * IDEE API
 * Version ${pom.version}
 * Date ${build.timestamp}
 */
const backgroundlayersOpts = [{
  id: 'mapa',
  title: 'Callejero',
  layers: [
    'QUICK*Base_IGNBaseTodo_TMS',
  ],
},
{
  id: 'imagen',
  title: 'Imagen',
  layers: [
    'QUICK*BASE_PNOA_MA_TMS',
  ],
},
{
  id: 'hibrido',
  title: 'H&iacute;brido',
  layers: [
    'QUICK*BASE_PNOA_MA_TMS',
    'QUICK*BASE_IGNBaseOrto_TMS',
  ],
},
];

const params = window.location.search.split('&');
let center = '';
let zoom = '';
let srs = '';
let layers = '';
params.forEach((param) => {
  if (param.indexOf('center') > -1) {
    const values = param.split('=')[1].split(',');
    center = [parseFloat(values[0]), parseFloat(values[1])];
  } else if (param.indexOf('zoom') > -1) {
    const value = param.split('=')[1];
    zoom = parseInt(value, 10);
  } else if (param.indexOf('srs') > -1) {
    const value = param.split('=')[1];
    srs = value;
  } else if (param.indexOf('layers') > -1) {
    let value = param.substring(param.indexOf('=') + 1, param.length);

    let layerGroups = [];
    const regex = /LayerGroup\*.*?!/g;
    if (value.match(regex) !== null) {
      layerGroups = value.match(regex).map((item) => item.slice(0, -1));
      value = value.replace(regex, '');
    }

    layers = value.split(',').filter((item) => item !== '').concat(layerGroups);
  }
});

(function (M) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M.config('MOBILE_WIDTH', '${mobile.width}');

  /**
   * The IDEE URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('IDEE_URL', '${idee.url}');

  /**
   * The path to the IDEE proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${idee.proxy.url}`);

  /**
   * The path to the IDEE proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_POST_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${idee.proxy_post.url}`);

  /**
   * The path to the IDEE templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('TEMPLATES_PATH', '${idee.templates.path}');

  /**
   * TODO
   * @type {object}
   * @public
   * @api stable
   */
  M.config('tileMappgins', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledNames: '${tile.mappings.tiledNames}'.split(','),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledUrls: '${tile.mappings.tiledUrls}'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    names: '${tile.mappings.names}'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    urls: '${tile.mappings.urls}'.split(','),
  });

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('DEFAULT_PROJ', '${idee.proj.default}');

  /**
   * TMS configuration
   *
   * @private
   * @type {object}
   */
  M.config('baseLayer', '${baseLayer}');

  /**
   * Controls configuration
   *
   * @private
   * @type {object}
   */
  M.config('controls', {
    default: '${controls.default}',
  });

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M.config('backgroundlayers', backgroundlayersOpts);

  /**
   * URL of sql wasm file
   * @private
   * @type {String}
   */
  M.config('SQL_WASM_URL', `${(location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:'}\${sql_wasm.url}`);

  /**
   * MAP Viewer - Center
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_CENTER', center);

  /**
   * MAP Viewer - Zoom
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_ZOOM', zoom);

  /**
   * MAP Viewer - SRS
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_SRS', srs);

  /**
   * MAP Viewer - Layers
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_LAYERS', layers);

  /**
   * Mueve el mapa cuando se hace clic sobre un objeto
   * geográfico, (extract = true) o no (extract = false)
   *
   * @private
   * @type {object}
   */
  M.config('MOVE_MAP_EXTRACT', true);

  /**
   * Hace el popup y dialog inteligente
   *
   * @private
   * @type {object}
   */
  M.config('POPUP_INTELLIGENCE', {
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
}(window.M));
