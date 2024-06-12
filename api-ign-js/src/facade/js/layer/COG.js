/* eslint-disable no-console */
/**
 * @module M/layer/COG
 */
import COGImpl from 'impl/layer/COG';
import {
  isNullOrEmpty,
  isUndefined,
} from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * COG devuelve un mapa en formato imagen de un conjunto capas ráster o vectoriales.
 * Permitiendo las personalización de las capas mediante estilos. Se trata de un mapa dínamico.
 *
 * @property {String} legend Nombre asociado en el árbol de contenido, si usamos uno.
 * @property {Boolean} transparent 'Falso' si es una capa base, 'verdadero' en caso contrario.
 * @property {Number} minZoom Limitar el zoom mínimo.
 * @property {Number} maxZoom Limitar el zoom máximo.
 * @property {Object} options Capa de opciones COG.
 *
 * @api
 * @extends {M.Layer}
 */
class COG extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa COG
   * con parámetros especificados por el usuario.
   * @constructor
   * @param {string|Mx.parameters.COG} userParameters Parámetros para la construcción de la capa.
   * - name: nombre de la capa en el servidor.
   * - url: url del servicio WFS.
   * - projection: SRS usado por la capa.
   * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - visibility: Verdadero si la capa es visible, falso si queremos que no lo sea.
   *   En este caso la capa sería detectado por los plugins de tablas de contenidos
   *   y aparecería como no visible.
   * - type: Tipo de la capa.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - visibility: Indica la visibilidad de la capa.
   *    * - convertToRGB: Convierte la compresion de la imagen a RGB, puede ser 'auto'|true|false,
   *   por defecto 'auto'.
   * - opacity: Opacidad de la capa de 0 a 1, por defecto 1.
   * - bands: Bandas a mostrar en forma de array y como numero, si el array esta vacio muestra todas
   *   por defecto [].
   * - nodata: Usado para sobreescribir el parametro nodata del dato original
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - minScale: Escala mínima.
   * - maxScale: Escala máxima.
   * - minResolution: Resolución mínima.
   * - maxResolution: Resolución máxima.
   * - style: Estilo de las bandas.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLSourceTileCOG from 'ol/source/TileCOG';
   * {
   *  opacity: 0.1,
   *  source: new OLSourceTileCOG({
   *    attributions: '',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create WMC layers
    if (isUndefined(COGImpl)) {
      Exception(getValue('exception').cog_method);
    }
    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }
    // This Layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.COG);
    const optionsVar = {
      ...options,
      visibility: parameters.visibility,
      queryable: parameters.queryable,
      displayInLayerSwitcher: parameters.displayInLayerSwitcher,
      projection: parameters.projection,
      maxExtent: userParameters.maxExtent,
    };
    const impl = new COGImpl(optionsVar, vendorOptions);
    // calls the super constructor
    super(parameters, impl);

    /**
     * COG legend: Nombre asociado en el árbol de contenido, si usamos uno.
     */
    this.legend = parameters.legend;

    /**
     * COG transparent: Falso si es una capa base, verdadero en caso contrario.
     */
    this.transparent = parameters.transparent;

    /**
     * COG minZoom: Limitar el zoom mínimo.
     */
    this.minZoom = parameters.minZoom;

    /**
     * COG maxZoom: Limitar el zoom máximo.
     */
    this.maxZoom = parameters.maxZoom;

    /**
     * COG options: Opciones COG.
     */
    this.options = optionsVar;
  }

  /**
   * Devuelve el tipo de layer, COG.
   *
   * @function
   * @getter
   * @returns {M.LayerType.COG} Tipo COG.
   * @api
   */
  get type() {
    return LayerType.COG;
  }

  /**
   * Sobrescribe el tipo de capa.
   *
   * @function
   * @setter
   * @param {String} newType Nuevo tipo.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType)
      && !isNullOrEmpty(newType) && (newType !== LayerType.COG)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.COG).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Devuelve las opciones de la capa.
   *
   * @function
   * @getter
   * @return {M.layer.COG.options} Devuelve las opciones de la
   * implementación.
   * @api
   */
  get options() {
    return this.getImpl().options;
  }

  /**
   * Sobrescribe las opciones de la capa.
   *
   * @function
   * @setter
   * @param {Object} newOptions Nuevas opciones.
   * @api
   */
  set options(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * Devuelve la extensión de la capa.
   * @returns {Array} Devuelve la extensión de la capa.
   */
  getMaxExtent() {
    return this.getImpl().getMaxExtent();
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Valor verdadero es igual, falso no lo es.
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof COG) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }
}

export default COG;
