/**
 * @module M/impl/layer/MBTilesVector
 */
import { isNullOrEmpty, readJSON as readStyleJSON } from 'M/util/Utils';
import { get as getProj, transformExtent } from 'ol/proj';
import { inflate } from 'pako';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';

import OLLayerTile from 'ol/layer/Tile';
import OLLayerVectorTile from 'ol/layer/VectorTile';
import OLSourceVectorTile from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { getBottomLeft, getWidth } from 'ol/extent';
import TileProvider from 'M/provider/Tile';
import * as EventType from 'M/event/eventtype';
import { fromKey } from 'ol/tilecoord';
import MVT from 'ol/format/MVT';
// import Feature from 'ol/Feature';
import TileState from 'ol/TileState';
import TileEventType from 'ol/source/TileEventType';
import ImplMap from '../Map';
import Vector from './Vector';


/**
  * Tamaño de la tesela vectorial de MBTiles por defecto
  *
  * @const
  * @public
  * @type {number}
  */
const DEFAULT_TILE_SIZE = 256;

/**
  * Este método calcula las resoluciones a partir de los
  * parámetros especificados
  *
  * @function
  * @param {Mx.Extent} extent Extensión
  * @param {number} tileSize Tamaño de la tesela vectorial
  * @param {Array<Number>} zoomLevels Niveles de zoom
  * @returns {Array<Number>} Resoluciones obtenidas
  * @public
  * @api
  */
const generateResolutions = (extent, tileSize, zoomLevels) => {
  const width = getWidth(extent);
  const size = width / tileSize;
  const resolutions = new Array(zoomLevels);
  for (let z = 0; z < zoomLevels; z += 1) {
    resolutions[z] = size / (2 ** z);
  }
  return resolutions;
};

/**
  * @classdesc
  * Implementación de la capa MBTilesVector.
  *
  * @property {function} tileLoadFunction_ Función de carga de la tesela vectorial.
  * @property {string} url_ Url del fichero o servicio que genera el MBTilesVector.
  * @property {ArrayBuffer|Uint8Array|Response|File} source_ Fuente de la capa.
  * @property {File|String} style_ Define el estilo de la capa.
  * @property {number} tileSize_ Tamaño de la tesela vectorial.
  * @property {Mx.Extent} maxExtent_ La medida en que restringe la visualización a
  * una región específica.
  * @property {number} minZoomLevel_ Zoom mínimo aplicable a la capa.
  * @property {number} maxZoomLevel_ Zoom máximo aplicable a la capa.
  * @property {number} opacity_ Opacidad de capa.
  * @property {number} zIndex_ zIndex de la capa.
  * @property {boolean} visibility Define si la capa es visible o no.
  *
  * @api
  * @extends {M.impl.layer.Vector}
  */
class MBTilesVector extends Vector {
  /**
    * Constructor principal de la clase. Crea una capa de implementación MBTilesVector
    * con parámetros especificados por el usuario.
    *
    * @constructor
    * @param {String|Mx.parameters.MBTilesVector} userParameters Parámetros para la
    * construcción de la capa.
    * - name: Nombre de la capa.
    * - url: Url del fichero o servicio que genera el MBTilesVector.
    * - minZoomLevel: Zoom mínimo aplicable a la capa.
    * - maxZoomLevel: Zoom máximo aplicable a la capa.
    * - type: Tipo de la capa.
    * - transparent: Falso si es una capa base, verdadero en caso contrario.
    * - maxExtent: La medida en que restringe la visualización a una región específica.
    * - legend: Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
    * - tileLoadFunction: Función de carga de la tesela vectorial proporcionada por el usuario.
    * - source: Fuente de la capa.
    * - tileSize: Tamaño de la tesela vectorial, por defecto 256.
    * - style: Define el estilo de la capa.
    * - visibility: Define si la capa es visible o no. Verdadero por defecto.
    * @param {Mx.parameters.LayerOptions} options Opciones personalizadas para esta capa.
    * - opacity: Opacidad de capa, por defecto 1.
    * - visibility: Define si la capa es visible o no. Verdadero por defecto.
    * - displayInLayerSwitcher: Indica si la capa se muestra en el selector de capas.
    * - minZoom: Zoom mínimo aplicable a la capa.
    * - maxZoom Zoom máximo aplicable a la capa.
    * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
    * <pre><code>
    * import OLSourceVectorTile from 'ol/source/VectorTile';
    * {
    *  opacity: 0.1,
    *  source: new OLSourceVector({
    *    url: '{z},{x},{y}',
    *    ...
    *  })
    * }
    * </code></pre>
    * @api
    */
  constructor(userParameters, options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
      * MBTilesVector tileLoadFunction: Función de carga de la tesela
      * vectorial proporcionada por el usuario.
      * @private
      * @type {function}
      */
    this.tileLoadFunction_ = userParameters.tileLoadFunction || null;

    /**
      * MBTilesVector url: Url del fichero o servicio que genera el MBTilesVector.
      * @private
      * @type {string}
      */
    this.url_ = userParameters.url;

    /**
      * MBTilesVector source: Fuente de la capa.
      * @private
      * @type {ArrayBuffer|Uint8Array|Response|File}
      */
    this.source_ = userParameters.source;

    /**
      * MBTilesVector style: Define el estilo de la capa.
      * @private
      * @type {File|String}
      */
    this.style_ = userParameters.style;

    /**
      * MBTilesVector tileSize: Tamaño de la tesela vectorial, por defecto 256.
      * @private
      * @type {number}
      */
    this.tileSize_ = typeof userParameters.tileSize === 'number' ? userParameters.tileSize : DEFAULT_TILE_SIZE;

    /**
      * MBTilesVector maxExtent: Extensión de la capa.
      * @private
      * @type {Mx.Extent}
      */
    this.maxExtent_ = userParameters.maxExtent || null;

    /**
      * MBTilesVector minZoomLevel: Zoom mínimo aplicable a la capa.
      * @private
      * @type {number}
      */
    this.minZoomLevel_ = typeof userParameters.minZoomLevel === 'number' ? userParameters.minZoomLevel : 0;

    /**
      * MBTilesVector maxZoomLevel: Zoom máximo aplicable a la capa.
      * @private
      * @type {number}
      */
    this.maxZoomLevel_ = typeof userParameters.maxZoomLevel === 'number' ? userParameters.maxZoomLevel : 0;

    /**
      * MBTilesVector opacity: Opacidad de capa.
      * @private
      * @type {number}
      */
    this.opacity_ = typeof options.opacity === 'number' ? options.opacity : 1;

    /**
      * ZIndex de la capa
      * @private
      * @type {number}
      */
    this.zIndex_ = ImplMap.Z_INDEX.MBTilesVector;

    /**
      * MBTilesVector visibility: Visibilidad de la capa.
      * @public
      * @type {boolean}
      */
    this.visibility = userParameters.visibility === false ? userParameters.visibility : true;
  }

  /**
    * Este método establece la visibilidad de la capa.
    *
    * @function
    * @param {boolean} visibility Verdadero para capa visible, falso no lo es.
    * @public
    * @api
    */
  setVisible(visibility) {
    this.visibility = visibility;
  }

  /**
    * Este método establece el objeto de mapa de la capa.
    *
    * @function
    * @public
    * @param {M.Map} map Mapa.
    * @api
    */
  addTo(map) {
    this.map = map;
    const { code } = this.map.getProjection();
    const projection = getProj(code);
    const extent = projection.getExtent();
    const resolutions = generateResolutions(extent, this.tileSize_, 10);
    readStyleJSON(this.style_).then((jsonStyle) => {
      this.glStyle_ = jsonStyle;
      if (!this.tileLoadFunction_) {
        this.fetchSource().then((tileProvider) => {
          this.tileProvider_ = tileProvider;
          this.tileProvider_.getExtent().then((mbtilesExtent) => {
            let reprojectedExtent = mbtilesExtent;
            if (reprojectedExtent) {
              reprojectedExtent = transformExtent(mbtilesExtent, 'EPSG:4326', code);
            }
            this.ol3Layer = this.createLayer({
              tileProvider,
              resolutions,
              extent: reprojectedExtent,
              sourceExtent: extent,
              projection,
            });
            this.ol3Layer.getSource()
              .on(TileEventType.TILELOADERROR, evt => this.checkAllTilesLoaded_(evt));
            this.ol3Layer.getSource()
              .on(TileEventType.TILELOADEND, evt => this.checkAllTilesLoaded_(evt));
            this.map.on(EventType.CHANGE_ZOOM, () => {
              if (this.map) {
                const newZoom = this.map.getZoom();
                if (this.lastZoom_ !== newZoom) {
                  this.features_.length = 0;
                  this.lastZoom_ = newZoom;
                }
              }
            });
            stylefunction(this.ol3Layer, this.glStyle_, '');
            this.map.getMapImpl().addLayer(this.ol3Layer);
          });
        });
      } else {
        this.ol3Layer = this.createLayer({
          resolutions,
          sourceExtent: extent,
          projection,
        });
        this.ol3Layer.getSource()
          .on(TileEventType.TILELOADERROR, evt => this.checkAllTilesLoaded_(evt));
        this.ol3Layer.getSource()
          .on(TileEventType.TILELOADEND, evt => this.checkAllTilesLoaded_(evt));
        this.map.on(EventType.CHANGE_ZOOM, () => {
          if (this.map) {
            const newZoom = this.map.getZoom();
            if (this.lastZoom_ !== newZoom) {
              this.features_.length = 0;
              this.lastZoom_ = newZoom;
            }
          }
        });
        this.map.getMapImpl().addLayer(this.ol3Layer);
      }
    });
  }

  /** Este método crea la capa de implementación de OL.
    *
    * @function
    * @param {object} opts Opciones para la capa
    * @returns {ol.layer.TileLayer|ol.layer.VectorTile} Capa de implementación de OL.
    * @public
    * @api
    */
  createLayer(opts) {
    const mvtFormat = new MVT({
      layers: ['0502p_ent_pob_ine'],
    });
    const layer = new OLLayerVectorTile({
      visible: this.visibility,
      opacity: this.opacity_,
      zIndex: this.zIndex_,
      extent: this.maxExtent_ || opts.extent,
    });
    if (!this.tileLoadFunction_) {
      const source = new OLSourceVectorTile({
        projection: opts.projection,
        url: '{z},{x},{y}',
        format: mvtFormat,
        tileLoadFunction: tile => this.loadVectorTileWithProvider(tile, opts),
        tileGrid: new TileGrid({
          extent: opts.sourceExtent,
          origin: getBottomLeft(opts.sourceExtent),
          resolutions: opts.resolutions,
        }),
      });
      layer.setSource(source);
    } else {
      const source = new OLSourceVectorTile({
        projection: opts.projection,
        url: '{z},{x},{y}',
        tileLoadFunction: tile => this.loadVectorTile(tile, mvtFormat),
        tileGrid: new TileGrid({
          extent: opts.sourceExtent,
          origin: getBottomLeft(opts.sourceExtent),
          resolutions: opts.resolutions,
        }),
      });
      layer.setSource(source);
    }
    return layer;
  }

  /**
    * Este método es la función personalizada de carga de la tesela
    * vectorial de TileLayer.
    *
    * @function
    * @param {ol.Tile} tile Tesela vectorial.
    * @param {ol.format.MVT} formatter Formateador.
    * @param {M.provider.Tile} tileProvider Proveedor de la tesela vectorial.
    * @public
    * @api
    */
  loadVectorTile(tile, formatter) {
    tile.setState(TileState.LOADING);
    tile.setLoader((extent, resolution, projection) => {
      const tileCoord = tile.getTileCoord();
      this.tileLoadFunction_(tileCoord[0], tileCoord[1], -tileCoord[2] - 1).then((_vectorTile) => {
        if (_vectorTile) {
          const vectorTile = inflate(_vectorTile);
          const features = formatter.readFeatures(vectorTile, {
            extent,
            featureProjection: projection,
          });
          tile.setFeatures(features);
          tile.setState(TileState.LOADED);
        } else {
          tile.setState(TileState.ERROR);
        }
      });
    });
  }

  /**
    * Este método es la función personalizada de carga de la tesela
    * vectorial.
    *
    * @function
    * @param {ol.Tile} tile Tesela vectorial.
    * @param {Object} opts Opciones.
    * @public
    * @api
    */
  loadVectorTileWithProvider(tile, opts) {
    tile.setState(TileState.LOADING);
    tile.setLoader((extent, resolution, projection) => {
      const tileCoord = tile.getTileCoord();
      const formatter = tile.getFormat();
      opts.tileProvider.getVectorTile([tileCoord[0], tileCoord[1], -tileCoord[2] - 1], extent)
        .then((pbf) => {
          if (pbf) {
            const features = formatter.readFeatures(pbf, {
              extent,
              featureProjection: projection,
            });
            tile.setFeatures(features);
            tile.setState(TileState.LOADED);
          } else {
            tile.setState(TileState.ERROR);
          }
        });
    });
  }

  /**
    * Este método busca la fuente de la capa.
    *
    * @function
    * @returns {Object} Promesa con el resultado de la
    * búsqueda de la fuente.
    * @public
    * @api
    */
  fetchSource() {
    return new Promise((resolve, reject) => {
      if (this.tileProvider_) {
        resolve(this.tileProvider_);
      } else if (this.source_) {
        const tileProvider = new TileProvider(this.source_);
        resolve(tileProvider);
      } else if (this.url_) {
        throw new Error('');
      } else {
        reject(new Error('No url or source was specified.'));
      }
    });
  }

  /**
    * Este método establece la clase de la fachada
    * de MBTilesVector.
    *
    * @function
    * @param {Object} Objeto a establecer como fachada.
    * @public
    * @api
    */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
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
    * Este método obtiene la mínima resolución de la capa.
    *
    * @function
    * @public
    * @api
    * @returns {Number} Mínima resolución.
    */
  getMinResolution() {}

  /**
    * Este método obtiene la máxima resolución de la capa.
    *
    * @function
    * @public
    * @api
    * @returns {Number} Máxima resolución.
    */
  getMaxResolution() {}

  /**
    * Este método destruye esta capa, limpiando
    * el HTML y desregistrando todos los eventos.
    *
    * @public
    * @function
    * @api
    */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
  }

  /**
    * Este método comprueba si un objeto es igual
    * a esta capa.
    *
    * @function
    * @param {Object} obj Objeto a comparar.
    * @returns {Boolean} Valor verdadero es igual, falso no lo es.
    * @public
    * @api
    */
  equals(obj) {
    let equals = false;
    if (obj instanceof MBTilesVector) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
    * Este método devuelve todos los objetos geográficos
    * o discriminando por el filtro.
    *
    * @function
    * @public
    * @param {boolean} skipFilter Indica si se obvia el filtro.
    * @param {M.Filter} filter Filtro a ejecutar.
    * @returns {Array<M.Feature>} Todos los objetos geográficos o discriminando
    * por el filtro.
    * @api
    */
  getFeatures(skipFilter, filter) {
    let features = [];
    if (this.ol3Layer) {
      const olSource = this.ol3Layer.getSource();
      const tileCache = olSource.tileCache;
      if (tileCache.getCount() === 0) {
        return features;
      }
      const z = fromKey(tileCache.peekFirstKey())[0];
      tileCache.forEach((tile) => {
        if (tile.tileCoord[0] !== z || tile.getState() !== TileState.LOADED) {
          return;
        }
        const sourceTiles = tile.getSourceTiles();
        for (let i = 0, ii = sourceTiles.length; i < ii; i += 1) {
          const sourceTile = sourceTiles[i];
          const olFeatures = sourceTile.getFeatures();
          if (olFeatures) {
            features = features.concat(olFeatures);
          }
        }
      });
    }
    return features;
  }

  /**
    * Este método comprueba si están todas las teselas
    * vectoriales cargadas.
    *
    * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
    *
    * @function
    * @param {ol.source.Tile.TileSourceEvent} evt Evento.
    * @public
    * @api
    */
  checkAllTilesLoaded_(evt) {
    const { code } = this.map.getProjection();
    const currTileCoord = evt.tile.getTileCoord();
    const olProjection = getProj(code);
    const tileCache = this.ol3Layer.getSource().getTileCacheForProjection(olProjection);
    const tileImages = tileCache.getValues();
    const loaded = tileImages.some((tile) => {
      const tileCoord = tile.getTileCoord();
      const tileState = tile.getState();
      const sameTile = (currTileCoord[0] === tileCoord[0] &&
         currTileCoord[1] === tileCoord[1] &&
         currTileCoord[2] === tileCoord[2]);
      const tileLoaded = sameTile || (tileState !== TileState.LOADING);
      return tileLoaded;
    });
    if (loaded && !this.loaded_) {
      this.loaded_ = true;
      this.facadeLayer_.fire(EventType.LOAD);
    }
  }

  /**
    * Este método devuelve una copia de la capa de esta instancia.
    *
    * @function
    * @returns {ol.layer.Tile} Copia de la capa.
    * @public
    * @api
    */
  cloneOLLayer() {
    let olLayer = null;
    if (this.ol3Layer != null) {
      const properties = this.ol3Layer.getProperties();
      olLayer = new OLLayerTile(properties);
    }
    return olLayer;
  }
}
export default MBTilesVector;
