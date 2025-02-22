/**
 * @module M/impl/style/Generic
 */
import {
  isFunction,
  isUndefined,
  isDynamic,
  drawDynamicStyle,
} from 'M/util/Utils';
import OLFeature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import OLStyleIcon from 'ol/style/Icon';
import OLGeomPolygon from 'ol/geom/Polygon';
import OLGeomLineString from 'ol/geom/LineString';
import { toContext as toContextRender } from 'ol/render';
import OLStyleFontsSymbol from '../ext/OLStyleFontSymbol';
import Simple from './Simple';
import { getLineStyle, getPointStyle, getPolygonStyle } from './builder';

/**
 * Objetos con los tipos de geometrías.
 * @const
 * @type {object}
 */
const GETTER_BY_GEOM = {
  Point: (...args) => getPointStyle(args[0].point, args[1], args[2]),
  LineString: (...args) => getLineStyle(args[0].line, args[1], args[2]),
  Polygon: (...args) => getPolygonStyle(args[0].polygon, args[1], args[2]),
  MultiPoint: (...args) => getPointStyle(args[0].point, args[1], args[2]),
  MultiLineString: (...args) => getLineStyle(args[0].line, args[1], args[2]),
  MultiPolygon: (...args) => getPolygonStyle(args[0].polygon, args[1], args[2]),
};

/**
 * @classdesc
 * Crea un estilo genérico.
 * @api
 */
class Generic extends Simple {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @param {Object} optionsVar Opciones del estilo.
   * - Point. Punto.
   * - Polygon. Polígono.
   * - Line. Linea.
   * @api stable
   */
  constructor(options = {}) {
    super(options);

    /**
     * @private
     * @type {object}
     */
    this.styles_ = {};
  }

  /**
   * Este método devuelve el "canvas" en formato imagen.
   *
   * @function
   * @public
   * @return {String} "Url del Canvas".
   * @api stable
   */
  toImage() {
    const imgSize = 30;
    let loadImagePoint = null;
    let loadImagePoly = null;
    let loadImageLine = null;
    const dinamic = drawDynamicStyle();
    const promises = [];

    // Point image
    if (!isUndefined(this.options_.point)) {
      loadImagePoint = (d) => new Promise((resolve, reject) => {
        const img = new Image();

        // onload / onerror
        img.onload = () => resolve(img);
        img.onerror = reject;

        // img
        img.width = imgSize;
        img.height = imgSize;

        if (isDynamic(this.options_.point) === true) {
          img.src = d;
        } else {
          const getterPoint = GETTER_BY_GEOM.Point;
          const stylesPoint = getterPoint(this.options_, this, this.layer_);
          stylesPoint[0].getImage().setRadius(5);
          const imageURLPoint = stylesPoint[0].getImage().getImage(1).toDataURL();
          img.src = imageURLPoint;
        }
      });
      promises.push(loadImagePoint(dinamic));
    }

    // Polygon image
    if (!isUndefined(this.options_.polygon)) {
      loadImagePoly = (d) => new Promise((resolve, reject) => {
        const img = new Image();

        // onload / onerror
        img.onload = () => resolve(img);
        img.onerror = reject;

        // img

        if (isDynamic(this.options_.polygon) === true) {
          img.src = d;
          img.width = imgSize;
          img.height = imgSize;
        } else {
          const getterPolygon = GETTER_BY_GEOM.Polygon;
          const stylesPolygon = getterPolygon(this.options_, this, this.layer_);
          const canvasPO = document.createElement('canvas');
          canvasPO.width = imgSize;
          canvasPO.height = imgSize;
          const ctxPO = canvasPO.getContext('2d');
          const vectorContextPol = toContextRender(ctxPO);
          vectorContextPol.setStyle(stylesPolygon[0], 0, 0);
          const canvasSize = [25, 15];
          const maxW = Math.floor(canvasSize[0]);
          const maxH = Math.floor(canvasSize[1]);
          const minW = (canvasSize[0] - maxW);
          const minH = (canvasSize[1] - maxH);
          vectorContextPol.drawGeometry(new OLGeomPolygon([
            [
              [minW + 3, minH + 3],
              [maxW - 3, minH + 3],
              [maxW - 3, maxH - 3],
              [minW + 3, maxH - 3],
              [minW + 3, minH + 3],
            ],
          ]));
          img.src = canvasPO.toDataURL();
        }
      });
      promises.push(loadImagePoly(dinamic));
    }

    // Line image
    if (!isUndefined(this.options_.line)) {
      loadImageLine = (d) => new Promise((resolve, reject) => {
        const img = new Image();

        // onload / onerror
        img.onload = () => resolve(img);
        img.onerror = reject;

        // img
        if (isDynamic(this.options_.line) === true) {
          img.src = d;
          img.width = 30;
          img.height = 30;
        } else {
          const getterLine = GETTER_BY_GEOM.LineString;
          const stylesLine = getterLine(this.options_, this, this.layer_);
          const canvasLI = document.createElement('canvas');
          canvasLI.width = 30;
          canvasLI.height = 30;
          const ctxLI = canvasLI.getContext('2d');
          const vectorContextLin = toContextRender(ctxLI);
          vectorContextLin.setStyle(stylesLine[0], 0, 0);
          const x = 25;
          const y = 15;
          const stroke = isUndefined(stylesLine[0].getStroke())
            ? 1.5
            : stylesLine[0].getStroke().getWidth();
          vectorContextLin.drawGeometry(new OLGeomLineString([
            [0 + (stroke / 2), 0 + (stroke / 2)],
            [(x / 3), (y / 2) - (stroke / 2)],
            [(2 * x) / 3, 0 + (stroke / 2)],
            [x - (stroke / 2), (y / 2) - (stroke / 2)],
          ]));
          img.src = canvasLI.toDataURL();
        }
      });
      promises.push(loadImageLine(dinamic));
    }

    // Canvas / Context
    const canvasGL = document.createElement('canvas');
    canvasGL.width = 200;
    canvasGL.height = 50;
    const ctxGL = canvasGL.getContext('2d');

    const positions = [0, 60, 120];
    let cont = 0;

    // Loading images
    return Promise.all(promises).then((values) => {
      values.forEach((image) => {
        ctxGL.drawImage(image, positions[cont], 0);
        cont += 1;
      });
      return canvasGL.toDataURL();
    });
  }

  /**
   * Este método actualiza las opciones de la fachada
   * (patrón estructural como una capa de abstracción con un patrón de diseño).
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @param {object} options Opciones.
   * @return {object} Devuelve los estilos actualizados.
   * @function
   * @api stable
   */
  updateFacadeOptions(options) {
    this.olStyleFn_ = (feature) => {
      const idFeature = JSON.stringify(feature.getProperties());
      let styles = [];
      this.styles_ = [];
      let featureVariable = feature;
      if (!(featureVariable instanceof OLFeature || featureVariable instanceof RenderFeature)) {
        featureVariable = this;
      } else {
        const type = featureVariable.getGeometry().getType();
        const getter = GETTER_BY_GEOM[type];

        if (isFunction(getter)) {
          styles = getter(options, featureVariable, this.layer_);
          this.styles_[idFeature] = styles;
        }
      }
      return styles;
    };
  }

  /**
   * Este método dibuja la geometría en el "canvas".
   *
   * @public
   * @function
   * @param {Object} vectorContext Vector que se dibujará en el "canvas".
   * @api stable
   */
  drawGeometryToCanvas(vectorContext) {}

  /**
   * Este método actualiza el "canvas".
   *
   * @public
   * @function
   * @param {HTMLCanvasElement} canvas Nuevo "canvas".
   * @api stable
   */
  updateCanvas(canvas) {}

  /**
   * Este método devuelve el tamaño del "canvas".
   *
   * @public
   * @function
   * @returns {Array} Tamaño.
   * @api stable
   */
  getCanvasSize() {
    return 0;
  }

  /**
   * Este método devuelve el radio de una imagen.
   *
   * @public
   * @function
   * @param {object} image OLStyleIcon (ol/style/Icon) o OLStyleFontsSymbol (ol/style/RegularShape).
   * @api stable
   */
  getRadius_(image) {
    let r;
    if (image instanceof OLStyleIcon) {
      r = 25;
    } else if (image instanceof OLStyleFontsSymbol) {
      r = image.getRadius();
    } else {
      r = this.olStyleFn_()[0].getImage().getRadius();
    }

    return r;
  }
}

export default Generic;
