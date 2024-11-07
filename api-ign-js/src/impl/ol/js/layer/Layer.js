/**
 * @module M/impl/Layer
 */
import { isNullOrEmpty, isString, concatUrlPaths } from 'M/util/Utils';
import MObject from 'M/Object';
import FacadeLayer from 'M/layer/Layer';
/**
 * @classdesc
 * De esta clase heredadan todas las capas base.
 *
 * @api
 * @extends {M.Object}
 */
class LayerBase extends MObject {
  /**
   * @classdesc
   * Constructor principal de la clase. Crea una capa
   * con parámetros especificados por el usuario.
   *
   *
   * @param {Object} options Parámetros opcionales para la capa.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * - displayInLayerSwitcher: Indica si la capa se muestra en el selector de capas.
   * - opacity: Opacidad de capa, por defecto 1.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - maxExtent: La medida en que restringe la visualización a una región específica.
   * @param {Object} vendorOptions Pasa los "vendorOptions" heredados a la clase
   * MObject (M/Object).
   *
   * @api stable
   */
  constructor(options = {}, vendorOptions = {}) {
    // calls the super constructor
    super(options);

    /**
     * Layer vendorOptions_. Opciones de proveedor para la biblioteca base.
     */
    this.vendorOptions_ = vendorOptions;

    /**
     * Layer map. La instancia del mapa.
     */
    this.map = null;

    /**
     * Layer ol3layer. La instancia de la capa ol3.
     */
    this.ol3Layer = null;

    /**
     * Layer options. Opciones personalizadas para esta capa.
     */
    this.options = options;

    /**
     * Layer visibility. Indica la visibilidad de la capa.
     */
    this.visibility = this.options.visibility !== false;

    /**
     * Layer displayInLayerSwitcher. Indica si la capa se muestra en el selector de capas.
     */
    this.displayInLayerSwitcher = this.options.displayInLayerSwitcher !== false;

    /**
     * Layer zIndex. Índice z de la capa.
     */
    this.zIndex_ = null;

    /**
     * Layer opacity_. Opacidad de capa, por defecto 1.
     */
    this.opacity_ = this.options.opacity || 1;

    /**
     * Layer legendUrl_. Leyenda URL de esta capa.
     */
    this.legendUrl_ = concatUrlPaths([`${M.config.IDEE_URL}assets/`, FacadeLayer.LEGEND_DEFAULT]);

    /**
     * Layer minZoom. Zoom mínimo aplicable a la capa.
     */
    this.minZoom = this.options.minZoom || Number.NEGATIVE_INFINITY;

    /**
     * Layer maxZoom. Zoom máximo aplicable a la capa.
     */
    this.maxZoom = this.options.maxZoom || Number.POSITIVE_INFINITY;

    this.userMaxExtent = options.maxExtent;
  }

  /**
   * Este método indica si la capa es visible.
   *
   * @function
   * @returns {Boolean} Verdadero es visible, falso si no.
   * @api stable
   * @expose
   */
  isVisible() {
    let visible = false;
    if (!isNullOrEmpty(this.ol3Layer)) {
      visible = this.ol3Layer.getVisible();
    } else {
      visible = this.visibility;
    }
    return visible;
  }

  /**
   * Este método indica si la capa es consultable.
   *
   * @function
   * @returns {Boolean} Devuelve falso.
   * @api stable
   * @expose
   *
   */
  isQueryable() {
    return false;
  }

  /**
   * Este método indica si la capa está dentro del rango.
   *
   * @function
   * @returns {Boolean} Verdadero está dentro del rango, falso si no.
   * @api stable
   * @expose
   */
  inRange() {
    let inRange = false;
    if (!isNullOrEmpty(this.ol3Layer)) {
      const resolution = this.map.getMapImpl().getView().getResolution();
      const maxResolution = this.ol3Layer.getMaxResolution();
      const minResolution = this.ol3Layer.getMinResolution();

      inRange = ((resolution >= minResolution) && (resolution <= maxResolution));
    }
    return inRange;
  }

  /**
   * Este método establece la visibilidad de esta capa.
   *
   * @function
   * @param {Boolean} visibility Verdadero es visibilidad, falso si no.
   * @api stable
   * @expose
   */
  setVisible(visibility) {
    this.visibility = visibility;

    if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
  }

  /**
   * Este método devuelve el zoom mínimo de esta capa.
   *
   * @function
   * @returns {Number} Devuelve el zoom mínimo aplicable a la capa.
   * @api stable
   * @expose
   */
  getMinZoom() {
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.minZoom = this.getOL3Layer().getMinZoom();
    }
    return this.minZoom;
  }

  /**
   * Este método establece el zoom mínimo de esta capa.
   *
   * @function
   * @param {Number} zoom Zoom mínimo aplicable a la capa.
   * @api stable
   * @expose
   */
  setMinZoom(zoom) {
    this.minZoom = zoom;
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.getOL3Layer().setMinZoom(zoom);
    }
  }

  /**
   * Este método devuelve el zoom máximo de esta capa.
   *
   * @function
   * @returns {Number} Zoom máximo aplicable a la capa.
   * @api stable
   * @expose
   */
  getMaxZoom() {
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.maxZoom = this.getOL3Layer().getMaxZoom();
    }
    return this.maxZoom;
  }

  /**
   * Este método establece el zoom máximo de esta capa.
   *
   *
   * @function
   * @param {Number} zoom Zoom máximo aplicable a la capa.
   * @api stable
   * @expose
   */
  setMaxZoom(zoom) {
    this.maxZoom = zoom;
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.getOL3Layer().setMaxZoom(zoom);
    }
  }

  /**
   * Este método devuelve el índice z de esta capa.
   *
   * @function
   * @return {Number} Índice de la capa.
   * @api stable
   * @expose
   */
  getZIndex() {
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.zIndex_ = this.getOL3Layer().getZIndex();
    }
    return this.zIndex_;
  }

  /**
   * Este método establece el índice z de esta capa.
   *
   * @function
   * @param {Number} zIndex Índice de la capa.
   * @api stable
   * @expose
   */
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.getOL3Layer().setZIndex(zIndex);
    }
    if (this.rootGroup) {
      this.rootGroup.reorderLayers();
    }
  }

  /**
   * Este método devuelve la opacidad de esta capa.
   *
   * @function
   * @returns {Number} Opacidad (0, 1). Predeterminado 1.
   * @api stable
   * @expose
   */
  getOpacity() {
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.opacity_ = this.getOL3Layer().getOpacity();
    }
    return this.opacity_;
  }

  /**
   * Este método establece la opacidad de esta capa.
   *
   * @function
   * @param {Number} opacity Opacidad (0, 1). Predeterminado 1.
   * @api stable
   * @expose
   */
  setOpacity(opacity) {
    let opacityParsed = opacity;
    if (!isNullOrEmpty(opacity) && isString(opacity)) {
      opacityParsed = Number(opacity);
    }
    this.opacity_ = opacityParsed;
    if (!isNullOrEmpty(this.getOL3Layer())) {
      this.getOL3Layer().setOpacity(opacityParsed);
    }
  }

  /**
   * Este método obtiene la capa Openlayers creada.
   *
   * @function
   * @return {ol3Layer} Devuelve la capa Openlayers.
   * @api stable
   * @expose
   */
  getOL3Layer() {
    return this.ol3Layer;
  }

  /**
   * Este método establece la capa Openlayers.
   *
   * @function
   * @param {ol.layer} layer Capa de Openlayers.
   * @api stable
   * @expose
   */
  setOL3Layer(layer) {
    const olMap = this.map.getMapImpl();
    olMap.removeLayer(this.ol3Layer);
    this.ol3Layer = layer;
    olMap.addLayer(layer);
    return this;
  }

  /**
   * Este método obtiene la implementación del mapa.
   *
   * @function
   * @returns {M.impl.Map} Es la implementación del mapa.
   * @api stable
   * @expose
   */
  getMap() {
    return this.map;
  }

  /**
   * Este método obtiene la URL de la leyenda.
   *
   * @function
   * @returns {String} URL de la leyenda.
   * @api stable
   * @expose
   */
  getLegendURL() {
    return this.legendUrl_;
  }

  /**
   * Este método establece la máxima extensión de la capa.
   *
   * @function
   * @param {Mx.Extent} maxExtent Máxima extensión.
   * @public
   * @api
   */
  setMaxExtent(maxExtent) {
    this.ol3Layer.setExtent(maxExtent);
  }

  /**
   * Este método devuelve la máxima extensión de la capa.
   *
   * @function
   * @param {Mx.Extent} maxExtent Máxima extensión.
   * @public
   * @api
   */
  getMaxExtent() {
    this.ol3Layer.getExtent();
  }

  /**
   * Este método establece la url de la leyenda.
   *
   * @function
   * @param {String} legendUrl URL de la leyenda.
   * @api stable
   * @expose
   */
  setLegendURL(legendUrl) {
    this.legendUrl_ = legendUrl;
  }

  /**
   * Este método obtiene los niveles de zoom numéricos.
   *
   * @public
   * @returns {Number} Devuelve la resolución máxima.
   * @function
   * @api stable
   */
  getNumZoomLevels() {
    return this.numZoomLevels || M.config.ZOOM_LEVELS;
  }

  /**
   * Este método ejecuta una deselección del objetos geográficos.
   *
   * @param {ol.features} features Openlayers objetos geográficos.
   * @param {Array} coord Coordenadas.
   * @param {Object} evt Eventos.
   * @public
   * @function
   * @api stable
   * @expose
   */
  unselectFeatures(features, coord, evt) {}

  /**
   * Este método ejecuta la selección de un objetos geográficos.
   *
   * @function
   * @param {ol.features} features Openlayers objetos geográficos.
   * @param {Array} coord Coordenadas.
   * @param {Object} evt Eventos.
   * @api stable
   * @expose
   */
  selectFeatures(features, coord, evt) {}
}

export default LayerBase;
